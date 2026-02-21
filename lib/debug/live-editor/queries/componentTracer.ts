/**
 * Component Tracer
 * Traces component history
 */

import { ComponentTrace } from "../core/types";
import { fileReader } from "../utils/fileReader";

class ComponentTracer {
  /**
   * Trace component history
   */
  async trace(componentId: string, componentType: string): Promise<ComponentTrace | null> {
    // Get trace from file
    const trace = await fileReader.getComponentTrace(componentId, componentType);

    if (!trace) {
      return null;
    }

    // Get all events for this component
    const events = await fileReader.getEvents({
      componentId,
      componentType,
    });

    // Get snapshots
    const snapshots = await fileReader.getStoreSnapshots({
      componentId,
      componentType,
    });

    // Get data flow
    const dataFlow = await fileReader.getDataFlow({
      componentId,
      componentType,
    });

    return {
      ...trace,
      timeline: events,
      snapshots,
      dataFlowHistory: Array.isArray(dataFlow) ? dataFlow : [],
    };
  }

  /**
   * Get component timeline
   */
  async getComponentTimeline(componentId: string, componentType: string): Promise<any[]> {
    const trace = await this.trace(componentId, componentType);
    return trace?.timeline || [];
  }

  /**
   * Get component events
   */
  async getComponentEvents(componentId: string, componentType: string): Promise<any[]> {
    return fileReader.getEvents({
      componentId,
      componentType,
    });
  }

  /**
   * Get component data flow
   */
  async getComponentDataFlow(componentId: string, componentType: string): Promise<any> {
    return fileReader.getDataFlow({
      componentId,
      componentType,
    });
  }

  /**
   * Get component snapshots
   */
  async getComponentSnapshots(componentId: string, componentType: string): Promise<any[]> {
    return fileReader.getStoreSnapshots({
      componentId,
      componentType,
    });
  }
}

// Export singleton instance
export const componentTracer = new ComponentTracer();
