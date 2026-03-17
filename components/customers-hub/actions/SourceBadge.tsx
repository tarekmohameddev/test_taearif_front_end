"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Globe,
  UserPlus,
  Upload,
  Users,
  Home,
  FileEdit,
  LayoutDashboard,
} from "lucide-react";
import type { CustomerSource } from "@/types/unified-customer";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: CustomerSource | string | undefined | null;
  className?: string;
}

const sourceConfig = {
  employee_dashboard: {
    label: "من لوحة التحكم",
    labelEn: "Employee dashboard",
    icon: LayoutDashboard,
    color:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300",
  },
  whatsapp: {
    label: "واتساب",
    labelEn: "WhatsApp",
    icon: MessageSquare,
    color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  },
  inquiry: {
    label: "استفسار عام",
    labelEn: "General inquiry",
    icon: Globe,
    color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  manual: {
    label: "إدخال يدوي",
    labelEn: "Manual",
    icon: UserPlus,
    color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  },
  import: {
    label: "استيراد",
    labelEn: "Import",
    icon: Upload,
    color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
  },
  referral: {
    label: "إحالة",
    labelEn: "Referral",
    icon: Users,
    color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  },
  property_interest: {
    label: "من صفحة العقار",
    labelEn: "Property page",
    icon: Home,
    color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  public_form: {
    label: "من صفحة اطلب عقارك",
    labelEn: "Request property form",
    icon: FileEdit,
    color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  website: {
    label: "من الموقع",
    labelEn: "Website",
    icon: Globe,
    color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
} as const;

// Default fallback config for unknown sources
const defaultConfig = {
  label: "غير محدد",
  labelEn: "Unknown",
  icon: Globe,
  color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  // Safely get config with fallback
  // Handle case where source might be an object (from API)
  let sourceString: string | undefined;
  if (typeof source === 'object' && source !== null) {
    // Extract string value from object (id, name, or fallback to string conversion)
    sourceString = (source as any).id || (source as any).name || String(source);
  } else {
    sourceString = source || undefined;
  }

  if (!sourceString) {
    const Icon = defaultConfig.icon;
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1.5 font-medium",
          defaultConfig.color,
          className
        )}
      >
        <Icon className="h-3 w-3" />
        {defaultConfig.label}
      </Badge>
    );
  }

  const config = sourceConfig[sourceString as keyof typeof sourceConfig] || defaultConfig;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
