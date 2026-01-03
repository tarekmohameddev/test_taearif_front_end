"use client";
import React from "react";
import LiveEditor from "@/components/tenant/live-editor/LiveEditor";
import useTenantStore from "@/context/tenantStore";
import { useEffect } from "react";

interface LiveEditorWrapperProps {
  tenantId: string | null;
}

export default function LiveEditorWrapper({
  tenantId,
}: LiveEditorWrapperProps) {
  const setTenantId = useTenantStore((s) => s.setTenantId);

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    }
  }, [tenantId, setTenantId]);

  return <LiveEditor />;
}
