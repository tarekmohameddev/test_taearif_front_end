"use client";

import { useMutation } from "@tanstack/react-query";
import { sendOtp, getErrorMessage } from "../services/auth-api";
import type { SendOtpRequest, SendOtpResponse } from "../types/register-types";

export function useSendOtp() {
  return useMutation<SendOtpResponse, Error, SendOtpRequest>({
    mutationFn: sendOtp,
    onError: (error) => {
      console.error("Send OTP error:", error);
    },
  });
}

export { getErrorMessage };
