"use client";

import { useCallback } from "react";
import type { CustomerAction } from "@/types/unified-customer";

type CompleteAction = () => void | Promise<void>;
type DismissAction = () => void | Promise<void>;

export interface UseRequestDetailHandlersParams {
  action: CustomerAction | null | undefined;
  completeAction: CompleteAction;
  dismissAction: DismissAction;
}

export function useRequestDetailHandlers({
  action,
  completeAction,
  dismissAction,
}: UseRequestDetailHandlersParams) {
  const handleComplete = useCallback(async () => {
    try {
      await completeAction();
    } catch {
      // Error toast is handled in caller/hook
    }
  }, [completeAction]);

  const handleDismiss = useCallback(async () => {
    try {
      await dismissAction();
    } catch {
      // Error toast is handled in caller/hook
    }
  }, [dismissAction]);

  return { handleComplete, handleDismiss };
}
