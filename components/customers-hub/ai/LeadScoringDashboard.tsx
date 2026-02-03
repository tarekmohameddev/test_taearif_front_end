"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Target, Eye } from "lucide-react";
import Link from "next/link";

export function LeadScoringDashboard() {
  const { customers } = useUnifiedCustomersStore();

  // Segment customers by lead score
  const veryHigh = customers.filter((c) => c.leadScore >= 80);
  const high = customers.filter((c) => c.leadScore >= 60 && c.leadScore < 80);
  const medium = customers.filter((c) => c.leadScore >= 40 && c.leadScore < 60);
  const low = customers.filter((c) => c.leadScore < 40);

  const avgLeadScore =
    customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.leadScore, 0) / customers.length)
      : 0;

  const segments = [
    {
      label: "عالي جداً (80-100)",
      count: veryHigh.length,
      customers: veryHigh,
      color: "text-green-600 bg-green-50",
      borderColor: "border-green-600",
    },
    {
      label: "جيد (60-79)",
      count: high.length,
      customers: high,
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-600",
    },
    {
      label: "متوسط (40-59)",
      count: medium.length,
      customers: medium,
      color: "text-yellow-600 bg-yellow-50",
      borderColor: "border-yellow-600",
    },
    {
      label: "منخفض (0-39)",
      count: low.length,
      customers: low,
      color: "text-red-600 bg-red-50",
      borderColor: "border-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              متوسط الجودة
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgLeadScore}/100</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              عملاء عالي الجودة
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{veryHigh.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {customers.length > 0
                ? Math.round((veryHigh.length / customers.length) * 100)
                : 0}
              % من الإجمالي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              يحتاجون تأهيل
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{low.length + medium.length}</div>
            <div className="text-xs text-gray-500 mt-1">عملاء دون المتوسط</div>
          </CardContent>
        </Card>
      </div>

      {/* Segments */}
      <div className="grid gap-6 md:grid-cols-2">
        {segments.map((segment) => (
          <Card key={segment.label} className={`border-r-4 ${segment.borderColor}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{segment.label}</CardTitle>
                <Badge className={segment.color}>{segment.count} عميل</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {segment.customers.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  لا يوجد عملاء في هذه الفئة
                </div>
              ) : (
                segment.customers.slice(0, 5).map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded font-bold flex items-center justify-center text-xs ${segment.color}`}
                      >
                        {customer.leadScore}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.phone}</div>
                      </div>
                    </div>
                    <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
              {segment.customers.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="link" size="sm">
                    عرض الكل ({segment.customers.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scoring Factors */}
      <Card>
        <CardHeader>
          <CardTitle>عوامل التقييم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="font-semibold text-sm mb-3">عوامل إيجابية:</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>مصدر الإحالة (15 نقطة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>ميزانية عالية (20 نقطة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>جدول زمني عاجل (15 نقطة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>تفاعل مرتفع (20 نقطة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>معدل استجابة عالي (15 نقطة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>تقدم في المراحل (15 نقطة)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-sm mb-3">عوامل سلبية:</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>عدم الاستجابة للمتابعات</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>جدول زمني بعيد جداً (6+ أشهر)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>ميزانية غير واضحة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>تفاعل منخفض</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
