"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { StageDropdown } from "./StageDropdown";
import { AssignEmployeeDialog } from "./AssignEmployeeDialog";
import { ScheduleAppointmentForm } from "./ScheduleAppointmentForm";
import { SnoozeFormInline } from "./SnoozeFormInline";
import { priorityStitchLabels, priorityStitchPillClass } from "../constants/incomingCardConstants";
import { formatNextActionDatetime } from "../utils/dateTimeUtils";
import { MessageSquare, Globe, LayoutDashboard, MoreVertical, CheckCircle, Calendar, Bell, UserPlus, X, Home, CalendarDays, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { StageOption, AIMatchingStatus, EmployeeOption } from "../types/incomingCardTypes";
import type { ActionPropertyRow } from "./ActionPropertiesTable";

/** Source config for Stitch-style grey pill (icon + labelEn) */
const sourceStitchConfig: Record<string, { labelEn: string; Icon: typeof MessageSquare }> = {
  whatsapp: { labelEn: "WhatsApp", Icon: MessageSquare },
  manual: { labelEn: "Dashboard", Icon: LayoutDashboard },
  inquiry: { labelEn: "Website", Icon: Globe },
  import: { labelEn: "Import", Icon: LayoutDashboard },
  referral: { labelEn: "Referral", Icon: Globe },
};

function getSourceStitch(source: string | undefined | null) {
  const s = typeof source === "object" && source !== null ? (source as { id?: string }).id : source;
  return sourceStitchConfig[s ?? ""] ?? { labelEn: "—", Icon: Globe };
}

/** Appointment/reminder type to Arabic label and icon for next-action block */
const nextActionLabelByType: Record<string, string> = {
  site_visit: "موعد معاينة",
  office_meeting: "اجتماع مكتب",
  phone_call: "مكالمة متابعة",
  video_call: "مكالمة فيديو",
  contract_signing: "إرسال العقد",
  other: "أخرى",
  follow_up: "متابعة",
  document: "إرسال العقد",
  payment: "دفع",
  viewing: "معاينة",
  general: "إجراء",
};

/** First property: 14x14 image + name + نوع • مساحة • للبيع/للايجار (Stitch style) */
function CompactPropertyBlockStitch({ action }: { action: CustomerAction }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const first = action.properties?.[0] as ActionPropertyRow | undefined;
  if (!first) return null;
  const src = first.featuredImage || null;
  const alt = first.title ?? "";
  const propType = first.propertyType ?? "—";
  const area = first.size ?? (first.area != null ? `${first.area} م²` : "—");
  const listing = first.listingTypeLabel ?? "—";
  const listingAr =
    listing === "sale" || (first.listingType && String(first.listingType).toLowerCase().includes("sale"))
      ? "للبيع"
      : listing === "rent" || (first.listingType && String(first.listingType).toLowerCase().includes("rent"))
        ? "للايجار"
        : listing;

  const handleImageClick = (e: React.MouseEvent) => {
    if (!src) return;
    e.stopPropagation();
    setPopupOpen(true);
  };

  return (
    <>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div
          role={src ? "button" : undefined}
          tabIndex={src ? 0 : undefined}
          onClick={handleImageClick}
          onKeyDown={src ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPopupOpen(true); } } : undefined}
          className={cn(
            "w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800",
            src && "cursor-pointer hover:opacity-90 transition-opacity"
          )}
        >
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; const n = e.currentTarget.nextElementSibling as HTMLElement | null; if (n) n.style.display = "flex"; }} />
          ) : null}
          <div className={cn("w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700", src ? "hidden" : "")} aria-hidden>
            <Home className="h-6 w-6 text-slate-400" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate max-w-[150px] text-slate-900 dark:text-white">{first.title ?? "—"}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{propType}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="tabular-nums">{area}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-primary font-medium">{listingAr}</span>
          </div>
        </div>
      </div>
      {src && (
        <CustomDialog open={popupOpen} onOpenChange={setPopupOpen}>
          <CustomDialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-2 bg-black/90 border-gray-700">
            <CustomDialogClose onClose={() => setPopupOpen(false)} className="absolute top-2 left-2 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-1.5" />
            <div className="relative flex items-center justify-center min-h-[200px]">
              <img src={src} alt={alt} className="max-w-full max-h-[85vh] w-auto h-auto object-contain" onClick={(e) => e.stopPropagation()} />
            </div>
          </CustomDialogContent>
        </CustomDialog>
      )}
    </>
  );
}

/** Next action: icon in circle + title + date (Stitch style) */
function CompactNextActionStitch({
  appointments,
  reminders,
}: {
  appointments: CustomerAction["appointments"];
  reminders: CustomerAction["reminders"];
}) {
  const next = useMemo(() => {
    const items: { datetime?: string; title: string; type?: string; kind: "apt" | "rem" }[] = [];
    (appointments ?? []).forEach((apt) => {
      const dt = apt.datetime ?? (apt.date && apt.time ? `${apt.date}T${apt.time}` : undefined);
      items.push({
        datetime: dt,
        title: apt.title ?? nextActionLabelByType[apt.type ?? ""] ?? "موعد",
        type: apt.type,
        kind: "apt",
      });
    });
    (reminders ?? []).forEach((rem) => {
      items.push({
        datetime: (rem as { datetime?: string }).datetime,
        title: rem.title ?? (rem as { type?: string }).type ? nextActionLabelByType[(rem as { type?: string }).type ?? ""] ?? "تذكير" : "تذكير",
        type: (rem as { type?: string }).type,
        kind: "rem",
      });
    });
    const withDate = items.filter((i) => i.datetime);
    withDate.sort((a, b) => new Date(a.datetime!).getTime() - new Date(b.datetime!).getTime());
    return withDate[0] ?? null;
  }, [appointments, reminders]);

  if (!next) return <div className="w-56 shrink-0" />;

  const isPrimary = next.type === "site_visit" || next.type === "office_meeting";
  const Icon =
    next.type === "site_visit" || next.type === "office_meeting" || next.type === "viewing"
      ? CalendarDays
      : next.type === "phone_call" || next.type === "video_call" || next.type === "follow_up"
        ? Phone
        : FileText;

  return (
    <div className="w-56 shrink-0 flex items-center gap-3 border-r border-slate-100 dark:border-slate-800 pr-6">
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
          isPrimary ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{next.title}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">{formatNextActionDatetime(next.datetime)}</p>
      </div>
    </div>
  );
}

export interface IncomingActionsCardCompactProps {
  action: CustomerAction;
  resolvedCustomer: UnifiedCustomer | undefined;
  customerIdForLink: string | null;
  isOverdue: boolean;
  isSelected: boolean;
  showCheckbox: boolean;
  className?: string;
  displayStage: import("@/types/unified-customer").CustomerLifecycleStage;
  availableStages: StageOption[];
  isUpdatingStage: boolean;
  onStageChange: (s: import("@/types/unified-customer").CustomerLifecycleStage) => void;
  aiMatching: AIMatchingStatus;
  onComplete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSnooze?: (id: string, until: string) => void;
  onSelect?: (actionId: string, selected: boolean) => void;
  isCompleting?: boolean;
  onCardClick: (e: React.MouseEvent) => void;
  showScheduleForm: boolean;
  setShowScheduleForm: (v: boolean) => void;
  showSnoozeForm: boolean;
  setShowSnoozeForm: (v: boolean) => void;
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
  snoozeForm: {
    snoozeDate: string;
    setSnoozeDate: (v: string) => void;
    snoozeTime: string;
    setSnoozeTime: (v: string) => void;
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
}

export function IncomingActionsCardCompact({
  action,
  resolvedCustomer,
  customerIdForLink,
  isOverdue,
  isSelected,
  showCheckbox,
  className,
  displayStage,
  availableStages,
  isUpdatingStage,
  onStageChange,
  onComplete,
  onDismiss,
  onSnooze,
  onSelect,
  isCompleting,
  onCardClick,
  showScheduleForm,
  setShowScheduleForm,
  showSnoozeForm,
  setShowSnoozeForm,
  showAssignEmployeeDialog,
  setShowAssignEmployeeDialog,
  scheduleForm,
  snoozeForm,
  assignEmployee,
  getStageColor,
  getStageNameAr,
}: IncomingActionsCardCompactProps) {
  const sourceStitch = getSourceStitch(action.source);
  const SourceIcon = sourceStitch.Icon;

  return (
    <>
      {/* Stitch card: exact layout from Google Stitch HTML */}
      <div
        className={cn(
          "w-full bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-row flex-wrap items-center gap-4 md:gap-6 hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer",
          isOverdue && "border-red-500/50",
          isSelected && "ring-2 ring-primary bg-primary/5",
          className
        )}
        onClick={onCardClick}
      >
        {/* Checkbox */}
        {showCheckbox && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(c) => onSelect?.(action.id, c as boolean)}
              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              data-interactive="true"
            />
          </div>
        )}

        {/* Customer - w-48 */}
        <div className="w-48 shrink-0 min-w-0">
          {customerIdForLink ? (
            <Link
              href={`/ar/dashboard/customers-hub/${customerIdForLink}`}
              className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors block truncate"
              data-interactive="true"
              onClick={(e) => e.stopPropagation()}
            >
              {action.customerName}
            </Link>
          ) : (
            <p className="font-bold text-slate-900 dark:text-white truncate">{action.customerName}</p>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400 tabular-nums dir-ltr" dir="ltr">
            {(action.customerPhone ?? resolvedCustomer?.phone) ?? "—"}
          </p>
        </div>

        {/* Priority - w-24 */}
        <div className="w-24 shrink-0">
          <span className={cn("inline-block", priorityStitchPillClass[action.priority])}>
            {priorityStitchLabels[action.priority]}
          </span>
        </div>

        {/* Source - w-32 */}
        <div className="w-32 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium">
            <SourceIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{sourceStitch.labelEn}</span>
          </div>
        </div>

        {/* Status Dropdown - w-40 */}
        <div className="w-40 shrink-0" onClick={(e) => e.stopPropagation()}>
          <StageDropdown
            availableStages={availableStages}
            displayStage={displayStage}
            isUpdatingStage={isUpdatingStage}
            onStageChange={onStageChange}
            getStageColor={getStageColor}
            getStageNameAr={getStageNameAr}
            compact
            stitchStyle
          />
        </div>

        {/* Property block - flex-1 */}
        {action.properties?.length ? (
          <CompactPropertyBlockStitch action={action} />
        ) : (
          <div className="flex-1 min-w-0" />
        )}

        {/* Next Action - w-56 border-r */}
        <CompactNextActionStitch appointments={action.appointments} reminders={action.reminders} />

        {/* Menu - 3 dots */}
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                data-interactive="true"
              >
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowSnoozeForm(true); }} className="flex items-center gap-2">
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

      <CustomDialog open={showScheduleForm} onOpenChange={setShowScheduleForm} maxWidth="max-w-md">
        <CustomDialogContent className="p-3">
          <CustomDialogHeader>
            <CustomDialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">جدولة موعد</div>
                <div className="text-sm text-muted-foreground font-normal">حدد نوع الموعد والتاريخ والوقت</div>
              </div>
            </CustomDialogTitle>
            <CustomDialogClose onClose={() => { setShowScheduleForm(false); scheduleForm.resetScheduleForm(); }} />
          </CustomDialogHeader>
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
            compact
          />
        </CustomDialogContent>
      </CustomDialog>

      {showSnoozeForm && (
        <SnoozeFormInline
          snoozeDate={snoozeForm.snoozeDate}
          snoozeTime={snoozeForm.snoozeTime}
          onDateChange={snoozeForm.setSnoozeDate}
          onTimeChange={snoozeForm.setSnoozeTime}
          onConfirm={() => {
            if (!snoozeForm.snoozeDate) return;
            onSnooze?.(action.id, new Date(`${snoozeForm.snoozeDate}T${snoozeForm.snoozeTime}`).toISOString());
            setShowSnoozeForm(false);
            snoozeForm.setSnoozeDate("");
            snoozeForm.setSnoozeTime("10:00");
          }}
          onCancel={() => { setShowSnoozeForm(false); snoozeForm.setSnoozeDate(""); snoozeForm.setSnoozeTime("10:00"); }}
          confirmDisabled={!snoozeForm.snoozeDate}
        />
      )}

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
    </>
  );
}
