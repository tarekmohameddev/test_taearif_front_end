"use client";

import { CreditCardIcon, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SubscriptionPlan } from "@/components/settings/types";
import type { BillingPeriod } from "@/components/settings/types";
import type { SavingsResult } from "@/hooks/useSubscriptionPlans";
import { PlanCard } from "./PlanCard";

export interface SubscriptionTabProps {
  currentPlans: SubscriptionPlan[];
  isLoadingPlans: boolean;
  billingPeriod: BillingPeriod;
  subscriptionPlans: { plans_monthly?: SubscriptionPlan[]; plans_yearly?: SubscriptionPlan[] };
  calculateSavings: (
    monthlyPrice: string | number,
    yearlyPrice: string | number,
  ) => SavingsResult;
  onUpgradeClick: (plan: SubscriptionPlan) => void;
}

export function SubscriptionTab({
  currentPlans,
  isLoadingPlans,
  billingPeriod,
  subscriptionPlans,
  calculateSavings,
  onUpgradeClick,
}: SubscriptionTabProps) {
  const monthlyPrice =
    subscriptionPlans.plans_monthly?.[0]?.price ?? "0";
  const yearlyPrice =
    subscriptionPlans.plans_yearly?.[0]?.price ?? "0";
  const savings =
    billingPeriod === "yearly" && subscriptionPlans.plans_monthly?.length && subscriptionPlans.plans_yearly?.length
      ? calculateSavings(monthlyPrice, yearlyPrice)
      : null;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col items-center gap-6 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">إدارة الاشتراك</h2>
          <p className="text-muted-foreground">
            عرض وتحديث خطة الاشتراك الخاصة بك
          </p>
        </div>

        {savings != null && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 px-3 py-2 rounded-lg border border-gray-300">
              <Sparkles className="h-4 w-4" />
              <span>
                وفر {savings.savings.toFixed(0)} ريال سنويًا
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {isLoadingPlans ? (
          [1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : !currentPlans.length ? (
          <div className="col-span-3 flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">
              لا توجد خطط اشتراك متاحة
            </h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على خطط الاشتراك أو حدث خطأ في التحميل
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 ml-1" />
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          currentPlans.map((plan) => {
            const isCurrentPlan = plan.cta !== "الترقية";
            const monthlyForSavings = subscriptionPlans.plans_monthly?.[0]?.price;
            const savingsPct =
              billingPeriod === "yearly" && monthlyForSavings
                ? calculateSavings(monthlyForSavings, plan.price).savingsPercentage
                : undefined;

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={isCurrentPlan}
                billingPeriod={billingPeriod}
                onUpgrade={onUpgradeClick}
                monthlyPriceForSavings={
                  billingPeriod === "yearly"
                    ? subscriptionPlans.plans_monthly?.[0]?.price
                    : undefined
                }
                savingsPercentage={savingsPct}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
