/**
 * Store Tracker
 * Tracks store updates and creates snapshots
 */

import { StoreSnapshot } from "../core/types";
import { useDebugStore } from "../core/debugStore";
import { fileWriter } from "../utils/fileWriter";
import { isDebugEnabled } from "../core/config";
import { diffUtils } from "../utils/diffUtils";

class StoreTracker {
  private snapshots: StoreSnapshot[] = [];

  /**
   * Track store update
   */
  trackUpdate(params: {
    componentType: string;
    componentId: string;
    before: any;
    after: any;
    operation: "save" | "merge" | "update" | "delete";
    storeType?: "editor" | "tenant";
    path?: string;
  }): void {
    if (!isDebugEnabled()) return;

    const snapshot: StoreSnapshot = {
      timestamp: new Date().toISOString(),
      componentId: params.componentId,
      componentType: params.componentType,
      type: this.getSnapshotType(params.operation),
      operation: params.operation,
      storeType: params.storeType || "editor",
      before: params.before,
      after: params.after,
      diff: diffUtils.calculateDiff(params.before, params.after),
    };

    // Add to store
    useDebugStore.getState().addSnapshot(snapshot);

    // Add to local history
    this.snapshots.push(snapshot);

    // Write to file
    fileWriter.writeSnapshot(snapshot);
  }

  /**
   * Get snapshot type from operation
   */
  private getSnapshotType(operation: StoreSnapshot["operation"]): StoreSnapshot["type"] {
    switch (operation) {
      case "save":
        return "before-save";
      case "merge":
        return "before-merge";
      case "update":
        return "before-update";
      case "delete":
        return "before-update";
      default:
        return "before-update";
    }
  }

  /**
   * Create snapshot
   */
  createSnapshot(
    componentId: string,
    componentType: string,
    storeType: "editor" | "tenant",
    data: any,
    type: StoreSnapshot["type"] = "before-save"
  ): StoreSnapshot {
    const snapshot: StoreSnapshot = {
      timestamp: new Date().toISOString(),
      componentId,
      componentType,
      type,
      operation: "save",
      storeType,
      before: data,
      after: data,
    };

    return snapshot;
  }

  /**
   * Get snapshots
   */
  getSnapshots(componentId?: string): StoreSnapshot[] {
    if (componentId) {
      return this.snapshots.filter((s) => s.componentId === componentId);
    }
    return [...this.snapshots];
  }

  /**
   * Start tracking
   */
  start(): void {
    this.snapshots = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    this.snapshots = [];
  }
}

// Export singleton instance
export const storeTracker = new StoreTracker();
