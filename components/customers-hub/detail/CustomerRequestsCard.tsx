"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { PropertyRequest } from "@/lib/services/customers-hub-detail-api";

interface CustomerRequestsCardProps {
  propertyRequests?: PropertyRequest[];
}

export function CustomerRequestsCard({ propertyRequests = [] }: CustomerRequestsCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200";
      case "medium":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200";
      case "low":
        return "text-gray-600 bg-gray-50 dark:bg-gray-800/50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800/50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50 dark:bg-green-950/30";
      case "in_progress":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950/30";
      case "pending":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30";
      case "cancelled":
        return "text-red-600 bg-red-50 dark:bg-red-950/30";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800/50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in_progress":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "pending":
        return "معلق";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "عاجل";
      case "high":
        return "عالي";
      case "medium":
        return "متوسط";
      case "low":
        return "منخفض";
      default:
        return priority;
    }
  };

  if (propertyRequests.length === 0) {
    return (
      <Card>
        <CardHeader
          className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">طلبات العميل</CardTitle>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </CardHeader>
        {isOpen && (
          <CardContent className="pt-0">
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>لا توجد طلبات للعميل</p>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">طلبات العميل</CardTitle>
            {propertyRequests.length > 0 && (
              <Badge variant="default">{propertyRequests.length}</Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 space-y-4">
          {propertyRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden border-2">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Request Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-base">{request.title}</h4>
                      </div>
                      {request.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {request.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={getPriorityColor(request.priority)}>
                        {getPriorityLabel(request.priority)}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Request Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Property Category */}
                    {request.propertyCategory && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-sm">نوع العقار</span>
                        </div>
                        <div className="text-sm font-semibold">{request.propertyCategory}</div>
                        {request.propertyType && (
                          <div className="text-xs text-gray-500 mt-1">{request.propertyType}</div>
                        )}
                      </div>
                    )}

                    {/* Budget */}
                    {(request.budgetMin || request.budgetMax) && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">الميزانية</span>
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          {request.budgetMin && request.budgetMax
                            ? `${(request.budgetMin / 1000).toFixed(0)}k - ${(request.budgetMax / 1000000).toFixed(1)}M ريال`
                            : request.budgetMax
                            ? `حتى ${(request.budgetMax / 1000000).toFixed(1)}M ريال`
                            : request.budgetMin
                            ? `من ${(request.budgetMin / 1000).toFixed(0)}k ريال`
                            : "غير محدد"}
                        </div>
                      </div>
                    )}

                    {/* City */}
                    {request.city && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">المدينة</span>
                        </div>
                        <div className="text-sm font-semibold">{request.city}</div>
                      </div>
                    )}

                    {/* Stage */}
                    {request.stage && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-sm">المرحلة</span>
                        </div>
                        <div className="text-sm font-semibold">
                          {request.stage.nameAr || request.stage.nameEn}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {request.appointments && request.appointments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{request.appointments.length} موعد</span>
                      </div>
                    )}
                    {request.reminders && request.reminders.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{request.reminders.length} تذكير</span>
                      </div>
                    )}
                    {request.notes && request.notes.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{request.notes.length} ملاحظة</span>
                      </div>
                    )}
                    {request.metadata?.seriousness && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>{request.metadata.seriousness}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div className="flex justify-end pt-2 border-t">
                    <Link href={`/ar/dashboard/customers-hub/requests/${request.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        عرض التفاصيل
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
