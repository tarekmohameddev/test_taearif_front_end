import { getUserToken } from "../utils/authHelper";

// Save halfTextHalfImage changes functions
export const createSaveHalfTextHalfImageChanges = (set) => ({
  savehalfTextHalfImageChanges: async (
    tenantId,
    halfTextHalfImageData,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/halfTextHalfImage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          halfTextHalfImageData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save half text half image changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  savehalfTextHalfImage2Changes: async (
    tenantId,
    halfTextHalfImage2Data,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/halfTextHalfImage2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          halfTextHalfImage2Data,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save half text half image2 changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  savehalfTextHalfImage3Changes: async (
    tenantId,
    halfTextHalfImage3Data,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/halfTextHalfImage3", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          halfTextHalfImage3Data,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save half text half image3 changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
});
