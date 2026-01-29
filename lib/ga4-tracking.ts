// lib/ga4-tracking.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-RVFKM2F9ZN";

/**
 * Initialize GA4
 */
export function initializeGA4(): void {
  if (typeof window === "undefined") return;

  // Load gtag.js script if not already loaded
  if (!window.gtag) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());

    // Configure GA4 without automatic page_view
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll track manually with tenant_id
    });

    console.log("✅ GA4 initialized:", GA_MEASUREMENT_ID);
  }
}

/**
 * Set tenant context (optional, for grouping)
 */
export function setTenantContext(tenantId: string, username: string): void {
  if (typeof window === "undefined" || !window.gtag) return;

  // Validate tenant_id before setting context
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn("⚠️ Invalid tenant_id, skipping context setting:", tenantId);
    return;
  }

  // Set user properties (optional)
  window.gtag("set", "user_properties", {
    tenant_id: tenantId,
    username: username,
  });

  console.log("🔧 Tenant context set:", tenantId);
}

/**
 * Track page view with tenant_id as EVENT PARAMETER
 * This is the critical function - sends tenant_id correctly
 */
export function trackPageView(tenantId: string, pagePath: string): void {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("⚠️ gtag not available");
    return;
  }

  // Validate tenant_id before tracking
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn("⚠️ Invalid tenant_id, skipping tracking:", tenantId);
    return;
  }

  // Send page_view event with tenant_id as a custom parameter
  window.gtag("event", "page_view", {
    page_path: pagePath,
    tenant_id: tenantId, // ← This is what your backend looks for!
  });

}

/**
 * Track property view (specific event)
 */
export function trackPropertyView(
  tenantId: string,
  propertySlug: string,
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  // Validate tenant_id before tracking
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn(
      "⚠️ Invalid tenant_id, skipping property view tracking:",
      tenantId,
    );
    return;
  }

  window.gtag("event", "view_property", {
    property_slug: propertySlug,
    tenant_id: tenantId, // ← Also include tenant_id in custom events
  });

  console.log("🏠 Property view tracked:", {
    slug: propertySlug,
    tenant_id: tenantId,
  });
}

/**
 * Track project view (specific event)
 */
export function trackProjectView(tenantId: string, projectSlug: string): void {
  if (typeof window === "undefined" || !window.gtag) return;

  // Validate tenant_id before tracking
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn(
      "⚠️ Invalid tenant_id, skipping project view tracking:",
      tenantId,
    );
    return;
  }

  window.gtag("event", "view_project", {
    project_slug: projectSlug,
    tenant_id: tenantId,
  });

  console.log("🏢 Project view tracked:", {
    slug: projectSlug,
    tenant_id: tenantId,
  });
}

/**
 * Track custom event with tenant_id
 */
export function trackEvent(
  eventName: string,
  tenantId: string,
  eventParams?: Record<string, any>,
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  // Validate tenant_id before tracking
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn("⚠️ Invalid tenant_id, skipping event tracking:", tenantId);
    return;
  }

  window.gtag("event", eventName, {
    ...eventParams,
    tenant_id: tenantId, // ← Always include tenant_id
  });

  console.log(`📌 Event tracked: ${eventName}`, {
    tenant_id: tenantId,
    ...eventParams,
  });
}
