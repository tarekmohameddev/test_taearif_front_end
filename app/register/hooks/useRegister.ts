"use client";

import { useMutation } from "@tanstack/react-query";
import { register, getErrorMessage } from "../services/auth-api";
import type { RegisterRequest, RegisterResponse } from "../types/register-types";

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,
    onError: (error) => {
      console.error("Register error:", error);
    },
  });
}

export { getErrorMessage };
