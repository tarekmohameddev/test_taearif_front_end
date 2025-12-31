"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";

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

interface ViewEmployeeDialogProps {
  employee: Employee;
  employeeDetails: Employee | null;
  detailsLoading: boolean;
  onViewEmployee: (employee: Employee) => void;
  getInitials: (firstName: string, lastName: string) => string;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: number) => React.ReactNode;
}

export function ViewEmployeeDialog({
  employee,
  employeeDetails,
  detailsLoading,
  onViewEmployee,
  getInitials,
  formatDate,
  getStatusBadge,
}: ViewEmployeeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewEmployee(employee)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          عرض التفاصيل
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={employeeDetails?.photo || ""} />
              <AvatarFallback>
                {employeeDetails
                  ? getInitials(
                      employeeDetails.first_name,
                      employeeDetails.last_name,
                    )
                  : ""}
              </AvatarFallback>
            </Avatar>
            تفاصيل الموظف
          </DialogTitle>
          <DialogDescription className="text-right">
            عرض جميع المعلومات والصلاحيات الخاصة بالموظف
          </DialogDescription>
        </DialogHeader>

        {detailsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : employeeDetails ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  المعلومات الأساسية
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم الكامل:</span>
                    <span className="font-medium">
                      {employeeDetails.first_name} {employeeDetails.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">البريد الإلكتروني:</span>
                    <span className="font-medium">{employeeDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium">{employeeDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشركة:</span>
                    <span className="font-medium">
                      {employeeDetails.company_name || "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المدينة:</span>
                    <span className="font-medium">
                      {employeeDetails.city || "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الدولة:</span>
                    <span className="font-medium">
                      {employeeDetails.country || "غير محدد"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">معلومات الحساب</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">نوع الحساب:</span>
                    <Badge variant="outline">
                      {employeeDetails.account_type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    {getStatusBadge(employeeDetails.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر تسجيل دخول:</span>
                    <span className="font-medium">
                      {employeeDetails.last_login_at
                        ? formatDate(employeeDetails.last_login_at)
                        : "لم يسجل دخول"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الإنشاء:</span>
                    <span className="font-medium">
                      {formatDate(employeeDetails.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
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
              <h4 className="font-semibold text-gray-900 mb-3">الأدوار</h4>
              <div className="flex flex-wrap gap-2">
                {employeeDetails.roles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">الصلاحيات</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {employeeDetails.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">
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
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد تفاصيل متاحة</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
