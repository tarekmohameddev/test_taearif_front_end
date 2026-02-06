"use client";

import React from "react";
import { RequestDetailPage } from "@/components/customers-hub/requests/RequestDetailPage";
import { useRequestDetail } from "@/hooks/useRequestDetail";
import { useParams } from "next/navigation";

export default function RequestDetailPageRoute() {
  const params = useParams();
  const requestId = params.requestId as string;

  const {
    action,
    stats,
    loading,
    error,
    refetch,
    completeAction,
    dismissAction,
    snoozeAction,
    assignAction,
  } = useRequestDetail(requestId);

  return (
    <RequestDetailPage
      requestId={requestId}
      action={action}
      stats={stats}
      loading={loading}
      error={error}
      onCompleteAction={completeAction}
      onDismissAction={dismissAction}
      onSnoozeAction={snoozeAction}
      onAssignAction={assignAction}
      onRefetch={refetch}
    />
  );
}
