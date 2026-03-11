import axiosInstance from "@/lib/axiosInstance";
import { retryWithBackoff } from "@/utils/errorHandler";
import useAuthStore from "@/context/AuthContext";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { ImportResult } from "../types/properties.types";
import { translateImportMessage, translateErrorMessage, translateErrors } from "../utils/translations";
import toast from "react-hot-toast";
import { logError, formatErrorMessage } from "@/utils/errorHandler";

export const buildFilterParams = (filters: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          if (key === "employee_id" || key === "category_id" || key === "purpose") {
            value.forEach((item) => {
              params.append(`${key}[]`, item.toString());
            });
          } else {
            params.set(key, value.join(","));
          }
        }
      } else {
        params.set(key, value.toString());
      }
    }
  });
  
  return params;
};

export const fetchProperties = async (
  page: number = 1,
  filters: Record<string, any> = {},
  setPropertiesManagement: any
) => {
  const { userData } = useAuthStore.getState();
  if (!userData?.token) {
    console.log("No token available, skipping fetchProperties");
    setPropertiesManagement({
      loading: false,
      error: "Authentication required. Please login.",
    });
    return;
  }

  setPropertiesManagement({
    loading: true,
    error: null,
  });

  try {
    const params = buildFilterParams(filters);
    params.set("page", page.toString());

    console.log("Making API request to /properties with params:", params.toString());
    const response = await retryWithBackoff(
      async () => {
        const res = await axiosInstance.get(`/properties?${params.toString()}`);
        console.log("API response received:", res);
        return res;
      },
      3,
      1000,
    );

    const propertiesList = response.data?.data?.properties || [];
    const pagination = response.data?.data?.pagination || null;
    const propertiesAllData = response.data?.data || null;
    const incompleteCount = response.data?.data?.incomplete_count || 0;

    const mappedProperties = propertiesList.map((property: any) => ({
      ...property,
      thumbnail: property.featured_image,
      listingType:
        String(property.transaction_type) === "1" ||
        property.transaction_type === "sale"
          ? "للبيع"
          : "للإيجار",
      status: property.status === 1 ? "منشور" : "مسودة",
      lastUpdated: new Date(property.updated_at).toLocaleDateString("ar-AE"),
      features: Array.isArray(property.features) ? property.features : [],
    }));

    setPropertiesManagement({
      properties: mappedProperties,
      pagination,
      propertiesAllData,
      incompleteCount,
      loading: false,
      isInitialized: true,
    });
  } catch (error) {
    logError(error, "fetchProperties");
    setPropertiesManagement({
      error: formatErrorMessage(error, "حدث خطأ أثناء جلب بيانات الوحدات"),
      loading: false,
      isInitialized: true,
    });
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { userData } = useAuthStore.getState();
  if (!userData?.token) {
    throw new Error("Authentication required. Please login.");
  }

  await axiosInstance.delete(`properties/${id}`);
};

export const duplicateProperty = async (property: any): Promise<void> => {
  const { userData } = useAuthStore.getState();
  if (!userData?.token) {
    throw new Error("Authentication required. Please login.");
  }

  const duplicateData = {
    title: property.title || property.contents[0].title,
    price: property.price,
  };

  await axiosInstance.post(`/properties/${property.id}/duplicate`, duplicateData);
};

export const togglePropertyStatus = async (propertyId: string): Promise<void> => {
  const { userData } = useAuthStore.getState();
  if (!userData?.token) {
    throw new Error("Authentication required. Please login.");
  }

  await axiosInstance.post(`/properties/${propertyId}/toggle-status`);
};

export const reorderProperty = async (
  propertyId: string,
  reorder: number,
  type: "featured" | "normal"
): Promise<void> => {
  const { userData } = useAuthStore.getState();
  if (!userData?.token) {
    throw new Error("Authentication required. Please login.");
  }

  const endpoint = type === "featured" ? "/properties/reorder-featured" : "/properties/reorder";
  const payload = type === "featured"
    ? [{ id: propertyId, reorder_featured: reorder }]
    : [{ id: propertyId, reorder }];

  await axiosInstance.post(endpoint, payload);
};

export const downloadTemplate = async (): Promise<void> => {
  const response = await axiosInstance.get("/properties/bulk-import/template", {
    responseType: "blob",
    headers: {
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv",
    },
  });

  if (response.data instanceof Blob) {
    const contentDisposition = response.headers["content-disposition"];
    let filename = `properties-template-${new Date().toISOString().split("T")[0]}.xlsx`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
        if (filename.startsWith("UTF-8''")) {
          filename = decodeURIComponent(filename.replace("UTF-8''", ""));
        }
      }
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else {
    throw new Error("استجابة غير صحيحة من الخادم");
  }
};

export const importProperties = async (
  file: File,
  onSuccess: (result: ImportResult) => void,
  onError: (result: ImportResult) => void
): Promise<ImportResult | null> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post("/properties/bulk-import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    });

    const data = response.data;

    if (response.status === 200 && data.status === "success") {
      const result: ImportResult = {
        status: "success",
        message: translateImportMessage(data.message || "تم استيراد الوحدات بنجاح"),
        code: data.code,
        imported_count: data.imported_count || 0,
        updated_count: data.updated_count || 0,
        failed_count: data.failed_count || 0,
        incomplete_count: data.incomplete_count || 0,
        errors: [],
      };
      onSuccess(result);
      return result;
    }

    return null;
  } catch (error: any) {
    const response = error.response;
    const data = response?.data;

    if (response?.status === 422 && data?.status === "partial_success") {
      const result: ImportResult = {
        status: "partial_success",
        message: translateImportMessage(data.message || "تم الاستيراد جزئياً"),
        code: data.code,
        imported_count: data.imported_count || 0,
        updated_count: data.updated_count || 0,
        failed_count: data.failed_count || 0,
        incomplete_count: data.incomplete_count || 0,
        errors: translateErrors(data.errors || []),
      };
      onSuccess(result);
      return result;
    }

    const errorCode = data?.code || "UNKNOWN_ERROR";
    let errorMessage = data?.message || "حدث خطأ أثناء استيراد الوحدات";
    let suggestion = data?.details?.suggestion
      ? translateErrorMessage(data.details.suggestion)
      : undefined;

    switch (errorCode) {
      case "IMPORT_VALIDATION_ERROR":
        if (data?.errors?.file) {
          errorMessage = Array.isArray(data.errors.file)
            ? data.errors.file[0]
            : data.errors.file;
        }
        break;
      case "IMPORT_FILE_TOO_LARGE":
        errorMessage = "حجم الملف يتجاوز الحد الأقصى المسموح به (10MB)";
        suggestion = "يرجى تقسيم الملف إلى ملفات أصغر (حد أقصى 10MB لكل ملف) أو تقليل عدد الصفوف.";
        break;
      case "IMPORT_FILE_INVALID":
        errorMessage = "الملف غير صحيح أو تالف";
        suggestion = "يرجى التأكد من أن الملف هو ملف Excel (.xlsx) أو CSV (.csv) صحيح. جرب فتحه في Excel أولاً للتحقق من أنه غير تالف.";
        break;
      case "IMPORT_PERMISSION_DENIED":
        if (response?.status === 401) {
          errorMessage = "يجب تسجيل الدخول لاستيراد الوحدات";
        } else if (response?.status === 403) {
          if (data?.details?.limit) {
            errorMessage = "سيؤدي الاستيراد الجماعي إلى تجاوز حد قائمة الوحدات الخاص بك";
            suggestion = `الحد: ${data.details.limit}، الحالي: ${data.details.current_count}، المتوقع إضافته: ${data.details.incoming_count}، المتاح: ${data.details.available_slots}. يرجى إزالة بعض الوحدات الموجودة أو ترقية الباقة لزيادة الحد.`;
          } else {
            errorMessage = "لم يتم العثور على باقة نشطة للمستخدم";
            suggestion = "يرجى تفعيل باقة عضوية لاستيراد الوحدات.";
          }
        }
        break;
      case "IMPORT_PROCESSING_ERROR":
        errorMessage = "حدث خطأ أثناء معالجة الاستيراد";
        if (!suggestion) {
          suggestion = data?.details?.suggestion
            ? translateErrorMessage(data.details.suggestion)
            : "يرجى التحقق من تنسيق الملف والبيانات، ثم المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم.";
        }
        break;
    }

    if (!suggestion && data?.details?.suggestion) {
      suggestion = translateErrorMessage(data.details.suggestion);
    }

    const translatedDetails = {
      ...data?.details,
      suggestion: suggestion || (data?.details?.suggestion ? translateErrorMessage(data.details.suggestion) : ""),
      error: data?.details?.error ? translateErrorMessage(data.details.error) : data?.details?.error,
    };

    const result: ImportResult = {
      status: "error",
      message: translateImportMessage(errorMessage),
      code: errorCode,
      imported_count: 0,
      updated_count: 0,
      failed_count: 0,
      errors: translateErrors(data?.errors || []),
      details: translatedDetails,
    };
    onError(result);
    return result;
  }
};

export const exportProperties = async (
  dateRange: DateRange,
  filters: Record<string, any>
): Promise<void> => {
  if (!dateRange?.from || !dateRange?.to) {
    throw new Error("يرجى تحديد نطاق التاريخ للتصدير");
  }

  const params = buildFilterParams(filters);
  params.set("date_from", format(dateRange.from, "yyyy-MM-dd"));
  params.set("date_to", format(dateRange.to, "yyyy-MM-dd"));

  const response = await axiosInstance.get(`/properties/export?${params.toString()}`, {
    responseType: "blob",
    headers: {
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv",
    },
  });

  if (response.data instanceof Blob) {
    const contentDisposition = response.headers["content-disposition"];
    let filename = `properties-export-${new Date().toISOString().split("T")[0]}.xlsx`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
        if (filename.startsWith("UTF-8''")) {
          filename = decodeURIComponent(filename.replace("UTF-8''", ""));
        }
      }
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else {
    throw new Error("استجابة غير صحيحة من الخادم");
  }
};

export const fetchCities = async (): Promise<any[]> => {
  const response = await axiosInstance.get("https://nzl-backend.com/api/cities?country_id=1");
  return response.data?.data || [];
};

export const fetchDistricts = async (cityId: string): Promise<any[]> => {
  const response = await axiosInstance.get(`https://nzl-backend.com/api/districts?city_id=${cityId}`);
  return response.data?.data || [];
};
