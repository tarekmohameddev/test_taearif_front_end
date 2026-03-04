"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { priorityConfig, requestDetailActionTypeLabels } from "../constants";
import type { CustomerAction } from "@/types/unified-customer";

interface RequestInfoCardProps {
  action: CustomerAction;
}

export function RequestInfoCard({ action }: RequestInfoCardProps) {
  const typeLabel = requestDetailActionTypeLabels[action.type] ?? action.type;
  const borderColor = (priorityConfig[action.priority] ?? priorityConfig.medium).borderColor;

  return (
    <Card className={cn("border-r-4", borderColor)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          معلومات الطلب
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
          {action.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {action.description}
            </p>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">نوع الطلب</div>
              <div className="font-medium">{typeLabel}</div>
            </div>
          </div>

          {action.assignedToName && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                <UserPlus className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">معين إلى</div>
                <div className="font-medium">{action.assignedToName}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
