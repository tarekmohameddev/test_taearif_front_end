/**
 * Store Snapshot Utilities
 * Utilities for creating, comparing, and managing store snapshots
 */

import { StoreSnapshot } from "../core/types";
import { diffUtils } from "./diffUtils";

/**
 * Create store snapshot
 */
export function createSnapshot(
  componentId: string,
  componentType: string,
  storeType: "editor" | "tenant",
  data: any,
  type: StoreSnapshot["type"] = "before-save"
): StoreSnapshot {
  return {
    timestamp: new Date().toISOString(),
    componentId,
    componentType,
    type,
    operation: "save",
    storeType,
    before: data,
    after: data,
  };
}

/**
 * Compare snapshots
 */
export function compareSnapshots(snapshot1: StoreSnapshot, snapshot2: StoreSnapshot): any {
  return diffUtils.calculateDiff(snapshot1.after, snapshot2.before);
}

/**
 * Restore snapshot
 */
export function restoreSnapshot(snapshot: StoreSnapshot): any {
  return snapshot.after || snapshot.before;
}

/**
 * Export snapshot
 */
export function exportSnapshot(snapshot: StoreSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

/**
 * Get snapshot diff
 */
export function getSnapshotDiff(snapshot: StoreSnapshot): any {
  if (snapshot.diff) {
    return snapshot.diff;
  }
  return diffUtils.calculateDiff(snapshot.before, snapshot.after);
}

export const snapshotUtils = {
  createSnapshot,
  compareSnapshots,
  restoreSnapshot,
  exportSnapshot,
  getSnapshotDiff,
};
