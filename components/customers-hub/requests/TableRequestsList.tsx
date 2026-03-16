"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Phone,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  X,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Building2,
  MapPin,
  MoreVertical,
  Calendar,
  Bell,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SourceBadge } from "../actions/SourceBadge";
import { CompactPropertyBlockStitch } from "../actions/components/IncomingActionsCardCompact";
import { translatePropertyType } from "../actions/utils/propertyUtils";
import { cn } from "@/lib/utils";
import type { CustomerAction, UnifiedCustomer, Priority } from "@/types/unified-customer";
import { getPropertyRequestId } from "./request-detail-types";

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
  onPriorityClick?: (action: CustomerAction) => void;
  stages?: Array<{
    stage_id: string;
    stage_name_ar: string;
    stage_name_en: string;
    color: string;
    order: number;
  }>;
  completingActionIds: Set<string>;
}

type SortField = "customer" | "priority" | "status" | "createdAt" | "budget" | "propertyType" | "city" | "stage";
type SortOrder = "asc" | "desc";

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
  onPriorityClick,
  stages,
  completingActionIds,
}: TableRequestsListProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [snoozeActionId, setSnoozeActionId] = useState<string | null>(null);
  const [snoozeDate, setSnoozeDate] = useState("");
  const [snoozeTime, setSnoozeTime] = useState("10:00");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getPriorityBadge = (priority?: Priority) => {
    const variants: Record<string, { variant: any; text: string }> = {
      urgent: {
        variant: "destructive",
        text: "عاجل",
      },
      high: {
        variant: "default",
        text: "عالي",
      },
      medium: {
        variant: "secondary",
        text: "متوسط",
      },
      low: {
        variant: "outline",
        text: "منخفض",
      },
    };
    const config = variants[priority || "medium"] || variants.medium;
    return (
      <Badge variant={config.variant as any} className="text-xs">
        {config.text}
      </Badge>
    );
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
      <Badge
        variant={config.variant as any}
        className="text-[10px] px-1.5 py-0.5 leading-tight"
      >
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
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
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

  const handleSnoozeConfirm = () => {
    if (!snoozeActionId || !snoozeDate) return;
    const until = new Date(`${snoozeDate}T${snoozeTime}`).toISOString();
    handleSnooze(snoozeActionId, until);
    setSnoozeActionId(null);
    setSnoozeDate("");
    setSnoozeTime("10:00");
  };

  const handleRowClick =
    (actionId: string) => (e: React.MouseEvent<HTMLTableRowElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="checkbox"], input, [data-interactive]')) {
        return;
      }
      router.push(`/ar/dashboard/customers-hub/requests/${actionId}`);
    };

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
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-2xl">
            <Table>
              <TableHeader className="bg-gray-900 text-white">
                <TableRow>
                  <TableHead className="w-12 bg-transparent">
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
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("customer")}
                    >
                      العميل
                      <SortIcon field="customer" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("priority")}
                    >
                      الأولوية
                      <SortIcon field="priority" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-white bg-transparent">المصدر</TableHead>
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("createdAt")}
                    >
                       وقت الإنشاء
                      <SortIcon field="createdAt" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("budget")}
                    >
                      الميزانية
                      <SortIcon field="budget" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("propertyType")}
                    >
                      نوع العقار
                      <SortIcon field="propertyType" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("city")}
                    >
                      الموقع
                      <SortIcon field="city" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-white bg-transparent">تفاصيل العقار</TableHead>
                  <TableHead className="text-right text-white bg-transparent">الموظف المسؤول</TableHead>
                  <TableHead className="text-right text-white bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mr-2 text-white hover:text-white hover:bg-transparent"
                      onClick={() => handleSort("stage")}
                    >
                      المرحلة
                      <SortIcon field="stage" />
                    </Button>
                  </TableHead>
                  {/* Removed actions column */}
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
                      onClick={handleRowClick(action.id)}
                      className={cn(
                        "transition-colors cursor-pointer",
                        isOverdue && "bg-red-50 dark:bg-red-950/20"
                      )}
                    >
                      {/* Checkbox */}
                      <TableCell className="text-right">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelect(action.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>

                      {/* Customer Name, Phone & Status */}
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-1">
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
                          <div>
                            {getStatusBadge(action.status)}
                          </div>
                        </div>
                      </TableCell>

                      {/* Priority */}
                      <TableCell className="text-right">
                        {onPriorityClick && getPropertyRequestId(action) != null ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPriorityClick(action);
                            }}
                            className="focus:outline-none text-right cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {getPriorityBadge(action.priority)}
                          </button>
                        ) : (
                          getPriorityBadge(action.priority)
                        )}
                      </TableCell>

                      {/* Source */}
                      <TableCell className="text-right">
                        <SourceBadge source={action.source} className="text-xs" />
                      </TableCell>

                      {/* Created At (Date & Time) */}
                      <TableCell className="text-right">
                        {action.createdAt ? (
                          <div className="text-sm leading-tight">
                            <div>
                              {new Date(action.createdAt).toLocaleDateString("ar-SA", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(action.createdAt).toLocaleTimeString("ar-SA", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* Budget */}
                      <TableCell className="text-right">
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

                      {/* Property Type / Category - translated */}
                      <TableCell className="text-right">
                        {(() => {
                          const raw = (action as any).propertyType ?? (action as any).propertyCategory ?? (action as any).property_type;
                          const translated = raw ? translatePropertyType(raw) : null;
                          return translated ? (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                              <Badge variant="outline" className="text-xs">
                                {translated}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          );
                        })()}
                      </TableCell>

                      {/* City & District */}
                      <TableCell>
                        {(() => {
                          const rawCity =
                            (action as any).city ??
                            (action as any).region ??
                            (action as any).state ??
                            (action as any).properties?.[0]?.city;
                          const district =
                            (action as any).district ??
                            (action as any).properties?.[0]?.district;

                          if (!rawCity && !district) {
                            return <span className="text-gray-400 text-sm">-</span>;
                          }

                          return (
                            <div className="flex items-start gap-1 text-sm">
                              <MapPin className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                              <div className="flex flex-col">
                                {rawCity && (
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {rawCity}
                                  </span>
                                )}
                                {district && (
                                  <span className="text-xs text-gray-500">{district}</span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </TableCell>

                      {/* Property details (same as compact view) */}
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {action.properties?.length ? (
                          <CompactPropertyBlockStitch
                            action={action}
                            useLast={action.objectType === "property_request"}
                          />
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

                      {/* Actions column removed */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Snooze dialog for table row */}
      <Dialog open={!!snoozeActionId} onOpenChange={(open) => { if (!open) { setSnoozeActionId(null); setSnoozeDate(""); setSnoozeTime("10:00"); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تأجيل الطلب</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="snooze-date">التاريخ</Label>
              <Input
                id="snooze-date"
                type="date"
                value={snoozeDate}
                onChange={(e) => setSnoozeDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="snooze-time">الوقت</Label>
              <Input
                id="snooze-time"
                type="time"
                value={snoozeTime}
                onChange={(e) => setSnoozeTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => { setSnoozeActionId(null); setSnoozeDate(""); setSnoozeTime("10:00"); }}>
                إلغاء
              </Button>
              <Button onClick={handleSnoozeConfirm} disabled={!snoozeDate}>
                تأكيد التأجيل
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
