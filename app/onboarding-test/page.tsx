import type { Metadata } from "next";
import { headers } from "next/headers";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import TenantPageWrapper from "../TenantPageWrapper";

export const metadata: Metadata = {
  title: "إعداد موقعك | منشئ المواقع",
  description: "إعداد موقعك الجديد وتخصيصه",
};

export default async function OnboardingRoute() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك subdomain (tenantId موجود)، افتح TenantPageWrapper
  if (tenantId) {
    return <TenantPageWrapper tenantId={tenantId} slug="onboarding" />;
  }

  // إذا لم يكن هناك subdomain، افتح صفحة الـ onboarding العادية
  return <OnboardingFlow disableCompletionRedirect />;
}
