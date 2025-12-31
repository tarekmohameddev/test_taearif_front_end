"use client";

import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogTrigger,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users, CheckCircle, XCircle, Loader2 } from "lucide-react";
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

interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateEmployeeRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateEmployeeRequest>>;
  selectedPermissions: { [key: string]: boolean };
  handlePermissionChange: (permissionName: string, checked: boolean) => void;
  handleGroupPermissionChange: (groupName: string, checked: boolean) => void;
  isGroupFullySelected: (groupName: string) => boolean;
  isGroupPartiallySelected: (groupName: string) => boolean;
  permissions: PermissionsResponse | null;
  permissionsLoading: boolean;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  onCreateEmployee: () => void;
}

export function CreateEmployeeDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  selectedPermissions,
  handlePermissionChange,
  handleGroupPermissionChange,
  isGroupFullySelected,
  isGroupPartiallySelected,
  permissions,
  permissionsLoading,
  createLoading,
  createError,
  createSuccess,
  onCreateEmployee,
}: CreateEmployeeDialogProps) {
  return (
    <>
      <CustomDialogTrigger asChild>
        <Button
          className="bg-black hover:bg-gray-800 text-white"
          onClick={() => onOpenChange(true)}
        >
          <UserPlus className="h-4 w-4 ml-2" />
          إضافة موظف جديد
        </Button>
      </CustomDialogTrigger>
      <CustomDialog
        open={open}
        onOpenChange={onOpenChange}
        maxWidth="max-w-4xl"
        className="mx-2 sm:mx-0"
      >
        <CustomDialogContent className="overflow-hidden bg-white">
          <CustomDialogClose onClose={() => onOpenChange(false)} />
          <CustomDialogHeader className="border-b border-gray-200 pb-4 px-6 pt-6">
            <CustomDialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-black">
              <div className="p-1.5 sm:p-2 bg-black rounded-lg">
                <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-sm sm:text-base">إضافة موظف جديد</span>
            </CustomDialogTitle>
            <CustomDialogDescription className="text-gray-600 text-sm sm:text-base text-right mt-2">
              قم بإنشاء حساب جديد للموظف وتخصيص الصلاحيات المناسبة
            </CustomDialogDescription>
          </CustomDialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[70vh] pr-2 sm:pr-4 px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 py-3 sm:py-4 md:py-6">
              {/* Success Message */}
              {createSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    تم إنشاء الموظف بنجاح!
                  </span>
                </div>
              )}

              {/* Error Message */}
              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    {createError}
                  </span>
                </div>
              )}

              {/* Basic Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
                  <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">
                    المعلومات الأساسية
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      الاسم الأول *
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      placeholder="أدخل الاسم الأول"
                      className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      الاسم الأخير *
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      placeholder="أدخل الاسم الأخير"
                      className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="example@company.com"
                      className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+966501234567"
                      className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      كلمة المرور *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="كلمة مرور قوية"
                      className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="active"
                      className="text-sm font-medium text-gray-700"
                    >
                      حالة الحساب
                    </Label>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-300 rounded-lg">
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            active: checked,
                          }))
                        }
                        className="data-[state=checked]:bg-black"
                      />
                      <span className="text-xs sm:text-sm text-gray-600">
                        {formData.active ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label
                      htmlFor="permissions"
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
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
              >
                إلغاء
              </Button>
              <Button
                onClick={onCreateEmployee}
                disabled={
                  createLoading ||
                  !formData.first_name ||
                  !formData.last_name ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.password
                }
                className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-400 text-sm sm:text-base w-full sm:w-auto"
              >
                {createLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 animate-spin" />
                    <span className="text-xs sm:text-sm">جاري الإنشاء...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                    <span className="text-xs sm:text-sm">إنشاء الموظف</span>
                  </>
                )}
              </Button>
            </div>
          </ScrollArea>
        </CustomDialogContent>
      </CustomDialog>
    </>
  );
}
