"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "./SourceBadge";
import type { CustomerAction } from "@/types/unified-customer";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  RotateCcw,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActionHistoryListProps {
  actions: CustomerAction[];
  onRestore?: (actionId: string) => void;
  className?: string;
}

const statusIcons = {
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  dismissed: <XCircle className="h-4 w-4 text-red-500" />,
  snoozed: <Clock className="h-4 w-4 text-orange-500" />,
};

const statusLabels = {
  completed: "مكتمل",
  dismissed: "مرفوض",
  snoozed: "مؤجل",
};

const statusColors = {
  completed: "border-green-200 bg-green-50/50 dark:bg-green-950/30",
  dismissed: "border-red-200 bg-red-50/50 dark:bg-red-950/30",
  snoozed: "border-orange-200 bg-orange-50/50 dark:bg-orange-950/30",
};

export function ActionHistoryList({
  actions,
  onRestore,
  className,
}: ActionHistoryListProps) {
  // Group actions by date
  const groupedActions = React.useMemo(() => {
    const groups: Record<string, CustomerAction[]> = {};
    
    actions.forEach((action) => {
      const date = action.completedAt 
        ? new Date(action.completedAt).toLocaleDateString("ar-SA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "غير محدد";
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(action);
    });
    
    return groups;
  }, [actions]);

  if (actions.length === 0) {
    return (
      <Card className={cn("py-16", className)}>
        <CardContent className="text-center">
          <History className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">لا يوجد سجل</h3>
          <p className="text-gray-500">لم يتم إكمال أو رفض أي إجراءات بعد</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(groupedActions).map(([date, dateActions]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500">{date}</h3>
            <Badge variant="secondary" className="text-xs">
              {dateActions.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {dateActions.map((action) => (
              <Card
                key={action.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-md border-r-4",
                  statusColors[action.status as keyof typeof statusColors] || "border-gray-200"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5">
                        {statusIcons[action.status as keyof typeof statusIcons]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Link
                            href={`/ar/dashboard/customers-hub/${action.customerId}`}
                            className="font-medium hover:text-blue-600 transition-colors"
                          >
                            {action.customerName}
                          </Link>
                          <SourceBadge source={action.source} className="text-xs" />
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              action.status === "completed" && "border-green-300 text-green-700",
                              action.status === "dismissed" && "border-red-300 text-red-700",
                              action.status === "snoozed" && "border-orange-300 text-orange-700"
                            )}
                          >
                            {statusLabels[action.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {action.title}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {action.completedBy && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>بواسطة: {action.completedBy}</span>
                            </div>
                          )}
                          {action.completedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(action.completedAt).toLocaleTimeString("ar-SA", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {onRestore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 gap-1"
                        onClick={() => onRestore(action.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                        استعادة
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
