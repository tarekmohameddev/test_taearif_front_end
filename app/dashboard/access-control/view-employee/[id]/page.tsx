"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, ArrowRight, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// Types
interface Role {
  id: number;
  team_id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    role_id: number;
    model_type: string;
    team_id: number;
  };
  permissions_list?: string[];
  permissions?: Array<{
    id: number;
    name: string;
    pivot: {
      role_id: number;
      permission_id: number;
    };
  }>;
}

interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description: string | null;
  guard_name: string;
  team_id: number | null;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface Employee {
  id: number;
  tenant_id: number;
  account_type: string;
  active: boolean;
  last_login_at: string | null;
  google_id: string | null;
  first_name: string;
  last_name: string;
  photo: string | null;
  username: string | null;
  email: string;
  subscribed: boolean;
  subscription_amount: string;
  referral_code: string;
  referred_by: string | null;
  company_name: string | null;
  phone: string;
  message: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  country: string | null;
  rbac_version: number;
  rbac_seeded_at: string | null;
  featured: number;
  status: number;
  online_status: number;
  verification_link: string | null;
  email_verified: number;
  subdomain_status: number;
  created_at: string;
  updated_at: string;
  preview_template: number;
  template_img: string | null;
  template_serial_number: number;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  template_name: string | null;
  show_home: string | null;
  onboarding_completed: boolean;
  industry_type: string | null;
  short_description: string | null;
  logo: string | null;
  icon: string | null;
  primary_color: string;
  show_even_if_empty: boolean;
  roles: Role[];
  permissions: Permission[];
}

// Helper functions
function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: number): React.ReactNode {
  if (status === 1) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        نشط
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        غير نشط
      </Badge>
    );
  }
}

export default function ViewEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id ? parseInt(params.id as string) : null;

  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee details
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeDetails = async () => {
      setDetailsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<{ data: Employee }>(
          `/v1/employees/${employeeId}`,
        );
        setEmployeeDetails(response.data.data);
      } catch (err: any) {
        console.error("Error fetching employee details:", err);
        setError(err.response?.data?.message || "حدث خطأ في جلب تفاصيل الموظف");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  if (detailsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
              <span className="text-sm text-gray-600 font-medium">
                جاري تحميل تفاصيل الموظف...
              </span>
            </div>
          </div>
      </div>
    );
  }

  if (error || !employeeDetails) {
    return (
      <div className="flex h-screen bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-4">
                {error || "لا توجد تفاصيل متاحة"}
              </p>
              <Button onClick={() => router.back()} variant="outline">
                العودة
              </Button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
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
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={employeeDetails.photo || ""} />
                    <AvatarFallback>
                      {getInitials(
                        employeeDetails.first_name,
                        employeeDetails.last_name,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                    تفاصيل الموظف
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base text-right mt-2 pr-10 sm:pr-12">
                عرض جميع المعلومات والصلاحيات الخاصة بالموظف
              </p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <ScrollArea className="max-h-[calc(100vh-300px)]">
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        المعلومات الأساسية
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">الاسم الكامل:</span>
                          <span className="font-medium">
                            {employeeDetails.first_name}{" "}
                            {employeeDetails.last_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">
                            البريد الإلكتروني:
                          </span>
                          <span className="font-medium">
                            {employeeDetails.email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">الهاتف:</span>
                          <span className="font-medium">
                            {employeeDetails.phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">الشركة:</span>
                          <span className="font-medium">
                            {employeeDetails.company_name || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">المدينة:</span>
                          <span className="font-medium">
                            {employeeDetails.city || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">الدولة:</span>
                          <span className="font-medium">
                            {employeeDetails.country || "غير محدد"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        معلومات الحساب
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">نوع الحساب:</span>
                          <Badge variant="outline">
                            {employeeDetails.account_type}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">الحالة:</span>
                          {getStatusBadge(employeeDetails.status)}
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">آخر تسجيل دخول:</span>
                          <span className="font-medium">
                            {employeeDetails.last_login_at
                              ? formatDate(employeeDetails.last_login_at)
                              : "لم يسجل دخول"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">تاريخ الإنشاء:</span>
                          <span className="font-medium">
                            {formatDate(employeeDetails.created_at)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">آخر تحديث:</span>
                          <span className="font-medium">
                            {formatDate(employeeDetails.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      الأدوار
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {employeeDetails.roles.length > 0 ? (
                        employeeDetails.roles.map((role) => (
                          <Badge
                            key={role.id}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">لا توجد أدوار</p>
                      )}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      الصلاحيات
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {employeeDetails.permissions.length > 0 ? (
                        employeeDetails.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <span className="text-sm font-medium text-gray-900 mb-1">
                              {permission.name_ar ||
                                permission.name_en ||
                                permission.name}
                            </span>
                            {permission.description && (
                              <span className="text-xs text-gray-500">
                                {permission.description}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 col-span-full">
                          لا توجد صلاحيات
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 px-4 sm:px-6 pb-3 sm:pb-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
                >
                  العودة
                </Button>
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/access-control/edit-employee/${employeeId}`,
                    )
                  }
                  className="bg-black hover:bg-gray-800 text-white text-sm sm:text-base w-full sm:w-auto"
                >
                  تعديل الموظف
                </Button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
