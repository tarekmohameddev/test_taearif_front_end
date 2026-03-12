import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";

interface UseDashboardDataParams {
  collectionsPeriod?: string;
  collectionsFromDate?: string;
  collectionsToDate?: string;
  paymentsDuePeriod?: string;
  paymentsDueFromDate?: string;
  paymentsDueToDate?: string;
  isInitialized: boolean;
}

/** بناء مفتاح فريد للفلاتر (لمنع الطلبات المكررة) */
function buildDashboardParamsKey(params: {
  collectionsPeriod: string;
  collectionsFromDate: string;
  collectionsToDate: string;
  paymentsDuePeriod: string;
  paymentsDueFromDate: string;
  paymentsDueToDate: string;
}): string {
  return [
    params.collectionsPeriod,
    params.collectionsFromDate,
    params.collectionsToDate,
    params.paymentsDuePeriod,
    params.paymentsDueFromDate,
    params.paymentsDueToDate,
  ].join("|");
}

export function useDashboardData({
  collectionsPeriod = "this_month",
  collectionsFromDate = "",
  collectionsToDate = "",
  paymentsDuePeriod = "this_month",
  paymentsDueFromDate = "",
  paymentsDueToDate = "",
  isInitialized,
}: UseDashboardDataParams) {
  const {
    setDashboardData,
    setLoading,
    setError,
    setLastFetchedDashboardKey,
    loading,
    lastFetchedDashboardKey,
  } = useRentalDashboardStore();

  const fetchDashboardData = async () => {
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      console.log("No token available, skipping fetchDashboardData");
      return;
    }

    if (
      collectionsPeriod === "custom" &&
      (!collectionsFromDate || !collectionsToDate)
    ) {
      console.log("Collections custom period requires both from and to dates");
      return;
    }

    if (
      paymentsDuePeriod === "custom" &&
      (!paymentsDueFromDate || !paymentsDueToDate)
    ) {
      console.log("Payments due custom period requires both from and to dates");
      return;
    }

    const paramsKey = buildDashboardParamsKey({
      collectionsPeriod,
      collectionsFromDate,
      collectionsToDate,
      paymentsDuePeriod,
      paymentsDueFromDate,
      paymentsDueToDate,
    });

    // PREVENT_DUPLICATE_API: loading guard
    if (loading) return;
    // PREVENT_DUPLICATE_API: cache + last-fetched guard (نفس الفلاتر = لا إعادة طلب)
    if (lastFetchedDashboardKey === paramsKey) return;

    try {
      setLoading(true);
      setError(null);

      // بناء query parameters
      const params: any = {
        collections_period: collectionsPeriod,
        payments_due_period: paymentsDuePeriod,
      };

      // إضافة تواريخ collections إذا كان custom
      if (collectionsPeriod === "custom") {
        if (collectionsFromDate)
          params.collections_from_date = collectionsFromDate;
        if (collectionsToDate) params.collections_to_date = collectionsToDate;
      }

      // إضافة تواريخ payments_due إذا كان custom
      if (paymentsDuePeriod === "custom") {
        if (paymentsDueFromDate)
          params.payments_due_from_date = paymentsDueFromDate;
        if (paymentsDueToDate) params.payments_due_to_date = paymentsDueToDate;
      }

      const response = await axiosInstance.get("/v1/rms/dashboard", { params });

      if (response.data.status) {
        setDashboardData(response.data.data);
        setLastFetchedDashboardKey(paramsKey);
      } else {
        setError("فشل في جلب بيانات لوحة المعلومات");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند التحميل الأول
  useEffect(() => {
    if (!isInitialized) {
      fetchDashboardData();
    }
  }, [isInitialized]);

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    if (isInitialized) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collectionsPeriod,
    collectionsFromDate,
    collectionsToDate,
    paymentsDuePeriod,
    paymentsDueFromDate,
    paymentsDueToDate,
  ]);

  return { fetchDashboardData };
}
