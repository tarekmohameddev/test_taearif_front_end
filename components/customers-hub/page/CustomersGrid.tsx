"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, MapPin, TrendingUp, 
  Calendar, Home, DollarSign, Clock, Target
} from "lucide-react";
import Link from "next/link";
import { getStageColor, getStageNameAr } from "@/types/unified-customer";

export function CustomersGrid() {
  const { filteredCustomers, currentPage, pageSize } = useUnifiedCustomersStore();
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") return "🚨";
    if (priority === "high") return "🔥";
    if (priority === "medium") return "⭐";
    return "📌";
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "غير محدد";
    return `${(amount / 1000).toFixed(0)}k ريال`;
  };

  const getDaysAgo = (dateStr?: string) => {
    if (!dateStr) return "لم يتم التواصل";
    const date = new Date(dateStr);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "اليوم";
    if (days === 1) return "أمس";
    return `قبل ${days} يوم`;
  };

  if (paginatedCustomers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-gray-500">لا توجد عملاء</div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedCustomers.map((customer) => (
        <Card 
          key={customer.id} 
          className="hover:shadow-lg transition-shadow overflow-hidden group"
        >
          {/* Header with Avatar & Lead Score */}
          <div 
            className="h-20 relative"
            style={{ backgroundColor: getStageColor(customer.stage) + "20" }}
          >
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-900">
                <AvatarFallback 
                  className="text-lg font-bold"
                  style={{ backgroundColor: getStageColor(customer.stage) }}
                >
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute top-2 left-2 text-xl">
              {getPriorityIcon(customer.priority)}
            </div>
          </div>

          <CardContent className="pt-10 pb-4 space-y-3">
            {/* Name & Stage */}
            <div className="text-center space-y-1">
              <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
                <h3 className="font-bold text-lg hover:text-blue-600 transition-colors">
                  {customer.name}
                </h3>
              </Link>
              <Badge 
                className="text-xs"
                style={{ backgroundColor: getStageColor(customer.stage) }}
              >
                {getStageNameAr(customer.stage)}
              </Badge>
            </div>

            {/* Quick Info */}
            <div className="space-y-2 text-sm">
              {/* Contact */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span className="font-mono">{customer.phone}</span>
                </div>
              </div>

              {/* Budget */}
              {customer.preferences.budgetMax && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <DollarSign className="h-3 w-3" />
                    <span>الميزانية:</span>
                  </div>
                  <span className="font-semibold text-xs">
                    {formatCurrency(customer.preferences.budgetMax)}
                  </span>
                </div>
              )}

              {/* Property Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Home className="h-3 w-3" />
                  <span>النوع:</span>
                </div>
                <div className="flex gap-1">
                  {customer.preferences.propertyType.slice(0, 2).map((type) => (
                    <Badge key={type} variant="outline" className="text-xs px-1 py-0">
                      {type === "villa" ? "فيلا" : 
                       type === "apartment" ? "شقة" : 
                       type === "land" ? "أرض" : 
                       type === "commercial" ? "تجاري" : type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Areas */}
              {customer.preferences.preferredAreas.length > 0 && (
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">
                    {customer.preferences.preferredAreas.slice(0, 2).join(", ")}
                  </span>
                </div>
              )}

              {/* Timeline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>الجدول:</span>
                </div>
                <span className="text-xs font-medium">
                  {customer.preferences.timeline === "immediate" ? "فوري" :
                   customer.preferences.timeline === "1-3months" ? "1-3 شهور" :
                   customer.preferences.timeline === "3-6months" ? "3-6 شهور" :
                   "6+ شهور"}
                </span>
              </div>

              {/* Last Contact */}
              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>آخر تواصل:</span>
                </div>
                <span className="text-gray-600">
                  {getDaysAgo(customer.lastContactAt)}
                </span>
              </div>

              {/* AI Insight */}
              {customer.aiInsights.conversionProbability && (
                <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950 p-2 rounded text-xs">
                  <div className="flex items-center gap-1 text-purple-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>احتمالية التحويل:</span>
                  </div>
                  <span className="font-bold text-purple-700">
                    {customer.aiInsights.conversionProbability}%
                  </span>
                </div>
              )}
            </div>

            {/* View Details */}
            <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
              >
                <Target className="h-3 w-3 ml-1" />
                عرض التفاصيل
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
