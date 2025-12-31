import { useEffect } from "react";

interface UseTenantDataEffectProps {
  tenantId: string | null;
  fetchTenantData: (id: string) => void;
}

export const useTenantDataEffect = ({
  tenantId,
  fetchTenantData,
}: UseTenantDataEffectProps) => {
  // Tenant Data Loading Effect
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId as string);
    }
  }, [tenantId, fetchTenantData]);
};
