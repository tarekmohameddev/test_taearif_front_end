// خدمة إدارة الحوارات

// أنواع الحوارات المتاحة
export type DialogType =
  | "delete-component"
  | "delete-page"
  | "confirm-action"
  | "error"
  | "success";

// واجهة إعدادات الحوار
export interface DialogConfig {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  requiresConfirmation?: boolean;
  confirmationText?: string;
}

// إدارة حالة الحوارات
export class DialogManager {
  private static instance: DialogManager;
  private dialogs: Map<string, DialogConfig> = new Map();

  static getInstance(): DialogManager {
    if (!DialogManager.instance) {
      DialogManager.instance = new DialogManager();
    }
    return DialogManager.instance;
  }

  // إضافة حوار جديد
  addDialog(id: string, config: DialogConfig): void {
    this.dialogs.set(id, config);
  }

  // الحصول على حوار
  getDialog(id: string): DialogConfig | undefined {
    return this.dialogs.get(id);
  }

  // حذف حوار
  removeDialog(id: string): boolean {
    return this.dialogs.delete(id);
  }

  // التحقق من وجود حوار
  hasDialog(id: string): boolean {
    return this.dialogs.has(id);
  }

  // الحصول على جميع الحوارات
  getAllDialogs(): Map<string, DialogConfig> {
    return new Map(this.dialogs);
  }

  // مسح جميع الحوارات
  clearAllDialogs(): void {
    this.dialogs.clear();
  }
}

// إعدادات الحوارات الافتراضية
export const DEFAULT_DIALOG_CONFIGS: Record<
  DialogType,
  Partial<DialogConfig>
> = {
  "delete-component": {
    title: "Delete Section Permanently",
    message:
      "This section will be completely removed from your website along with all associated data.",
    confirmText: "Delete Permanently",
    cancelText: "Cancel",
    isDestructive: true,
  },
  "delete-page": {
    title: "Delete Page Permanently",
    message: "This action will remove the entire page and all its components",
    confirmText: "Yes, I'm Sure",
    cancelText: "Cancel",
    isDestructive: true,
    requiresConfirmation: true,
    confirmationText: "I am sure I want to delete this page",
  },
  "confirm-action": {
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    isDestructive: false,
  },
  error: {
    title: "Error",
    message: "An error occurred. Please try again.",
    confirmText: "OK",
    isDestructive: false,
  },
  success: {
    title: "Success",
    message: "Operation completed successfully.",
    confirmText: "OK",
    isDestructive: false,
  },
};

// دالة إنشاء إعدادات حوار حذف المكون
export const createDeleteComponentDialog = (
  componentName: string,
): DialogConfig => {
  return {
    type: "delete-component",
    title: "Delete Section Permanently",
    message: `Are you sure you want to delete "${componentName}"? This action cannot be undone.`,
    confirmText: "Delete Permanently",
    cancelText: "Cancel",
    isDestructive: true,
  };
};

// دالة إنشاء إعدادات حوار حذف الصفحة
export const createDeletePageDialog = (pageName: string): DialogConfig => {
  return {
    type: "delete-page",
    title: "Delete Page Permanently",
    message: `Are you sure you want to delete "${pageName}"? This will remove all components and data permanently.`,
    confirmText: "Yes, I'm Sure",
    cancelText: "Cancel",
    isDestructive: true,
    requiresConfirmation: true,
    confirmationText: "I am sure I want to delete this page",
  };
};

// دالة إنشاء إعدادات حوار تأكيد عام
export const createConfirmDialog = (
  title: string,
  message: string,
  isDestructive: boolean = false,
): DialogConfig => {
  return {
    type: "confirm-action",
    title,
    message,
    confirmText: "Confirm",
    cancelText: "Cancel",
    isDestructive,
  };
};

// دالة إنشاء إعدادات حوار خطأ
export const createErrorDialog = (message: string): DialogConfig => {
  return {
    type: "error",
    title: "Error",
    message,
    confirmText: "OK",
    isDestructive: false,
  };
};

// دالة إنشاء إعدادات حوار نجاح
export const createSuccessDialog = (message: string): DialogConfig => {
  return {
    type: "success",
    title: "Success",
    message,
    confirmText: "OK",
    isDestructive: false,
  };
};

// دالة التحقق من صحة إعدادات الحوار
export const validateDialogConfig = (config: DialogConfig): boolean => {
  if (!config.type || !config.title || !config.message) {
    return false;
  }

  if (config.requiresConfirmation && !config.confirmationText) {
    return false;
  }

  return true;
};

// دالة الحصول على الإعدادات الافتراضية لنوع الحوار
export const getDefaultDialogConfig = (
  type: DialogType,
): Partial<DialogConfig> => {
  return DEFAULT_DIALOG_CONFIGS[type] || {};
};
