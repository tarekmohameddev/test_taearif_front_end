"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";
import type {
  SubscriptionPlan,
  SubscriptionPlansResponse,
  BillingPeriod,
} from "@/components/settings/types";
import { DEFAULT_BILLING_PERIOD } from "@/components/settings/constants";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string } } })
      .response;
    if (res?.data?.message) return res.data.message;
  }
  return fallback;
}

export interface SavingsResult {
  savings: number;
  savingsPercentage: number;
}

export function calculateSavings(
  monthlyPrice: string | number,
  yearlyPrice: string | number,
): SavingsResult {
  const monthlyTotal = parseFloat(String(monthlyPrice)) * 12;
  const yearlyTotal = parseFloat(String(yearlyPrice));
  const savings = monthlyTotal - yearlyTotal;
  const savingsPercentage =
    monthlyTotal > 0 ? Math.round((savings / monthlyTotal) * 100) : 0;
  return { savings, savingsPercentage };
}

export interface UseSubscriptionPlansReturn {
  subscriptionPlans: SubscriptionPlansResponse;
  isLoadingPlans: boolean;
  billingPeriod: BillingPeriod;
  getCurrentPlans: () => SubscriptionPlan[];
  isYearlyPlan: (plan: SubscriptionPlan) => boolean;
  calculateSavings: (
    monthlyPrice: string | number,
    yearlyPrice: string | number,
  ) => SavingsResult;
  isUpgradeDialogOpen: boolean;
  setIsUpgradeDialogOpen: (v: boolean) => void;
  selectedPlan: SubscriptionPlan | null;
  selectedMonths: number[];
  setSelectedMonths: (v: number[]) => void;
  handleUpgradeClick: (plan: SubscriptionPlan) => void;
  handleConfirmUpgrade: () => Promise<void>;
  isProcessingPayment: boolean;
  isPopupOpen: boolean;
  paymentUrl: string;
  closePopup: () => void;
}

export function useSubscriptionPlans(): UseSubscriptionPlansReturn {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [subscriptionPlans, setSubscriptionPlans] =
    useState<SubscriptionPlansResponse>({});
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriod>(DEFAULT_BILLING_PERIOD);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [selectedMonths, setSelectedMonths] = useState([1]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const isAuthReady = !authLoading && !!userData?.token;

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoadingPlans(false);
      return;
    }
    let cancelled = false;
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await axiosInstance.get("/settings/payment");
        if (!cancelled) {
          setSubscriptionPlans(response.data.plans ?? {});
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching subscription plans:", error);
          toast.error("فشل في تحميل خطط الاشتراك");
        }
      } finally {
        if (!cancelled) setIsLoadingPlans(false);
      }
    };
    fetchPlans();
    return () => {
      cancelled = true;
    };
  }, [isAuthReady]);

  const getCurrentPlans = useCallback((): SubscriptionPlan[] => {
    if (billingPeriod === "monthly") {
      return subscriptionPlans.plans_monthly ?? [];
    }
    return subscriptionPlans.plans_yearly ?? [];
  }, [billingPeriod, subscriptionPlans]);

  const isYearlyPlan = useCallback(
    (plan: SubscriptionPlan): boolean => {
      return billingPeriod === "yearly" || plan.billing === "سنويًا";
    },
    [billingPeriod],
  );

  const handleUpgradeClick = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedMonths([1]);
    setIsUpgradeDialogOpen(true);
  }, []);

  const handleConfirmUpgrade = useCallback(async () => {
    if (!selectedPlan || !isAuthReady) return;
    setIsProcessingPayment(true);
    try {
      const periods = selectedMonths[0];
      const periodPrice = parseFloat(String(selectedPlan.price));
      const totalAmount = periodPrice * periods;
      const response = await axiosInstance.post("/make-payment", {
        package_id: selectedPlan.id,
        price: totalAmount,
        period: periods,
        total_amount: totalAmount,
      });
      if (response.data.status === "success") {
        setPaymentUrl(response.data.payment_url ?? "");
        setIsUpgradeDialogOpen(false);
        setIsPopupOpen(true);
      } else {
        toast.error("فشل في الحصول على رابط الدفع");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء الاتصال بالخادم"));
    } finally {
      setIsProcessingPayment(false);
    }
  }, [selectedPlan, selectedMonths, isAuthReady]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  return {
    subscriptionPlans,
    isLoadingPlans,
    billingPeriod,
    getCurrentPlans,
    isYearlyPlan,
    calculateSavings,
    isUpgradeDialogOpen,
    setIsUpgradeDialogOpen,
    selectedPlan,
    selectedMonths,
    setSelectedMonths,
    handleUpgradeClick,
    handleConfirmUpgrade,
    isProcessingPayment,
    isPopupOpen,
    paymentUrl,
    closePopup,
  };
}
