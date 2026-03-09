export interface AutomationModuleProps {
  selectedNumberId: number | null;
}

export interface RuleFormData {
  name: string;
  description: string;
  trigger: string;
  delayMinutes: number;
  templateId: string;
  isActive: boolean;
}

export type {
  AutomationRule,
  MessageTemplate,
  AutomationStats,
} from "../types";
