/**
 * Email Campaigns - Type Definitions (UI)
 * API returns snake_case; these are camelCase for the UI.
 * API reference: subject, body_html, body_text for templates and campaigns.
 */

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "in-progress"
  | "paused"
  | "sent"
  | "failed"
  | "cancelled";

export interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  status: CampaignStatus;
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  reservedCredits?: number;
  pausedCount?: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  tags?: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  isActive: boolean;
  meta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailStats {
  totalCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  thisMonthSent: number;
}

export interface EmailLog {
  id: string;
  campaignId: string;
  campaignName?: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  message: string;
  status: "sent" | "delivered" | "failed" | "pending" | "paused" | "cancelled";
  sentAt: string;
  deliveredAt?: string | null;
  errorMessage?: string | null;
}

function normalizeCampaignStatus(apiStatus: string): CampaignStatus {
  if (apiStatus === "in_progress") return "in-progress";
  const allowed: CampaignStatus[] = ["draft", "scheduled", "paused", "sent", "failed", "cancelled"];
  return allowed.includes(apiStatus as CampaignStatus) ? (apiStatus as CampaignStatus) : "draft";
}

export function mapApiCampaignToUI(c: {
  id: number;
  name: string;
  description?: string | null;
  subject?: string | null;
  body_html?: string | null;
  body_text?: string | null;
  status: string;
  recipient_count?: number;
  sent_count?: number;
  delivered_count?: number;
  failed_count?: number;
  reserved_credits?: number | null;
  paused_count?: number | null;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  created_by?: string | null;
  created_by_user_id?: number | null;
  user_id?: number | null;
  tags?: string[] | null;
  creator_display?: { company_name?: string } | null;
  creator?: { basic_setting?: { company_name?: string } } | null;
  user?: { basic_setting?: { company_name?: string } } | null;
}): EmailCampaign {
  const createdByDisplay =
    c.creator_display?.company_name ??
    c.creator?.basic_setting?.company_name ??
    c.user?.basic_setting?.company_name ??
    c.created_by ??
    (c.created_by_user_id != null ? String(c.created_by_user_id) : c.user_id != null ? String(c.user_id) : "");
  return {
    id: String(c.id),
    name: c.name,
    description: c.description ?? undefined,
    subject: c.subject ?? "",
    bodyHtml: c.body_html ?? "",
    bodyText: c.body_text ?? undefined,
    status: normalizeCampaignStatus(c.status),
    recipientCount: Number(c.recipient_count) || 0,
    sentCount: Number(c.sent_count) || 0,
    deliveredCount: Number(c.delivered_count) || 0,
    failedCount: Number(c.failed_count) || 0,
    reservedCredits: c.reserved_credits ?? undefined,
    pausedCount: c.paused_count ?? undefined,
    scheduledAt: c.scheduled_at ?? undefined,
    sentAt: c.sent_at ?? undefined,
    createdAt: c.created_at,
    createdBy: createdByDisplay,
    tags: c.tags ?? undefined,
  };
}

export function mapApiTemplateToUI(t: {
  id: number;
  name: string;
  subject: string;
  body_html: string;
  body_text?: string | null;
  is_active: boolean;
  meta?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}): EmailTemplate {
  return {
    id: String(t.id),
    name: t.name,
    subject: t.subject ?? "",
    bodyHtml: t.body_html ?? "",
    bodyText: t.body_text ?? null,
    isActive: t.is_active,
    meta: t.meta ?? null,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

export function mapApiLogToUI(l: {
  id: number | string;
  campaign_id?: number;
  campaign_name?: string;
  recipient_email?: string;
  recipient_name?: string;
  subject?: string;
  message?: string;
  status: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  error_message?: string | null;
}): EmailLog {
  return {
    id: String(l.id),
    campaignId: l.campaign_id != null ? String(l.campaign_id) : "",
    campaignName: l.campaign_name ?? undefined,
    recipientEmail: l.recipient_email ?? "",
    recipientName: l.recipient_name ?? undefined,
    subject: l.subject ?? "",
    message: l.message ?? "",
    status: (l.status as EmailLog["status"]) ?? "pending",
    sentAt: l.sent_at ?? "",
    deliveredAt: l.delivered_at ?? undefined,
    errorMessage: l.error_message ?? undefined,
  };
}
