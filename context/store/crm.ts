import { create } from "zustand";
import { Customer, PipelineStage, Appointment } from "@/types/crm";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface Reminder {
  id: string | number;
  customer_id?: string;
  title: string;
  description?: string;
  datetime: string;
  status?: "pending" | "completed" | "overdue";
  priority: number | string;
  priority_label?: string;
  type?: "call" | "meeting" | "follow_up" | "other";
  customer?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface CrmProcedure {
  id: number;
  user_id: number;
  procedure_name: string;
  color: string;
  icon: string;
  order: number;
  description?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CrmPriority {
  id: number;
  user_id: number;
  name: string;
  value: number;
  color: string;
  icon: string;
  order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CrmType {
  id: number;
  user_id: number;
  name: string;
  value: string;
  color: string;
  icon: string;
  order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CrmStore {
  // CRM Data
  customers: Customer[];
  pipelineStages: PipelineStage[];
  appointments: Appointment[];
  reminders: Reminder[];
  procedures: CrmProcedure[];
  priorities: CrmPriority[];
  types: CrmType[];

  // Additional CRM Data
  crmData: any | null;
  inquiriesData: any[];
  totalCustomers: number;
  lastFetched: number | null;
  isInitialized: boolean;

  // Cache
  customersCache: Map<string, Customer>;
  stagesCache: Map<string, PipelineStage>;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Dialog states
  showCustomerDialog: boolean;
  showAddAppointmentDialog: boolean;
  showEditAppointmentDialog: boolean;
  showAppointmentDetailDialog: boolean;
  showAddNoteDialog: boolean;
  showAddReminderDialog: boolean;
  showEditReminderDialog: boolean;
  showAddInteractionDialog: boolean;
  showCrmSettingsDialog: boolean;
  showAddStageDialog: boolean;
  showEditStageDialog: boolean;
  showAddDealDialog: boolean;

  // Selected data
  selectedCustomer: Customer | null;
  selectedAppointment: Appointment | null;
  selectedStage: PipelineStage | null;
  selectedReminder: Reminder | null;

  // New stage data
  newStage: {
    name: string;
    description: string;
    color: string;
    iconName: string;
  };

  // New deal data (from popup)
  newDealData: {
    customer_name?: string;
    customer_phone?: string;
    stage_id?: string;
  } | null;

  // Actions
  setCustomers: (customers: Customer[]) => void;
  setPipelineStages: (stages: PipelineStage[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setReminders: (reminders: Reminder[]) => void;
  setProcedures: (procedures: CrmProcedure[]) => void;
  setPriorities: (priorities: CrmPriority[]) => void;
  setTypes: (types: CrmType[]) => void;
  updateCustomerStage: (customerId: string, newStageId: string) => Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  removeCustomer: (customerId: string) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminderId: string, updates: Partial<Reminder>) => void;
  removeReminder: (reminderId: string) => void;
  getCustomersByStage: (stageId: string) => Customer[];
  getCustomerById: (customerId: string) => Customer | undefined;
  getStageById: (stageId: string) => PipelineStage | undefined;
  getRemindersByCustomer: (customerId: string) => Reminder[];
  clearCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Dialog actions
  setShowCustomerDialog: (show: boolean) => void;
  setShowAddAppointmentDialog: (show: boolean) => void;
  setShowEditAppointmentDialog: (show: boolean) => void;
  setShowAppointmentDetailDialog: (show: boolean) => void;
  setShowAddNoteDialog: (show: boolean) => void;
  setShowAddReminderDialog: (show: boolean) => void;
  setShowEditReminderDialog: (show: boolean) => void;
  setShowAddInteractionDialog: (show: boolean) => void;
  setShowCrmSettingsDialog: (show: boolean) => void;
  setShowAddStageDialog: (show: boolean) => void;
  setShowEditStageDialog: (show: boolean) => void;
  setShowAddDealDialog: (show: boolean) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setSelectedStage: (stage: PipelineStage | null) => void;
  setSelectedReminder: (reminder: Reminder | null) => void;
  setNewStage: (stage: {
    name: string;
    description: string;
    color: string;
    iconName: string;
  }) => void;
  updateNewStage: (
    updates: Partial<{
      name: string;
      description: string;
      color: string;
      iconName: string;
    }>,
  ) => void;
  setNewDealData: (
    data: {
      customer_name?: string;
      customer_phone?: string;
      stage_id?: string;
    } | null,
  ) => void;
  clearNewDealData: () => void;

  // Data fetching functions
  fetchCrmData: () => Promise<void>;
  fetchAppointmentsData: () => Promise<void>;
  fetchRemindersData: () => Promise<void>;
  fetchInquiriesData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  shouldFetchData: () => boolean;

  // Additional actions
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (
    appointmentId: string,
    updates: Partial<Appointment>,
  ) => void;
  removeAppointment: (appointmentId: string) => void;
  addInquiry: (inquiry: any) => void;
  updateInquiry: (inquiryId: string, updates: Partial<any>) => void;
  removeInquiry: (inquiryId: string) => void;
  setCrmData: (data: any) => void;
  setInquiriesData: (data: any[]) => void;
  setTotalCustomers: (total: number) => void;
}

const useCrmStore = create<CrmStore>()(
  (set, get) => ({
      // CRM Data
      customers: [],
      pipelineStages: [],
      appointments: [],
      reminders: [],
      procedures: [],
      priorities: [],
      types: [],

      // Additional CRM Data
      crmData: null,
      inquiriesData: [],
      totalCustomers: 0,
      lastFetched: null,
      isInitialized: false,

      // Cache
      customersCache: new Map(),
      stagesCache: new Map(),

      // Loading states
      isLoading: false,
      error: null,

      // Dialog states
      showCustomerDialog: false,
      showAddAppointmentDialog: false,
      showEditAppointmentDialog: false,
      showAppointmentDetailDialog: false,
      showAddNoteDialog: false,
      showAddReminderDialog: false,
      showEditReminderDialog: false,
      showAddInteractionDialog: false,
      showCrmSettingsDialog: false,
      showAddStageDialog: false,
      showEditStageDialog: false,
      showAddDealDialog: false,

      // Selected data
      selectedCustomer: null,
      selectedAppointment: null,
      selectedStage: null,
      selectedReminder: null,

      // New stage data
      newStage: {
        name: "",
        description: "",
        color: "bg-blue-500",
        iconName: "Target",
      },

      // New deal data
      newDealData: null,

      // Actions
      setCustomers: (customers) => {
        // Update customers and cache in one operation for better performance
        const cache = new Map();
        customers.forEach((customer) => {
          cache.set(customer.id.toString(), customer);
        });
        set({
          customers,
          customersCache: cache,
        });
      },

      setPipelineStages: (stages) => {
        // Update stages and cache in one operation for better performance
        const cache = new Map();
        stages.forEach((stage) => {
          cache.set(stage.id, stage);
        });
        set({
          pipelineStages: stages,
          stagesCache: cache,
        });
      },

      setAppointments: (appointments) => {
        set({ appointments });
      },

      setReminders: (reminders) => {
        set({ reminders });
      },

      setProcedures: (procedures) => {
        set({ procedures });
      },

      setPriorities: (priorities) => {
        set({ priorities });
      },

      setTypes: (types) => {
        set({ types });
      },

      updateCustomerStage: (customerId, newStageId) => {
        const { customers, customersCache } = get();

        // Update in memory immediately
        const updatedCustomers = customers.map((customer) =>
          customer.id.toString() === customerId
            ? { ...customer, pipelineStage: newStageId }
            : customer,
        );

        // Update cache immediately
        const updatedCache = new Map(customersCache);
        const customer = updatedCache.get(customerId);
        if (customer) {
          updatedCache.set(customerId, {
            ...customer,
            pipelineStage: newStageId,
          });
        }

        // Update state immediately
        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });

        return updatedCustomers;
      },

      addCustomer: (customer) => {
        const { customers, customersCache } = get();
        const updatedCustomers = [...customers, customer];
        const updatedCache = new Map(customersCache);
        updatedCache.set(customer.id.toString(), customer);

        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
      },

      updateCustomer: (customerId, updates) => {
        const { customers, customersCache } = get();

        const updatedCustomers = customers.map((customer) =>
          customer.id.toString() === customerId
            ? { ...customer, ...updates }
            : customer,
        );

        const updatedCache = new Map(customersCache);
        const customer = updatedCache.get(customerId);
        if (customer) {
          updatedCache.set(customerId, { ...customer, ...updates });
        }

        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
      },

      removeCustomer: (customerId) => {
        const { customers, customersCache } = get();
        const updatedCustomers = customers.filter(
          (customer) => customer.id.toString() !== customerId,
        );
        const updatedCache = new Map(customersCache);
        updatedCache.delete(customerId);

        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
      },

      addReminder: (reminder) => {
        const { reminders } = get();
        const updatedReminders = [...reminders, reminder];
        set({ reminders: updatedReminders });
      },

      updateReminder: (reminderId, updates) => {
        const { reminders } = get();
        const updatedReminders = reminders.map((reminder) =>
          reminder.id === reminderId ? { ...reminder, ...updates } : reminder,
        );
        set({ reminders: updatedReminders });
      },

      removeReminder: (reminderId) => {
        const { reminders } = get();
        const updatedReminders = reminders.filter(
          (reminder) => reminder.id !== reminderId,
        );
        set({ reminders: updatedReminders });
      },

      // Get customers by stage
      getCustomersByStage: (stageId) => {
        const { customers } = get();
        return customers.filter(
          (customer) => customer.pipelineStage === stageId,
        );
      },

      // Get customer by ID
      getCustomerById: (customerId) => {
        const { customersCache } = get();
        return customersCache.get(customerId);
      },

      // Get stage by ID
      getStageById: (stageId) => {
        const { stagesCache } = get();
        return stagesCache.get(stageId);
      },

      // Get reminders by customer
      getRemindersByCustomer: (customerId) => {
        const { reminders } = get();
        return reminders.filter(
          (reminder) => reminder.customer_id === customerId,
        );
      },

      // Clear cache
      clearCache: () => {
        set({
          customersCache: new Map(),
          stagesCache: new Map(),
        });
      },

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Set error
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),

      // Dialog actions
      setShowCustomerDialog: (show) => set({ showCustomerDialog: show }),
      setShowAddAppointmentDialog: (show) =>
        set({ showAddAppointmentDialog: show }),
      setShowEditAppointmentDialog: (show) =>
        set({ showEditAppointmentDialog: show }),
      setShowAppointmentDetailDialog: (show) =>
        set({ showAppointmentDetailDialog: show }),
      setShowAddNoteDialog: (show) => set({ showAddNoteDialog: show }),
      setShowAddReminderDialog: (show) => set({ showAddReminderDialog: show }),
      setShowEditReminderDialog: (show) =>
        set({ showEditReminderDialog: show }),
      setShowAddInteractionDialog: (show) =>
        set({ showAddInteractionDialog: show }),
      setShowCrmSettingsDialog: (show) => set({ showCrmSettingsDialog: show }),
      setShowAddStageDialog: (show) => set({ showAddStageDialog: show }),
      setShowEditStageDialog: (show) => set({ showEditStageDialog: show }),
      setShowAddDealDialog: (show) => set({ showAddDealDialog: show }),
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      setSelectedAppointment: (appointment) =>
        set({ selectedAppointment: appointment }),
      setSelectedStage: (stage) => set({ selectedStage: stage }),
      setSelectedReminder: (reminder) => set({ selectedReminder: reminder }),
      setNewStage: (stage) => set({ newStage: stage }),
      updateNewStage: (updates) => {
        const { newStage } = get();
        set({ newStage: { ...newStage, ...updates } });
      },
      setNewDealData: (data) => set({ newDealData: data }),
      clearNewDealData: () => set({ newDealData: null }),

      // Helper function for priority label
      getPriorityLabel: (priority: number) => {
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
      },

      // Check if data should be fetched
      shouldFetchData: () => {
        const { isInitialized, customers, pipelineStages } = get();
        // Fetch if not initialized or if data is empty
        return (
          !isInitialized ||
          customers.length === 0 ||
          pipelineStages.length === 0
        );
      },

      // Set CRM data
      setCrmData: (data) => set({ crmData: data }),
      setInquiriesData: (data) => set({ inquiriesData: data }),
      setTotalCustomers: (total) => set({ totalCustomers: total }),

      // Add appointment
      addAppointment: (appointment) => {
        const { appointments } = get();
        set({ appointments: [...appointments, appointment] });
      },

      // Update appointment
      updateAppointment: (appointmentId, updates) => {
        const { appointments } = get();
        const updatedAppointments = appointments.map((appointment) =>
          appointment.id.toString() === appointmentId
            ? { ...appointment, ...updates }
            : appointment,
        );
        set({ appointments: updatedAppointments });
      },

      // Remove appointment
      removeAppointment: (appointmentId) => {
        const { appointments } = get();
        const updatedAppointments = appointments.filter(
          (appointment) => appointment.id.toString() !== appointmentId,
        );
        set({ appointments: updatedAppointments });
      },

      // Add inquiry
      addInquiry: (inquiry) => {
        const { inquiriesData } = get();
        set({ inquiriesData: [...inquiriesData, inquiry] });
      },

      // Update inquiry
      updateInquiry: (inquiryId, updates) => {
        const { inquiriesData } = get();
        const updatedInquiries = inquiriesData.map((inquiry) =>
          inquiry.id.toString() === inquiryId
            ? { ...inquiry, ...updates }
            : inquiry,
        );
        set({ inquiriesData: updatedInquiries });
      },

      // Remove inquiry
      removeInquiry: (inquiryId) => {
        const { inquiriesData } = get();
        const updatedInquiries = inquiriesData.filter(
          (inquiry) => inquiry.id.toString() !== inquiryId,
        );
        set({ inquiriesData: updatedInquiries });
      },

      // Fetch CRM data
      fetchCrmData: async () => {
        const userData = useAuthStore.getState().userData;
        if (!userData?.token) {
          console.log("No token available, skipping fetchCrmData");
          return;
        }

        const {
          setLoading,
          setError,
          setCustomers,
          setPipelineStages,
          setCrmData,
          setTotalCustomers,
        } = get();
        setLoading(true);
        setError(null);

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
            setTotalCustomers(
              statistics?.total_requests || allCustomers.length,
            );
            set({ lastFetched: Date.now(), isInitialized: true });
          }
        } catch (err: any) {
          console.error("Error fetching CRM data:", err);
          setError(
            err.response?.data?.message || "فشل في تحميل بيانات الـ CRM",
          );
        } finally {
          setLoading(false);
        }
      },

      // Fetch appointments data
      fetchAppointmentsData: async () => {
        const userData = useAuthStore.getState().userData;
        if (!userData?.token) {
          console.log("No token available, skipping fetchAppointmentsData");
          return;
        }

        const { setAppointments } = get();
        try {
          const response = await axiosInstance.get(
            "/crm/customer-appointments",
          );
          const appointmentsResponse = response.data;

          if (appointmentsResponse.status === "success") {
            setAppointments(appointmentsResponse.data || []);
          }
        } catch (err) {
          console.error("Error fetching appointments data:", err);
        }
      },

      // Fetch reminders data
      fetchRemindersData: async () => {
        const userData = useAuthStore.getState().userData;
        if (!userData?.token) {
          console.log("No token available, skipping fetchRemindersData");
          return;
        }

        const { setReminders } = get();
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
            setReminders(transformedReminders);
          }
        } catch (err) {
          console.error("Error fetching reminders data:", err);
        }
      },

      // Fetch inquiries data
      fetchInquiriesData: async () => {
        const userData = useAuthStore.getState().userData;
        if (!userData?.token) {
          console.log("No token available, skipping fetchInquiriesData");
          return;
        }

        const { setInquiriesData } = get();
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

      // Refresh all data
      refreshAllData: async () => {
        const {
          fetchCrmData,
          fetchAppointmentsData,
          fetchRemindersData,
          fetchInquiriesData,
        } = get();
        await Promise.all([
          fetchCrmData(),
          fetchAppointmentsData(),
          fetchRemindersData(),
          fetchInquiriesData(),
        ]);
      },
    }),
);

export default useCrmStore;
