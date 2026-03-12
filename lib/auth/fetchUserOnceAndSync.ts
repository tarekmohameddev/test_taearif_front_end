"use client";

/**
 * Single entry point for GET /user with in-flight request deduplication.
 * Callers (authActions, useTokenValidation) use this then sync AuthStore + userStore.
 * Does NOT import stores to avoid circular dependencies.
 */

import { fetchUserFromBackend } from "@/context/auth/authApi";

let inFlightPromise: Promise<unknown> | null = null;

/**
 * Performs a single GET /user request. Concurrent callers receive the same promise.
 * Clears in-flight state on success or failure.
 * @param force - If true, start a new request even when one is in flight (use for explicit refresh).
 * @returns The backend payload (response.data.data).
 */
export async function fetchUserOnceAndSync(force = false): Promise<unknown> {
  if (inFlightPromise && !force) {
    return inFlightPromise;
  }

  const promise = fetchUserFromBackend()
    .then((data) => {
      inFlightPromise = null;
      return data;
    })
    .catch((err) => {
      inFlightPromise = null;
      throw err;
    });

  inFlightPromise = promise;
  return promise;
}
