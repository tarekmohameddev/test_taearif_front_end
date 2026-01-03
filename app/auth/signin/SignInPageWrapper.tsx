"use client";

import { useEffect } from "react";
import useTenantStore from "@/context/tenantStore";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import SignInForm from "@/components/tenant/auth/signin-form";

interface SignInPageWrapperProps {
  tenantId: string | null;
}

export default function SignInPageWrapper({
  tenantId,
}: SignInPageWrapperProps) {
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    }
  }, [tenantId, setTenantId]);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader1 />
      <main className="flex-1 flex items-center justify-center">
        <SignInForm />
      </main>
      <StaticFooter1 />
    </div>
  );
}
