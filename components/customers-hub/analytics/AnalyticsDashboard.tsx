"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { 
  Users, TrendingUp, DollarSign, Calendar, 
  Clock, Target, AlertCircle,
  ArrowUp, ArrowDown, Minus, Building,
  Phone, MessageSquare, Mail, CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LIFECYCLE_STAGES } from "@/types/unified-customer";
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
  const store = useUnifiedCustomersStore();
  const { customers: storeCustomers, statistics: storeStatistics } = store;
  
  // Use prop metrics if provided, otherwise use store data
  const apiMetrics = props?.metrics;
  const apiTrends = props?.trends;
  const apiSources = props?.sources;
  const apiPerformance = props?.performance;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;
  
  // Use API metrics if available, otherwise calculate from store
  const customers = storeCustomers; // Keep using store customers for now
  const statistics = apiMetrics 
    ? {
        total: apiMetrics.totalCustomers,
        newThisMonth: apiMetrics.newCustomers,
        conversionRate: parseFloat(apiMetrics.conversionRate.replace('%', '')) || 0,
        avgDaysInPipeline: apiMetrics.avgDaysToClose,
        totalDealValue: 0, // Not provided in API metrics
        closedThisMonth: 0, // Not provided in API metrics
        byStage: {} as Record<string, number>,
      }
    : storeStatistics;

  // Calculate advanced analytics - use API data if available
  const analytics = {
    // Conversion metrics
    conversionRate: apiMetrics 
      ? parseFloat(apiMetrics.conversionRate.replace('%', '')) || 0
      : statistics?.conversionRate || 0,
    avgDaysInPipeline: apiMetrics?.avgDaysToClose || statistics?.avgDaysInPipeline || 0,
    closingRatio: customers.filter(c => c.stage === "closing").length / Math.max(customers.length, 1) * 100,
    
    // Timeline distribution
    urgentClients: customers.filter(c => c.preferences.timeline === "immediate").length,
    shortTermClients: customers.filter(c => c.preferences.timeline === "1-3months").length,
    mediumTermClients: customers.filter(c => c.preferences.timeline === "3-6months").length,
    longTermClients: customers.filter(c => c.preferences.timeline === "6months+").length,
    
    // Budget distribution
    highBudget: customers.filter(c => (c.preferences.budgetMax || 0) >= 1000000).length,
    mediumBudget: customers.filter(c => (c.preferences.budgetMax || 0) >= 500000 && (c.preferences.budgetMax || 0) < 1000000).length,
    lowBudget: customers.filter(c => (c.preferences.budgetMax || 0) < 500000 && (c.preferences.budgetMax || 0) > 0).length,
    
    // Activity metrics
    activeThisWeek: customers.filter(c => {
      if (!c.lastContactAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.lastContactAt) >= weekAgo;
    }).length,
    
    needsFollowUp: customers.filter(c => {
      if (!c.lastContactAt) return true;
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return new Date(c.lastContactAt) < threeDaysAgo && c.stage !== "closing" && c.stage !== "post_sale";
    }).length,
    
    // Communication stats
    avgInteractionsPerCustomer: customers.length > 0
      ? customers.reduce((sum, c) => sum + (c.totalInteractions || 0), 0) / customers.length
      : 0,
    
    avgResponseRate: customers.length > 0
      ? customers.reduce((sum, c) => sum + (c.responseRate || 0), 0) / customers.length
      : 0,
  };

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
            <div className="text-3xl font-bold">{apiMetrics?.totalCustomers ?? customers.length}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              {getTrendIcon(apiMetrics?.newCustomers ?? statistics?.newThisMonth || 0)}
              <span>+{apiMetrics?.newCustomers ?? statistics?.newThisMonth || 0} هذا الشهر</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">معدل التحويل</span>
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              <CheckCircle className="h-3 w-3" />
              <span>{apiMetrics?.totalAppointments ?? statistics?.closedThisMonth || 0} مواعيد/صفقات</span>
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
              {apiMetrics?.totalInquiries 
                ? ((apiMetrics.totalInquiries * 100000) / 1000000).toFixed(1) + "M"
                : ((statistics?.totalDealValue || 0) / 1000000).toFixed(1) + "M"}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {apiMetrics?.totalInquiries ? "استفسارات" : "ريال سعودي"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">متوسط دورة البيع</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold">{analytics.avgDaysInPipeline}</div>
            <div className="text-xs text-gray-600 mt-1">يوم</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Timeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              توزيع الجدول الزمني
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">🚨 فوري</span>
              <Badge variant="destructive">{analytics.urgentClients}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">🔥 1-3 شهور</span>
              <Badge variant="default">{analytics.shortTermClients}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">⭐ 3-6 شهور</span>
              <Badge variant="secondary">{analytics.mediumTermClients}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">📌 6+ شهور</span>
              <Badge variant="outline">{analytics.longTermClients}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              توزيع الميزانيات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">💎 +1M ريال</span>
              <Badge className="bg-green-600">{analytics.highBudget}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">💰 500K-1M ريال</span>
              <Badge className="bg-blue-600">{analytics.mediumBudget}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">💵 &lt;500K ريال</span>
              <Badge variant="secondary">{analytics.lowBudget}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Engagement */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">نشط هذا الأسبوع</span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">{analytics.activeThisWeek}</div>
            <div className="text-xs text-gray-600 mt-1">
              {((analytics.activeThisWeek / Math.max(customers.length, 1)) * 100).toFixed(1)}% من الإجمالي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">يحتاج متابعة</span>
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{analytics.needsFollowUp}</div>
            <div className="text-xs text-gray-600 mt-1">
              لم يتم التواصل معهم منذ 3+ أيام
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">متوسط التفاعلات</span>
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">
              {analytics.avgInteractionsPerCustomer.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600 mt-1">لكل عميل</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            صحة المسار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
            {LIFECYCLE_STAGES.map((stage) => {
              const count = customers.filter(c => c.stage === stage.id).length;
              const percentage = (count / Math.max(customers.length, 1)) * 100;
              
              return (
                <div 
                  key={stage.id}
                  className="text-center p-3 rounded-lg border hover:shadow-md transition-shadow"
                  style={{ backgroundColor: stage.color + "15", borderColor: stage.color + "40" }}
                >
                  <div className="text-2xl font-bold" style={{ color: stage.color }}>
                    {count}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {stage.nameAr}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Communication Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-600" />
            إحصائيات التواصل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {customers.reduce((sum, c) => sum + c.interactions.filter(i => i.type === "whatsapp").length, 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">واتساب</div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {customers.reduce((sum, c) => sum + c.interactions.filter(i => i.type === "call").length, 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">مكالمات</div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {customers.reduce((sum, c) => sum + c.interactions.filter(i => i.type === "email").length, 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">بريد</div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analytics.avgResponseRate.toFixed(0)}%</div>
              <div className="text-xs text-gray-600 mt-1">معدل الرد</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
