"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { LIFECYCLE_STAGES } from "@/types/unified-customer";
import { TrendingUp, Clock, Target } from "lucide-react";
import type { PipelineAnalytics } from "@/lib/services/customers-hub-pipeline-api";

interface StageAnalyticsProps {
  analytics?: PipelineAnalytics | null;
}

export function StageAnalytics(props?: StageAnalyticsProps) {
  const store = useUnifiedCustomersStore();
  const { customers, statistics: storeStatistics } = store;
  
  // Use prop analytics if provided, otherwise use store statistics
  const analytics = props?.analytics;
  
  // Get conversion rate from analytics or fallback to store calculation
  const conversionRate = analytics?.conversionRate !== undefined
    ? analytics.conversionRate
    : (() => {
        // Fallback to calculating from store statistics
        const qualifiedCount = storeStatistics?.byStage["qualified"] || 0;
        const closingCount = storeStatistics?.byStage["closing"] || 0;
        return qualifiedCount > 0 ? Math.round((closingCount / qualifiedCount) * 100) : 0;
      })();

  // Get average days in pipeline from analytics or fallback to store
  const avgDaysInPipeline = analytics?.avgDaysInPipeline !== undefined
    ? analytics.avgDaysInPipeline
    : (storeStatistics?.avgDaysInPipeline || 0);

  // Get bottlenecks from analytics or calculate from store statistics
  let bottleneckStages: any[] = [];
  
  if (analytics?.bottlenecks && analytics.bottlenecks.length > 0) {
    // Use bottlenecks from API
    bottleneckStages = analytics.bottlenecks;
  } else if (storeStatistics) {
    // Calculate bottlenecks from store statistics
    const avgCustomersPerStage = storeStatistics.total / LIFECYCLE_STAGES.length;
    bottleneckStages = LIFECYCLE_STAGES.filter((stage) => {
      const count = storeStatistics.byStage[stage.id] || 0;
      return count > avgCustomersPerStage * 1.5;
    });
  }
  
  // Format bottleneck names for display
  const bottleneckNames = bottleneckStages.length > 0
    ? bottleneckStages.map((s: any) => {
        if (typeof s === 'string') return s;
        if (typeof s === 'object' && s !== null) {
          return s.nameAr || s.name || s.id || String(s);
        }
        return String(s);
      }).join(", ")
    : "لا يوجد";

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
                {avgDaysInPipeline} يوم
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
                {bottleneckNames}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
