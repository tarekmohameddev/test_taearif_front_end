import themesComponentsList from './themesComponentsList.json';

/**
 * Finds which theme a component belongs to by searching in themesComponentsList.json
 * @param componentName - The component name (e.g., "hero4", "propertyFilter2")
 * @returns Theme ID (e.g., "theme1", "theme2") or null if component is free or not found
 */
export function findThemeForComponent(componentName: string): string | null {
  // البحث في base (مكونات مجانية)
  if (themesComponentsList.base?.includes(componentName)) {
    return null; // مكون مجاني
  }
  
  // البحث في theme1
  if (themesComponentsList.theme1?.includes(componentName)) {
    return 'theme1';
  }
  
  // البحث في theme2
  if (themesComponentsList.theme2?.includes(componentName)) {
    return 'theme2';
  }
  
  return null; // لم يتم العثور عليه - يعتبر مجاني
}