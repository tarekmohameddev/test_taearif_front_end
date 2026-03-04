"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Tag,
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
import { cn } from "@/lib/utils";
import { SourceBadge } from "../actions/SourceBadge";
import type { CustomerAction, UnifiedCustomer, Appointment, PropertyInterest, Note } from "@/types/unified-customer";
import { getStageNameAr, getStageColor } from "@/types/unified-customer";
import { addNoteToAction, createReminderForRequest } from "@/lib/services/customers-hub-requests-api";
import { getEmployees as getAssignmentEmployees, assignRequests } from "@/lib/services/customers-hub-assignment-api";
import type { EmployeeWorkload } from "@/lib/services/customers-hub-assignment-api";
import useAuthStore from "@/context/AuthContext";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import { Loader2 } from "lucide-react";
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
import { APPOINTMENT_TYPES } from "./constants";

interface RequestDetailPageProps {
  requestId: string;
  action?: CustomerAction | null;
  stats?: any;
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
  const store = useUnifiedCustomersStore();
  const { userData } = useAuthStore();
  const {
    actions: storeActions,
    getCustomerById,
    completeAction: storeCompleteAction,
    dismissAction: storeDismissAction,
    snoozeAction: storeSnoozeAction,
    addActionNote: storeAddActionNote,
    addAppointment: storeAddAppointment,
    addAppointmentForRequest,
  } = store;

  // Use prop action if provided, otherwise find in store
  const action = propAction ?? storeActions.find((a) => a.id === requestId);
  
  // Get customer info - try from action metadata first, then from store
  const customer = action 
    ? (getCustomerById(action.customerId) ?? {
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
    ? async () => {
        try {
          await onDismissAction();
          if (onRefetch) await onRefetch();
        } catch (err) {
          console.error("Error dismissing action:", err);
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

  const addActionNote = storeAddActionNote;
  const addAppointment = storeAddAppointment;

  const [showSnoozeForm, setShowSnoozeForm] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState("");
  const [snoozeTime, setSnoozeTime] = useState("10:00");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [aptType, setAptType] = useState<Appointment["type"]>("office_meeting");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("10:00");
  const [aptNotes, setAptNotes] = useState("");
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("10:00");
  const [reminderPriority, setReminderPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [reminderType, setReminderType] = useState<"follow_up" | "payment_due" | "document_required" | "other">("follow_up");
  const [reminderNotes, setReminderNotes] = useState("");
  const [showAssignEmployeeDialog, setShowAssignEmployeeDialog] = useState(false);
  const [employees, setEmployees] = useState<EmployeeWorkload[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [actionsCardOpen, setActionsCardOpen] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusOptions, setStatusOptions] = useState<
    { id: number; name_ar: string; name_en: string }[]
  >([]);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // Fetch employees when opening assign dialog
  useEffect(() => {
    if (showAssignEmployeeDialog && userData?.token && employees.length === 0) {
      const fetchEmployees = async () => {
        setLoadingEmployees(true);
        try {
          const response = await getAssignmentEmployees();
          if (response.status === "success" && response.data.employees) {
            setEmployees(response.data.employees);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
          toast.error("حدث خطأ أثناء تحميل الموظفين");
        } finally {
          setLoadingEmployees(false);
        }
      };
      fetchEmployees();
    }
  }, [showAssignEmployeeDialog, userData?.token, employees.length]);

  // Set current employee when dialog opens
  useEffect(() => {
    if (showAssignEmployeeDialog && action?.assignedTo) {
      const assignedToId = typeof action.assignedTo === 'string' 
        ? action.assignedTo 
        : String(action.assignedTo);
      setSelectedEmployeeId(assignedToId);
    } else if (showAssignEmployeeDialog && !action?.assignedTo) {
      setSelectedEmployeeId(null);
    }
  }, [showAssignEmployeeDialog, action?.assignedTo]);

  // Fetch property request statuses as soon as page loads (for status change dialog)
  useEffect(() => {
    if (!userData?.token || !requestId) return;
    setLoadingStatuses(true);
    axiosInstance
      .get<{
        status?: string;
        data?: { status?: { id: number; name_ar: string; name_en: string }[] };
      }>("/v1/property-requests/filters")
      .then((response) => {
        const raw = response?.data;
        const statuses = Array.isArray(raw?.data?.status)
          ? raw.data.status
          : Array.isArray((raw as any)?.status)
            ? (raw as any).status
            : [];
        setStatusOptions(statuses);
      })
      .catch((error) => {
        console.error("Error fetching property request statuses:", error);
        toast.error("حدث خطأ أثناء تحميل حالات طلب العقار");
      })
      .finally(() => {
        setLoadingStatuses(false);
      });
  }, [userData?.token, requestId]);

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

  const handleComplete = async () => {
    try {
      await completeAction();
    } catch (err) {
      // Error toast is handled in hook
    }
  };

  const handleDismiss = async () => {
    try {
      await dismissAction();
    } catch (err) {
      // Error toast is handled in hook
    }
  };

  const handleSnooze = async () => {
    if (!snoozeDate) {
      toast.error("الرجاء اختيار تاريخ التأجيل");
      return;
    }
    try {
      const datetime = new Date(`${snoozeDate}T${snoozeTime}`).toISOString();
      await snoozeAction(datetime);
      setShowSnoozeForm(false);
      setSnoozeDate("");
      setSnoozeTime("10:00");
    } catch (err) {
      // Error toast is handled in hook
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    const toastId = toast.loading("جاري إضافة الملاحظة...");
    
    try {
      // Get current user ID - check multiple possible locations
      const currentUserId = userData?.user?.id || userData?.id || null;
      
      // Call API to add note
      const response = await addNoteToAction(
        action.id,
        newNote.trim(),
        currentUserId ? parseInt(currentUserId.toString()) : undefined
      );
      
      if (response.status === "success") {
        // Update local store with the new note (for compatibility with existing code)
        storeAddActionNote(action.id, newNote.trim());
        
        // Update action metadata if needed
        if (action.metadata) {
          action.metadata.notes = newNote.trim();
        }
        
        toast.success("تم إضافة الملاحظة بنجاح", { id: toastId });
        setNewNote("");
        setShowNoteForm(false);
        
        // Refresh page data if refetch is available
        if (onRefetch) {
          await onRefetch();
        }
      } else {
        throw new Error(response.message || "فشل إضافة الملاحظة");
      }
    } catch (err: any) {
      console.error("Error adding note:", err);
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء إضافة الملاحظة",
        { id: toastId }
      );
    }
  };

  const handleScheduleAppointment = async () => {
    if (!aptDate || !aptTime) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }
    
    // Check if datetime is in the future
    const datetime = new Date(`${aptDate}T${aptTime}`).toISOString();
    const now = new Date();
    if (new Date(datetime) <= now) {
      toast.error("التاريخ والوقت يجب أن يكون في المستقبل");
      return;
    }
    
    const toastId = toast.loading("جاري جدولة الإجراء...");
    try {
      // Use addAppointmentForRequest for property_request and inquiry, fallback to old method for others
      if ((action?.objectType === 'property_request' || action?.objectType === 'inquiry') && action?.id) {
        await addAppointmentForRequest(action.id, {
          type: aptType,
          datetime,
          duration: 30,
          notes: aptNotes.trim() || undefined,
          title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label,
          priority: 'medium',
        });
        toast.success("تم جدولة الإجراء بنجاح", { id: toastId });
      } else if (customer) {
        // Fallback to old method for non-property_request actions
        const now = new Date().toISOString();
        const appointment: Appointment = {
          id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label ?? "إجراء",
          type: aptType,
          date: datetime,
          time: aptTime,
          datetime,
          duration: 30,
          status: "scheduled",
          priority: "medium",
          notes: aptNotes.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        addAppointment(customer.id, appointment);
        toast.success("تم جدولة الإجراء بنجاح", { id: toastId });
      } else {
        toast.error("لا يمكن جدولة الإجراء: بيانات غير صحيحة", { id: toastId });
        return;
      }
      
      // Refresh page data
      if (onRefetch) {
        await onRefetch();
      }
      
      setShowScheduleForm(false);
      setAptType("office_meeting");
      setAptDate("");
      setAptTime("10:00");
      setAptNotes("");
    } catch (err: any) {
      console.error("Error scheduling appointment:", err);
      toast.error(
        err.message || err.response?.data?.message || "حدث خطأ أثناء جدولة الإجراء",
        { id: toastId }
      );
    }
  };

  const handleAddReminder = async () => {
    if (!reminderTitle.trim()) {
      toast.error("الرجاء إدخال عنوان التذكير");
      return;
    }
    
    if (!reminderDate || !reminderTime) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }
    
    // Check if datetime is in the future
    const datetime = new Date(`${reminderDate}T${reminderTime}`).toISOString();
    const now = new Date();
    if (new Date(datetime) <= now) {
      toast.error("التاريخ والوقت يجب أن يكون في المستقبل");
      return;
    }
    
    const toastId = toast.loading("جاري إضافة التذكير...");
    try {
      // Use createReminderForRequest for property_request and inquiry
      if ((action?.objectType === 'property_request' || action?.objectType === 'inquiry') && action?.id) {
        await createReminderForRequest(action.id, {
          title: reminderTitle.trim(),
          description: reminderDescription.trim() || undefined,
          datetime,
          priority: reminderPriority,
          type: reminderType,
          notes: reminderNotes.trim() || undefined,
        });
        toast.success("تم إضافة التذكير بنجاح", { id: toastId });
      } else {
        toast.error("لا يمكن إضافة التذكير: نوع الطلب غير مدعوم", { id: toastId });
        return;
      }
      
      // Refresh page data
      if (onRefetch) {
        await onRefetch();
      }
      
      setShowReminderForm(false);
      setReminderTitle("");
      setReminderDescription("");
      setReminderDate("");
      setReminderTime("10:00");
      setReminderPriority("medium");
      setReminderType("follow_up");
      setReminderNotes("");
    } catch (err: any) {
      console.error("Error adding reminder:", err);
      toast.error(
        err.message || err.response?.data?.message || "حدث خطأ أثناء إضافة التذكير",
        { id: toastId }
      );
    }
  };

  // Handle assign employee
  const handleAssignEmployee = async () => {
    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    // Use assignAction API for both property_request and inquiry
    if (!action?.id || (!action.objectType || (action.objectType !== 'property_request' && action.objectType !== 'inquiry'))) {
      toast.error("لا يمكن تعيين الموظف: نوع الطلب غير مدعوم");
      return;
    }

    if (!selectedEmployeeId) {
      toast.error("الرجاء اختيار موظف");
      return;
    }

    setSavingEmployee(true);
    try {
      // Use POST /api/v2/customers-hub/assignment/assign endpoint
      const response = await assignRequests([action.id], selectedEmployeeId);

      if (response.status === "success") {
        toast.success("تم تعيين الموظف المسؤول بنجاح!");
        
        // Refresh page data
        if (onRefetch) {
          await onRefetch();
        }

        setShowAssignEmployeeDialog(false);
        setSelectedEmployeeId(null);
      } else {
        throw new Error(response.message || "فشل تعيين الموظف");
      }
    } catch (error: any) {
      console.error("Error assigning employee:", error);
      toast.error(
        error.response?.data?.message || error.message || "حدث خطأ أثناء تعيين الموظف المسؤول"
      );
    } finally {
      setSavingEmployee(false);
    }
  };

  // Get property info from metadata or customer preferences
  const propertyInfo = action.metadata?.propertyTitle || action.metadata?.property_title
    ? {
        title: action.metadata.propertyTitle || action.metadata.property_title,
        type: action.metadata.propertyType || action.metadata.property_type,
        price: action.metadata.propertyPrice || action.metadata.property_price,
        location: action.metadata.propertyLocation || action.metadata.property_location,
      }
    : null;

  const customerPreferences = customer?.preferences
    ? {
        type: customer.preferences.propertyType?.join("، "),
        budget:
          customer.preferences.budgetMin && customer.preferences.budgetMax
            ? `${(customer.preferences.budgetMin / 1000).toFixed(0)}k - ${(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال`
            : customer.preferences.budgetMax
            ? `حتى ${(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال`
            : undefined,
        location: customer.preferences.preferredAreas?.slice(0, 3).join("، "),
        bedrooms: customer.preferences.bedrooms,
      }
    : null;

  const aiMatching = customer
    ? {
        canMatch:
          (customer.preferences?.propertyType?.length ?? 0) > 0 &&
          ((customer.preferences?.budgetMin ?? 0) > 0 ||
            (customer.preferences?.preferredAreas?.length ?? 0) > 0),
        matchCount: customer.aiInsights?.propertyMatches?.length ?? 0,
      }
    : { canMatch: false, matchCount: 0 };

  // Resolve AI-matched properties (full details from customer.properties)
  const matchedProperties: PropertyInterest[] = customer?.properties?.filter((p) =>
    customer.aiInsights?.propertyMatches?.includes(p.propertyId)
  ) ?? [];

  const handleStatusClick = () => {
    if (action.objectType === "property_request" && (action as { property_request_id?: number }).property_request_id) {
      setShowStatusDialog(true);
    } else {
      toast.error("يمكن تغيير حالة طلب العقار فقط لطلبات العقار.");
    }
  };

  const propertyRequestNumericId =
    action.objectType === "property_request"
      ? (action.metadata?.propertyRequestId as number | undefined) ??
        (action as { property_request_id?: number }).property_request_id ??
        (requestId && /^property_request_(\d+)$/.test(requestId)
          ? parseInt(requestId.replace(/^property_request_/, ""), 10)
          : undefined)
      : undefined;
  const showRequestPropertiesCard =
    action.objectType === "property_request" &&
    propertyRequestNumericId != null &&
    !Number.isNaN(propertyRequestNumericId);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <RequestDetailHeader
          action={action}
          isOverdue={!!isOverdue}
          onStatusClick={handleStatusClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <RequestInfoCard action={action} />

            {showRequestPropertiesCard ? (
              <RequestPropertiesCard
                propertyRequestId={propertyRequestNumericId!}
                propertyIds={
                  (action as { propertyIds?: number[] }).propertyIds ??
                  (action.metadata?.propertyIds as number[] | undefined) ??
                  []
                }
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

            {/* قائمة التذكيرات - مخفية (للاستعادة أزل الشرط false &&) */}
            {false && action.reminders && action.reminders.length > 0 && (
              <Card className="border-amber-200 dark:border-amber-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlarmClock className="h-5 w-5 text-amber-500" />
                    التذكيرات
                    <Badge variant="secondary" className="text-amber-600 dark:text-amber-400">
                      {action.reminders.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {action.reminders
                      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                      .map((reminder) => {
                        const reminderDate = new Date(reminder.datetime);
                        const isOverdue = reminder.isOverdue || (
                          reminder.status === "pending" && reminderDate < new Date()
                        );
                        const getTypeIcon = () => {
                          const icons = {
                            follow_up: <Phone className="h-4 w-4 text-blue-600" />,
                            document: <FileText className="h-4 w-4 text-purple-600" />,
                            payment: <DollarSign className="h-4 w-4 text-green-600" />,
                            viewing: <Eye className="h-4 w-4 text-indigo-600" />,
                            general: <Bell className="h-4 w-4 text-gray-600" />,
                          };
                          return icons[reminder.type] || icons.general;
                        };
                        const getTypeName = () => {
                          const names: Record<string, string> = {
                            follow_up: "متابعة",
                            document: "مستندات",
                            payment: "دفع",
                            viewing: "معاينة",
                            general: "عام",
                          };
                          return names[reminder.type] || reminder.type;
                        };
                        const getStatusBadge = () => {
                          if (isOverdue) {
                            return <Badge variant="destructive">متأخر</Badge>;
                          }
                          const config = {
                            pending: { variant: "secondary" as any, label: "معلق" },
                            completed: { variant: "default" as any, label: "مكتمل" },
                            overdue: { variant: "destructive" as any, label: "متأخر" },
                            cancelled: { variant: "outline" as any, label: "ملغي" },
                          };
                          const { variant, label } = config[reminder.status] || config.pending;
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

            {/* ملاحظات - مخفية (للاستعادة أزل الشرط false &&) */}
            {false && (
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
                    onClick={() => setShowNoteForm(!showNoteForm)}
                  >
                    {showNoteForm ? (
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
                {showNoteForm && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                    <Textarea
                      placeholder="أضف ملاحظة جديدة..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Check className="h-4 w-4 ml-2" />
                        حفظ
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowNoteForm(false);
                          setNewNote("");
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}

                {action.notes && action.notes.length > 0 ? (
                  <div className="space-y-3">
                    {[...action.notes]
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
                  !showNoteForm && (
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
                onDismiss={handleDismiss}
                onAssignClick={() => setShowAssignEmployeeDialog(true)}
                onSnoozeFormToggle={() => setShowSnoozeForm((v) => !v)}
                onScheduleFormToggle={() => setShowScheduleForm((v) => !v)}
                showSnoozeForm={showSnoozeForm}
                snoozeDate={snoozeDate}
                snoozeTime={snoozeTime}
                onSnoozeDateChange={setSnoozeDate}
                onSnoozeTimeChange={setSnoozeTime}
                onSnoozeSubmit={handleSnooze}
                onSnoozeCancel={() => {
                  setShowSnoozeForm(false);
                  setSnoozeDate("");
                  setSnoozeTime("10:00");
                }}
                showScheduleForm={showScheduleForm}
                aptType={aptType}
                aptDate={aptDate}
                aptTime={aptTime}
                aptNotes={aptNotes}
                onAptTypeChange={setAptType}
                onAptDateChange={setAptDate}
                onAptTimeChange={setAptTime}
                onAptNotesChange={setAptNotes}
                onScheduleSubmit={handleScheduleAppointment}
                onScheduleCancel={() => {
                  setShowScheduleForm(false);
                  setAptType("office_meeting");
                  setAptDate("");
                  setAptTime("10:00");
                  setAptNotes("");
                }}
              >
                <AssignEmployeeDialog
                  open={showAssignEmployeeDialog}
                  onOpenChange={setShowAssignEmployeeDialog}
                  action={{
                    customerName: action.customerName,
                    title: action.title,
                    objectType: action.objectType,
                    sourceId: action.sourceId,
                  }}
                  employees={employees}
                  selectedEmployeeId={selectedEmployeeId}
                  onSelectEmployee={setSelectedEmployeeId}
                  onAssign={handleAssignEmployee}
                  onClose={() => {
                    setShowAssignEmployeeDialog(false);
                    setSelectedEmployeeId(null);
                  }}
                  loadingEmployees={loadingEmployees}
                  savingEmployee={savingEmployee}
                />
              </RequestActionsCard>
            )}

            {/* Property Request Status Dialog */}
            {action.objectType === "property_request" && (action as any).property_request_id && (
              <CustomDialog
                open={showStatusDialog}
                onOpenChange={(open) => {
                  if (open && !userData?.token) {
                    toast.error("يجب تسجيل الدخول أولاً");
                    return;
                  }
                  setShowStatusDialog(open);
                  if (open && statusOptions.length > 0 && selectedStatusId === null) {
                    setSelectedStatusId(statusOptions[0].id);
                  }
                  if (!open) {
                    setSelectedStatusId(null);
                  }
                }}
                maxWidth="max-w-md"
              >
                <CustomDialogContent className="p-3">
                  <CustomDialogHeader>
                    <CustomDialogTitle className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">تغيير حالة طلب العقار</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          اختر الحالة الجديدة لطلب العقار رقم #{(action as any).property_request_id}
                        </div>
                      </div>
                    </CustomDialogTitle>
                    <CustomDialogClose
                      onClose={() => {
                        setShowStatusDialog(false);
                        setSelectedStatusId(null);
                      }}
                    />
                  </CustomDialogHeader>

                  <div className="space-y-6 p-4">
                    {/* معلومات أساسية عن الطلب */}
                    <div className="p-3 bg-muted/30 rounded-lg space-y-1">
                      <div className="text-sm font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        العميل: {action.customerName} — طلب عقار رقم #{(action as any).property_request_id}
                      </div>
                    </div>

                    {/* اختيار الحالة */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">اختر الحالة:</Label>
                      {loadingStatuses ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="mr-2 text-sm text-muted-foreground">
                            جاري تحميل الحالات...
                          </span>
                        </div>
                      ) : (
                        <CustomDropdown
                          fullWidth
                          contentZIndex={10003}
                          trigger={
                            <span className="flex items-center gap-2">
                              {selectedStatusId != null
                                ? statusOptions.find((s) => s.id === selectedStatusId)?.name_ar ?? "اختر الحالة"
                                : "اختر الحالة"}
                            </span>
                          }
                          triggerClassName={cn(
                            "w-full justify-between",
                            savingStatus && "pointer-events-none opacity-60"
                          )}
                        >
                          {statusOptions.map((status) => (
                            <DropdownItem
                              key={status.id}
                              onClick={() => setSelectedStatusId(status.id)}
                            >
                              {status.name_ar}
                            </DropdownItem>
                          ))}
                        </CustomDropdown>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 px-4 pb-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowStatusDialog(false);
                        setSelectedStatusId(null);
                      }}
                      disabled={savingStatus}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!selectedStatusId) return;
                        if (!userData?.token) {
                          toast.error("يجب تسجيل الدخول أولاً");
                          return;
                        }
                        const propertyRequestId = (action as any).property_request_id;
                        if (!propertyRequestId) {
                          toast.error("لم يتم العثور على معرف طلب العقار");
                          return;
                        }
                        setSavingStatus(true);
                        try {
                          await axiosInstance.put(`/v1/property-requests/${propertyRequestId}/status`, {
                            status_id: selectedStatusId,
                          });
                          toast.success("تم تحديث حالة طلب العقار بنجاح");
                          setShowStatusDialog(false);
                          if (onRefetch) {
                            await onRefetch();
                          }
                        } catch (error: any) {
                          console.error("Error updating property request status:", error);
                          toast.error(
                            error?.response?.data?.message ||
                              "حدث خطأ أثناء تحديث حالة طلب العقار"
                          );
                        } finally {
                          setSavingStatus(false);
                        }
                      }}
                      disabled={
                        savingStatus ||
                        loadingStatuses ||
                        !selectedStatusId ||
                        statusOptions.length === 0
                      }
                      className="min-w-[120px]"
                    >
                      {savingStatus ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        "حفظ"
                      )}
                    </Button>
                  </div>
                </CustomDialogContent>
              </CustomDialog>
            )}

            {/* Completed/Dismissed Message */}
            {(action.status === "completed" || action.status === "dismissed") && (
              <CompletedDismissedMessage
                status={action.status}
                completedAt={action.completedAt}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
