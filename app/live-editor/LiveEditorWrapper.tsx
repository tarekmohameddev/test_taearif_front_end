"use client";
import React from "react";
import LiveEditor from "@/components/tenant/live-editor/LiveEditor";
import useTenantStore from "@/context/tenantStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface LiveEditorWrapperProps {
  tenantId: string | null;
}

function extractTenantFromHostname(hostname: string): string | null {
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const isDevelopment = process.env.NODE_ENV === "development";

  const reservedWords = [
    "www",
    "api",
    "admin",
    "app",
    "mail",
    "ftp",
    "blog",
    "shop",
    "store",
  ];

  const isCustomDomain = /\.([a-z]{2,})$/i.test(hostname);

  if (isCustomDomain) {
    return hostname;
  }

  if (hostname.includes(localDomain)) {
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  if (!isDevelopment && hostname.includes(productionDomain)) {
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  return null;
}

export default function LiveEditorWrapper({
  tenantId,
}: LiveEditorWrapperProps) {
  const setTenantId = useTenantStore((s) => s.setTenantId);
  const storeTenantId = useTenantStore((s) => s.tenantId);
  const pathname = usePathname();

  useEffect(() => {
    let finalTenantId = tenantId;

    if (!finalTenantId && typeof window !== "undefined") {
      const hostname = window.location.hostname;
      finalTenantId = extractTenantFromHostname(hostname);
    }

    if (finalTenantId && finalTenantId !== storeTenantId) {
      setTenantId(finalTenantId);
    }
  }, [tenantId, pathname, storeTenantId, setTenantId]);

  return <LiveEditor />;
}
