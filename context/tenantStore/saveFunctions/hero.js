import { getUserToken } from "../utils/authHelper";

// Save hero changes function
export const createSaveHeroChanges = (set) => ({
  saveHeroChanges: async (tenantId, heroData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          heroData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero changes");
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
