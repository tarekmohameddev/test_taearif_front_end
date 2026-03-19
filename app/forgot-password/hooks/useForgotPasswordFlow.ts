"use client";

import { useState, useCallback } from "react";
import type {
  ForgotPasswordStep,
  ForgotPasswordFlowState,
} from "../types/forgot-password-types";

const initialState: ForgotPasswordFlowState = {
  step: 1,
  identifier: "",
  method: "email",
};

export function useForgotPasswordFlow() {
  const [state, setState] = useState<ForgotPasswordFlowState>(initialState);

  const setIdentifier = useCallback((identifier: string) => {
    setState((prev) => ({ ...prev, identifier }));
  }, []);

  const setMethod = useCallback((method: "email" | "phone") => {
    setState((prev) => ({ ...prev, method }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, 2) as ForgotPasswordStep,
    }));
  }, []);

  const goToStep = useCallback((step: ForgotPasswordStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setIdentifier,
    setMethod,
    nextStep,
    goToStep,
    reset,
  };
}
