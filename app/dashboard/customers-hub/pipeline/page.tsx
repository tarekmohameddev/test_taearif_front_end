"use client";

import React, { useEffect } from "react";
import { PipelinePage } from "@/components/customers-hub/pipeline/PipelinePage";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import mockCustomers from "@/lib/mock/customers-hub-data";

export default function CustomersHubPipelinePage() {
  const { setCustomers, customers } = useUnifiedCustomersStore();

  // Load mock data on mount
  useEffect(() => {
    if (customers.length === 0) {
      setCustomers(mockCustomers);
    }
  }, [setCustomers, customers.length]);

  return <PipelinePage />;
}
