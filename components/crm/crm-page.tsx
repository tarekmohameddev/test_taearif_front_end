"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Customer, PipelineStage, Appointment } from "@/types/crm";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Target,
  Handshake,
  CheckCircle,
  Calendar,
  Phone,
  Clock,
  Star,
  Award,
  User,
  Shield,
  FileText,
  Home,
  FileQuestion,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import {
  CrmStatistics,
  CrmFilters,
  PipelineBoard,
  AppointmentsList,
  RemindersList,
  InquiryList,
  CrmHeader,
  DragDropHandler,
  KeyboardNavigation,
  EnhancedDragDrop,
  Utilities,
  CustomerDetailDialog,
  AddNoteDialog,
  RequiredNoteDialog,
  AddReminderDialog,
  EditReminderDialog,
  AddAppointmentDialog,
  EditAppointmentDialog,
  AddInteractionDialog,
  AddStageDialog,
  EditStageDialog,
  CrmSettingsDialog,
  AddDealDialog,
} from "./index";
import CrmPageSkeleton from "./crm-page-skeleton";

// Helper functions
const getStageIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Target: Target,
    Users: Users,
    Phone: Phone,
    Calendar: Calendar,
    Check: CheckCircle,
    Clock: Clock,
    Star: Star,
    Award: Award,
    User: User,
    Shield: Shield,
    Handshake: Handshake,
    TrendingUp: TrendingUp,
    "fa fa-user": User,
    "fa fa-users": Users,
    "fa fa-phone": Phone,
    "fa fa-calendar": Calendar,
    "fa fa-check": CheckCircle,
    "fa fa-clock": Clock,
    "fa fa-star": Star,
    "fa fa-trophy": Award,
    "fa fa-user-shield": Shield,
    "fa fa-check-circle": CheckCircle,
    "fa fa-handshake": Handshake,
    "fa fa-chart-line": TrendingUp,
  };

  return iconMap[iconName] || Target;
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 0:
      return "منخفضة";
    case 1:
      return "متوسطة";
    case 2:
      return "عالية";
    default:
      return "متوسطة";
  }
};

// مكون الإحصائيات المدمج
const CrmStatisticsInline = ({
  totalCustomers,
  customersData,
  pipelineStages,
  pipelineStats,
  scheduledAppointments,
  totalAppointments,
}: {
  totalCustomers: number;
  customersData: Customer[];
  pipelineStages: PipelineStage[];
  pipelineStats: any[];
  scheduledAppointments: number;
  totalAppointments: number;
}) => {
  return (
    <div className="grid gap-4 mb-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Users className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">إجمالي العملاء</span>
            <span className="sm:hidden">العملاء</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{totalCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <TrendingUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">العملاء النشطون</span>
            <span className="sm:hidden">النشطون</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {
              customersData.filter(
                (c: Customer) => c.pipelineStage !== "closed-lost",
              ).length
            }
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Target className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">عملاء محتملون</span>
            <span className="sm:hidden">محتملون</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {pipelineStages.find((s) => s.id === "2")?.count || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {(
              (pipelineStages.find((s) => s.id === "2")?.value || 0) / 1000
            ).toFixed(0)}
            ك ريال
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Handshake className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">في التفاوض</span>
            <span className="sm:hidden">تفاوض</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {pipelineStats.find((s) => s.id === "negotiation")?.count || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {(
              (pipelineStats.find((s) => s.id === "negotiation")?.value || 0) /
              1000
            ).toFixed(0)}
            ك ريال
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <CheckCircle className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">صفقات مكتملة</span>
            <span className="sm:hidden">مكتملة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {pipelineStats.find((s) => s.id === "closed-won")?.count || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {(
              (pipelineStats.find((s) => s.id === "closed-won")?.value || 0) /
              1000000
            ).toFixed(1)}
            م ريال
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Calendar className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">المواعيد اليوم</span>
            <span className="sm:hidden">المواعيد</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {scheduledAppointments}
          </div>
          <div className="text-xs text-muted-foreground">
            {totalAppointments} إجمالي
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// مكون الإحصائيات للطلبات
const CrmStatisticsCards = ({
  statistics,
}: {
  statistics: {
    total_requests: number;
    with_property: number;
    without_property: number;
  } | null;
}) => {
  if (!statistics) {
    return null;
  }

  const statsCards = [
    {
      title: "إجمالي الطلبات",
      value: statistics.total_requests || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "مع عقار",
      value: statistics.with_property || 0,
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "بدون عقار",
      value: statistics.without_property || 0,
      icon: FileQuestion,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default function CrmPage() {
  // Get data from store
  const {
    customers: rawCustomersData,
    pipelineStages: rawPipelineStages,
    appointments: appointmentsData,
    reminders: remindersData,
    inquiriesData,
    crmData,
    totalCustomers,
    isLoading: loading,
    error,
    isInitialized,
    selectedStage,
    selectedCustomer,
    selectedAppointment,
    selectedReminder,
    newStage,
    showCrmSettingsDialog,
    showAddStageDialog,
    showEditStageDialog,
    showAddDealDialog,
    showAddNoteDialog,
    showAddReminderDialog,
    showEditReminderDialog,
    showAddInteractionDialog,
    showCustomerDialog,
    showAddAppointmentDialog,
    showEditAppointmentDialog,
    showAppointmentDetailDialog,
    setSelectedCustomer,
    setSelectedStage,
    setSelectedAppointment,
    setSelectedReminder,
    setShowCustomerDialog,
    setShowAddNoteDialog,
    setShowAddReminderDialog,
    setShowEditReminderDialog,
    setShowAddInteractionDialog,
    setShowCrmSettingsDialog,
    setShowAddStageDialog,
    setShowEditStageDialog,
    setShowAddAppointmentDialog,
    setShowEditAppointmentDialog,
    setShowAppointmentDetailDialog,
    setNewStage,
    updateCustomerStage,
    updateCustomer,
    setPipelineStages,
    setCustomers,
    fetchCrmData,
    fetchAppointmentsData,
    fetchRemindersData,
    fetchInquiriesData,
    refreshAllData,
    shouldFetchData,
    addAppointment,
    addReminder,
    updateReminder,
    addInquiry,
    updateAppointment,
    updateInquiry,
  } = useCrmStore();
  const { userData } = useAuthStore();

  // Ensure pipelineStages is always an array and filter out "unassigned" stage
  const pipelineStages = Array.isArray(rawPipelineStages)
    ? rawPipelineStages.filter(
        (stage) => stage.id !== "unassigned" && stage.id !== "غير معين",
      )
    : [];
  const customersData = Array.isArray(rawCustomersData) ? rawCustomersData : [];

  const [activeTab, setActiveTab] = useState("crm");
  const [activeView, setActiveView] = useState("pipeline"); // pipeline, appointments, analytics
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");

  // Enhanced drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<Customer | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Keyboard navigation states
  const [focusedCustomer, setFocusedCustomer] = useState<Customer | null>(null);
  const [focusedStage, setFocusedStage] = useState<PipelineStage | null>(null);

  // Required note dialog states for employees
  const [showRequiredNoteDialog, setShowRequiredNoteDialog] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    customerId: string;
    stageId: string;
    originalStage: string;
    customerName: string;
  } | null>(null);
  const [customerCards, setCustomerCards] = useState<any[]>([]);
  const [loadingCustomerCards, setLoadingCustomerCards] = useState(false);

  // Helper function for updateCustomerStage API call
  const updateCustomerStageAPI = async (
    customerId: string,
    stageId: string,
  ) => {
    if (!userData?.token) {
      console.log("No token available, skipping updateCustomerStage");
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await axiosInstance.post(
        `/v1/crm/requests/${customerId}/change-stage`,
        {
          stage_id: parseInt(stageId),
        },
        {
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (response.data.status === "success" || response.data.status === true) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating customer stage:", err);
      return false;
    }
  };

  const utilities = Utilities({
    onAnnounceToScreenReader: (message) => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    onShowSuccessAnimation: (stageId) => {
      const stageElement = document.querySelector(
        `[data-stage-id="${stageId}"]`,
      );
      if (stageElement) {
        // Add immediate visual feedback
        stageElement.classList.add(
          "animate-pulse",
          "ring-2",
          "ring-green-500",
          "scale-105",
        );
        setTimeout(() => {
          stageElement.classList.remove(
            "animate-pulse",
            "ring-2",
            "ring-green-500",
            "scale-105",
          );
        }, 300); // Shorter animation for faster feedback
      }
    },
  });

  const enhancedDragDrop = EnhancedDragDrop({
    isDragging,
    draggedCustomer: dragPreview,
    dragOverStage,
    dragPreview,
    dragOffset,
    onDragStart: (e, customer) => {
      setIsDragging(true);
      setDragPreview(customer);
      setDragOffset({
        x: e.clientX - e.currentTarget.getBoundingClientRect().left,
        y: e.clientY - e.currentTarget.getBoundingClientRect().top,
      });
    },
    onDragEnd: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onDragOver: (e, stageId) => setDragOverStage(stageId),
    onDragLeave: (e, stageId) => setDragOverStage(null),
    onDrop: async (e, stageId) => {
      if (dragPreview && dragPreview.pipelineStage !== stageId) {
        const originalStage = dragPreview.pipelineStage;
        const customerName = dragPreview.name;
        const customerId = dragPreview.id.toString();

        // Check if user is employee - only employees need to write note
        if (userData?.account_type === "employee") {
          // Employee must write note before stage change
          setPendingStageChange({
            customerId,
            stageId,
            originalStage: originalStage || "",
            customerName,
          });
          setSelectedCustomer(dragPreview);
          setShowRequiredNoteDialog(true);
          // Don't proceed with stage change until note is added
          return;
        }

        // If not employee, proceed with normal stage change
        updateCustomerStage(customerId, stageId);

        utilities.showSuccessAnimation(stageId);
        utilities.announceToScreenReader(`تم نقل العميل ${customerName} بنجاح`);

        updateCustomerStageAPI(customerId, stageId)
          .then((success) => {
            if (!success) {
              // Revert if API fails
              updateCustomerStage(customerId, originalStage || "");
              utilities.announceToScreenReader(
                `فشل في نقل العميل ${customerName}`,
              );
            }
          })
          .catch((error) => {
            // Revert if API fails
            updateCustomerStage(customerId, originalStage || "");
            utilities.announceToScreenReader(
              `فشل في نقل العميل ${customerName}`,
            );
          });
      }
    },
    onMouseMove: (e) => {
      if (isDragging && dragPreview) {
        // Update drag preview position
      }
    },
    onGlobalDragEnd: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onGlobalDragCancel: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onAnnounceToScreenReader: utilities.announceToScreenReader,
    onShowSuccessAnimation: utilities.showSuccessAnimation,
  });

  const keyboardNavigation = KeyboardNavigation({
    focusedCustomer,
    focusedStage,
    pipelineStages,
    onKeyDown: (e, customer, stageId) => {},
    onMoveCustomerToStage: async (customer, targetStageId) => {
      const success = await updateCustomerStageAPI(
        customer.id.toString(),
        targetStageId,
      );
      if (success) {
        updateCustomerStage(customer.id.toString(), targetStageId);
      }
    },
    onSetFocusedCustomer: setFocusedCustomer,
    onSetFocusedStage: setFocusedStage,
    onAnnounceToScreenReader: utilities.announceToScreenReader,
  });

  const updateRemindersList = (newReminder: any) => {
    addReminder(newReminder);
  };

  const updateAppointmentsList = (newAppointment: any) => {
    addAppointment(newAppointment);
  };

  const updateInquiriesList = (newInquiry: any) => {
    addInquiry(newInquiry);
  };

  const updateReminderInList = (updatedReminder: any) => {
    updateReminder(updatedReminder.id.toString(), updatedReminder);
  };

  const updateAppointmentInList = (updatedAppointment: any) => {
    updateAppointment(updatedAppointment.id.toString(), updatedAppointment);
  };

  const updateInquiryInList = (updatedInquiry: any) => {
    updateInquiry(updatedInquiry.id.toString(), updatedInquiry);
  };

  const updateStagesList = (newStage: any) => {
    setPipelineStages([...pipelineStages, newStage]);
  };

  const updateStageInList = (updatedStage: any) => {
    setPipelineStages(
      pipelineStages.map((stage: PipelineStage) =>
        stage.id === updatedStage.id ? updatedStage : stage,
      ),
    );
  };

  const removeStageFromList = (stageId: string) => {
    setPipelineStages(
      pipelineStages.filter((stage: PipelineStage) => stage.id !== stageId),
    );
  };

  useEffect(() => {
    // التحقق من وجود التوكن قبل استدعاء الـ API
    if (userData?.token) {
      // جلب البيانات فقط إذا لم تكن موجودة في الـ cache
      if (shouldFetchData()) {
        fetchCrmData();
        fetchAppointmentsData();
        fetchRemindersData();
        fetchInquiriesData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.token]);

  const filteredCustomers = customersData.filter((customer: Customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.nameEn?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (customer.email?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (customer.phone_number || customer.phone || "").includes(searchTerm) ||
      (customer.city?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (customer.district?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );

    const matchesStage =
      filterStage === "all" ||
      customer.pipelineStage === filterStage ||
      (customer.stage_id && String(customer.stage_id) === filterStage);
    const matchesType =
      filterType === "all" || customer.customer_type === filterType;
    const matchesCity = filterCity === "all" || customer.city === filterCity;
    const matchesUrgency =
      filterUrgency === "all" ||
      (filterUrgency !== "all" && customer.urgency === filterUrgency);

    return (
      matchesSearch &&
      matchesStage &&
      matchesType &&
      matchesCity &&
      matchesUrgency
    );
  });

  const pipelineStats = pipelineStages
    .filter(
      (stage: PipelineStage) =>
        stage.id !== "unassigned" && stage.id !== "غير معين",
    )
    .map((stage: PipelineStage) => ({
      ...stage,
      count: customersData.filter((c: Customer) => {
        return (
          c.pipelineStage === stage.id ||
          (c.stage_id && String(c.stage_id) === stage.id)
        );
      }).length,
      value: customersData
        .filter((c: Customer) => {
          return (
            c.pipelineStage === stage.id ||
            (c.stage_id && String(c.stage_id) === stage.id)
          );
        })
        .reduce((sum: number, c: Customer) => sum + (c.dealValue || 0), 0),
    }));

  // Appointment statistics
  const allAppointments = customersData.flatMap(
    (customer: Customer) =>
      customer.appointments?.map((appointment: Appointment) => ({
        ...appointment,
        customer,
      })) || [],
  );
  const totalAppointments = allAppointments.length;
  const scheduledAppointments = allAppointments.filter(
    (app: Appointment) => app.status === "مجدول",
  ).length;
  const completedAppointments = allAppointments.filter(
    (app: Appointment) => app.status === "مكتمل",
  ).length;

  // Check if customer has note
  const checkCustomerHasNote = async (customerId: string): Promise<boolean> => {
    try {
      setLoadingCustomerCards(true);
      // customerId might be request_id, so try both
      // First try with request_id (most common case)
      try {
        const response = await axiosInstance.get(
          `/v1/crm/cards?card_request_id=${customerId}`
        );
        const cards = response.data?.data?.cards || response.data?.data || [];
        const hasNote = cards.some((card: any) => card.card_procedure === "note");
        setCustomerCards(cards);
        if (hasNote || cards.length > 0) {
          return hasNote;
        }
      } catch (err) {
        // If request_id fails, try customer_id
      }
      
      // Try with customer_id
      const response = await axiosInstance.get(
        `/v1/crm/cards?card_customer_id=${customerId}`
      );
      const cards = response.data?.data?.cards || response.data?.data || [];
      const hasNote = cards.some((card: any) => card.card_procedure === "note");
      setCustomerCards(cards);
      return hasNote;
    } catch (error) {
      console.error("Error checking customer notes:", error);
      return false;
    } finally {
      setLoadingCustomerCards(false);
    }
  };

  // Apply pending stage change after note is added
  const applyPendingStageChange = async () => {
    if (!pendingStageChange) return;
    
    const { customerId, stageId, originalStage, customerName } = pendingStageChange;
    
    // Apply the stage change
    updateCustomerStage(customerId, stageId);
    
    utilities.showSuccessAnimation(stageId);
    utilities.announceToScreenReader(`تم نقل العميل ${customerName} بنجاح`);
    
    // Call API
    const success = await updateCustomerStageAPI(customerId, stageId);
    if (!success) {
      // Revert if API fails
      updateCustomerStage(customerId, originalStage);
      utilities.announceToScreenReader(
        `فشل في نقل العميل ${customerName}`,
      );
    }
    
    // Clear pending change
    setPendingStageChange(null);
    setShowRequiredNoteDialog(false);
  };

  // Event handlers
  const handleRefresh = () => {
    refreshAllData();
  };

  const handleSettings = () => {
    setShowCrmSettingsDialog(true);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  const handleAddNote = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddNoteDialog(true);
  };

  const handleAddReminder = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddReminderDialog(true);
  };

  const handleAddGeneralReminder = () => {
    setShowAddReminderDialog(true);
  };

  const handleAddInteraction = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddInteractionDialog(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditAppointmentDialog(true);
  };

  const handleAddAppointment = () => {
    setShowAddAppointmentDialog(true);
  };

  const handleViewReminder = (reminder: any) => {
    setSelectedReminder(reminder);
  };

  const handleEditReminder = (reminder: any) => {
    setSelectedReminder(reminder);
    setShowEditReminderDialog(true);
  };

  const handleCompleteReminder = async (reminder: any) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/crm/reminders/${reminder.id}`,
        {
          status: "completed",
        },
      );
      if (response.data.status === "success") {
        const reminderResponse = response.data.data;
        const updatedReminder = {
          ...reminder,
          status: reminderResponse?.status || "completed",
          status_label: reminderResponse?.status_label || "Completed",
          status_label_ar: reminderResponse?.status_label_ar || "مكتمل",
        };
        updateReminderInList(updatedReminder);
      }
    } catch (err: any) {
      console.error("Error completing reminder:", err);
      alert(err.response?.data?.message_ar || err.response?.data?.message || "فشل في تحديث التذكير");
    }
  };

  const handleViewInquiry = (inquiry: any) => {
    // TODO: Implement inquiry detail view
  };

  const handleEditInquiry = (inquiry: any) => {
    // TODO: Implement inquiry edit
  };

  const handleAddInquiry = () => {
    // TODO: Implement add inquiry
  };

  const handleContactCustomer = (inquiry: any) => {
    // TODO: Implement contact customer
  };

  // عرض loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
          <CrmPageSkeleton />
      </div>
    );
  }

  // عرض error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <CrmHeader onRefresh={handleRefresh} onSettings={handleSettings} />

            {/* Statistics */}
            <CrmStatisticsCards
              statistics={
                crmData?.data?.statistics
                  ? {
                      total_requests:
                        crmData.data.statistics.total_requests || 0,
                      with_property: crmData.data.statistics.with_property || 0,
                      without_property:
                        crmData.data.statistics.without_property || 0,
                    }
                  : null
              }
            />

            {/* Filters */}
            <CrmFilters
              activeView={activeView}
              setActiveView={setActiveView}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStage={filterStage}
              setFilterStage={setFilterStage}
              filterUrgency={filterUrgency}
              setFilterUrgency={setFilterUrgency}
              pipelineStages={pipelineStages}
              onSearchResults={(results) => {}}
            />

            {/* Main Content */}
            {/* مراحل العملاء */}
            {activeView === "pipeline" && (
              <PipelineBoard
                pipelineStages={pipelineStages}
                customersData={customersData}
                filteredCustomers={filteredCustomers}
                isDragging={isDragging}
                draggedCustomer={dragPreview}
                dragOverStage={dragOverStage}
                focusedCustomer={focusedCustomer}
                onDragStart={enhancedDragDrop.handleDragStart}
                onDragEnd={enhancedDragDrop.handleDragEnd}
                onDragOver={enhancedDragDrop.handleDragOver}
                onDragLeave={enhancedDragDrop.handleDragLeave}
                onDrop={enhancedDragDrop.handleDrop}
                onKeyDown={keyboardNavigation.handleKeyDown}
                onViewDetails={handleViewDetails}
                onAddNote={handleAddNote}
                onAddReminder={handleAddReminder}
                onAddInteraction={handleAddInteraction}
                onUpdateCustomerStage={updateCustomerStageAPI}
              />
            )}

            {/* المواعيد */}
            {activeView === "appointments" && (
              <AppointmentsList
                appointmentsData={appointmentsData}
                searchTerm={searchTerm}
                filterStage={filterStage}
                filterUrgency={filterUrgency}
                onViewAppointment={handleViewAppointment}
                onEditAppointment={handleEditAppointment}
                onAddAppointment={handleAddAppointment}
              />
            )}

            {/* التذكيرات */}
            {activeView === "reminders" && (
              <RemindersList
                remindersData={remindersData.map((reminder: any) => ({
                  id:
                    typeof reminder.id === "string"
                      ? parseInt(reminder.id)
                      : reminder.id,
                  title: reminder.title,
                  priority:
                    typeof reminder.priority === "string"
                      ? parseInt(reminder.priority)
                      : reminder.priority,
                  priority_label: reminder.priority_label || "",
                  priority_label_ar: reminder.priority_label_ar || "",
                  datetime: reminder.datetime,
                  status: reminder.status || "pending",
                  status_label: reminder.status_label || "",
                  status_label_ar: reminder.status_label_ar || "",
                  customer: reminder.customer || { id: 0, name: "" },
                  reminder_type: reminder.reminder_type || undefined,
                  is_overdue: reminder.is_overdue,
                  days_until_due: reminder.days_until_due,
                }))}
                searchTerm={searchTerm}
                filterStage={filterStage}
                filterUrgency={filterUrgency}
                onViewReminder={handleViewReminder}
                onEditReminder={handleEditReminder}
                onAddReminder={handleAddGeneralReminder}
                onCompleteReminder={handleCompleteReminder}
              />
            )}

            {/* طلبات العملاء */}
            {activeView === "inquiry" && (
              <InquiryList
                onViewInquiry={handleViewInquiry}
                onEditInquiry={handleEditInquiry}
                onAddInquiry={handleAddInquiry}
                onContactCustomer={handleContactCustomer}
              />
            )}

            {/* التحليلات */}
            {activeView === "analytics" && (
              <CrmStatistics
                totalCustomers={totalCustomers}
                customersData={customersData}
                pipelineStages={pipelineStages}
                pipelineStats={pipelineStats}
                scheduledAppointments={scheduledAppointments}
                totalAppointments={totalAppointments}
              />
            )}

            {/* Drag Preview */}
            <DragDropHandler
              isDragging={isDragging}
              draggedCustomer={dragPreview}
              dragPreview={dragPreview}
              dragOffset={dragOffset}
              onMouseMove={enhancedDragDrop.handleMouseMove}
              onGlobalDragEnd={enhancedDragDrop.handleGlobalDragEnd}
              onGlobalDragCancel={enhancedDragDrop.handleGlobalDragCancel}
            />

            {/* Dialogs - Conditional Rendering */}
            {showCustomerDialog && <CustomerDetailDialog />}
            {showAddNoteDialog && <AddNoteDialog />}
            {showRequiredNoteDialog && pendingStageChange && (
              <RequiredNoteDialog
                open={showRequiredNoteDialog}
                onClose={() => {
                  setShowRequiredNoteDialog(false);
                  setPendingStageChange(null);
                }}
                onNoteAdded={applyPendingStageChange}
                customerId={pendingStageChange.customerId}
                customerName={pendingStageChange.customerName}
              />
            )}
            {showAddReminderDialog && (
              <AddReminderDialog onReminderAdded={updateRemindersList} />
            )}
            {showEditReminderDialog && (
              <EditReminderDialog onReminderUpdated={updateReminderInList} />
            )}
            {showAddAppointmentDialog && (
              <AddAppointmentDialog
                onAppointmentAdded={updateAppointmentsList}
              />
            )}
            {showEditAppointmentDialog && (
              <EditAppointmentDialog
                onAppointmentUpdated={updateAppointmentInList}
              />
            )}
            {showAddInteractionDialog && <AddInteractionDialog />}
            {showAddStageDialog && (
              <AddStageDialog onStageAdded={updateStagesList} />
            )}
            {showEditStageDialog && (
              <EditStageDialog onStageUpdated={updateStageInList} />
            )}
            {showCrmSettingsDialog && (
              <CrmSettingsDialog onStageDeleted={removeStageFromList} />
            )}
            {showAddDealDialog && (
              <AddDealDialog
                onDealAdded={() => {
                  refreshAllData();
                }}
              />
            )}
            {showAppointmentDetailDialog && (
              <div>Appointment Detail Dialog</div>
            )}
          </div>
        </main>
    </div>
  );
}
