/**
 * ============================================================================
 * Global Components Service
 * ============================================================================
 *
 * هذا الملف يحتوي على خدمات إدارة المكونات العامة (Header و Footer).
 * This file contains services for managing global components (Header and Footer).
 *
 * المسؤوليات:
 * - تطبيق Header و Footer من بيانات الثيم
 * - استعادة المكونات العامة من النسخ الاحتياطي
 * - دمج بيانات المكونات العامة
 *
 * Responsibilities:
 * - Apply Header and Footer from theme data
 * - Restore global components from backup
 * - Merge global components data
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context-liveeditor/editorStore";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";
import type { ThemeData } from "./types";

/**
 * تطبيق Header من بيانات الثيم
 * Apply Header from theme data
 *
 * تقوم هذه الدالة بتطبيق Header من بيانات الثيم على Editor Store.
 * تدمج البيانات الافتراضية مع بيانات الثيم.
 *
 * This function applies Header from theme data to Editor Store.
 * Merges default data with theme data.
 *
 * @param headerData - بيانات Header من الثيم
 *                   Header data from theme
 *
 * @param headerVariant - نوع Header (مثل "StaticHeader1" أو "StaticHeader2")
 *                      Header variant (e.g., "StaticHeader1" or "StaticHeader2")
 *
 * @example
 * ```typescript
 * applyGlobalHeader(themeData.globalComponentsData?.header, "StaticHeader2");
 * ```
 */
export function applyGlobalHeader(
  headerData: any,
  headerVariant: string,
): void {
  const store = useEditorStore.getState();

  // الحصول على البيانات الافتراضية لنوع Header الجديد
  // Get default data for the new header variant
  const newDefaultHeaderData = createDefaultData("header", headerVariant);

  // دمج بيانات الثيم مع البيانات الافتراضية (بيانات الثيم لها الأولوية)
  // ⭐ IMPORTANT: يجب إضافة variant بعد spread لضمان وجوده دائماً
  // Merge theme data with default data (theme data takes priority)
  // ⭐ IMPORTANT: variant must be added AFTER spread to ensure it's always included
  const newHeaderDataWithVariant = {
    ...newDefaultHeaderData,
    ...headerData, // Override with theme-specific data
    variant: headerVariant, // ✅ Ensure variant is ALWAYS included (after spread)
  };

  // ⭐ IMPORTANT: تحديث variant أولاً، ثم البيانات (نفس منطق editor sidebar)
  // ⭐ IMPORTANT: Update variant FIRST, then data (same as editor sidebar)
  store.setGlobalHeaderVariant(headerVariant);

  // إنشاء كائن جديد لضمان اكتشاف React للتغيير
  // Create new object to ensure React detects the change
  store.setGlobalHeaderData(newHeaderDataWithVariant);

  // تحديث globalComponentsData مع variant والبيانات
  // ⭐ CRITICAL: التأكد من أن header data يحتوي على variant داخله
  // Update globalComponentsData with variant and data
  // ⭐ CRITICAL: Ensure header data contains variant inside it
  store.setGlobalComponentsData({
    ...store.globalComponentsData,
    header: {
      ...newHeaderDataWithVariant,
      variant: headerVariant, // ✅ Ensure variant is in header data
    },
    globalHeaderVariant: headerVariant,
  } as any);
}

/**
 * تطبيق Footer من بيانات الثيم
 * Apply Footer from theme data
 *
 * تقوم هذه الدالة بتطبيق Footer من بيانات الثيم على Editor Store.
 * تدمج البيانات الافتراضية مع بيانات الثيم.
 *
 * This function applies Footer from theme data to Editor Store.
 * Merges default data with theme data.
 *
 * @param footerData - بيانات Footer من الثيم
 *                   Footer data from theme
 *
 * @param footerVariant - نوع Footer (مثل "StaticFooter1" أو "StaticFooter2")
 *                      Footer variant (e.g., "StaticFooter1" or "StaticFooter2")
 *
 * @example
 * ```typescript
 * applyGlobalFooter(themeData.globalComponentsData?.footer, "StaticFooter2");
 * ```
 */
export function applyGlobalFooter(
  footerData: any,
  footerVariant: string,
): void {
  const store = useEditorStore.getState();

  // الحصول على البيانات الافتراضية لنوع Footer الجديد
  // Get default data for the new footer variant
  const newDefaultFooterData = createDefaultData("footer", footerVariant);

  // دمج بيانات الثيم مع البيانات الافتراضية (بيانات الثيم لها الأولوية)
  // ⭐ IMPORTANT: يجب إضافة variant بعد spread لضمان وجوده دائماً
  // Merge theme data with default data (theme data takes priority)
  // ⭐ IMPORTANT: variant must be added AFTER spread to ensure it's always included
  const newFooterDataWithVariant = {
    ...newDefaultFooterData,
    ...footerData, // Override with theme-specific data
    variant: footerVariant, // ✅ Ensure variant is ALWAYS included (after spread)
  };

  // ⭐ IMPORTANT: تحديث variant أولاً، ثم البيانات (نفس منطق editor sidebar)
  // ⭐ IMPORTANT: Update variant FIRST, then data (same as editor sidebar)
  store.setGlobalFooterVariant(footerVariant);

  // إنشاء كائن جديد لضمان اكتشاف React للتغيير
  // Create new object to ensure React detects the change
  store.setGlobalFooterData(newFooterDataWithVariant);

  // تحديث globalComponentsData مع variant والبيانات
  // ⭐ CRITICAL: التأكد من أن footer data يحتوي على variant داخله
  // Update globalComponentsData with variant and data
  // ⭐ CRITICAL: Ensure footer data contains variant inside it
  store.setGlobalComponentsData({
    ...store.globalComponentsData,
    footer: {
      ...newFooterDataWithVariant,
      variant: footerVariant, // ✅ Ensure variant is in footer data
    },
    globalFooterVariant: footerVariant,
  } as any);
}

/**
 * تطبيق المكونات العامة من بيانات الثيم
 * Apply global components from theme data
 *
 * تقوم هذه الدالة بتطبيق Header و Footer من بيانات الثيم.
 *
 * This function applies Header and Footer from theme data.
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @example
 * ```typescript
 * applyGlobalComponentsFromTheme(themeData);
 * ```
 */
export function applyGlobalComponentsFromTheme(themeData: ThemeData): void {
  if (!themeData.globalComponentsData) {
    return;
  }

  const { header, footer, globalHeaderVariant, globalFooterVariant } =
    themeData.globalComponentsData;

  // تحديد نوع Header
  // Determine header variant
  const headerVariant =
    header?.variant || globalHeaderVariant || "StaticHeader1";

  if (headerVariant) {
    applyGlobalHeader(header, headerVariant);
  }

  // تحديد نوع Footer
  // Determine footer variant
  const footerVariant =
    footer?.variant || globalFooterVariant || "StaticFooter1";

  if (footerVariant) {
    applyGlobalFooter(footer, footerVariant);
  }
}

/**
 * دمج بيانات المكونات العامة مع النسخ الاحتياطي
 * Merge global components data with backup
 *
 * تقوم هذه الدالة بدمج بيانات المكونات العامة من النسخ الاحتياطي
 * مع بيانات الثيم الجديدة. تحافظ على تخصيصات المستخدم من النسخ الاحتياطي.
 *
 * This function merges global components data from backup
 * with new theme data. Preserves user customizations from backup.
 *
 * @param themeData - بيانات الثيم الجديدة
 *                  New theme data
 *
 * @example
 * ```typescript
 * mergeGlobalComponentsWithBackup(themeData);
 * ```
 */
export function mergeGlobalComponentsWithBackup(themeData: ThemeData): void {
  const store = useEditorStore.getState();

  if (!themeData.globalComponentsData) {
    return;
  }

  const { globalHeaderVariant, globalFooterVariant, header, footer } =
    themeData.globalComponentsData;

  // تطبيق Header variant إذا كان محدداً في themeData
  // ⭐ CRITICAL: تطبيق variants من themeData (تجاوز variants من النسخ الاحتياطي)
  // هذا يضمن أنه عند تغيير الثيمات، يتم تطبيق variants الصحيحة (header2/footer2)
  // حتى لو كان النسخ الاحتياطي يحتوي على variants قديمة (StaticHeader1/StaticFooter1)
  // Apply header variant if specified in themeData
  // ⭐ CRITICAL: Apply variants from themeData (override backup variants)
  // This ensures that when switching themes, correct variants (header2/footer2) are applied
  // even if backup contains old variants (StaticHeader1/StaticFooter1)
  if (globalHeaderVariant) {
    store.setGlobalHeaderVariant(globalHeaderVariant);

    // الحصول على البيانات الافتراضية لنوع Header الجديد
    // Get default data for the new header variant
    const newDefaultHeaderData = createDefaultData(
      "header",
      globalHeaderVariant,
    );

    // دمج بيانات Header الحالية (من النسخ الاحتياطي) مع البيانات الافتراضية وبيانات الثيم
    // Merge current header data (from backup) with default data and theme data
    const currentHeaderData = store.globalHeaderData || {};
    const themeHeaderData = header || {};

    const mergedHeaderData = {
      ...newDefaultHeaderData,
      ...currentHeaderData, // ✅ الحفاظ على بيانات النسخ الاحتياطي (تخصيصات المستخدم)
      ...themeHeaderData, // ✅ تطبيق بيانات الثيم المحددة
      variant: globalHeaderVariant, // ✅ التأكد من أن variant موجود دائماً
    };

    store.setGlobalHeaderData(mergedHeaderData);

    // تحديث globalComponentsData
    // Update globalComponentsData
    store.setGlobalComponentsData({
      ...store.globalComponentsData,
      header: mergedHeaderData,
      globalHeaderVariant: globalHeaderVariant,
    } as any);
  }

  // تطبيق Footer variant إذا كان محدداً في themeData
  // Apply footer variant if specified in themeData
  if (globalFooterVariant) {
    store.setGlobalFooterVariant(globalFooterVariant);

    // الحصول على البيانات الافتراضية لنوع Footer الجديد
    // Get default data for the new footer variant
    const newDefaultFooterData = createDefaultData(
      "footer",
      globalFooterVariant,
    );

    // دمج بيانات Footer الحالية (من النسخ الاحتياطي) مع البيانات الافتراضية وبيانات الثيم
    // Merge current footer data (from backup) with default data and theme data
    const currentFooterData = store.globalFooterData || {};
    const themeFooterData = footer || {};

    const mergedFooterData = {
      ...newDefaultFooterData,
      ...currentFooterData, // ✅ الحفاظ على بيانات النسخ الاحتياطي (تخصيصات المستخدم)
      ...themeFooterData, // ✅ تطبيق بيانات الثيم المحددة
      variant: globalFooterVariant, // ✅ التأكد من أن variant موجود دائماً
    };

    store.setGlobalFooterData(mergedFooterData);

    // تحديث globalComponentsData
    // Update globalComponentsData
    store.setGlobalComponentsData({
      ...store.globalComponentsData,
      footer: mergedFooterData,
      globalFooterVariant: globalFooterVariant,
    } as any);
  }
}

/**
 * استعادة المكونات العامة من النسخ الاحتياطي
 * Restore global components from backup
 *
 * تقوم هذه الدالة باستعادة Header و Footer من النسخ الاحتياطي.
 * تستبدل البيانات بالكامل (لا دمج).
 *
 * This function restores Header and Footer from backup.
 * Replaces data completely (no merge).
 *
 * @param globalData - بيانات المكونات العامة من النسخ الاحتياطي
 *                   Global components data from backup
 *
 * @example
 * ```typescript
 * restoreGlobalComponents(backup._globalComponentsData);
 * ```
 */
export function restoreGlobalComponents(globalData: any): void {
  const store = useEditorStore.getState();

  // تحديد نوع Header
  // Determine header variant
  const headerVariant =
    globalData.globalHeaderVariant ||
    globalData.header?.variant ||
    "StaticHeader1";

  // استبدال Header بالكامل
  // Replace header completely
  if (globalData.header) {
    const headerDataWithVariant = {
      ...globalData.header,
      variant: headerVariant,
    };
    store.setGlobalHeaderData(headerDataWithVariant);
    store.setGlobalHeaderVariant(headerVariant);
  }

  // تحديد نوع Footer
  // Determine footer variant
  const footerVariant =
    globalData.globalFooterVariant ||
    globalData.footer?.variant ||
    "StaticFooter1";

  // استبدال Footer بالكامل
  // Replace footer completely
  if (globalData.footer) {
    const footerDataWithVariant = {
      ...globalData.footer,
      variant: footerVariant,
    };
    store.setGlobalFooterData(footerDataWithVariant);
    store.setGlobalFooterVariant(footerVariant);
  }

  // استبدال globalComponentsData بالكامل (لا spread مع البيانات الموجودة)
  // ⭐ CRITICAL: هذا يضمن الاستبدال الكامل، وليس الدمج
  // Replace globalComponentsData completely (no spread with existing data)
  // ⭐ CRITICAL: This ensures complete replacement, not merge
  const restoredGlobalComponentsData: any = {
    globalHeaderVariant: headerVariant,
    globalFooterVariant: footerVariant,
  };

  if (globalData.header) {
    restoredGlobalComponentsData.header = {
      ...globalData.header,
      variant: headerVariant,
    };
  }

  if (globalData.footer) {
    restoredGlobalComponentsData.footer = {
      ...globalData.footer,
      variant: footerVariant,
    };
  }

  store.setGlobalComponentsData(restoredGlobalComponentsData);
}
