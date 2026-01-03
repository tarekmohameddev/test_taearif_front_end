// خدمة إدارة أسماء عرض المكونات

import {
  getComponentDisplayName as getDisplayNameFromList,
  COMPONENTS,
} from "@/lib-liveeditor/ComponentsList";

// دالة الحصول على اسم عرض المكون
export const getComponentDisplayName = (type: string): string => {
  return getDisplayNameFromList(type);
};

// دالة إضافة اسم عرض جديد (محفوظة للتوافق العكسي)
export const addComponentDisplayName = (
  type: string,
  displayName: string,
): void => {
  // يمكن تطبيق التحديث في القائمة المركزية إذا لزم الأمر
  console.warn(
    `addComponentDisplayName is deprecated. Update the central ComponentsList instead.`,
  );
};

// دالة تحديث اسم عرض موجود (محفوظة للتوافق العكسي)
export const updateComponentDisplayName = (
  type: string,
  displayName: string,
): boolean => {
  console.warn(
    `updateComponentDisplayName is deprecated. Update the central ComponentsList instead.`,
  );
  return COMPONENTS[type] !== undefined;
};

// دالة حذف اسم عرض (محفوظة للتوافق العكسي)
export const removeComponentDisplayName = (type: string): boolean => {
  console.warn(
    `removeComponentDisplayName is deprecated. Update the central ComponentsList instead.`,
  );
  return false;
};

// دالة الحصول على جميع أسماء العرض
export const getAllDisplayNames = (): Record<string, string> => {
  const displayNames: Record<string, string> = {};
  Object.entries(COMPONENTS).forEach(([key, component]) => {
    displayNames[key] = component.displayName;
  });
  return displayNames;
};

// دالة التحقق من وجود اسم عرض
export const hasDisplayName = (type: string): boolean => {
  return !!COMPONENTS[type];
};

// دالة إنشاء اسم عرض تلقائي
export const generateDisplayName = (type: string): string => {
  // تحويل النوع إلى اسم عرض مقروء
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// دالة تنظيف اسم العرض
export const sanitizeDisplayName = (displayName: string): string => {
  if (!displayName) return "";

  // إزالة الأحرف غير المسموحة والمسافات الزائدة
  return displayName
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "");
};

// دالة التحقق من صحة اسم العرض
export const isValidDisplayName = (displayName: string): boolean => {
  if (!displayName || typeof displayName !== "string") {
    return false;
  }

  // التحقق من أن الاسم يحتوي على أحرف صحيحة
  const sanitizedName = sanitizeDisplayName(displayName);
  return sanitizedName.length > 0 && sanitizedName.length <= 100;
};
