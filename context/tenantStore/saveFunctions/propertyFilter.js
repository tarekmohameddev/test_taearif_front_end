import { getUserToken } from "../utils/authHelper";

// Save propertyFilter and applicationForm changes functions
export const createSavePropertyFilterChanges = (set) => ({
  savePropertyFilterChanges: async (tenantId, propertyFilterData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/propertyFilter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          propertyFilterData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save property slider changes");
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
  saveApplicationFormChanges: async (
    tenantId,
    applicationFormData,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/applicationForm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          applicationFormData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save application form changes");
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
