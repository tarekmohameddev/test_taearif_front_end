// wrong data and functions
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set, get) => ({
  projectsManagement: {
    viewMode: "grid",
    projects: [],
    pagination: null,
    loading: true,
    error: null,
    isInitialized: false,
  },

  setProjectsManagement: (newState) =>
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        ...newState,
      },
    })),

  updateProject: (projectId, updatedData) => {
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        projects: state.projectsManagement.projects.map((project) => {
          if (project.id == projectId) {
            return {
              ...project,
              ...updatedData,
              contents: project.contents?.map((content, index) => ({
                ...content,
                title: index === 0 ? updatedData.name : content.title,
                address: index === 0 ? updatedData.location : content.address,
                description:
                  index === 0 ? updatedData.description : content.description,
              })),
            };
          }
          return project;
        }),
      },
    }));
  },

  // Rental Applications slice
  rentalApplications: {
    rentals: [],
    pagination: null,
    loading: false,
    error: null,
    searchTerm: "",
    filterStatus: "all",
    // New filters
    contractSearchTerm: "",
    contractStatusFilter: "all",
    paymentStatusFilter: "all",
    rentalMethodFilter: "all",
    buildingFilter: "all",
    unitFilter: "",
    projectFilter: "",
    dateFilter: "today",
    fromDate: "",
    toDate: "",
    contractCreatedFromDate: "",
    contractCreatedToDate: "",
    filterByYear: "",
    sortBy: "created_at",
    sortOrder: "desc",
    perPage: 20,
    selectedRental: null,
    isAddRentalDialogOpen: false,
    isEditRentalDialogOpen: false,
    editingRental: null,
    isSubmitting: false,
    isDeleteDialogOpen: false,
    deletingRental: null,
    isDeleting: false,
    isInitialized: false,
    lastProcessedOpenAddDialogCounter: -1,
    /** مفتاح آخر جلب (لمنع الطلبات المكررة) — PREVENT_DUPLICATE_API_PROMPT */
    lastFetchedRentalsKey: null,
    // Dialog states
    isRentalDetailsDialogOpen: false,
    selectedRentalId: null,
    isPaymentCollectionDialogOpen: false,
    selectedPaymentRentalId: null,
    showWhatsAppDialog: false,
    isRentalWhatsAppDialogOpen: false,
    selectedRentalForWhatsApp: null,
  },
  setRentalApplications: (newState) =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        ...newState,
      },
    })),

  // Dialog control functions
  openRentalDetailsDialog: (rentalId) =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        isRentalDetailsDialogOpen: true,
        selectedRentalId: rentalId,
      },
    })),

  closeRentalDetailsDialog: () =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        isRentalDetailsDialogOpen: false,
        selectedRentalId: null,
      },
    })),

  openPaymentCollectionDialog: (rentalId) =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        isPaymentCollectionDialogOpen: true,
        selectedPaymentRentalId: rentalId,
        // Close rental details dialog when opening payment collection
        isRentalDetailsDialogOpen: false,
        selectedRentalId: null,
      },
    })),

  closePaymentCollectionDialog: () =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        isPaymentCollectionDialogOpen: false,
        selectedPaymentRentalId: null,
      },
    })),

  openWhatsAppDialog: (rental) => {
    console.log("openWhatsAppDialog called with rental:", rental);
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        showWhatsAppDialog: true,
        selectedRental: rental,
        // Close rental details dialog when opening WhatsApp dialog
        isRentalDetailsDialogOpen: false,
        selectedRentalId: null,
      },
    }));
  },

  closeWhatsAppDialog: () =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        showWhatsAppDialog: false,
        selectedRental: null,
        selectedRentalId: null,
      },
    })),

  // Rental WhatsApp Dialog functions
  openRentalWhatsAppDialog: (rental) => {
    console.log("openRentalWhatsAppDialog called with rental:", rental);
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        isRentalWhatsAppDialogOpen: true,
        selectedRentalForWhatsApp: rental,
        // Close other dialogs when opening rental WhatsApp dialog
        isRentalDetailsDialogOpen: false,
        selectedRentalId: null,
        showWhatsAppDialog: false,
        selectedRental: null,
      },
    }));
  },

  closeRentalWhatsAppDialog: () =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        isRentalWhatsAppDialogOpen: false,
        selectedRentalForWhatsApp: null,
      },
    })),

  // Rental Maintenance slice
  rentalMaintenance: {
    requests: [],
    loading: true,
    searchTerm: "",
    filterStatus: "all",
    filterPriority: "all",
    selectedRequest: null,
    isCreateRequestDialogOpen: false,
    rentals: [],
    rentalsLoading: false,
    stats: { total: 0, open: 0, inProgress: 0, completed: 0, urgent: 0 },
    formData: {
      rental_id: 1,
      category: "",
      priority: "",
      title: "",
      description: "",
      estimated_cost: "",
      payer: "",
      payer_share_percent: 100,
      scheduled_date: "",
      assigned_to_vendor_id: null,
      notes: "",
    },
    requestsInitialized: false,
    rentalsInitialized: false,
    lastProcessedOpenCreateDialogCounter: -1,
  },
  setRentalMaintenance: (newState) =>
    set((state) => ({
      rentalMaintenance: {
        ...state.rentalMaintenance,
        ...newState,
      },
    })),

  // Rental Overview slice
  rentalOverview: {
    stats: null,
    recentActivity: [],
    loading: false,
    isInitialized: false,
  },
  setRentalOverview: (newState) =>
    set((state) => ({
      rentalOverview: {
        ...state.rentalOverview,
        ...newState,
      },
    })),

  fetchProjects: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/projects`,
      );

      set((state) => ({
        projectsManagement: {
          ...state.projectsManagement,
          projects: response.data.data.projects,
          pagination: response.data.data.pagination,
          loading: false,
          isInitialized: true,
        },
      }));
    } catch (error) {
      set((state) => ({
        projectsManagement: {
          ...state.projectsManagement,
          error: error.message || "حدث خطأ أثناء جلب بيانات المشاريع",
          loading: false,
          isInitialized: true,
        },
      }));
    }
  },
});
