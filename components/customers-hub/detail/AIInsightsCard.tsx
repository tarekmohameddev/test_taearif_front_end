"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { Zap, AlertTriangle, TrendingUp, Calendar, Sparkles } from "lucide-react";

interface AIInsightsCardProps {
  customer: UnifiedCustomer;
}

export function AIInsightsCard({ customer }: AIInsightsCardProps) {
  const getChurnRiskBadge = (risk?: string) => {
    if (risk === "high") return <Badge variant="destructive">عالي</Badge>;
    if (risk === "medium") return <Badge variant="default">متوسط</Badge>;
    return <Badge variant="secondary">منخفض</Badge>;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          رؤى ذكية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next Best Action */}
        {customer.aiInsights.nextBestAction && (
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-semibold text-sm mb-1">الإجراء الموصى به:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {customer.aiInsights.nextBestAction}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Churn Risk */}
        {customer.aiInsights.churnRisk && (
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold">خطر الفقدان:</span>
              </div>
              {getChurnRiskBadge(customer.aiInsights.churnRisk)}
            </div>
          </div>
        )}

        {/* Conversion Probability */}
        {customer.aiInsights.conversionProbability !== undefined && (
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold">احتمالية التحويل:</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {customer.aiInsights.conversionProbability}%
              </span>
            </div>
          </div>
        )}

        {/* Predicted Close Date */}
        {customer.aiInsights.predictedCloseDate && (
          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold">تاريخ الإغلاق المتوقع:</span>
              </div>
              <span className="text-sm font-medium">
                {new Date(customer.aiInsights.predictedCloseDate).toLocaleDateString(
                  "ar-SA",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </span>
            </div>
          </div>
        )}

        {/* Property Matches */}
        {customer.aiInsights.propertyMatches &&
          customer.aiInsights.propertyMatches.length > 0 && (
            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-sm font-semibold mb-2">
                عقارات مطابقة: {customer.aiInsights.propertyMatches.length}
              </div>
              <div className="text-xs text-gray-600">
                الذكاء الاصطناعي وجد عقارات تطابق تفضيلات العميل
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
