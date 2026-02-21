/**
 * Data Flow Tracker
 * Tracks data sources, merge operations, and priority decisions
 */

import { DataFlowStep, DataSource, DecisionPoint, MergeInfo } from "../core/types";
import { useDebugStore } from "../core/debugStore";
import { fileWriter } from "../utils/fileWriter";
import { isDebugEnabled } from "../core/config";

class DataFlowTracker {
  private dataFlowHistory: DataFlowStep[] = [];

  /**
   * Track data flow
   */
  trackDataFlow(
    componentId: string,
    componentType: string,
    operationType: DataFlowStep["operationType"],
    sources: DataSource[],
    merge?: MergeInfo,
    priorityDecisions?: DecisionPoint[],
    result?: any,
    conflicts?: any[]
  ): void {
    if (!isDebugEnabled()) return;

    const dataFlow: DataFlowStep = {
      timestamp: new Date().toISOString(),
      componentId,
      componentType,
      operationType,
      sources,
      merge,
      priorityDecisions,
      result,
      conflicts,
    };

    // Add to store
    useDebugStore.getState().addDataFlow(dataFlow);

    // Add to local history
    this.dataFlowHistory.push(dataFlow);

    // Write to file
    fileWriter.writeDataFlow(dataFlow);
  }

  /**
   * Track merge operation
   */
  trackMerge(
    componentId: string,
    componentType: string,
    sources: DataSource[],
    merge: MergeInfo,
    result: any,
    conflicts?: any[]
  ): void {
    this.trackDataFlow(componentId, componentType, "merge", sources, merge, undefined, result, conflicts);
  }

  /**
   * Track priority decision
   */
  trackPriorityDecision(
    componentId: string,
    componentType: string,
    sources: DataSource[],
    decisions: DecisionPoint[],
    result: any
  ): void {
    this.trackDataFlow(componentId, componentType, "priority-override", sources, undefined, decisions, result);
  }

  /**
   * Track data source change
   */
  trackDataSourceChange(
    componentId: string,
    componentType: string,
    sources: DataSource[],
    result: any
  ): void {
    this.trackDataFlow(componentId, componentType, "data-source-change", sources, undefined, undefined, result);
  }

  /**
   * Get data flow history
   */
  getDataFlowHistory(componentId?: string): DataFlowStep[] {
    if (componentId) {
      return this.dataFlowHistory.filter((df) => df.componentId === componentId);
    }
    return [...this.dataFlowHistory];
  }

  /**
   * Start tracking
   */
  start(): void {
    this.dataFlowHistory = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    this.dataFlowHistory = [];
  }
}

// Export singleton instance
export const dataFlowTracker = new DataFlowTracker();
