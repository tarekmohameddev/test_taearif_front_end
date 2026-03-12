/**
 * Settings Payment API — subscription plans and make-payment.
 * Single source for payment-related endpoints; use from hooks only.
 */
import axiosInstance from "@/lib/axiosInstance";
import type { SubscriptionPlansResponse } from "@/components/settings/types";

// --- In-flight request deduplication (PREVENT_DUPLICATE_API) ---
const inFlight = new Map<string, Promise<unknown>>();

function dedupeByKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

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
  return dedupeByKey("subscription-plans", async () => {
    const response = await axiosInstance.get<{ plans?: SubscriptionPlansResponse }>(
      "/settings/payment",
    );
    return {
      plans: response.data.plans ?? {},
    };
  });
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
