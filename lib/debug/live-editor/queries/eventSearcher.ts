/**
 * Event Searcher
 * Searches and filters events
 */

import { AIFriendlyEvent, EventSearchFilters } from "../core/types";
import { fileReader } from "../utils/fileReader";

class EventSearcher {
  /**
   * Search events
   */
  async search(filters: EventSearchFilters): Promise<AIFriendlyEvent[]> {
    // Use fileReader to get events
    const events = await fileReader.getEvents(filters);

    // Apply additional filters
    let filtered = events;

    if (filters.timeRange) {
      filtered = filtered.filter((e) => {
        const eventTime = new Date(e.timestamp);
        return eventTime >= filters.timeRange!.start && eventTime <= filters.timeRange!.end;
      });
    }

    // Sort by timestamp
    return filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Filter events
   */
  filterEvents(events: AIFriendlyEvent[], filters: EventSearchFilters): AIFriendlyEvent[] {
    let filtered = events;

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
   * Sort events
   */
  sortEvents(events: AIFriendlyEvent[], sortBy: "timestamp" | "eventType" = "timestamp"): AIFriendlyEvent[] {
    const sorted = [...events];

    if (sortBy === "timestamp") {
      return sorted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else {
      return sorted.sort((a, b) => a.eventType.localeCompare(b.eventType));
    }
  }

  /**
   * Group events
   */
  groupEvents(events: AIFriendlyEvent[], groupBy: "eventType" | "componentType" | "date"): Record<string, AIFriendlyEvent[]> {
    const grouped: Record<string, AIFriendlyEvent[]> = {};

    events.forEach((event) => {
      let key: string;

      if (groupBy === "eventType") {
        key = event.eventType;
      } else if (groupBy === "componentType") {
        key = event.context.component.type;
      } else {
        key = new Date(event.timestamp).toISOString().split("T")[0];
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(event);
    });

    return grouped;
  }
}

// Export singleton instance
export const eventSearcher = new EventSearcher();
