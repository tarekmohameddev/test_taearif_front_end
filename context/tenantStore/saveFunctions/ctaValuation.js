import { getUserToken } from "../utils/authHelper";

// Save ctaValuation changes function
export const createSaveCtaValuationChanges = (set) => ({
  saveCtaValuationChanges: async (tenantId, ctaValuationData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/ctaValuation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          ctaValuationData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save cta valuation changes");
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
