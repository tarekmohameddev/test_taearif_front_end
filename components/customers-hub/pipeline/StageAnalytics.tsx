"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { LIFECYCLE_STAGES } from "@/types/unified-customer";
import { TrendingUp, Clock, Target } from "lucide-react";

export function StageAnalytics() {
  const { customers, statistics } = useUnifiedCustomersStore();

  // Calculate bottlenecks (stages with more than average customers)
  const avgCustomersPerStage = statistics ? statistics.total / LIFECYCLE_STAGES.length : 0;
  const bottleneckStages = LIFECYCLE_STAGES.filter((stage) => {
    const count = statistics?.byStage[stage.id] || 0;
    return count > avgCustomersPerStage * 1.5;
  });

  // Calculate conversion rate between key stages
  const qualifiedCount = statistics?.byStage["qualified"] || 0;
  const closingCount = statistics?.byStage["closing"] || 0;
  const conversionRate =
    qualifiedCount > 0 ? Math.round((closingCount / qualifiedCount) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">معدل التحويل</div>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <div className="text-xs text-gray-500">من المؤهلين إلى الإغلاق</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">متوسط الوقت</div>
              <div className="text-2xl font-bold">
                {statistics?.avgDaysInPipeline || 0} يوم
              </div>
              <div className="text-xs text-gray-500">من البداية للإغلاق</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">اختناقات المسار</div>
              <div className="text-2xl font-bold">{bottleneckStages.length}</div>
              <div className="text-xs text-gray-500">
                {bottleneckStages.length > 0
                  ? bottleneckStages.map((s) => s.nameAr).join(", ")
                  : "لا يوجد"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
