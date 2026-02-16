// Helper function to get user token from AuthContext
export const getUserToken = async () => {
  try {
    const authModule = await import("../../context/AuthContext");
    const useAuthStore = authModule.default;
    const userData = useAuthStore.getState().userData;
    if (!userData?.token) {
      return null;
    }
    return userData.token;
  } catch (error) {
    return null;
  }
};
