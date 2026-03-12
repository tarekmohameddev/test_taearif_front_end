import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

// Store للبيانات الأساسية
const useDailyFollowupStore = create((set, get) => ({
  // البيانات الأساسية
  summaryData: null,
  paymentData: [],
  buildings: [],
  pagination: null,
  filters: null,

  // حالات التحميل والأخطاء
  loading: false,
  error: null,
  /** مفتاح آخر جلب (لمنع الطلبات المكررة) — PREVENT_DUPLICATE_API_PROMPT */
  lastFetchedDailyFollowupKey: null,

  // الفلاتر
  searchTerm: "",
  statusFilter: "upcoming",
  buildingFilter: "all",
  dateFilter: "today",
  fromDate: "",
  toDate: "",

  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 0,
  totalRecords: 0,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // تحديث الفلاتر
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setBuildingFilter: (buildingFilter) =>
    set({ buildingFilter, currentPage: 1 }),
  setDateFilter: (dateFilter) => set({ dateFilter, currentPage: 1 }),
  setFromDate: (fromDate) => set({ fromDate, currentPage: 1 }),
  setToDate: (toDate) => set({ toDate, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),

  // جلب البيانات من API
  fetchDailyFollowupData: async (params = {}) => {
    const state = get();
    const {
      searchTerm,
      statusFilter,
      buildingFilter,
      dateFilter,
      fromDate,
      toDate,
      currentPage,
      itemsPerPage,
      loading,
      lastFetchedDailyFollowupKey,
    } = state;

    if (dateFilter === "custom" && (!fromDate || !toDate)) {
      console.log("Custom date filter requires both from and to dates");
      return;
    }

    // بناء المعاملات للمفتاح والطلب
    let apiParams = {
      status: statusFilter,
      page: currentPage,
      per_page: itemsPerPage,
      ...params,
    };
    if (dateFilter === "custom") {
      if (fromDate) apiParams.from_date = fromDate;
      if (toDate) apiParams.to_date = toDate;
    } else if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      apiParams.from_date = today;
      apiParams.to_date = today;
    } else if (dateFilter === "week") {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      apiParams.from_date = weekStart.toISOString().split("T")[0];
      apiParams.to_date = weekEnd.toISOString().split("T")[0];
    } else if (dateFilter === "month") {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      apiParams.from_date = monthStart.toISOString().split("T")[0];
      apiParams.to_date = monthEnd.toISOString().split("T")[0];
    }
    if (buildingFilter && buildingFilter !== "all") {
      apiParams.building_id = buildingFilter;
    }
    const paramsKey = JSON.stringify(apiParams);

    if (loading) return;
    if (lastFetchedDailyFollowupKey === paramsKey) return;

    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get("/v1/rms/daily-follow-up", {
        params: apiParams,
      });

      if (response.data.status) {
        const data = response.data.data || [];
        const summary = response.data.summary || {};
        const pagination = response.data.pagination || {};
        const filters = response.data.filters || {};

        // استخراج المباني من البيانات
        const uniqueBuildings = new Map();
        data.forEach((item) => {
          if (item.building?.building_id) {
            const buildingId = item.building.building_id.toString();
            const buildingName = item.building.building_name;

            const displayName =
              buildingName && buildingName !== "N/A"
                ? buildingName
                : `العمارة ${buildingId}`;

            uniqueBuildings.set(buildingId, {
              id: buildingId,
              name: displayName,
            });
          }
        });

        const newTotalPages = pagination.last_page || 0;
        const currentState = get();

        set({
          paymentData: data,
          summaryData: summary,
          buildings: Array.from(uniqueBuildings.values()),
          pagination: pagination,
          filters: filters,
          totalPages: newTotalPages,
          totalRecords: pagination.total || 0,
          // إعادة تعيين currentPage إلى 1 إذا كان أكبر من totalPages الجديد
          currentPage:
            currentState.currentPage > newTotalPages
              ? 1
              : currentState.currentPage,
          loading: false,
          lastFetchedDailyFollowupKey: paramsKey,
        });

        return { data, summary, pagination, filters };
      } else {
        throw new Error(response.data.message || "فشل في جلب البيانات");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "حدث خطأ أثناء جلب البيانات";
      set({
        error: errorMessage,
        loading: false,
      });
      throw err;
    }
  },

  // إعادة تعيين الفلاتر
  resetFilters: () =>
    set({
      searchTerm: "",
      statusFilter: "upcoming",
      buildingFilter: "all",
      dateFilter: "today",
      fromDate: "",
      toDate: "",
      currentPage: 1,
      lastFetchedDailyFollowupKey: null,
    }),

  // Pagination Actions
  goToPage: (page) => {
    const state = get();
    const validPage = Math.max(1, Math.min(page, state.totalPages));
    set({ currentPage: validPage });
  },
  nextPage: () => {
    const state = get();
    if (state.currentPage < state.totalPages) {
      set({ currentPage: state.currentPage + 1 });
    }
  },
  prevPage: () => {
    const state = get();
    if (state.currentPage > 1) {
      set({ currentPage: state.currentPage - 1 });
    }
  },

  // التحقق من صحة الصفحة الحالية
  validateCurrentPage: () => {
    const state = get();
    if (state.currentPage > state.totalPages && state.totalPages > 0) {
      set({ currentPage: 1 });
    }
  },

  // تصفية البيانات محلياً
  getFilteredData: () => {
    const { paymentData, searchTerm, statusFilter } = get();

    if (!paymentData || paymentData.length === 0) return [];

    return paymentData.filter((item) => {
      if (!item) return false;

      // البحث في النص
      const matchesSearch =
        (item.tenant_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.unit_information?.unit_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.mobile_number || "").includes(searchTerm);

      // تصفية الحالة
      let matchesStatus = true;
      if (statusFilter === "overdue") {
        matchesStatus = item.payment_status === "overdue";
      } else if (statusFilter === "upcoming") {
        matchesStatus = item.payment_status === "pending";
      }

      return matchesSearch && matchesStatus;
    });
  },

  // تنسيق العملة
  formatCurrency: (amount, currency = "SAR") => {
    try {
      return new Intl.NumberFormat("ar-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch {
      return "مبلغ غير صحيح";
    }
  },

  // تنسيق التاريخ
  formatDate: (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "تاريخ غير صحيح";
    }
  },

  // الحصول على لون الحالة
  getStatusColor: (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800";
      case "upcoming":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  },

  // الحصول على نص الحالة
  getStatusText: (status) => {
    switch (status) {
      case "overdue":
        return "متأخر";
      case "upcoming":
      case "pending":
        return "قادم";
      default:
        return "غير محدد";
    }
  },
}));

export default useDailyFollowupStore;
