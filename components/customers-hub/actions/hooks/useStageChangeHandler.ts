"use client";

import { useState, useCallback } from "react";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { CustomerLifecycleStage } from "@/types/unified-customer";
import type { StageOption } from "../types/incomingCardTypes";
import type { ApiStageShape } from "../types/incomingCardTypes";
import { updateCustomerStage as apiUpdateCustomerStage } from "@/lib/services/customers-hub-requests-api";
import toast from "react-hot-toast";

function resolveRequestId(action: CustomerAction): number {
  if (
    action.sourceId !== undefined &&
    action.sourceId !== null &&
    action.sourceId !== ""
  ) {
    const n = typeof action.sourceId === "string" ? parseInt(action.sourceId) : Number(action.sourceId);
    if (!isNaN(n) && n > 0) return n;
  }
  if (action.metadata) {
    const id =
      (action.metadata.requestId as number | string) ??
      (action.metadata.propertyRequestId as number | string) ??
      (action.metadata.request_id as number | string);
    if (id) {
      const n = typeof id === "string" ? parseInt(id) : Number(id);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  if (action.id) {
    const s = String(action.id);
    const direct = parseInt(s);
    if (!isNaN(direct) && direct > 0) return direct;
    const match = s.match(/\d+/);
    if (match) {
      const n = parseInt(match[0]);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  throw new Error(
    `Request ID missing. action.id: ${action.id}, sourceId: ${action.sourceId}, metadata: ${JSON.stringify(action.metadata)}`
  );
}

function getStageNumericId(
  newStage: string,
  availableStages: StageOption[],
  storeStages: ApiStageShape[] | undefined
): number {
  const selected = availableStages.find((s) => s.id === newStage);
  if (!selected) throw new Error(`Stage not found: ${newStage}`);
  let numericId = selected.numericId;
  if (numericId == null && storeStages?.length) {
    const store = storeStages.find((s) => s.stage_id === newStage);
    if (store?.id != null) numericId = store.id;
  }
  if (numericId == null) throw new Error(`Numeric ID not found for stage: ${newStage}`);
  return typeof numericId === "number" ? numericId : parseInt(String(numericId));
}

interface UseStageChangeHandlerArgs {
  action: CustomerAction;
  resolvedCustomer: UnifiedCustomer | undefined;
  availableStages: StageOption[];
  storeStages: ApiStageShape[] | undefined;
  normalizedStage: CustomerLifecycleStage;
  updateCustomerStage: (customerId: string, stage: CustomerLifecycleStage) => void;
  setOptimisticStage: (s: CustomerLifecycleStage | null) => void;
  setActionStageId: (s: string | number | null) => void;
}

export function useStageChangeHandler({
  action,
  resolvedCustomer,
  availableStages,
  storeStages,
  normalizedStage,
  updateCustomerStage,
  setOptimisticStage,
  setActionStageId,
}: UseStageChangeHandlerArgs) {
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  const handleStageChange = useCallback(
    async (newStage: CustomerLifecycleStage) => {
      if (isUpdatingStage) return;
      const current = normalizedStage || resolvedCustomer?.stage;
      if (current === newStage) return;
      const previous = current;
      setOptimisticStage(newStage);
      if (resolvedCustomer && action.customerId) {
        updateCustomerStage(String(action.customerId), newStage);
      }
      setIsUpdatingStage(true);
      try {
        const requestIdNum = resolveRequestId(action);
        if (isNaN(requestIdNum) || requestIdNum <= 0) {
          throw new Error(`Invalid request ID: ${requestIdNum}`);
        }
        const newStageIdNum = getStageNumericId(newStage, availableStages, storeStages);
        const isInquiry = action.objectType === "inquiry" || action.source === "inquiry";
        const inquiryId =
          isInquiry &&
          (action.metadata?.inquiryId != null
            ? typeof action.metadata.inquiryId === "number"
              ? action.metadata.inquiryId
              : parseInt(String(action.metadata.inquiryId))
            : requestIdNum);

        await apiUpdateCustomerStage(
          isInquiry ? undefined : requestIdNum,
          newStageIdNum,
          undefined,
          isInquiry ? inquiryId : undefined
        );

        (action as { stage_id?: string }).stage_id = newStage;
        const actStage = (action as { stage?: { stage_id?: string; id?: number } }).stage;
        if (actStage && typeof actStage === "object") {
          actStage.stage_id = newStage;
          actStage.id = newStageIdNum;
        }
        if (resolvedCustomer) (resolvedCustomer as { stage?: string }).stage = newStage;
        setActionStageId(newStage);
        toast.success("تم تحديث المرحلة بنجاح");
        setOptimisticStage(null);
      } catch (err: unknown) {
        setOptimisticStage(null);
        if (resolvedCustomer && previous && action.customerId) {
          updateCustomerStage(String(action.customerId), previous as CustomerLifecycleStage);
        }
        console.error("Error updating customer stage:", err);
        const message =
          (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
            ?.message ??
          (err as { message?: string })?.message ??
          "حدث خطأ أثناء تغيير المرحلة";
        toast.error(message);
      } finally {
        setIsUpdatingStage(false);
      }
    },
    [
      isUpdatingStage,
      normalizedStage,
      resolvedCustomer,
      action,
      availableStages,
      storeStages,
      updateCustomerStage,
      setOptimisticStage,
      setActionStageId,
    ]
  );

  return { handleStageChange, isUpdatingStage };
}
