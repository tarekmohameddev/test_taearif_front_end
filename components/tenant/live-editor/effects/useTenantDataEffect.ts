import { useEffect, useRef } from "react";

interface UseTenantDataEffectProps {
  tenantId: string | null;
  fetchTenantData: (id: string) => void;
}

export const useTenantDataEffect = ({
  tenantId,
  fetchTenantData,
}: UseTenantDataEffectProps) => {
  const prevTenantIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (tenantId && tenantId !== prevTenantIdRef.current) {
      prevTenantIdRef.current = tenantId;
      fetchTenantData(tenantId as string);
    }
  }, [tenantId, fetchTenantData]);
};
