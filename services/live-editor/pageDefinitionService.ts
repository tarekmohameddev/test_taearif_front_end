import { ComponentInstance } from "@/lib/types";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";
import { PAGE_DEFINITIONS } from "@/lib/defaultComponents";

// إعادة تصدير PAGE_DEFINITIONS من defaultComponents.js
export { PAGE_DEFINITIONS };

// دالة مساعدة لتحويل البيانات من object إلى array
const convertObjectToArray = (
  pageData: Record<string, any>,
): ComponentInstance[] => {
  return Object.entries(pageData).map(([id, component]: [string, any]) => ({
    id,
    type: component.type,
    name: component.name,
    componentName: component.componentName,
    data: component.data,
    position: component.position || 0,
    layout: component.layout || { row: 0, col: 0, span: 2 },
  }));
};

// دالة مساعدة لتحويل البيانات من array إلى object
const convertArrayToObject = (
  components: ComponentInstance[],
): Record<string, any> => {
  const pageData: Record<string, any> = {};
  components.forEach((component, index) => {
    const id = component.id || `${component.type}-${Date.now()}-${index}`;
    pageData[id] = {
      type: component.type,
      name: component.name,
      componentName: component.componentName,
      data: component.data,
      position: (component as any).position || index,
      layout: (component as any).layout || { row: index, col: 0, span: 2 },
    };
  });
  return pageData;
};

// دالة الحصول على تعريف صفحة معينة
export const getPageDefinition = (
  pageSlug: string,
): ComponentInstance[] | undefined => {
  const pageData = (PAGE_DEFINITIONS as any)[pageSlug];
  if (!pageData) return undefined;

  return convertObjectToArray(pageData);
};

// دالة التحقق من وجود تعريف للصفحة
export const hasPageDefinition = (pageSlug: string): boolean => {
  return !!(PAGE_DEFINITIONS as any)[pageSlug];
};

// دالة الحصول على جميع أسماء الصفحات المعرفة
export const getDefinedPageNames = (): string[] => {
  return Object.keys(PAGE_DEFINITIONS as any);
};

// دالة إنشاء تعريف صفحة جديد
export const createPageDefinition = (
  pageSlug: string,
  components: ComponentInstance[],
): void => {
  (PAGE_DEFINITIONS as any)[pageSlug] = convertArrayToObject(components);
};

// دالة حذف تعريف صفحة
export const removePageDefinition = (pageSlug: string): boolean => {
  if ((PAGE_DEFINITIONS as any)[pageSlug]) {
    delete (PAGE_DEFINITIONS as any)[pageSlug];
    return true;
  }
  return false;
};

// دالة تحديث تعريف صفحة موجودة
export const updatePageDefinition = (
  pageSlug: string,
  components: ComponentInstance[],
): boolean => {
  const pageDefs = PAGE_DEFINITIONS as any;
  if (pageDefs[pageSlug]) {
    pageDefs[pageSlug] = convertArrayToObject(components);
    return true;
  }
  return false;
};

// دالة الحصول على عدد المكونات في صفحة معينة
export const getPageComponentCount = (pageSlug: string): number => {
  const definition = getPageDefinition(pageSlug);
  return definition ? definition.length : 0;
};
