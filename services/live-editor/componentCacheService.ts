import React, { lazy } from "react";
import { debugLogger } from "@/lib/debugLogger";

// Cache للمكونات المحملة - خارج المكون لتجنب إعادة الإنشاء
const componentCache = new Map<string, React.LazyExoticComponent<any>>();

// دالة التحقق من وجود المكون في الـ cache
export const getCachedComponent = (
  cacheKey: string,
): React.LazyExoticComponent<any> | undefined => {
  const component = componentCache.get(cacheKey);

  debugLogger.log("COMPONENT_CACHE", "GET", {
    cacheKey,
    hit: !!component,
  });

  return component;
};

// دالة حفظ المكون في الـ cache
export const setCachedComponent = (
  cacheKey: string,
  component: React.LazyExoticComponent<any>,
): void => {
  componentCache.set(cacheKey, component);

  debugLogger.log("COMPONENT_CACHE", "SET", {
    cacheKey,
  });
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

  debugLogger.log("COMPONENT_CACHE", "CLEAR", {
    cacheKey: cacheKey || "ALL",
    size: componentCache.size,
  });
};

// دالة الحصول على حجم cache
export const getCacheSize = (): number => {
  return componentCache.size;
};

// دالة الحصول على جميع مفاتيح cache
export const getCacheKeys = (): string[] => {
  return Array.from(componentCache.keys());
};
