/**
 * Diff Analyzer
 * Analyzes before/after diffs
 */

import { diffUtils } from "../utils/diffUtils";

class DiffAnalyzer {
  /**
   * Analyze before/after diff
   */
  analyzeDiff(before: any, after: any): {
    hasChanges: boolean;
    changes: any;
    changeCount: number;
    affectedKeys: string[];
  } {
    const diff = diffUtils.calculateDiff(before, after);
    const affectedKeys = Object.keys(diff.changes || {});

    return {
      hasChanges: diff.hasChanges,
      changes: diff.changes,
      changeCount: affectedKeys.length,
      affectedKeys,
    };
  }

  /**
   * Identify changes
   */
  identifyChanges(before: any, after: any): {
    added: string[];
    removed: string[];
    modified: string[];
  } {
    const diff = diffUtils.calculateDiff(before, after);
    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    Object.keys(diff.changes || {}).forEach((key) => {
      const change = diff.changes[key];
      if (change.added !== undefined) {
        added.push(key);
      } else if (change.removed !== undefined) {
        removed.push(key);
      } else if (change.before !== undefined && change.after !== undefined) {
        modified.push(key);
      }
    });

    return {
      added,
      removed,
      modified,
    };
  }

  /**
   * Analyze change impact
   */
  analyzeChangeImpact(before: any, after: any): {
    impact: "low" | "medium" | "high";
    affectedFields: string[];
    description: string;
  } {
    const changes = this.identifyChanges(before, after);
    const totalChanges = changes.added.length + changes.removed.length + changes.modified.length;

    let impact: "low" | "medium" | "high" = "low";
    if (totalChanges > 10) {
      impact = "high";
    } else if (totalChanges > 5) {
      impact = "medium";
    }

    const description = `Total changes: ${totalChanges}. Added: ${changes.added.length}, Removed: ${changes.removed.length}, Modified: ${changes.modified.length}`;

    return {
      impact,
      affectedFields: [...changes.added, ...changes.removed, ...changes.modified],
      description,
    };
  }

  /**
   * Compare states
   */
  compareStates(state1: any, state2: any): {
    areEqual: boolean;
    differences: any;
  } {
    const areEqual = diffUtils.compareObjects(state1, state2);
    const differences = diffUtils.calculateDiff(state1, state2);

    return {
      areEqual,
      differences: differences.changes,
    };
  }
}

// Export singleton instance
export const diffAnalyzer = new DiffAnalyzer();
