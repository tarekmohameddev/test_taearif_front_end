"use client";

import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Users, CheckCircle, XCircle, Loader2, Save } from "lucide-react";
import { PermissionsDropdown } from "./PermissionsDropdown";

// Types
interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  guard_name: string;
  team_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface PermissionsResponse {
  status: string;
  data: Permission[];
  grouped: {
    [key: string]: Permission[];
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface UpdateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editFormData: UpdateEmployeeRequest;
  setEditFormData: React.Dispatch<React.SetStateAction<UpdateEmployeeRequest>>;
  selectedPermissions: { [key: string]: boolean };
  handlePermissionChange: (permissionName: string, checked: boolean) => void;
  handleGroupPermissionChange: (groupName: string, checked: boolean) => void;
  isGroupFullySelected: (groupName: string) => boolean;
  isGroupPartiallySelected: (groupName: string) => boolean;
  permissions: PermissionsResponse | null;
  permissionsLoading: boolean;
  editLoading: boolean;
  editError: string | null;
  editSuccess: boolean;
  onUpdateEmployee: () => void;
}

export function EditEmployeeDialog({
  open,
  onOpenChange,
  editFormData,
  setEditFormData,
  selectedPermissions,
  handlePermissionChange,
  handleGroupPermissionChange,
  isGroupFullySelected,
  isGroupPartiallySelected,
  permissions,
  permissionsLoading,
  editLoading,
  editError,
  editSuccess,
  onUpdateEmployee,
}: EditEmployeeDialogProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="max-w-4xl"
      className="mx-2 sm:mx-0"
    >
      <CustomDialogContent className="overflow-hidden bg-white">
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader className="border-b border-gray-200 pb-4 px-6 pt-6">
          <CustomDialogTitle className="flex items-center gap-3 text-2xl font-bold text-black">
            <div className="p-2 bg-black rounded-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            تعديل بيانات الموظف
          </CustomDialogTitle>
          <CustomDialogDescription className="text-gray-600 text-base mt-2">
            قم بتعديل معلومات الموظف والصلاحيات المخصصة له
          </CustomDialogDescription>
        </CustomDialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[70vh] pr-2 sm:pr-4 px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6 md:space-y-8 py-3 sm:py-4 md:py-6">
            {/* Success Message */}
            {editSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  تم تحديث الموظف بنجاح!
                </span>
              </div>
            )}

            {/* Error Message */}
            {editError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">{editError}</span>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-black">
                  المعلومات الأساسية
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit_first_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    الاسم الأول *
                  </Label>
                  <Input
                    id="edit_first_name"
                    value={editFormData.first_name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="أدخل الاسم الأول"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_last_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    الاسم الأخير *
                  </Label>
                  <Input
                    id="edit_last_name"
                    value={editFormData.last_name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="أدخل الاسم الأخير"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_email"
                    className="text-sm font-medium text-gray-700"
                  >
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="example@company.com"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="edit_phone"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+966501234567"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_password"
                    className="text-sm font-medium text-gray-700"
                  >
                    كلمة المرور الجديدة (اختياري)
                  </Label>
                  <Input
                    id="edit_password"
                    type="password"
                    value={editFormData.password || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_active"
                    className="text-sm font-medium text-gray-700"
                  >
                    حالة الحساب
                  </Label>
                  <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                    <Switch
                      id="edit_active"
                      checked={editFormData.active}
                      onCheckedChange={(checked) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          active: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-black"
                    />
                    <span className="text-sm text-gray-600">
                      {editFormData.active ? "نشط" : "غير نشط"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="edit_permissions"
                    className="text-sm font-medium text-gray-700"
                  >
                    الصلاحيات
                  </Label>
                  <PermissionsDropdown
                    permissions={permissions}
                    selectedPermissions={selectedPermissions}
                    handlePermissionChange={handlePermissionChange}
                    handleGroupPermissionChange={handleGroupPermissionChange}
                    isLoading={permissionsLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 px-4 sm:px-6 pb-3 sm:pb-4 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </Button>
            <Button
              onClick={onUpdateEmployee}
              disabled={
                editLoading ||
                !editFormData.first_name ||
                !editFormData.last_name ||
                !editFormData.email ||
                !editFormData.phone
              }
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
            >
              {editLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </ScrollArea>
      </CustomDialogContent>
    </CustomDialog>
  );
}
