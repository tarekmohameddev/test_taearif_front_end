/**
 * File Reading System for AI-Friendly Debugger
 * Reads debug data from organized JSON files for AI analysis
 * Server-side only (uses fs/promises)
 */

import { AIFriendlyEvent, ComponentTrace, StoreSnapshot, DataFlowStep, DetailedPerformanceMetrics, EventSearchFilters } from "../core/types";
import { getLogsDir, isDebugEnabled } from "../core/config";

// Dynamic import for fs/promises and path (server-side only)
let fs: typeof import("fs/promises") | null = null;
let path: typeof import("path") | null = null;

// Lazy load fs and path only in server-side
async function getFs() {
  if (typeof window !== "undefined") {
    // Client-side: return null
    return null;
  }
  if (!fs) {
    fs = await import("fs/promises");
    path = await import("path");
  }
  return fs;
}

function getPath() {
  if (typeof window !== "undefined") {
    return null;
  }
  return path;
}

class FileReader {
  private logsDir: string;

  constructor() {
    if (typeof window !== "undefined") {
      // Client-side: initialize with dummy value
      this.logsDir = "";
      return;
    }
    this.logsDir = getLogsDir();
  }

  /**
   * Check if running in server-side
   */
  private isServerSide(): boolean {
    return typeof window === "undefined";
  }

  /**
   * Read from file
   */
  private async readFromFile(relativePath: string): Promise<any> {
    if (!this.isServerSide()) return [];
    
    const pathModule = getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) return [];
    
    const filePath = pathModule.join(this.logsDir, relativePath);
    try {
      const content = await fsModule.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  /**
   * Read events by filters (smart file selection)
   */
  async getEvents(filters: EventSearchFilters): Promise<AIFriendlyEvent[]> {
    if (!isDebugEnabled() || !this.isServerSide()) return [];

    // Smart file selection based on filters
    if (filters.eventType) {
      return this.readFromFile(`events/by-type/${filters.eventType}.json`);
    }

    if (filters.componentId && filters.componentType && filters.variant) {
      return this.readFromFile(
        `events/by-component/${filters.componentType}/${filters.variant}/${filters.componentId}.json`
      );
    }

    if (filters.fieldPath) {
      return this.readFromFile(`events/by-field/${filters.fieldPath}.json`);
    }

    if (filters.date) {
      return this.readFromFile(`events/by-date/${filters.date}/events.json`);
    }

    if (filters.sessionId) {
      return this.readFromFile(`events/by-session/${filters.sessionId}/events.json`);
    }

    // Default: read from latest
    return this.readFromFile("events/latest/all-events.json");
  }

  /**
   * Read component trace
   */
  async getComponentTrace(componentId: string, componentType: string): Promise<ComponentTrace | null> {
    if (!isDebugEnabled() || !this.isServerSide()) return null;

    try {
      return await this.readFromFile(`traces/by-component/${componentType}/${componentId}.json`);
    } catch {
      return null;
    }
  }

  /**
   * Read store snapshots
   */
  async getStoreSnapshots(filters: {
    componentId?: string;
    componentType?: string;
    date?: string;
    operation?: string;
  }): Promise<StoreSnapshot[]> {
    if (!isDebugEnabled() || !this.isServerSide()) return [];

    if (filters.componentId && filters.componentType) {
      return this.readFromFile(
        `snapshots/by-component/${filters.componentType}/${filters.componentId}/timeline.json`
      );
    }

    if (filters.date) {
      return this.readFromFile(`snapshots/by-date/${filters.date}/snapshots.json`);
    }

    if (filters.operation) {
      return this.readFromFile(
        `snapshots/by-operation/${filters.operation}/after/${filters.componentId}.json`
      );
    }

    return [];
  }

  /**
   * Read data flow
   */
  async getDataFlow(filters: {
    componentId?: string;
    componentType?: string;
    date?: string;
    operationType?: string;
  }): Promise<DataFlowStep[] | { mergeOps: DataFlowStep[]; priorityDecisions: any[]; dataSources: any[] } | null> {
    if (!isDebugEnabled() || !this.isServerSide()) return null;

    if (filters.componentId && filters.componentType) {
      if (filters.operationType) {
        return this.readFromFile(
          `data-flow/by-component/${filters.componentType}/${filters.componentId}/${filters.operationType}.json`
        );
      }

      // Return all data flow files for component
      const mergeOps = await this.readFromFile(
        `data-flow/by-component/${filters.componentType}/${filters.componentId}/merge-operations.json`
      );
      const priorityDecisions = await this.readFromFile(
        `data-flow/by-component/${filters.componentType}/${filters.componentId}/priority-decisions.json`
      );
      const dataSources = await this.readFromFile(
        `data-flow/by-component/${filters.componentType}/${filters.componentId}/data-sources.json`
      );

      return { mergeOps, priorityDecisions, dataSources };
    }

    if (filters.date) {
      return this.readFromFile(`data-flow/by-date/${filters.date}/data-flow.json`);
    }

    return null;
  }

  /**
   * Read performance metrics
   */
  async getPerformance(filters: {
    componentId?: string;
    componentType?: string;
    date?: string;
    metric?: string;
  }): Promise<DetailedPerformanceMetrics[]> {
    if (!isDebugEnabled() || !this.isServerSide()) return [];

    if (filters.componentId && filters.componentType) {
      const performance = await this.readFromFile(
        `performance/by-component/${filters.componentType}/${filters.componentId}.json`
      );
      return Array.isArray(performance) ? performance : [performance];
    }

    if (filters.metric) {
      return this.readFromFile(`performance/by-metric/${filters.metric}.json`);
    }

    if (filters.date) {
      return this.readFromFile(`performance/by-date/${filters.date}/performance.json`);
    }

    return [];
  }

  /**
   * Read all traces
   */
  async getAllTraces(): Promise<ComponentTrace[]> {
    if (!isDebugEnabled() || !this.isServerSide()) return [];
    return this.readFromFile("traces/latest/all-traces.json");
  }

  /**
   * Read latest events
   */
  async getLatestEvents(limit?: number): Promise<AIFriendlyEvent[]> {
    if (!isDebugEnabled() || !this.isServerSide()) return [];
    const events = await this.readFromFile("events/latest/recent-events.json");
    if (limit) {
      return events.slice(-limit);
    }
    return events;
  }

  /**
   * Read critical events
   */
  async getCriticalEvents(): Promise<AIFriendlyEvent[]> {
    if (!isDebugEnabled() || !this.isServerSide()) return [];
    return this.readFromFile("events/latest/critical-events.json");
  }
}

// Export singleton instance
export const fileReader = new FileReader();
