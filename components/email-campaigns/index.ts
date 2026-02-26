/**
 * Email Campaigns module — same structure as SMS Campaigns
 *
 * - EmailCampaignsPage: main page (orchestrator)
 * - hooks/: data & actions (campaigns, templates, stats, logs)
 * - dialogs/: CreateCampaignDialog, CreateTemplateDialog
 * - constants.ts: status/category labels & colors, default stats
 * - types.ts: UI types & API mappers
 */

export { EmailCampaignsPage } from "./EmailCampaignsPage";
export { EmailCreditBalance, CREDITS_PER_EMAIL } from "./EmailCreditBalance";
export { EmailCampaignsStats } from "./EmailCampaignsStats";
export { EmailCampaignsOverview } from "./EmailCampaignsOverview";
export { EmailCampaignsList } from "./EmailCampaignsList";
export { EmailTemplatesList } from "./EmailTemplatesList";
export { EmailLogsList } from "./EmailLogsList";
export { CreateCampaignDialog, CreateTemplateDialog } from "./dialogs";
export { useEmailCampaigns, useEmailTemplates, useEmailStats, useEmailLogs } from "./hooks";
export {
  getStatusColor,
  getCategoryColor,
  STATUS_LABELS,
  CATEGORY_LABELS,
  DEFAULT_STATS,
  TEMPLATE_CATEGORIES,
} from "./constants";
export type { EmailCampaign, EmailTemplate, EmailStats, EmailLog } from "./types";
