"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export interface Property {
  id: string;
  slug: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  transactionType: string;
  image: string;
  status: string;
  createdAt: string;
  description: string;
  features: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
}

export interface PropertiesResponse {
  properties: Property[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

type FilterType = "all" | "available" | "sold" | "rented";

interface PropertiesStore {
  // State
  allProperties: Property[]; // جميع العقارات المحفوظة
  filteredProperties: Property[]; // العقارات المفلترة
  loading: boolean;
  error: string | null;
  total: number;
  tenantId: string | null; // معرف المستأجر

  // Pagination State
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };

  // Filter State
  transactionType: "rent" | "sale";
  activeFilter: FilterType;
  search: string; // للعرض فقط
  cityId: string; // إضافة cityId للفلتر
  district: string; // إضافة district للفلتر
  propertyType: string;
  categoryId: string; // إضافة categoryId للفلتر
  price: string;

  // Actions
  setTransactionType: (type: "rent" | "sale") => void;
  setActiveFilter: (filter: FilterType) => void;
  setSearch: (search: string) => void;
  setCityId: (cityId: string) => void; // إضافة setCityId
  setDistrict: (district: string) => void; // إضافة setDistrict
  setPropertyType: (type: string) => void;
  setCategoryId: (categoryId: string) => void; // إضافة setCategoryId
  setPrice: (price: string) => void;

  // Pagination Actions
  setCurrentPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;

  // API Actions
  setTenantId: (tenantId: string | null) => void; // تعيين معرف المستأجر
  fetchProperties: (page?: number) => Promise<void>; // جلب العقارات مع pagination
  fetchAllProperties: () => Promise<void>; // جلب جميع العقارات مرة واحدة (للتوافق العكسي)
  clearFilters: () => void;

  // Local Filtering
  applyFilters: () => void; // تطبيق الفلاتر محلياً

  // Computed
  getStatusFromFilter: (
    filter: FilterType,
  ) => "all" | "available" | "rented" | "sold";
}

export const usePropertiesStore = create<PropertiesStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      allProperties: [], // جميع العقارات
      filteredProperties: [], // العقارات المفلترة
      loading: false,
      error: null,
      total: 0,
      tenantId: null, // معرف المستأجر

      // Pagination State
      pagination: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
      },

      // Filter State
      transactionType: "rent",
      activeFilter: "all",
      search: "",
      cityId: "", // إضافة cityId للـ initial state
      district: "", // إضافة district للـ initial state
      propertyType: "",
      categoryId: "", // إضافة categoryId للـ initial state
      price: "",

      // Actions
      setTransactionType: (type) => {
        set({ transactionType: type });
        // لا تقم بالجلب تلقائياً؛ يتم الجلب عند الضغط على زر البحث
      },

      setActiveFilter: (filter) => {
        set({ activeFilter: filter });
        // لا تقم بالجلب تلقائياً؛ يتم الجلب عند الضغط على زر البحث
      },

      setSearch: (search) => {
        console.log("🔍 [propertiesStore] setSearch called:", search);
        set({ search });
        // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
      },

      setCityId: (cityId) => {
        set({ cityId });
        // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
      },

      setDistrict: (district) => {
        set({ district });
        // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
      },

      setPropertyType: (type) => {
        console.log("🏠 [propertiesStore] setPropertyType called:", type);
        set({ propertyType: type });
        // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
      },

      setCategoryId: (categoryId) => {
        set({ categoryId });
        // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
      },

      setPrice: (price) => {
        console.log("💰 [propertiesStore] setPrice called:", price);
        set({ price });
        // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
      },

      // Pagination Actions
      setCurrentPage: (page) => {
        get().fetchProperties(page);
      },

      goToNextPage: () => {
        const state = get();
        if (state.pagination.current_page < state.pagination.last_page) {
          get().fetchProperties(state.pagination.current_page + 1);
        }
      },

      goToPreviousPage: () => {
        const state = get();
        if (state.pagination.current_page > 1) {
          get().fetchProperties(state.pagination.current_page - 1);
        }
      },

      // API Actions
      setTenantId: (tenantId) => {
        console.log("setTenantId called with:", tenantId);
        set({ tenantId });
        // جلب البيانات تلقائياً عند تعيين tenantId
        if (tenantId) {
          get().fetchProperties(1);
        }
      },

      fetchProperties: async (page = 1) => {
        const state = get();
        console.log(
          "fetchProperties called with page:",
          page,
          "tenantId:",
          state.tenantId,
        );

        // منع الـ duplicate calls
        if (state.loading) {
          console.log("fetchProperties: Already loading, skipping");
          return;
        }

        set({ loading: true, error: null });

        try {
          // الحصول على tenantId من الـ store
          if (!state.tenantId) {
            set({ loading: false });
            return;
          }

          const tenantId = state.tenantId;

          // بناء URL مع pagination والفلاتر
          const params = new URLSearchParams();
          params.append("page", page.toString());

          if (state.transactionType) {
            params.append("purpose", state.transactionType);
          }
          if (state.activeFilter && state.activeFilter !== "all") {
            params.append("status", state.activeFilter);
          }
          if (state.categoryId) {
            params.append("category_id", state.categoryId);
          }
          if (state.cityId) {
            params.append("city_id", state.cityId);
          }
          if (state.district) {
            params.append("state_id", state.district);
          }
          if (state.price) {
            params.append("max_price", state.price);
          }
          if (state.search) {
            params.append("search", state.search);
          }
          if (state.propertyType) {
            params.append("type_id", state.propertyType);
          }

          const url = `/v1/tenant-website/${tenantId}/properties?${params.toString()}`;

          // Debug: طباعة الـ parameters المرسلة
          console.log("Properties API Request Parameters:", {
            tenantId,
            transactionType: state.transactionType,
            activeFilter: state.activeFilter,
            categoryId: state.categoryId,
            cityId: state.cityId,
            district: state.district,
            search: state.search,
            propertyType: state.propertyType,
            price: state.price,
            url: url,
          });

          const response = await axiosInstance.get(url);

          const result: PropertiesResponse = response.data;

          // Debug: طباعة الـ response
          console.log("Properties API Response:", {
            hasProperties: !!result.properties,
            propertiesCount: result.properties?.length || 0,
            pagination: result.pagination,
            fullResponse: result,
          });

          if (result.properties) {
            set({
              allProperties: result.properties, // حفظ العقارات الحالية
              filteredProperties: result.properties, // عرض العقارات الحالية
              loading: false,
              total: result.pagination.total,
              pagination: result.pagination,
            });

            // Debug: طباعة الـ state بعد الحفظ
            console.log("Properties saved to store:", {
              allPropertiesCount: result.properties.length,
              filteredPropertiesCount: result.properties.length,
              total: result.pagination.total,
              pagination: result.pagination,
            });
          } else {
            // Handle empty results - clear the store
            set({
              allProperties: [],
              filteredProperties: [],
              loading: false,
              total: 0,
              pagination: result.pagination || {
                total: 0,
                per_page: 20,
                current_page: 1,
                last_page: 1,
                from: 0,
                to: 0,
              },
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      fetchAllProperties: async () => {
        const state = get();

        // منع الـ duplicate calls
        if (state.loading) {
          return;
        }

        set({ loading: true, error: null });

        try {
          // الحصول على tenantId من الـ store
          if (!state.tenantId) {
            set({ loading: false });
            return;
          }

          const tenantId = state.tenantId;

          // جلب جميع العقارات من الـ API الجديد
          const url = `/v1/tenant-website/${tenantId}/properties`;

          const response = await axiosInstance.get(url);

          const result: PropertiesResponse = response.data;

          if (result.properties) {
            set({
              allProperties: result.properties, // حفظ جميع العقارات
              loading: false,
              total: result.pagination.total,
            });

            // تطبيق الفلاتر الحالية على البيانات الجديدة
            get().applyFilters();
          } else {
            throw new Error("Failed to fetch properties");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      clearFilters: () => {
        set({
          activeFilter: "all",
          search: "",
          cityId: "", // إضافة cityId للـ clearFilters
          district: "", // إضافة district للـ clearFilters
          propertyType: "",
          categoryId: "", // إضافة categoryId للـ clearFilters
          price: "",
        });
        // لا تقم بالجلب تلقائياً؛ يتم الجلب عند الضغط على زر البحث
      },

      // Local Filtering
      applyFilters: () => {
        const state = get();

        let filtered = [...state.allProperties];

        // فلترة حسب نوع المعاملة
        if (state.transactionType) {
          filtered = filtered.filter((property) => {
            // تحويل القيم للتطابق مع البيانات الجديدة
            const normalizedTransactionType =
              state.transactionType === "sale" ? "sale" : "rent";
            const propertyTransactionType =
              property.transactionType.toLowerCase();

            return (
              propertyTransactionType === normalizedTransactionType ||
              (normalizedTransactionType === "sale" &&
                propertyTransactionType === "sold") ||
              (normalizedTransactionType === "rent" &&
                (propertyTransactionType === "rent" ||
                  propertyTransactionType === "rented"))
            );
          });
        }

        // فلترة حسب الحالة
        const status = state.getStatusFromFilter(state.activeFilter);
        if (status && status !== "all") {
          filtered = filtered.filter((property) => {
            const propertyStatus = property.status.toLowerCase();
            return propertyStatus === status.toLowerCase();
          });
        }

        // فلترة حسب نوع العقار (استخدام categoryId إذا كان متوفراً، وإلا استخدام propertyType للتوافق العكسي)
        if (state.categoryId) {
          // هنا يمكن إضافة فلترة حسب categoryId إذا كان متوفراً في بيانات العقار
          // filtered = filtered.filter((property) => property.category_id === state.categoryId);
        } else if (state.propertyType) {
          filtered = filtered.filter((property) =>
            property.type
              .toLowerCase()
              .includes(state.propertyType.toLowerCase()),
          );
        }

        // فلترة حسب البحث (العنوان أو المنطقة)
        if (state.search) {
          filtered = filtered.filter(
            (property) =>
              property.title
                .toLowerCase()
                .includes(state.search.toLowerCase()) ||
              property.district
                .toLowerCase()
                .includes(state.search.toLowerCase()),
          );
        }

        // فلترة حسب السعر
        if (state.price) {
          const priceValue = parseFloat(state.price);
          if (!isNaN(priceValue)) {
            filtered = filtered.filter((property) => {
              const propertyPrice = parseFloat(
                property.price.replace(/[^\d.]/g, ""),
              );
              return propertyPrice <= priceValue;
            });
          }
        }

        set({
          filteredProperties: filtered,
          total: filtered.length,
        });
      },

      // Computed
      getStatusFromFilter: (
        filter: FilterType,
      ): "all" | "available" | "rented" | "sold" => {
        switch (filter) {
          case "available":
            return "available";
          case "rented":
            return "rented";
          case "sold":
            return "sold";
          default:
            return "all";
        }
      },
    }),
    {
      name: "properties-store",
    },
  ),
);
