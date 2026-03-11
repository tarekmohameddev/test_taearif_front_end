/**
 * Access Control pure utilities.
 * No side effects, no React, no API.
 */

import type { AvailablePermissionItem } from "../types";

export const DATE_LOCALE = "ar-US";

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(DATE_LOCALE);
}

export function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase();
}

export function translatePermission(
  permissionName: string,
  availablePermissions: AvailablePermissionItem[] | null | undefined
): string {
  if (!availablePermissions?.length) {
    return permissionName;
  }
  const permission = availablePermissions.find((p) => p.name === permissionName);
  if (permission) {
    return permission.name_ar ?? permission.name_en ?? permission.name;
  }
  return permissionName;
}

export const EMPLOYEE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

export type StatusLabel = "نشط" | "غير نشط" | "غير محدد";

export function getStatusLabel(status: number): StatusLabel {
  switch (status) {
    case EMPLOYEE_STATUS.ACTIVE:
      return "نشط";
    case EMPLOYEE_STATUS.INACTIVE:
      return "غير نشط";
    default:
      return "غير محدد";
  }
}

export function getStatusVariant(
  status: number
): "success" | "destructive" | "secondary" {
  switch (status) {
    case EMPLOYEE_STATUS.ACTIVE:
      return "success";
    case EMPLOYEE_STATUS.INACTIVE:
      return "destructive";
    default:
      return "secondary";
  }
}

export const DEFAULT_ERROR_MESSAGES = {
  employeesFetch: "حدث خطأ في جلب بيانات الموظفين",
  employeeDetails: "حدث خطأ في جلب تفاصيل الموظف",
  employeeCreate: "حدث خطأ في إنشاء الموظف",
  employeeUpdate: "حدث خطأ في تحديث الموظف",
  employeeDelete: "فشل في حذف الموظف",
  permissionsFetch: "حدث خطأ في جلب الصلاحيات",
  rolesFetch: "حدث خطأ في جلب الأدوار",
  roleDetails: "فشل في جلب تفاصيل الدور",
  roleCreate: "فشل في إنشاء الدور",
  roleUpdate: "فشل في تحديث الدور",
  roleDelete: "فشل في حذف الدور",
  permissionDelete: "فشل في حذف الصلاحية",
  purchaseAddon: "حدث خطأ أثناء شراء الحد الإضافي",
} as const;

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  const err = error as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? fallback;
}
