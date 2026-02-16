import { getUserToken } from "../utils/authHelper";

// Save filterButtons changes function
export const createSaveFilterButtonsChanges = (set) => ({
  saveFilterButtonsChanges: async (tenantId, filterButtonsData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/filterButtons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          filterButtonsData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save filter buttons changes");
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
