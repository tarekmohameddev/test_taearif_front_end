"use client";

import { Badge } from "@/components/ui/badge";
import { getStatusLabel, getStatusVariant } from "../utils";

const VARIANT_CLASS: Record<string, string> = {
  success: "bg-green-100 text-green-800",
  destructive: "bg-red-100 text-red-800",
  secondary: "",
};

interface StatusBadgeProps {
  status: number;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const variant = getStatusVariant(status);
  const className = VARIANT_CLASS[variant];

  if (variant === "secondary") {
    return <Badge variant="secondary">{label}</Badge>;
  }
  return <Badge className={className}>{label}</Badge>;
}
