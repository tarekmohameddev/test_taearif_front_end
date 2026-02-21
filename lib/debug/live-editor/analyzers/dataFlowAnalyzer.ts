/**
 * Data Flow Analyzer
 * Analyzes data flow and merge process
 */

import { DataFlowStep, DataSource, MergeInfo } from "../core/types";

class DataFlowAnalyzer {
  /**
   * Analyze data flow
   */
  analyzeDataFlow(dataFlow: DataFlowStep): {
    sources: DataSource[];
    mergeProcess: MergeInfo | null;
    conflicts: any[];
    priorityOrder: string[];
  } {
    return {
      sources: dataFlow.sources,
      mergeProcess: dataFlow.merge || null,
      conflicts: dataFlow.conflicts || [],
      priorityOrder: dataFlow.merge?.order || dataFlow.sources.map((s) => s.name),
    };
  }

  /**
   * Identify data sources
   */
  identifyDataSources(dataFlow: DataFlowStep): DataSource[] {
    return dataFlow.sources;
  }

  /**
   * Analyze merge process
   */
  analyzeMergeProcess(dataFlow: DataFlowStep): {
    method: string;
    order: string[];
    result: any;
    success: boolean;
  } {
    if (!dataFlow.merge) {
      return {
        method: "none",
        order: [],
        result: null,
        success: false,
      };
    }

    return {
      method: dataFlow.merge.method,
      order: dataFlow.merge.order,
      result: dataFlow.merge.result,
      success: dataFlow.merge.result !== null && dataFlow.merge.result !== undefined,
    };
  }

  /**
   * Analyze priority decisions
   */
  analyzePriorityDecisions(dataFlow: DataFlowStep): {
    decisions: any[];
    conflicts: any[];
    finalPriority: string[];
  } {
    const decisions = dataFlow.priorityDecisions || [];
    const conflicts = dataFlow.conflicts || [];
    const finalPriority = dataFlow.merge?.order || dataFlow.sources.map((s) => s.name).sort();

    return {
      decisions,
      conflicts,
      finalPriority,
    };
  }

  /**
   * Detect merge conflicts
   */
  detectMergeConflicts(dataFlow: DataFlowStep): any[] {
    return dataFlow.conflicts || [];
  }
}

// Export singleton instance
export const dataFlowAnalyzer = new DataFlowAnalyzer();
