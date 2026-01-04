"use client";

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import { z } from "zod";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyRequestsPageHeader } from "./page-components/PropertyRequestsPageHeader";
import { PropertyRequestStatisticsCards } from "./page-components/PropertyRequestStatisticsCards";
import { PropertyRequestTypeDistribution } from "./page-components/PropertyRequestTypeDistribution";
import { PropertyRequestFiltersAndSearch } from "./page-components/PropertyRequestFiltersAndSearch";
import { PropertyRequestsTable } from "./page-components/PropertyRequestsTable";

// Property Request interface based on API response
interface PropertyRequest {
  id: number;
  user_id: number;
  region: string;
  property_type: string;
  category_id: number;
  city_id: number;
  districts_id: number | null;
  category: string | null;
  neighborhoods: string[] | null;
  area_from: number | null;
  area_to: number | null;
  purchase_method: string;
  budget_from: number;
  budget_to: number;
  seriousness: string;
  purchase_goal: string;
  wants_similar_offers: boolean;
  full_name: string;
  phone: string;
  contact_on_whatsapp: boolean;
  notes: string;
  is_read: number;
  is_active?: number;
  status?: {
    id: number;
    name_ar: string;
    name_en: string;
  } | null;
  employee?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface PropertyRequestsResponse {
  status: string;
  data: {
    property_requests: PropertyRequest[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
    statistics: {
      total_requests: number;
      by_status: {
        [key: string]: number;
      };
    };
  };
}

// Filters interfaces
interface FilterCity {
  id: number;
  name_ar: string;
  name_en: string;
}

interface FilterDistrict {
  id: number;
  city_id: number;
  name_ar: string;
  name_en: string;
}

interface FilterCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface FiltersResponse {
  status: string;
  data: {
    cities: FilterCity[];
    districts: FilterDistrict[];
    categories: FilterCategory[];
    property_types: string[];
    purchase_goals: string[];
    seriousness_options: string[];
  };
}

export default function PropertyRequestsPage() {
  const [activeTab, setActiveTab] = useState("property-requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyRequest, setSelectedPropertyRequest] =
    useState<PropertyRequest | null>(null);
  const [selectedPropertyRequests, setSelectedPropertyRequests] = useState<
    number[]
  >([]);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter states
  const [cityId, setCityId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [purchaseGoal, setPurchaseGoal] = useState<string>("");
  const [seriousness, setSeriousness] = useState<string>("");

  // Filters data
  const [filtersData, setFiltersData] = useState<
    FiltersResponse["data"] | null
  >(null);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filteredDistricts, setFilteredDistricts] = useState<FilterDistrict[]>(
    [],
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);

  // Sorted property requests
  const [
    filteredAndSortedPropertyRequests,
    setFilteredAndSortedPropertyRequests,
  ] = useState<PropertyRequest[]>([]);

  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false);
  const [totalPropertyRequests, setTotalPropertyRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyRequestsData, setPropertyRequestsData] = useState<
    PropertyRequest[]
  >([]);
  const [statistics, setStatistics] = useState<{
    total_requests: number;
    by_status: { [key: string]: number };
  } | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyRequest> | null>(
    null,
  );
  const [editingPropertyRequestId, setEditingPropertyRequestId] = useState<
    number | null
  >(null);
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPropertyRequest, setNewPropertyRequest] = useState({
    property_type: "",
    category: "",
    neighborhoods: [] as string[],
    area_from: null as number | null,
    area_to: null as number | null,
    purchase_method: "",
    budget_from: 0,
    budget_to: 0,
    seriousness: "",
    purchase_goal: "",
    wants_similar_offers: false,
    full_name: "",
    phone: "",
    contact_on_whatsapp: false,
  });
  const { userData } = useAuthStore();

  // Fetch filters data
  useEffect(() => {
    const fetchFilters = async () => {
      if (!userData?.token) {
        console.log("No token available, skipping fetchFilters");
        setLoadingFilters(false);
        return;
      }

      try {
        const response = await axiosInstance.get<FiltersResponse>(
          "/v1/property-requests/filters",
        );
        setFiltersData(response.data.data);
      } catch (err) {
        console.error("Error fetching filters:", err);
        toast.error("حدث خطأ أثناء تحميل بيانات الفلاتر");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [userData?.token]);

  // Fetch property requests with filters
  const fetchPropertyRequests = useCallback(async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchPropertyRequests");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (cityId) params.append("city_id", cityId);
      if (districtId) params.append("district_id", districtId);
      if (categoryId) params.append("category_id", categoryId);
      if (propertyType) params.append("property_type", propertyType);
      if (purchaseGoal) params.append("purchase_goal", purchaseGoal);
      if (seriousness) params.append("seriousness", seriousness);
      if (searchTerm) params.append("q", searchTerm);
      params.append("per_page", perPage.toString());
      params.append("page", currentPage.toString());

      const response = await axiosInstance.get<PropertyRequestsResponse>(
        `/v1/property-requests?${params.toString()}`,
      );
      const { property_requests, pagination, statistics } = response.data.data;
      setPropertyRequestsData(property_requests);
      setTotalPropertyRequests(pagination.total);
      setStatistics(statistics);
    } catch (err) {
      console.error("Error fetching property requests:", err);
      setError("حدث خطأ أثناء تحميل البيانات.");
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [
    userData?.token,
    cityId,
    districtId,
    categoryId,
    propertyType,
    purchaseGoal,
    seriousness,
    searchTerm,
    currentPage,
    perPage,
  ]);

  useEffect(() => {
    fetchPropertyRequests();
  }, [fetchPropertyRequests]);

  // Reset district when city changes
  useEffect(() => {
    setDistrictId("");
  }, [cityId]);

  // Filter districts based on selected city
  useEffect(() => {
    if (!filtersData || !cityId) {
      setFilteredDistricts([]);
      return;
    }
    const filtered = filtersData.districts.filter(
      (district) => district.city_id === parseInt(cityId),
    );
    setFilteredDistricts(filtered);
  }, [filtersData, cityId]);

  // Sort property requests (data is already filtered by API)
  useEffect(() => {
    const sorted = [...propertyRequestsData].sort((a, b) => {
      let aValue = a[sortField as keyof PropertyRequest];
      let bValue = b[sortField as keyof PropertyRequest];

      // Handle cases where values might not be strings
      const aStr = String(aValue ?? "").toLowerCase();
      const bStr = String(bValue ?? "").toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
    setFilteredAndSortedPropertyRequests(sorted);
  }, [propertyRequestsData, sortField, sortDirection]);

  // Reset to page 1 when any filter changes (but not when currentPage changes)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cityId,
    districtId,
    categoryId,
    propertyType,
    purchaseGoal,
    seriousness,
    searchTerm,
  ]);

  const handleNewPropertyRequestChange =
    (field: keyof typeof newPropertyRequest) => (value: any) => {
      setNewPropertyRequest((prev) => ({ ...prev, [field]: value }));
    };

  const handleNewPropertyRequestInputChange =
    (field: keyof typeof newPropertyRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewPropertyRequest((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddPropertyRequest = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleAddPropertyRequest");
      return;
    }

    setIsSubmitting(true);
    try {
      // بناء الـ request بالشكل المطلوب
      const requestData = {
        full_name: newPropertyRequest.full_name,
        phone: newPropertyRequest.phone,
        region: "", // يمكن إضافته لاحقاً إذا كان موجوداً في النموذج
        property_type: newPropertyRequest.property_type,
        category_id: newPropertyRequest.category ? parseInt(newPropertyRequest.category) : null,
        city_id: null, // يمكن إضافته لاحقاً إذا كان موجوداً في النموذج
        districts_id: newPropertyRequest.neighborhoods && newPropertyRequest.neighborhoods.length > 0 
          ? parseInt(newPropertyRequest.neighborhoods[0]) 
          : null,
        area_from: newPropertyRequest.area_from,
        area_to: newPropertyRequest.area_to,
        purchase_method: newPropertyRequest.purchase_method,
        budget_from: newPropertyRequest.budget_from,
        budget_to: newPropertyRequest.budget_to,
        seriousness: newPropertyRequest.seriousness,
        purchase_goal: newPropertyRequest.purchase_goal,
        wants_similar_offers: newPropertyRequest.wants_similar_offers,
        contact_on_whatsapp: newPropertyRequest.contact_on_whatsapp,
        is_read: false,
        is_active: true,
        status_id: 2,
      };

      const response = await axiosInstance.post(
        "/v1/property-requests",
        requestData,
      );

      // Add the new property request to the list
      setPropertyRequestsData((prev) => [response.data.data, ...prev]);

      // Show success toast
      toast.success("تم إضافة طلب العقار بنجاح! 🎉", {
        duration: 4000,
        position: "top-center",
      });

      // Reset form - clear all inputs
      setNewPropertyRequest({
        property_type: "",
        category: "",
        neighborhoods: [],
        area_from: null,
        area_to: null,
        purchase_method: "",
        budget_from: 0,
        budget_to: 0,
        seriousness: "",
        purchase_goal: "",
        wants_similar_offers: false,
        full_name: "",
        phone: "",
        contact_on_whatsapp: false,
      });
      // Clear any existing errors
      setClientErrors({});
      setValidationErrors({});
    } catch (error: any) {
      console.error("Error adding property request:", error);
      toast.error("حدث خطأ أثناء إضافة طلب العقار", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (propertyRequest: PropertyRequest) => {
    setEditingPropertyRequestId(propertyRequest.id);
    setFormData({
      property_type: propertyRequest.property_type || "",
      category: propertyRequest.category || "",
      neighborhoods: propertyRequest.neighborhoods || [],
      area_from: propertyRequest.area_from,
      area_to: propertyRequest.area_to,
      purchase_method: propertyRequest.purchase_method || "",
      budget_from: propertyRequest.budget_from,
      budget_to: propertyRequest.budget_to,
      seriousness: propertyRequest.seriousness || "",
      purchase_goal: propertyRequest.purchase_goal || "",
      wants_similar_offers: propertyRequest.wants_similar_offers,
      full_name: propertyRequest.full_name || "",
      phone: propertyRequest.phone || "",
      contact_on_whatsapp: propertyRequest.contact_on_whatsapp,
    });
    setOpen(true);
  };

  if (loading) {
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
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>

              {/* Statistics Cards Skeleton */}
              <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-6">
                <Card>
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
                {/* Repeat for remaining cards */}
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

              {/* Filters and Search Skeleton */}
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Skeleton className="h-10 w-[300px]" />
                </div>
                <div className="flex items-center gap-2 ">
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>

              {/* Table Skeleton */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {/* Table Header */}
                    <div className="flex items-center border-b p-4">
                      <Skeleton className="h-4 w-4 ml-4" />
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-auto" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                      <Skeleton className="h-4 w-20 ml-8" />
                      <Skeleton className="h-4 w-16 ml-8" />
                    </div>

                    {/* Table Rows */}
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex items-center border-b p-4">
                        {/* Checkbox */}
                        <Skeleton className="h-4 w-4 ml-4" />

                        {/* Customer Info */}
                        <div className="flex items-center space-x-3 ml-8">
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1 ml-auto">
                          <div className="flex items-center">
                            <Skeleton className="h-3 w-3 ml-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center">
                            <Skeleton className="h-3 w-3 ml-2" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="ml-8">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>

                        {/* Location */}
                        <div className="ml-8">
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>

                        {/* Last Contact */}
                        <div className="flex items-center ml-8">
                          <Skeleton className="h-3 w-3 ml-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-8">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CRM Link Card Skeleton */}
              <div className="text-center py-6">
                <Card className="max-w-md mx-auto">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="text-center">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <Skeleton className="h-10 w-48" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  const handleUpdatePropertyRequest = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleUpdatePropertyRequest");
      return;
    }

    try {
      await axiosInstance.put(
        `/v1/property-requests/${editingPropertyRequestId}`,
        formData,
      );

      // تحديث الـ property request داخل القائمة
      setPropertyRequestsData((prev) =>
        prev.map((req) =>
          req.id === editingPropertyRequestId ? { ...req, ...formData } : req,
        ),
      );

      setOpen(false);
    } catch (error) {
      console.error("Error updating property request:", error);
    }
  };

  const handleChange =
    (field: keyof PropertyRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSort = (field: keyof PropertyRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectPropertyRequest = (propertyRequestId: number) => {
    setSelectedPropertyRequests((prev) =>
      prev.includes(propertyRequestId)
        ? prev.filter((id) => id !== propertyRequestId)
        : [...prev, propertyRequestId],
    );
  };

  const handleSelectAll = () => {
    if (
      selectedPropertyRequests.length ===
      filteredAndSortedPropertyRequests.length
    ) {
      setSelectedPropertyRequests([]);
    } else {
      setSelectedPropertyRequests(
        filteredAndSortedPropertyRequests.map((c) => c.id),
      );
    }
  };

  // Calculate basic statistics
  const activePropertyRequests = propertyRequestsData.filter(
    (c) => c.is_active === 1,
  ).length;
  const readPropertyRequests = propertyRequestsData.filter(
    (c) => c.is_read === 1,
  ).length;

  // Property type statistics
  const residentialCount = propertyRequestsData.filter(
    (c) => c.property_type === "سكني",
  ).length;
  const commercialCount = propertyRequestsData.filter(
    (c) => c.property_type === "تجاري",
  ).length;
  const industrialCount = propertyRequestsData.filter(
    (c) => c.property_type === "صناعي",
  ).length;
  const landCount = propertyRequestsData.filter(
    (c) => c.property_type === "أرض",
  ).length;
  const otherCount = propertyRequestsData.filter(
    (c) => !["سكني", "تجاري", "صناعي", "أرض"].includes(c.property_type),
  ).length;

  const handleDelete = async (propertyRequestId: number) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleDelete");
      alert("Authentication required. Please login.");
      return;
    }

    try {
      await axiosInstance.delete(`/v1/property-requests/${propertyRequestId}`);
      // احذف طلب العقار من الواجهة
      setPropertyRequestsData((prev) =>
        prev.filter(
          (propertyRequest) => propertyRequest.id !== propertyRequestId,
        ),
      );
    } catch (error) {
      console.error("Failed to delete property request:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <PropertyRequestsPageHeader />

            {/* Statistics Cards */}
            <PropertyRequestStatisticsCards
              statistics={statistics}
              loading={loading}
            />

            {/* Customer Type Distribution */}
            {/* <CustomerTypeDistribution
              buyerCount={buyerCount}
              sellerCount={sellerCount}
              renterCount={renterCount}
              landlordCount={landlordCount}
              investorCount={investorCount}
            /> */}

            {/* Filters and Search */}
            {!loadingFilters && filtersData && (
              <PropertyRequestFiltersAndSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                cityId={cityId}
                setCityId={setCityId}
                districtId={districtId}
                setDistrictId={setDistrictId}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                propertyType={propertyType}
                setPropertyType={setPropertyType}
                purchaseGoal={purchaseGoal}
                setPurchaseGoal={setPurchaseGoal}
                seriousness={seriousness}
                setSeriousness={setSeriousness}
                filtersData={filtersData}
                filteredDistricts={filteredDistricts}
                onResetFilters={() => {
                  setCityId("");
                  setDistrictId("");
                  setCategoryId("");
                  setPropertyType("");
                  setPurchaseGoal("");
                  setSeriousness("");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              />
            )}

            {/* Main Content */}
            <PropertyRequestsTable
              filteredAndSortedPropertyRequests={
                filteredAndSortedPropertyRequests
              }
              selectedPropertyRequests={selectedPropertyRequests}
              handleSelectAll={handleSelectAll}
              handleSelectPropertyRequest={handleSelectPropertyRequest}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              openEditDialog={openEditDialog}
              handleDelete={handleDelete}
              formData={formData}
              open={open}
              setOpen={setOpen}
              handleChange={handleChange}
              handleUpdatePropertyRequest={handleUpdatePropertyRequest}
              showBulkActionsDialog={showBulkActionsDialog}
              setShowBulkActionsDialog={setShowBulkActionsDialog}
              setSelectedPropertyRequests={setSelectedPropertyRequests}
              currentPage={currentPage}
              totalPages={Math.ceil(totalPropertyRequests / perPage)}
              onPageChange={setCurrentPage}
              totalItems={totalPropertyRequests}
              perPage={perPage}
              onStatusUpdated={(propertyRequestId, newStatus) => {
                // تحديث الحالة في القائمة - newStatus هو name_ar من الحالة
                setPropertyRequestsData((prev) =>
                  prev.map((req) =>
                    req.id === propertyRequestId
                      ? {
                          ...req,
                          status: {
                            id: req.status?.id || 0,
                            name_ar: newStatus,
                            name_en: req.status?.name_en || newStatus,
                          },
                        }
                      : req,
                  ),
                );
                // إعادة تحميل البيانات للحصول على statistics محدثة
                fetchPropertyRequests();
              }}
              onEmployeeAssigned={(propertyRequestId, employeeId) => {
                // يمكن إضافة منطق تحديث الموظف هنا إذا كان API يعيد البيانات المحدثة
                // أو يمكن إعادة تحميل البيانات
                fetchPropertyRequests();
              }}
            />

          </div>
        </main>
      </div>
    </div>
  );
}
