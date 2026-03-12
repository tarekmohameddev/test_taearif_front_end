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
    return <>{children}</>;
  }

  return <AuthGate>{children}</AuthGate>;
}
