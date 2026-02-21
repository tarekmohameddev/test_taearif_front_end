/**
 * SMS Campaigns module — clean structure
 *
 * - SMSCampaignsPage: main page (orchestrator)
 * - hooks/: data & actions (campaigns, templates, stats, logs)
 * - dialogs/: CreateCampaignDialog, CreateTemplateDialog
 * - constants.ts: status/category labels & colors, default stats
 * - types.ts: UI types & API mappers
 */

export { SMSCampaignsPage } from "./SMSCampaignsPage";
export { SMSCreditBalance, CREDITS_PER_SMS } from "./SMSCreditBalance";
export { SmsCampaignsStats } from "./SmsCampaignsStats";
export { SmsCampaignsOverview } from "./SmsCampaignsOverview";
export { SmsCampaignsList } from "./SmsCampaignsList";
export { SmsTemplatesList } from "./SmsTemplatesList";
export { SmsLogsList } from "./SmsLogsList";
export { CreateCampaignDialog, CreateTemplateDialog } from "./dialogs";
export { useSmsCampaigns, useSmsTemplates, useSmsStats, useSmsLogs } from "./hooks";
export {
  getStatusColor,
  getCategoryColor,
  STATUS_LABELS,
  CATEGORY_LABELS,
  DEFAULT_STATS,
  TEMPLATE_CATEGORIES,
} from "./constants";
export type { SMSCampaign, SMSTemplate, SMSStats, SMSLog } from "./types";
