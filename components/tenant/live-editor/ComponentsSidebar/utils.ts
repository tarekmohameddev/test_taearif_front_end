import themesComponentsList from "@/lib/themes/themesComponentsList.json";
import { ThemeTab } from "./types";

/**
 * Extract base component name from variant name
 * Example: "hero1" -> "hero"
 */
export const getBaseComponentName = (componentName: string): string => {
  return componentName.replace(/\d+$/, "");
};

/**
 * Get variants for a section based on active theme
 */
export const getVariantsForSection = (
  sectionComponent: string,
  activeTab: ThemeTab,
): string[] => {
  const themeComponentNames =
    (themesComponentsList[activeTab] as string[]) || [];
  return themeComponentNames.filter(
    (name) => getBaseComponentName(name) === sectionComponent,
  );
};

/**
 * Extract variant suffix from variant name
 * Example: "hero1" -> "1"
 */
export const getVariantSuffix = (
  variantName: string,
  componentName: string,
): string => {
  if (variantName.startsWith(componentName)) {
    return variantName.slice(componentName.length);
  }
  return "";
};

/**
 * Build display label for component
 */
export const buildDisplayLabel = (
  sectionName: string,
  variantSuffix: string,
): string => {
  return variantSuffix && variantSuffix.length > 0
    ? `${sectionName} ${variantSuffix}`
    : sectionName;
};

/**
 * Check if category should be displayed even when empty
 */
export const shouldShowEmptyCategory = (
  category: string,
  activeTab: ThemeTab,
): boolean => {
  return category === "projectDisplay" && activeTab === "theme1";
};

/**
 * Get custom data for special components like blogPosts
 */
export const getCustomDataForComponent = (
  component: string,
  variantName?: string,
): Record<string, any> => {
  if (component === "blogPosts" && variantName === "blogPosts1") {
    return {
      dataSource: {
        apiUrl: "/api/posts",
        enabled: true,
      },
      content: {
        title: "المدونة",
        subtitle: "اكتشف أحدث المقالات والأخبار",
      },
    };
  }
  return {};
};

/**
 * Get component type and variant for special cases
 */
export const getComponentTypeAndVariant = (
  component: string,
  variantName?: string,
): { componentType: string; variant: string } => {
  if (component === "blogPosts" && variantName === "blogPosts1") {
    return {
      componentType: "grid",
      variant: "grid1",
    };
  }
  return {
    componentType: component,
    variant: variantName || "",
  };
};
