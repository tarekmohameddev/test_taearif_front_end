"use client";

import React from "react";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import { LIFECYCLE_STAGES, type CustomerLifecycleStage } from "@/types/unified-customer";
import type { ApiStageShape, StageOption } from "../types/incomingCardTypes";

interface UseStageResolutionArgs {
  action: CustomerAction;
  propStages: ApiStageShape[] | undefined;
  storeStages: ApiStageShape[] | undefined;
  resolvedCustomer: UnifiedCustomer | undefined;
}

export function useStageResolution({
  action,
  propStages,
  storeStages,
  resolvedCustomer,
}: UseStageResolutionArgs) {
  const [actionStageId, setActionStageId] = React.useState<string | number | null>(
    (action as { stage_id?: string | number }).stage_id ?? null
  );
  const [optimisticStage, setOptimisticStage] = React.useState<CustomerLifecycleStage | null>(null);

  const availableStages = React.useMemo((): StageOption[] => {
    const stagesToUse =
      propStages && propStages.length > 0 ? propStages : (storeStages ?? []);
    if (!stagesToUse.length) return [];
    return stagesToUse.map((stage: ApiStageShape) => ({
      id: stage.stage_id,
      numericId: stage.id !== undefined ? stage.id : null,
      nameAr: stage.stage_name_ar,
      nameEn: stage.stage_name_en,
      color: stage.color,
      order: stage.order,
    }));
  }, [propStages, storeStages]);

  const stageSource = React.useMemo(() => {
    const act = action as { stage_id?: string | number; stage?: unknown };
    if (act.stage_id) return act.stage_id;
    if (act.stage && typeof act.stage === "object") {
      const obj = act.stage as { stage_id?: string; id?: number; name?: string };
      return obj.stage_id ?? obj.id ?? obj.name ?? null;
    }
    if (resolvedCustomer?.stage) return resolvedCustomer.stage;
    return null;
  }, [action, actionStageId, resolvedCustomer?.stage]);

  const normalizedStage = React.useMemo((): CustomerLifecycleStage => {
    if (!stageSource) return "new_lead" as CustomerLifecycleStage;
    if (availableStages.length > 0) {
      let validStage: StageOption | undefined;
      if (typeof stageSource === "number") {
        validStage = availableStages.find((s) => s.numericId === stageSource);
      } else {
        const stageId =
          typeof stageSource === "string"
            ? stageSource
            : typeof stageSource === "object" && stageSource !== null
              ? (stageSource as { stage_id?: string; id?: number; name?: string }).stage_id ??
                (stageSource as { stage_id?: string; id?: number; name?: string }).id?.toString() ??
                (stageSource as { stage_id?: string; id?: number; name?: string }).name ??
                String(stageSource)
              : String(stageSource);
        validStage = availableStages.find((s) => s.id === stageId);
      }
      return (validStage ? validStage.id : "new_lead") as CustomerLifecycleStage;
    }
    const stageId =
      typeof stageSource === "string"
        ? stageSource
        : typeof stageSource === "object" && stageSource !== null
          ? (stageSource as { stage_id?: string; id?: number; name?: string }).stage_id ??
            (stageSource as { stage_id?: string; id?: number; name?: string }).id ??
            (stageSource as { stage_id?: string; id?: number; name?: string }).name ??
            String(stageSource)
          : String(stageSource);
    const validStage = LIFECYCLE_STAGES.find((s) => s.id === stageId);
    return (validStage ? validStage.id : "new_lead") as CustomerLifecycleStage;
  }, [stageSource, availableStages]);

  React.useEffect(() => {
    const current = (action as { stage_id?: string | number }).stage_id;
    if (current !== actionStageId) {
      setActionStageId(current ?? null);
      if (optimisticStage && current !== optimisticStage) setOptimisticStage(null);
    }
  }, [action, actionStageId, optimisticStage]);

  const displayStage = React.useMemo(
    () => (optimisticStage || normalizedStage) as CustomerLifecycleStage,
    [optimisticStage, normalizedStage]
  );

  return {
    availableStages,
    normalizedStage,
    displayStage,
    optimisticStage,
    setOptimisticStage,
    actionStageId,
    setActionStageId,
  };
}
