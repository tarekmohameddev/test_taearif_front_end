"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Customer, PipelineStage, Appointment } from "@/types/crm";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
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
  DataHandler,
  Utilities,
  CustomerDetailDialog,
  AddNoteDialog,
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

  return (
    <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="ml-2 h-4 w-4" />
            إجمالي الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">
            {statistics.total_requests || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Home className="ml-2 h-4 w-4" />
            مع عقار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">
            {statistics.with_property || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileQuestion className="ml-2 h-4 w-4" />
            بدون عقار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">
            {statistics.without_property || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function CrmPage() {
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRM data states
  const [crmData, setCrmData] = useState<any>(null);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [remindersData, setRemindersData] = useState<
    {
      id: number;
      title: string;
      priority: number;
      priority_label: string;
      datetime: string;
      customer: {
        id: number;
        name: string;
      };
    }[]
  >([]);
  const [inquiriesData, setInquiriesData] = useState<any[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Get data from store
  const {
    customers: rawCustomersData,
    pipelineStages: rawPipelineStages,
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
  } = useCrmStore();
  const { userData } = useAuthStore();

  // Ensure pipelineStages is always an array
  const pipelineStages = Array.isArray(rawPipelineStages)
    ? rawPipelineStages
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

  // Initialize handlers
  const dataHandler = {
    fetchCrmData: async () => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        console.log("No token available, skipping fetchCrmData");
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get("/v1/crm/requests");
        const crmData = response.data;

        if (crmData.status === "success") {
          const { stages, statistics } = crmData.data || {};

          // Transform stages data from new API format
          const transformedStages = (stages || []).map((stage: any) => ({
            id: String(stage.id),
            name: stage.stage_name,
            color: stage.color || "#6366f1",
            icon: stage.icon || "Target",
            count: stage.requests?.length || 0,
            value: 0,
          }));

          // Transform requests to customers format for compatibility
          const allCustomers = (stages || []).flatMap((stage: any) =>
            (stage.requests || []).map((request: any) => {
              const customer = request.customer || {};
              const propertyBasic = request.property_basic || {};
              const propertySpecs = request.property_specifications || {};

              // Extract property data
              const basicInfo = propertySpecs.basic_information || {};
              const facilities = propertySpecs.facilities || {};

              return {
                // Request data
                id: request.id,
                request_id: request.id,
                user_id: request.user_id || 0,
                stage_id: request.stage_id || stage.id,
                property_id: request.property_id,
                has_property: request.has_property || false,
                property_source: request.property_source || null,
                position: request.position || 0,
                created_at: request.created_at || "",
                updated_at: request.updated_at || "",

                // Customer data
                customer_id: customer.id || request.customer_id,
                name: customer.name || "",
                phone_number: customer.phone_number || "",
                phone: customer.phone_number || "",
                email: null,
                note: null,
                customer_type: null,
                priority: customer.priority_id || 1,
                priority_id: customer.priority_id || null,
                type_id: customer.type_id || null,
                procedure_id: null,
                city_id: null,
                district_id: null,
                responsible_employee: customer.responsible_employee || null,

                // Backward compatibility fields
                nameEn: customer.name || "",
                whatsapp: "",
                city: propertyBasic.address
                  ? propertyBasic.address.split(",")[1]?.trim() || ""
                  : "",
                district: "",
                assignedAgent: "",
                lastContact: "",
                urgency: customer.priority_id
                  ? getPriorityLabel(customer.priority_id)
                  : "",
                pipelineStage: String(request.stage_id || stage.id),
                dealValue: propertyBasic.price
                  ? parseFloat(propertyBasic.price)
                  : basicInfo.price || 0,
                probability: 0,
                avatar: propertyBasic.featured_image || "",
                reminders: [],
                interactions: [],
                appointments: [],
                notes: "",
                joinDate: request.created_at || "",
                nationality: "",
                familySize: 0,
                leadSource: "",
                satisfaction: 0,
                communicationPreference: "",
                expectedCloseDate: "",

                // Property data (for compatibility)
                property_basic: propertyBasic,
                property_specifications: propertySpecs,
              };
            }),
          );

          // Update store
          setPipelineStages(transformedStages);
          setCustomers(allCustomers);
          setCrmData(crmData);
          setTotalCustomers(statistics?.total_requests || allCustomers.length);
        }
      } catch (err) {
        console.error("Error fetching CRM data:", err);
        setError("فشل في تحميل بيانات الـ CRM");
      } finally {
        setLoading(false);
      }
    },
    fetchAppointmentsData: async () => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        console.log("No token available, skipping fetchAppointmentsData");
        return;
      }

      try {
        const response = await axiosInstance.get("/crm/customer-appointments");
        const appointmentsResponse = response.data;

        if (appointmentsResponse.status === "success") {
          setAppointmentsData(appointmentsResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching appointments data:", err);
      }
    },
    fetchRemindersData: async () => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        console.log("No token available, skipping fetchRemindersData");
        return;
      }

      try {
        const response = await axiosInstance.get("/crm/customer-reminders");
        const remindersResponse = response.data;

        if (remindersResponse.status === "success") {
          // Transform API data to match component interface
          const transformedReminders = (remindersResponse.data || []).map(
            (reminder: any) => ({
              id: reminder.id,
              title: reminder.title,
              priority: reminder.priority,
              priority_label: reminder.priority_label,
              datetime: reminder.datetime,
              customer: reminder.customer,
            }),
          );
          setRemindersData(transformedReminders);
        }
      } catch (err) {
        console.error("Error fetching reminders data:", err);
      }
    },
    fetchInquiriesData: async () => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        console.log("No token available, skipping fetchInquiriesData");
        return;
      }

      try {
        const response = await axiosInstance.get("/v1/inquiry");
        const inquiriesResponse = response.data;

        if (inquiriesResponse.status === "success") {
          setInquiriesData(inquiriesResponse.data.inquiries || []);
        }
      } catch (err) {
        console.error("Error fetching inquiries data:", err);
      }
    },
    updateCustomerStage: async (customerId: string, stageId: string) => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        console.log("No token available, skipping updateCustomerStage");
        return false;
      }

      try {
        // Use a faster timeout for better UX
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        // customerId is actually request_id in new API format
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

        if (
          response.data.status === "success" ||
          response.data.status === true
        ) {
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error updating customer stage:", err);
        return false;
      }
    },
    updateCustomer: async (customerId: string, updates: any) => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        console.log("No token available, skipping updateCustomer");
        return false;
      }

      try {
        await axiosInstance.put(`/crm/customers/${customerId}`, updates);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
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

        updateCustomerStage(dragPreview.id.toString(), stageId);

        utilities.showSuccessAnimation(stageId);
        utilities.announceToScreenReader(`تم نقل العميل ${customerName} بنجاح`);

        dataHandler
          .updateCustomerStage(dragPreview.id.toString(), stageId)
          .then((success) => {
            if (!success) {
              // Revert if API fails
              updateCustomerStage(
                dragPreview.id.toString(),
                originalStage || "",
              );
              utilities.announceToScreenReader(
                `فشل في نقل العميل ${customerName}`,
              );
            }
          })
          .catch((error) => {
            // Revert if API fails
            updateCustomerStage(dragPreview.id.toString(), originalStage || "");
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
      const success = await dataHandler.updateCustomerStage(
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
    setRemindersData((prev) => [newReminder, ...prev]);
  };

  const updateAppointmentsList = (newAppointment: any) => {
    setAppointmentsData((prev) => [newAppointment, ...prev]);
  };

  const updateInquiriesList = (newInquiry: any) => {
    setInquiriesData((prev) => [newInquiry, ...prev]);
  };

  const updateReminderInList = (updatedReminder: any) => {
    setRemindersData((prev) =>
      prev.map((reminder) =>
        reminder.id === updatedReminder.id ? updatedReminder : reminder,
      ),
    );
  };

  const updateAppointmentInList = (updatedAppointment: any) => {
    setAppointmentsData((prev) =>
      prev.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? updatedAppointment
          : appointment,
      ),
    );
  };

  const updateInquiryInList = (updatedInquiry: any) => {
    setInquiriesData((prev) =>
      prev.map((inquiry) =>
        inquiry.id === updatedInquiry.id ? updatedInquiry : inquiry,
      ),
    );
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
      dataHandler.fetchCrmData();
      dataHandler.fetchAppointmentsData();
      dataHandler.fetchRemindersData();
      dataHandler.fetchInquiriesData();
    }
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

  const pipelineStats = pipelineStages.map((stage: PipelineStage) => ({
    ...stage,
    count: customersData.filter((c: Customer) => {
      if (stage.id === "unassigned") {
        return !c.pipelineStage && !c.stage_id;
      }
      return (
        c.pipelineStage === stage.id ||
        (c.stage_id && String(c.stage_id) === stage.id)
      );
    }).length,
    value: customersData
      .filter((c: Customer) => {
        if (stage.id === "unassigned") {
          return !c.pipelineStage && !c.stage_id;
        }
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

  // Event handlers
  const handleRefresh = () => {
    dataHandler.fetchCrmData();
    dataHandler.fetchAppointmentsData();
    dataHandler.fetchRemindersData();
    dataHandler.fetchInquiriesData();
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
        `/crm/customer-reminders/${reminder.id}`,
        {
          status: "completed",
        },
      );
      if (response.data.status === "success") {
        const updatedReminder = {
          ...reminder,
          status: "completed",
        };
        updateReminderInList(updatedReminder);
      }
    } catch (err) {
      console.error("Error completing reminder:", err);
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
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <CrmPageSkeleton />
        </div>
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
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
                onUpdateCustomerStage={dataHandler.updateCustomerStage}
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
                remindersData={remindersData}
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
                  dataHandler.fetchCrmData();
                  dataHandler.fetchAppointmentsData();
                  dataHandler.fetchRemindersData();
                }}
              />
            )}
            {showAppointmentDetailDialog && (
              <div>Appointment Detail Dialog</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
