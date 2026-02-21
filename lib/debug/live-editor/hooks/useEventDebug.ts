/**
 * useEventDebug Hook
 * Hook for event tracking
 */

"use client";

import { useCallback } from "react";
import { eventTracker } from "../trackers/eventTracker";
import { eventFormatter } from "../formatters/eventFormatter";
import { contextUtils } from "../utils/contextUtils";
import { AIFriendlyEvent, EventType } from "../core/types";
import { getSessionId } from "../core/config";
import { isDebugEnabled } from "../core/config";

/**
 * Hook for event tracking
 */
export function useEventDebug() {
  /**
   * Emit event
   */
  const emitEvent = useCallback(
    (eventType: EventType, eventData: Partial<AIFriendlyEvent>) => {
      if (!isDebugEnabled()) return;

      // Format event
      const event = eventFormatter.formatEvent({
        eventType,
        ...eventData,
        sessionId: getSessionId(),
      });

      // Track event
      eventTracker.trackEvent(event);
    },
    []
  );

  /**
   * Subscribe to events
   */
  const subscribeToEvents = useCallback((callback: (event: AIFriendlyEvent) => void) => {
    if (!isDebugEnabled()) return () => {};

    // Subscribe to all events
    const listener = (event: AIFriendlyEvent) => {
      callback(event);
    };

    // Note: This would require eventEmitter to be imported
    // For now, we'll use eventTracker's internal mechanism
    return () => {
      // Unsubscribe logic would go here
    };
  }, []);

  /**
   * Get event history
   */
  const getEventHistory = useCallback(() => {
    if (!isDebugEnabled()) return [];
    return eventTracker.getEventHistory();
  }, []);

  return {
    emitEvent,
    subscribeToEvents,
    getEventHistory,
  };
}
