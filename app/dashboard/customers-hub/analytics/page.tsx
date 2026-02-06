"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnalyticsDashboard } from "@/components/customers-hub/analytics/AnalyticsDashboard";
import { useCustomersHubAnalytics } from "@/hooks/useCustomersHubAnalytics";
import useAuthStore from "@/context/AuthContext";

export default function AnalyticsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
    metrics,
    trends,
    sources,
    performance,
    timeRange,
    loading,
    error,
    fetchAllAnalytics,
    setTimeRange,
  } = useCustomersHubAnalytics();

  const [initialLoad, setInitialLoad] = useState(false);

  // Fetch initial data when token is ready
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    if (initialLoad) {
      return;
    }

    const loadInitialData = async () => {
      try {
        await fetchAllAnalytics({ timeRange: "last30days" });
        setInitialLoad(true);
      } catch (err) {
        console.error("Error loading initial analytics data:", err);
      }
    };

    loadInitialData();
  }, [userData?.token, authLoading, fetchAllAnalytics, initialLoad]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/ar/dashboard/customers-hub">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تحليلات العملاء
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              رؤى شاملة عن أداء المبيعات والعملاء
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        metrics={metrics}
        trends={trends}
        sources={sources}
        performance={performance}
        timeRange={timeRange}
        loading={loading}
        error={error}
        onTimeRangeChange={setTimeRange}
        onFetchAllAnalytics={fetchAllAnalytics}
      />
      </div>
    </div>
  );
}
