"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  UserPlus,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { PermissionsDropdown } from "@/components/access-control/PermissionsDropdown";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import PaymentPopup from "@/components/popup/PopupForWhatsapp";

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

export default function CreateEmployeePage() {
  const router = useRouter();
  const { userData } = useAuthStore();
  const userStoreData = useUserStore((state) => state.userData);
  const employeesData = userStoreData?.employees;
  
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
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
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  
  // Limit detection states
  const [limitError, setLimitError] = useState<string | null>(null);
  const [isAtLimit, setIsAtLimit] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);
  
  // Payment popup state
  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [isPurchasingAddon, setIsPurchasingAddon] = useState(false);

  // Check limit on mount and when employeesData changes
  useEffect(() => {
    // Fetch user data if not already loaded
    const userStore = useUserStore.getState();
    if (!userStore.userData || !userStore.userData.employees) {
      userStore.fetchUserData();
    }
  }, []);

  useEffect(() => {
    if (!employeesData) {
      // No employees data yet, wait for it to load
      return;
    }

    // Check if there's a limit set
    if (!employeesData.max_employees) {
      // No limit set, can create employee
      setLimitError(null);
      setIsAtLimit(false);
      setIsOverLimit(false);
      return;
    }

    const usage = employeesData.usage || employeesData.total_count || 0;
    const maxEmployees = employeesData.max_employees;
    const usagePercentage = usage / maxEmployees;

    // Check if over limit
    if (employeesData.is_over_limit || usage > maxEmployees) {
      setIsOverLimit(true);
      setIsAtLimit(false);
      setLimitError(
        `لقد تجاوزت الحد المسموح به. الحد الأقصى: ${maxEmployees}، المستخدم: ${usage}`
      );
      return;
    }

    // Check if at limit
    if (usagePercentage >= 1) {
      setIsAtLimit(true);
      setIsOverLimit(false);
      setLimitError(
        `لقد وصلت إلى الحد الأقصى المسموح به. الحد الأقصى: ${maxEmployees}، المستخدم: ${usage}`
      );
      return;
    }

    // Within limit
    setLimitError(null);
    setIsAtLimit(false);
    setIsOverLimit(false);
  }, [employeesData]);

  // Fetch permissions
  useEffect(() => {
    // التحقق من وجود token قبل إرسال الطلب
    if (!userData?.token) {
      return;
    }

    const fetchPermissions = async () => {
      setPermissionsLoading(true);
      try {
        const response = await axiosInstance.get("/v1/permissions");
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

  // Purchase employee addon (increase limit)
  const handlePurchaseEmployeeAddon = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    setIsPurchasingAddon(true);
    setCreateError(null);

    try {
      const response = await axiosInstance.post("/employee/addons", {
        qty: 1,
        plan_id: 1,
      });

      if (response.data.status === "success" && response.data.payment_url) {
        setPaymentUrl(response.data.payment_url);
        setPaymentPopupOpen(true);
      } else {
        setCreateError("فشل في إنشاء طلب الشراء");
      }
    } catch (err: any) {
      console.error("Error purchasing employee addon:", err);
      setCreateError(err.response?.data?.message || "حدث خطأ أثناء شراء الحد الإضافي");
    } finally {
      setIsPurchasingAddon(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    setPaymentPopupOpen(false);
    setPaymentUrl("");
    
    // Refresh user data to get updated employees quota
    const userStore = useUserStore.getState();
    await userStore.refreshUserData();
  };

  // Create employee
  const createEmployee = async () => {
    // Check limit before creating
    if (isAtLimit || isOverLimit) {
      setCreateError(limitError || "لا يمكن إضافة موظف جديد. تم الوصول إلى الحد الأقصى.");
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      // Convert selected permissions to array
      const selectedPermissionsArray = Object.entries(selectedPermissions)
        .filter(([_, selected]) => selected)
        .map(([permissionName, _]) => permissionName);

      const requestData = {
        ...formData,
        permissions: selectedPermissionsArray,
        role_ids: [],
      };

      await axiosInstance.post("/v1/employees", requestData);

      setCreateSuccess(true);

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        active: true,
        role_ids: [],
        permissions: [],
      });
      setSelectedPermissions({});

      // Refresh user data to update employees count
      const userStore = useUserStore.getState();
      await userStore.refreshUserData();

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/access-control");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating employee:", err);
      setCreateError(err.response?.data?.message || "حدث خطأ في إنشاء الموظف");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <EnhancedSidebar />
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
                    <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                    إضافة موظف جديد
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base text-right mt-2 pr-10 sm:pr-12">
                قم بإنشاء حساب جديد للموظف وتخصيص الصلاحيات المناسبة
              </p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)] sm:h-auto">
              {/* Scrollable Content - Mobile Only */}
              <div className="overflow-y-auto flex-1 sm:overflow-visible">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Success Message */}
                  {createSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        تم إنشاء الموظف بنجاح! جاري إعادة التوجيه...
                      </span>
                    </div>
                  )}

                  {/* Limit Error Message */}
                  {limitError && (
                    <div className={`border rounded-lg p-4 flex flex-col gap-3 ${
                      isOverLimit 
                        ? "bg-red-50 border-red-200" 
                        : "bg-orange-50 border-orange-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        {isOverLimit ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <span className={`font-medium ${
                          isOverLimit ? "text-red-800" : "text-orange-800"
                        }`}>
                          {limitError}
                        </span>
                      </div>
                      {employeesData && employeesData.max_employees && (
                        <div className="pr-8">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              الحد الأقصى: {employeesData.max_employees}
                            </span>
                            <span className="text-sm text-gray-600">
                              المستخدم: {employeesData.usage || employeesData.total_count || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isOverLimit ? "bg-red-600" : "bg-orange-600"
                              }`}
                              style={{
                                width: `${Math.min(
                                  ((employeesData.usage || employeesData.total_count || 0) / employeesData.max_employees) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Message */}
                  {createError && !limitError && (
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

                      <div className="space-y-2 sm:col-span-2 ">
                        <Label
                          htmlFor="permissions"
                          className="text-sm font-medium text-gray-700"
                        >
                          الصلاحيات
                        </Label>

                        <div className="">
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
              </div>

              {/* Footer Actions - Fixed at bottom on mobile */}
              <div className="flex-shrink-0 bg-white sm:pt-[300px] border-t border-gray-200 sm:border-none">
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-3 px-4 sm:px-6 pb-3 sm:pb-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
                  >
                    إلغاء
                  </Button>
                  {(() => {
                    // If at limit or over limit, show "Increase Limit" button
                    if (isAtLimit || isOverLimit) {
                      return (
                        <Button
                          type="button"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base w-full sm:w-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.nativeEvent) {
                              e.nativeEvent.stopImmediatePropagation();
                            }
                            handlePurchaseEmployeeAddon(e);
                            return false;
                          }}
                          disabled={isPurchasingAddon}
                        >
                          {isPurchasingAddon ? (
                            <>
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 animate-spin" />
                              <span className="text-xs sm:text-sm">
                                جاري المعالجة...
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                              <span className="text-xs sm:text-sm">
                                زيادة الحد المسموح
                              </span>
                            </>
                          )}
                        </Button>
                      );
                    }
                    
                    // Otherwise, show "Create Employee" button
                    return (
                      <Button
                        onClick={createEmployee}
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
                            <span className="text-xs sm:text-sm">
                              جاري الإنشاء...
                            </span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                            <span className="text-xs sm:text-sm">إنشاء الموظف</span>
                          </>
                        )}
                      </Button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Popup */}
      {paymentPopupOpen && (
        <PaymentPopup
          paymentUrl={paymentUrl}
          onClose={() => {
            setPaymentPopupOpen(false);
            setPaymentUrl("");
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
