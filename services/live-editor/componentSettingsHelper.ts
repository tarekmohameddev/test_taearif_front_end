/**
 * Helper function to normalize componentSettings format
 * Supports both Array and Object formats from database
 */

/**
 * Normalizes componentSettings page data to Object format
 * 
 * @param pageSettings - Can be Array or Object format
 * @returns Normalized Object format: { "id": component, ... }
 * 
 * @example
 * // Array format (from database)
 * normalizeComponentSettings([
 *   { id: "0", type: "hero", data: {...} },
 *   { id: "1", type: "propertySlider", data: {...} }
 * ])
 * // Returns: { "0": { id: "0", type: "hero", ... }, "1": { id: "1", ... } }
 * 
 * @example
 * // Object format (already normalized)
 * normalizeComponentSettings({
 *   "0": { type: "hero", data: {...} },
 *   "1": { type: "propertySlider", data: {...} }
 * })
 * // Returns: same object
 */
export function normalizeComponentSettings(
  pageSettings: any,
): Record<string, any> {
  // Handle Array format (from database)
  if (Array.isArray(pageSettings)) {
    const normalized: Record<string, any> = {};
    pageSettings.forEach((comp: any) => {
      if (comp && comp.id) {
        // Use id as key, keep full component object as value
        normalized[comp.id] = comp;
      }
    });
    return normalized;
  }

  // Handle Object format (already normalized)
  if (pageSettings && typeof pageSettings === "object") {
    return pageSettings;
  }

  // Handle null, undefined, or invalid formats
  return {};
}

