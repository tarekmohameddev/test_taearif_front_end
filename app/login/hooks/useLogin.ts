"use client";

import { useMutation } from "@tanstack/react-query";
import { login, getErrorMessage } from "../services/login-api";
import type { LoginRequest, LoginResponse } from "../types/login-types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
}

export { getErrorMessage };
