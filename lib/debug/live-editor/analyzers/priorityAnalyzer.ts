/**
 * Priority Analyzer
 * Analyzes priority decisions and conflicts
 */

import { DataFlowStep, DecisionPoint } from "../core/types";

class PriorityAnalyzer {
  /**
   * Analyze priority decisions
   */
  analyzePriorityDecisions(dataFlow: DataFlowStep): {
    decisions: DecisionPoint[];
    conflicts: any[];
    order: string[];
  } {
    const decisions = dataFlow.priorityDecisions || [];
    const conflicts = dataFlow.conflicts || [];
    const order = dataFlow.merge?.order || dataFlow.sources.map((s) => s.name);

    return {
      decisions,
      conflicts,
      order,
    };
  }

  /**
   * Identify priority conflicts
   */
  identifyPriorityConflicts(dataFlow: DataFlowStep): any[] {
    const conflicts: any[] = [];

    // Check for conflicting priorities
    const priorities = dataFlow.sources.map((s) => s.priority);
    const uniquePriorities = new Set(priorities);

    if (uniquePriorities.size !== priorities.length) {
      conflicts.push({
        type: "duplicate_priority",
        message: "Multiple sources have the same priority",
        sources: dataFlow.sources.filter((s, i) => priorities.indexOf(s.priority) !== i),
      });
    }

    // Check for unused sources
    const unusedSources = dataFlow.sources.filter((s) => !s.used);
    if (unusedSources.length > 0) {
      conflicts.push({
        type: "unused_sources",
        message: "Some data sources were not used in merge",
        sources: unusedSources,
      });
    }

    return [...conflicts, ...(dataFlow.conflicts || [])];
  }

  /**
   * Analyze priority order
   */
  analyzePriorityOrder(dataFlow: DataFlowStep): {
    order: string[];
    isValid: boolean;
    issues: string[];
  } {
    const order = dataFlow.merge?.order || dataFlow.sources.map((s) => s.name);
    const issues: string[] = [];

    // Check if order matches priority
    const sortedByPriority = [...dataFlow.sources].sort((a, b) => b.priority - a.priority);
    const expectedOrder = sortedByPriority.map((s) => s.name);

    if (JSON.stringify(order) !== JSON.stringify(expectedOrder)) {
      issues.push("Priority order does not match expected order based on priority values");
    }

    return {
      order,
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Suggest priority fixes
   */
  suggestPriorityFixes(dataFlow: DataFlowStep): string[] {
    const suggestions: string[] = [];
    const conflicts = this.identifyPriorityConflicts(dataFlow);

    conflicts.forEach((conflict) => {
      if (conflict.type === "duplicate_priority") {
        suggestions.push("Assign unique priorities to each data source");
      } else if (conflict.type === "unused_sources") {
        suggestions.push("Review why some sources are not being used in merge");
      }
    });

    const orderAnalysis = this.analyzePriorityOrder(dataFlow);
    if (!orderAnalysis.isValid) {
      suggestions.push("Reorder merge sources to match priority values");
    }

    return suggestions;
  }
}

// Export singleton instance
export const priorityAnalyzer = new PriorityAnalyzer();
