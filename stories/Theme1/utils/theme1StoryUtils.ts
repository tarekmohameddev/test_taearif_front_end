/**
 * Utils for Theme1 Storybook: read theme1 component list and resolve import paths.
 * Uses existing getComponentSubPath from @/lib/ComponentsList. No app logic changes.
 */

import { getComponentSubPath } from "@/lib/ComponentsList";
import type { Theme1ComponentMeta } from "../types";
import themesComponentsList from "@/lib/themes/themesComponentsList.json";

function extractBaseName(componentName: string): string {
  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) return componentName;
  const base = match[1];
  if (base === "propertyDetail" || base.toLowerCase() === "propertydetail") {
    return "propertyDetail";
  }
  return base;
}

/**
 * Returns Theme1 component names from themesComponentsList.json.
 */
export function getTheme1ComponentNames(): string[] {
  const list = themesComponentsList as { theme1?: string[] };
  return list.theme1 ?? [];
}

/**
 * Builds import path and metadata for a theme1 component name.
 */
export function getTheme1ComponentMeta(componentName: string): Theme1ComponentMeta | null {
  const baseName = extractBaseName(componentName);
  const subPath = getComponentSubPath(baseName);
  if (!subPath) return null;
  const importPath = `@/components/tenant/${subPath}/${componentName}`;
  return {
    componentName,
    baseName,
    subPath,
    importPath,
  };
}

/**
 * Returns all theme1 components with valid import paths (skips unresolved).
 */
export function getTheme1ComponentsMeta(): Theme1ComponentMeta[] {
  const names = getTheme1ComponentNames();
  const result: Theme1ComponentMeta[] = [];
  for (const name of names) {
    const meta = getTheme1ComponentMeta(name);
    if (meta) result.push(meta);
  }
  return result;
}
