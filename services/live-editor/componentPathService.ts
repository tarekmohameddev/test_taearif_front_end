// خدمة إدارة مسارات المكونات
import {
  SECTIONS,
  COMPONENTS,
  getSectionPath as getCentralSectionPath,
  getComponentSubPath as getCentralComponentSubPath,
} from "@/lib-liveeditor/ComponentsList";

// استخدام القائمة المركزية للأقسام والمكونات
export const SECTION_PATHS: Record<string, string> = Object.fromEntries(
  Object.entries(SECTIONS).map(([key, section]) => [key, section.path]),
);

export const COMPONENT_SUB_PATHS: Record<string, string> = Object.fromEntries(
  Object.entries(COMPONENTS).map(([key, component]) => [
    key,
    component.subPath,
  ]),
);

// دالة الحصول على مسار القسم
export const getSectionPath = (section: string): string => {
  return getCentralSectionPath(section);
};

// دالة الحصول على مسار المكون الفرعي
export const getComponentSubPath = (baseName: string): string | undefined => {
  return getCentralComponentSubPath(baseName);
};

// دالة إنشاء المسار الكامل للمكون
export const createComponentPath = (
  section: string,
  componentName: string,
): string => {
  const sectionPath = getSectionPath(section);
  return `${sectionPath}/${componentName}`;
};

// دالة التحقق من صحة مسار القسم
export const isValidSection = (section: string): boolean => {
  return !!getSectionPath(section);
};

// دالة التحقق من صحة نوع المكون
export const isValidComponentType = (baseName: string): boolean => {
  return !!getComponentSubPath(baseName);
};
