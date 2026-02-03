"use client";

import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RentalData } from "../types/types";
import { formatCurrency } from "../utils/helpers";

interface DeleteRentalDialogProps {
  isOpen: boolean;
  deletingRental: RentalData | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRentalDialog({
  isOpen,
  deletingRental,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteRentalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px]"
        style={{
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            تأكيد حذف الإيجار
          </DialogTitle>
          <DialogDescription className="text-red-700">
            ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!
          </DialogDescription>
        </DialogHeader>

        {deletingRental && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium mb-2">
                هل أنت متأكد من حذف الإيجار التالي؟
              </p>
              <div className="space-y-2 text-sm text-red-700">
                <p>
                  <strong>المستأجر:</strong> {deletingRental.tenant_full_name}
                </p>
                <p>
                  <strong>الوحدة:</strong> {deletingRental.unit_label}
                </p>
                <p>
                  <strong>مبلغ الإيجار:</strong>{" "}
                  {formatCurrency(
                    deletingRental.base_rent_amount,
                    deletingRental.currency,
                  )}
                </p>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>تحذير:</strong> سيتم حذف جميع البيانات المرتبطة بهذا
                الإيجار نهائياً ولا يمكن استردادها.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-gray-900 hover:bg-gray-800"
          >
            {isDeleting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="ml-2 h-4 w-4" />
                حذف نهائي
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
