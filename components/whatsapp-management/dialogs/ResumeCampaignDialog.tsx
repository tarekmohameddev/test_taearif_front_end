"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>استئناف الحملة: {campaign?.name}</DialogTitle>
          <DialogDescription>
            متابعة من حيث توقفت، أو إعادة تشغيل بقائمة مستلمين جديدة.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>وضع الاستئناف</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as ResumeMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="continue">متابعة</SelectItem>
                <SelectItem value="restart">إعادة تشغيل (قائمة جديدة)</SelectItem>
              </SelectContent>
            </Select>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "جاري..." : "استئناف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
