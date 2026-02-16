import { getUserToken } from "../utils/authHelper";

// Save propertySlider changes function
export const createSavePropertySliderChanges = (set) => ({
  savePropertySliderChanges: async (tenantId, propertySliderData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/propertySlider", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          propertySliderData,
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
});
