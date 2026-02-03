"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Progress } from "@/components/ui/progress";
import { LIFECYCLE_STAGES, getStageNameAr } from "@/types/unified-customer";
import type { UnifiedCustomer, CustomerLifecycleStage } from "@/types/unified-customer";
import { TrendingUp, Users, DollarSign, Clock, ArrowUpRight } from "lucide-react";

interface InteractiveChartsProps {
  customers: UnifiedCustomer[];
}

export function InteractiveCharts({ customers }: InteractiveChartsProps) {
  const [selectedStage, setSelectedStage] = useState<CustomerLifecycleStage | null>(null);
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Calculate stage metrics
  const stageMetrics = LIFECYCLE_STAGES.map((stage) => {
    const stageCustomers = customers.filter((c) => c.stage === stage.id);
    const totalValue = stageCustomers.reduce((sum, c) => sum + (c.totalDealValue || 0), 0);
    const avgDays = stageCustomers.length > 0
      ? stageCustomers.reduce((sum, c) => {
          const days = Math.floor(
            (Date.now() - new Date(c.stageHistory[c.stageHistory.length - 1]?.changedAt || c.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / stageCustomers.length
      : 0;

    return {
      stage,
      count: stageCustomers.length,
      percentage: customers.length > 0 ? (stageCustomers.length / customers.length) * 100 : 0,
      totalValue,
      avgDays: Math.round(avgDays),
      customers: stageCustomers,
    };
  });

  // Handle stage click
  const handleStageClick = (stageId: CustomerLifecycleStage) => {
    setSelectedStage(stageId);
    setShowDrillDown(true);
  };

  const selectedMetrics = stageMetrics.find((m) => m.stage.id === selectedStage);

  return (
    <>
      <div className="space-y-6">
        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              مسار التحويل التفاعلي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stageMetrics.map((metric, index) => {
                const maxCount = Math.max(...stageMetrics.map((m) => m.count));
                const width = metric.count > 0 ? (metric.count / maxCount) * 100 : 5;

                return (
                  <div
                    key={metric.stage.id}
                    className="relative group cursor-pointer"
                    onClick={() => handleStageClick(metric.stage.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Stage Label */}
                      <div className="w-32 text-sm font-medium">
                        {metric.stage.nameAr}
                      </div>

                      {/* Funnel Bar */}
                      <div className="flex-1 relative h-12">
                        <div
                          className="absolute inset-y-0 right-0 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                          style={{
                            width: `${width}%`,
                            backgroundColor: metric.stage.color,
                            opacity: 0.8,
                          }}
                        >
                          <div className="flex items-center justify-between h-full px-4 text-white">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold">{metric.count}</span>
                              <span className="text-xs opacity-90">
                                ({metric.percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="text-xs opacity-90">
                              {(metric.totalValue / 1000000).toFixed(1)}م ريال
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Indicator */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Quick Stats on Hover */}
                    <div className="absolute left-0 right-0 top-full mt-1 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-gray-500 mb-1">متوسط المدة</div>
                          <div className="font-semibold">{metric.avgDays} يوم</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">قيمة الصفقات</div>
                          <div className="font-semibold">
                            {(metric.totalValue / 1000000).toFixed(1)}م
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">عدد العملاء</div>
                          <div className="font-semibold">{metric.count}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              💡 انقر على أي مرحلة لعرض التفاصيل والعملاء
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>معدلات التحويل بين المراحل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stageMetrics.slice(0, -1).map((metric, index) => {
                const nextMetric = stageMetrics[index + 1];
                const conversionRate = metric.count > 0
                  ? (nextMetric.count / metric.count) * 100
                  : 0;
                const avgTime = metric.avgDays;

                return (
                  <div key={metric.stage.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm">
                        <span style={{ color: metric.stage.color }} className="font-medium">
                          {metric.stage.nameAr}
                        </span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span style={{ color: nextMetric.stage.color }} className="font-medium">
                          {nextMetric.stage.nameAr}
                        </span>
                      </div>
                      <Badge variant={conversionRate >= 50 ? "default" : "secondary"}>
                        {conversionRate.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={conversionRate} className="h-2" />
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>
                        {metric.count} → {nextMetric.count} عميل
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        متوسط {avgTime} يوم
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              توزيع الميزانيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "أقل من 500 ألف", min: 0, max: 500000, color: "#3b82f6" },
                { label: "500 ألف - 1 مليون", min: 500000, max: 1000000, color: "#8b5cf6" },
                { label: "1 - 2 مليون", min: 1000000, max: 2000000, color: "#f59e0b" },
                { label: "2 - 5 مليون", min: 2000000, max: 5000000, color: "#10b981" },
                { label: "أكثر من 5 مليون", min: 5000000, max: Infinity, color: "#ef4444" },
              ].map((range) => {
                const count = customers.filter(
                  (c) =>
                    (c.preferences.budgetMax || 0) >= range.min &&
                    (c.preferences.budgetMax || 0) < range.max
                ).length;
                const percentage = customers.length > 0 ? (count / customers.length) * 100 : 0;

                return (
                  <div key={range.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{range.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{count}</Badge>
                        <span className="text-xs text-gray-500">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2"
                      style={
                        {
                          "--progress-background": range.color,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drill-Down Dialog */}
      <CustomDialog open={showDrillDown} onOpenChange={setShowDrillDown} maxWidth="max-w-4xl">
        <CustomDialogContent className="dir-rtl">
          <CustomDialogClose onClose={() => setShowDrillDown(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle className="flex items-center gap-2">
              {selectedMetrics && (
                <>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedMetrics.stage.color }}
                  />
                  {selectedMetrics.stage.nameAr}
                </>
              )}
            </CustomDialogTitle>
            <CustomDialogDescription>
              {selectedMetrics?.count} عميل في هذه المرحلة
            </CustomDialogDescription>
          </CustomDialogHeader>

          {selectedMetrics && (
            <div className="space-y-6 py-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Users className="h-4 w-4" />
                      العملاء
                    </div>
                    <div className="text-2xl font-bold">{selectedMetrics.count}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      القيمة الإجمالية
                    </div>
                    <div className="text-2xl font-bold">
                      {(selectedMetrics.totalValue / 1000000).toFixed(1)}م
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Clock className="h-4 w-4" />
                      متوسط المدة
                    </div>
                    <div className="text-2xl font-bold">{selectedMetrics.avgDays} يوم</div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer List */}
              <div>
                <h4 className="font-semibold mb-3">العملاء في هذه المرحلة</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedMetrics.customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        window.location.href = `/ar/dashboard/customers-hub/${customer.id}`;
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: selectedMetrics.stage.color }}
                        >
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {(customer.totalDealValue || 0).toLocaleString()} ريال
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CustomDialogContent>
      </CustomDialog>
    </>
  );
}
