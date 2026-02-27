import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";

export default (set, get) => ({
  // Marketing Channels Management
  marketingChannels: {
    channels: [],
    loading: false,
    error: null,
  },

  // Credit Packages Management
  creditPackages: {
    packages: [],
    loading: false,
    error: null,
  },

  fetchMarketingChannels: async () => {
    const state = get();

    // ====== Anti-Spam Lock ======
    if (state.marketingChannels._fetchedOnce) return;
    // ============================

    const token = useAuthStore.getState().userData?.token;
    if (!token) return;

    set((s) => ({
      marketingChannels: {
        ...s.marketingChannels,
        loading: true,
        error: null,
        _fetchedOnce: true, // أول مرة فقط
      },
    }));

    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels`,
      );

      const whatsappChannels =
        res.data.data?.filter((c) => c.type === "whatsapp") || [];

      set((s) => ({
        marketingChannels: {
          ...s.marketingChannels,
          channels: whatsappChannels,
          loading: false,
          _fetchedOnce: true,
        },
      }));
    } catch (err) {
      set((s) => ({
        marketingChannels: {
          ...s.marketingChannels,
          error: err.message,
          loading: false,
          _fetchedOnce: true,
        },
      }));
    }
  },

  setMarketingChannels: (updates) =>
    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        ...updates,
      },
    })),

  createMarketingChannel: async (channelData) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري إنشاء القناة...");

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels`,
        channelData,
      );

      // إضافة القناة الجديدة إلى القائمة
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: [...state.marketingChannels.channels, response.data.data],
        },
      }));

      toast.success("تم إنشاء القناة بنجاح", { id: loadingToast });
      return { success: true, data: response.data.data };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء القناة", {
        id: loadingToast,
      });
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء القناة",
      };
    }
  },

  deleteMarketingChannel: async (channelId) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري حذف القناة...");

    try {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels/${channelId}`,
      );

      // إزالة القناة من القائمة
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: state.marketingChannels.channels.filter(
            (channel) => channel.id !== channelId,
          ),
        },
      }));

      toast.success("تم حذف القناة بنجاح", { id: loadingToast });
      return { success: true };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء حذف القناة", {
        id: loadingToast,
      });
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف القناة",
      };
    }
  },

  updateChannelStatus: async (channelId, statusData) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري تحديث حالة القناة...");

    try {
      // الحصول على الحالة الحالية للقناة
      const currentState = get();
      const currentChannel = currentState.marketingChannels.channels.find(
        (channel) => channel.id === channelId,
      );

      // إرسال كلا الحقلين معاً
      const requestData = {
        is_connected: currentChannel?.is_connected || false,
        is_verified: currentChannel?.is_verified || false,
        ...statusData,
      };

      const response = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels/${channelId}/status`,
        requestData,
      );

      // تحديث القناة في القائمة
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: state.marketingChannels.channels.map((channel) =>
            channel.id === channelId ? { ...channel, ...requestData } : channel,
          ),
        },
      }));

      toast.success("تم تحديث حالة القناة بنجاح", { id: loadingToast });
      return { success: true, data: response.data.data };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة القناة", {
        id: loadingToast,
      });
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث حالة القناة",
      };
    }
  },

  fetchCreditPackages: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    const { creditPackages } = get();
    if (creditPackages.packages.length > 0 && !creditPackages.loading) {
      return;
    }

    set((state) => ({
      creditPackages: {
        ...state.creditPackages,
        loading: true,
        error: null,
      },
    }));

    const loadingToast = toast.loading("جاري تحميل باقات الائتمان...");

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/credits/packages?locale=ar`,
      );

      // API: { status: true, message: "...", data: [ { id, name, credits, price, ... } ] }
      const raw = response?.data;
      const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      set((state) => ({
        creditPackages: {
          ...state.creditPackages,
          packages: list,
          loading: false,
        },
      }));
      toast.success("تم تحميل باقات الائتمان بنجاح", { id: loadingToast });
    } catch (error) {
      set((state) => ({
        creditPackages: {
          ...state.creditPackages,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
      toast.error(error.message || "حدث خطأ أثناء تحميل باقات الائتمان", {
        id: loadingToast,
      });
    }
  },

  setCreditPackages: (updates) =>
    set((state) => ({
      creditPackages: {
        ...state.creditPackages,
        ...updates,
      },
    })),

  purchaseCredits: async (packageId, paymentMethod) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري معالجة طلب الشراء...");

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/credits/purchase`,
        {
          package_id: packageId,
          payment_method: paymentMethod,
        },
      );

      toast.success("تم إنشاء طلب الدفع بنجاح", { id: loadingToast });
      return { success: true, data: response.data.data };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء معالجة طلب الشراء", {
        id: loadingToast,
      });
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء معالجة طلب الشراء",
      };
    }
  },

  // Credit Transactions Management
  creditTransactions: {
    transactions: [],
    loading: false,
    error: null,
    pagination: null,
  },

  fetchCreditTransactions: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    const { creditTransactions } = get();
    if (
      creditTransactions.transactions.length > 0 &&
      !creditTransactions.loading
    ) {
      return;
    }

    set((state) => ({
      creditTransactions: {
        ...state.creditTransactions,
        loading: true,
        error: null,
      },
    }));

    const loadingToast = toast.loading("جاري تحميل سجل المعاملات...");

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/credits/transactions?per_page=10&type=purchase&status=completed`,
      );

      set((state) => ({
        creditTransactions: {
          ...state.creditTransactions,
          transactions: response.data.data?.transactions || [],
          pagination: response.data.data?.pagination || null,
          loading: false,
        },
      }));
      toast.success("تم تحميل سجل المعاملات بنجاح", { id: loadingToast });
    } catch (error) {
      set((state) => ({
        creditTransactions: {
          ...state.creditTransactions,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
      toast.error(error.message || "حدث خطأ أثناء تحميل سجل المعاملات", {
        id: loadingToast,
      });
    }
  },

  setCreditTransactions: (updates) =>
    set((state) => ({
      creditTransactions: {
        ...state.creditTransactions,
        ...updates,
      },
    })),

  // Credit Analytics Management
  creditAnalytics: {
    data: null,
    loading: false,
    error: null,
  },

  fetchCreditAnalytics: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    const { creditAnalytics } = get();
    if (creditAnalytics.data && !creditAnalytics.loading) {
      return;
    }

    set((state) => ({
      creditAnalytics: {
        ...state.creditAnalytics,
        loading: true,
        error: null,
      },
    }));

    const loadingToast = toast.loading("جاري تحميل التحليلات...");

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/credits/analytics`,
      );

      set((state) => ({
        creditAnalytics: {
          ...state.creditAnalytics,
          data: response.data.data || null,
          loading: false,
        },
      }));
      toast.success("تم تحميل التحليلات بنجاح", { id: loadingToast });
    } catch (error) {
      set((state) => ({
        creditAnalytics: {
          ...state.creditAnalytics,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
      toast.error(error.message || "حدث خطأ أثناء تحميل التحليلات", {
        id: loadingToast,
      });
    }
  },

  setCreditAnalytics: (updates) =>
    set((state) => ({
      creditAnalytics: {
        ...state.creditAnalytics,
        ...updates,
      },
    })),

  // Credit Balance Management
  creditBalance: {
    data: null,
    loading: false,
    error: null,
  },

  fetchCreditBalance: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    const { creditBalance } = get();
    if (creditBalance.data && !creditBalance.loading) {
      return;
    }

    set((state) => ({
      creditBalance: {
        ...state.creditBalance,
        loading: true,
        error: null,
      },
    }));

    const loadingToast = toast.loading("جاري تحميل بيانات الرصيد...");

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/credits/balance`,
      );

      set((state) => ({
        creditBalance: {
          ...state.creditBalance,
          data: response.data.data || null,
          loading: false,
        },
      }));
      toast.success("تم تحميل بيانات الرصيد بنجاح", { id: loadingToast });
    } catch (error) {
      set((state) => ({
        creditBalance: {
          ...state.creditBalance,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
      toast.error(error.message || "حدث خطأ أثناء تحميل بيانات الرصيد", {
        id: loadingToast,
      });
    }
  },

  setCreditBalance: (updates) =>
    set((state) => ({
      creditBalance: {
        ...state.creditBalance,
        ...updates,
      },
    })),

  updateChannelSystemIntegrations: async (channelId, integrationData) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري تحديث إعدادات التكامل...");

    try {
      const response = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels/${channelId}/system-integrations`,
        integrationData,
      );

      // تحديث القناة في القائمة
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: state.marketingChannels.channels.map((channel) =>
            channel.id === channelId
              ? {
                  ...channel,
                  crm_integration_enabled:
                    integrationData.crm_integration_enabled,
                  appointment_system_integration_enabled:
                    integrationData.appointment_system_integration_enabled,
                  integration_settings: integrationData.integration_settings,
                }
              : channel,
          ),
        },
      }));

      toast.success("تم تحديث إعدادات التكامل بنجاح", { id: loadingToast });
      return { success: true, data: response.data.data };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء تحديث إعدادات التكامل", {
        id: loadingToast,
      });
      return {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث إعدادات التكامل",
      };
    }
  },

  // إضافة state للاستخدام حسب الرقم
  channelUsage: {
    data: [],
    loading: false,
    error: null,
  },

  // دالة جلب الاستخدام حسب الرقم
  fetchChannelUsage: async () => {
    const { channelUsage } = get();
    if (channelUsage.data.length > 0 && !channelUsage.loading) {
      return;
    }

    set((state) => ({
      channelUsage: { ...state.channelUsage, loading: true, error: null },
    }));

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels/usage`,
      );

      set((state) => ({
        channelUsage: {
          ...state.channelUsage,
          data: response.data.data,
          loading: false,
          error: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        channelUsage: {
          ...state.channelUsage,
          loading: false,
          error: error.message || "حدث خطأ أثناء جلب بيانات الاستخدام",
        },
      }));
    }
  },

  // دالة تحديث بيانات الاستخدام
  setChannelUsage: (data) => {
    set((state) => ({
      channelUsage: { ...state.channelUsage, data },
    }));
  },
});
