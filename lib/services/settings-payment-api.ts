/**
 * Settings Payment API — subscription plans and make-payment.
 * Single source for payment-related endpoints; use from hooks only.
 */
import axiosInstance from "@/lib/axiosInstance";
import type { SubscriptionPlansResponse } from "@/components/settings/types";

export interface GetPaymentResponse {
  plans: SubscriptionPlansResponse;
}

export interface MakePaymentBody {
  package_id: string | number;
  price: number;
  period: number;
  total_amount: number;
}

export interface MakePaymentResponse {
  status: string;
  payment_url?: string;
}

/** GET /settings/payment — fetch subscription plans (monthly/yearly) */
export async function getSubscriptionPlans(): Promise<GetPaymentResponse> {
  const response = await axiosInstance.get<{ plans?: SubscriptionPlansResponse }>(
    "/settings/payment",
  );
  return {
    plans: response.data.plans ?? {},
  };
}

/** POST /make-payment — create payment and get payment URL */
export async function makePayment(
  body: MakePaymentBody,
): Promise<MakePaymentResponse> {
  const response = await axiosInstance.post<MakePaymentResponse>(
    "/make-payment",
    body,
  );
  return response.data;
}
