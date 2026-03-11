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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CustomersCheckboxesDropdown } from "@/components/customComponents/CustomersCheckboxesDropdown";
import { sendWaCampaign, getWhatsAppApiErrorMessage, getWhatsAppApiErrorCode } from "@/lib/services/whatsapp-api";
import type { ApiWaCampaign } from "../types";
import { parseManualPhones } from "../utils";
import { useCustomersList } from "../hooks/useCustomersList";

export interface SendCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ApiWaCampaign | null;
  onSuccess: () => void;
}

export function SendCampaignDialog({
  open,
  onOpenChange,
  campaign,
  onSuccess,
}: SendCampaignDialogProps) {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [manualPhonesRaw, setManualPhonesRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const customersList = useCustomersList();

  useEffect(() => {
    if (!open) return;
    customersList.loadInitial();
    setSelectedCustomerIds([]);
    setManualPhonesRaw("");
    setError("");
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- only when dialog opens

  const handleSubmit = async () => {
    if (!campaign) return;
    const manualPhones = parseManualPhones(manualPhonesRaw);
    if (selectedCustomerIds.length === 0 && manualPhones.length === 0) {
      setError("اختر عملاءً أو أدخل أرقاماً يدوياً.");
      return;
    }
    const body = {} as { customer_ids?: number[]; manual_phones?: string[] };
    if (selectedCustomerIds.length > 0) body.customer_ids = selectedCustomerIds;
    if (manualPhones.length > 0) body.manual_phones = manualPhones;
    setSubmitting(true);
    setError("");
    const idempotencyKey = crypto.randomUUID();
    try {
      const data = await sendWaCampaign(campaign.id, body, idempotencyKey);
      toast.success(
        `تم بدء الإرسال إلى ${data.recipient_count} مستلم. المرجع: ${data.dispatch_reference ?? "-"}`
      );
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      const code = getWhatsAppApiErrorCode(e);
      const msg = getWhatsAppApiErrorMessage(e);
      setError(code ? `[${code}] ${msg}` : msg);
      if (code === "INSUFFICIENT_CREDITS") {
        toast.error("رصيد غير كافٍ. يرجى شراء كريديت.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <CustomDialogContent className="sm:max-w-lg">
        <CustomDialogHeader>
          <CustomDialogTitle>إرسال الحملة: {campaign?.name}</CustomDialogTitle>
          <CustomDialogDescription>
            اختر العملاء و/أو أدخل أرقاماً يدوية (8–16 رقم). مطلوب واحد على الأقل.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6" dir="rtl">
          <div>
            <Label>العملاء</Label>
            <CustomersCheckboxesDropdown
              customers={customersList.customers}
              selectedCustomerIds={selectedCustomerIds}
              onSelectionChange={setSelectedCustomerIds}
              isLoading={customersList.loading}
              hasMore={customersList.hasMore}
              onLoadMore={customersList.loadMore}
              loadMoreLoading={customersList.loadMoreLoading}
            />
          </div>
          <div>
            <Label>أرقام يدوية (سطر أو فاصلة بين كل رقم)</Label>
            <Textarea
              value={manualPhonesRaw}
              onChange={(e) => setManualPhonesRaw(e.target.value)}
              placeholder="+966501234567 أو 966501234567"
              rows={3}
            />
          </div>
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
            {submitting ? "جاري الإرسال..." : "إرسال"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
