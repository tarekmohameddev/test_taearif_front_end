"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";
import type {
  SubscriptionPlan,
  SubscriptionPlansResponse,
  BillingPeriod,
} from "@/components/settings/types";
import { DEFAULT_BILLING_PERIOD } from "@/components/settings/constants";
import {
  getSubscriptionPlans,
  makePayment,
} from "@/lib/services/settings-payment-api";

const PLANS_FETCH_DEBOUNCE_MS = 2000;

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
  const lastFetchedPlansAt = useRef<number>(0);
  const loadingPlansRef = useRef<boolean>(false);

  const isAuthReady = !authLoading && !!userData?.token;

  const fetchPlans = useCallback(async () => {
    if (!isAuthReady) {
      setIsLoadingPlans(false);
      return;
    }

    // 1) Loading guard: do not start another request if one is in progress
    if (loadingPlansRef.current) return;

    // 2) Last-fetched guard: skip if we just fetched (avoid rapid duplicate calls)
    const now = Date.now();
    if (now - lastFetchedPlansAt.current < PLANS_FETCH_DEBOUNCE_MS) {
      setIsLoadingPlans(false);
      return;
    }

    loadingPlansRef.current = true;
    setIsLoadingPlans(true);
    try {
      const data = await getSubscriptionPlans();
      setSubscriptionPlans(data.plans);
      lastFetchedPlansAt.current = Date.now();
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("فشل في تحميل خطط الاشتراك");
    } finally {
      loadingPlansRef.current = false;
      setIsLoadingPlans(false);
    }
  }, [isAuthReady]);

  useEffect(() => {
    let cancelled = false;
    fetchPlans();
    return () => {
      cancelled = true;
    };
  }, [fetchPlans]);

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
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);
    try {
      const periods = selectedMonths[0];
      const periodPrice = parseFloat(String(selectedPlan.price));
      const totalAmount = periodPrice * periods;
      const response = await makePayment({
        package_id: selectedPlan.id,
        price: totalAmount,
        period: periods,
        total_amount: totalAmount,
      });
      if (response.status === "success") {
        setPaymentUrl(response.payment_url ?? "");
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
  }, [selectedPlan, selectedMonths, isAuthReady, isProcessingPayment]);

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
