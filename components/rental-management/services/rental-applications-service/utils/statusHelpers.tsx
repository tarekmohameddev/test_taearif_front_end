"use client";

import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { getSafeValue } from "./helpers";

export const getStatusIcon = (status: string | null | undefined) => {
  const safeStatus = getSafeValue(status, "unknown");
  switch (safeStatus) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "expired":
      return <XCircle className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    case "draft":
      return <FileText className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const getStatusText = (status: string | null | undefined) => {
  const safeStatus = getSafeValue(status, "unknown");
  switch (safeStatus) {
    case "active":
      return "نشط";
    case "pending":
      return "قيد الانتظار";
    case "expired":
      return "منتهي الصلاحية";
    case "cancelled":
      return "ملغي";
    case "draft":
      return "مسودة";
    default:
      return "غير محدد";
  }
};

export const getAvailableStatusOptions = (currentStatus: string) => {
  switch (currentStatus) {
    case "draft":
      return [
        { value: "active", label: "نشط" },
        { value: "cancelled", label: "ملغي" },
      ];
    case "active":
      return [
        { value: "ended", label: "منتهي" },
        { value: "cancelled", label: "ملغي" },
      ];
    case "ended":
    case "cancelled":
      return [];
    default:
      return [];
  }
};
