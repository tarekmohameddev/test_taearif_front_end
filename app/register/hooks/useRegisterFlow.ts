"use client";

import { useState, useCallback } from "react";
import type { RegisterStep, RegisterFlowState } from "../types/register-types";

const initialState: RegisterFlowState = {
  step: 1,
  phone: "",
  verifiedToken: null,
};

export function useRegisterFlow() {
  const [state, setState] = useState<RegisterFlowState>(initialState);

  const setPhone = useCallback((phone: string) => {
    setState((prev) => ({ ...prev, phone }));
  }, []);

  const setVerifiedToken = useCallback((token: string) => {
    setState((prev) => ({ ...prev, verifiedToken: token }));
  }, []);

  const goToStep = useCallback((step: RegisterStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, 3) as RegisterStep,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 1) as RegisterStep,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setPhone,
    setVerifiedToken,
    goToStep,
    nextStep,
    prevStep,
    reset,
  };
}
