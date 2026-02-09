"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2, AlertCircle, Lock } from "lucide-react";
import { CreateFormData } from "../types/owners.types";

interface CreateOwnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateFormData;
  onFormChange: (field: string, value: any) => void;
  onCreate: () => void;
  creating: boolean;
  error: string | null;
}

export function CreateOwnerDialog({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onCreate,
  creating,
  error,
}: CreateOwnerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Plus className="h-6 w-6" />
            إضافة مالك جديد
          </DialogTitle>
          <DialogDescription>أدخل معلومات المالك الجديد</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="create-name">الاسم *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => onFormChange("name", e.target.value)}
                placeholder="أدخل اسم المالك"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="create-email">البريد الإلكتروني *</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange("email", e.target.value)}
                placeholder="example@email.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="create-phone">رقم الهاتف *</Label>
              <Input
                id="create-phone"
                value={formData.phone}
                onChange={(e) => onFormChange("phone", e.target.value)}
                placeholder="05XXXXXXXX"
              />
            </div>

            {/* ID Number */}
            <div className="space-y-2">
              <Label htmlFor="create-id-number">رقم الهوية</Label>
              <Input
                id="create-id-number"
                value={formData.id_number}
                onChange={(e) => onFormChange("id_number", e.target.value)}
                placeholder="رقم الهوية الوطنية"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="create-password">كلمة المرور *</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => onFormChange("password", e.target.value)}
                placeholder="أدخل كلمة المرور"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="create-confirm-password">
                تأكيد كلمة المرور *
              </Label>
              <Input
                id="create-confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  onFormChange("confirmPassword", e.target.value)
                }
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="create-city">المدينة</Label>
              <Input
                id="create-city"
                value={formData.city}
                onChange={(e) => onFormChange("city", e.target.value)}
                placeholder="أدخل المدينة"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="create-address">العنوان</Label>
              <Input
                id="create-address"
                value={formData.address}
                onChange={(e) => onFormChange("address", e.target.value)}
                placeholder="أدخل العنوان الكامل"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>حالة الحساب</Label>
              <p className="text-sm text-muted-foreground">
                {formData.is_active ? "الحساب نشط" : "الحساب غير نشط"}
              </p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => onFormChange("is_active", checked)}
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">متطلبات كلمة المرور:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>يجب أن تكون 8 أحرف على الأقل</li>
                <li>يُنصح باستخدام مزيج من الأحرف والأرقام</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={onClose} variant="outline" disabled={creating}>
            إلغاء
          </Button>
          <Button onClick={onCreate} disabled={creating} className="gap-2">
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                إنشاء المالك
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
