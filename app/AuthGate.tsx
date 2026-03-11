"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { hasSessionSync } from "@/lib/session";

const ClientLayoutAuth = dynamic(
  () => import("@/app/ClientLayoutAuth").then((m) => m.default),
  { ssr: true }
);

/** Paths where we need full auth (login form, etc.) but do NOT require an existing session */
const AUTH_PAGES_NO_SESSION_REQUIRED = [
  "/login",
  "/register",
  "/oauth",
  "/forgot-password",
  "/reset",
];

function pathWithoutLocale(pathname: string): string {
  return pathname?.replace(/^\/[a-z]{2}\//, "/") || pathname || "";
}

function isAuthPageNoSessionRequired(pathname: string): boolean {
  const path = pathWithoutLocale(pathname);
  return AUTH_PAGES_NO_SESSION_REQUIRED.some(
    (p) => path === p || path.startsWith(p + "/")
  );
}

/**
 * Lightweight gate for protected routes: only checks token/session.
 * Redirects to /login when no session on dashboard/live-editor/onboarding.
 * Loads full ClientLayoutAuth only when session exists or path is login/register/etc.
 * Does NOT import AuthContext or axiosInstance.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const result = hasSessionSync();
    setHasSession(result);
    setSessionChecked(true);
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;
    if (isAuthPageNoSessionRequired(pathname || "")) {
      return;
    }
    if (!hasSession) {
      router.push("/login");
    }
  }, [sessionChecked, hasSession, pathname, router]);

  if (!sessionChecked) {
    return <>{children}</>;
  }

  if (!isAuthPageNoSessionRequired(pathname || "") && !hasSession) {
    return null;
  }

  return <ClientLayoutAuth>{children}</ClientLayoutAuth>;
}

