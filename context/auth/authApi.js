"use client";

/**
 * Auth API service - raw HTTP calls for auth.
 * Import this when you only need to call auth APIs without the store.
 */

import axiosInstance, { unlockAxios } from "@/lib/axiosInstance";

/** GET /user → returns response.data.data (subscription/user payload). */
export async function fetchUserFromBackend() {
  unlockAxios();
  const response = await axiosInstance.get("/user");
  return response.data.data;
}

/** GET /api/user/getUserInfo → returns parsed JSON. Throws if !res.ok. */
export async function fetchUserInfoFromBackend() {
  const res = await fetch("/api/user/getUserInfo", { credentials: "include" });
  if (!res.ok) throw new Error("فشل في جلب بيانات المستخدم");
  return res.json();
}

/** POST backend /login → { success, error } or { success, user, token }. */
export async function loginToBackend(email, password, recaptchaToken) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || "فشل تسجيل الدخول";
    return { success: false, error: msg === "Invalid credentials" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : msg };
  }
  return { success: true, user: data.user, token: data.token };
}

/** POST /api/user/setAuth → { success, error }. */
export async function setAuthCookie(user, UserToken) {
  const res = await fetch("/api/user/setAuth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, UserToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { success: false, error: data.error || "فشل في تعيين التوكن" };
  return { success: data.success !== false, error: data.error || null };
}

/** POST /api/user/logout. */
export async function logoutBackend() {
  await fetch("/api/user/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

/** GET backend /auth/google/redirect → url or null. */
export async function fetchGoogleAuthUrlFromBackend() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/redirect`);
  const data = await res.json();
  return data.url || null;
}

/** GET /user (caller must set token on axios first) → { user, userData }. Pass token to include in userData. */
export async function fetchUserWithTokenFromBackend(token) {
  unlockAxios();
  const response = await axiosInstance.get("/user");
  const data = response.data.data || response.data;
  const user = data?.user || data || response.data.user || response.data;
  return {
    user,
    userData: {
      ...user,
      token: token ?? null,
      onboarding_completed: user.onboarding_completed || false,
      domain: data?.domain ?? user?.domain ?? null,
      company_name: data?.company_name ?? user?.company_name ?? null,
    },
  };
}
