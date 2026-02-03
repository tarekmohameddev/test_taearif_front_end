"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { Phone, MessageSquare, Mail, MapPin, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomerTimelineProps {
  customer: UnifiedCustomer;
}

export function CustomerTimeline({ customer }: CustomerTimelineProps) {
  // Combine all activities
  const allActivities = [
    ...customer.interactions.map((i) => ({ ...i, type: "interaction" as const })),
    ...customer.stageHistory.map((s) => ({ ...s, type: "stage_change" as const })),
    ...customer.appointments.map((a) => ({ ...a, type: "appointment" as const })),
  ].sort((a, b) => {
    const dateA = new Date(
      a.type === "interaction"
        ? a.date
        : a.type === "stage_change"
        ? a.changedAt
        : a.datetime || a.date
    ).getTime();
    const dateB = new Date(
      b.type === "interaction"
        ? b.date
        : b.type === "stage_change"
        ? b.changedAt
        : b.datetime || b.date
    ).getTime();
    return dateB - dateA;
  });

  const getIconForActivity = (activity: any) => {
    if (activity.type === "interaction") {
      switch (activity.type) {
        case "call":
          return <Phone className="h-4 w-4" />;
        case "whatsapp":
          return <MessageSquare className="h-4 w-4" />;
        case "email":
          return <Mail className="h-4 w-4" />;
        case "site_visit":
          return <MapPin className="h-4 w-4" />;
        default:
          return <FileText className="h-4 w-4" />;
      }
    } else if (activity.type === "stage_change") {
      return <TrendingRight className="h-4 w-4" />;
    } else {
      return <Calendar className="h-4 w-4" />;
    }
  };

  const getColorForActivity = (activity: any) => {
    if (activity.type === "interaction") {
      if (activity.sentiment === "positive") return "text-green-600 bg-green-50";
      if (activity.sentiment === "negative") return "text-red-600 bg-red-50";
      return "text-blue-600 bg-blue-50";
    } else if (activity.type === "stage_change") {
      return "text-purple-600 bg-purple-50";
    } else {
      return "text-orange-600 bg-orange-50";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">الجدول الزمني - 360 درجة</h3>
      <div className="space-y-4">
        {allActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا توجد أنشطة بعد
          </div>
        ) : (
          allActivities.map((activity, index) => {
            const date = new Date(
              activity.type === "interaction"
                ? activity.date
                : activity.type === "stage_change"
                ? activity.changedAt
                : activity.datetime || activity.date
            );

            return (
              <div key={index} className="flex gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${getColorForActivity(activity)}`}>
                  {getIconForActivity(activity)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-sm">
                      {activity.type === "interaction" && (
                        <>
                          {activity.type === "call" && "مكالمة هاتفية"}
                          {activity.type === "whatsapp" && "رسالة واتساب"}
                          {activity.type === "email" && "بريد إلكتروني"}
                          {activity.type === "site_visit" && "زيارة موقع"}
                          {activity.type === "meeting" && "اجتماع"}
                          {activity.type === "note" && "ملاحظة"}
                        </>
                      )}
                      {activity.type === "stage_change" && "تغيير المرحلة"}
                      {activity.type === "appointment" && activity.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {date.toLocaleDateString("ar-SA", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {activity.type === "interaction" && (
                    <div className="text-sm text-gray-600">{activity.notes}</div>
                  )}
                  
                  {activity.type === "stage_change" && (
                    <div className="text-sm">
                      <Badge variant="outline" className="text-xs">
                        {activity.fromStage || "بداية"}
                      </Badge>
                      <span className="mx-2">←</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.toStage}
                      </Badge>
                      {activity.notes && (
                        <div className="mt-1 text-gray-600">{activity.notes}</div>
                      )}
                    </div>
                  )}

                  {activity.type === "appointment" && (
                    <div className="text-sm text-gray-600">
                      {activity.notes || "موعد مجدول"}
                    </div>
                  )}

                  {/* Agent */}
                  {(activity.type === "interaction" || activity.type === "stage_change") && (
                    <div className="text-xs text-gray-500 mt-1">
                      بواسطة:{" "}
                      {activity.type === "interaction"
                        ? activity.agentName
                        : activity.changedBy}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

function TrendingRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}
