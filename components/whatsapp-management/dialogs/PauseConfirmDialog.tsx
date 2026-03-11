"use client";

import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/customComponents/CustomDialog";
import type { ApiWaCampaign } from "../types";

export interface PauseConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ApiWaCampaign | null;
  loading: boolean;
  onConfirm: () => void;
}

export function PauseConfirmDialog({
  open,
  onOpenChange,
  campaign,
  loading,
  onConfirm,
}: PauseConfirmDialogProps) {
  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogHeader>
          <CustomDialogTitle>إيقاف مؤقت</CustomDialogTitle>
          <CustomDialogDescription>
            هل تريد إيقاف الحملة «{campaign?.name}» مؤقتاً؟
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter dir="rtl">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "جاري..." : "إيقاف مؤقت"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
