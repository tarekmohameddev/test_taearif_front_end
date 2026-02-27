"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { StageDistribution } from "@/lib/services/customers-hub-requests-api";

export interface StageDistributionCardProps {
  apiStages?: StageDistribution[] | null;
  apiLoading?: boolean;
}

export function StageDistributionCard({
  apiStages,
  apiLoading,
}: StageDistributionCardProps) {
  return (
    <Card className="md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>توزيع طلبات العملاء حسب المرحلة</CardTitle>
      </CardHeader>
      <CardContent>
        {apiLoading ? (
          <div className="text-center py-8 text-gray-500">
            جاري تحميل البيانات...
          </div>
        ) : (() => {
          const hasStages =
            apiStages && Array.isArray(apiStages) && apiStages.length > 0;
          if (!hasStages) {
            return (
              <div className="text-center py-8 text-gray-500">
                لا توجد مراحل متاحة من الباك إند
              </div>
            );
          }
          const sortedStages = [...apiStages!].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );
          return (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
              {sortedStages.map((stage) => {
                const count = stage.requestCount || 0;
                const percentage = stage.percentage || 0;
                return (
                  <div
                    key={stage.stage_id}
                    className="flex flex-col gap-2 p-3 border rounded-lg hover:shadow-md transition-shadow"
                    style={{ borderColor: stage.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="text-xs font-medium"
                        style={{ color: stage.color }}
                      >
                        {stage.stage_name_ar}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-1"
                      style={
                        {
                          "--progress-background": stage.color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% من إجمالي الطلبات
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
