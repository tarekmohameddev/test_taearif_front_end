/**
 * Settings page types: domains, DNS, and subscription plans.
 * Used by useDomains, useSubscriptionPlans, and settings subcomponents.
 */

export interface Domain {
  id: string;
  custom_name: string;
  status: "active" | "pending";
  primary: boolean;
  ssl?: boolean;
  addedDate?: string;
}

export interface DnsInstructions {
  description?: string;
  note?: string;
}

export type BillingPeriod = "monthly" | "yearly";

export interface SubscriptionPlan {
  id: string | number;
  name: string;
  price: string | number;
  billing: string;
  features?: Record<string, string[]>;
  cta?: string;
}

export interface SubscriptionPlansResponse {
  plans_monthly?: SubscriptionPlan[];
  plans_yearly?: SubscriptionPlan[];
}

export type DomainStatusFilter = "all" | "active" | "pending";
