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

interface RequestDetailHeaderProps {
  action: CustomerAction;
  isOverdue: boolean;
  onStatusClick?: () => void;
  onPriorityClick?: () => void;
}

export function RequestDetailHeader({
  action,
  isOverdue,
  onStatusClick,
  onPriorityClick,
}: RequestDetailHeaderProps) {
  const priorityStyle = priorityConfig[action.priority] ?? priorityConfig.medium;
  const statusStyle = statusConfig[action.status] ?? statusConfig.pending;
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
            >
              {priorityStyle.label}
            </Badge>
          </button>
        ) : (
          <Badge className={priorityStyle.color}>{priorityStyle.label}</Badge>
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
