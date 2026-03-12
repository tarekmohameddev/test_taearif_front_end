import { create } from "zustand";

export const useRentalDashboardStore = create((set, get) => ({
  // البيانات الأساسية
  dashboardData: null,
  loading: false,
  error: null,
  isInitialized: false,
  /** مفتاح آخر جلب (لمنع الطلبات المكررة) — PREVENT_DUPLICATE_API_PROMPT */
  lastFetchedDashboardKey: null,

  // بيانات الإحصائيات
  counts: {
    ongoing_rentals: 0,
    expiring_contracts_next_30d: 0,
    payments_due_next_7d: 0,
    payments_overdue: 0,
    maintenance_open: 0,
    maintenance_in_progress: 0,
  },

  // بيانات المبالغ المالية
  rentalAmounts: {
    total_to_collect_this_month: 0,
    total_collected_this_month: 0,
    total_collected: 0,
    total_to_collect_next_month: 0,
    earliest_due_date_next_month: null,
    latest_due_date_next_month: null,
    all_due_dates_next_month: [],
    rented_properties_count: 0,
    currency: "SAR",
  },

  // الإيجارات الجارية
  ongoingRentals: [],

  // العقود المنتهية خلال 30 يوم
  expiringContractsNext30d: [],

  // التذكيرات
  reminders: [],

  // الصيانة
  maintenance: [],

  // Dialog states
  isOngoingRentalsDialogOpen: false,
  isExpiringContractsDialogOpen: false,
  isPaymentsDueDialogOpen: false,
  isPaymentsOverdueDialogOpen: false,
  isMaintenanceOpenDialogOpen: false,
  isMaintenanceInProgressDialogOpen: false,

  // Actions
  setDashboardData: (data) =>
    set({
      dashboardData: data,
      counts: data.counts || get().counts,
      rentalAmounts: data.rental_amounts || get().rentalAmounts,
      ongoingRentals: data.ongoing_rentals || [],
      expiringContractsNext30d: data.expiring_contracts_next_30d || [],
      reminders: data.reminders || [],
      maintenance: data.maintenance || [],
      isInitialized: true,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setLastFetchedDashboardKey: (key) => set({ lastFetchedDashboardKey: key }),

  // Dialog actions
  openOngoingRentalsDialog: () => set({ isOngoingRentalsDialogOpen: true }),
  closeOngoingRentalsDialog: () => set({ isOngoingRentalsDialogOpen: false }),

  openExpiringContractsDialog: () =>
    set({ isExpiringContractsDialogOpen: true }),
  closeExpiringContractsDialog: () =>
    set({ isExpiringContractsDialogOpen: false }),

  openPaymentsDueDialog: () => set({ isPaymentsDueDialogOpen: true }),
  closePaymentsDueDialog: () => set({ isPaymentsDueDialogOpen: false }),

  openPaymentsOverdueDialog: () => set({ isPaymentsOverdueDialogOpen: true }),
  closePaymentsOverdueDialog: () => set({ isPaymentsOverdueDialogOpen: false }),

  openMaintenanceOpenDialog: () => set({ isMaintenanceOpenDialogOpen: true }),
  closeMaintenanceOpenDialog: () => set({ isMaintenanceOpenDialogOpen: false }),

  openMaintenanceInProgressDialog: () =>
    set({ isMaintenanceInProgressDialogOpen: true }),
  closeMaintenanceInProgressDialog: () =>
    set({ isMaintenanceInProgressDialogOpen: false }),

  // Reset function
  reset: () =>
    set({
      dashboardData: null,
      loading: false,
      error: null,
      isInitialized: false,
      lastFetchedDashboardKey: null,
      counts: {
        ongoing_rentals: 0,
        expiring_contracts_next_30d: 0,
        payments_due_next_7d: 0,
        payments_overdue: 0,
        maintenance_open: 0,
        maintenance_in_progress: 0,
      },
      rentalAmounts: {
        total_to_collect_this_month: 0,
        total_collected_this_month: 0,
        total_collected: 0,
        total_to_collect_next_month: 0,
        earliest_due_date_next_month: null,
        latest_due_date_next_month: null,
        all_due_dates_next_month: [],
        rented_properties_count: 0,
        currency: "SAR",
      },
      ongoingRentals: [],
      expiringContractsNext30d: [],
      reminders: [],
      maintenance: [],
      isOngoingRentalsDialogOpen: false,
      isExpiringContractsDialogOpen: false,
      isPaymentsDueDialogOpen: false,
      isPaymentsOverdueDialogOpen: false,
      isMaintenanceOpenDialogOpen: false,
      isMaintenanceInProgressDialogOpen: false,
    }),
}));
