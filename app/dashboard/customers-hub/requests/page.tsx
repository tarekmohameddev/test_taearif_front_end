"use client";

import React, { useEffect } from "react";
import { RequestsCenterPage } from "@/components/customers-hub/requests/RequestsCenterPage";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import mockCustomers from "@/lib/mock/customers-hub-data";
import { createIncomingAction } from "@/lib/utils/action-helpers";

export default function CustomersHubRequestsPage() {
  const { setCustomers, customers, actions, setActions } = useUnifiedCustomersStore();

  useEffect(() => {
    if (customers.length === 0) {
      setCustomers(mockCustomers);
      const incomingActions = mockCustomers.map((customer) =>
        createIncomingAction(customer)
      );
      setActions(incomingActions);
    }
  }, [setCustomers, setActions, customers.length]);

  return <RequestsCenterPage />;
}
