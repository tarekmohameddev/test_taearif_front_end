/**
 * SMS Campaigns - Type Definitions (UI)
 * API returns snake_case; these are camelCase for the UI.
 */

export interface SMSCampaign {
  id: string;
  name: string;
  description?: string;
  message: string;
  status: "draft" | "scheduled" | "sent" | "in-progress";
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
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
  status: "sent" | "delivered" | "failed" | "pending";
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
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
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  created_by?: string | null;
  tags?: string[] | null;
}): SMSCampaign {
  return {
    id: String(c.id),
    name: c.name,
    description: c.description ?? undefined,
    message: c.message,
    status: c.status as SMSCampaign["status"],
    recipientCount: c.recipient_count,
    sentCount: c.sent_count,
    deliveredCount: c.delivered_count,
    failedCount: c.failed_count,
    scheduledAt: c.scheduled_at ?? undefined,
    sentAt: c.sent_at ?? undefined,
    createdAt: c.created_at,
    createdBy: c.created_by ?? "",
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
  sent_at: string;
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
    sentAt: l.sent_at,
    deliveredAt: l.delivered_at ?? undefined,
    errorMessage: l.error_message ?? undefined,
  };
}
