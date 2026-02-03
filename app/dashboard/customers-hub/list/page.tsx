"use client";

import React, { useEffect } from "react";
import { EnhancedCustomersHubPage } from "@/components/customers-hub/page/EnhancedCustomersHubPage";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import mockCustomers from "@/lib/mock/customers-hub-data";

export default function CustomersListPage() {
  const { setCustomers, customers } = useUnifiedCustomersStore();

  // Load mock data on mount - force reload with coordinates
  useEffect(() => {
    // Always reload to ensure we have the latest data with coordinates
    console.log("🗺️ Loading mock customers data...");
    console.log(`📊 Total mock customers: ${mockCustomers.length}`);
    console.log(`🌍 Customers with coordinates: ${mockCustomers.filter(c => c.latitude && c.longitude).length}`);
    
    setCustomers(mockCustomers);
  }, [setCustomers]);

  return <EnhancedCustomersHubPage />;
}
