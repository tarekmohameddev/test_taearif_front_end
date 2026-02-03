"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { 
  Users, TrendingUp, Target, DollarSign, 
  Clock, Building, Home, Briefcase,
  Globe, MapPin, Calendar, Zap
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: any;
  color: string;
  count: number;
  avgLeadScore: number;
  conversionRate: number;
  avgDealValue: number;
  filter: (customers: any[]) => any[];
}

export function CustomerSegments() {
  const { customers } = useUnifiedCustomersStore();

  const segments: Segment[] = [
    {
      id: "hot_leads",
      name: "عملاء أولوية عالية",
      nameEn: "High Priority",
      description: "عملاء بعناية عاجلة أو مهمة",
      icon: Zap,
      color: "red",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => c.priority === "urgent" || c.priority === "high"),
    },
    {
      id: "urgent_buyers",
      name: "مشترون عاجلون",
      nameEn: "Urgent Buyers",
      description: "عملاء بحاجة فورية (جدول زمني فوري)",
      icon: Clock,
      color: "orange",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => c.preferences.timeline === "immediate"),
    },
    {
      id: "high_budget",
      name: "ميزانية مرتفعة",
      nameEn: "High Budget",
      description: "عملاء بميزانية +1M ريال",
      icon: DollarSign,
      color: "green",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => (c.preferences.budgetMax || 0) >= 1000000),
    },
    {
      id: "investors",
      name: "مستثمرون",
      nameEn: "Investors",
      description: "عملاء يبحثون عن عقارات استثمارية",
      icon: TrendingUp,
      color: "purple",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => c.preferences.purpose === "invest" || c.customerType === "investor"),
    },
    {
      id: "villa_buyers",
      name: "مشترو فلل",
      nameEn: "Villa Buyers",
      description: "عملاء يبحثون عن فلل",
      icon: Home,
      color: "blue",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => c.preferences.propertyType.includes("villa")),
    },
    {
      id: "commercial",
      name: "عقارات تجارية",
      nameEn: "Commercial",
      description: "عملاء يبحثون عن عقارات تجارية",
      icon: Briefcase,
      color: "indigo",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => c.preferences.propertyType.includes("commercial")),
    },
    {
      id: "riyadh",
      name: "الرياض",
      nameEn: "Riyadh",
      description: "عملاء يفضلون الرياض",
      icon: MapPin,
      color: "cyan",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => 
        c.preferences.preferredAreas.some(area => area.includes("الرياض")) ||
        c.preferences.preferredCities?.includes("الرياض")
      ),
    },
    {
      id: "referrals",
      name: "إحالات",
      nameEn: "Referrals",
      description: "عملاء جاءوا عبر الإحالة",
      icon: Users,
      color: "pink",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => c.source === "referral"),
    },
    {
      id: "near_closing",
      name: "قريب من الإتمام",
      nameEn: "Near Closing",
      description: "عملاء في مرحلة متقدمة",
      icon: Target,
      color: "emerald",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => 
        ["negotiation", "contract_prep", "down_payment", "closing"].includes(c.stage)
      ),
    },
    {
      id: "inactive",
      name: "غير نشط",
      nameEn: "Inactive",
      description: "لم يتم التواصل معهم منذ +7 أيام",
      icon: Clock,
      color: "gray",
      count: 0,
      avgLeadScore: 0,
      conversionRate: 0,
      avgDealValue: 0,
      filter: (custs) => custs.filter(c => {
        if (!c.lastContactAt) return true;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(c.lastContactAt) < weekAgo;
      }),
    },
  ];

  // Calculate metrics for each segment
  const calculatedSegments = segments.map(segment => {
    const segmentCustomers = segment.filter(customers);
    const converted = segmentCustomers.filter(c => c.stage === "closing" || c.stage === "post_sale").length;
    
    return {
      ...segment,
      count: segmentCustomers.length,
      avgLeadScore: 0,
      conversionRate: segmentCustomers.length > 0
        ? Math.round((converted / segmentCustomers.length) * 100)
        : 0,
      avgDealValue: segmentCustomers.length > 0
        ? segmentCustomers.reduce((sum, c) => sum + (c.totalDealValue || 0), 0) / segmentCustomers.length
        : 0,
    };
  });

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      red: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
      orange: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
      green: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      purple: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
      blue: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      indigo: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800",
      cyan: "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800",
      pink: "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800",
      emerald: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
      gray: "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      red: "text-red-600",
      orange: "text-orange-600",
      green: "text-green-600",
      purple: "text-purple-600",
      blue: "text-blue-600",
      indigo: "text-indigo-600",
      cyan: "text-cyan-600",
      pink: "text-pink-600",
      emerald: "text-emerald-600",
      gray: "text-gray-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">تقسيم العملاء</h3>
        <p className="text-sm text-gray-500">
          تحليل العملاء حسب الفئات والخصائص
        </p>
      </div>

      {/* Segments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calculatedSegments.map((segment) => {
          const Icon = segment.icon;
          return (
            <Card 
              key={segment.id}
              className={`border-2 hover:shadow-lg transition-all ${getColorClass(segment.color)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                      <Icon className={`h-6 w-6 ${getIconColor(segment.color)}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{segment.name}</CardTitle>
                      <p className="text-xs text-gray-600 mt-1">{segment.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Count */}
                <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <div className="text-3xl font-bold">{segment.count}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {((segment.count / Math.max(customers.length, 1)) * 100).toFixed(1)}% من الإجمالي
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-white dark:bg-gray-900 rounded">
                    <div className="font-bold text-lg">{segment.conversionRate}%</div>
                    <div className="text-gray-600">تحويل</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-900 rounded">
                    <div className="font-bold text-lg">
                      {(segment.avgDealValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-gray-600">قيمة</div>
                  </div>
                </div>

                {/* Actions */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Filter customers by this segment
                    console.log("Filter by segment:", segment.id);
                  }}
                >
                  عرض العملاء
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            رؤى التقسيم
          </h4>
          <div className="space-y-2 text-sm">
            {calculatedSegments.sort((a, b) => b.count - a.count).slice(0, 3).map((segment, index) => (
              <div key={segment.id} className="flex items-start gap-2">
                <Badge className={getIconColor(segment.color)}>
                  #{index + 1}
                </Badge>
                <span>
                  <strong>{segment.name}</strong> هو أكبر قطاع بـ {segment.count} عميل 
                  ({((segment.count / Math.max(customers.length, 1)) * 100).toFixed(1)}% من الإجمالي)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
