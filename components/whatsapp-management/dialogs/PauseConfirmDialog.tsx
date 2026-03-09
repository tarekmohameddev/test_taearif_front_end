"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>إيقاف مؤقت</DialogTitle>
          <DialogDescription>
            هل تريد إيقاف الحملة «{campaign?.name}» مؤقتاً؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "جاري..." : "إيقاف مؤقت"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
