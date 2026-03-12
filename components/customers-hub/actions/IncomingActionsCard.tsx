"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import useAuthStore from "@/context/AuthContext";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import { getStageNameAr, getStageColor } from "@/types/unified-customer";
import { getAIMatchingStatus } from "./utils/propertyUtils";
import { useStageResolution } from "./hooks/useStageResolution";
import { useStageChangeHandler } from "./hooks/useStageChangeHandler";
import { useScheduleForm } from "./hooks/useScheduleForm";
import { useAssignEmployee } from "./hooks/useAssignEmployee";
import { IncomingActionsCardCompact } from "./components/IncomingActionsCardCompact";
import { IncomingActionsCardFull } from "./components/IncomingActionsCardFull";
import type { IncomingActionsCardProps } from "./types/incomingCardTypes";
import type { ApiStageShape } from "./types/incomingCardTypes";

export function IncomingActionsCard({
  action,
  customer,
  stages: propStages,
  onComplete,
  onDismiss,
  onSnooze,
  onQuickView,
  isSelected = false,
  onSelect,
  showCheckbox = true,
  isCompact = false,
  className,
  isCompleting = false,
  onScheduleFormOpenChange,
  onStageChangeSuccess,
}: IncomingActionsCardProps) {
  const router = useRouter();
  const addAppointment = useUnifiedCustomersStore(
    (state) => state.addAppointment,
  );
  const addAppointmentForRequest = useUnifiedCustomersStore(
    (state) => state.addAppointmentForRequest,
  );
  const updateCustomerStage = useUnifiedCustomersStore(
    (state) => state.updateCustomerStage,
  );
  const getCustomerById = useUnifiedCustomersStore(
    (state) => state.getCustomerById,
  );
  const { userData } = useAuthStore();
  const { stages: storeStages } = useCustomersHubStagesStore();

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showSnoozeForm, setShowSnoozeForm] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState("");
  const [snoozeTime, setSnoozeTime] = useState("10:00");
  const [showAssignEmployeeDialog, setShowAssignEmployeeDialog] = useState(false);

  useEffect(() => {
    onScheduleFormOpenChange?.(showScheduleForm);
  }, [showScheduleForm, onScheduleFormOpenChange]);

  useEffect(() => {
    if (isCompact && showSnoozeForm && !snoozeDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSnoozeDate(tomorrow.toISOString().slice(0, 10));
      setSnoozeTime("10:00");
    }
  }, [isCompact, showSnoozeForm, snoozeDate]);

  const resolvedCustomer =
    customer ??
    getCustomerById(
      typeof action.customerId === "string" ? action.customerId : String(action.customerId)
    );
  const customerIdForLink = action.customerId
    ? typeof action.customerId === "string"
      ? action.customerId
      : String(action.customerId)
    : resolvedCustomer?.id
      ? String(resolvedCustomer.id)
      : null;

  const {
    availableStages,
    normalizedStage,
    displayStage,
    setOptimisticStage,
    setActionStageId,
  } = useStageResolution({
    action,
    propStages: propStages as ApiStageShape[] | undefined,
    storeStages: storeStages as ApiStageShape[] | undefined,
    resolvedCustomer,
  });

  const { handleStageChange, isUpdatingStage } = useStageChangeHandler({
    action,
    resolvedCustomer,
    availableStages,
    storeStages: storeStages as ApiStageShape[] | undefined,
    normalizedStage,
    updateCustomerStage,
    setOptimisticStage,
    setActionStageId,
    onStageChangeSuccess,
  });

  const scheduleForm = useScheduleForm({
    action,
    addAppointment,
    addAppointmentForRequest,
    showScheduleForm,
    setShowScheduleForm,
  });

  const assignEmployee = useAssignEmployee({
    action,
    hasToken: !!userData?.token,
    showAssignEmployeeDialog,
    setShowAssignEmployeeDialog,
    onActionUpdated: (updates) => {
      (action as { assignedTo?: string; assignedToName?: string }).assignedTo = updates.assignedTo;
      (action as { assignedTo?: string; assignedToName?: string }).assignedToName = updates.assignedToName;
    },
  });

  const aiMatching = getAIMatchingStatus(resolvedCustomer);
  const isOverdue = !!action.dueDate && new Date(action.dueDate) < new Date();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button, a, [role="checkbox"], input, [data-interactive]')) {
      router.push(`/ar/dashboard/customers-hub/requests/${action.id}`);
    }
  };

  const scheduleFormProps = {
    aptType: scheduleForm.aptType,
    setAptType: scheduleForm.setAptType,
    aptDate: scheduleForm.aptDate,
    setAptDate: scheduleForm.setAptDate,
    aptTime: scheduleForm.aptTime,
    setAptTime: scheduleForm.setAptTime,
    aptNotes: scheduleForm.aptNotes,
    setAptNotes: scheduleForm.setAptNotes,
    handleScheduleSubmit: scheduleForm.handleScheduleSubmit,
    resetScheduleForm: scheduleForm.resetScheduleForm,
    isSubmittingApt: scheduleForm.isSubmittingApt,
  };
  const assignEmployeeProps = {
    employees: assignEmployee.employees,
    selectedEmployeeId: assignEmployee.selectedEmployeeId,
    setSelectedEmployeeId: assignEmployee.setSelectedEmployeeId,
    loadingEmployees: assignEmployee.loadingEmployees,
    savingEmployee: assignEmployee.savingEmployee,
    handleAssignEmployee: assignEmployee.handleAssignEmployee,
  };
  const snoozeFormProps = { snoozeDate, setSnoozeDate, snoozeTime, setSnoozeTime };

  const commonViewProps = {
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
    onStageChange: handleStageChange,
    aiMatching,
    onCardClick: handleCardClick,
    showScheduleForm,
    setShowScheduleForm,
    showAssignEmployeeDialog,
    setShowAssignEmployeeDialog,
    scheduleForm: scheduleFormProps,
    assignEmployee: assignEmployeeProps,
    getStageColor,
    getStageNameAr,
  };

  if (isCompact) {
    return (
      <IncomingActionsCardCompact
        {...commonViewProps}
        onComplete={onComplete}
        onDismiss={onDismiss}
        onSnooze={onSnooze}
        onSelect={onSelect}
        isCompleting={isCompleting}
        showSnoozeForm={showSnoozeForm}
        setShowSnoozeForm={setShowSnoozeForm}
        snoozeForm={snoozeFormProps}
      />
    );
  }
  return (
    <IncomingActionsCardFull
      {...commonViewProps}
      onSelect={onSelect}
      onQuickView={onQuickView}
      onComplete={onComplete}
      onDismiss={onDismiss}
      onSnooze={onSnooze}
      isCompleting={isCompleting}
      showSnoozeForm={showSnoozeForm}
      setShowSnoozeForm={setShowSnoozeForm}
      snoozeForm={snoozeFormProps}
    />
  );
}
