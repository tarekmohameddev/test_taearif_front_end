"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { 
  Users, TrendingUp, Award, DollarSign, 
  Share2, CheckCircle, Clock, Gift
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ReferralTracker() {
  const { customers } = useUnifiedCustomersStore();

  // Calculate referral metrics
  const referralCustomers = customers.filter(c => c.source === "referral");
  const totalReferrals = referralCustomers.length;
  const referralRate = (totalReferrals / Math.max(customers.length, 1)) * 100;

  // Group by referrer
  const referrerStats = referralCustomers.reduce((acc, customer) => {
    const referrerId = customer.sourceDetails?.referredBy || "unknown";
    const referrerName = customer.sourceDetails?.referrerName || "غير معروف";
    
    if (!acc[referrerId]) {
      acc[referrerId] = {
        id: referrerId,
        name: referrerName,
        count: 0,
        converted: 0,
        totalValue: 0,
        customers: [],
      };
    }
    
    acc[referrerId].count++;
    acc[referrerId].customers.push(customer);
    
    if (customer.stage === "closing" || customer.stage === "post_sale") {
      acc[referrerId].converted++;
      acc[referrerId].totalValue += customer.totalDealValue || 0;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const topReferrers = Object.values(referrerStats)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  // Referral rewards calculation (example: 2% commission)
  const calculateReward = (dealValue: number) => {
    return dealValue * 0.02; // 2% commission
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">إجمالي الإحالات</span>
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">{totalReferrals}</div>
            <div className="text-xs text-gray-600 mt-1">
              {referralRate.toFixed(1)}% من العملاء
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">معدل التحويل</span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">
              {totalReferrals > 0
                ? ((referralCustomers.filter(c => c.stage === "closing" || c.stage === "post_sale").length / totalReferrals) * 100).toFixed(0)
                : 0}%
            </div>
            <div className="text-xs text-gray-600 mt-1">من الإحالات</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">قيمة الإحالات</span>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold">
              {((referralCustomers.reduce((sum, c) => sum + (c.totalDealValue || 0), 0)) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600 mt-1">ريال سعودي</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">إجمالي المكافآت</span>
              <Gift className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold">
              {((referralCustomers.reduce((sum, c) => sum + calculateReward(c.totalDealValue || 0), 0)) / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-gray-600 mt-1">ريال سعودي</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            أفضل المحيلين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topReferrers.length > 0 ? (
            topReferrers.map((referrer: any, index: number) => (
              <Card key={referrer.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{referrer.name}</h4>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <div className="text-gray-600">الإحالات</div>
                            <div className="text-2xl font-bold text-blue-600">
                              {referrer.count}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">تم التحويل</div>
                            <div className="text-2xl font-bold text-green-600">
                              {referrer.converted}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">القيمة الإجمالية</div>
                            <div className="text-2xl font-bold text-purple-600">
                              {(referrer.totalValue / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">معدل التحويل</span>
                            <span className="font-bold">
                              {((referrer.converted / referrer.count) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={(referrer.converted / referrer.count) * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <Badge className="bg-orange-600">
                            <Gift className="h-3 w-3 ml-1" />
                            مكافأة: {(calculateReward(referrer.totalValue) / 1000).toFixed(1)}K ريال
                          </Badge>
                          {referrer.converted > 0 && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 ml-1" />
                              {referrer.converted} صفقة مغلقة
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              لا توجد إحالات بعد
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            أحدث الإحالات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {referralCustomers.slice(0, 10).map((customer) => (
            <div 
              key={customer.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">{customer.name}</div>
                  <div className="text-sm text-gray-600">
                    من: {customer.sourceDetails?.referrerName || "غير معروف"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge>
                  {customer.stage === "closing" || customer.stage === "post_sale" ? (
                    <CheckCircle className="h-3 w-3 ml-1" />
                  ) : (
                    <Clock className="h-3 w-3 ml-1" />
                  )}
                  {customer.stage === "closing" || customer.stage === "post_sale" ? "تم التحويل" : "قيد المعالجة"}
                </Badge>
                {customer.totalDealValue && (
                  <span className="text-sm font-bold text-green-600">
                    {(customer.totalDealValue / 1000).toFixed(0)}K ريال
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Referral Program Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">برنامج الإحالات</h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>• احصل على 2% عمولة من قيمة كل صفقة ناجحة</p>
                <p>• لا يوجد حد أقصى للمكافآت</p>
                <p>• الدفع خلال 30 يوم من إتمام الصفقة</p>
                <p>• يمكن للعملاء والشركاء المشاركة في البرنامج</p>
              </div>
              <Button className="mt-4">
                <Share2 className="h-4 w-4 ml-2" />
                مشاركة رابط الإحالة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
