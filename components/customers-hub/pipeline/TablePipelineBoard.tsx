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
import type { PipelineStage } from "@/lib/services/customers-hub-pipeline-api";
import type { MoveCustomerParams } from "@/lib/services/customers-hub-pipeline-api";
import type { Stage } from "@/lib/services/customers-hub-stages-api";

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleMoveCustomer = async (
    customerId: string | number,
    newStageId: number
  ) => {
    if (!props?.onMoveCustomer) return;

    setMovingCustomer(customerId.toString());
    try {
      const requestId =
        typeof customerId === "number"
          ? customerId
          : parseInt(customerId.toString());

      await props.onMoveCustomer({
        requestId,
        newStageId,
      });
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
              customerCount: pipelineStage?.count || 0,
            };
          })
      : [];

  // Get all customers from all stages
  const allCustomers = displayStages.flatMap((stage) =>
    (stage.customers || []).map((customer) => ({
      ...customer,
      stageId: stage.id,
      stageName: stage.nameAr,
      stageColor: stage.color,
    }))
  );

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
    const variants: Record<string, { variant: any; text: string; icon: string }> = {
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
        {config.icon} {config.text}
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
                  sortedCustomers.map((customer) => {
                    const isMoving = movingCustomer === customer.id.toString();
                    
                    return (
                      <TableRow
                        key={customer.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* Avatar */}
                        <TableCell>
                          <Avatar
                            className="h-10 w-10 mx-auto ring-2"
                            style={{
                              ringColor: customer.stageColor || "#gray",
                            }}
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
                              value=""
                              onValueChange={(newStageId: string) => {
                                handleMoveCustomer(
                                  customer.id,
                                  parseInt(newStageId)
                                );
                              }}
                              disabled={isMoving}
                            >
                              <SelectTrigger
                                className="w-32 h-8 text-xs"
                                disabled={isMoving}
                              >
                                <SelectValue placeholder="نقل" />
                              </SelectTrigger>
                              <SelectContent>
                                {displayStages
                                  .filter((s) => s.id !== customer.stageId)
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
