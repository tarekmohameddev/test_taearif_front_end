/**
 * ترجمة أسماء مجموعات الصلاحيات (Permission Groups)
 * Translation for permission group names
 */

export interface PermissionGroupTranslations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const permissionGroupsTranslation: PermissionGroupTranslations = {
  affiliate: {
    ar: "الشراكات والعمولات",
    en: "Affiliate",
  },
  apps: {
    ar: "التطبيقات",
    en: "Apps",
  },
  content: {
    ar: "المحتوى",
    en: "Content",
  },
  crm: {
    ar: "إدارة علاقات العملاء",
    en: "CRM",
  },
  customers: {
    ar: "العملاء",
    en: "Customers",
  },
  dashboard: {
    ar: "لوحة التحكم",
    en: "Dashboard",
  },
  live_editor: {
    ar: "محرر الموقع المباشر",
    en: "Live Editor",
  },
  projects: {
    ar: "المشاريع",
    en: "Projects",
  },
  properties: {
    ar: "العقارات",
    en: "Properties",
  },
  rentals: {
    ar: "الإيجارات",
    en: "Rentals",
  },
  settings: {
    ar: "الإعدادات",
    en: "Settings",
  },
};

/**
 * ترجمة اسم مجموعة الصلاحيات
 * Translate permission group name
 * @param groupName - اسم المجموعة (group name)
 * @param locale - اللغة المطلوبة (ar أو en)
 * @returns اسم المجموعة المترجم
 */
export function translatePermissionGroup(
  groupName: string,
  locale: "ar" | "en" = "ar",
): string {
  const translation = permissionGroupsTranslation[groupName];
  if (translation) {
    return translation[locale];
  }
  // إذا لم توجد ترجمة، إرجاع الاسم الأصلي مع استبدال النقاط بمسافات
  return groupName.replace(/\./g, " ");
}

/**
 * الحصول على ترجمة عربية لمجموعة الصلاحيات
 * Get Arabic translation for permission group
 * @param groupName - اسم المجموعة
 * @returns الترجمة العربية
 */
export function getPermissionGroupAr(groupName: string): string {
  return translatePermissionGroup(groupName, "ar");
}

/**
 * الحصول على ترجمة إنجليزية لمجموعة الصلاحيات
 * Get English translation for permission group
 * @param groupName - اسم المجموعة
 * @returns الترجمة الإنجليزية
 */
export function getPermissionGroupEn(groupName: string): string {
  return translatePermissionGroup(groupName, "en");
}
