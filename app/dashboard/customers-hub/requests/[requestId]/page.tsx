"use client";

import React, { useEffect } from "react";
import { RequestDetailPage } from "@/components/customers-hub/requests/RequestDetailPage";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import mockCustomers from "@/lib/mock/customers-hub-data";
import { createIncomingAction } from "@/lib/utils/action-helpers";
import { useParams } from "next/navigation";

export default function RequestDetailPageRoute() {
  const params = useParams();
  const { setCustomers, customers, actions, setActions } = useUnifiedCustomersStore();
  
  const requestId = params.requestId as string;

  // Load mock data on mount
  useEffect(() => {
    if (customers.length === 0) {
      setCustomers(mockCustomers);
      const incomingActions = mockCustomers.map((customer) =>
        createIncomingAction(customer)
      );
      setActions(incomingActions);
    }
  }, [setCustomers, setActions, customers.length]);

  return <RequestDetailPage requestId={requestId} />;
}
