"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyOtp, getErrorMessage } from "../services/auth-api";
import type {
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../types/register-types";

export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpRequest>({
    mutationFn: verifyOtp,
    onError: (error) => {
      console.error("Verify OTP error:", error);
    },
  });
}

export { getErrorMessage };
