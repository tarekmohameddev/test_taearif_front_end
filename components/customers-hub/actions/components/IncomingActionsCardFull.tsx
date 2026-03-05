"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SourceBadge } from "../SourceBadge";
import { ActionQuickPanel } from "../ActionQuickPanel";
import { AppointmentsRemindersTable } from "./AppointmentsRemindersTable";
import { StageDropdown } from "./StageDropdown";
import { AIMatchingBadge } from "./AIMatchingBadge";
import { AssignEmployeeDialog } from "./AssignEmployeeDialog";
import { ScheduleAppointmentForm } from "./ScheduleAppointmentForm";
import { priorityColors, priorityLabels } from "../constants/incomingCardConstants";
import { AlertTriangle, Phone, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { CustomerLifecycleStage } from "@/types/unified-customer";
import type { StageOption, AIMatchingStatus, EmployeeOption } from "../types/incomingCardTypes";

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
}

export function IncomingActionsCardFull({
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
  onSelect,
  onQuickView,
  onCardClick,
  showScheduleForm,
  setShowScheduleForm,
  showAssignEmployeeDialog,
  setShowAssignEmployeeDialog,
  scheduleForm,
  assignEmployee,
  getStageColor,
  getStageNameAr,
}: IncomingActionsCardFullProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl transition-all duration-200 hover:shadow-lg border-l-4 cursor-pointer group flex flex-col h-full relative overflow-hidden",
        priorityColors[action.priority],
        isOverdue && "border-red-600",
        isSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
        className
      )}
      onClick={onCardClick}
    >
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-start justify-between gap-4">
          {showCheckbox && (
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(c) => onSelect?.(action.id, c as boolean)}
                className="h-5 w-5 data-[state=checked]:bg-blue-600"
                data-interactive="true"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {customerIdForLink ? (
                <Link
                  href={`/ar/dashboard/customers-hub/${customerIdForLink}`}
                  className="font-semibold text-lg hover:text-blue-600 transition-colors"
                  data-interactive="true"
                >
                  {action.customerName}
                </Link>
              ) : (
                <span className="font-semibold text-lg">{action.customerName}</span>
              )}
              {onQuickView && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => { e.stopPropagation(); onQuickView(action.id); }}
                  data-interactive="true"
                >
                  <Eye className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </Button>
              )}
              <SourceBadge source={action.source} />
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  action.priority === "urgent" && "bg-red-100 text-red-700 border-red-200",
                  action.priority === "high" && "bg-orange-100 text-orange-700 border-orange-200",
                  action.priority === "medium" && "bg-yellow-100 text-yellow-700 border-yellow-200",
                  action.priority === "low" && "bg-green-100 text-green-700 border-green-200"
                )}
              >
                {priorityLabels[action.priority]}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  متأخر
                </Badge>
              )}
            </div>
            {action.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {action.description}
              </p>
            )}
            {resolvedCustomer?.phone && (
              <a
                href={`tel:${resolvedCustomer.phone}`}
                className="inline-flex items-center gap-1.5 mt-2 text-sm text-gray-600 hover:text-blue-600 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-4 w-4 shrink-0" />
                {resolvedCustomer.phone}
                {resolvedCustomer.whatsapp && resolvedCustomer.whatsapp !== resolvedCustomer.phone && (
                  <span className="text-gray-400"> / واتساب: {resolvedCustomer.whatsapp}</span>
                )}
              </a>
            )}
            <AppointmentsRemindersTable appointments={action.appointments} reminders={action.reminders} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 flex-1 flex flex-col min-h-0 pb-20">
        {showScheduleForm && (
          <div className="border-t pt-3 mt-2" onClick={(e) => e.stopPropagation()} data-interactive="true">
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
      </CardContent>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 pt-3 px-6 pb-4 flex items-center justify-between gap-4 rounded-b-2xl bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-1.5">
          {action.dueDate && (
            <div className={cn("flex items-center gap-1.5", isOverdue && "text-red-600 font-medium")}>
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date(action.dueDate).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {availableStages.length > 0 && (
            <StageDropdown
              availableStages={availableStages}
              displayStage={displayStage}
              isUpdatingStage={isUpdatingStage}
              onStageChange={onStageChange}
              getStageColor={getStageColor}
              getStageNameAr={getStageNameAr}
            />
          )}
          {resolvedCustomer && (
            <div className="pt-1 border-t border-gray-100 dark:border-gray-800 mt-1">
              <AIMatchingBadge aiMatching={aiMatching} compact={false} />
            </div>
          )}
        </div>
        <ActionQuickPanel action={action} onSchedule={() => setShowScheduleForm((p) => !p)} />
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
    </Card>
  );
}
