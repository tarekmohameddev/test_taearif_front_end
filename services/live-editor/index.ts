// ============================================================================
// تصدير جميع الخدمات من ملف واحد
// ============================================================================

// الخدمات الأساسية
export * from "./componentService";
export * from "./dragDropService";
export * from "./dataService";
export * from "./stateService";
export * from "./uiService";

// الخدمات الجديدة المنفصلة - تصدير انتقائي لتجنب التكرار
export * from "./componentCacheService";
export * from "./componentPathService";
export * from "./componentFallbackService";
export * from "./componentParserService";
export * from "./componentThemeService";
export * from "./componentDisplayService";
export * from "./componentCreationService";
export * from "./componentLoaderService";
export * from "./pageDefinitionService";
export * from "./dialogService";
export * from "./eventService";

// تصدير انتقائي لخدمة التحقق لتجنب التكرار
export {
  validateComponent,
  validateLayout,
  validateComponentData,
  validateWithRules,
  mergeValidationResults,
  isValidColor,
  isValidEmail,
} from "./validationService";

// ============================================================================
// تجميع الخدمات حسب النوع للاستخدام المريح
// ============================================================================

// خدمة المكونات
export const ComponentService = {
  // الخدمات الأساسية
  getDisplayName: (() => {
    const { getComponentDisplayName } = require("./componentDisplayService");
    return getComponentDisplayName;
  })(),
  createInitial: (() => {
    const { createInitialComponents } = require("./componentCreationService");
    return createInitialComponents;
  })(),
  load: (() => {
    const { loadComponent } = require("./componentLoaderService");
    return loadComponent;
  })(),
  getDefaultTheme: (() => {
    const { getDefaultThemeForType } = require("./componentThemeService");
    return getDefaultThemeForType;
  })(),

  // الخدمات المتقدمة
  cache: require("./componentCacheService"),
  paths: require("./componentPathService"),
  fallbacks: require("./componentFallbackService"),
  parser: require("./componentParserService"),
  themes: require("./componentThemeService"),
  creation: require("./componentCreationService"),
  loader: require("./componentLoaderService"),
};

// خدمة السحب والإفلات
export const DragDropService = {
  handleDragEnd: (() => {
    const { handleDragEnd } = require("./dragDropService");
    return handleDragEnd;
  })(),
  groupComponentsByRow: (() => {
    const { groupComponentsByRow } = require("./dragDropService");
    return groupComponentsByRow;
  })(),
  sortRowsWithAutoExpand: (() => {
    const { sortRowsWithAutoExpand } = require("./dragDropService");
    return sortRowsWithAutoExpand;
  })(),
  applyAutoExpandLogic: (() => {
    const { applyAutoExpandLogic } = require("./dragDropService");
    return applyAutoExpandLogic;
  })(),
  DropIndicator: (() => {
    const { DropIndicator } = require("./dragDropService");
    return DropIndicator;
  })(),
};

// خدمة البيانات
export const DataService = {
  loadFromDatabase: (() => {
    const { loadComponentsFromDatabase } = require("./dataService");
    return loadComponentsFromDatabase;
  })(),
  createNew: (() => {
    const { createNewComponent } = require("./dataService");
    return createNewComponent;
  })(),
  updateData: (() => {
    const { updateComponentData } = require("./dataService");
    return updateComponentData;
  })(),
  updateTheme: (() => {
    const { updateComponentTheme } = require("./dataService");
    return updateComponentTheme;
  })(),
  reset: (() => {
    const { resetComponent } = require("./dataService");
    return resetComponent;
  })(),
  delete: (() => {
    const { deleteComponent } = require("./dataService");
    return deleteComponent;
  })(),
  updatePageTheme: (() => {
    const { updatePageTheme } = require("./dataService");
    return updatePageTheme;
  })(),
  updateNames: (() => {
    const { updateComponentNames } = require("./dataService");
    return updateComponentNames;
  })(),
};

// خدمة الحالة
export const StateService = {
  syncWithEditor: (() => {
    const { syncStateWithEditor } = require("./stateService");
    return syncStateWithEditor;
  })(),
  loadFromDatabase: (() => {
    const { loadDataFromDatabase } = require("./stateService");
    return loadDataFromDatabase;
  })(),
  resetInState: (() => {
    const { resetComponentInState } = require("./stateService");
    return resetComponentInState;
  })(),
  deleteFromState: (() => {
    const { deletePageFromState } = require("./stateService");
    return deletePageFromState;
  })(),
  updateRegistered: (() => {
    const { updateRegisteredComponents } = require("./stateService");
    return updateRegisteredComponents;
  })(),
  isPredefined: (() => {
    const { isPredefinedPage } = require("./stateService");
    return isPredefinedPage;
  })(),
  getPageTitle: (() => {
    const { getPageTitle } = require("./stateService");
    return getPageTitle;
  })(),
  sidebar: (() => {
    const { manageSidebarState } = require("./stateService");
    return manageSidebarState;
  })(),
  dialog: (() => {
    const { manageDialogState } = require("./stateService");
    return manageDialogState;
  })(),
  drag: (() => {
    const { manageDragState } = require("./stateService");
    return manageDragState;
  })(),
  validate: (() => {
    const { validateUser } = require("./stateService");
    return validateUser;
  })(),
  initialize: (() => {
    const { initializeData } = require("./stateService");
    return initializeData;
  })(),
};

// خدمة الواجهة
export const UIService = {
  RowDropZone: (() => {
    const { RowDropZone } = require("./uiService");
    return RowDropZone;
  })(),
  SortableItem: (() => {
    const { SortableItem } = require("./uiService");
    return SortableItem;
  })(),
  CachedComponent: (() => {
    const { CachedComponent } = require("./uiService");
    return CachedComponent;
  })(),
  DragMonitor: (() => {
    const { DragMonitor } = require("./uiService");
    return DragMonitor;
  })(),
  DropIndicator: (() => {
    const { DropIndicator } = require("./uiService");
    return DropIndicator;
  })(),
  EmptyPage: (() => {
    const { EmptyPage } = require("./uiService");
    return EmptyPage;
  })(),
};

// خدمة الحوارات
export const DialogService = {
  manager: (() => {
    const { DialogManager } = require("./dialogService");
    return DialogManager;
  })(),
  createDeleteComponent: (() => {
    const { createDeleteComponentDialog } = require("./dialogService");
    return createDeleteComponentDialog;
  })(),
  createDeletePage: (() => {
    const { createDeletePageDialog } = require("./dialogService");
    return createDeletePageDialog;
  })(),
  createConfirm: (() => {
    const { createConfirmDialog } = require("./dialogService");
    return createConfirmDialog;
  })(),
  createError: (() => {
    const { createErrorDialog } = require("./dialogService");
    return createErrorDialog;
  })(),
  createSuccess: (() => {
    const { createSuccessDialog } = require("./dialogService");
    return createSuccessDialog;
  })(),
  validate: (() => {
    const { validateDialogConfig } = require("./dialogService");
    return validateDialogConfig;
  })(),
  getDefault: (() => {
    const { getDefaultDialogConfig } = require("./dialogService");
    return getDefaultDialogConfig;
  })(),
};

// خدمة الأحداث
export const EventService = {
  manager: (() => {
    const { getEventManager } = require("./eventService");
    return getEventManager;
  })(),
  createComponentAdded: (() => {
    const { createComponentAddedEvent } = require("./eventService");
    return createComponentAddedEvent;
  })(),
  createComponentDeleted: (() => {
    const { createComponentDeletedEvent } = require("./eventService");
    return createComponentDeletedEvent;
  })(),
  createComponentMoved: (() => {
    const { createComponentMovedEvent } = require("./eventService");
    return createComponentMovedEvent;
  })(),
  createPageDeleted: (() => {
    const { createPageDeletedEvent } = require("./eventService");
    return createPageDeletedEvent;
  })(),
  createThemeChanged: (() => {
    const { createThemeChangedEvent } = require("./eventService");
    return createThemeChangedEvent;
  })(),
  createError: (() => {
    const { createErrorEvent } = require("./eventService");
    return createErrorEvent;
  })(),
};

// خدمة التحقق من الصحة
export const ValidationService = {
  validateComponent: (() => {
    const { validateComponent } = require("./validationService");
    return validateComponent;
  })(),
  validateLayout: (() => {
    const { validateLayout } = require("./validationService");
    return validateLayout;
  })(),
  validateData: (() => {
    const { validateComponentData } = require("./validationService");
    return validateComponentData;
  })(),
  validateUser: (() => {
    const { validateUser } = require("./validationService");
    return validateUser;
  })(),
  validateWithRules: (() => {
    const { validateWithRules } = require("./validationService");
    return validateWithRules;
  })(),
  mergeResults: (() => {
    const { mergeValidationResults } = require("./validationService");
    return mergeValidationResults;
  })(),
  isValidComponentType: (() => {
    const { isValidComponentType } = require("./validationService");
    return isValidComponentType;
  })(),
  isValidComponentName: (() => {
    const { isValidComponentName } = require("./validationService");
    return isValidComponentName;
  })(),
  isValidPageSlug: (() => {
    const { isValidPageSlug } = require("./validationService");
    return isValidPageSlug;
  })(),
  isValidColor: (() => {
    const { isValidColor } = require("./validationService");
    return isValidColor;
  })(),
  isValidEmail: (() => {
    const { isValidEmail } = require("./validationService");
    return isValidEmail;
  })(),
};

// ============================================================================
// تصدير الثوابت المهمة
// ============================================================================

export const PAGE_DEFINITIONS = (() => {
  const { PAGE_DEFINITIONS } = require("./pageDefinitionService");
  return PAGE_DEFINITIONS;
})();

export const SECTION_PATHS = (() => {
  const { SECTION_PATHS } = require("./componentPathService");
  return SECTION_PATHS;
})();

export const COMPONENT_SUB_PATHS = (() => {
  const { COMPONENT_SUB_PATHS } = require("./componentPathService");
  return COMPONENT_SUB_PATHS;
})();

export const DEFAULT_DIALOG_CONFIGS = (() => {
  const { DEFAULT_DIALOG_CONFIGS } = require("./dialogService");
  return DEFAULT_DIALOG_CONFIGS;
})();

// ============================================================================
// تصدير الأنواع
// ============================================================================

export type { ComponentInstance, ComponentData, GridLayout } from "@/lib/types";

export type { DropIndicator } from "./dragDropService";

export type { DialogType, DialogConfig } from "./dialogService";

export type { EventType, EventData, Event, EventHandler } from "./eventService";

export type {
  ValidationErrorType,
  ValidationError,
  ValidationResult,
  ValidationRule,
} from "./validationService";
