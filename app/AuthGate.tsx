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

    // #region agent log
    fetch(
      "http://127.0.0.1:7242/ingest/5b679b9a-1ddc-4ba7-b77c-00170dd91735",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "affb0d",
        },
        body: JSON.stringify({
          sessionId: "affb0d",
          runId: "initial",
          hypothesisId: "H2",
          location: "app/AuthGate.tsx:48",
          message: "AuthGate: initial session check",
          data: {
            pathname: pathname || "",
            hasSession: result,
          },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
    // #endregion
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;
    if (isAuthPageNoSessionRequired(pathname || "")) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/5b679b9a-1ddc-4ba7-b77c-00170dd91735",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "affb0d",
          },
          body: JSON.stringify({
            sessionId: "affb0d",
            runId: "initial",
            hypothesisId: "H2",
            location: "app/AuthGate.tsx:66",
            message:
              "AuthGate: auth page, no session required (no redirect to login)",
            data: {
              pathname: pathname || "",
              hasSession,
            },
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
      // #endregion
      return;
    }
    if (!hasSession) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/5b679b9a-1ddc-4ba7-b77c-00170dd91735",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "affb0d",
          },
          body: JSON.stringify({
            sessionId: "affb0d",
            runId: "initial",
            hypothesisId: "H2",
            location: "app/AuthGate.tsx:84",
            message: "AuthGate: redirecting to /login (no session)",
            data: {
              pathname: pathname || "",
              hasSession,
            },
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
      // #endregion
      router.push("/login");
    }
  }, [sessionChecked, hasSession, pathname, router]);

  if (!sessionChecked) {
    return <>{children}</>;
  }

  if (!isAuthPageNoSessionRequired(pathname || "") && !hasSession) {
    // #region agent log
    fetch(
      "http://127.0.0.1:7242/ingest/5b679b9a-1ddc-4ba7-b77c-00170dd91735",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "affb0d",
        },
        body: JSON.stringify({
          sessionId: "affb0d",
          runId: "initial",
          hypothesisId: "H2",
          location: "app/AuthGate.tsx:111",
          message: "AuthGate: rendering null (blocked protected page)",
          data: {
            pathname: pathname || "",
            hasSession,
          },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
    // #endregion
    return null;
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/5b679b9a-1ddc-4ba7-b77c-00170dd91735", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "affb0d",
    },
    body: JSON.stringify({
      sessionId: "affb0d",
      runId: "initial",
      hypothesisId: "H2",
      location: "app/AuthGate.tsx:132",
      message: "AuthGate: rendering ClientLayoutAuth (access granted)",
      data: {
        pathname: pathname || "",
        hasSession,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return <ClientLayoutAuth>{children}</ClientLayoutAuth>;
}

