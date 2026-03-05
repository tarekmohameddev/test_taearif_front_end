"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SourceBadge } from "../SourceBadge";
import { AppointmentsRemindersTable } from "./AppointmentsRemindersTable";
import { StageDropdown } from "./StageDropdown";
import { AIMatchingBadge } from "./AIMatchingBadge";
import { AssignEmployeeDialog } from "./AssignEmployeeDialog";
import { ScheduleAppointmentForm } from "./ScheduleAppointmentForm";
import { SnoozeFormInline } from "./SnoozeFormInline";
import { priorityColors, priorityLabels } from "../constants/incomingCardConstants";
import { Clock, Phone, MoreVertical, CheckCircle, Calendar, Bell, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { CustomerLifecycleStage } from "@/types/unified-customer";
import type { StageOption, AIMatchingStatus, EmployeeOption } from "../types/incomingCardTypes";

export interface IncomingActionsCardCompactProps {
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
  aiMatching,
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
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 p-3 border-r-4 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-all cursor-pointer",
          priorityColors[action.priority],
          isOverdue && "border-red-600",
          isSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
          className
        )}
        onClick={onCardClick}
      >
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(c) => onSelect?.(action.id, c as boolean)}
            className="h-4 w-4 data-[state=checked]:bg-blue-600"
            data-interactive="true"
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            {customerIdForLink ? (
              <Link
                href={`/ar/dashboard/customers-hub/${customerIdForLink}`}
                className="font-medium text-sm hover:text-blue-600 transition-colors truncate max-w-[150px]"
                data-interactive="true"
              >
                {action.customerName}
              </Link>
            ) : (
              <span className="font-medium text-sm truncate max-w-[150px]">{action.customerName}</span>
            )}
            {resolvedCustomer?.phone && (
              <a
                href={`tel:${resolvedCustomer.phone}`}
                className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {resolvedCustomer.phone}
              </a>
            )}
            <SourceBadge source={action.source} className="text-xs" />
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                action.priority === "urgent" && "bg-red-100 text-red-700 border-red-200",
                action.priority === "high" && "bg-orange-100 text-orange-700 border-orange-200"
              )}
            >
              {priorityLabels[action.priority]}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                متأخر
              </Badge>
            )}
            {action.dueDate && (
              <span
                className={cn(
                  "text-xs flex items-center gap-1 shrink-0",
                  isOverdue ? "text-red-600 font-medium" : "text-gray-500"
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date(action.dueDate).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            <StageDropdown
              availableStages={availableStages}
              displayStage={displayStage}
              isUpdatingStage={isUpdatingStage}
              onStageChange={onStageChange}
              getStageColor={getStageColor}
              getStageNameAr={getStageNameAr}
              compact
            />
            {resolvedCustomer && (
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                <AIMatchingBadge aiMatching={aiMatching} compact />
              </div>
            )}
          </div>
          <AppointmentsRemindersTable
            appointments={action.appointments}
            reminders={action.reminders}
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()} data-interactive="true">
                <MoreVertical className="h-4 w-4" />
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
