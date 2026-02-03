"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Phone,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function SmartRecommendations() {
  const { customers } = useUnifiedCustomersStore();

  // Generate smart recommendations
  const urgentFollowups = customers.filter(
    (c) =>
      c.priority === "urgent" &&
      c.nextFollowUpDate &&
      new Date(c.nextFollowUpDate) <= new Date()
  );

  const highValueNoContact = customers.filter(
    (c) =>
      (c.priority === "high" || c.priority === "urgent") &&
      (!c.lastContactAt ||
        new Date().getTime() - new Date(c.lastContactAt).getTime() >
          7 * 24 * 60 * 60 * 1000)
  );

  const stuckInStage = customers.filter((c) => {
    const daysSinceUpdate =
      (new Date().getTime() - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    return (
      daysSinceUpdate > 14 &&
      (c.stage === "property_matching" || c.stage === "negotiation")
    );
  });

  const readyToClose = customers.filter(
    (c) =>
      c.stage === "down_payment" || c.stage === "contract_prep"
  );

  const recommendations = [
    {
      title: "متابعات عاجلة",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50",
      customers: urgentFollowups,
      action: "يحتاجون اتصال فوري",
      priority: "urgent" as const,
    },
    {
      title: "عملاء عالي القيمة بدون تواصل",
      icon: Phone,
      color: "text-orange-600 bg-orange-50",
      customers: highValueNoContact,
      action: "تواصل معهم اليوم",
      priority: "high" as const,
    },
    {
      title: "عالقون في مرحلة",
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
      customers: stuckInStage,
      action: "ادفعهم للمرحلة التالية",
      priority: "medium" as const,
    },
    {
      title: "جاهزون للإغلاق",
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
      customers: readyToClose,
      action: "حدد موعد الإغلاق",
      priority: "high" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            توصيات ذكية لتحسين المبيعات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            بناءً على تحليل بيانات العملاء، نوصي بالتركيز على:
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded">
              <div className="text-2xl font-bold text-red-600">
                {urgentFollowups.length}
              </div>
              <div className="text-sm">عميل يحتاج متابعة فورية</div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded">
              <div className="text-2xl font-bold text-green-600">
                {readyToClose.length}
              </div>
              <div className="text-sm">عميل جاهز للإغلاق</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card key={rec.title} className="border-r-4" style={{ borderRightColor: rec.color.split(" ")[0].replace("text", "#") }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${rec.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      rec.priority === "urgent"
                        ? "destructive"
                        : rec.priority === "high"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {rec.customers.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {rec.customers.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    رائع! لا يوجد عملاء في هذه الفئة
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-medium text-gray-600 mb-3">
                      {rec.action}
                    </div>
                    {rec.customers.slice(0, 3).map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div>
                          <div className="font-medium text-sm">{customer.name}</div>
                          <div className="text-xs text-gray-500">
                            {customer.aiInsights.nextBestAction?.slice(0, 50)}...
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {rec.customers.length > 3 && (
                      <div className="text-center pt-2">
                        <Link href="/ar/dashboard/customers-hub">
                          <Button variant="link" size="sm">
                            عرض الكل ({rec.customers.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>رؤى إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold">نصيحة:</div>
                <div className="text-gray-700 dark:text-gray-300">
                  العملاء الذين يتلقون متابعة خلال 24 ساعة لديهم فرصة أعلى بنسبة 60%
                  للتحويل
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold">فرصة:</div>
                <div className="text-gray-700 dark:text-gray-300">
                  {highValueNoContact.length} عميل عالي القيمة لم يتم التواصل معهم مؤخراً -
                  فرصة ذهبية!
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
