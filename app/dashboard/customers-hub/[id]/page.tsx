"use client";

import React, { useEffect } from "react";
import { CustomerDetailPageSimple } from "@/components/customers-hub/detail/CustomerDetailPageSimple";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import mockCustomers from "@/lib/mock/customers-hub-data";
import { useParams } from "next/navigation";

export default function CustomerDetailPageRoute() {
  const params = useParams();
  const { setCustomers, customers, getCustomerById, setSelectedCustomer } =
    useUnifiedCustomersStore();

  const customerId = params.id as string;

  // Load mock data on mount
  useEffect(() => {
    if (customers.length === 0) {
      setCustomers(mockCustomers);
    }
  }, [setCustomers, customers.length]);

  // Set selected customer
  useEffect(() => {
    if (customerId && customers.length > 0) {
      const customer = getCustomerById(customerId);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [customerId, customers.length, getCustomerById, setSelectedCustomer]);

  return <CustomerDetailPageSimple customerId={customerId} />;
}
