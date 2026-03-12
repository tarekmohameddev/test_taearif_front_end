import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

import type { RentalExpense } from "@/app/dashboard/rental-management/hooks/useActualExpenses";

interface DeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: RentalExpense | null;
  loading: boolean;
  onConfirm: () => void;
}

export function DeleteExpenseDialog({
  open,
  onOpenChange,
  expense,
  loading,
  onConfirm,
}: DeleteExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            تأكيد حذف المصروف
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-right" dir="rtl">
              <p className="text-gray-900 font-medium mb-2">
                هل أنت متأكد من حذف هذا المصروف؟
              </p>
              <p className="text-sm text-gray-600 mb-3">
                سيتم حذف المصروف:{" "}
                <span className="font-semibold text-gray-900">
                  {expense?.expense_name}
                </span>
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ تحذير: لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="ml-2 h-4 w-4" />
                حذف المصروف
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

