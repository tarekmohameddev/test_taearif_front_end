"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target } from "lucide-react";
import type { PipelineAnalytics } from "@/lib/services/customers-hub-pipeline-api";

interface StageAnalyticsProps {
  analytics?: PipelineAnalytics | null;
}

export function StageAnalytics(props?: StageAnalyticsProps) {
  // Use prop analytics only - NO FALLBACK
  const analytics = props?.analytics;
  
  // Get conversion rate from analytics only - NO FALLBACK
  const conversionRate = analytics?.conversionRate ?? 0;

  // Get average days in pipeline from analytics only - NO FALLBACK
  const avgDaysInPipeline = analytics?.avgDaysInPipeline ?? 0;

  // Get bottlenecks from analytics - NO FALLBACK, only use API data
  const bottleneckStages: any[] = analytics?.bottlenecks && analytics.bottlenecks.length > 0
    ? analytics.bottlenecks
    : [];
  
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
