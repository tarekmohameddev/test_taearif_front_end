import type { AIResponderConfig } from "../types";

export function getDefaultAIConfig(whatsappNumberId: number): AIResponderConfig {
  return {
    id: "",
    whatsappNumberId,
    enabled: false,
    businessHoursOnly: false,
    scenarios: {
      initialGreeting: false,
      faqResponses: false,
      propertyInquiryResponse: false,
      appointmentBooking: false,
      generalQuestions: false,
    },
    tone: "friendly",
    language: "ar",
    fallbackToHuman: true,
    fallbackDelay: 5,
  };
}

export const TONE_OPTIONS = [
  { value: "formal" as const, label: "رسمية" },
  { value: "friendly" as const, label: "ودية" },
  { value: "professional" as const, label: "مهنية" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "ar" as const, label: "العربية فقط" },
  { value: "en" as const, label: "الإنجليزية فقط" },
  { value: "both" as const, label: "كلا اللغتين" },
] as const;

export const SCENARIO_OPTIONS = [
  {
    key: "initialGreeting" as const,
    title: "الترحيب الأولي",
    description: "رسالة ترحيب للعملاء الجدد",
  },
  {
    key: "faqResponses" as const,
    title: "الأسئلة الشائعة",
    description: "الرد على الأسئلة المتكررة",
  },
  {
    key: "propertyInquiryResponse" as const,
    title: "استفسارات العقارات",
    description: "معلومات عن العقارات المتاحة",
  },
  {
    key: "appointmentBooking" as const,
    title: "حجز المواعيد",
    description: "المساعدة في حجز مواعيد المعاينة",
  },
  {
    key: "generalQuestions" as const,
    title: "أسئلة عامة",
    description: "الرد على الاستفسارات العامة",
  },
] as const;
