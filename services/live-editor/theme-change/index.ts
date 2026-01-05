/**
 * ============================================================================
 * Theme Change Service - Main Export File
 * ============================================================================
 *
 * هذا الملف الرئيسي لتصدير جميع الدوال والأنواع من نظام تغيير الثيمات.
 * This is the main export file for all functions and types from the theme change system.
 *
 * يتم تصدير جميع الدوال والأنواع من الملفات الفرعية هنا
 * لضمان backward compatibility مع الكود الموجود.
 *
 * All functions and types from sub-files are exported here
 * to ensure backward compatibility with existing code.
 *
 * ============================================================================
 */

// ============================================================================
// Types & Interfaces
// ============================================================================
export type {
  ThemeNumber,
  ThemeData,
  BackupData,
  BackupResult,
  PageComponentData,
} from "./types";

// ============================================================================
// Theme Data Loader
// ============================================================================
export {
  loadThemeData,
  createBackupKey,
  extractThemeNumberFromBackupKey,
} from "./themeDataLoader";

// ============================================================================
// Backup Service
// ============================================================================
export {
  backupCurrentComponentSettings,
  backupStaticPages,
  saveBackupInStore,
} from "./backupService";

// ============================================================================
// Static Pages Service
// ============================================================================
export {
  applyStaticPagesFromTheme,
  restoreStaticPagesFromBackup,
} from "./staticPagesService";

// ============================================================================
// Global Components Service
// ============================================================================
export {
  applyGlobalHeader,
  applyGlobalFooter,
  applyGlobalComponentsFromTheme,
  mergeGlobalComponentsWithBackup,
  restoreGlobalComponents,
} from "./globalComponentsService";

// ============================================================================
// Page Components Service
// ============================================================================
export {
  convertToPageComponentsFormat,
  updateComponentStates,
  applyPageComponentsFromTheme,
  restorePageComponentsFromBackup,
} from "./pageComponentsService";

// ============================================================================
// Theme Application Service
// ============================================================================
export {
  applyThemeToAllPages,
  applyDefaultThemeData,
} from "./themeApplicationService";

// ============================================================================
// Theme Restore Service
// ============================================================================
export { restoreThemeFromBackup } from "./themeRestoreService";

// ============================================================================
// Tenant Store Sync Service
// ============================================================================
export {
  convertPageComponentsToComponentSettings,
  updateTenantGlobalComponentsData,
  syncTenantStoreWithEditorStore,
  syncTenantStoreFromBackup,
} from "./tenantStoreSyncService";

// ============================================================================
// Utilities
// ============================================================================
export {
  createPageMetaData,
  normalizeComponentId,
  logThemeChange,
  validateComponentData,
  createDefaultComponentData,
} from "./utils";
