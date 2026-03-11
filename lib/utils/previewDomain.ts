/**
 * Builds the preview site URL based on current environment (hostname).
 * In production: no modification — backend domain is used as-is (supports custom domains and subdomains).
 * In localhost / mandhoor.com / samybranchtaearif.site: applies environment-specific replacements.
 */

const PREVIEW_HOST_MANDHOOR = "mandhoor.com";
const PREVIEW_HOST_SAMYBRANCH = "samybranchtaearif.site";

/**
 * Extracts host from domain string (with or without protocol).
 */
function extractHost(domain: string): string {
  const trimmed = domain.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const u = new URL(trimmed);
      return u.hostname + (u.port ? `:${u.port}` : "");
    } catch {
      return trimmed.replace(/^https?:\/\//, "").split("/")[0] ?? trimmed;
    }
  }
  return trimmed.split("/")[0] ?? trimmed;
}

/**
 * Returns the preview site URL for the given backend domain and optional path.
 * Environment is determined by window.location.hostname (client-side only).
 * - Production (taearif.com / www.taearif.com): no modification — use backend domain as-is.
 * - localhost: replace taearif.com with localhost:3000, use http.
 * - mandhoor.com / *.mandhoor.com: replace taearif with mandhoor, https.
 * - samybranchtaearif.site / *.samybranchtaearif.site: replace taearif.com with samybranchtaearif.site, https.
 */
export function getPreviewSiteUrl(domain: string, path?: string): string {
  if (!domain || !domain.trim()) return "";

  const pathPart = path?.trim().startsWith("/") ? path.trim() : path ? `/${path.trim()}` : "";
  const host = extractHost(domain);

  if (typeof window === "undefined") {
    const hasProtocol = domain.trim().startsWith("http");
    const base = hasProtocol ? domain.trim().split("/").slice(0, 3).join("/") : `https://${host}`;
    return base.replace(/\/+$/, "") + pathPart;
  }

  const hostname = window.location.hostname;

  // Production: no modification — use backend domain as-is (supports custom domains and subdomains).
  const isProduction = hostname === "taearif.com" || hostname === "www.taearif.com";
  if (isProduction) {
    const hasProtocol = domain.trim().startsWith("http");
    const base = hasProtocol ? domain.trim().replace(/\/+$/, "").split("/").slice(0, 3).join("/") : `https://${host}`;
    return base.replace(/\/+$/, "") + pathPart;
  }

  // localhost: http + localhost:3000
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const replaced = host.replace(/\.taearif\.com$/i, ".localhost:3000").replace(/^taearif\.com$/i, "localhost:3000");
    const protocol = "http";
    return `${protocol}://${replaced}${pathPart}`;
  }

  // mandhoor.com / *.mandhoor.com: https + replace taearif with mandhoor
  if (hostname === PREVIEW_HOST_MANDHOOR || hostname === `www.${PREVIEW_HOST_MANDHOOR}` || hostname.endsWith(`.${PREVIEW_HOST_MANDHOOR}`)) {
    const replaced = host.replace(/taearif/gi, "mandhoor");
    return `https://${replaced}${pathPart}`;
  }

  // samybranchtaearif.site / *.samybranchtaearif.site: https + replace taearif.com with samybranchtaearif.site
  if (hostname === PREVIEW_HOST_SAMYBRANCH || hostname.endsWith(`.${PREVIEW_HOST_SAMYBRANCH}`)) {
    const replaced = host.replace(/\.taearif\.com$/gi, ".samybranchtaearif.site").replace(/^taearif\.com$/gi, PREVIEW_HOST_SAMYBRANCH);
    return `https://${replaced}${pathPart}`;
  }

  // Any other host (e.g. unknown staging): no modification, use backend as-is with https.
  const hasProtocol = domain.trim().startsWith("http");
  const base = hasProtocol ? domain.trim().replace(/\/+$/, "").split("/").slice(0, 3).join("/") : `https://${host}`;
  return base.replace(/\/+$/, "") + pathPart;
}
