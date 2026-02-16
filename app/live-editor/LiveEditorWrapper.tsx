"use client";
import React, { useEffect, useRef } from "react";
import LiveEditor from "@/components/tenant/live-editor/LiveEditor";
import useTenantStore from "@/context/tenantStore";
import { usePathname } from "next/navigation";

interface LiveEditorWrapperProps {
  tenantId: string | null;
}

function isBaseDomain(hostname: string): boolean {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const BASE_DOMAINS = [
    productionDomain,
    `www.${productionDomain}`,
    "mandhoor.com",
    "www.mandhoor.com",
  ];
  return BASE_DOMAINS.includes(hostname);
}

function extractTenantFromHostname(hostname: string): string | null {
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isBaseDomain(hostname)) {
    return null;
  }

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
  const storeTenantData = useTenantStore((s) => s.tenantData);
  const pathname = usePathname();
  const prevTenantIdRef = useRef<string | null>(null);
  const prevPathnameRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    const pathnameChanged = prevPathnameRef.current !== pathname;
    const tenantIdPropChanged = prevTenantIdRef.current !== tenantId;

    if (!hasInitializedRef.current || pathnameChanged || tenantIdPropChanged) {
      let finalTenantId = tenantId;

      if (!finalTenantId && typeof window !== "undefined") {
        const hostname = window.location.hostname;
        const isBase = isBaseDomain(hostname);

        if (isBase) {
          finalTenantId = storeTenantId || storeTenantData?.username || null;
        } else {
          finalTenantId = extractTenantFromHostname(hostname);
        }
      }

      const currentStoreTenantId = useTenantStore.getState().tenantId;
      if (finalTenantId && finalTenantId !== currentStoreTenantId) {
        setTenantId(finalTenantId);
      }

      prevTenantIdRef.current = tenantId;
      prevPathnameRef.current = pathname;
      hasInitializedRef.current = true;
    }
  }, [tenantId, pathname, setTenantId, storeTenantId, storeTenantData]);

  return <LiveEditor />;
}
