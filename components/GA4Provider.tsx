"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  initializeGA4,
  trackPageView,
  setTenantContext,
} from "@/lib/ga4-tracking";
import useTenantStore from "@/context/tenantStore";

interface GA4ProviderProps {
  tenantId: string | null;
  domainType?: "subdomain" | "custom" | null;
  children: React.ReactNode;
}

export default function GA4Provider({
  tenantId,
  domainType,
  children,
}: GA4ProviderProps) {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // الحصول على username من tenantStore (للـ custom domains)
  const tenantData = useTenantStore((s) => s.tenantData);

  // Initialize GA4 only once
  useEffect(() => {
    const currentDomain =
      typeof window !== "undefined" ? window.location.hostname : "";
    const shouldTrack = shouldTrackDomain(currentDomain);

    if (!shouldTrack) {
      console.log("Skipping GA4 tracking for domain:", currentDomain);
      return;
    }

    if (!isInitialized) {
      initializeGA4();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Track page views with tenant_id
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentDomain = window.location.hostname;
    const domainTenantId = getTenantIdFromDomain(currentDomain);

    // Use tenantId if it's a valid string, otherwise use domainTenantId
    // This prevents empty strings from being used
    let finalTenantId =
      tenantId && tenantId.trim() !== "" ? tenantId : domainTenantId;

    // ✅ للـ custom domains: استخدم username من API بدلاً من domain
    if (domainType === "custom" && tenantData?.username) {
      finalTenantId = tenantData.username;
      console.log(
        "🌐 GA4: Using username from API for custom domain:",
        finalTenantId,
      );
    }

    // Only track if we have a valid tenant ID (not empty, not null, not 'www')
    const isValidTenantId =
      finalTenantId &&
      finalTenantId.trim() !== "" &&
      finalTenantId !== "www" &&
      finalTenantId !== "(not set)";

    if (isValidTenantId && pathname && isInitialized) {
      // Set tenant context
      setTenantContext(finalTenantId, finalTenantId);

      // Track page view with tenant_id as event parameter
      setTimeout(() => {
        trackPageView(finalTenantId, pathname);
      }, 500);
    } else {
      console.warn("⚠️ Missing required data for tracking:", {
        finalTenantId,
        pathname,
        isInitialized,
        isValidTenantId,
        domainType,
        tenantDataUsername: tenantData?.username,
      });
    }
  }, [tenantId, pathname, isInitialized, domainType, tenantData?.username]);

  return <>{children}</>;
}

// Check if domain should be tracked
const shouldTrackDomain = (domain: string): boolean => {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;

  // Don't track main domain
  if (domain === `www.${productionDomain}` || domain === productionDomain) {
    console.log("Skipping tracking for main domain:", domain);
    return false;
  }

  // Track tenant subdomains in production (e.g., lira.taearif.com)
  // But NOT www.taearif.com
  if (domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, "");
    if (subdomain === "www") {
      console.log("Skipping tracking for www subdomain");
      return false;
    }
    return true;
  }

  // Track localhost for development
  if (
    isDevelopment &&
    (domain === localDomain || domain.includes(localDomain))
  ) {
    return true;
  }

  // ✅ Track custom domains (any domain that's not the base domain)
  // Custom domains like: liraksa.com, mybusiness.net, etc.
  const isCustomDomain =
    /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(
      domain,
    );
  if (isCustomDomain) {
    console.log("Tracking custom domain:", domain);
    return true;
  }

  return false;
};

// Get tenant ID from subdomain
const getTenantIdFromDomain = (domain: string): string | null => {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;

  // For production: lira.taearif.com -> lira
  if (domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, "");

    // Exclude 'www' and empty subdomains - not valid tenants
    if (!subdomain || subdomain.trim() === "" || subdomain === "www") {
      console.warn("Skipping invalid subdomain (not a tenant):", subdomain);
      return null;
    }

    console.log("Extracted tenant from production domain:", subdomain);
    return subdomain;
  }

  // For development: lira.localhost -> lira
  if (isDevelopment && domain.includes(localDomain)) {
    const parts = domain.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const subdomain = parts[0];

      // Exclude 'www' and empty subdomains in development too
      if (!subdomain || subdomain.trim() === "" || subdomain === "www") {
        console.warn("Skipping invalid subdomain (not a tenant):", subdomain);
        return null;
      }

      console.log("Extracted tenant from dev domain:", subdomain);
      return subdomain;
    }
  }

  console.warn("Could not extract tenant from domain:", domain);
  return null;
};
