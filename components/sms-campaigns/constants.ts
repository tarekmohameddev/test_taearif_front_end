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
