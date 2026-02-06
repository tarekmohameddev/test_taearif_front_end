import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "/v2/customers-hub/analytics";

export interface TimeRange {
  timeRange: "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "custom";
  start?: string;
  end?: string;
}

export interface AnalyticsMetricsParams {
  action: "metrics";
  timeRange: TimeRange;
}

export interface AnalyticsMetricsResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    metrics: {
      totalCustomers: number;
      newCustomers: number;
      activeCustomers: number;
      totalInquiries: number;
      completedTasks: number;
      totalAppointments: number;
      conversionRate: string;
      avgResponseTime: string;
      avgDaysToClose: number;
    };
    timeRange: {
      start: string;
      end: string;
    };
  };
  timestamp: string;
}

export interface AnalyticsTrendsParams {
  action: "trends";
  timeRange: TimeRange;
  metrics?: string[];
}

export interface TrendDataPoint {
  date: string;
  newCustomers?: number;
  completedTasks?: number;
  appointments?: number;
  [key: string]: any;
}

export interface AnalyticsTrendsResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    trends: TrendDataPoint[];
    timeRange: {
      start: string;
      end: string;
    };
  };
  timestamp: string;
}

export interface AnalyticsSourcesParams {
  action: "sources";
  timeRange: TimeRange;
}

export interface SourceAnalytics {
  source: string;
  count: number;
  percentage: string;
  conversionRate: string;
}

export interface AnalyticsSourcesResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    sources: SourceAnalytics[];
    timeRange: {
      start: string;
      end: string;
    };
  };
  timestamp: string;
}

export interface AnalyticsPerformanceParams {
  action: "performance";
  timeRange: TimeRange;
}

export interface EmployeePerformance {
  id: number;
  name: string;
  customersManaged: number;
  tasksCompleted: number;
  avgResponseTime: string;
  conversionRate: string;
  totalDeals: number;
}

export interface AnalyticsPerformanceResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    employees: EmployeePerformance[];
    timeRange: {
      start: string;
      end: string;
    };
  };
  timestamp: string;
}

// Get Analytics Metrics
export async function getAnalyticsMetrics(params: AnalyticsMetricsParams): Promise<AnalyticsMetricsResponse> {
  const response = await axiosInstance.post<AnalyticsMetricsResponse>(`${BASE_URL}`, params);
  return response.data;
}

// Get Analytics Trends
export async function getAnalyticsTrends(params: AnalyticsTrendsParams): Promise<AnalyticsTrendsResponse> {
  const response = await axiosInstance.post<AnalyticsTrendsResponse>(`${BASE_URL}/trends`, params);
  return response.data;
}

// Get Analytics by Sources
export async function getAnalyticsSources(params: AnalyticsSourcesParams): Promise<AnalyticsSourcesResponse> {
  const response = await axiosInstance.post<AnalyticsSourcesResponse>(`${BASE_URL}/sources`, params);
  return response.data;
}

// Get Performance Analytics
export async function getAnalyticsPerformance(params: AnalyticsPerformanceParams): Promise<AnalyticsPerformanceResponse> {
  const response = await axiosInstance.post<AnalyticsPerformanceResponse>(`${BASE_URL}/performance`, params);
  return response.data;
}
