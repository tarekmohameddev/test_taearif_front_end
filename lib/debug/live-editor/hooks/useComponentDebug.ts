/**
 * useComponentDebug Hook
 * Hook for component tracking
 */

"use client";

import { useEffect, useRef } from "react";
import { componentTracker } from "../trackers/componentTracker";
import { eventTracker } from "../trackers/eventTracker";
import { eventFormatter } from "../formatters/eventFormatter";
import { contextUtils } from "../utils/contextUtils";
import { getSessionId } from "../core/config";
import { isDebugEnabled } from "../core/config";

interface UseComponentDebugParams {
  componentId: string;
  componentType: string;
  variant: string;
  props?: any;
}

/**
 * Hook for component tracking
 */
export function useComponentDebug(params: UseComponentDebugParams) {
  const { componentId, componentType, variant, props } = params;
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!isDebugEnabled()) return;

    renderStartTime.current = performance.now();
    renderCount.current += 1;

    // Track component render
    const renderDuration = performance.now() - renderStartTime.current;

    componentTracker.trackRender(componentId, componentType, variant, props, props, renderDuration);

    // Emit COMPONENT_RENDERED event
    const context = contextUtils.buildContext(componentId, componentType, variant, variant, {
      action: "render",
      page: typeof window !== "undefined" ? window.location.pathname : "unknown",
    });

    const event = eventFormatter.formatEvent({
      eventType: "COMPONENT_RENDERED",
      context,
      details: {
        action: "component_render",
        source: "component",
      },
      before: {
        componentData: {},
        storeState: {},
        mergedData: {},
      },
      after: {
        componentData: props,
        storeState: {},
        mergedData: props,
      },
      sessionId: getSessionId(),
    });

    eventTracker.trackEvent(event);
  }, [componentId, componentType, variant, props]);
}
