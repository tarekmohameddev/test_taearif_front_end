/**
 * Token registry for axios request interceptor.
 * AuthProvider sets the getter on mount so axiosInstance can attach the token
 * without importing AuthContext. This keeps axiosInstance out of the AuthContext
 * bundle dependency chain.
 */

let tokenGetter = null;

/** Returns the current auth token or null. Used by axiosInstance interceptor. */
export function getToken() {
  try {
    if (typeof tokenGetter === "function") {
      const fromGetter = tokenGetter();
      if (fromGetter != null && fromGetter !== "") return fromGetter;
    }
  } catch {
    // ignore getter errors
  }
  // Fallback: read from localStorage so token is available before AuthProvider mounts
  // (e.g. when AuthGate first renders dashboard without ClientLayoutAuth)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.token;
        if (token != null && token !== "") return token;
      }
    } catch {
      // ignore parse/read errors
    }
  }
  return null;
}

/** Called by AuthProvider on mount. fn() should return useAuthStore.getState().userData?.token */
export function setTokenGetter(fn) {
  tokenGetter = typeof fn === "function" ? fn : null;
}

/** Called by AuthProvider on unmount. */
export function clearTokenGetter() {
  tokenGetter = null;
}
