"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, DollarSign, 
  Clock, Target, AlertCircle,
  ArrowUp, ArrowDown, Minus
} from "lucide-react";
import type { TimeRange } from "@/lib/services/customers-hub-analytics-api";
import type { TrendDataPoint, SourceAnalytics, EmployeePerformance } from "@/lib/services/customers-hub-analytics-api";

interface AnalyticsDashboardProps {
  metrics?: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    totalInquiries: number;
    completedTasks: number;
    totalAppointments: number;
    conversionRate: string;
    avgResponseTime: string;
    avgDaysToClose: number;
  } | null;
  trends?: TrendDataPoint[] | null;
  sources?: SourceAnalytics[] | null;
  performance?: EmployeePerformance[] | null;
  timeRange?: TimeRange | { start?: string; end?: string };
  loading?: boolean;
  error?: string | null;
  onTimeRangeChange?: (range: TimeRange) => void;
  onFetchAllAnalytics?: (range: TimeRange) => Promise<void>;
}

export function AnalyticsDashboard(props?: AnalyticsDashboardProps) {
  // Use only API data from props - no store usage
  const apiMetrics = props?.metrics;
  const apiTrends = props?.trends;
  const apiSources = props?.sources;
  const apiPerformance = props?.performance;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;
  
  // Calculate analytics from API data only
  const conversionRate = apiMetrics 
    ? parseFloat(apiMetrics.conversionRate.replace('%', '')) || 0
    : 0;
  const avgDaysInPipeline = apiMetrics?.avgDaysToClose || 0;

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (value < threshold) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  // Show loading state
  if (apiLoading && !apiMetrics) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="text-gray-600 dark:text-gray-400">جاري تحميل التحليلات...</p>
      </div>
    );
  }

  // Show error state
  if (apiError && !apiMetrics) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{apiError}</p>
            <button 
              onClick={() => props?.onFetchAllAnalytics?.({ timeRange: "last30days" })}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              إعادة المحاولة
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">إجمالي العملاء</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">{apiMetrics?.totalCustomers ?? 0}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              {getTrendIcon(apiMetrics?.newCustomers || 0)}
              <span>+{apiMetrics?.newCustomers || 0} هذا الشهر</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">معدل التحويل</span>
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">{conversionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              <span>{apiMetrics?.totalAppointments || 0} مواعيد</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">قيمة الصفقات</span>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold">
              {apiMetrics?.totalInquiries || 0}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              استفسارات
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">متوسط دورة البيع</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold">{avgDaysInPipeline}</div>
            <div className="text-xs text-gray-600 mt-1">يوم</div>
          </CardContent>
        </Card>
      </div>

      {/* Sources Analytics */}
      {apiSources && apiSources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">التحليلات حسب المصدر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-semibold">{source.source}</div>
                    <div className="text-sm text-gray-600">
                      {source.count} عميل ({source.percentage})
                    </div>
                  </div>
                  <Badge variant="outline">{source.conversionRate} تحويل</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Analytics */}
      {apiPerformance && apiPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أداء الموظفين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiPerformance.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-semibold">{employee.name}</div>
                    <div className="text-sm text-gray-600">
                      {employee.customersManaged} عميل • {employee.tasksCompleted} مهمة مكتملة
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{employee.conversionRate}</div>
                    <div className="text-xs text-gray-600">معدل التحويل</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
