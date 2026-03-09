/**
 * WhatsApp campaigns — type re-exports and UI types
 */

export type {
  ApiWaCampaign,
  WaCampaignStatus,
  CreateWaCampaignBody,
  SendWaCampaignBody,
  ResumeWaCampaignBody,
  WhatsAppNumberDTO,
  Pagination,
} from "@/lib/services/whatsapp-api";

/** Template option for campaign create form (id, name, variables). */
export interface TemplateOption {
  id: number;
  name: string;
  variables?: string[];
}
