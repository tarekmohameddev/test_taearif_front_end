import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

// Store للعقود
const useContractsStore = create((set, get) => ({
  // البيانات الأساسية
  contractsData: [],
  summaryData: null,
  buildings: [],
  pagination: null,
  filters: null,

  // حالات التحميل والأخطاء
  loading: false,
  error: null,
  /** مفتاح آخر جلب (لمنع الطلبات المكررة) — PREVENT_DUPLICATE_API_PROMPT */
  lastFetchedContractsKey: null,

  // الفلاتر
  searchTerm: "",
  contractStatusFilter: "active",
  paymentStatusFilter: "all",
  rentalMethodFilter: "all",
  buildingFilter: "all",
  dateFilter: "today",

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
  setContractStatusFilter: (contractStatusFilter) =>
    set({ contractStatusFilter, currentPage: 1 }),
  setPaymentStatusFilter: (paymentStatusFilter) =>
    set({ paymentStatusFilter, currentPage: 1 }),
  setRentalMethodFilter: (rentalMethodFilter) =>
    set({ rentalMethodFilter, currentPage: 1 }),
  setBuildingFilter: (buildingFilter) =>
    set({ buildingFilter, currentPage: 1 }),
  setDateFilter: (dateFilter) => set({ dateFilter, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),

  // جلب البيانات من API العقود
  fetchContractsData: async (params = {}) => {
    const state = get();
    const {
      searchTerm,
      contractStatusFilter,
      paymentStatusFilter,
      rentalMethodFilter,
      buildingFilter,
      dateFilter,
      currentPage,
      itemsPerPage,
      loading,
      lastFetchedContractsKey,
    } = state;

    // بناء المعاملات أولاً لاستخدامها في مفتاح التخزين المؤقت
    const apiParams = {
      page: currentPage,
      per_page: itemsPerPage,
      ...params,
    };
    if (contractStatusFilter && contractStatusFilter !== "active") {
      apiParams.contract_status = contractStatusFilter;
    }
    if (buildingFilter && buildingFilter !== "all") {
      apiParams.building_id = buildingFilter;
    }
    if (rentalMethodFilter && rentalMethodFilter !== "all") {
      apiParams.rental_method = rentalMethodFilter;
    }
    if (paymentStatusFilter && paymentStatusFilter !== "all") {
      apiParams.payment_status = paymentStatusFilter;
    }
    const paramsKey = JSON.stringify(apiParams);

    // PREVENT_DUPLICATE_API: loading guard
    if (loading) return;
    // PREVENT_DUPLICATE_API: last-fetched guard
    if (lastFetchedContractsKey === paramsKey) return;

    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get("/v1/rms/contracts", {
        params: apiParams,
      });

      if (response.data.status) {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {};

        // إنشاء summary من البيانات
        const summary = {
          total_records: pagination.total || data.length,
          total_amount_due: data.reduce(
            (sum, item) => sum + (item.rent_amount || 0),
            0,
          ),
          total_arrears: 0, // يمكن حسابها لاحقاً
          total_overdue_arrears: 0, // يمكن حسابها لاحقاً
        };

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
          contractsData: data,
          summaryData: summary,
          buildings: Array.from(uniqueBuildings.values()),
          pagination: pagination,
          totalPages: newTotalPages,
          totalRecords: pagination.total || 0,
          currentPage:
            currentState.currentPage > newTotalPages
              ? 1
              : currentState.currentPage,
          loading: false,
          lastFetchedContractsKey: paramsKey,
        });

        console.log("Contracts data loaded:", data);
        return { data, summary, pagination };
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
      contractStatusFilter: "active",
      paymentStatusFilter: "all",
      rentalMethodFilter: "all",
      buildingFilter: "all",
      dateFilter: "today",
      currentPage: 1,
      lastFetchedContractsKey: null,
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
    const {
      contractsData,
      searchTerm,
      contractStatusFilter,
      paymentStatusFilter,
    } = get();

    if (!contractsData || contractsData.length === 0) return [];

    return contractsData.filter((item) => {
      if (!item) return false;

      // البحث في النص
      const matchesSearch =
        (item.tenant_information?.tenant_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.unit_information?.unit_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.tenant_information?.tenant_phone || "").includes(searchTerm);

      // تصفية حالة العقد
      const matchesContractStatus =
        contractStatusFilter === "all" ||
        item.contract_status === contractStatusFilter;

      // تصفية حالة الدفع
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        item.payment_status === paymentStatusFilter;

      return matchesSearch && matchesContractStatus && matchesPaymentStatus;
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

  // الحصول على لون حالة العقد
  getContractStatusColor: (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  },

  // الحصول على نص حالة العقد
  getContractStatusText: (status) => {
    switch (status) {
      case "active":
        return "نشط";
      case "expired":
        return "منتهي";
      case "pending":
        return "معلق";
      case "terminated":
        return "ملغي/موقوف";
      default:
        return "غير محدد";
    }
  },

  // الحصول على لون حالة الدفع
  getPaymentStatusColor: (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "not_due":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  },

  // الحصول على نص حالة الدفع
  getPaymentStatusText: (status) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "pending":
        return "مستحق";
      case "overdue":
        return "متأخر";
      case "not_due":
        return "غير مستحق";
      default:
        return "غير محدد";
    }
  },
}));

export default useContractsStore;
