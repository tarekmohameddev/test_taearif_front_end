/**
 * Diff Calculation Utilities
 * Calculates differences between objects
 */

/**
 * Calculate deep diff between two objects
 */
export function calculateDiff(before: any, after: any): any {
  if (before === after) {
    return { hasChanges: false, changes: {} };
  }

  if (before === null || before === undefined) {
    return { hasChanges: true, changes: { added: after } };
  }

  if (after === null || after === undefined) {
    return { hasChanges: true, changes: { removed: before } };
  }

  if (typeof before !== "object" || typeof after !== "object") {
    return { hasChanges: before !== after, changes: { before, after } };
  }

  const changes: any = {};
  let hasChanges = false;

  // Check all keys in after
  Object.keys(after).forEach((key) => {
    if (!(key in before)) {
      changes[key] = { added: after[key] };
      hasChanges = true;
    } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      if (typeof before[key] === "object" && typeof after[key] === "object" && before[key] !== null && after[key] !== null) {
        const nestedDiff = calculateDiff(before[key], after[key]);
        if (nestedDiff.hasChanges) {
          changes[key] = nestedDiff.changes;
          hasChanges = true;
        }
      } else {
        changes[key] = { before: before[key], after: after[key] };
        hasChanges = true;
      }
    }
  });

  // Check removed keys
  Object.keys(before).forEach((key) => {
    if (!(key in after)) {
      changes[key] = { removed: before[key] };
      hasChanges = true;
    }
  });

  return { hasChanges, changes };
}

/**
 * Calculate shallow diff
 */
export function calculateShallowDiff(before: any, after: any): any {
  const changes: any = {};
  let hasChanges = false;

  const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);

  allKeys.forEach((key) => {
    if (before?.[key] !== after?.[key]) {
      changes[key] = { before: before?.[key], after: after?.[key] };
      hasChanges = true;
    }
  });

  return { hasChanges, changes };
}

/**
 * Format diff for display
 */
export function formatDiff(diff: any): string {
  if (!diff.hasChanges) {
    return "No changes";
  }

  const lines: string[] = [];
  lines.push("Changes detected:");

  function formatChanges(changes: any, indent: string = "  "): void {
    Object.keys(changes).forEach((key) => {
      const change = changes[key];
      if (change.added !== undefined) {
        lines.push(`${indent}+ ${key}: ${JSON.stringify(change.added)}`);
      } else if (change.removed !== undefined) {
        lines.push(`${indent}- ${key}: ${JSON.stringify(change.removed)}`);
      } else if (change.before !== undefined && change.after !== undefined) {
        lines.push(`${indent}~ ${key}:`);
        lines.push(`${indent}  - ${JSON.stringify(change.before)}`);
        lines.push(`${indent}  + ${JSON.stringify(change.after)}`);
      } else if (typeof change === "object") {
        lines.push(`${indent}${key}:`);
        formatChanges(change, indent + "  ");
      }
    });
  }

  formatChanges(diff.changes);
  return lines.join("\n");
}

/**
 * Compare objects
 */
export function compareObjects(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export const diffUtils = {
  calculateDiff,
  calculateShallowDiff,
  formatDiff,
  compareObjects,
};
