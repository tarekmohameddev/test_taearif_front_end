/**
 * useDataFlowDebug Hook
 * Hook for data flow tracking
 */

"use client";

import { useCallback } from "react";
import { dataFlowTracker } from "../trackers/dataFlowTracker";
import { eventTracker } from "../trackers/eventTracker";
import { eventFormatter } from "../formatters/eventFormatter";
import { contextUtils } from "../utils/contextUtils";
import { DataSource, DecisionPoint } from "../core/types";
import { getSessionId } from "../core/config";
import { isDebugEnabled } from "../core/config";

interface UseDataFlowDebugParams {
  componentId: string;
  componentType?: string;
  defaultData?: any;
  tenantData?: any;
  storeData?: any;
  mergedData?: any;
}

/**
 * Hook for data flow tracking
 */
export function useDataFlowDebug(params: UseDataFlowDebugParams) {
  const { componentId, componentType = "unknown", defaultData, tenantData, storeData, mergedData } = params;

  /**
   * Track data flow
   */
  const trackDataFlow = useCallback(
    (dataFlowParams: {
      operation?: string;
      path?: string;
      oldValue?: any;
      newValue?: any;
      sources?: DataSource[];
      merge?: any;
      priorityDecisions?: DecisionPoint[];
      result?: any;
    }) => {
      if (!isDebugEnabled()) return;

      // Build data sources
      const sources: DataSource[] =
        dataFlowParams.sources ||
        [
          { name: "defaultData", value: defaultData, priority: 4, used: true, reason: "Default component data" },
          { name: "tenantData", value: tenantData, priority: 3, used: !!tenantData, reason: tenantData ? "Tenant-specific data" : "No tenant data" },
          { name: "storeData", value: storeData, priority: 2, used: !!storeData, reason: storeData ? "Store data" : "No store data" },
          { name: "tempData", value: dataFlowParams.newValue, priority: 1, used: !!dataFlowParams.newValue, reason: dataFlowParams.newValue ? "Temporary changes" : "No temp data" },
        ].filter((s) => s.value !== undefined);

      // Track data flow
      if (dataFlowParams.operation === "merge") {
        dataFlowTracker.trackMerge(componentId, componentType, sources, dataFlowParams.merge || {}, mergedData || {});
      } else if (dataFlowParams.operation === "priority-override") {
        dataFlowTracker.trackPriorityDecision(componentId, componentType, sources, dataFlowParams.priorityDecisions || [], mergedData || {});
      } else {
        dataFlowTracker.trackDataSourceChange(componentId, componentType, sources, mergedData || {});
      }

      // Emit DATA_SOURCE_CHANGED event
      const context = contextUtils.buildContext(componentId, componentType, "unknown", "unknown", {
        action: "data_flow_change",
        page: typeof window !== "undefined" ? window.location.pathname : "unknown",
      });

      const event = eventFormatter.formatEvent({
        eventType: "DATA_SOURCE_CHANGED",
        context,
        details: {
          action: dataFlowParams.operation || "data_source_change",
          source: "data_flow_tracker",
        },
        dataFlow: {
          sources,
          merge: dataFlowParams.merge || { method: "default", order: sources.map((s) => s.name), result: mergedData },
        },
        sessionId: getSessionId(),
      });

      eventTracker.trackEvent(event);
    },
    [componentId, defaultData, tenantData, storeData, mergedData]
  );

  return {
    trackDataFlow,
  };
}
