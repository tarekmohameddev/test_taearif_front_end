import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";
import {
  getAnalyticsMetrics,
  getAnalyticsTrends,
  getAnalyticsSources,
  getAnalyticsPerformance,
  type AnalyticsMetricsParams,
  type AnalyticsTrendsParams,
  type AnalyticsSourcesParams,
  type AnalyticsPerformanceParams,
  type AnalyticsMetricsResponse,
  type AnalyticsTrendsResponse,
  type AnalyticsSourcesResponse,
  type AnalyticsPerformanceResponse,
  type TimeRange,
} from "@/lib/services/customers-hub-analytics-api";

export function useCustomersHubAnalytics() {
  const userData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
  const [metrics, setMetrics] = useState<AnalyticsMetricsResponse["data"]["metrics"] | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrendsResponse["data"]["trends"] | null>(null);
  const [sources, setSources] = useState<AnalyticsSourcesResponse["data"]["sources"] | null>(null);
  const [performance, setPerformance] = useState<AnalyticsPerformanceResponse["data"]["employees"] | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>({ timeRange: "last30days" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics metrics
  const fetchMetrics = useCallback(
    async (range: TimeRange) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const params: AnalyticsMetricsParams = {
          action: "metrics",
          timeRange: range,
        };
        const response = await getAnalyticsMetrics(params);
        
        if (response.status === "success") {
          setMetrics(response.data.metrics);
          setTimeRange(response.data.timeRange);
        } else {
          setError(response.message || "Failed to load analytics metrics");
        }
      } catch (err: any) {
        console.error("Error fetching analytics metrics:", err);
        setError(
          err.response?.data?.message || "An error occurred while loading analytics metrics"
        );
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading]
  );

  // Fetch analytics trends
  const fetchTrends = useCallback(
    async (range: TimeRange, metricsList?: string[]) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        const params: AnalyticsTrendsParams = {
          action: "trends",
          timeRange: range,
          metrics: metricsList,
        };
        const response = await getAnalyticsTrends(params);
        
        if (response.status === "success") {
          setTrends(response.data.trends);
        }
      } catch (err: any) {
        console.error("Error fetching analytics trends:", err);
      }
    },
    [userData?.token, authLoading]
  );

  // Fetch analytics sources
  const fetchSources = useCallback(
    async (range: TimeRange) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        const params: AnalyticsSourcesParams = {
          action: "sources",
          timeRange: range,
        };
        const response = await getAnalyticsSources(params);
        
        if (response.status === "success") {
          setSources(response.data.sources);
        }
      } catch (err: any) {
        console.error("Error fetching analytics sources:", err);
      }
    },
    [userData?.token, authLoading]
  );

  // Fetch performance analytics
  const fetchPerformance = useCallback(
    async (range: TimeRange) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        const params: AnalyticsPerformanceParams = {
          action: "performance",
          timeRange: range,
        };
        const response = await getAnalyticsPerformance(params);
        
        if (response.status === "success") {
          setPerformance(response.data.employees);
        }
      } catch (err: any) {
        console.error("Error fetching performance analytics:", err);
      }
    },
    [userData?.token, authLoading]
  );

  // Fetch all analytics data
  const fetchAllAnalytics = useCallback(
    async (range: TimeRange) => {
      await Promise.all([
        fetchMetrics(range),
        fetchTrends(range),
        fetchSources(range),
        fetchPerformance(range),
      ]);
    },
    [fetchMetrics, fetchTrends, fetchSources, fetchPerformance]
  );

  return {
    metrics,
    trends,
    sources,
    performance,
    timeRange,
    loading,
    error,
    fetchMetrics,
    fetchTrends,
    fetchSources,
    fetchPerformance,
    fetchAllAnalytics,
    setTimeRange,
  };
}
