/**
 * Data Formatter
 * Formats data snapshots and states
 */

/**
 * Format data snapshot
 */
export function formatDataSnapshot(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

/**
 * Format before/after states
 */
export function formatBeforeAfter(before: any, after: any): { before: string; after: string } {
  return {
    before: formatDataSnapshot(before),
    after: formatDataSnapshot(after),
  };
}

/**
 * Format merged data
 */
export function formatMergedData(mergedData: any): string {
  return formatDataSnapshot(mergedData);
}

/**
 * Format component data
 */
export function formatComponentData(componentData: any): string {
  return formatDataSnapshot(componentData);
}

/**
 * Format data for AI consumption
 */
export function formatDataForAI(data: any): any {
  // Remove circular references and format
  try {
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        return value;
      })
    );
  } catch {
    return data;
  }
}

export const dataFormatter = {
  formatDataSnapshot,
  formatBeforeAfter,
  formatMergedData,
  formatComponentData,
  formatDataForAI,
};
