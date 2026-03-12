import { useCallback, useEffect, useState } from "react";

import axiosInstance from "@/lib/axiosInstance";

interface UsePaymentReportOptions {
  propertyId?: number | null;
  enabled?: boolean;
}

interface UsePaymentReportResult {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export function usePaymentReport(
  options: UsePaymentReportOptions,
): UsePaymentReportResult {
  const { propertyId, enabled = false } = options;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setData(null);
    setError(null);
  };

  const fetchPaymentReport = useCallback(async () => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/payment-report?property_id=${propertyId}`,
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError("فشل في تحميل بيانات تقارير الدفع");
      }
    } catch (err: any) {
      console.error("Error fetching expenses data:", err);

      if (
        err.response?.data?.errors?.property_id?.includes(
          "The selected property id is invalid.",
        )
      ) {
        setError("العقار تم حذفه من النظام");
      } else {
        setError(
          err.response?.data?.message ||
            "حدث خطأ أثناء تحميل بيانات تقارير الدفع",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (enabled && propertyId) {
      fetchPaymentReport();
    }
  }, [enabled, propertyId, fetchPaymentReport]);

  return {
    data,
    loading,
    error,
    refetch: fetchPaymentReport,
    reset,
  };
}

