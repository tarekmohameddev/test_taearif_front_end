"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Calendar,
  User,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  Eye,
  UserPlus,
  Sparkles,
  FileText,
  Bell,
  AlarmClock,
  X,
  Check,
  Video,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SourceBadge } from "../actions/SourceBadge";
import type { CustomerAction, UnifiedCustomer, Priority } from "@/types/unified-customer";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { AppointmentsCard } from "./detail/AppointmentsCard";
import { CustomerSummaryCard } from "./detail/CustomerSummaryCard";
import { CompletedDismissedMessage } from "./detail/CompletedDismissedMessage";
import {
  RequestDetailLoading,
  RequestDetailError,
  RequestDetailNotFound,
} from "./detail/RequestDetailStates";
import { RequestDetailHeader } from "./detail/RequestDetailHeader";
import { RequestInfoCard } from "./detail/RequestInfoCard";
import { PropertyOrPreferencesCard } from "./detail/PropertyOrPreferencesCard";
import { RequestPropertiesCard } from "./detail/RequestPropertiesCard";
import { AIMatchingCard } from "./detail/AIMatchingCard";
import { RequestActionsCard } from "./detail/RequestActionsCard";
import { AssignEmployeeDialog } from "./detail/AssignEmployeeDialog";
import { PropertyRequestStatusDialog } from "./detail/PropertyRequestStatusDialog";
import { PropertyRequestPriorityDialog } from "./detail/PropertyRequestPriorityDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { priorityOptions, DEFAULT_TIME, SHOW_REMINDERS_SECTION, SHOW_NOTES_SECTION } from "./constants";
import type { RequestDetailStats } from "./request-detail-types";
import { isPropertyRequestAction, getPropertyRequestId } from "./request-detail-types";
import {
  getPropertyInfo,
  getCustomerPreferences,
  getAiMatching,
  getMatchedProperties,
  getPropertyRequestNumericId,
  showRequestPropertiesCard as computeShowRequestPropertiesCard,
  getRequestPropertyIds,
  type CustomerLike,
} from "./request-detail-data";
import { useRequestDetailHandlers } from "./hooks/useRequestDetailHandlers";
import { useSnoozeForm } from "./hooks/useSnoozeForm";
import { useNoteForm } from "./hooks/useNoteForm";
import { useScheduleForm } from "./hooks/useScheduleForm";
import { useReminderForm } from "./hooks/useReminderForm";
import { useAssignEmployeeDialog } from "./hooks/useAssignEmployeeDialog";
import { useStatusDialog } from "./hooks/useStatusDialog";
import { usePriorityDialog } from "./hooks/usePriorityDialog";

interface RequestDetailPageProps {
  requestId: string;
  action?: CustomerAction | null;
  stats?: RequestDetailStats;
  loading?: boolean;
  error?: string | null;
  onCompleteAction?: (notes?: string) => Promise<boolean>;
  onDismissAction?: (reason?: string) => Promise<boolean>;
  onSnoozeAction?: (snoozeUntil: string, reason?: string) => Promise<boolean>;
  onAssignAction?: (employeeId: number) => Promise<boolean>;
  onRefetch?: () => Promise<void>;
}

export function RequestDetailPage({
  requestId,
  action: propAction,
  stats: propStats,
  loading: propLoading,
  error: propError,
  onCompleteAction,
  onDismissAction,
  onSnoozeAction,
  onAssignAction,
  onRefetch,
}: RequestDetailPageProps) {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const storeActions = useUnifiedCustomersStore((state) => state.actions);
  const getCustomerById = useUnifiedCustomersStore(
    (state) => state.getCustomerById,
  );
  const storeCompleteAction = useUnifiedCustomersStore(
    (state) => state.completeAction,
  );
  const storeDismissAction = useUnifiedCustomersStore(
    (state) => state.dismissAction,
  );
  const storeSnoozeAction = useUnifiedCustomersStore(
    (state) => state.snoozeAction,
  );
  const storeAddActionNote = useUnifiedCustomersStore(
    (state) => state.addActionNote,
  );
  const storeAddAppointment = useUnifiedCustomersStore(
    (state) => state.addAppointment,
  );
  const addAppointmentForRequest = useUnifiedCustomersStore(
    (state) => state.addAppointmentForRequest,
  );

  // Use prop action if provided, otherwise find in store
  const action = propAction ?? storeActions.find((a) => a.id === requestId);
  
  // Get customer info - try from action metadata first, then from store
  const customer = action 
    ? (getCustomerById(String(action.customerId ?? "")) ?? {
        id: action.customerId,
        name: action.customerName,
        phone: action.customerPhone || "",
        email: action.customerEmail,
        source: action.source,
        stage: "new_lead" as const,
        stageHistory: [],
        preferences: {} as any,
        leadScore: 0,
        aiInsights: {} as any,
        priority: action.priority,
        tags: [],
        properties: [],
        interactions: [],
        appointments: [],
        reminders: [],
        documents: [],
        createdAt: action.createdAt,
        updatedAt: action.createdAt,
      })
    : undefined;

  // Use API handlers if provided, otherwise use store handlers
  const completeAction = onCompleteAction
    ? async () => {
        try {
          await onCompleteAction();
          if (onRefetch) await onRefetch();
        } catch (err) {
          console.error("Error completing action:", err);
        }
      }
    : () => {
        storeCompleteAction(requestId);
      };

  const dismissAction = onDismissAction
    ? async (reason?: string) => {
        try {
          await onDismissAction(reason);
          if (onRefetch) await onRefetch();
        } catch (err) {
          console.error("Error dismissing action:", err);
          throw err;
        }
      }
    : () => {
        storeDismissAction(requestId);
      };

  const snoozeAction = onSnoozeAction
    ? async (snoozeUntil: string, reason?: string) => {
        try {
          await onSnoozeAction(snoozeUntil, reason);
          if (onRefetch) await onRefetch();
        } catch (err) {
          console.error("Error snoozing action:", err);
        }
      }
    : (snoozeUntil: string) => {
        storeSnoozeAction(requestId, snoozeUntil);
      };

  const [actionsCardOpen, setActionsCardOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState("");
  const [dismissError, setDismissError] = useState<string | null>(null);
  const [dismissSubmitting, setDismissSubmitting] = useState(false);

  const { handleComplete } = useRequestDetailHandlers({
    action,
    completeAction: onCompleteAction
      ? async () => {
          try {
            await onCompleteAction();
            if (onRefetch) await onRefetch();
          } catch (err) {
            console.error("Error completing action:", err);
          }
        }
      : () => storeCompleteAction(requestId),
    dismissAction: () => {
      // Dismiss is handled via a dedicated dialog that collects a reason,
      // so we don't trigger it directly from the generic handlers hook.
      return;
    },
  });

  const handleOpenDismissDialog = () => {
    setDismissError(null);
    setDismissDialogOpen(true);
  };

  const handleCloseDismissDialog = () => {
    if (dismissSubmitting) return;
    setDismissDialogOpen(false);
    setDismissReason("");
    setDismissError(null);
  };

  const handleConfirmDismiss = async () => {
    const trimmedReason = dismissReason.trim();
    if (trimmedReason.length < 3) {
      setDismissError("يجب أن يكون سبب الرفض 3 أحرف على الأقل.");
      return;
    }

    setDismissSubmitting(true);
    setDismissError(null);
    try {
      await dismissAction(trimmedReason);
      setDismissDialogOpen(false);
      setDismissReason("");
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      const fieldError =
        apiErrors?.reason?.[0] ||
        err?.response?.data?.message ||
        err?.message;
      if (fieldError) {
        setDismissError(fieldError);
      }
    } finally {
      setDismissSubmitting(false);
    }
  };

  const snoozeActionFn = onSnoozeAction
    ? async (snoozeUntil: string, _reason?: string) => {
        try {
          await onSnoozeAction(snoozeUntil, _reason);
          if (onRefetch) await onRefetch();
        } catch (err) {
          console.error("Error snoozing action:", err);
        }
      }
    : (snoozeUntil: string) => storeSnoozeAction(requestId, snoozeUntil);

  const snoozeForm = useSnoozeForm({ snoozeAction: snoozeActionFn, onRefetch });

  const noteForm = useNoteForm({
    actionId: action?.id ?? "",
    storeAddActionNote,
    userData,
    onRefetch,
    onNoteAdded: (note) => {
      if (action?.metadata) action.metadata.notes = note;
    },
  });

  const scheduleForm = useScheduleForm({
    action,
    customer: customer as import("./hooks/useScheduleForm").ScheduleFormCustomer,
    addAppointmentForRequest,
    addAppointment: storeAddAppointment,
    onRefetch,
  });

  const reminderForm = useReminderForm({ action, onRefetch });

  const assignDialog = useAssignEmployeeDialog({ action, userData, onRefetch });

  const statusDialog = useStatusDialog({ requestId, action, userData, onRefetch });

  const priorityDialog = usePriorityDialog({ action, userData, onRefetch });

  if (propLoading && !action) {
    return <RequestDetailLoading />;
  }

  if (propError && !action) {
    return (
      <RequestDetailError
        error={propError}
        onRetry={onRefetch ? () => onRefetch() : undefined}
      />
    );
  }

  if (!action) {
    return <RequestDetailNotFound />;
  }

  const isOverdue = action.dueDate && new Date(action.dueDate) < new Date();

  const propertyInfo = getPropertyInfo(action);
  const customerPreferences = getCustomerPreferences(customer as CustomerLike);
  const aiMatching = getAiMatching(customer as CustomerLike);
  const matchedProperties = getMatchedProperties(customer as CustomerLike);
  const propertyRequestNumericId = getPropertyRequestNumericId(action, requestId);
  const showRequestPropertiesCard = computeShowRequestPropertiesCard(action, requestId);
  const requestPropertyIds = getRequestPropertyIds(action, showRequestPropertiesCard);

  const handleStatusClick = () => {
    if (isPropertyRequestAction(action)) {
      statusDialog.setShowStatusDialog(true);
    } else {
      toast.error("يمكن تغيير حالة طلب العقار فقط لطلبات العقار.");
    }
  };

  const handlePriorityClick = () => {
    if (isPropertyRequestAction(action)) {
      priorityDialog.setSelectedPriority((action.priority as Priority) || "medium");
      priorityDialog.setShowPriorityDialog(true);
    } else {
      toast.error("يمكن تغيير أولوية طلب العقار فقط لطلبات العقار.");
    }
  };

  const remindersList = action?.reminders ?? [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <RequestDetailHeader
          action={action}
          isOverdue={!!isOverdue}
          onStatusClick={handleStatusClick}
          onPriorityClick={isPropertyRequestAction(action) ? handlePriorityClick : undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <RequestInfoCard action={action} />

            {showRequestPropertiesCard ? (
              <RequestPropertiesCard
                propertyRequestId={propertyRequestNumericId!}
                propertyIds={requestPropertyIds}
                onRefetch={onRefetch}
              />
            ) : (
              <PropertyOrPreferencesCard
                propertyInfo={propertyInfo}
                customerPreferences={customerPreferences}
              />
            )}

            {customer && (
              <AIMatchingCard
                canMatch={aiMatching.canMatch}
                matchCount={aiMatching.matchCount}
                matchedProperties={matchedProperties}
              />
            )}

            {/* Appointments Section */}
            {action.appointments && action.appointments.length > 0 && (
              <AppointmentsCard appointments={action.appointments} />
            )}

            {/* قائمة التذكيرات - معطلة عبر SHOW_REMINDERS_SECTION في constants.ts */}
            {SHOW_REMINDERS_SECTION && remindersList.length > 0 && (
              <Card className="border-amber-200 dark:border-amber-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlarmClock className="h-5 w-5 text-amber-500" />
                    التذكيرات
                    <Badge variant="secondary" className="text-amber-600 dark:text-amber-400">
                      {remindersList.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {remindersList
                      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                      .map((reminder) => {
                        const reminderDate = new Date(reminder.datetime);
                        const isOverdue = reminder.isOverdue || (
                          reminder.status === "pending" && reminderDate < new Date()
                        );
                        const getTypeIcon = () => {
                          const icons: Record<string, React.ReactNode> = {
                            follow_up: <Phone className="h-4 w-4 text-blue-600" />,
                            document: <FileText className="h-4 w-4 text-purple-600" />,
                            payment: <DollarSign className="h-4 w-4 text-green-600" />,
                            viewing: <Eye className="h-4 w-4 text-indigo-600" />,
                            general: <Bell className="h-4 w-4 text-gray-600" />,
                          };
                          return icons[reminder.type] ?? icons.general;
                        };
                        const getTypeName = () => {
                          const names: Record<string, string> = {
                            follow_up: "متابعة",
                            document: "مستندات",
                            payment: "دفع",
                            viewing: "معاينة",
                            general: "عام",
                          };
                          return names[reminder.type] ?? reminder.type;
                        };
                        const getStatusBadge = () => {
                          if (isOverdue) {
                            return <Badge variant="destructive">متأخر</Badge>;
                          }
                          const config: Record<string, { variant: "secondary" | "default" | "destructive" | "outline"; label: string }> = {
                            pending: { variant: "secondary", label: "معلق" },
                            completed: { variant: "default", label: "مكتمل" },
                            overdue: { variant: "destructive", label: "متأخر" },
                            cancelled: { variant: "outline", label: "ملغي" },
                          };
                          const { variant, label } = config[reminder.status] ?? config.pending;
                          return <Badge variant={variant}>{label}</Badge>;
                        };
                        const getPriorityBadge = () => {
                          if (reminder.priority === "urgent") return <Badge variant="destructive" className="text-xs">عاجل</Badge>;
                          if (reminder.priority === "high") return <Badge variant="default" className="text-xs">عالي</Badge>;
                          if (reminder.priority === "medium") return <Badge variant="secondary" className="text-xs">متوسط</Badge>;
                          return <Badge variant="outline" className="text-xs">منخفض</Badge>;
                        };

                        return (
                          <Card
                            key={reminder.id}
                            className={`border-l-4 hover:shadow-md transition-shadow ${
                              isOverdue ? "border-l-red-500" :
                              reminder.priority === "urgent" ? "border-l-red-500" :
                              reminder.priority === "high" ? "border-l-orange-500" :
                              "border-l-amber-500"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    {getTypeIcon()}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold">{reminder.title}</h4>
                                        {getPriorityBadge()}
                                      </div>
                                      {reminder.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                          {reminder.description}
                                        </p>
                                      )}
                                      <p className="text-xs text-gray-500 mt-1">
                                        {getTypeName()}
                                      </p>
                                    </div>
                                  </div>
                                  {getStatusBadge()}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {reminderDate.toLocaleDateString("ar-SA", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                      {reminderDate.toLocaleTimeString("ar-SA", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>

                                {reminder.daysUntilDue !== undefined && (
                                  <div className="text-xs text-gray-500">
                                    {reminder.daysUntilDue > 0 
                                      ? `متبقي ${reminder.daysUntilDue} يوم`
                                      : reminder.daysUntilDue === 0
                                      ? "اليوم"
                                      : `متأخر ${Math.abs(reminder.daysUntilDue)} يوم`
                                    }
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ملاحظات - معطلة عبر SHOW_NOTES_SECTION في constants.ts */}
            {SHOW_NOTES_SECTION && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ملاحظات
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => noteForm.setShowNoteForm(!noteForm.showNoteForm)}
                  >
                    {noteForm.showNoteForm ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <>
                        <FileText className="h-4 w-4 ml-2" />
                        إضافة ملاحظة
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {noteForm.showNoteForm && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                    <Textarea
                      placeholder="أضف ملاحظة جديدة..."
                      value={noteForm.newNote}
                      onChange={(e) => noteForm.setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={noteForm.handleAddNote} disabled={!noteForm.newNote.trim()}>
                        <Check className="h-4 w-4 ml-2" />
                        حفظ
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={noteForm.resetNote}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}

                {(action?.notes?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {[...(action?.notes ?? [])]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {note.note}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200 dark:border-blue-800/50">
                          <p className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {note.addedByName && (
                            <p className="text-xs text-gray-500">
                              أضيف بواسطة: {note.addedByName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !noteForm.showNoteForm && (
                    <p className="text-sm text-gray-500 text-center py-4">لا توجد ملاحظات</p>
                  )
                )}
              </CardContent>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Summary Card */}
            {customer && customer.id != null && (
              <CustomerSummaryCard
                customer={{
                  id: customer.id,
                  name: customer.name,
                  phone: customer.phone,
                  email: customer.email,
                  whatsapp: "whatsapp" in customer ? (customer as { whatsapp?: string }).whatsapp : undefined,
                }}
                onViewCustomer={(id) => router.push(`/ar/dashboard/customers-hub/${id}`)}
              />
            )}

            {/* Action Buttons */}
            {action.status !== "completed" && action.status !== "dismissed" && (
              <RequestActionsCard
                open={actionsCardOpen}
                onOpenChange={setActionsCardOpen}
                onComplete={handleComplete}
                onDismiss={handleOpenDismissDialog}
                onAssignClick={() => assignDialog.setShowAssignEmployeeDialog(true)}
                onSnoozeFormToggle={() => snoozeForm.setShowSnoozeForm((v) => !v)}
                onScheduleFormToggle={() => scheduleForm.setShowScheduleForm((v) => !v)}
                showSnoozeForm={snoozeForm.showSnoozeForm}
                snoozeDate={snoozeForm.snoozeDate}
                snoozeTime={snoozeForm.snoozeTime}
                onSnoozeDateChange={snoozeForm.setSnoozeDate}
                onSnoozeTimeChange={snoozeForm.setSnoozeTime}
                onSnoozeSubmit={snoozeForm.handleSnooze}
                onSnoozeCancel={snoozeForm.resetSnooze}
                showScheduleForm={scheduleForm.showScheduleForm}
                aptType={scheduleForm.aptType}
                aptDate={scheduleForm.aptDate}
                aptTime={scheduleForm.aptTime}
                aptNotes={scheduleForm.aptNotes}
                onAptTypeChange={scheduleForm.setAptType}
                onAptDateChange={scheduleForm.setAptDate}
                onAptTimeChange={scheduleForm.setAptTime}
                onAptNotesChange={scheduleForm.setAptNotes}
                onScheduleSubmit={scheduleForm.handleScheduleAppointment}
                onScheduleCancel={scheduleForm.resetSchedule}
              >
                <AssignEmployeeDialog
                  open={assignDialog.showAssignEmployeeDialog}
                  onOpenChange={assignDialog.setShowAssignEmployeeDialog}
                  action={{
                    customerName: action.customerName,
                    customerPhone: action.customerPhone,
                    title: action.title,
                    objectType: action.objectType,
                    sourceId: action.sourceId,
                  }}
                  employees={assignDialog.employees}
                  selectedEmployeeId={assignDialog.selectedEmployeeId}
                  onSelectEmployee={assignDialog.setSelectedEmployeeId}
                  onAssign={assignDialog.handleAssignEmployee}
                  onClose={assignDialog.onClose}
                  loadingEmployees={assignDialog.loadingEmployees}
                  savingEmployee={assignDialog.savingEmployee}
                />
              </RequestActionsCard>
            )}

            {getPropertyRequestId(action) != null && (
              <PropertyRequestStatusDialog
                open={statusDialog.showStatusDialog}
                onOpenChange={statusDialog.handleOpenChange}
                action={action}
                statusOptions={statusDialog.statusOptions}
                selectedStatusId={statusDialog.selectedStatusId}
                onSelectedStatusIdChange={statusDialog.setSelectedStatusId}
                loadingStatuses={statusDialog.loadingStatuses}
                savingStatus={statusDialog.savingStatus}
                onSave={statusDialog.handleSaveStatus}
                onClose={statusDialog.onClose}
              />
            )}

            {getPropertyRequestId(action) != null && (
              <PropertyRequestPriorityDialog
                open={priorityDialog.showPriorityDialog}
                onOpenChange={priorityDialog.handleOpenChange}
                action={action}
                selectedPriority={priorityDialog.selectedPriority}
                onSelectedPriorityChange={priorityDialog.setSelectedPriority}
                savingPriority={priorityDialog.savingPriority}
                onSave={priorityDialog.handleSavePriority}
                onClose={priorityDialog.onClose}
              />
            )}

            {/* Completed/Dismissed Message */}
            {(action.status === "completed" || action.status === "dismissed") && (
              <CompletedDismissedMessage
                status={action.status}
                completedAt={action.completedAt}
              />
            )}

            <Dialog
              open={dismissDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  handleCloseDismissDialog();
                } else {
                  setDismissDialogOpen(true);
                }
              }}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>رفض الطلب</DialogTitle>
                  <DialogDescription>
                    يرجى كتابة سبب واضح لرفض هذا الطلب. سيتم حفظ السبب في سجل الطلب.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    سبب الرفض<span className="text-red-600 mr-1">*</span>
                  </label>
                  <Textarea
                    value={dismissReason}
                    onChange={(e) => {
                      setDismissReason(e.target.value);
                      if (dismissError) setDismissError(null);
                    }}
                    rows={4}
                    placeholder="اكتب سبب رفض الطلب (3 أحرف على الأقل)..."
                  />
                  {dismissError && (
                    <p className="text-xs text-red-600">{dismissError}</p>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={handleCloseDismissDialog}
                      disabled={dismissSubmitting}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmDismiss}
                      disabled={dismissSubmitting || dismissReason.trim().length < 3}
                    >
                      {dismissSubmitting ? "جاري الرفض..." : "تأكيد الرفض"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
