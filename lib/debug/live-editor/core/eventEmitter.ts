/**
 * Event Emitter System for AI-Friendly Debugger
 * Handles event registration, emission, and subscription
 */

import { EventType, AIFriendlyEvent } from "./types";

type EventListener = (event: AIFriendlyEvent) => void;

/**
 * Event Emitter Class
 */
class EventEmitter {
  private listeners: Map<EventType, EventListener[]> = new Map();
  private allListeners: EventListener[] = [];

  /**
   * Register listener for specific event type
   */
  on(eventType: EventType, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  /**
   * Register listener for all events
   */
  onAll(listener: EventListener): void {
    this.allListeners.push(listener);
  }

  /**
   * Remove listener for specific event type
   */
  off(eventType: EventType, listener: EventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Remove listener for all events
   */
  offAll(listener: EventListener): void {
    const index = this.allListeners.indexOf(listener);
    if (index > -1) {
      this.allListeners.splice(index, 1);
    }
  }

  /**
   * Emit event
   */
  emit(event: AIFriendlyEvent): void {
    // Notify specific listeners
    const listeners = this.listeners.get(event.eventType);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.eventType}:`, error);
        }
      });
    }

    // Notify all-event listeners
    this.allListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in all-event listener:", error);
      }
    });
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
    this.allListeners = [];
  }

  /**
   * Get listener count for event type
   */
  listenerCount(eventType: EventType): number {
    return this.listeners.get(eventType)?.length || 0;
  }

  /**
   * Get total listener count
   */
  totalListenerCount(): number {
    let count = this.allListeners.length;
    this.listeners.forEach((listeners) => {
      count += listeners.length;
    });
    return count;
  }
}

// Export singleton instance
export const eventEmitter = new EventEmitter();
