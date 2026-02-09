import axiosInstance from "@/lib/axiosInstance";
import { Property } from "../types/types";
import { mockProperty } from "../constants/mockData";

export const fetchPropertyData = async (
  tenantId: string | null,
  propertySlug: string,
  isLiveEditor: boolean,
): Promise<{ property: Property | null; error: string | null }> => {
  if (isLiveEditor) {
    return { property: mockProperty, error: null };
  }

  try {
    if (!tenantId) {
      return { property: null, error: null };
    }

    const response = await axiosInstance.get(
      `/v1/tenant-website/${tenantId}/properties/${propertySlug}`,
    );

    if (response.data && response.data.property) {
      return { property: response.data.property, error: null };
    } else if (response.data) {
      return { property: response.data, error: null };
    } else {
      return { property: null, error: "العقار غير موجود" };
    }
  } catch (error) {
    return { property: null, error: "حدث خطأ في تحميل بيانات العقار" };
  }
};

export const fetchSimilarPropertiesData = async (
  tenantId: string | null,
  isLiveEditor: boolean,
): Promise<Property[]> => {
  if (isLiveEditor) {
    return [
      {
        ...mockProperty,
        id: "mock-2",
        title: "عقار فاخر ثاني",
        district: "حي العليا",
        price: "1,500,000",
      },
      {
        ...mockProperty,
        id: "mock-3",
        title: "عقار فاخر ثالث",
        district: "حي المطار",
        price: "2,000,000",
      },
      {
        ...mockProperty,
        id: "mock-4",
        title: "عقار فاخر رابع",
        district: "حي الياسمين",
        price: "1,800,000",
      },
    ];
  }

  try {
    if (!tenantId) {
      return [];
    }

    const response = await axiosInstance.get(
      `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`,
    );

    if (response.data && response.data.properties) {
      console.log(
        `propertyDetail: ✅ Similar properties loaded: ${response.data.properties.length} items`,
      );
      return response.data.properties;
    } else {
      console.log(
        "propertyDetail: ⚠️ No similar properties found in response",
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching similar properties:", error);
    return [];
  }
};

export const createReservation = async (
  tenantId: string,
  propertySlug: string,
  reservationData: {
    customerName: string;
    customerPhone: string;
    desiredDate?: string;
    message?: string;
  },
): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload: any = {
      propertySlug,
      customerName: reservationData.customerName.trim(),
      customerPhone: reservationData.customerPhone.trim(),
    };

    if (reservationData.desiredDate) {
      payload.desiredDate = reservationData.desiredDate;
    }
    if (reservationData.message?.trim()) {
      payload.message = reservationData.message.trim();
    }

    const response = await axiosInstance.post(
      `/api/v1/tenant-website/${tenantId}/reservations`,
      payload,
    );

    if (response.data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.data.message || "حدث خطأ أثناء إرسال طلب الحجز",
      };
    }
  } catch (err: any) {
    console.error("Error creating reservation:", err);

    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessage =
        errors.desiredDate?.[0] ||
        errors.customerName?.[0] ||
        errors.customerPhone?.[0] ||
        errors.message?.[0] ||
        err.response?.data?.message ||
        "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى";
      return { success: false, error: errorMessage };
    } else {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى",
      };
    }
  }
};
