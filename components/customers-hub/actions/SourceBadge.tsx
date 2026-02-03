"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Globe, UserPlus, Upload, Users } from "lucide-react";
import type { CustomerSource } from "@/types/unified-customer";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: CustomerSource;
  className?: string;
}

const sourceConfig = {
  whatsapp: {
    label: "واتساب",
    labelEn: "WhatsApp",
    icon: MessageSquare,
    color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  },
  inquiry: {
    label: "موقع إلكتروني",
    labelEn: "Website",
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
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const config = sourceConfig[source];
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
