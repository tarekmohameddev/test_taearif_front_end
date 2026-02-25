/**
 * SMS Campaigns — constants and UI helpers (status/category labels and colors)
 */

import type { SMSStats } from "./types";

export const DEFAULT_STATS: SMSStats = {
  totalCampaigns: 0,
  totalSent: 0,
  totalDelivered: 0,
  totalFailed: 0,
  deliveryRate: 0,
  thisMonthSent: 0,
};

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-green-500/10 text-green-700 border-green-500/20",
  scheduled: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  draft: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  paused: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  cancelled: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20",
  failed: "bg-red-500/10 text-red-700 border-red-500/20",
  pending: "bg-orange-500/10 text-orange-700 border-orange-500/20",
};

const CATEGORY_COLORS: Record<string, string> = {
  promotional: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  transactional: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  reminder: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  notification: "bg-green-500/10 text-green-700 border-green-500/20",
  "follow-up": "bg-orange-500/10 text-orange-700 border-orange-500/20",
};

export const STATUS_LABELS: Record<string, string> = {
  sent: "مرسلة",
  scheduled: "مجدولة",
  "in-progress": "جارية",
  draft: "مسودة",
  paused: "متوقفة",
  cancelled: "ملغاة",
  delivered: "تم التوصيل",
  failed: "فشل",
  pending: "قيد الإرسال",
};

export const CATEGORY_LABELS: Record<string, string> = {
  promotional: "ترويجي",
  transactional: "معاملات",
  reminder: "تذكير",
  notification: "إشعار",
  "follow-up": "متابعة",
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? "bg-gray-500/10 text-gray-700 border-gray-500/20";
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-gray-500/10 text-gray-700 border-gray-500/20";
}

export const TEMPLATE_CATEGORIES = [
  { value: "promotional", label: "ترويجي" },
  { value: "transactional", label: "معاملات" },
  { value: "reminder", label: "تذكير" },
  { value: "notification", label: "إشعار" },
  { value: "follow-up", label: "متابعة" },
] as const;

/** ترجمة رسائل أخطاء الباك اند (إنجليزي → عربي) للعرض في الـ toast */
export const SMS_ERROR_MESSAGES_AR: Record<string, string> = {
  "Only draft or scheduled campaigns can be updated.":
    "يمكن تعديل الحملات ذات الحالة مسودة أو مجدولة فقط.",
  "Only draft, scheduled or paused campaigns can be updated.":
    "يمكن تعديل الحملات ذات الحالة مسودة أو مجدولة أو متوقفة فقط.",
  "Only draft or scheduled campaigns can be deleted.":
    "يمكن حذف الحملات ذات الحالة مسودة أو مجدولة فقط.",
  "Only draft or scheduled campaigns can be sent.":
    "يمكن إرسال الحملات ذات الحالة مسودة أو مجدولة فقط.",
  "Only in-progress or scheduled campaigns can be paused.":
    "يمكن إيقاف الحملات المؤقت فقط عندما تكون جارية أو مجدولة.",
  "Campaign not found.": "الحملة غير موجودة.",
  "Template not found.": "القالب غير موجود.",
  "Insufficient credits.": "رصيد الكريديت غير كافٍ.",
  "Validation failed.": "فشل التحقق من البيانات.",
  "Idempotency-Key header is required.": "مفتاح منع التكرار مطلوب.",
  "No recipients to restart. Provide customer_ids or manual_phones, or ensure campaign was sent with recipients.":
    "لا يوجد مستلمون لإعادة الإرسال. حدّد عملاء أو أرقام هواتف، أو تأكد أن الحملة أُرسلت سابقاً بمستلمين.",
};

/** API error codes → Arabic message (when backend returns code) */
export const SMS_ERROR_CODES_AR: Record<string, string> = {
  CAMPAIGN_NOT_FOUND: "الحملة غير موجودة.",
  VALIDATION_FAILED: "فشل التحقق من البيانات.",
  INSUFFICIENT_CREDITS: "رصيد الكريديت غير كافٍ. يرجى شحن الرصيد.",
};

/** User-facing copy for campaign flows (single source for UI text) */
export const SMS_USER_MESSAGES = {
  beforeSend:
    "يُحجَز الكريديت لجميع المستلمين. تُحتسب عليك فقط كل رسالة تُرسَل فعلياً. الكريديت غير المستخدم يُعاد عند الإيقاف المؤقت أو فشل الإرسال.",
  afterSendReserved: (count: number) =>
    `بدأت الحملة. تم حجز ${count} كريديت. ستُحتسب عليك فقط الرسائل التي تُرسَل.`,
  inProgressSummary: (sent: number, total: number, used: number, reserved: number) =>
    `جاري الإرسال: ${sent} من ${total} أُرسلت. ${used} كريديت مستخدم حتى الآن؛ ${reserved} محجوز للمتبقين.`,
  afterPause: (sent: number, released: number, balance: number) =>
    `تم إيقاف الحملة مؤقتاً. ${sent} رسائل أُرسلت (${sent} كريديت مستخدم). تم إرجاع ${released} كريديت إلى رصيدك. الرصيد الحالي: ${balance}.`,
  afterResumeContinue: (count: number) =>
    `تم الاستئناف. جاري الإرسال للمتبقين (${count} مستلم). تم حجز ${count} كريديت.`,
  afterResumeRestart: (count: number) =>
    `تمت إعادة التشغيل من البداية. جاري الإرسال لجميع ${count} مستلمين. تم حجز ${count} كريديت.`,
  insufficientCredits: (required: number, available: number) =>
    `رصيد غير كافٍ. تحتاج ${required} لحجز هذه الحملة؛ رصيدك ${available}. يرجى شحن الرصيد.`,
} as const;

/** إرجاع الرسالة بالعربي إن وُجدت، وإلا الرسالة الأصلية */
export function getSmsErrorAr(message: string): string {
  const trimmed = message?.trim() ?? "";
  return SMS_ERROR_MESSAGES_AR[trimmed] ?? trimmed;
}

/** Backend note (resume): "X credits reserved to send to remaining Y recipients." → Arabic */
const CREDITS_RESERVED_REMAINING_REGEX =
  /^(\d+)\s+credits?\s+reserved\s+to\s+send\s+to\s+remaining\s+(\d+)\s+recipients?\.?$/i;

/** Backend note (pause): "Campaign paused. X reserved credits returned to your balance." → Arabic */
const CAMPAIGN_PAUSED_CREDITS_RETURNED_REGEX =
  /^Campaign paused\.\s*(\d+)\s+reserved credits? returned to your balance\.?$/i;

/**
 * Translates backend credit_info.note (English) to Arabic for toast display.
 * Returns the translated string, or the original note if no pattern matches.
 */
export function getSmsCreditNoteAr(note: string | undefined): string | undefined {
  if (!note?.trim()) return undefined;
  const trimmed = note.trim();
  const pausedMatch = trimmed.match(CAMPAIGN_PAUSED_CREDITS_RETURNED_REGEX);
  if (pausedMatch) {
    const credits = pausedMatch[1];
    return `تم إيقاف الحملة مؤقتاً. تم إرجاع ${credits} كريديت محجوزة إلى رصيدك.`;
  }
  const resumeMatch = trimmed.match(CREDITS_RESERVED_REMAINING_REGEX);
  if (resumeMatch) {
    const credits = resumeMatch[1];
    const recipients = resumeMatch[2];
    return `تم حجز ${credits} كريديت لإرسالها للمتبقين (${recipients} مستلمين).`;
  }
  return trimmed;
}
