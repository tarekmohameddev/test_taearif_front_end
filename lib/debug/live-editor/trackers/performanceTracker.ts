/**
 * Performance Tracker
 * Tracks performance metrics
 */

import { DetailedPerformanceMetrics } from "../core/types";
import { useDebugStore } from "../core/debugStore";
import { fileWriter } from "../utils/fileWriter";
import { isDebugEnabled } from "../core/config";

class PerformanceTracker {
  private metrics: DetailedPerformanceMetrics[] = [];

  /**
   * Track render duration
   */
  trackRender(
    componentId: string,
    componentType: string,
    renderDuration: number,
    renderCount: number
  ): void {
    if (!isDebugEnabled()) return;

    const performance: DetailedPerformanceMetrics = {
      componentId,
      componentType,
      renderDuration,
      storeUpdateDuration: 0,
      mergeDuration: 0,
      totalDuration: renderDuration,
      renderCount,
      storeUpdates: 0,
      timestamp: new Date().toISOString(),
    };

    this.addPerformance(performance);
  }

  /**
   * Track store update duration
   */
  trackStoreUpdate(
    componentId: string,
    componentType: string,
    storeUpdateDuration: number,
    storeUpdates: number
  ): void {
    if (!isDebugEnabled()) return;

    const performance: DetailedPerformanceMetrics = {
      componentId,
      componentType,
      renderDuration: 0,
      storeUpdateDuration,
      mergeDuration: 0,
      totalDuration: storeUpdateDuration,
      renderCount: 0,
      storeUpdates,
      timestamp: new Date().toISOString(),
    };

    this.addPerformance(performance);
  }

  /**
   * Track merge duration
   */
  trackMerge(
    componentId: string,
    componentType: string,
    mergeDuration: number
  ): void {
    if (!isDebugEnabled()) return;

    const performance: DetailedPerformanceMetrics = {
      componentId,
      componentType,
      renderDuration: 0,
      storeUpdateDuration: 0,
      mergeDuration,
      totalDuration: mergeDuration,
      renderCount: 0,
      storeUpdates: 0,
      timestamp: new Date().toISOString(),
    };

    this.addPerformance(performance);
  }

  /**
   * Track total duration
   */
  trackTotal(
    componentId: string,
    componentType: string,
    totalDuration: number,
    renderDuration: number,
    storeUpdateDuration: number,
    mergeDuration: number,
    renderCount: number,
    storeUpdates: number
  ): void {
    if (!isDebugEnabled()) return;

    const performance: DetailedPerformanceMetrics = {
      componentId,
      componentType,
      renderDuration,
      storeUpdateDuration,
      mergeDuration,
      totalDuration,
      renderCount,
      storeUpdates,
      timestamp: new Date().toISOString(),
    };

    this.addPerformance(performance);
  }

  /**
   * Add performance metrics
   */
  private addPerformance(performance: DetailedPerformanceMetrics): void {
    // Add to store
    useDebugStore.getState().addPerformance(performance);

    // Add to local metrics
    this.metrics.push(performance);

    // Write to file
    fileWriter.writePerformance(performance);
  }

  /**
   * Get performance metrics
   */
  getPerformance(componentId?: string): DetailedPerformanceMetrics[] {
    if (componentId) {
      return this.metrics.filter((m) => m.componentId === componentId);
    }
    return [...this.metrics];
  }

  /**
   * Start tracking
   */
  start(): void {
    this.metrics = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceTracker = new PerformanceTracker();
