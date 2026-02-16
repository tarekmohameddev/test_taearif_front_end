import { getUserToken } from "../utils/authHelper";

// Save footer changes function
export const createSaveFooterChanges = (set) => ({
  saveFooterChanges: async (tenantId, footerData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          footerData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save footer changes");
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
