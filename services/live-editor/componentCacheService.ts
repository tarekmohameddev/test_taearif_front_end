import React, { lazy } from "react";

// Cache للمكونات المحملة - خارج المكون لتجنب إعادة الإنشاء
const componentCache = new Map<string, React.LazyExoticComponent<any>>();

// دالة التحقق من وجود المكون في الـ cache
export const getCachedComponent = (
  cacheKey: string,
): React.LazyExoticComponent<any> | undefined => {
  return componentCache.get(cacheKey);
};

// دالة حفظ المكون في الـ cache
export const setCachedComponent = (
  cacheKey: string,
  component: React.LazyExoticComponent<any>,
): void => {
  componentCache.set(cacheKey, component);
};

// دالة إنشاء مفتاح cache للمكون
export const createCacheKey = (
  section: string,
  componentName: string,
): string => {
  return `${section}:${componentName}`;
};

// دالة مسح cache معين
export const clearComponentCache = (cacheKey?: string): void => {
  if (cacheKey) {
    componentCache.delete(cacheKey);
  } else {
    componentCache.clear();
  }
};

// دالة الحصول على حجم cache
export const getCacheSize = (): number => {
  return componentCache.size;
};

// دالة الحصول على جميع مفاتيح cache
export const getCacheKeys = (): string[] => {
  return Array.from(componentCache.keys());
};
