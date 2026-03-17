"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SourceBadge } from "../../actions/SourceBadge";
import { priorityConfig, statusConfig, requestDetailActionTypeLabels } from "../constants";
import type { CustomerAction } from "@/types/unified-customer";

/** Status option from GET /v1/property-requests/filters (used for badge label when status_id is set). */
export type StatusOptionForBadge = { id: number; name_ar: string; name_en?: string };

/** Priority option from GET /v1/property-requests/filters (used for badge label/color when priority_id is set). */
export type PriorityOptionForBadge = { id: number; name: string; value?: number; icon?: string; color?: string };

interface RequestDetailHeaderProps {
  action: CustomerAction;
  isOverdue: boolean;
  onStatusClick?: () => void;
  onPriorityClick?: () => void;
  /** When set (e.g. from useStatusDialog), badge label uses name_ar from the option matching action.status_id. */
  propertyRequestStatusOptions?: StatusOptionForBadge[];
  /** When set (e.g. from usePriorityDialog), badge label and color use the option matching action.priority_id. */
  propertyRequestPriorityOptions?: PriorityOptionForBadge[];
}

export function RequestDetailHeader({
  action,
  isOverdue,
  onStatusClick,
  onPriorityClick,
  propertyRequestStatusOptions,
  propertyRequestPriorityOptions,
}: RequestDetailHeaderProps) {
  const priorityId = action.priority_id;
  const apiPriority = propertyRequestPriorityOptions?.length && priorityId != null
    ? propertyRequestPriorityOptions.find((p) => p.id === priorityId)
    : undefined;
  const priorityStyle: {
    label: string;
    color: string;
    style?: React.CSSProperties;
  } = apiPriority
    ? {
        label: apiPriority.name,
        color: apiPriority.color ? "" : "bg-blue-500 text-white",
        style: apiPriority.color
          ? { backgroundColor: apiPriority.color, color: "#fff" }
          : undefined,
      }
    : { ...(priorityConfig[action.priority] ?? priorityConfig.medium), style: undefined };
  const statusId = action.status_id;
  const apiStatus = propertyRequestStatusOptions?.length && statusId != null
    ? propertyRequestStatusOptions.find((s) => s.id === statusId)
    : undefined;
  const statusStyle = apiStatus
    ? { label: apiStatus.name_ar, color: "bg-blue-500 text-white" }
    : (statusConfig[action.status] ?? statusConfig.pending);
  const typeLabel = requestDetailActionTypeLabels[action.type] ?? action.type;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/ar/dashboard/customers-hub/requests">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة للطلبات
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            تفاصيل الطلب
          </h1>
          <p className="text-gray-500 text-sm mt-1">{typeLabel}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {onStatusClick ? (
          <button
            type="button"
            onClick={onStatusClick}
            className="focus:outline-none"
          >
            <Badge
              className={cn(
                statusStyle.color,
                "cursor-pointer hover:opacity-90 transition-opacity"
              )}
            >
              {statusStyle.label}
            </Badge>
          </button>
        ) : (
          <Badge className={statusStyle.color}>{statusStyle.label}</Badge>
        )}
        {onPriorityClick ? (
          <button
            type="button"
            onClick={onPriorityClick}
            className="focus:outline-none"
          >
            <Badge
              className={cn(
                priorityStyle.color,
                "cursor-pointer hover:opacity-90 transition-opacity"
              )}
              style={priorityStyle.style}
            >
              {priorityStyle.label}
            </Badge>
          </button>
        ) : (
          <Badge className={priorityStyle.color} style={priorityStyle.style}>
            {priorityStyle.label}
          </Badge>
        )}
        <Badge
          variant="outline"
          className="text-xs font-normal text-gray-700 dark:text-gray-200"
        >
          {new Date(action.createdAt).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Badge>
        {action.dueDate && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400",
              isOverdue && "text-red-600"
            )}
          >
            <Clock className="h-3 w-3" />
            {new Date(action.dueDate).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            {new Date(action.dueDate).toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isOverdue && (
              <Badge variant="destructive" className="mr-1 text-[10px]">
                متأخر
              </Badge>
            )}
          </span>
        )}
        {action.source && <SourceBadge source={action.source} />}
      </div>
    </div>
  );
}
