"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/forgot-password-api";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/forgot-password-types";

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
    onError: (error) => {
      console.error("Reset password error:", error);
    },
  });
}
