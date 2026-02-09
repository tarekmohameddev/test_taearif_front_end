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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Loader2,
  AlertCircle,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Owner, EditFormData, PasswordData } from "../types/owners.types";

interface EditOwnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  editFormData: EditFormData;
  passwordData: PasswordData;
  onFormChange: (field: string, value: any) => void;
  onPasswordChange: (field: string, value: string) => void;
  onUpdate: () => void;
  onChangePassword: () => void;
  updating: boolean;
  error: string | null;
}

export function EditOwnerDialog({
  isOpen,
  onClose,
  owner,
  editFormData,
  passwordData,
  onFormChange,
  onPasswordChange,
  onUpdate,
  onChangePassword,
  updating,
  error,
}: EditOwnerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Edit className="h-6 w-6" />
            تعديل بيانات المالك
          </DialogTitle>
          <DialogDescription>
            {owner && (
              <span>
                تعديل بيانات <strong>{owner.name}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">معلومات المالك</TabsTrigger>
            <TabsTrigger value="password">تغيير كلمة المرور</TabsTrigger>
          </TabsList>

          {/* Owner Info Tab */}
          <TabsContent value="info" className="space-y-4 mt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">الاسم *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  placeholder="أدخل اسم المالك"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => onFormChange("email", e.target.value)}
                  placeholder="example@email.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="edit-phone">رقم الهاتف *</Label>
                <Input
                  id="edit-phone"
                  value={editFormData.phone}
                  onChange={(e) => onFormChange("phone", e.target.value)}
                  placeholder="05XXXXXXXX"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="edit-city">المدينة</Label>
                <Input
                  id="edit-city"
                  value={editFormData.city}
                  onChange={(e) => onFormChange("city", e.target.value)}
                  placeholder="أدخل المدينة"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>حالة الحساب</Label>
                <p className="text-sm text-muted-foreground">
                  {editFormData.is_active ? "الحساب نشط" : "الحساب غير نشط"}
                </p>
              </div>
              <Switch
                checked={editFormData.is_active}
                onCheckedChange={(checked) => onFormChange("is_active", checked)}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button onClick={onClose} variant="outline" disabled={updating}>
                إلغاء
              </Button>
              <Button onClick={onUpdate} disabled={updating} className="gap-2">
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-4 mt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">تعليمات كلمة المرور:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>يجب أن تكون 8 أحرف على الأقل</li>
                  <li>يُنصح باستخدام مزيج من الأحرف والأرقام</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => onPasswordChange("password", e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    onPasswordChange("confirmPassword", e.target.value)
                  }
                  placeholder="أعد إدخال كلمة المرور"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button onClick={onClose} variant="outline" disabled={updating}>
                إلغاء
              </Button>
              <Button
                onClick={onChangePassword}
                disabled={updating}
                className="gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التغيير...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    تغيير كلمة المرور
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
