/**
 * File Writing System for AI-Friendly Debugger
 * Writes debug data to organized JSON files
 * Server-side only (uses fs/promises)
 */

import { AIFriendlyEvent, ComponentTrace, StoreSnapshot, DataFlowStep, DetailedPerformanceMetrics } from "../core/types";
import { getLogsDir, isDebugEnabled } from "../core/config";

// Dynamic import for fs/promises (server-side only).
// Use variables so webpack doesn't statically resolve Node built-ins in client bundle.
const NODE_FS = "fs/promises";
const NODE_PATH = "path";

let fs: typeof import("fs/promises") | null = null;
let path: typeof import("path") | null = null;

async function getFs(): Promise<typeof import("fs/promises") | null> {
  if (typeof window !== "undefined") return null;
  if (!fs) {
    try {
      fs = await import(/* webpackIgnore: true */ NODE_FS);
      path = await import(/* webpackIgnore: true */ NODE_PATH);
    } catch {
      return null;
    }
  }
  return fs;
}

function getPath() {
  if (typeof window !== "undefined") {
    return null;
  }
  return path;
}

class FileWriter {
  private logsDir: string;
  private basePath: string;

  constructor() {
    if (typeof window !== "undefined") {
      // Client-side: initialize with dummy values
      this.basePath = "";
      this.logsDir = "";
      return;
    }
    this.basePath = process.cwd();
    this.logsDir = getLogsDir();
    this.ensureDirectory();
  }

  /**
   * Check if running in server-side
   */
  private isServerSide(): boolean {
    return typeof window === "undefined";
  }

  /**
   * Ensure logs directory exists
   */
  private async ensureDirectory(): Promise<void> {
    if (!this.isServerSide()) return;
    
    try {
      const fsModule = await getFs();
      if (!fsModule) return;
      await fsModule.mkdir(this.logsDir, { recursive: true });
    } catch (error) {
      console.error("Error creating logs directory:", error);
    }
  }

  /**
   * Ensure directory for file exists
   */
  private async ensureDirectoryForFile(filePath: string): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    if (!pathModule) return;
    
    const dir = pathModule.dirname(filePath);
    try {
      const fsModule = await getFs();
      if (!fsModule) return;
      await fsModule.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory for ${filePath}:`, error);
    }
  }

  /**
   * Read file content
   */
  private async readFile(filePath: string): Promise<any[]> {
    if (!this.isServerSide()) return [];
    
    try {
      const fsModule = await getFs();
      if (!fsModule) return [];
      const content = await fsModule.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  /**
   * Check if event is critical
   */
  private isCriticalEvent(event: AIFriendlyEvent): boolean {
    const criticalTypes: AIFriendlyEvent["eventType"][] = [
      "SAVE_COMPLETED",
      "STORE_UPDATED",
      "MERGE_COMPLETED",
    ];
    return criticalTypes.includes(event.eventType);
  }

  /**
   * Write event to ALL relevant locations
   */
  async writeEvent(event: AIFriendlyEvent): Promise<void> {
    if (!isDebugEnabled() || !this.isServerSide()) return;

    const date = new Date(event.timestamp).toISOString().split("T")[0];
    const hour = new Date(event.timestamp).getHours();
    const hourRange = `${String(hour).padStart(2, "0")}-${String(hour + 1).padStart(2, "0")}`;

    // 1. Write to by-type
    await this.appendToFile(`events/by-type/${event.eventType}.json`, event);

    // 2. Write to by-component (full path)
    await this.appendToFile(
      `events/by-component/${event.context.component.type}/${event.context.component.variant}/${event.context.component.id}.json`,
      event
    );

    // 3. Write to by-date
    await this.appendToFile(`events/by-date/${date}/events.json`, event);

    // 4. Write to by-date/by-hour
    await this.appendToFile(`events/by-date/${date}/by-hour/${hourRange}.json`, event);

    // 5. Write to by-date/by-component-type
    await this.appendToFile(
      `events/by-date/${date}/by-component-type/${event.context.component.type}.json`,
      event
    );

    // 6. Write to by-session
    await this.appendToFile(`events/by-session/${event.sessionId}/events.json`, event);

    // 7. Write to by-field (if FIELD_UPDATED)
    if (event.eventType === "FIELD_UPDATED" && event.details.field) {
      await this.appendToFile(`events/by-field/${event.details.field.path}.json`, event);
    }

    // 8. Write to latest
    await this.appendToFile("events/latest/all-events.json", event, { maxItems: 1000 });
    await this.appendToFile("events/latest/recent-events.json", event, { maxItems: 100 });

    // 9. Write to critical-events (if important)
    if (this.isCriticalEvent(event)) {
      await this.appendToFile("events/latest/critical-events.json", event, { maxItems: 500 });
    }

    // 10. Update index
    await this.updateIndex("events/latest/index.json", event);

    // 11. Update date summary
    await this.updateDateSummary(`events/by-date/${date}/summary.json`, event);
  }

  /**
   * Write trace (overwrites component trace)
   */
  async writeTrace(trace: ComponentTrace): Promise<void> {
    if (!isDebugEnabled() || !this.isServerSide()) return;

    const date = new Date().toISOString().split("T")[0];

    // 1. Write to by-component (overwrite)
    await this.writeToFile(
      `traces/by-component/${trace.componentType}/${trace.componentId}.json`,
      trace,
      "overwrite"
    );

    // 2. Write to by-date (append)
    await this.appendToFile(`traces/by-date/${date}/traces.json`, trace);

    // 3. Write to by-session
    await this.appendToFile(`traces/by-session/${trace.sessionId}/traces.json`, trace);

    // 4. Write to latest
    await this.appendToFile("traces/latest/all-traces.json", trace);

    // 5. Update index
    await this.updateTraceIndex("traces/latest/index.json", trace);
  }

  /**
   * Write snapshot
   */
  async writeSnapshot(snapshot: StoreSnapshot): Promise<void> {
    if (!isDebugEnabled() || !this.isServerSide()) return;

    const date = new Date(snapshot.timestamp).toISOString().split("T")[0];

    // 1. Write to by-component (overwrite specific snapshot type)
    await this.writeToFile(
      `snapshots/by-component/${snapshot.componentType}/${snapshot.componentId}/${snapshot.type}.json`,
      snapshot,
      "overwrite"
    );

    // 2. Update timeline
    await this.appendToFile(
      `snapshots/by-component/${snapshot.componentType}/${snapshot.componentId}/timeline.json`,
      snapshot
    );

    // 3. Calculate and write diff
    const diff = this.calculateSnapshotDiff(snapshot);
    await this.appendToFile(
      `snapshots/by-component/${snapshot.componentType}/${snapshot.componentId}/diffs.json`,
      diff
    );

    // 4. Write to by-date
    await this.appendToFile(`snapshots/by-date/${date}/snapshots.json`, snapshot);

    // 5. Write to by-operation
    await this.writeToFile(
      `snapshots/by-operation/${snapshot.operation}/before/${snapshot.componentId}.json`,
      snapshot.before,
      "overwrite"
    );
    await this.writeToFile(
      `snapshots/by-operation/${snapshot.operation}/after/${snapshot.componentId}.json`,
      snapshot.after,
      "overwrite"
    );

    // 6. Write to latest
    await this.writeToFile(
      `snapshots/latest/${snapshot.storeType}-store.json`,
      snapshot,
      "overwrite"
    );
  }

  /**
   * Write data flow
   */
  async writeDataFlow(dataFlow: DataFlowStep): Promise<void> {
    if (!isDebugEnabled() || !this.isServerSide()) return;

    const date = new Date(dataFlow.timestamp).toISOString().split("T")[0];

    // 1. Write to by-component
    await this.appendToFile(
      `data-flow/by-component/${dataFlow.componentType}/${dataFlow.componentId}/${dataFlow.operationType}.json`,
      dataFlow
    );

    // 2. Write merge operations separately
    if (dataFlow.operationType === "merge") {
      await this.appendToFile(
        `data-flow/by-component/${dataFlow.componentType}/${dataFlow.componentId}/merge-operations.json`,
        dataFlow
      );
    }

    // 3. Write priority decisions separately
    if (dataFlow.priorityDecisions) {
      await this.appendToFile(
        `data-flow/by-component/${dataFlow.componentType}/${dataFlow.componentId}/priority-decisions.json`,
        dataFlow.priorityDecisions
      );
    }

    // 4. Write data sources separately
    await this.appendToFile(
      `data-flow/by-component/${dataFlow.componentType}/${dataFlow.componentId}/data-sources.json`,
      dataFlow.sources
    );

    // 5. Update merge timeline
    await this.appendToFile(
      `data-flow/by-component/${dataFlow.componentType}/${dataFlow.componentId}/merge-timeline.json`,
      {
        timestamp: dataFlow.timestamp,
        operation: dataFlow.operationType,
        result: dataFlow.result,
      }
    );

    // 6. Write to by-date
    await this.appendToFile(`data-flow/by-date/${date}/data-flow.json`, dataFlow);

    // 7. Write to by-operation
    await this.appendToFile(
      `data-flow/by-operation/${dataFlow.operationType}/${dataFlow.componentId}.json`,
      dataFlow
    );

    // 8. Write to latest
    await this.appendToFile("data-flow/latest/all-data-flows.json", dataFlow);
  }

  /**
   * Write performance metrics
   */
  async writePerformance(performance: DetailedPerformanceMetrics): Promise<void> {
    if (!isDebugEnabled() || !this.isServerSide()) return;

    const date = new Date(performance.timestamp).toISOString().split("T")[0];

    // 1. Write to by-component
    await this.writeToFile(
      `performance/by-component/${performance.componentType}/${performance.componentId}.json`,
      performance,
      "overwrite"
    );

    // 2. Write to by-date
    await this.appendToFile(`performance/by-date/${date}/performance.json`, performance);

    // 3. Write to by-metric
    await this.appendToFile("performance/by-metric/render-duration.json", {
      componentId: performance.componentId,
      duration: performance.renderDuration,
    });
    await this.appendToFile("performance/by-metric/store-update-duration.json", {
      componentId: performance.componentId,
      duration: performance.storeUpdateDuration,
    });

    // 4. Update latest summary
    await this.updatePerformanceSummary("performance/latest/performance-summary.json", performance);
  }

  /**
   * Append to file
   */
  private async appendToFile(relativePath: string, data: any, options?: { maxItems?: number }): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    if (!pathModule) return;
    
    const fsModule = await getFs();
    if (!fsModule) return;
    
    const filePath = pathModule.join(this.logsDir, relativePath);
    await this.ensureDirectoryForFile(filePath);

    try {
      const existing = await this.readFile(filePath);
      existing.push(data);

      // Limit items if specified
      const final = options?.maxItems ? existing.slice(-options.maxItems) : existing;

      await fsModule.writeFile(filePath, JSON.stringify(final, null, 2), "utf-8");
    } catch {
      await fsModule.writeFile(filePath, JSON.stringify([data], null, 2), "utf-8");
    }
  }

  /**
   * Write to file
   */
  private async writeToFile(
    relativePath: string,
    data: any,
    mode: "overwrite" | "append" = "overwrite"
  ): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    if (!pathModule) return;
    
    const fsModule = await getFs();
    if (!fsModule) return;
    
    const filePath = pathModule.join(this.logsDir, relativePath);
    await this.ensureDirectoryForFile(filePath);

    if (mode === "overwrite") {
      await fsModule.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    } else {
      await this.appendToFile(relativePath, data);
    }
  }

  /**
   * Update index
   */
  private async updateIndex(indexPath: string, event: AIFriendlyEvent): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) return;
    
    const filePath = pathModule.join(this.logsDir, indexPath);
    await this.ensureDirectoryForFile(filePath);

    try {
      const index = await this.readFile(filePath);
      if (Array.isArray(index)) {
        // If it's an array, convert to index object
        const newIndex: any = {
          byType: {},
          byComponent: {},
          byDate: {},
          lastUpdated: new Date().toISOString(),
        };
        newIndex.byType[event.eventType] = 1;
        newIndex.byComponent[event.context.component.id] = 1;
        await fsModule.writeFile(filePath, JSON.stringify(newIndex, null, 2), "utf-8");
      } else {
        index.byType[event.eventType] = (index.byType[event.eventType] || 0) + 1;
        index.byComponent[event.context.component.id] = (index.byComponent[event.context.component.id] || 0) + 1;
        index.lastUpdated = new Date().toISOString();
        await fsModule.writeFile(filePath, JSON.stringify(index, null, 2), "utf-8");
      }
    } catch {
      const index = {
        byType: { [event.eventType]: 1 },
        byComponent: { [event.context.component.id]: 1 },
        lastUpdated: new Date().toISOString(),
      };
      await fsModule.writeFile(filePath, JSON.stringify(index, null, 2), "utf-8");
    }
  }

  /**
   * Update date summary
   */
  private async updateDateSummary(summaryPath: string, event: AIFriendlyEvent): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) return;
    
    const filePath = pathModule.join(this.logsDir, summaryPath);
    await this.ensureDirectoryForFile(filePath);

    try {
      const summary = await this.readFile(filePath);
      if (Array.isArray(summary)) {
        const newSummary: any = {
          date: new Date(event.timestamp).toISOString().split("T")[0],
          totalEvents: 1,
          byType: { [event.eventType]: 1 },
          byComponent: { [event.context.component.type]: 1 },
          lastUpdated: new Date().toISOString(),
        };
        await fsModule.writeFile(filePath, JSON.stringify(newSummary, null, 2), "utf-8");
      } else {
        summary.totalEvents = (summary.totalEvents || 0) + 1;
        summary.byType[event.eventType] = (summary.byType[event.eventType] || 0) + 1;
        summary.byComponent[event.context.component.type] =
          (summary.byComponent[event.context.component.type] || 0) + 1;
        summary.lastUpdated = new Date().toISOString();
        await fsModule.writeFile(filePath, JSON.stringify(summary, null, 2), "utf-8");
      }
    } catch {
      const summary = {
        date: new Date(event.timestamp).toISOString().split("T")[0],
        totalEvents: 1,
        byType: { [event.eventType]: 1 },
        byComponent: { [event.context.component.type]: 1 },
        lastUpdated: new Date().toISOString(),
      };
      await fsModule.writeFile(filePath, JSON.stringify(summary, null, 2), "utf-8");
    }
  }

  /**
   * Update trace index
   */
  private async updateTraceIndex(indexPath: string, trace: ComponentTrace): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) return;
    
    const filePath = pathModule.join(this.logsDir, indexPath);
    await this.ensureDirectoryForFile(filePath);

    try {
      const index = await this.readFile(filePath);
      if (Array.isArray(index)) {
        const newIndex: any = {
          byComponent: {},
          lastUpdated: new Date().toISOString(),
        };
        newIndex.byComponent[trace.componentId] = 1;
        await fsModule.writeFile(filePath, JSON.stringify(newIndex, null, 2), "utf-8");
      } else {
        index.byComponent[trace.componentId] = (index.byComponent[trace.componentId] || 0) + 1;
        index.lastUpdated = new Date().toISOString();
        await fsModule.writeFile(filePath, JSON.stringify(index, null, 2), "utf-8");
      }
    } catch {
      const index = {
        byComponent: { [trace.componentId]: 1 },
        lastUpdated: new Date().toISOString(),
      };
      await fsModule.writeFile(filePath, JSON.stringify(index, null, 2), "utf-8");
    }
  }

  /**
   * Update performance summary
   */
  private async updatePerformanceSummary(
    summaryPath: string,
    performance: DetailedPerformanceMetrics
  ): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) return;
    
    const filePath = pathModule.join(this.logsDir, summaryPath);
    await this.ensureDirectoryForFile(filePath);

    try {
      const summary = await this.readFile(filePath);
      if (Array.isArray(summary)) {
        const newSummary: any = {
          totalComponents: 1,
          averageRenderDuration: performance.renderDuration,
          averageStoreUpdateDuration: performance.storeUpdateDuration,
          lastUpdated: new Date().toISOString(),
        };
        await fsModule.writeFile(filePath, JSON.stringify(newSummary, null, 2), "utf-8");
      } else {
        summary.totalComponents = (summary.totalComponents || 0) + 1;
        summary.averageRenderDuration =
          ((summary.averageRenderDuration || 0) * (summary.totalComponents - 1) + performance.renderDuration) /
          summary.totalComponents;
        summary.averageStoreUpdateDuration =
          ((summary.averageStoreUpdateDuration || 0) * (summary.totalComponents - 1) +
            performance.storeUpdateDuration) /
          summary.totalComponents;
        summary.lastUpdated = new Date().toISOString();
        await fsModule.writeFile(filePath, JSON.stringify(summary, null, 2), "utf-8");
      }
    } catch {
      const summary = {
        totalComponents: 1,
        averageRenderDuration: performance.renderDuration,
        averageStoreUpdateDuration: performance.storeUpdateDuration,
        lastUpdated: new Date().toISOString(),
      };
      await fsModule.writeFile(filePath, JSON.stringify(summary, null, 2), "utf-8");
    }
  }

  /**
   * Calculate snapshot diff
   */
  private calculateSnapshotDiff(snapshot: StoreSnapshot): any {
    try {
      const beforeStr = JSON.stringify(snapshot.before || {});
      const afterStr = JSON.stringify(snapshot.after || {});
      
      if (beforeStr === afterStr) {
        return {
          timestamp: snapshot.timestamp,
          componentId: snapshot.componentId,
          hasChanges: false,
          changes: {},
        };
      }

      // Simple diff calculation
      const before = snapshot.before || {};
      const after = snapshot.after || {};
      const changes: any = {};

      // Find added/changed keys
      Object.keys(after).forEach((key) => {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
          changes[key] = {
            before: before[key],
            after: after[key],
          };
        }
      });

      // Find removed keys
      Object.keys(before).forEach((key) => {
        if (!(key in after)) {
          changes[key] = {
            before: before[key],
            after: undefined,
          };
        }
      });

      return {
        timestamp: snapshot.timestamp,
        componentId: snapshot.componentId,
        hasChanges: Object.keys(changes).length > 0,
        changes,
      };
    } catch {
      return {
        timestamp: snapshot.timestamp,
        componentId: snapshot.componentId,
        hasChanges: true,
        changes: {},
        error: "Failed to calculate diff",
      };
    }
  }

  /**
   * Clear all files (on debug enable)
   */
  async clearAllFiles(): Promise<void> {
    if (!this.isServerSide()) return;
    
    try {
      const fsModule = await getFs();
      if (!fsModule) return;
      await fsModule.rm(this.logsDir, { recursive: true, force: true });
      await this.ensureDirectory();
    } catch (error) {
      console.error("Error clearing debug files:", error);
    }
  }
}

// Export singleton instance
export const fileWriter = new FileWriter();
