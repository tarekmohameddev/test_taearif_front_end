/**
 * SMS Campaigns - Type Definitions (UI)
 * API returns snake_case; these are camelCase for the UI.
 */

/** Single source of truth for campaign status. API may return in_progress; UI uses in-progress. */
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "in-progress"
  | "paused"
  | "sent"
  | "failed"
  | "cancelled";

export interface SMSCampaign {
  id: string;
  name: string;
  description?: string;
  message: string;
  status: CampaignStatus;
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  /** Optional: from API when campaign is in_progress or paused */
  reservedCredits?: number;
  /** Optional: from API when campaign is paused (recipients not yet sent to) */
  pausedCount?: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  tags?: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: "promotional" | "transactional" | "reminder" | "notification" | "follow-up";
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SMSContact {
  id: string;
  name: string;
  phone: string;
  tags?: string[];
  isSubscribed: boolean;
}

export interface SMSStats {
  totalCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  thisMonthSent: number;
}

export interface SMSLog {
  id: string;
  campaignId: string;
  campaignName: string;
  contactId: string;
  contactName: string;
  phone: string;
  message: string;
  status: "sent" | "delivered" | "failed" | "pending" | "paused" | "cancelled";
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

/** Normalize API status (e.g. in_progress) to UI CampaignStatus (e.g. in-progress). */
function normalizeCampaignStatus(apiStatus: string): CampaignStatus {
  if (apiStatus === "in_progress") return "in-progress";
  const allowed: CampaignStatus[] = ["draft", "scheduled", "paused", "sent", "failed", "cancelled"];
  return allowed.includes(apiStatus as CampaignStatus) ? (apiStatus as CampaignStatus) : "draft";
}

/** Map API campaign (snake_case) to UI SMSCampaign (camelCase). */
export function mapApiCampaignToUI(c: {
  id: number;
  name: string;
  description?: string | null;
  message: string;
  status: string;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  reserved_credits?: number | null;
  paused_count?: number | null;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  created_by?: string | null;
  user_id?: number | null;
  tags?: string[] | null;
  creator_display?: { company_name?: string } | null;
  user?: { basic_setting?: { company_name?: string } } | null;
}): SMSCampaign {
  const createdByDisplay =
    c.creator_display?.company_name ??
    c.user?.basic_setting?.company_name ??
    c.created_by ??
    (c.user_id != null ? String(c.user_id) : "");
  return {
    id: String(c.id),
    name: c.name,
    description: c.description ?? undefined,
    message: c.message,
    status: normalizeCampaignStatus(c.status),
    recipientCount: c.recipient_count ?? 0,
    sentCount: c.sent_count ?? 0,
    deliveredCount: c.delivered_count ?? 0,
    failedCount: c.failed_count ?? 0,
    reservedCredits: c.reserved_credits ?? undefined,
    pausedCount: c.paused_count ?? undefined,
    scheduledAt: c.scheduled_at ?? undefined,
    sentAt: c.sent_at ?? undefined,
    createdAt: c.created_at,
    createdBy: createdByDisplay,
    tags: c.tags ?? undefined,
  };
}

/** Map API template to UI SMSTemplate. */
export function mapApiTemplateToUI(t: {
  id: number;
  name: string;
  content: string;
  category: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}): SMSTemplate {
  return {
    id: String(t.id),
    name: t.name,
    content: t.content,
    category: (t.category as SMSTemplate["category"]) || "notification",
    variables: t.variables ?? [],
    isActive: t.is_active,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

/** Map API log to UI SMSLog. */
export function mapApiLogToUI(l: {
  id: number | string;
  campaign_id?: number;
  campaign_name?: string;
  contact_id?: number | string;
  contact_name?: string;
  phone: string;
  message: string;
  status: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  error_message?: string | null;
}): SMSLog {
  return {
    id: String(l.id),
    campaignId: l.campaign_id != null ? String(l.campaign_id) : "",
    campaignName: l.campaign_name ?? "",
    contactId: l.contact_id != null ? String(l.contact_id) : "",
    contactName: l.contact_name ?? "",
    phone: l.phone,
    message: l.message,
    status: l.status as SMSLog["status"],
    sentAt: l.sent_at ?? "",
    deliveredAt: l.delivered_at ?? undefined,
    errorMessage: l.error_message ?? undefined,
  };
}
