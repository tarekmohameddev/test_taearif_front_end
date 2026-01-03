import { useState, useEffect, useCallback } from "react";

export interface Property {
  id: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms?: number;
  image: string;
  status: "available" | "rented" | "sold";
  type: string;
  transactionType: "rent" | "sale";
}

export interface PropertiesResponse {
  success: boolean;
  data: Property[];
  total: number;
  filters: {
    transactionType?: string;
    status?: string;
    type?: string;
    search?: string;
    price?: string;
  };
}

export interface UsePropertiesOptions {
  transactionType?: "rent" | "sale";
  status?: "all" | "available" | "rented" | "sold";
  type?: string;
  search?: string;
  price?: string;
  autoFetch?: boolean;
}

export const useProperties = (options: UsePropertiesOptions = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const {
    transactionType,
    status,
    type,
    search,
    price,
    autoFetch = true,
  } = options;

  const fetchProperties = useCallback(async () => {
    console.log("fetchProperties called with:", {
      transactionType,
      status,
      type,
      search,
      price,
    });
    setLoading(true);
    setError(null);

    try {
      // بناء query parameters
      const params = new URLSearchParams();

      if (transactionType) params.append("transactionType", transactionType);
      if (status && status !== "all") params.append("status", status);
      if (type) params.append("type", type);
      if (search) params.append("search", search);
      if (price) params.append("price", price);

      const queryString = params.toString();
      const url = `/api/properties/properties${queryString ? `?${queryString}` : ""}`;

      console.log("Fetching from URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PropertiesResponse = await response.json();

      console.log("API Response:", result);

      if (result.success) {
        setProperties(result.data);
        setTotal(result.total);
        console.log("Properties updated:", result.data.length, "items");
      } else {
        throw new Error("Failed to fetch properties");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, [transactionType, status, type, search, price]);

  // جلب البيانات تلقائياً عند تغيير المعاملات
  useEffect(() => {
    console.log("useEffect triggered with:", {
      transactionType,
      status,
      type,
      search,
      price,
      autoFetch,
    });
    if (autoFetch) {
      fetchProperties();
    }
  }, [transactionType, status, type, search, price, autoFetch]);

  // دالة لإعادة جلب البيانات يدوياً
  const refetch = () => {
    fetchProperties();
  };

  // دالة لفلترة العقارات محلياً (للحالات التي تحتاج فلترة سريعة)
  const filterProperties = (filterFn: (property: Property) => boolean) => {
    setProperties((prev) => prev.filter(filterFn));
  };

  // دالة لإعادة تعيين الفلاتر
  const resetFilters = () => {
    setProperties([]);
    setTotal(0);
    setError(null);
  };

  return {
    properties,
    loading,
    error,
    total,
    refetch,
    filterProperties,
    resetFilters,
  };
};

