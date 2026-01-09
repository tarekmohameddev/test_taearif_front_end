import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set) => ({
  setupProgressData: null,
  isSetupProgressDataUpdated: false,

  fetchSetupProgressData: async () => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    set({ loading: true });
    try {
      const response = await axiosInstance.get("/steps/progress"); // ← تأكد من المسار الصحيح
      set((state) => ({
        homepage: {
          ...state.homepage,
          setupProgressData: response.data, // نخزن الكل: { steps, progress, continue_path }
          isSetupProgressDataUpdated: true,
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
