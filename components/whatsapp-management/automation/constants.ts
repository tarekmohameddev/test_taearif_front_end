import type { RuleFormData } from "./types";

export const TRIGGER_LABELS: Record<string, string> = {
  new_inquiry: "استفسار جديد",
  no_response_24h: "لا يوجد رد - 24 ساعة",
  no_response_48h: "لا يوجد رد - 48 ساعة",
  no_response_72h: "لا يوجد رد - 72 ساعة",
  follow_up: "متابعة دورية",
  appointment_reminder: "تذكير بالموعد",
  property_match: "عقار مطابق",
  price_change: "تغيير في السعر",
};

export const TRIGGER_OPTIONS = [
  { value: "new_inquiry", label: "استفسار جديد" },
  { value: "no_response_24h", label: "لا يوجد رد - 24 ساعة" },
  { value: "no_response_48h", label: "لا يوجد رد - 48 ساعة" },
  { value: "no_response_72h", label: "لا يوجد رد - 72 ساعة" },
  { value: "follow_up", label: "متابعة دورية" },
  { value: "appointment_reminder", label: "تذكير بالموعد" },
  { value: "property_match", label: "عقار مطابق" },
  { value: "price_change", label: "تغيير في السعر" },
] as const;

export const DEFAULT_RULE_FORM_DATA: RuleFormData = {
  name: "",
  description: "",
  trigger: "",
  delayMinutes: 0,
  templateId: "",
  isActive: true,
};

export function formatDelayDisplay(delayMinutes: number): string {
  if (delayMinutes === 0) return "فوري";
  if (delayMinutes >= 1440) return `${delayMinutes / 1440} يوم`;
  if (delayMinutes >= 60) return `${delayMinutes / 60} ساعة`;
  return `${delayMinutes} دقيقة`;
}

export function getTriggerText(trigger: string): string {
  return TRIGGER_LABELS[trigger] ?? trigger;
}
