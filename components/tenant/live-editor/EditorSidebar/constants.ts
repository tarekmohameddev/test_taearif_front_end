import { AvailableSection } from "./types";
import {
  getComponentsBySection,
  getComponentsBySectionTranslated,
  COMPONENTS,
  getComponents,
} from "@/lib/ComponentsList";

// تعريفات الأقسام المتاحة للإضافة من القائمة المركزية (للتوافق مع الكود الموجود)
export const AVAILABLE_SECTIONS: AvailableSection[] = getComponentsBySection(
  "homepage",
).map((component) => ({
  type: component.id,
  name: component.displayName,
  section: component.section,
  component: component.name,
  description: component.description,
}));

// دالة للحصول على الأقسام المتاحة مع الترجمة
export const getAvailableSectionsTranslated = (
  t: (key: string) => string,
): AvailableSection[] => {
  return getComponentsBySectionTranslated("homepage", t).map((component) => ({
    type: component.id,
    name: component.displayName,
    section: component.section,
    component: component.name,
    description: component.description,
  }));
};

// أيقونات الأقسام من القائمة المركزية (للتوافق مع الكود الموجود)
export const SECTION_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(COMPONENTS).map(([key, component]) => [key, component.icon]),
);

// دالة للحصول على أيقونات الأقسام مع الترجمة
export const getSectionIconsTranslated = (
  t: (key: string) => string,
): Record<string, string> => {
  const components = getComponents(t);
  return Object.fromEntries(
    Object.entries(components).map(([key, component]) => [key, component.icon]),
  );
};

// الحصول على أيقونة القسم (للتوافق مع الكود الموجود)
export const getSectionIcon = (type: string): string => {
  return SECTION_ICONS[type] || "🎯";
};

// دالة للحصول على أيقونة القسم مع الترجمة
export const getSectionIconTranslated = (
  type: string,
  t: (key: string) => string,
): string => {
  const icons = getSectionIconsTranslated(t);
  return icons[type] || "🎯";
};
