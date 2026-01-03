// استيراد البيانات الافتراضية من defaultData.json
import defaultData from "./defaultData.json";

// تعريف الصفحات المتاحة وأقسامها من defaultData.json
export const PAGE_DEFINITIONS = defaultData.componentSettings;

// Export للتوافق مع الكود القديم
export const defaultComponents = PAGE_DEFINITIONS;

