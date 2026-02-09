import axiosInstance from "@/lib/axiosInstance";
import type { Property } from "../types/types";
import { mockProperty } from "../utils/constants";

// Check if we're in Live Editor
export const isLiveEditor = (): boolean => {
  return (
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor")
  );
};

// Fetch property data from API
export const fetchProperty = async (
  tenantId: string | null,
  propertySlug: string,
): Promise<Property | null> => {
  // Use mock data in Live Editor
  if (isLiveEditor()) {
    return mockProperty;
  }

  if (!tenantId) {
    return null;
  }

  try {
    const response = await axiosInstance.get(
      `/v1/tenant-website/${tenantId}/properties/${propertySlug}`,
    );

    // Handle new API response format
    if (response.data && response.data.property) {
      return response.data.property;
    } else if (response.data) {
      // If the property is returned directly
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("حدث خطأ في تحميل بيانات العقار");
  }
};
