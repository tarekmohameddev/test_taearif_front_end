// خدمة إدارة ثيمات المكونات

import { getComponentDefaultTheme } from "@/lib/ComponentsList";

// دالة الحصول على الثيم الافتراضي لنوع المكون
export const getDefaultThemeForType = (type: string): string => {
  return getComponentDefaultTheme(type);
};

// دالة التحقق من صحة الثيم
export const isValidTheme = (theme: string, componentType: string): boolean => {
  if (!theme || typeof theme !== "string") {
    return false;
  }

  // التحقق من أن الثيم يتبع النمط الصحيح
  const themePattern = new RegExp(`^${componentType}\\d+$`);
  return themePattern.test(theme);
};

// دالة إنشاء ثيم جديد
export const createThemeName = (
  componentType: string,
  number: number = 1,
): string => {
  return `${componentType}${number}`;
};

// دالة استخراج رقم الثيم
export const extractThemeNumber = (theme: string): number => {
  const match = theme.match(/\d+$/);
  return match ? parseInt(match[0], 10) : 1;
};

// دالة إنشاء ثيم فريد
export const generateUniqueTheme = (
  componentType: string,
  existingThemes: string[],
): string => {
  let counter = 1;
  let newTheme = createThemeName(componentType, counter);

  while (existingThemes.includes(newTheme)) {
    counter++;
    newTheme = createThemeName(componentType, counter);
  }

  return newTheme;
};

// دالة الحصول على جميع الثيمات المتاحة لنوع معين
export const getAvailableThemesForType = (
  componentType: string,
  maxThemes: number = 10,
): string[] => {
  const themes: string[] = [];

  for (let i = 1; i <= maxThemes; i++) {
    themes.push(createThemeName(componentType, i));
  }

  return themes;
};

// دالة التحقق من وجود ثيم معين
export const themeExists = (
  theme: string,
  availableThemes: string[],
): boolean => {
  return availableThemes.includes(theme);
};
