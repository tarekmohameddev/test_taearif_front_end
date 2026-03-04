"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type Status = "completed" | "dismissed";

interface CompletedDismissedMessageProps {
  status: Status;
  completedAt?: string | null;
}

const LABELS: Record<Status, string> = {
  completed: "تم إتمام الطلب",
  dismissed: "تم رفض الطلب",
};

export function CompletedDismissedMessage({ status, completedAt }: CompletedDismissedMessageProps) {
  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">{LABELS[status]}</span>
        </div>
        {completedAt && (
          <p className="text-xs text-gray-500 mt-2">
            {new Date(completedAt).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
