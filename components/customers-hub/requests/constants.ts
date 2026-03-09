import type { CustomerActionType, Priority } from "@/types/unified-customer";
import type { Appointment } from "@/types/unified-customer";

/** Used in request detail header/cards: label, badge color, border color */
export const priorityConfig: Record<
  Priority,
  { label: string; color: string; borderColor: string }
> = {
  urgent: { label: "عاجل", color: "bg-red-500 text-white", borderColor: "border-red-500" },
  high: { label: "مهم", color: "bg-orange-500 text-white", borderColor: "border-orange-500" },
  medium: { label: "متوسط", color: "bg-yellow-500 text-white", borderColor: "border-yellow-500" },
  low: { label: "منخفض", color: "bg-green-500 text-white", borderColor: "border-green-500" },
};

export const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: "معلق", color: "bg-gray-500 text-white" },
  in_progress: { label: "جاري العمل", color: "bg-blue-500 text-white" },
  completed: { label: "مكتمل", color: "bg-green-500 text-white" },
  dismissed: { label: "تم الرفض", color: "bg-gray-400 text-white" },
  snoozed: { label: "مؤجل", color: "bg-purple-500 text-white" },
};

export const priorityLabels: Record<Priority, string> = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

export const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "urgent", label: "عاجل", color: "bg-red-100 text-red-700" },
  { value: "high", label: "مهم", color: "bg-orange-100 text-orange-700" },
  { value: "medium", label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  { value: "low", label: "منخفض", color: "bg-green-100 text-green-700" },
];

export const actionTypeLabels: Record<CustomerActionType, string> = {
  new_inquiry: "استفسار جديد",
  callback_request: "طلب اتصال",
  property_match: "مطابقة عقار",
  follow_up: "متابعة",
  document_required: "مستندات",
  payment_due: "دفع مستحق",
  site_visit: "معاينة",
  whatsapp_incoming: "واتساب",
  ai_recommended: "موصى به",
};

export const APPOINTMENT_TYPES: { value: Appointment["type"]; label: string }[] = [
  { value: "site_visit", label: "معاينة عقار" },
  { value: "office_meeting", label: "اجتماع مكتب" },
  { value: "phone_call", label: "مكالمة هاتفية" },
  { value: "video_call", label: "مكالمة فيديو" },
  { value: "contract_signing", label: "توقيع عقد" },
  { value: "other", label: "أخرى" },
];

/** Longer labels for request detail page */
export const requestDetailActionTypeLabels: Record<string, string> = {
  new_inquiry: "استفسار جديد",
  callback_request: "طلب اتصال",
  property_match: "مطابقة عقار",
  follow_up: "متابعة",
  document_required: "مستندات مطلوبة",
  payment_due: "دفع مستحق",
  site_visit: "معاينة عقار",
  whatsapp_incoming: "رسالة واتساب",
  ai_recommended: "موصى به بالذكاء الاصطناعي",
};

export const PROPERTY_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "villa", label: "فيلا" },
  { value: "apartment", label: "شقة" },
  { value: "land", label: "أرض" },
  { value: "commercial", label: "تجاري" },
];

export const SAUDI_REGIONS = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "الشرقية",
  "القصيم",
  "عسير",
  "تبوك",
  "حائل",
  "الحدود الشمالية",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
] as const;

export const CITY_TO_REGION: Record<string, string> = {
  الرياض: "الرياض",
  جدة: "مكة المكرمة",
  مكة: "مكة المكرمة",
  الدمام: "الشرقية",
  الخبر: "الشرقية",
  الظهران: "الشرقية",
  أبها: "عسير",
  "خميس مشيط": "عسير",
  المدينة: "المدينة المنورة",
  بريدة: "القصيم",
  حائل: "حائل",
  تبوك: "تبوك",
  نجران: "نجران",
  جازان: "جازان",
  الباحة: "الباحة",
  الجوف: "الجوف",
};

export const REQUEST_TYPES: CustomerActionType[] = [
  "new_inquiry",
  "callback_request",
  "whatsapp_incoming",
];

export const FOLLOWUP_TYPES: CustomerActionType[] = ["follow_up", "site_visit"];

/** Default time for snooze/schedule/reminder forms (HH:mm). */
export const DEFAULT_TIME = "10:00";

/**
 * Feature flags for request detail page sections.
 * Set to true to show the reminders list and notes card (currently hidden).
 * See docs/updates/dashboard/customers-hub/requests/RequestDetailPage.txt
 */
export const SHOW_REMINDERS_SECTION = false;
export const SHOW_NOTES_SECTION = false;
