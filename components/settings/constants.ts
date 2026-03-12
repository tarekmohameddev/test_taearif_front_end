/**
 * Settings page constants: tab IDs, domain statuses, validation, and copy.
 */

export const TAB_IDS = {
  DOMAINS: "domains",
  SUBSCRIPTION: "subscription",
  THEMES: "themes",
} as const;

export type SettingsTabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

export const DOMAIN_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
} as const;

export const DOMAIN_STATUS_FILTER = {
  ALL: "all",
  ACTIVE: "active",
  PENDING: "pending",
} as const;

/** Regex for valid domain format (no www, no protocol). */
export const DOMAIN_REGEX =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const DEFAULT_BILLING_PERIOD = "yearly" as const;

export const NAMESERVERS = [
  "ns1.vercel-dns.com",
  "ns2.vercel-dns.com",
] as const;

export const DEFAULT_DNS_DESCRIPTION =
  "لربط نطاقك، ستحتاج إلى تحديث Nameservers الخاصة بك لدى مسجل النطاق لتوجيهها إلى Vercel.";

export const DEFAULT_DNS_NOTE =
  "قد تستغرق تغييرات Nameservers ما يصل إلى 48 ساعة للانتشار عالميًا. هذا يعني أن نطاقك قد لا يعمل مباشرة بعد إجراء هذه التغييرات.";
