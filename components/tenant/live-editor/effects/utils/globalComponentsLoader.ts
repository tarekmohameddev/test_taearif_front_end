/**
 * Global Components Loader
 * تحميل بيانات المكونات العامة (Header/Footer) من tenantData
 */

/**
 * تحميل بيانات المكونات العامة من tenantData
 * يتم استدعاؤها دائمًا لضمان تحميل header/footer variants الصحيحة
 *
 * @param editorStore - حالة Editor Store
 * @param tenantData - بيانات التاجر من API
 */
export function loadGlobalComponentsFromTenantData(
  editorStore: any,
  tenantData: any,
): void {
  if (!tenantData?.globalComponentsData) return;

  const globalData = tenantData.globalComponentsData;

  // ⭐ NEW: Load ThemesBackup when tenantData contains backups and store is empty
  if (
    tenantData.ThemesBackup &&
    typeof tenantData.ThemesBackup === "object" &&
    Object.keys(tenantData.ThemesBackup).length > 0
  ) {
    const currentBackups = editorStore.ThemesBackup || {};
    if (Object.keys(currentBackups).length === 0) {
      editorStore.setThemesBackup(tenantData.ThemesBackup);
    }
  }

  // Only load if not already loaded (check if variants are default values)
  const currentHeaderVariant = editorStore.globalHeaderVariant;
  const currentFooterVariant = editorStore.globalFooterVariant;
  const isUsingDefaults =
    currentHeaderVariant === "StaticHeader1" &&
    currentFooterVariant === "StaticFooter1";

  // Load globalHeaderVariant
  if (globalData.globalHeaderVariant || globalData.header?.variant) {
    const headerVariant =
      globalData.globalHeaderVariant || globalData.header?.variant;
    if (headerVariant && headerVariant !== currentHeaderVariant) {
      editorStore.setGlobalHeaderVariant(headerVariant);
    }
  }

  // Load globalFooterVariant
  if (globalData.globalFooterVariant || globalData.footer?.variant) {
    const footerVariant =
      globalData.globalFooterVariant || globalData.footer?.variant;
    if (footerVariant && footerVariant !== currentFooterVariant) {
      editorStore.setGlobalFooterVariant(footerVariant);
    }
  }

  // Load globalComponentsData if not loaded or using defaults
  if (isUsingDefaults || !editorStore.globalComponentsData?.header?.variant) {
    editorStore.setGlobalComponentsData(globalData);
  }

  // Load header and footer data
  if (globalData.header) {
    editorStore.setGlobalHeaderData(globalData.header);
  }
  if (globalData.footer) {
    editorStore.setGlobalFooterData(globalData.footer);
  }
}


