/**
 * Export Functions for AI
 * Creates organized exports for AI analysis
 * Server-side only (uses fs/promises)
 */

import { fileReader } from "./fileReader";
import { getLogsDir, isDebugEnabled, getSessionId } from "../core/config";
import { AIFriendlyEvent, ComponentTrace, StoreSnapshot, DataFlowStep } from "../core/types";

// Dynamic import for fs/promises and path (server-side only)
let fs: typeof import("fs/promises") | null = null;
let path: typeof import("path") | null = null;
let crypto: typeof import("crypto") | null = null;

// Lazy load modules only in server-side
async function getFs() {
  if (typeof window !== "undefined") return null;
  if (!fs) {
    fs = await import("fs/promises");
    path = await import("path");
    crypto = await import("crypto");
  }
  return fs;
}

async function getPath() {
  if (typeof window !== "undefined") return null;
  if (!path) {
    await getFs(); // This will load path too
  }
  return path;
}

async function getCrypto() {
  if (typeof window !== "undefined") return null;
  if (!crypto) {
    await getFs(); // This will load crypto too
  }
  return crypto;
}

class ExportForAI {
  private logsDir: string;
  private exportDir: string;

  constructor() {
    if (typeof window !== "undefined") {
      this.logsDir = "";
      this.exportDir = "";
      return;
    }
    this.logsDir = getLogsDir();
    // Initialize exportDir asynchronously in ensureDirectory
    this.exportDir = "";
    this.ensureDirectory();
  }

  /**
   * Check if running in server-side
   */
  private isServerSide(): boolean {
    return typeof window === "undefined";
  }

  /**
   * Ensure export directory exists
   */
  private async ensureDirectory(): Promise<void> {
    if (!this.isServerSide()) return;
    
    const pathModule = await getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) return;
    
    // Initialize exportDir if not set
    if (!this.exportDir) {
      this.exportDir = pathModule.join(this.logsDir, "ai-export");
    }
    
    try {
      await fsModule.mkdir(this.exportDir, { recursive: true });
      await fsModule.mkdir(pathModule.join(this.exportDir, "by-component"), { recursive: true });
      await fsModule.mkdir(pathModule.join(this.exportDir, "by-query"), { recursive: true });
      await fsModule.mkdir(pathModule.join(this.exportDir, "by-problem"), { recursive: true });
    } catch (error) {
      console.error("Error creating export directory:", error);
    }
  }

  /**
   * Generate hash from string
   */
  private async generateHash(str: string): Promise<string> {
    const cryptoModule = await getCrypto();
    if (!cryptoModule) return "00000000";
    return cryptoModule.createHash("md5").update(str).digest("hex").substring(0, 8);
  }

  /**
   * Export debug data for AI (full export)
   * @param componentId - Optional component ID to export
   * @param debugData - Optional debug data from in-memory store (client-side)
   */
  async exportDebugDataForAI(componentId?: string, debugData?: {
    events?: any[];
    traces?: any[];
    snapshots?: any[];
    dataFlowHistory?: any[];
    performanceMetrics?: any[];
  }): Promise<string> {
    if (!this.isServerSide()) {
      throw new Error("Export is only available in server-side");
    }
    
    // Ensure directory is initialized
    await this.ensureDirectory();
    
    const pathModule = await getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) {
      throw new Error("File system modules not available");
    }
    
    // In server-side, allow export even if debug is not explicitly enabled
    // This allows exporting existing debug data

    console.log("🔍 [ExportForAI] Starting export:", {
      hasComponentId: !!componentId,
      hasDebugData: !!debugData,
      debugDataType: typeof debugData,
      debugDataKeys: debugData ? Object.keys(debugData) : [],
    });

    const exportData: any = {
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      componentId: componentId || null,
    };

    // If debugData is provided (from in-memory store), use it
    // Otherwise, try to read from files
    if (debugData) {
      console.log("✅ [ExportForAI] debugData is truthy, entering if block");
      console.log("📝 [ExportForAI] Processing debugData:", {
        eventsCount: debugData.events?.length || 0,
        tracesCount: debugData.traces?.length || 0,
        snapshotsCount: debugData.snapshots?.length || 0,
        dataFlowCount: debugData.dataFlowHistory?.length || 0,
        performanceCount: debugData.performanceMetrics?.length || 0,
      });
      
      // Use data from in-memory store
      exportData.events = debugData.events || [];
      exportData.traces = Array.isArray(debugData.traces) 
        ? debugData.traces 
        : (debugData.traces ? Array.from(debugData.traces.values ? debugData.traces.values() : Object.values(debugData.traces)) : []);
      exportData.snapshots = debugData.snapshots || [];
      exportData.dataFlowHistory = debugData.dataFlowHistory || [];
      exportData.performanceMetrics = debugData.performanceMetrics || [];
      exportData.criticalEvents = exportData.events.filter((e: any) => 
        e && ["SAVE_COMPLETED", "STORE_UPDATED", "MERGE_COMPLETED"].includes(e.eventType)
      );
      
      console.log("✅ [ExportForAI] Export data prepared:", {
        eventsCount: exportData.events.length,
        tracesCount: exportData.traces.length,
        snapshotsCount: exportData.snapshots.length,
        dataFlowCount: exportData.dataFlowHistory.length,
        performanceCount: exportData.performanceMetrics.length,
        criticalEventsCount: exportData.criticalEvents.length,
      });
    } else if (componentId) {
      console.log("⚠️ [ExportForAI] No debugData, but componentId provided, reading from files");
      // Export for specific component from files
      const componentType = await this.getComponentType(componentId);
      if (componentType) {
        exportData.events = await fileReader.getEvents({
          componentId,
          componentType,
        });
        exportData.trace = await fileReader.getComponentTrace(componentId, componentType);
        exportData.snapshots = await fileReader.getStoreSnapshots({
          componentId,
          componentType,
        });
        exportData.dataFlow = await fileReader.getDataFlow({
          componentId,
          componentType,
        });
        exportData.performance = await fileReader.getPerformance({
          componentId,
          componentType,
        });

        // Write to by-component
        if (this.exportDir) {
          const componentDir = pathModule.join(this.exportDir, "by-component", componentType);
          await fsModule.mkdir(componentDir, { recursive: true });
          const componentPath = pathModule.join(componentDir, `${componentId}.json`);
          await fsModule.writeFile(componentPath, JSON.stringify(exportData, null, 2), "utf-8");
        }
      }
    } else {
      console.log("⚠️ [ExportForAI] No debugData and no componentId, reading from files");
      // Full export from files
      exportData.events = await fileReader.getLatestEvents(1000);
      exportData.traces = await fileReader.getAllTraces();
      exportData.criticalEvents = await fileReader.getCriticalEvents();
    }

    console.log("📝 [ExportForAI] Final exportData before writing:", {
      eventsCount: exportData.events?.length || 0,
      tracesCount: exportData.traces?.length || 0,
      snapshotsCount: exportData.snapshots?.length || 0,
      dataFlowCount: exportData.dataFlowHistory?.length || 0,
      performanceCount: exportData.performanceMetrics?.length || 0,
      criticalEventsCount: exportData.criticalEvents?.length || 0,
    });

    // Write to latest.json
    if (!this.exportDir) {
      throw new Error("Export directory not initialized");
    }
    const latestPath = pathModule.join(this.exportDir, "latest.json");
    console.log("💾 [ExportForAI] Writing to file:", latestPath);
    await fsModule.writeFile(latestPath, JSON.stringify(exportData, null, 2), "utf-8");
    console.log("✅ [ExportForAI] File written successfully");

    return latestPath;
  }

  /**
   * Export by query
   */
  async exportByQuery(question: string, result: any): Promise<string> {
    if (!this.isServerSide()) {
      throw new Error("Export is only available in server-side");
    }
    
    // Ensure directory is initialized
    await this.ensureDirectory();
    
    const pathModule = await getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) {
      throw new Error("File system modules not available");
    }

    if (!this.exportDir) {
      throw new Error("Export directory not initialized");
    }

    const queryHash = await this.generateHash(question);
    const exportData = {
      timestamp: new Date().toISOString(),
      question,
      result,
    };

    const queryPath = pathModule.join(this.exportDir, "by-query", `${queryHash}.json`);
    await fsModule.writeFile(queryPath, JSON.stringify(exportData, null, 2), "utf-8");

    return queryPath;
  }

  /**
   * Export by problem
   */
  async exportByProblem(problem: string, diagnosis: any): Promise<string> {
    if (!this.isServerSide()) {
      throw new Error("Export is only available in server-side");
    }
    
    // Ensure directory is initialized
    await this.ensureDirectory();
    
    const pathModule = await getPath();
    const fsModule = await getFs();
    if (!pathModule || !fsModule) {
      throw new Error("File system modules not available");
    }

    if (!this.exportDir) {
      throw new Error("Export directory not initialized");
    }

    const problemKey = problem.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const exportData = {
      timestamp: new Date().toISOString(),
      problem,
      diagnosis,
    };

    const problemPath = pathModule.join(this.exportDir, "by-problem", `${problemKey}.json`);
    await fsModule.writeFile(problemPath, JSON.stringify(exportData, null, 2), "utf-8");

    return problemPath;
  }

  /**
   * Get component type from component ID (helper method)
   */
  private async getComponentType(componentId: string): Promise<string | null> {
    try {
      const events = await fileReader.getEvents({ componentId });
      if (events.length > 0) {
        return events[0].context.component.type;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }
}

// Export singleton instance
export const exportForAI = new ExportForAI();

// Export convenience functions
export async function exportDebugDataForAI(
  componentId?: string, 
  debugData?: {
    events?: any[];
    traces?: any[];
    snapshots?: any[];
    dataFlowHistory?: any[];
    performanceMetrics?: any[];
  }
): Promise<string> {
  return exportForAI.exportDebugDataForAI(componentId, debugData);
}

export async function exportByQuery(question: string, result: any): Promise<string> {
  return exportForAI.exportByQuery(question, result);
}

export async function exportByProblem(problem: string, diagnosis: any): Promise<string> {
  return exportForAI.exportByProblem(problem, diagnosis);
}
