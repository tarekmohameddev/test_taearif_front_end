import { getUserToken } from "../utils/authHelper";

// Save header changes function
export const createSaveHeaderChanges = (set) => ({
  saveHeaderChanges: async (tenantId, headerData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          headerData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save header changes");
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
