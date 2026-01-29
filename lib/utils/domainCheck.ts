/**
 * Utility function to check if the current domain should bypass theme purchase checks
 * Similar to localhost in development mode
 */

export function shouldBypassThemePurchaseCheck(): boolean {
  // Check if we're in development mode (like localhost)
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // Check if window is available (client-side only)
  if (typeof window === "undefined") {
    return false;
  }

  // Get the hostname
  const hostname = window.location.hostname;

  // Check if hostname is mandhoor.com or any subdomain of mandhoor.com
  if (hostname === "mandhoor.com" || hostname === "www.mandhoor.com") {
    return true;
  }

  // Check if hostname ends with .mandhoor.com (for subdomains)
  if (hostname.endsWith(".mandhoor.com")) {
    return true;
  }

  return false;
}
