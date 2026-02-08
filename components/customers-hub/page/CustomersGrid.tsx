"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, MapPin, TrendingUp, 
  Calendar, Home, DollarSign, Clock, Target, FileText
} from "lucide-react";
import Link from "next/link";

export function CustomersGrid() {
  const { filteredCustomers, currentPage, pageSize } = useUnifiedCustomersStore();
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);


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
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedCustomers.map((customer) => {
        return (
          <Card 
            key={customer.id} 
            className="group relative overflow-hidden border-2 border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Subtle gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <CardContent className="p-5 space-y-4">
              {/* Name */}
              <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
                <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400">
                    {customer.name}
                  </h3>
                </Link>
              </div>

            {/* Quick Info */}
            <div className="space-y-3 text-sm">
              {/* Contact */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-mono text-xs font-medium">{customer.phone}</span>
                </div>
              </div>

              {/* Property Requests Count */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>طلبات العقار</span>
                </div>
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                  {customer.totalPropertyRequests ?? 0}
                </span>
              </div>

              {/* Budget */}
              {customer.preferences?.budgetMax && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>الميزانية</span>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    {formatCurrency(customer.preferences.budgetMax)}
                  </span>
                </div>
              )}

              {/* Property Type */}
              {customer.preferences?.propertyType && customer.preferences.propertyType.length > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs">
                    <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>النوع</span>
                  </div>
                  <div className="flex gap-1.5">
                    {customer.preferences.propertyType.slice(0, 2).map((type) => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-900/30"
                      >
                        {type === "villa" ? "فيلا" : 
                         type === "apartment" ? "شقة" : 
                         type === "land" ? "أرض" : 
                         type === "commercial" ? "تجاري" : type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Areas */}
              {customer.preferences?.preferredAreas && customer.preferences.preferredAreas.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5 text-gray-700 dark:text-gray-300 text-xs">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">
                    {customer.preferences.preferredAreas.slice(0, 2).join(", ")}
                  </span>
                </div>
              )}

              {/* Timeline */}
              {customer.preferences?.timeline && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>الجدول</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {customer.preferences.timeline === "immediate" ? "فوري" :
                     customer.preferences.timeline === "1-3months" ? "1-3 شهور" :
                     customer.preferences.timeline === "3-6months" ? "3-6 شهور" :
                     "6+ شهور"}
                  </span>
                </div>
              )}

              {/* Last Contact */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5 text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {getDaysAgo(customer.lastContactAt)}
                </span>
              </div>

              {/* AI Insight */}
              {customer.aiInsights?.conversionProbability && (
                <div className="flex items-center justify-between rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">احتمالية التحويل</span>
                  </div>
                  <span className="font-bold text-base text-blue-600 dark:text-blue-400">
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
                className="w-full text-xs font-semibold border-0 bg-blue-100 text-black hover:bg-blue-200 transition-all duration-200 dark:bg-blue-900/30 dark:text-gray-100 dark:hover:bg-blue-900/50"
              >
                <Target className="h-3.5 w-3.5 ml-1.5" />
                عرض التفاصيل
              </Button>
            </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
