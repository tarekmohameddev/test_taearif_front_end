"use client";

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState, useCallback, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncompleteRequestsPageHeader } from "./page-components/IncompleteRequestsPageHeader";
import { IncompleteRequestsStatisticsCards } from "./page-components/IncompleteRequestsStatisticsCards";
import { IncompleteRequestsFiltersAndSearch } from "./page-components/IncompleteRequestsFiltersAndSearch";
import {
  IncompleteRequestsTable,
  IncompleteRequest,
} from "./page-components/IncompleteRequestsTable";

// API Response interfaces
interface IncompleteRequestsResponse {
  success: boolean;
  data: IncompleteRequest[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export default function IncompleteRequestsPage() {
  const [activeTab, setActiveTab] = useState("incomplete-requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [source, setSource] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [cityId, setCityId] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);

  const [requests, setRequests] = useState<IncompleteRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{
    total: number;
    by_source?: { web?: number; whatsapp?: number };
    by_purpose?: { rent?: number; sale?: number };
  } | null>(null);
  const { userData } = useAuthStore();
  const isInitialLoad = useRef(true);

  // Fetch incomplete requests with filters
  const fetchIncompleteRequests = useCallback(async () => {
    if (!userData?.token) {
      console.log("No token available, skipping fetchIncompleteRequests");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("is_complete", "0"); // Always filter for incomplete requests
      params.append("per_page", perPage.toString());
      params.append("page", currentPage.toString());

      if (source) params.append("source", source);
      if (purpose) params.append("purpose", purpose);
      if (searchTerm) params.append("search", searchTerm);
      if (dateRange?.from) {
        params.append("date_from", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        params.append("date_to", format(dateRange.to, "yyyy-MM-dd"));
      }
      if (priceMin) params.append("price_min", priceMin);
      if (priceMax) params.append("price_max", priceMax);
      if (cityId) params.append("city_id", cityId);

      const response = await axiosInstance.get<IncompleteRequestsResponse>(
        `/v1/matching/requests?${params.toString()}`,
      );

      if (response.data.success) {
        setRequests(response.data.data);
        setTotalItems(response.data.meta.total);

        // Calculate statistics from the data
        const stats = {
          total: response.data.meta.total,
          by_source: {
            web: response.data.data.filter((r) => r.source === "web").length,
            whatsapp: response.data.data.filter((r) => r.source === "whatsapp")
              .length,
          },
          by_purpose: {
            rent: response.data.data.filter((r) => r.purpose === "rent").length,
            sale: response.data.data.filter((r) => r.purpose === "sale").length,
          },
        };
        setStatistics(stats);
      }
    } catch (err: any) {
      console.error("Error fetching incomplete requests:", err);
      setError("حدث خطأ أثناء تحميل البيانات.");
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [
    userData?.token,
    source,
    purpose,
    searchTerm,
    dateRange,
    priceMin,
    priceMax,
    cityId,
    currentPage,
    perPage,
  ]);

  useEffect(() => {
    fetchIncompleteRequests();
  }, [fetchIncompleteRequests]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, purpose, searchTerm, dateRange, priceMin, priceMax, cityId]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSource("");
    setPurpose("");
    setDateRange(undefined);
    setPriceMin("");
    setPriceMax("");
    setCityId("");
    setCurrentPage(1);
  };

  const handleViewRequest = (request: IncompleteRequest) => {
    // Navigate to request details page
    // You can implement this based on your routing structure
    console.log("View request:", request);
    toast.info("عرض تفاصيل الطلب - قيد التطوير");
  };

  const handleEditRequest = (request: IncompleteRequest) => {
    // Navigate to edit request page
    // You can implement this based on your routing structure
    console.log("Edit request:", request);
    toast.info("تعديل الطلب - قيد التطوير");
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </div>
              </div>

              {/* Statistics Cards Skeleton */}
              <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Skeleton className="h-4 w-4 ml-2" />
                        <Skeleton className="h-4 w-20" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-12 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filters Skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>

              {/* Table Skeleton */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <div className="flex items-center border-b p-4">
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center border-b p-4">
                        <Skeleton className="h-4 w-32 ml-8" />
                        <Skeleton className="h-6 w-16 rounded-full ml-8" />
                        <Skeleton className="h-6 w-16 rounded-full ml-8" />
                        <Skeleton className="h-4 w-24 ml-8" />
                        <Skeleton className="h-4 w-20 ml-8" />
                        <Skeleton className="h-4 w-12 ml-8" />
                        <Skeleton className="h-4 w-24 ml-8" />
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <IncompleteRequestsPageHeader />

            {/* Statistics Cards */}
            <IncompleteRequestsStatisticsCards
              statistics={statistics}
              loading={loading}
            />

            {/* Filters and Search */}
            <IncompleteRequestsFiltersAndSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              source={source}
              setSource={setSource}
              purpose={purpose}
              setPurpose={setPurpose}
              dateRange={dateRange}
              setDateRange={setDateRange}
              priceMin={priceMin}
              setPriceMin={setPriceMin}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              cityId={cityId}
              setCityId={setCityId}
              onResetFilters={handleResetFilters}
            />

            {/* Main Content */}
            <IncompleteRequestsTable
              requests={requests}
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / perPage)}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              perPage={perPage}
              loading={loading}
              onView={handleViewRequest}
              onEdit={handleEditRequest}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
