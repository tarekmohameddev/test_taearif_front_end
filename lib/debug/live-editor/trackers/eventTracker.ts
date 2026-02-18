/**
 * Event Tracker
 * Tracks all events and manages event history
 */

import { AIFriendlyEvent, EventType } from "../core/types";
import { useDebugStore } from "../core/debugStore";
import { fileWriter } from "../utils/fileWriter";
import { eventEmitter } from "../core/eventEmitter";
import { isDebugEnabled } from "../core/config";

class EventTracker {
  private eventHistory: AIFriendlyEvent[] = [];

  /**
   * Track event
   */
  trackEvent(event: AIFriendlyEvent): void {
    if (!isDebugEnabled()) return;

    // Add to store
    useDebugStore.getState().addEvent(event);

    // Add to local history
    this.eventHistory.push(event);

    // Write to file
    fileWriter.writeEvent(event);

    // Emit to event emitter
    eventEmitter.emit(event);
  }

  /**
   * Get event history
   */
  getEventHistory(): AIFriendlyEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Filter events
   */
  filterEvents(filters: {
    eventType?: EventType;
    componentId?: string;
    componentType?: string;
    timeRange?: { start: Date; end: Date };
  }): AIFriendlyEvent[] {
    let filtered = this.eventHistory;

    if (filters.eventType) {
      filtered = filtered.filter((e) => e.eventType === filters.eventType);
    }

    if (filters.componentId) {
      filtered = filtered.filter((e) => e.context.component.id === filters.componentId);
    }

    if (filters.componentType) {
      filtered = filtered.filter((e) => e.context.component.type === filters.componentType);
    }

    if (filters.timeRange) {
      filtered = filtered.filter((e) => {
        const eventTime = new Date(e.timestamp);
        return eventTime >= filters.timeRange!.start && eventTime <= filters.timeRange!.end;
      });
    }

    return filtered;
  }

  /**
   * Search events
   */
  searchEvents(query: string): AIFriendlyEvent[] {
    const lowerQuery = query.toLowerCase();
    return this.eventHistory.filter((event) => {
      return (
        event.eventType.toLowerCase().includes(lowerQuery) ||
        event.context.component.type.toLowerCase().includes(lowerQuery) ||
        event.context.component.id.toLowerCase().includes(lowerQuery) ||
        event.summary.what.toLowerCase().includes(lowerQuery) ||
        event.summary.where.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Start tracking
   */
  start(): void {
    this.eventHistory = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    this.eventHistory = [];
  }
}

// Export singleton instance
export const eventTracker = new EventTracker();
