"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  DollarSign,
  Phone,
  User,
  Building,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import type { PipelineStage, PipelineCustomer } from "@/lib/services/customers-hub-pipeline-api";
import type { MoveCustomerParams } from "@/lib/services/customers-hub-pipeline-api";
import type { Stage } from "@/lib/services/customers-hub-stages-api";
import { priorityConfig } from "../requests/constants";

interface TablePipelineBoardProps {
  stages?: PipelineStage[];
  apiStages?: Stage[];
  onMoveCustomer?: (params: MoveCustomerParams) => Promise<boolean>;
}

type SortField = "name" | "stage" | "priority" | "dealValue" | "lastContact";
type SortOrder = "asc" | "desc";

export function TablePipelineBoard(props?: TablePipelineBoardProps) {
  const { stages: storeStages } = useCustomersHubStagesStore();
  const apiStages = props?.apiStages || storeStages;
  const stages = props?.stages;

  const [sortField, setSortField] = useState<SortField>("stage");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("all");
  const [movingCustomer, setMovingCustomer] = useState<string | null>(null);
  // Cache all customers by stage - this is the source of truth for UI
  const [cachedCustomersByStage, setCachedCustomersByStage] = useState<Map<string | number, UnifiedCustomer[]>>(new Map());
  
  // Initialize cache from props when stages data changes
  useEffect(() => {
    if (stages && stages.length > 0) {
      const newCache = new Map<string | number, UnifiedCustomer[]>();
      stages.forEach(stage => {
        const stageId = stage.id || stage.stage_id;
        if (stageId && stage.customers) {
          // Convert PipelineCustomer to UnifiedCustomer (type assertion for compatibility)
          newCache.set(stageId, [...(stage.customers as any as UnifiedCustomer[])]);
        }
      });
      setCachedCustomersByStage(newCache);
    }
  }, [stages]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleMoveCustomer = (
    customer: UnifiedCustomer | PipelineCustomer,
    newStageId: string | number
  ) => {
    if (!props?.onMoveCustomer) return;

    const customerId = customer.id.toString();
    const oldStageId = (customer as any).stageId || customer.stage;
    
    // Find new stage info for optimistic update
    const newStage = displayStages.find(s => 
      s.id === newStageId || 
      s.id?.toString() === newStageId.toString()
    );
    
    if (!newStage) return;
    
    // UPDATE CACHE IMMEDIATELY - This is the source of truth for UI
    setCachedCustomersByStage(prev => {
      const newCache = new Map(prev);
      
      // Remove customer from old stage
      const oldStageCustomers = newCache.get(oldStageId) || [];
      const updatedOldStage = oldStageCustomers.filter(c => c.id.toString() !== customerId);
      newCache.set(oldStageId, updatedOldStage);
      
      // Add customer to new stage
      const newStageCustomers = newCache.get(newStageId) || [];
      const updatedCustomer = { 
        ...customer, 
        stage: newStageId,
        stageId: newStageId,
        stageName: newStage.nameAr,
        stageColor: newStage.color,
      } as any;
      // Check if customer already exists (shouldn't, but safety)
      if (!newStageCustomers.find(c => c.id.toString() === customerId)) {
        newCache.set(newStageId, [...newStageCustomers, updatedCustomer]);
      }
      
      return newCache;
    });
    
    setMovingCustomer(customerId);
    
    // Call API in background (don't await) - only for sync with backend
    const customerSource = (customer as any).source;
    const requestId = (customer as any).requestId;
    const inquiryId = (customer as any).inquiryId;
    
    const moveParams: MoveCustomerParams = {
      newStageId: newStageId,
    };
    
    if (customerSource === "inquiry" && inquiryId !== undefined && inquiryId !== null) {
      moveParams.inquiryId = typeof inquiryId === "number" 
        ? inquiryId 
        : parseInt(inquiryId.toString());
    } else if (requestId !== undefined && requestId !== null) {
      moveParams.requestId = typeof requestId === "number" 
        ? requestId 
        : parseInt(requestId.toString());
    } else {
      moveParams.requestId = typeof customer.id === "number" 
        ? customer.id 
        : parseInt(customer.id.toString());
    }
    
    // Call API in background - if it fails, rollback cache
    props.onMoveCustomer(moveParams)
      .then(() => {
        setMovingCustomer(null);
      })
      .catch((err) => {
        console.error("Error moving customer:", err);
        // Rollback cache on error
        setCachedCustomersByStage(prev => {
          const newCache = new Map(prev);
          
          // Remove from new stage
          const newStageCustomers = newCache.get(newStageId) || [];
          const updatedNewStage = newStageCustomers.filter(c => c.id.toString() !== customerId);
          newCache.set(newStageId, updatedNewStage);
          
          // Add back to old stage
          const oldStageCustomers = newCache.get(oldStageId) || [];
          if (!oldStageCustomers.find(c => c.id.toString() === customerId)) {
            newCache.set(oldStageId, [...oldStageCustomers, { 
              ...customer, 
              stage: oldStageId,
              stageId: oldStageId,
            } as any]);
          }
          
          return newCache;
        });
        setMovingCustomer(null);
      });
  };

  // Get stages to display - use CACHED customers as source of truth (not backend response)
  const displayStages = useMemo(() => {
    if (!apiStages || apiStages.length === 0) return [];
    
    return apiStages
      .filter((stage) => stage.is_active)
      .sort((a, b) => a.order - b.order)
      .map((apiStage) => {
        const stageId = apiStage.id;
        
        // Get customers from CACHE (local state) - this is the source of truth
        // If cache is empty, fallback to props (initial load)
        let customers = cachedCustomersByStage.get(stageId) || [];
        
        // If cache is empty for this stage, try to get from props (initial load only)
        if (customers.length === 0 && stages) {
          const pipelineStage = stages.find(
            (ps) =>
              ps.id === stageId ||
              ps.stage_id === stageId ||
              ps.id?.toString() === stageId.toString()
          );
          customers = pipelineStage?.customers ? (pipelineStage.customers as any as UnifiedCustomer[]) : [];
        }
        
        return {
          id: apiStage.id,
          nameAr: apiStage.stage_name_ar,
          nameEn: apiStage.stage_name_en,
          color: apiStage.color,
          order: apiStage.order,
          customers: customers,
          customerCount: customers.length,
        };
      });
  }, [apiStages, cachedCustomersByStage, stages]);

  // Get all customers from all stages - uses CACHE as source of truth
  const allCustomers = useMemo(() => {
    return displayStages.flatMap((stage) =>
      (stage.customers || []).map((customer) => ({
        ...customer,
        stageId: stage.id,
        stageName: stage.nameAr,
        stageColor: stage.color,
      }))
    );
  }, [displayStages]);

  // Filter by stage
  const filteredCustomers =
    selectedStageFilter === "all"
      ? allCustomers
      : allCustomers.filter(
          (c) => c.stageId?.toString() === selectedStageFilter
        );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "name":
        aValue = a.name || "";
        bValue = b.name || "";
        break;
      case "stage":
        aValue = a.stageName || "";
        bValue = b.stageName || "";
        break;
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case "dealValue":
        aValue = a.totalDealValue || 0;
        bValue = b.totalDealValue || 0;
        break;
      case "lastContact":
        aValue = a.lastContactAt
          ? new Date(a.lastContactAt).getTime()
          : 0;
        bValue = b.lastContactAt
          ? new Date(b.lastContactAt).getTime()
          : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

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
    const variants: Record<string, { variant: any; icon: string }> = {
      urgent: {
        variant: "destructive",
        icon: "🚨",
      },
      high: {
        variant: "default",
        icon: "🔥",
      },
      medium: {
        variant: "secondary",
        icon: "⚡",
      },
      low: {
        variant: "outline",
        icon: "📌",
      },
    };
    const key = priority || "medium";
    const variantConfig = variants[key] || variants.medium;
    const priorityConfigEntry =
      priorityConfig[key as keyof typeof priorityConfig] ?? priorityConfig.medium;
    return (
      <Badge variant={variantConfig.variant as any} className="text-xs gap-1">
        {variantConfig.icon} {priorityConfigEntry.label}
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
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
    <div className="space-y-4" dir="rtl">
      {/* Filters and Stats */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Stage Filter */}
            <div className="flex items-center gap-3 flex-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select
                value={selectedStageFilter}
                onValueChange={setSelectedStageFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">جميع المراحل</SelectItem>
                    {displayStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.nameAr}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {sortedCustomers.length}
                </div>
                <div className="text-xs text-gray-500">إجمالي العملاء</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">
                  {formatCurrency(
                    sortedCustomers.reduce(
                      (sum, c) => sum + (c.totalDealValue || 0),
                      0
                    )
                  )}
                </div>
                <div className="text-xs text-gray-500">القيمة الإجمالية</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="w-12">
                    <div className="flex items-center justify-center">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">👤</AvatarFallback>
                      </Avatar>
                    </div>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("name")}
                    >
                      العميل
                      <SortIcon field="name" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("stage")}
                    >
                      المرحلة
                      <SortIcon field="stage" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("priority")}
                    >
                      الأولوية
                      <SortIcon field="priority" />
                    </Button>
                  </TableHead>
                  <TableHead>المصدر</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("dealValue")}
                    >
                      قيمة الصفقة
                      <SortIcon field="dealValue" />
                    </Button>
                  </TableHead>
                  <TableHead>الموظف المسؤول</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("lastContact")}
                    >
                      آخر تواصل
                      <SortIcon field="lastContact" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Building className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">لا توجد عملاء متطابقة</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedCustomers.map((customer, index) => {
                    const isMoving = movingCustomer === customer.id.toString();
                    
                    // Generate extremely unique key combining multiple random elements
                    const random1 = Math.random().toString(36).substring(2, 15);
                    const random2 = Math.random().toString(36).substring(2, 15);
                    const random3 = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    const timestamp = performance.now().toString(36);
                    const uniqueKey = `${customer.id}-${customer.stageId}-${index}-${random1}-${random2}-${random3}-${timestamp}`;
                    
                    return (
                      <TableRow
                        key={uniqueKey}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* Avatar */}
                        <TableCell>
                          <Avatar
                            className="h-10 w-10 mx-auto ring-2"
                            style={{
                              "--ring-color": customer.stageColor || "#gray",
                            } as React.CSSProperties}
                          >
                            <AvatarFallback
                              className="text-white text-sm font-bold"
                              style={{
                                backgroundColor: customer.stageColor || "#gray",
                              }}
                            >
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>

                        {/* Customer Name & Phone */}
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {customer.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          </div>
                        </TableCell>

                        {/* Stage */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs border-2"
                            style={{
                              borderColor: customer.stageColor,
                              color: customer.stageColor,
                            }}
                          >
                            {customer.stageName}
                          </Badge>
                        </TableCell>

                        {/* Priority */}
                        <TableCell>{getPriorityBadge(customer.priority)}</TableCell>

                        {/* Source */}
                        <TableCell>{getSourceBadge(customer.source)}</TableCell>

                        {/* Deal Value */}
                        <TableCell>
                          {customer.totalDealValue ? (
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(customer.totalDealValue)}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>

                        {/* Assigned Employee */}
                        <TableCell>
                          {customer.assignedEmployee ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {customer.assignedEmployee.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">غير محدد</span>
                          )}
                        </TableCell>

                        {/* Last Contact */}
                        <TableCell>
                          {customer.lastContactAt ? (
                            <div className="text-sm">
                              {new Date(customer.lastContactAt).toLocaleDateString(
                                "ar-SA",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/ar/dashboard/customers-hub/${customer.id}`}
                            >
                              <Button variant="ghost" size="sm" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Select
                              value={customer.stageId?.toString() || ""}
                              onValueChange={(newStageId: string) => {
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
                                className="w-32 h-8 text-xs"
                                disabled={isMoving}
                              >
                                <SelectValue>
                                  {customer.stageName || "نقل"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {displayStages.map((s) => (
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
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
