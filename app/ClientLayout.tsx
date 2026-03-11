"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const AuthGate = dynamic(() => import("./AuthGate"), { ssr: true });

/**
 * Paths that require the full auth bundle (AuthContext, axiosInstance, redirects, popup).
 * For any other path we render children only so public routes (e.g. /ar, /landing) don't pull Auth.
 */
function isPathRequiringAuth(pathname: string): boolean {
  const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}\//, "/") || pathname || "";
  const authPaths = [
    "/dashboard",
    "/live-editor",
    "/login",
    "/register",
    "/onboarding",
    "/oauth",
    "/forgot-password",
    "/reset",
  ];
  if (authPaths.some((p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/"))) {
    return true;
  }
  return false;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (!pathname || !isPathRequiringAuth(pathname)) {
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
          hypothesisId: "H3",
          location: "app/ClientLayout.tsx:37",
          message: "ClientLayout: path does NOT require AuthGate",
          data: {
            pathname: pathname || "",
          },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
    // #endregion
    return <>{children}</>;
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
      hypothesisId: "H3",
      location: "app/ClientLayout.tsx:55",
      message: "ClientLayout: path requires AuthGate",
      data: {
        pathname: pathname || "",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return <AuthGate>{children}</AuthGate>;
}
