"use client";

import { useMutation } from "@tanstack/react-query";
import { sendResetCode } from "../services/forgot-password-api";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/forgot-password-types";

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: sendResetCode,
    onError: (error) => {
      console.error("Forgot password error:", error);
    },
  });
}
