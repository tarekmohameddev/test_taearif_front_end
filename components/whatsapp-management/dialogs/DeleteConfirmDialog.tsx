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

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ApiWaCampaign | null;
  loading: boolean;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  campaign,
  loading,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogHeader>
          <CustomDialogTitle>حذف الحملة</CustomDialogTitle>
          <CustomDialogDescription>
            هل تريد حذف الحملة «{campaign?.name}»؟ لا يمكن التراجع.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter dir="rtl">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "جاري..." : "حذف"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
