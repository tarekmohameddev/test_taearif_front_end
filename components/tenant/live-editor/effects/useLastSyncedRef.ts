import { useRef } from "react";

/**
 * Creates and manages lastSyncedRef for store sync
 * This ref is shared across multiple effects to track sync state
 */
export const useLastSyncedRef = () => {
  const lastSyncedRef = useRef<string>("");
  return lastSyncedRef;
};
