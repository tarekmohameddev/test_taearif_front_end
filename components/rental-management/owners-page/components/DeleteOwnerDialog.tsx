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
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Owner } from "../types/owners.types";

interface DeleteOwnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  onDelete: () => void;
  deleting: boolean;
}

export function DeleteOwnerDialog({
  isOpen,
  onClose,
  owner,
  onDelete,
  deleting,
}: DeleteOwnerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            تأكيد الحذف
          </DialogTitle>
          <DialogDescription>
            هذا الإجراء لا يمكن التراجع عنه
          </DialogDescription>
        </DialogHeader>

        {owner && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-900 mb-2">هل أنت متأكد من حذف المالك:</p>
              <p className="font-bold text-lg text-gray-900">{owner.name}</p>
              <p className="text-sm text-gray-600 mt-2">
                البريد: {owner.email}
              </p>
              <p className="text-sm text-gray-600">الهاتف: {owner.phone}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">تنبيه:</p>
                <p>
                  سيتم حذف جميع البيانات المرتبطة بهذا المالك بشكل نهائي
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={onClose} variant="outline" disabled={deleting}>
            إلغاء
          </Button>
          <Button
            onClick={onDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                تأكيد الحذف
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
