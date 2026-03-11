import type { Appointment } from "@/types/unified-customer";
import type { Priority } from "@/types/unified-customer";

/** Card border + background by priority (urgent/medium use gradient). RTL: gradient from right to left. */
export const priorityColors: Record<Priority, string> = {
  urgent: "border-red-500 bg-gradient-to-l from-red-50 to-white dark:from-red-950/30 dark:to-gray-900",
  high: "border-orange-500 bg-gradient-to-l from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-900",
  medium: "border-yellow-500 bg-gradient-to-l from-[#ffeb2b]/20 to-white dark:from-[#ffeb2b]/15 dark:to-gray-900",
  low: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
};

/** Priority label in Arabic for display */
export const priorityLabels: Record<Priority, string> = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

/** Stitch-style priority pill: عالية / متوسطة / منخفضة (red / yellow / green) */
export const priorityStitchLabels: Record<Priority, string> = {
  urgent: "عالية",
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};

export const priorityStitchPillClass: Record<Priority, string> = {
  urgent: "px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full",
  high: "px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full",
  medium: "px-3 py-1 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded-full",
  low: "px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full",
};

/** Appointment type options for schedule form */
export const APPOINTMENT_TYPES: { value: Appointment["type"]; label: string }[] = [
  { value: "site_visit", label: "معاينة عقار" },
  { value: "office_meeting", label: "اجتماع مكتب" },
  { value: "phone_call", label: "مكالمة هاتفية" },
  { value: "video_call", label: "مكالمة فيديو" },
  { value: "contract_signing", label: "توقيع عقد" },
  { value: "other", label: "أخرى" },
];

/** Required fields for AI property matching (display names) */
export const AI_MATCHING_REQUIRED = {
  propertyType: "نوع العقار",
  budget: "الميزانية",
  location: "المنطقة أو المدينة",
} as const;

/** Label for "next action" section on grid card (all data from API) */
export const NEXT_ACTION_LABEL = "الإجراء القادم";

/** Purchase method / listing type from API: sale = للبيع, rent = للإيجار. Used for badge; only show when API returns value. */
export const PURCHASE_METHOD_SALE_VALUES = ["sale", "بيع", "للبيع", "buy"] as const;
export const PURCHASE_METHOD_RENT_VALUES = ["rent", "إيجار", "للإيجار"] as const;
