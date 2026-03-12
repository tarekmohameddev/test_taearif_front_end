/**
 * Single source of truth: dashboard page slug → backend permission name.
 * Used by userStore.hasAccessToPage and usePermissions.getPermissionName.
 * Must match backend permission names from /api/user.
 */

export const PAGE_SLUG_TO_PERMISSION: Record<string, string> = {
  customers: "customers.view",
  live_editor: "live_editor.view",
  properties: "properties.view",
  rentals: "rentals.view",
  projects: "projects.view",
  employees: "employees.view",
  analytics: "analytics.view",
  settings: "settings.view",
  "access-control": "access.control",
  marketing: "marketing.view",
  templates: "templates.view",
  websites: "websites.view",
  "activity-logs": "activity.logs.view",
  "purchase-management": "purchase.management",
  "rental-management": "rentals.view",
  "financial-reporting": "financial.reporting",
  affiliate: "affiliate.view",
  "help-center": "help.center",
  solutions: "solutions.view",
  apps: "apps.view",
  blogs: "blogs.view",
  messages: "messages.view",
  "whatsapp-ai": "whatsapp.ai",
  buildings: "buildings.view",
  "job-applications": "job_applications.view",
  "property-requests": "property_requests.view",
  matching: "property_requests.view",
};

/**
 * Resolves a dashboard page slug to the backend permission name.
 * Fallback: `${slug}.view` for unknown slugs.
 */
export function getPermissionNameForSlug(slug: string): string {
  return PAGE_SLUG_TO_PERMISSION[slug] ?? `${slug}.view`;
}
