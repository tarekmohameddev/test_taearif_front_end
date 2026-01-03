import React, { lazy } from "react";
import {
  getCachedComponent,
  setCachedComponent,
  createCacheKey,
} from "./componentCacheService";
import {
  getSectionPath,
  getComponentSubPath,
  isValidSection,
  isValidComponentType,
} from "./componentPathService";
import {
  parseComponentName,
  normalizeComponentName,
} from "./componentParserService";
import {
  createUnknownComponentFallback,
  createKnownComponentFallback,
} from "./componentFallbackService";

// Main function to load a component dynamically
export const loadComponent = (section: string, componentName: string) => {
  if (!componentName) return null;

  // إنشاء مفتاح فريد للمكون
  const cacheKey = createCacheKey(section, componentName);

  // التحقق من وجود المكون في الـ cache
  const cachedComponent = getCachedComponent(cacheKey);
  if (cachedComponent) {
    return cachedComponent;
  }

  // تحليل اسم المكون
  const { baseName, number } = parseComponentName(componentName);
  const normalizedComponentName = normalizeComponentName(baseName, number);

  // التحقق من صحة القسم
  if (!isValidSection(section)) {
    console.error("Invalid section:", section);
    return null;
  }

  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    // استخدام fallback للمكونات غير المعروفة
    const fallbackPath = "hero"; // استخدام hero كـ fallback
    const fallbackFullPath = `${fallbackPath}/${normalizedComponentName}`;

    const fallbackComponent = createUnknownComponentFallback(
      baseName,
      componentName,
      fallbackFullPath,
    );

    setCachedComponent(cacheKey, fallbackComponent);
    return fallbackComponent;
  }

  // إنشاء المسار الكامل للمكون
  const fullPath = `${subPath}/${normalizedComponentName}`;

  // إنشاء المكون الجديد وحفظه في الـ cache
  const lazyComponent = createKnownComponentFallback(
    baseName,
    componentName,
    fullPath,
  );

  // حفظ المكون في الـ cache
  setCachedComponent(cacheKey, lazyComponent);

  return lazyComponent;
};

// دالة تحميل مكون مع معالجة الأخطاء
export const loadComponentWithErrorHandling = async (
  section: string,
  componentName: string,
) => {
  try {
    return loadComponent(section, componentName);
  } catch (error) {
    console.error(
      `Error loading component ${componentName} for section ${section}:`,
      error,
    );
    return null;
  }
};

// دالة تحميل مكونات متعددة
export const loadMultipleComponents = (
  components: Array<{ section: string; componentName: string }>,
) => {
  return components
    .map(({ section, componentName }) => loadComponent(section, componentName))
    .filter(Boolean);
};

// دالة تحميل مكونات لصفحة معينة
export const loadPageComponents = (
  pageSlug: string,
  componentNames: string[],
) => {
  return componentNames
    .map((componentName) => loadComponent(pageSlug, componentName))
    .filter(Boolean);
};

// دالة التحقق من وجود مكون
export const componentExists = (
  section: string,
  componentName: string,
): boolean => {
  try {
    const component = loadComponent(section, componentName);
    return !!component;
  } catch {
    return false;
  }
};

// دالة الحصول على معلومات المكون
export const getComponentInfo = (section: string, componentName: string) => {
  const { baseName, number } = parseComponentName(componentName);
  const normalizedComponentName = normalizeComponentName(baseName, number);
  const subPath = getComponentSubPath(baseName);

  return {
    section,
    componentName,
    baseName,
    number,
    normalizedComponentName,
    subPath,
    fullPath: subPath ? `${subPath}/${normalizedComponentName}` : null,
    isValid: !!subPath,
  };
};
