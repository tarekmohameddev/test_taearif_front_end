"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
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
  Phone,
  User,
  Building,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Building2,
  MapPin,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CustomerAction, UnifiedCustomer, Priority } from "@/types/unified-customer";
import { getStageColor, getStageNameAr } from "@/types/unified-customer";

interface TableRequestsListProps {
  actions: CustomerAction[];
  getCustomerById: (id: string) => UnifiedCustomer | undefined;
  selectedActionIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string, until: string) => void;
  onAddNote: (id: string, note: string) => void;
  onQuickView: (id: string) => void;
  stages?: Array<{
    stage_id: string;
    stage_name_ar: string;
    stage_name_en: string;
    color: string;
    order: number;
  }>;
  completingActionIds: Set<string>;
}

type SortField = "customer" | "type" | "priority" | "status" | "dueDate" | "createdAt" | "budget" | "propertyType" | "city" | "stage";
type SortOrder = "asc" | "desc";

/** Translate property type from English to Arabic */
const translatePropertyType = (propertyType: string | null | undefined): string => {
  if (!propertyType) return '';
  const translations: { [key: string]: string } = {
    Residential: "سكني",
    Industrial: "صناعي",
    Agricultural: "زراعي",
    Commercial: "تجاري",
  };
  return translations[propertyType] || propertyType;
};

export function TableRequestsList({
  actions,
  getCustomerById,
  selectedActionIds,
  onSelect,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  stages,
  completingActionIds,
}: TableRequestsListProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityBadge = (priority?: Priority) => {
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new_inquiry: "استفسار جديد",
      callback_request: "طلب اتصال",
      property_match: "عقار متطابق",
      follow_up: "متابعة",
      document_required: "مستندات مطلوبة",
      payment_due: "دفعة مستحقة",
      site_visit: "زيارة موقع",
      whatsapp_incoming: "رسالة واتساب",
      ai_recommended: "توصية ذكية",
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; text: string }> = {
      pending: { variant: "secondary", text: "قيد الانتظار" },
      in_progress: { variant: "default", text: "قيد التنفيذ" },
      completed: { variant: "outline", text: "مكتمل" },
      dismissed: { variant: "outline", text: "ملغي" },
      snoozed: { variant: "outline", text: "مؤجل" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant as any} className="text-xs">
        {config.text}
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

  const handleComplete = async (actionId: string) => {
    setLoadingActions((prev) => new Set(prev).add(actionId));
    const toastId = toast.loading("جاري إتمام الطلب...");
    try {
      const result = onComplete(actionId);
      // Handle both sync and async functions
      if (result instanceof Promise) {
        await result;
      }
      toast.success("تم إتمام الطلب بنجاح", { id: toastId });
    } catch (err: any) {
      console.error("Error completing action:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "حدث خطأ أثناء إتمام الطلب";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  const handleDismiss = async (actionId: string) => {
    setLoadingActions((prev) => new Set(prev).add(actionId));
    const toastId = toast.loading("جاري رفض الطلب...");
    try {
      const result = onDismiss(actionId);
      // Handle both sync and async functions
      if (result instanceof Promise) {
        await result;
      }
      toast.success("تم رفض الطلب بنجاح", { id: toastId });
    } catch (err: any) {
      console.error("Error dismissing action:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "حدث خطأ أثناء رفض الطلب";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  const handleSnooze = async (actionId: string, until: string) => {
    setLoadingActions((prev) => new Set(prev).add(actionId));
    const toastId = toast.loading("جاري تأجيل الطلب...");
    try {
      const result = onSnooze(actionId, until);
      // Handle both sync and async functions
      if (result instanceof Promise) {
        await result;
      }
      toast.success("تم تأجيل الطلب بنجاح", { id: toastId });
    } catch (err: any) {
      console.error("Error snoozing action:", err);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء تأجيل الطلب",
        { id: toastId }
      );
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  const handleAddNote = async (actionId: string, note: string) => {
    setLoadingActions((prev) => new Set(prev).add(actionId));
    const toastId = toast.loading("جاري إضافة الملاحظة...");
    try {
      const result = onAddNote(actionId, note);
      // Handle both sync and async functions
      if (result instanceof Promise) {
        await result;
      }
      toast.success("تم إضافة الملاحظة بنجاح", { id: toastId });
    } catch (err: any) {
      console.error("Error adding note:", err);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء إضافة الملاحظة",
        { id: toastId }
      );
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  // Sort actions
  const sortedActions = [...actions].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "customer":
        aValue = a.customerName || "";
        bValue = b.customerName || "";
        break;
      case "type":
        aValue = a.type || "";
        bValue = b.type || "";
        break;
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      case "dueDate":
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case "createdAt":
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        break;
      case "budget":
        aValue = (a as any).budgetMin ?? (a as any).budgetMax ?? 0;
        bValue = (b as any).budgetMin ?? (b as any).budgetMax ?? 0;
        break;
      case "propertyType":
        aValue = translatePropertyType((a as any).propertyType) || "";
        bValue = translatePropertyType((b as any).propertyType) || "";
        break;
      case "city":
        aValue = (a as any).city || "";
        bValue = (b as any).city || "";
        break;
      case "stage":
        aValue = (a as any).stage?.nameAr || (a as any).stage_id || "";
        bValue = (b as any).stage?.nameAr || (b as any).stage_id || "";
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  if (actions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">لا توجد طلبات في هذا القسم</p>
          <p className="text-sm mt-1">ستظهر الطلبات هنا عند ورودها</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={sortedActions.length > 0 && sortedActions.every((a) => selectedActionIds.has(a.id))}
                      onChange={(e) => {
                        sortedActions.forEach((action) => {
                          onSelect(action.id, e.target.checked);
                        });
                      }}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
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
                      onClick={() => handleSort("customer")}
                    >
                      العميل
                      <SortIcon field="customer" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("type")}
                    >
                      نوع الطلب
                      <SortIcon field="type" />
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
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("status")}
                    >
                      الحالة
                      <SortIcon field="status" />
                    </Button>
                  </TableHead>
                  <TableHead>المصدر</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("dueDate")}
                    >
                      تاريخ الاستحقاق
                      <SortIcon field="dueDate" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("createdAt")}
                    >
                      تاريخ الإنشاء
                      <SortIcon field="createdAt" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("budget")}
                    >
                      الميزانية
                      <SortIcon field="budget" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("propertyType")}
                    >
                      نوع العقار
                      <SortIcon field="propertyType" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2"
                      onClick={() => handleSort("city")}
                    >
                      المدينة
                      <SortIcon field="city" />
                    </Button>
                  </TableHead>
                  <TableHead>الجدية</TableHead>
                  <TableHead>الموظف المسؤول</TableHead>
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
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedActions.map((action) => {
                  const customer = getCustomerById(action.customerId);
                  const isCompleting = completingActionIds.has(action.id);
                  const isSelected = selectedActionIds.has(action.id);
                  const isOverdue = action.dueDate
                    ? new Date(action.dueDate) < new Date() && action.status !== "completed"
                    : false;
                  const isLoading = loadingActions.has(action.id) || isCompleting;

                  return (
                    <TableRow
                      key={action.id}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                        isOverdue && "bg-red-50 dark:bg-red-950/20"
                      )}
                    >
                      {/* Checkbox */}
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelect(action.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>

                      {/* Avatar */}
                      <TableCell>
                        <Avatar
                          className="h-10 w-10 mx-auto ring-2 ring-offset-2"
                          style={{
                            ringColor: customer?.stage
                              ? stages?.find((s) => s.stage_id === customer.stage)?.color || "#gray"
                              : "#gray",
                          }}
                        >
                          <AvatarFallback
                            className="text-white text-sm font-bold"
                            style={{
                              backgroundColor: customer?.stage
                                ? stages?.find((s) => s.stage_id === customer.stage)?.color || "#gray"
                                : "#gray",
                            }}
                          >
                            {getInitials(action.customerName)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      {/* Customer Name & Phone */}
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {action.customerName}
                          </span>
                          {(action.customerPhone || customer?.phone) && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="h-3 w-3 shrink-0" />
                              <a
                                href={`tel:${action.customerPhone || customer?.phone}`}
                                className="hover:text-blue-600 dir-ltr"
                                dir="ltr"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {action.customerPhone || customer?.phone}
                              </a>
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(action.type)}
                        </Badge>
                      </TableCell>

                      {/* Priority */}
                      <TableCell>{getPriorityBadge(action.priority)}</TableCell>

                      {/* Status */}
                      <TableCell>{getStatusBadge(action.status)}</TableCell>

                      {/* Source */}
                      <TableCell>{getSourceBadge(action.source)}</TableCell>

                      {/* Due Date */}
                      <TableCell>
                        {action.dueDate ? (
                          <div className="text-sm">
                            {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            {isOverdue && (
                              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                متأخر
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Created At */}
                      <TableCell>
                        {action.createdAt ? (
                          <div className="text-sm">
                            {new Date(action.createdAt).toLocaleDateString("ar-SA", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Budget */}
                      <TableCell>
                        {(action as any).budgetMin != null || (action as any).budgetMax != null ? (
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                            <span>
                              {(action as any).budgetMin != null && (action as any).budgetMax != null && (action as any).budgetMin !== (action as any).budgetMax
                                ? `${(action as any).budgetMin.toLocaleString("en-US")}–${(action as any).budgetMax.toLocaleString("en-US")} ر.س`
                                : (action as any).budgetMin != null
                                  ? `${(action as any).budgetMin.toLocaleString("en-US")} ر.س`
                                  : (action as any).budgetMax != null
                                    ? `${(action as any).budgetMax.toLocaleString("en-US")} ر.س`
                                    : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Property Type */}
                      <TableCell>
                        {(action as any).propertyType ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-gray-500" />
                            <Badge variant="outline" className="text-xs">
                              {translatePropertyType((action as any).propertyType)}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* City */}
                      <TableCell>
                        {(action as any).city ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            <span>{(action as any).city}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Seriousness */}
                      <TableCell>
                        {(action as any).metadata?.seriousness ? (
                          <div className="flex items-center gap-1 text-sm">
                            <AlertTriangle className="h-3.5 w-3.5 text-gray-500" />
                            <span>{(action as any).metadata.seriousness}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Assigned Employee */}
                      <TableCell>
                        {(action as any).assignedToName ? (
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            <span>{(action as any).assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Stage */}
                      <TableCell>
                        {(() => {
                          // Get stage from action.stage object or action.stage_id
                          let stageId: string | number | null = null;
                          let stageNameAr: string | null = null;
                          
                          if ((action as any).stage) {
                            // If stage is an object, extract id or stage_id
                            const stageObj = (action as any).stage;
                            stageId = stageObj.id || stageObj.stage_id || null;
                            stageNameAr = stageObj.nameAr || null;
                          } else if ((action as any).stage_id) {
                            // If stage_id is directly available
                            stageId = (action as any).stage_id;
                          }
                          
                          // Find stage in stages array
                          let matchedStage = null;
                          if (stageId != null && stages) {
                            // Try to match by numeric id first
                            if (typeof stageId === 'number') {
                              matchedStage = stages.find((s: any) => s.id === stageId || s.numericId === stageId);
                            }
                            // If not found, try to match by string stage_id
                            if (!matchedStage) {
                              matchedStage = stages.find((s: any) => s.stage_id === String(stageId));
                            }
                          }
                          
                          const displayName = stageNameAr || matchedStage?.stage_name_ar || "-";
                          const stageColor = matchedStage?.color || "#gray";
                          
                          if (displayName !== "-") {
                            return (
                              <Badge
                                variant="outline"
                                className="text-xs flex items-center gap-1 w-fit"
                                style={{
                                  borderColor: stageColor,
                                  color: stageColor,
                                }}
                              >
                                <span
                                  className="size-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: stageColor }}
                                  aria-hidden
                                />
                                {displayName}
                              </Badge>
                            );
                          }
                          return <span className="text-gray-400 text-sm">-</span>;
                        })()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => onQuickView(action.id)}
                            disabled={isLoading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-green-600 hover:text-green-700"
                            onClick={() => handleComplete(action.id)}
                            disabled={isLoading}
                          >
                            {isLoading && action.status !== "completed" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDismiss(action.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
