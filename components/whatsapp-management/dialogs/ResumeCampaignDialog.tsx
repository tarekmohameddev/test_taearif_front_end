"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/customComponents/CustomDialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CustomersCheckboxesDropdown } from "@/components/customComponents/CustomersCheckboxesDropdown";
import { resumeWaCampaign, getWhatsAppApiErrorMessage } from "@/lib/services/whatsapp-api";
import type { ApiWaCampaign } from "../types";
import { parseManualPhones } from "../utils";
import { useCustomersList } from "../hooks/useCustomersList";

export type ResumeMode = "continue" | "restart";

export interface ResumeCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ApiWaCampaign | null;
  onSuccess: () => void;
}

export function ResumeCampaignDialog({
  open,
  onOpenChange,
  campaign,
  onSuccess,
}: ResumeCampaignDialogProps) {
  const [mode, setMode] = useState<ResumeMode>("continue");
  const [customerIds, setCustomerIds] = useState<number[]>([]);
  const [manualPhonesRaw, setManualPhonesRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const customersList = useCustomersList();

  useEffect(() => {
    if (!open || mode !== "restart") return;
    customersList.loadInitial();
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps -- load when dialog opens in restart mode

  useEffect(() => {
    if (!open) {
      setMode("continue");
      setCustomerIds([]);
      setManualPhonesRaw("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!campaign) return;
    const body = { mode } as { mode: ResumeMode; customer_ids?: number[]; manual_phones?: string[] };
    if (mode === "restart") {
      const manualPhones = parseManualPhones(manualPhonesRaw);
      if (customerIds.length === 0 && manualPhones.length === 0) {
        setError("في وضع إعادة التشغيل، اختر عملاءً أو أرقاماً يدوية.");
        return;
      }
      if (customerIds.length > 0) body.customer_ids = customerIds;
      if (manualPhones.length > 0) body.manual_phones = manualPhones;
    }
    setSubmitting(true);
    setError("");
    const idempotencyKey = crypto.randomUUID();
    try {
      await resumeWaCampaign(campaign.id, body, idempotencyKey);
      toast.success("تم استئناف الحملة");
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      setError(getWhatsAppApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <CustomDialogContent className="sm:max-w-lg">
        <CustomDialogHeader>
          <CustomDialogTitle>استئناف الحملة: {campaign?.name}</CustomDialogTitle>
          <CustomDialogDescription>
            متابعة من حيث توقفت، أو إعادة تشغيل بقائمة مستلمين جديدة.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6" dir="rtl">
          <div>
            <Label>وضع الاستئناف</Label>
            <CustomDropdown
              trigger={
                <span>
                  {mode === "continue"
                    ? "متابعة"
                    : "إعادة تشغيل (قائمة جديدة)"}
                </span>
              }
              fullWidth
            >
              <DropdownItem onClick={() => setMode("continue")}>
                متابعة
              </DropdownItem>
              <DropdownItem onClick={() => setMode("restart")}>
                إعادة تشغيل (قائمة جديدة)
              </DropdownItem>
            </CustomDropdown>
          </div>
          {mode === "restart" && (
            <>
              <div>
                <Label>العملاء</Label>
                <CustomersCheckboxesDropdown
                  customers={customersList.customers}
                  selectedCustomerIds={customerIds}
                  onSelectionChange={setCustomerIds}
                  isLoading={customersList.loading}
                  hasMore={customersList.hasMore}
                  onLoadMore={customersList.loadMore}
                  loadMoreLoading={customersList.loadMoreLoading}
                />
              </div>
              <div>
                <Label>أرقام يدوية</Label>
                <Textarea
                  value={manualPhonesRaw}
                  onChange={(e) => setManualPhonesRaw(e.target.value)}
                  placeholder="أرقام إضافية"
                  rows={2}
                />
              </div>
            </>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "جاري..." : "استئناف"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
