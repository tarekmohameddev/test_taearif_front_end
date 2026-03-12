import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface ExpenseFormState {
  expense_name: string;
  amount_type: "fixed" | "percentage";
  amount_value: string;
  cost_center: "tenant" | "owner";
  is_active: boolean;
  image: File | null;
  image_path: string;
}

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: ExpenseFormState;
  onFormChange: (updater: (prev: ExpenseFormState) => ExpenseFormState) => void;
  loading: boolean;
  onSubmit: () => void;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  formState,
  onFormChange,
  loading,
  onSubmit,
}: AddExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة مصروف جديد</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense_name">
              اسم المصروف <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expense_name"
              value={formState.expense_name}
              onChange={(e) =>
                onFormChange((prev) => ({
                  ...prev,
                  expense_name: e.target.value,
                }))
              }
              placeholder="مثال: تكييف الهواء"
              className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount_type">
              نوع المبلغ <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formState.amount_type}
              onValueChange={(value) =>
                onFormChange((prev) => ({
                  ...prev,
                  amount_type: value as ExpenseFormState["amount_type"],
                }))
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">ثابت</SelectItem>
                <SelectItem value="percentage">نسبة مئوية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount_value">
              قيمة المبلغ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount_value"
              type="number"
              step="0.01"
              value={formState.amount_value}
              onChange={(e) =>
                onFormChange((prev) => ({
                  ...prev,
                  amount_value: e.target.value,
                }))
              }
              placeholder={formState.amount_type === "fixed" ? "150.00" : "5.0"}
              className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
            <p className="text-xs text-gray-500">
              {formState.amount_type === "fixed"
                ? "أدخل المبلغ بالريال"
                : "أدخل النسبة المئوية (مثال: 5.0 لـ 5%)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_center">
              مركز التكلفة <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formState.cost_center}
              onValueChange={(value) =>
                onFormChange((prev) => ({
                  ...prev,
                  cost_center: value as ExpenseFormState["cost_center"],
                }))
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">المستأجر</SelectItem>
                <SelectItem value="owner">المالك</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_image">صورة المصروف</Label>
            <Input
              id="expense_image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onFormChange((prev) => ({
                  ...prev,
                  image: file,
                }));
              }}
              className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
            <p className="text-xs text-gray-500">
              اختر صورة للمصروف (اختياري)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">نشط</Label>
            <Switch
              id="is_active"
              checked={formState.is_active}
              onCheckedChange={(checked) =>
                onFormChange((prev) => ({
                  ...prev,
                  is_active: checked,
                }))
              }
            />
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
            onClick={onSubmit}
            disabled={
              loading ||
              !formState.expense_name ||
              !formState.amount_value
            }
            className="bg-black hover:scale-105 transition-all duration-300 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              "إضافة المصروف"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

