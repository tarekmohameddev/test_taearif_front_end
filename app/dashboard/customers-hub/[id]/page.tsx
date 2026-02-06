"use client";

import React from "react";
import { CustomerDetailPageSimple } from "@/components/customers-hub/detail/CustomerDetailPageSimple";
import { useCustomerDetail } from "@/hooks/useCustomerDetail";
import { useParams } from "next/navigation";

export default function CustomerDetailPageRoute() {
  const params = useParams();
  const customerId = params.id as string;

  const {
    customer,
    stats,
    tasks,
    interestedProperties,
    preferences,
    history,
    loading,
    error,
    refetch,
    updateCustomer,
    addTask,
    updateTask,
    deleteTask,
    updatePreferences,
  } = useCustomerDetail(customerId);

  return (
    <CustomerDetailPageSimple
      customerId={customerId}
      customer={customer}
      stats={stats}
      tasks={tasks}
      interestedProperties={interestedProperties}
      preferences={preferences}
      history={history}
      loading={loading}
      error={error}
      onRefetch={refetch}
      onUpdateCustomer={updateCustomer}
      onAddTask={addTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
      onUpdatePreferences={updatePreferences}
    />
  );
}
