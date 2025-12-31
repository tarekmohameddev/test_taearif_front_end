/**
 * ============================================================================
 * Theme Data Loader Service
 * ============================================================================
 *
 * هذا الملف يحتوي على دوال تحميل بيانات الثيم من ملفات JSON.
 * This file contains functions to load theme data from JSON files.
 *
 * المسؤوليات:
 * - تحميل بيانات الثيم من ملفات JSON
 * - إنشاء مفاتيح النسخ الاحتياطي
 *
 * Responsibilities:
 * - Load theme data from JSON files
 * - Create backup keys
 *
 * ============================================================================
 */

import theme1Data from "@/lib/themes/theme1Data.json";
import theme2Data from "@/lib/themes/theme2Data.json";
import type { ThemeNumber, ThemeData } from "./types";

/**
 * تحميل بيانات الثيم من ملف JSON
 * Load theme data from JSON file
 *
 * تقوم هذه الدالة بتحميل بيانات الثيم من الملفات JSON المحددة
 * حسب رقم الثيم المطلوب.
 *
 * This function loads theme data from the specified JSON files
 * based on the requested theme number.
 *
 * @param themeNumber - رقم الثيم المطلوب (1 أو 2)
 *                     Theme number to load (1 or 2)
 *
 * @returns بيانات الثيم المحملة
 *          Loaded theme data
 *
 * @throws Error إذا كان رقم الثيم غير صحيح
 *         Error if theme number is invalid
 *
 * @example
 * ```typescript
 * const theme1Data = loadThemeData(1);
 * const theme2Data = loadThemeData(2);
 * ```
 */
export function loadThemeData(themeNumber: ThemeNumber): ThemeData {
  // استخدام switch statement للتحقق من رقم الثيم
  // Use switch statement to validate theme number
  switch (themeNumber) {
    case 1:
      // تحميل بيانات الثيم الأول
      // Load theme 1 data
      return theme1Data as ThemeData;

    case 2:
      // تحميل بيانات الثيم الثاني
      // Load theme 2 data
      return theme2Data as ThemeData;

    default:
      // رمي خطأ إذا كان رقم الثيم غير صحيح
      // Throw error if theme number is invalid
      throw new Error(`Invalid theme number: ${themeNumber}`);
  }
}

/**
 * إنشاء مفتاح النسخ الاحتياطي بناءً على رقم الثيم الحالي
 * Create backup key based on current theme number
 *
 * تقوم هذه الدالة بإنشاء مفتاح فريد للنسخ الاحتياطي
 * بناءً على رقم الثيم الحالي.
 *
 * This function creates a unique backup key based on
 * the current theme number.
 *
 * @param currentTheme - رقم الثيم الحالي (يمكن أن يكون null أو undefined)
 *                      Current theme number (can be null or undefined)
 *
 * @returns مفتاح النسخ الاحتياطي (مثل "Theme1Backup") أو null إذا لم يكن هناك ثيم
 *          Backup key (e.g., "Theme1Backup") or null if no theme exists
 *
 * @example
 * ```typescript
 * const backupKey1 = createBackupKey(1); // "Theme1Backup"
 * const backupKey2 = createBackupKey(2); // "Theme2Backup"
 * const backupKeyNull = createBackupKey(null); // null
 * ```
 */
export function createBackupKey(
  currentTheme: number | null | undefined,
): string | null {
  // التحقق من وجود رقم الثيم
  // Check if theme number exists
  if (!currentTheme) {
    return null;
  }

  // إنشاء مفتاح النسخ الاحتياطي بالتنسيق: "Theme{number}Backup"
  // Create backup key in format: "Theme{number}Backup"
  return `Theme${currentTheme}Backup`;
}

/**
 * استخراج رقم الثيم من مفتاح النسخ الاحتياطي
 * Extract theme number from backup key
 *
 * تقوم هذه الدالة باستخراج رقم الثيم من مفتاح النسخ الاحتياطي
 * باستخدام regex pattern.
 *
 * This function extracts the theme number from a backup key
 * using a regex pattern.
 *
 * @param backupKey - مفتاح النسخ الاحتياطي (مثل "Theme1Backup" أو "Theme10Backup")
 *                   Backup key (e.g., "Theme1Backup" or "Theme10Backup")
 *
 * @returns رقم الثيم المستخرج أو null إذا لم يتم العثور على رقم
 *          Extracted theme number or null if no number found
 *
 * @example
 * ```typescript
 * const theme1 = extractThemeNumberFromBackupKey("Theme1Backup"); // 1
 * const theme10 = extractThemeNumberFromBackupKey("Theme10Backup"); // 10
 * const invalid = extractThemeNumberFromBackupKey("InvalidKey"); // null
 * ```
 */
export function extractThemeNumberFromBackupKey(
  backupKey: string,
): number | null {
  // استخدام regex pattern لاستخراج رقم الثيم
  // Pattern يدعم أي عدد من الأرقام (1, 2, 10, 11, 100, etc.)
  // Use regex pattern to extract theme number
  // Pattern supports any number of digits (1, 2, 10, 11, 100, etc.)
  const themeMatch = backupKey.match(/Theme(\d+)Backup/);

  // إذا تم العثور على تطابق، استخرج الرقم
  // If match found, extract the number
  if (themeMatch && themeMatch[1]) {
    return parseInt(themeMatch[1], 10);
  }

  // إذا لم يتم العثور على تطابق، أرجع null
  // If no match found, return null
  return null;
}
