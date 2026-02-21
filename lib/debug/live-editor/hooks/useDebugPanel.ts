/**
 * useDebugPanel Hook
 * Hook for debug panel UI
 */

"use client";

import { useState, useCallback } from "react";
import { useDebugStore } from "../core/debugStore";
import { enableDebug, disableDebug, isDebugEnabled } from "../core/config";
import { AIQueryResult } from "../core/types";

/**
 * Hook for debug panel
 */
export function useDebugPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const store = useDebugStore();

  /**
   * Get debug data
   */
  const getDebugData = useCallback(() => {
    return {
      events: store.events,
      traces: Array.from(store.componentTraces.values()),
      snapshots: store.storeSnapshots,
      dataFlowHistory: store.dataFlowHistory,
      performanceMetrics: store.performanceMetrics,
      enabled: store.enabled,
    };
  }, [store]);

  /**
   * Enable debug
   */
  const handleEnableDebug = useCallback(async () => {
    try {
      // Clear all files via API
      const clearResponse = await fetch("/api/debug/clear", {
        method: "POST",
      });
      if (!clearResponse.ok) {
        console.warn("Failed to clear debug files");
      }
    } catch (error) {
      console.warn("Error clearing debug files:", error);
    }

    // Clear store data
    store.clearAllData();

    // Enable debug
    enableDebug();
    store.enableDebug();
  }, [store]);

  /**
   * Disable debug
   */
  const handleDisableDebug = useCallback(() => {
    disableDebug();
    store.disableDebug();
  }, [store]);

  /**
   * Clear debug data
   */
  const handleClearDebugData = useCallback(async () => {
    try {
      // Clear files via API
      const clearResponse = await fetch("/api/debug/clear", {
        method: "POST",
      });
      if (!clearResponse.ok) {
        throw new Error("Failed to clear debug files");
      }
    } catch (error) {
      console.error("Error clearing debug files:", error);
      throw error;
    }

    // Clear store
    store.clearAllData();
  }, [store]);

  /**
   * Export debug data
   */
  const handleExportDebugData = useCallback(async (componentId?: string) => {
    try {
      // Get debug data from store (in-memory)
      const debugData = getDebugData();
      
      console.log("🔍 [Debug Export] Debug data from store:", {
        eventsCount: debugData.events?.length || 0,
        tracesCount: debugData.traces?.length || 0,
        snapshotsCount: debugData.snapshots?.length || 0,
        dataFlowCount: debugData.dataFlowHistory?.length || 0,
        performanceCount: debugData.performanceMetrics?.length || 0,
      });
      
      // Prepare data to send (traces is already an array from getDebugData)
      const dataToExport = {
        events: debugData.events || [],
        traces: debugData.traces || [],
        snapshots: debugData.snapshots || [],
        dataFlowHistory: debugData.dataFlowHistory || [],
        performanceMetrics: debugData.performanceMetrics || [],
      };

      console.log("📤 [Debug Export] Sending data to API:", {
        eventsCount: dataToExport.events.length,
        tracesCount: dataToExport.traces.length,
        snapshotsCount: dataToExport.snapshots.length,
        dataFlowCount: dataToExport.dataFlowHistory.length,
        performanceCount: dataToExport.performanceMetrics.length,
      });

      const response = await fetch("/api/debug/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          componentId,
          debugData: dataToExport,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export debug data");
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error("Error exporting debug data:", error);
      throw error;
    }
  }, [getDebugData]);

  /**
   * Query AI
   */
  const handleQueryAI = useCallback(async (question: string): Promise<AIQueryResult> => {
    try {
      const response = await fetch("/api/debug/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to query AI");
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error querying AI:", error);
      throw error;
    }
  }, []);

  /**
   * Toggle panel
   */
  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => !prev);
  }, []);

  return {
    isPanelOpen,
    togglePanel,
    getDebugData,
    enableDebug: handleEnableDebug,
    disableDebug: handleDisableDebug,
    clearDebugData: handleClearDebugData,
    exportDebugData: handleExportDebugData,
    queryAI: handleQueryAI,
    isEnabled: isDebugEnabled() && store.enabled,
  };
}
