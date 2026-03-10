"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SourceBadge } from "../SourceBadge";
import { StageDropdown } from "./StageDropdown";
import { AssignEmployeeDialog } from "./AssignEmployeeDialog";
import { ScheduleAppointmentForm } from "./ScheduleAppointmentForm";
import { SnoozeFormInline } from "./SnoozeFormInline";
import {
  priorityStitchLabels,
  priorityStitchPillClass,
  NEXT_ACTION_LABEL,
  PURCHASE_METHOD_SALE_VALUES,
  PURCHASE_METHOD_RENT_VALUES,
} from "../constants/incomingCardConstants";
import { formatNextActionDatetime } from "../utils/dateTimeUtils";
import {
  MapPin,
  Home,
  Maximize2,
  MoreVertical,
  CheckCircle,
  Calendar,
  Bell,
  UserPlus,
  X,
  CalendarDays,
  Phone,
  FileText,
  Handshake,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { CustomerLifecycleStage } from "@/types/unified-customer";
import type { StageOption, AIMatchingStatus, EmployeeOption } from "../types/incomingCardTypes";

/** Appointment/reminder type to Arabic label for next-action block (from API data) */
const nextActionLabelByType: Record<string, string> = {
  site_visit: "موعد معاينة",
  office_meeting: "اجتماع مكتب",
  phone_call: "اتصال متابعة",
  video_call: "مكالمة فيديو",
  contract_signing: "جلسة تفاوض",
  other: "أخرى",
  follow_up: "متابعة",
  document: "مستند",
  payment: "دفع",
  viewing: "معاينة",
  general: "إجراء",
};

function getNextActionDisplay(action: CustomerAction): {
  title: string;
  datetime: string;
  iconType: "event" | "call" | "handshake" | "mail" | "generic";
} | null {
  const items: { datetime: string; title: string; type?: string; iconType: "event" | "call" | "handshake" | "mail" | "generic" }[] = [];
  (action.appointments ?? []).forEach((apt) => {
    const dt = apt.datetime ?? (apt.date && apt.time ? `${apt.date}T${apt.time}` : undefined);
    if (dt) {
      const type = apt.type ?? "";
      const title = apt.title ?? nextActionLabelByType[type] ?? "موعد";
      let iconType: "event" | "call" | "handshake" | "mail" | "generic" = "generic";
      if (type === "site_visit" || type === "office_meeting" || type === "viewing") iconType = "event";
      else if (type === "phone_call" || type === "video_call" || type === "follow_up") iconType = "call";
      else if (type === "contract_signing") iconType = "handshake";
      else if (type === "other") iconType = "mail";
      items.push({ datetime: dt, title, type, iconType });
    }
  });
  (action.reminders ?? []).forEach((rem) => {
    const dt = (rem as { datetime?: string }).datetime;
    if (dt) {
      const type = (rem as { type?: string }).type ?? "";
      const title = rem.title ?? nextActionLabelByType[type] ?? "تذكير";
      let iconType: "event" | "call" | "handshake" | "mail" | "generic" = "generic";
      if (type === "viewing") iconType = "event";
      else if (type === "follow_up") iconType = "call";
      else if (type === "document" || type === "payment") iconType = "mail";
      items.push({ datetime: dt, title, type, iconType });
    }
  });
  if (action.dueDate) {
    items.push({
      datetime: action.dueDate,
      title: "موعد",
      iconType: "event",
    });
  }
  if (items.length === 0) return null;
  items.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const first = items[0];
  return { title: first.title, datetime: first.datetime, iconType: first.iconType };
}

function getPurchaseMethodBadge(purchaseMethod: string | null | undefined): "sale" | "rent" | null {
  if (!purchaseMethod) return null;
  const v = String(purchaseMethod).trim().toLowerCase();
  if (PURCHASE_METHOD_SALE_VALUES.some((s) => s.toLowerCase() === v)) return "sale";
  if (PURCHASE_METHOD_RENT_VALUES.some((s) => s.toLowerCase() === v)) return "rent";
  return null;
}

export interface IncomingActionsCardFullProps {
  action: CustomerAction;
  resolvedCustomer: UnifiedCustomer | undefined;
  customerIdForLink: string | null;
  isOverdue: boolean;
  isSelected: boolean;
  showCheckbox: boolean;
  className?: string;
  displayStage: CustomerLifecycleStage;
  availableStages: StageOption[];
  isUpdatingStage: boolean;
  onStageChange: (s: CustomerLifecycleStage) => void;
  aiMatching: AIMatchingStatus;
  onSelect?: (actionId: string, selected: boolean) => void;
  onQuickView?: (actionId: string) => void;
  onCardClick: (e: React.MouseEvent) => void;
  showScheduleForm: boolean;
  setShowScheduleForm: (v: boolean) => void;
  showAssignEmployeeDialog: boolean;
  setShowAssignEmployeeDialog: (v: boolean) => void;
  scheduleForm: {
    aptType: import("@/types/unified-customer").Appointment["type"];
    setAptType: (v: import("@/types/unified-customer").Appointment["type"]) => void;
    aptDate: string;
    setAptDate: (v: string) => void;
    aptTime: string;
    setAptTime: (v: string) => void;
    aptNotes: string;
    setAptNotes: (v: string) => void;
    handleScheduleSubmit: (e: React.FormEvent) => void;
    resetScheduleForm: () => void;
    isSubmittingApt: boolean;
  };
  assignEmployee: {
    employees: EmployeeOption[];
    selectedEmployeeId: number | null;
    setSelectedEmployeeId: (v: number | null) => void;
    loadingEmployees: boolean;
    savingEmployee: boolean;
    handleAssignEmployee: () => Promise<void>;
  };
  getStageColor: (id: string) => string;
  getStageNameAr: (id: string) => string;
  onComplete?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
  onSnooze?: (actionId: string, until: string) => void;
  isCompleting?: boolean;
  showSnoozeForm?: boolean;
  setShowSnoozeForm?: (v: boolean) => void;
  snoozeForm?: { snoozeDate: string; setSnoozeDate: (v: string) => void; snoozeTime: string; setSnoozeTime: (v: string) => void };
}

export function IncomingActionsCardFull({
  action,
  resolvedCustomer,
  customerIdForLink,
  isSelected,
  showCheckbox,
  className,
  displayStage,
  availableStages,
  isUpdatingStage,
  onStageChange,
  onSelect,
  onCardClick,
  showScheduleForm,
  setShowScheduleForm,
  showAssignEmployeeDialog,
  setShowAssignEmployeeDialog,
  scheduleForm,
  assignEmployee,
  getStageColor,
  getStageNameAr,
  onComplete,
  onDismiss,
  onSnooze,
  isCompleting = false,
  showSnoozeForm,
  setShowSnoozeForm,
  snoozeForm,
}: IncomingActionsCardFullProps) {
  const propertyImage = action.properties?.[0]?.featuredImage;
  const purchaseBadge = useMemo(
    () => getPurchaseMethodBadge(action.purchase_method),
    [action.purchase_method]
  );
  const nextAction = useMemo(() => getNextActionDisplay(action), [action]);

  const locationLine = useMemo(() => {
    const parts: string[] = [];
    if (action.city) parts.push(action.city);
    if (action.state) parts.push(action.state);
    if (action.region) parts.push(action.region);
    if (parts.length) return parts.join("، ");
    const addr = action.properties?.[0]?.address;
    return addr ?? null;
  }, [action.city, action.state, action.region, action.properties]);

  const categoryLabel = action.propertyCategory ?? action.property_type ?? null;
  const areaLabel = useMemo(() => {
    const from = action.area_from;
    const to = action.area_to;
    if (from != null && to != null && from !== to) return `${from}–${to} م²`;
    if (from != null) return `${from} م²`;
    if (to != null) return `${to} م²`;
    return null;
  }, [action.area_from, action.area_to]);

  const NextActionIcon =
    nextAction?.iconType === "event"
      ? CalendarDays
      : nextAction?.iconType === "call"
        ? Phone
        : nextAction?.iconType === "handshake"
          ? Handshake
          : nextAction?.iconType === "mail"
            ? Mail
            : FileText;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden bg-white dark:bg-slate-900 cursor-pointer h-full",
        isSelected && "ring-2 ring-primary bg-primary/5 dark:bg-primary/10",
        className
      )}
      onClick={onCardClick}
    >
      {/* Image section: property image from API only; no static placeholder image */}
      <div className="relative h-48 shrink-0">
        {propertyImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${propertyImage})` }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" aria-hidden />
        )}
        {/* Purchase method badge: only when API returns it */}
        {purchaseBadge && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider text-white",
                purchaseBadge === "sale" && "bg-primary",
                purchaseBadge === "rent" && "bg-green-500"
              )}
            >
              {purchaseBadge === "sale" ? "للبيع" : "للإيجار"}
            </span>
          </div>
        )}
        {showCheckbox && (
          <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()} data-interactive="true">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(c) => onSelect?.(action.id, c as boolean)}
              className="w-5 h-5 rounded border-white/50 bg-black/20 text-primary focus:ring-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        )}
      </div>

      {/* Content: all from API */}
      <div className="p-5 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0">
            {action.customerName ? (
              customerIdForLink ? (
                <Link
                  href={`/ar/dashboard/customers-hub/${customerIdForLink}`}
                  className="font-bold text-lg leading-tight hover:text-primary transition-colors block truncate"
                  data-interactive="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  {action.customerName}
                </Link>
              ) : (
                <h3 className="font-bold text-lg leading-tight truncate">{action.customerName}</h3>
              )
            ) : null}
            {(action.customerPhone ?? resolvedCustomer?.phone) && (
              <a
                href={`tel:${action.customerPhone ?? resolvedCustomer?.phone}`}
                className="text-slate-400 text-sm font-medium mt-1 ltr:text-left truncate block hover:text-primary transition-colors"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                {action.customerPhone ?? resolvedCustomer?.phone}
              </a>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()} data-interactive="true">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onComplete?.(action.id); }} disabled={isCompleting} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  إتمام الطلب
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowScheduleForm(true); }} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  جدولة إجراء
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowSnoozeForm?.(true); }} className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  تأجيل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowAssignEmployeeDialog(true); }} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  تعيين موظف
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDismiss?.(action.id); }} className="flex items-center gap-2 text-red-600 focus:text-red-600">
                  <X className="h-4 w-4" />
                  رفض الطلب
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className={cn("px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1", priorityStitchPillClass[action.priority])}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" aria-hidden />
            {priorityStitchLabels[action.priority]}
          </span>
          <SourceBadge source={action.source} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg" />
          {availableStages.length > 0 && (
            <div onClick={(e) => e.stopPropagation()} data-interactive="true" className="shrink-0">
              <StageDropdown
                availableStages={availableStages}
                displayStage={displayStage}
                isUpdatingStage={isUpdatingStage}
                onStageChange={onStageChange}
                getStageColor={getStageColor}
                getStageNameAr={getStageNameAr}
                stitchStyle
              />
            </div>
          )}
        </div>

        {(locationLine || categoryLabel || areaLabel) && (
          <div className="space-y-2 mb-6 text-sm">
            {locationLine && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{locationLine}</span>
              </div>
            )}
            {(categoryLabel || areaLabel) && (
              <div className="flex items-center gap-4">
                {categoryLabel && (
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Home className="h-4 w-4 shrink-0" />
                    <span>{categoryLabel}</span>
                  </div>
                )}
                {areaLabel && (
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Maximize2 className="h-4 w-4 shrink-0" />
                    <span>{areaLabel}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showSnoozeForm && snoozeForm && (
          <div className="mb-4" onClick={(e) => e.stopPropagation()} data-interactive="true">
            <SnoozeFormInline
              snoozeDate={snoozeForm.snoozeDate}
              snoozeTime={snoozeForm.snoozeTime}
              onDateChange={snoozeForm.setSnoozeDate}
              onTimeChange={snoozeForm.setSnoozeTime}
              onConfirm={() => {
                if (!snoozeForm.snoozeDate) return;
                onSnooze?.(action.id, new Date(`${snoozeForm.snoozeDate}T${snoozeForm.snoozeTime}`).toISOString());
                setShowSnoozeForm?.(false);
                snoozeForm.setSnoozeDate("");
                snoozeForm.setSnoozeTime("10:00");
              }}
              onCancel={() => { setShowSnoozeForm?.(false); snoozeForm.setSnoozeDate(""); snoozeForm.setSnoozeTime("10:00"); }}
              confirmDisabled={!snoozeForm.snoozeDate}
            />
          </div>
        )}

        {showScheduleForm && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-4" onClick={(e) => e.stopPropagation()} data-interactive="true">
            <ScheduleAppointmentForm
              aptType={scheduleForm.aptType}
              aptDate={scheduleForm.aptDate}
              aptTime={scheduleForm.aptTime}
              aptNotes={scheduleForm.aptNotes}
              onAptTypeChange={scheduleForm.setAptType}
              onAptDateChange={scheduleForm.setAptDate}
              onAptTimeChange={scheduleForm.setAptTime}
              onAptNotesChange={scheduleForm.setAptNotes}
              onSubmit={scheduleForm.handleScheduleSubmit}
              onCancel={() => { setShowScheduleForm(false); scheduleForm.resetScheduleForm(); }}
              isSubmitting={scheduleForm.isSubmittingApt}
            />
          </div>
        )}

        {nextAction && (
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-2">{NEXT_ACTION_LABEL}</p>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <NextActionIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{nextAction.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{formatNextActionDatetime(nextAction.datetime)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AssignEmployeeDialog
        open={showAssignEmployeeDialog}
        onOpenChange={setShowAssignEmployeeDialog}
        action={action}
        employees={assignEmployee.employees}
        loadingEmployees={assignEmployee.loadingEmployees}
        selectedEmployeeId={assignEmployee.selectedEmployeeId}
        onSelectedEmployeeChange={assignEmployee.setSelectedEmployeeId}
        onSubmit={assignEmployee.handleAssignEmployee}
        saving={assignEmployee.savingEmployee}
      />
    </div>
  );
}
