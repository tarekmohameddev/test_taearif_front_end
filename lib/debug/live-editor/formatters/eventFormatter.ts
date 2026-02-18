/**
 * Event Formatter
 * Formats events for AI-friendly consumption
 */

import { AIFriendlyEvent, AISummary } from "../core/types";
import { contextUtils } from "../utils/contextUtils";

class EventFormatter {
  /**
   * Format event for AI
   */
  formatEvent(event: Partial<AIFriendlyEvent>): AIFriendlyEvent {
    const formatted: AIFriendlyEvent = {
      eventId: event.eventId || this.generateEventId(),
      eventType: event.eventType!,
      timestamp: event.timestamp || new Date().toISOString(),
      sessionId: event.sessionId || "",
      context: event.context || contextUtils.extractContext(event.context?.component || this.getDefaultComponent()),
      details: event.details || { action: "", source: "" },
      before: event.before || { componentData: {}, storeState: {}, mergedData: {} },
      after: event.after || { componentData: {}, storeState: {}, mergedData: {} },
      decisions: event.decisions || [],
      dataFlow: event.dataFlow || { sources: [], merge: { method: "", order: [], result: {} } },
      trace: event.trace || { steps: [], stackTrace: [] },
      relatedEvents: event.relatedEvents || [],
      summary: event.summary || this.generateSummary(event),
      performance: event.performance || { duration: "0ms", renderCount: 0, storeUpdates: 0 },
    };

    return formatted;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get default component
   */
  private getDefaultComponent() {
    return {
      id: "unknown",
      type: "unknown",
      variant: "unknown",
      name: "unknown",
    };
  }

  /**
   * Generate AI-friendly summary
   */
  private generateSummary(event: Partial<AIFriendlyEvent>): AISummary {
    const what = this.generateWhat(event);
    const where = this.generateWhere(event);
    const when = this.generateWhen(event);
    const why = this.generateWhy(event);
    const how = this.generateHow(event);
    const impact = this.generateImpact(event);
    const nextSteps = this.generateNextSteps(event);

    return {
      what,
      where,
      when,
      why,
      how,
      impact,
      nextSteps,
    };
  }

  /**
   * Generate "what" summary
   */
  private generateWhat(event: Partial<AIFriendlyEvent>): string {
    if (event.eventType) {
      return `Event type: ${event.eventType}. ${event.details?.action || "Action performed"}`;
    }
    return "Unknown event occurred";
  }

  /**
   * Generate "where" summary
   */
  private generateWhere(event: Partial<AIFriendlyEvent>): string {
    const component = event.context?.component;
    if (component) {
      return `Component: ${component.type} (${component.variant}) with ID: ${component.id}. Location: ${event.context?.location?.file || "unknown"} at line ${event.context?.location?.line || 0}`;
    }
    return "Location unknown";
  }

  /**
   * Generate "when" summary
   */
  private generateWhen(event: Partial<AIFriendlyEvent>): string {
    return event.timestamp || new Date().toISOString();
  }

  /**
   * Generate "why" summary
   */
  private generateWhy(event: Partial<AIFriendlyEvent>): string {
    if (event.details?.field) {
      return `Field ${event.details.field.path} was updated from ${JSON.stringify(event.details.field.oldValue)} to ${JSON.stringify(event.details.field.newValue)}`;
    }
    return event.details?.action || "User action triggered this event";
  }

  /**
   * Generate "how" summary
   */
  private generateHow(event: Partial<AIFriendlyEvent>): string {
    if (event.dataFlow?.merge) {
      return `Data merged using ${event.dataFlow.merge.method} method. Order: ${event.dataFlow.merge.order.join(" -> ")}`;
    }
    return "Event executed through normal flow";
  }

  /**
   * Generate "impact" summary
   */
  private generateImpact(event: Partial<AIFriendlyEvent>): string {
    if (event.after?.mergedData && event.before?.mergedData) {
      const hasChanges = JSON.stringify(event.before.mergedData) !== JSON.stringify(event.after.mergedData);
      return hasChanges ? "Data was successfully updated" : "No data changes detected";
    }
    return "Impact unknown";
  }

  /**
   * Generate "next steps" summary
   */
  private generateNextSteps(event: Partial<AIFriendlyEvent>): string[] {
    const steps: string[] = [];

    if (event.eventType === "FIELD_UPDATED") {
      steps.push("Field value updated in tempData");
      steps.push("Changes will be saved when user clicks Save button");
    } else if (event.eventType === "SAVE_INITIATED") {
      steps.push("Merge process will start");
      steps.push("Data will be saved to store");
      steps.push("Changes will be persisted to database");
    } else if (event.eventType === "SAVE_COMPLETED") {
      steps.push("Data successfully saved");
      steps.push("Component will re-render with new data");
    }

    return steps.length > 0 ? steps : ["No specific next steps"];
  }
}

// Export singleton instance
export const eventFormatter = new EventFormatter();
