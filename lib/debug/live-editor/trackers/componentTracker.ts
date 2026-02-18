/**
 * Component Tracker
 * Tracks component renders, props, and source files
 */

import { ComponentTrace, RenderInfo } from "../core/types";
import { useDebugStore } from "../core/debugStore";
import { fileWriter } from "../utils/fileWriter";
import { getSessionId } from "../core/config";

class ComponentTracker {
  private renderHistory: Map<string, RenderInfo[]> = new Map();

  /**
   * Track component render
   */
  trackRender(
    componentId: string,
    componentType: string,
    variant: string,
    props: any,
    mergedData: any,
    duration: number
  ): void {
    const renderInfo: RenderInfo = {
      timestamp: new Date().toISOString(),
      props,
      mergedData,
      duration,
      renderCount: this.getRenderCount(componentId) + 1,
    };

    // Add to render history
    if (!this.renderHistory.has(componentId)) {
      this.renderHistory.set(componentId, []);
    }
    this.renderHistory.get(componentId)!.push(renderInfo);

    // Update component trace
    this.updateTrace(componentId, componentType, variant, renderInfo);
  }

  /**
   * Get render count
   */
  private getRenderCount(componentId: string): number {
    const history = this.renderHistory.get(componentId);
    return history ? history.length : 0;
  }

  /**
   * Update component trace
   */
  private updateTrace(
    componentId: string,
    componentType: string,
    variant: string,
    renderInfo: RenderInfo
  ): void {
    const store = useDebugStore.getState();
    const existingTrace = store.componentTraces.get(componentId);

    const trace: ComponentTrace = {
      componentId,
      componentType,
      variant,
      sessionId: getSessionId(),
      timeline: existingTrace?.timeline || [],
      dataFlowHistory: existingTrace?.dataFlowHistory || [],
      renderHistory: [...(existingTrace?.renderHistory || []), renderInfo],
      storeSnapshots: existingTrace?.storeSnapshots || [],
      createdAt: existingTrace?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update in store
    store.addTrace(trace);

    // Write to file
    fileWriter.writeTrace(trace);
  }

  /**
   * Start tracking
   */
  start(): void {
    // Component tracker is passive - no initialization needed
  }

  /**
   * Stop tracking
   */
  stop(): void {
    this.renderHistory.clear();
  }
}

// Export singleton instance
export const componentTracker = new ComponentTracker();
