"use client";

import { Check, Sparkles, Star, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionPlan } from "@/components/settings/types";
import type { BillingPeriod } from "@/components/settings/types";
import type { SavingsResult } from "@/hooks/useSubscriptionPlans";

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  billingPeriod: BillingPeriod;
  onUpgrade: (plan: SubscriptionPlan) => void;
  monthlyPriceForSavings?: string | number;
  savingsPercentage?: number;
}

export function PlanCard({
  plan,
  isCurrentPlan,
  billingPeriod,
  onUpgrade,
  monthlyPriceForSavings,
  savingsPercentage,
}: PlanCardProps) {
  const features =
    plan.features && typeof plan.features === "object"
      ? (Object.values(plan.features).flat() as string[])
      : [];

  return (
    <Card
      className={`relative flex flex-col transition-all duration-300 hover:shadow-lg ${
        isCurrentPlan ? "border-primary border-2 shadow-lg" : ""
      } ${billingPeriod === "yearly" ? "ring-2 ring-green-100" : ""}`}
    >
      {billingPeriod === "yearly" && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>الأكثر توفيرًا</span>
            </div>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>{plan.name}</span>
          {billingPeriod === "yearly" && (
            <Badge className="bg-gray-100 text-gray-800 border-gray-300">
              <Percent className="h-3 w-3 ml-1" />
              توفير
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-end gap-1 mt-2">
          <div className="flex items-center gap-1">
            <img
              src="/Saudi_Riyal_Symbol.svg"
              alt="ريال سعودي"
              className="w-5 h-5 filter brightness-0 contrast-100"
            />
            <span className="text-2xl font-bold text-foreground">
              {plan.price}
            </span>
          </div>
          <span className="text-muted-foreground">/ {plan.billing}</span>
        </CardDescription>

        {billingPeriod === "yearly" && monthlyPriceForSavings != null && (
          <div className="text-sm text-muted-foreground mt-1">
            <span className="line-through">
              {monthlyPriceForSavings} شهريًا
            </span>
            {savingsPercentage != null && (
              <span className="text-gray-700 font-medium mr-2">
                وفر {savingsPercentage}%
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4 flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={`${feature}-${index}`} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                <Check className="h-3 w-3 text-gray-700" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
        {isCurrentPlan ? (
          <Button variant="outline" className="w-full" disabled>
            <Check className="h-4 w-4 ml-1" />
            {plan.cta ?? "الخطة الحالية"}
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full transition-all duration-300 bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => onUpgrade(plan)}
          >
            {billingPeriod === "yearly" ? (
              <>
                <Sparkles className="h-4 w-4 ml-1" />
                {plan.cta ?? "الترقية السنوية"}
              </>
            ) : (
              plan.cta ?? "الترقية"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
