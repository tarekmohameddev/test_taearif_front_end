/**
 * Lightweight path helpers for sections and components.
 * Built from ComponentsListGroups only — does not import ComponentsList.tsx
 * so tenant routes don't pull heavy component/structure deps.
 */

import {
  COMPONENT_IDS_BY_SECTION,
  SECTION_IDS,
  type SectionId,
} from "@/lib/ComponentsListGroups";

const SECTION_PATH: Record<string, string> = Object.fromEntries(
  SECTION_IDS.map((id) => [id, id])
);

const COMPONENT_SUBPATH: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const ids of Object.values(COMPONENT_IDS_BY_SECTION)) {
    for (const id of ids) {
      m[id] = id;
    }
  }
  m.propertyDetail = "propertyDetail";
  return m;
})();

/**
 * Section path for routing (e.g. homepage -> "homepage").
 */
export function getSectionPath(section: string): string {
  return SECTION_PATH[section] ?? section;
}

/**
 * Component subPath for routing. Normalizes propertyDetail.
 */
export function getComponentSubPath(baseName: string): string | undefined {
  const normalized =
    baseName === "propertyDetail" || baseName.toLowerCase() === "propertydetail"
      ? "propertyDetail"
      : baseName;
  return COMPONENT_SUBPATH[normalized];
}
