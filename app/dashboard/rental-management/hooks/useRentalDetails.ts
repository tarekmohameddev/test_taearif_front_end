import { useCallback, useEffect, useState } from "react";

import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import type { RentalDetails } from "@/components/rental-management/rental-details-types";

interface UseRentalDetailsResult {
  details: RentalDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRentalDetails(rentalId?: string | null): UseRentalDetailsResult {
  const userData = useAuthStore(selectUserData);

  const [details, setDetails] = useState<RentalDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRentalDetails = useCallback(async () => {
    if (!rentalId) return;

    if (!userData?.token) {
      // token غير متوفر، لا تحاول الطلب
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/rentals/${rentalId}/details`,
      );

      if (response.data.status) {
        setDetails(response.data.data);
      } else {
        setError("فشل في تحميل تفاصيل طلب الإيجار");
      }
    } catch (err: any) {
      console.error("Error fetching rental details:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل التفاصيل");
    } finally {
      setLoading(false);
    }
  }, [rentalId, userData?.token]);

  useEffect(() => {
    if (rentalId && userData?.token) {
      fetchRentalDetails();
    }
  }, [rentalId, userData?.token, fetchRentalDetails]);

  return {
    details,
    loading,
    error,
    refetch: fetchRentalDetails,
  };
}

