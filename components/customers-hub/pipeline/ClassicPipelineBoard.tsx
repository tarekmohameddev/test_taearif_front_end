"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  DollarSign,
  Phone,
  User,
  Calendar,
  Building,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import type { PipelineStage } from "@/lib/services/customers-hub-pipeline-api";
import type { MoveCustomerParams } from "@/lib/services/customers-hub-pipeline-api";
import type { Stage } from "@/lib/services/customers-hub-stages-api";

interface ClassicPipelineBoardProps {
  stages?: PipelineStage[];
  apiStages?: Stage[];
  onMoveCustomer?: (params: MoveCustomerParams) => Promise<boolean>;
}

export function ClassicPipelineBoard(props?: ClassicPipelineBoardProps) {
  const { stages: storeStages } = useCustomersHubStagesStore();
  const apiStages = props?.apiStages || storeStages;
  const stages = props?.stages;

  // Track collapsed stages
  const [collapsedStages, setCollapsedStages] = useState<Set<number>>(new Set());
  const [movingCustomer, setMovingCustomer] = useState<string | null>(null);

  const toggleStage = (stageId: number) => {
    const newCollapsed = new Set(collapsedStages);
    if (newCollapsed.has(stageId)) {
      newCollapsed.delete(stageId);
    } else {
      newCollapsed.add(stageId);
    }
    setCollapsedStages(newCollapsed);
  };

  const handleMoveCustomer = async (
    customer: UnifiedCustomer,
    newStageId: string | number
  ) => {
    if (!props?.onMoveCustomer) return;

    setMovingCustomer(customer.id.toString());
    try {
      // Determine if this is a request or inquiry based on source field
      // API response includes source, requestId, and inquiryId fields
      const customerSource = (customer as any).source;
      const requestId = (customer as any).requestId;
      const inquiryId = (customer as any).inquiryId;
      
      // Prepare move params based on source
      const moveParams: MoveCustomerParams = {
        newStageId: newStageId,
      };
      
      if (customerSource === "inquiry" && inquiryId !== undefined && inquiryId !== null) {
        // This is an inquiry - use inquiryId
        moveParams.inquiryId = typeof inquiryId === "number" 
          ? inquiryId 
          : parseInt(inquiryId.toString());
      } else if (requestId !== undefined && requestId !== null) {
        // This is a request - use requestId
        moveParams.requestId = typeof requestId === "number" 
          ? requestId 
          : parseInt(requestId.toString());
      } else {
        // Fallback: use customer id as requestId (backward compatibility)
        moveParams.requestId = typeof customer.id === "number" 
          ? customer.id 
          : parseInt(customer.id.toString());
      }
      
      await props.onMoveCustomer(moveParams);
    } catch (err) {
      console.error("Error moving customer:", err);
    } finally {
      setMovingCustomer(null);
    }
  };

  // Get stages to display
  const displayStages =
    apiStages && apiStages.length > 0
      ? apiStages
          .filter((stage) => stage.is_active)
          .sort((a, b) => a.order - b.order)
          .map((apiStage) => {
            const pipelineStage = stages?.find(
              (ps) =>
                ps.id === apiStage.id ||
                ps.stage_id === apiStage.id ||
                ps.id?.toString() === apiStage.id.toString()
            );

            return {
              id: apiStage.id,
              nameAr: apiStage.stage_name_ar,
              nameEn: apiStage.stage_name_en,
              color: apiStage.color,
              order: apiStage.order,
              customers: pipelineStage?.customers || [],
              customerCount: pipelineStage?.count || pipelineStage?.customerCount || 0,
            };
          })
      : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "غير محدد";
    return `${(amount / 1000).toFixed(0)}k ريال`;
  };

  const getPriorityBadge = (priority?: string) => {
    const variants: Record<string, { variant: any; text: string; icon: any }> = {
      urgent: {
        variant: "destructive",
        text: "عاجل",
        icon: "🚨",
      },
      high: {
        variant: "default",
        text: "عالي",
        icon: "🔥",
      },
      medium: {
        variant: "secondary",
        text: "متوسط",
        icon: "⚡",
      },
      low: {
        variant: "outline",
        text: "منخفض",
        icon: "📌",
      },
    };
    const config = variants[priority || "medium"] || variants.medium;
    return (
      <Badge variant={config.variant as any} className="text-xs gap-1">
        <span>{config.icon}</span>
        {config.text}
      </Badge>
    );
  };

  const getSourceBadge = (source?: string) => {
    const labels: Record<string, string> = {
      inquiry: "استفسار موقع",
      manual: "إدخال يدوي",
      whatsapp: "واتساب",
      import: "مستورد",
      referral: "إحالة",
      website: "موقع",
    };
    return (
      <Badge variant="outline" className="text-xs">
        {labels[source || "manual"] || source || "غير محدد"}
      </Badge>
    );
  };

  if (!displayStages || displayStages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            لا توجد مراحل متاحة. يرجى التأكد من إعداد المراحل في النظام.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Timeline Vertical Layout */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full hidden lg:block" />

        {/* Stages */}
        <div className="space-y-6">
          {displayStages.map((stage, index) => {
            const isCollapsed = collapsedStages.has(stage.id);
            const stageCustomers = stage.customers || [];
            const totalDealValue = stageCustomers.reduce(
              (sum, c) => sum + (c.totalDealValue || 0),
              0
            );
            const isLast = index === displayStages.length - 1;

            return (
              <div key={stage.id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute right-4 sm:right-6 top-8 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-900 z-10 hidden md:block"
                  style={{ 
                    backgroundColor: stage.color,
                    boxShadow: `0 0 0 4px ${stage.color}20, 0 4px 12px ${stage.color}40`
                  }}
                />

                {/* Stage Card */}
                <Card
                  className="mr-0 sm:mr-8 md:mr-12 lg:mr-16 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border-r-4 shadow-lg"
                  style={{
                    borderRightColor: stage.color,
                    borderRightWidth: "6px",
                  }}
                >
                  {/* Stage Header */}
                  <CardHeader
                    className="cursor-pointer transition-all duration-300 hover:bg-opacity-20"
                    onClick={() => toggleStage(stage.id)}
                    style={{
                      background: `linear-gradient(135deg, ${stage.color}20 0%, ${stage.color}10 50%, ${stage.color}05 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 flex-wrap sm:flex-nowrap">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-6 flex-shrink-0"
                          style={{ 
                            backgroundColor: stage.color,
                            boxShadow: `0 4px 14px ${stage.color}50, 0 2px 4px ${stage.color}30`
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                            <span className="truncate">{stage.nameAr}</span>
                            {stage.nameEn && (
                              <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400 hidden sm:inline">
                                ({stage.nameEn})
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="font-semibold">
                                {stageCustomers.length}
                              </span>
                              <span>عميل</span>
                            </div>
                            {totalDealValue > 0 && (
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(totalDealValue)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStage(stage.id);
                        }}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronUp className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Stage Content */}
                  {!isCollapsed && (
                    <CardContent className="pt-6">
                      {stageCustomers.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">لا يوجد عملاء في هذه المرحلة</p>
                        </div>
                      ) : (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {stageCustomers.map((customer, customerIndex) => {
                            const isMoving = movingCustomer === customer.id.toString();
                            
                            // Generate extremely unique key
                            const random1 = Math.random().toString(36).substring(2, 15);
                            const random2 = Math.random().toString(36).substring(2, 15);
                            const random3 = typeof crypto !== 'undefined' && crypto.randomUUID 
                              ? crypto.randomUUID() 
                              : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                            const timestamp = performance.now().toString(36);
                            const uniqueKey = `${stage.id}-${customer.id}-${customerIndex}-${(customer as any).requestId || ''}-${(customer as any).inquiryId || ''}-${random1}-${random2}-${random3}-${timestamp}`;
                            
                            return (
                              <Card
                                key={uniqueKey}
                                className="group hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 border-l-2 bg-white dark:bg-gray-800"
                                style={{
                                  borderLeftColor: stage.color,
                                  borderLeftWidth: "4px",
                                }}
                              >
                                <CardContent className="p-4 space-y-3">
                                  {/* Customer Header */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                      <Avatar
                                        className="h-10 w-10 flex-shrink-0 ring-2 ring-offset-2 transition-all duration-300 group-hover:ring-4 group-hover:scale-110"
                                        style={{
                                          ringColor: stage.color,
                                        }}
                                      >
                                        <AvatarFallback
                                          className="text-sm font-bold text-white"
                                          style={{
                                            backgroundColor: stage.color,
                                          }}
                                        >
                                          {getInitials(customer.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm truncate text-gray-900 dark:text-white">
                                          {customer.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                          <Phone className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">{customer.phone}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Priority & Source */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {getPriorityBadge(customer.priority)}
                                    {getSourceBadge(customer.source)}
                                  </div>

                                  {/* Deal Value */}
                                  {customer.totalDealValue && (
                                    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-300 group-hover:shadow-md">
                                      <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                                      <span className="text-sm font-bold text-green-600">
                                        {formatCurrency(customer.totalDealValue)}
                                      </span>
                                    </div>
                                  )}

                                  {/* Property Preferences */}
                                  {customer.preferences?.propertyType && (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                        <Building className="h-3 w-3" />
                                        <span>نوع العقار:</span>
                                      </div>
                                      <div className="flex items-center gap-1 flex-wrap">
                                        {Array.isArray(customer.preferences.propertyType)
                                          ? customer.preferences.propertyType
                                              .slice(0, 2)
                                              .map((type: string) => (
                                                <Badge
                                                  key={type}
                                                  variant="outline"
                                                  className="text-xs px-2 py-0"
                                                >
                                                  {type === "villa"
                                                    ? "فيلا"
                                                    : type === "apartment"
                                                    ? "شقة"
                                                    : type === "land"
                                                    ? "أرض"
                                                    : type === "commercial"
                                                    ? "تجاري"
                                                    : type}
                                                </Badge>
                                              ))
                                          : (
                                            <Badge variant="outline" className="text-xs px-2 py-0">
                                              {customer.preferences.propertyType === "villa"
                                                ? "فيلا"
                                                : customer.preferences.propertyType === "apartment"
                                                ? "شقة"
                                                : customer.preferences.propertyType === "land"
                                                ? "أرض"
                                                : customer.preferences.propertyType === "commercial"
                                                ? "تجاري"
                                                : String(customer.preferences.propertyType)}
                                            </Badge>
                                          )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Assigned Employee */}
                                  {customer.assignedEmployee && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <User className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">
                                        {customer.assignedEmployee.name}
                                      </span>
                                    </div>
                                  )}

                                  {/* Last Contact */}
                                  {customer.lastContactAt && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Clock className="h-3 w-3 flex-shrink-0" />
                                      <span>
                                        آخر تواصل:{" "}
                                        {new Date(customer.lastContactAt).toLocaleDateString(
                                          "ar-SA",
                                          {
                                            month: "short",
                                            day: "numeric",
                                          }
                                        )}
                                      </span>
                                    </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 pt-2 border-t flex-col sm:flex-row">
                                    <Link
                                      href={`/ar/dashboard/customers-hub/${customer.id}`}
                                      className="flex-1 w-full sm:w-auto"
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full sm:w-auto text-xs h-8"
                                      >
                                        <Eye className="h-3 w-3 ml-1" />
                                        <span className="hidden sm:inline">عرض التفاصيل</span>
                                        <span className="sm:hidden">عرض</span>
                                      </Button>
                                    </Link>
                                    <Select
                                      value=""
                                      onValueChange={(newStageId) => {
                                        // newStageId can be string or number - API accepts both
                                        const stageId = newStageId.includes("_") || isNaN(parseInt(newStageId))
                                          ? newStageId  // String stage_id (e.g. "qualified")
                                          : parseInt(newStageId);  // Integer id
                                        handleMoveCustomer(
                                          customer,
                                          stageId
                                        );
                                      }}
                                      disabled={isMoving}
                                    >
                                      <SelectTrigger
                                        className="w-full sm:w-32 text-xs h-8"
                                        disabled={isMoving}
                                      >
                                        <SelectValue placeholder="نقل إلى مرحلة" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {displayStages
                                          .filter((s) => s.id !== stage.id)
                                          .map((s) => (
                                            <SelectItem
                                              key={s.id}
                                              value={s.id.toString()}
                                            >
                                              {s.nameAr}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                  إجمالي العملاء في المسار
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {displayStages.reduce(
                    (sum, stage) => sum + (stage.customers?.length || 0),
                    0
                  )}{" "}
                  عميل عبر {displayStages.length} مرحلة
                </p>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {displayStages.reduce(
                  (sum, stage) =>
                    sum +
                    (stage.customers?.reduce(
                      (s, c) => s + (c.totalDealValue || 0),
                      0
                    ) || 0),
                  0
                ) > 0
                  ? formatCurrency(
                      displayStages.reduce(
                        (sum, stage) =>
                          sum +
                          (stage.customers?.reduce(
                            (s, c) => s + (c.totalDealValue || 0),
                            0
                          ) || 0),
                        0
                      )
                    )
                  : "غير محدد"}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                القيمة الإجمالية
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
