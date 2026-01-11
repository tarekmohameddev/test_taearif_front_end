"use client";

import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pixel } from "./pixel-helpers";

interface DeletePixelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixel: Pixel | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeletePixelDialog({
  open,
  onOpenChange,
  pixel,
  onConfirm,
  loading = false,
}: DeletePixelDialogProps) {
  if (!pixel) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            تأكيد الحذف
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            <div className="space-y-3">
              <p className="font-semibold text-lg">
                هل أنت متأكد من حذف هذا Pixel؟
              </p>
              <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <p className="text-sm">
                  <span className="font-medium">المنصة:</span> {pixel.platform}
                </p>
                <p className="text-sm">
                  <span className="font-medium">معرف Pixel:</span>{" "}
                  {pixel.pixel_id}
                </p>
              </div>
              <p className="text-destructive font-medium">
                ⚠️ هذا الإجراء لا يمكن التراجع عنه. سيتم حذف Pixel نهائياً من
                النظام.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? "جاري الحذف..." : "نعم، احذف Pixel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
