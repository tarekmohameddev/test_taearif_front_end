import type { CustomerActionType, Priority } from "@/types/unified-customer";

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
