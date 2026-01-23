"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Edit,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Save,
} from "lucide-react";
import { PermissionsDropdown } from "@/components/access-control/PermissionsDropdown";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

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

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: number;
  permissions: Permission[];
  roles: any[];
}

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const { userData } = useAuthStore();
  const employeeId = params?.id ? parseInt(params.id as string) : null;

  const [editFormData, setEditFormData] = useState<UpdateEmployeeRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    active: true,
    role_ids: [],
    permissions: [],
  });
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [permissions, setPermissions] = useState<PermissionsResponse | null>(
    null,
  );
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Fetch employee data
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      setEmployeeLoading(true);
      try {
        const response = await axiosInstance.get<{ data: Employee }>(
          `/v1/employees/${employeeId}`,
        );
        const employee = response.data.data;

        setEditFormData({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          password: "",
          active: employee.status === 1,
          role_ids: employee.roles.map((role) => role.id),
          permissions: employee.permissions.map((perm) => perm.name),
        });

        // Set selected permissions
        const permissionsMap: { [key: string]: boolean } = {};
        employee.permissions.forEach((perm) => {
          permissionsMap[perm.name] = true;
        });
        setSelectedPermissions(permissionsMap);
      } catch (err: any) {
        console.error("Error fetching employee:", err);
        setEditError(
          err.response?.data?.message || "حدث خطأ في جلب بيانات الموظف",
        );
      } finally {
        setEmployeeLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Fetch permissions
  useEffect(() => {
    // التحقق من وجود token قبل إرسال الطلب
    if (!userData?.token) {
      return;
    }

    const fetchPermissions = async () => {
      setPermissionsLoading(true);
      try {
        const response =
          await axiosInstance.get<PermissionsResponse>("/v1/permissions");
        setPermissions(response.data);
      } catch (err: any) {
        console.error("Error fetching permissions:", err);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, [userData?.token]);

  // Handle permission change
  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Handle group permission change
  const handleGroupPermissionChange = (groupName: string, checked: boolean) => {
    if (!permissions || !permissions.grouped[groupName]) return;

    const groupPermissions = permissions.grouped[groupName];
    const newSelectedPermissions = { ...selectedPermissions };

    groupPermissions.forEach((permission) => {
      newSelectedPermissions[permission.name] = checked;
    });

    setSelectedPermissions(newSelectedPermissions);
  };

  // Update employee
  const updateEmployee = async () => {
    if (!employeeId) return;

    setEditLoading(true);
    setEditError(null);

    try {
      // Convert selected permissions to array
      const selectedPermissionsArray = Object.entries(selectedPermissions)
        .filter(([_, selected]) => selected)
        .map(([permissionName, _]) => permissionName);

      const requestData = {
        ...editFormData,
        permissions: selectedPermissionsArray,
        role_ids: [],
      };

      // Remove password if empty
      if (!requestData.password) {
        delete requestData.password;
      }

      await axiosInstance.put(`/v1/employees/${employeeId}`, requestData);

      setEditSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/access-control");
      }, 2000);
    } catch (err: any) {
      console.error("Error updating employee:", err);
      setEditError(err.response?.data?.message || "حدث خطأ في تحديث الموظف");
    } finally {
      setEditLoading(false);
    }
  };

  if (employeeLoading) {
    return (
      <div className="flex min-h-screen flex-col h-screen bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
              <span className="text-sm text-gray-600 font-medium">
                جاري تحميل بيانات الموظف...
              </span>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col h-screen bg-gray-50">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="p-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-black rounded-lg">
                    <Edit className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                    تعديل بيانات الموظف
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base text-right mt-2 pr-10 sm:pr-12">
                قم بتعديل معلومات الموظف والصلاحيات المخصصة له
              </p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)] sm:h-auto">
              {/* Scrollable Content - Mobile Only */}
              <div className="overflow-y-auto flex-1 sm:overflow-visible">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Success Message */}
                  {editSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        تم تحديث الموظف بنجاح! جاري إعادة التوجيه...
                      </span>
                    </div>
                  )}

                  {/* Error Message */}
                  {editError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 font-medium">
                        {editError}
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
                          className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
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
                          className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
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
                          className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
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
                          className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
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
                          className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="edit_active"
                          className="text-sm font-medium text-gray-700"
                        >
                          حالة الحساب
                        </Label>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-300 rounded-lg">
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
                          <span className="text-xs sm:text-sm text-gray-600">
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
                          handleGroupPermissionChange={
                            handleGroupPermissionChange
                          }
                          isLoading={permissionsLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions - Fixed at bottom on mobile */}
              <div className="flex-shrink-0 bg-white sm:pt-[300px] border-t border-gray-200 sm:border-none">
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-3 px-4 sm:px-6 pb-3 sm:pb-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto "
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={updateEmployee}
                    disabled={
                      editLoading ||
                      !editFormData.first_name ||
                      !editFormData.last_name ||
                      !editFormData.email ||
                      !editFormData.phone
                    }
                    className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-400 text-sm sm:text-base w-full sm:w-auto"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 animate-spin" />
                        <span className="text-xs sm:text-sm">
                          جاري التحديث...
                        </span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                        <span className="text-xs sm:text-sm">
                          حفظ التغييرات
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </div>
    </div>
  );
}
