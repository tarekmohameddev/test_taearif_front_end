"use client";

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CustomerPageHeader } from "./page-components/CustomerPageHeader";
import { StatisticsCards } from "./page-components/StatisticsCards";
import { CustomerTypeDistribution } from "./page-components/CustomerTypeDistribution";
import { FiltersAndSearch } from "./page-components/FiltersAndSearch";
import { CustomerTable } from "./page-components/CustomerTable";
import { CrmLinkCard } from "./page-components/CrmLinkCard";
import useCustomersFiltersStore from "@/context/store/customersFilters";
import useAuthStore from "@/context/AuthContext";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  type: {
    id: number;
    name: string;
  };
  stage: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  procedure: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name_ar: string;
    name_en: string;
    city_id: number;
    city_name_ar: string;
    city_name_en: string;
    country_name_ar: string;
    country_name_en: string;
    created_at: string;
    updated_at: string;
  };
  note: string | null;
  city_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  interested_categories: any[];
  interested_properties: any[];
  responsible_employee: {
    id: number;
    name: string;
    email: string;
    whatsapp_number: string;
  } | null;
}
// Customer data (same as CRM page for consistency)
const customers: Customer[] = [
  {
    id: 1,
    name: "أحمد محمد العلي",
    email: "ahmed.alali@email.com",
    phone_number: "+966 50 123 4567",
    type: {
      id: 1,
      name: "مشتري",
    },
    stage: {
      id: 1,
      name: "مرحلة أولية",
    },
    priority: {
      id: 2,
      name: "متوسطة",
    },
    procedure: {
      id: 1,
      name: "لقاء",
    },
    district: {
      id: 10100003001,
      name_ar: "حي العليا",
      name_en: "Al Olaya",
      city_id: 1,
      city_name_ar: "الرياض",
      city_name_en: "Riyadh",
      country_name_ar: "السعودية",
      country_name_en: "Saudi Arabia",
      created_at: "2023-08-15T00:00:00.000000Z",
      updated_at: "2023-08-15T00:00:00.000000Z",
    },
    note: "عميل مهم، يبحث عن فيلا في حي راقي",
    city_id: 1,
    created_by: 1,
    created_at: "2023-08-15T00:00:00.000000Z",
    updated_at: "2023-08-15T00:00:00.000000Z",
    interested_categories: [],
    interested_properties: [],
  },
];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("customers");
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false);
  const [showStageDialog, setShowStageDialog] = useState(false);
  const [selectedCustomerForStage, setSelectedCustomerForStage] =
    useState<Customer | null>(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customersData, setCustomersData] = useState<Customer[]>([]); // ← هنا يتم حفظ كل العملاء
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    city_id: null,
    district_id: null,
    note: "",
    type_id: 1, // Default value
    priority_id: 1,
    stage_id: null, // Default empty value for optional stage
    procedure_id: null, // Default value for procedure_id
  });

  // Get filter states from store
  const { searchTerm, filterType, filterCity } = useCustomersFiltersStore();
  const { userData } = useAuthStore();

  // Function to fetch customers with current filters and pagination
  const fetchCustomersWithFilters = useCallback(
    async (page = 1) => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/customers?page=${page}`);
        const { customers, summary, pagination } = response.data.data;
        setCustomersData(customers);
        setTotalCustomers(summary.total_customers);
        setPagination(pagination);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, userData?.token],
  );

  useEffect(() => {
    fetchCustomersWithFilters(1);
  }, [fetchCustomersWithFilters]);

  // Function to handle filter changes from FiltersAndSearch component
  const handleFilterChange = useCallback(
    (newCustomersData: Customer[], newPagination?: any) => {
      setCustomersData(newCustomersData);
      if (newPagination) {
        setPagination(newPagination);
      }
      // Reset selected customers when filters change
      setSelectedCustomers([]);
    },
    [setSelectedCustomers],
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      // Get current filters from store
      const {
        searchTerm,
        filterType,
        filterCity,
        filterDistrict,
        filterPriority,
        filterProcedure,
        filterStage,
        filterName,
        filterEmail,
        interestedCategoryIds,
        interestedPropertyIds,
        sortBy,
        sortDir,
      } = useCustomersFiltersStore.getState();

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());

      if (searchTerm.trim()) {
        params.append("q", searchTerm.trim());
      }
      if (filterCity !== "all") {
        params.append("city_id", filterCity);
      }
      if (filterDistrict !== "all") {
        params.append("district_id", filterDistrict);
      }
      if (filterType !== "all") {
        params.append("type_id", filterType);
      }
      if (filterPriority !== "all") {
        params.append("priority_id", filterPriority);
      }
      if (filterProcedure !== "all") {
        params.append("procedure_id", filterProcedure);
      }
      if (filterStage !== "all") {
        params.append("stage_id", filterStage);
      }
      if (filterName.trim()) {
        params.append("name", filterName.trim());
      }
      if (filterEmail.trim()) {
        params.append("email", filterEmail.trim());
      }
      if (interestedCategoryIds.length > 0) {
        interestedCategoryIds.forEach((id: string | number) => {
          params.append("interested_category_ids", id.toString());
        });
      }
      if (interestedPropertyIds.length > 0) {
        interestedPropertyIds.forEach((id: string | number) => {
          params.append("interested_property_ids", id.toString());
        });
      }
      if (sortBy) {
        params.append("sort_by", sortBy);
      }
      if (sortDir) {
        params.append("sort_dir", sortDir);
      }

      // Use search endpoint if there are filters, otherwise use regular endpoint
      const hasFilters =
        params.toString().includes("q=") ||
        params.toString().includes("city_id=") ||
        params.toString().includes("district_id=") ||
        params.toString().includes("type_id=") ||
        params.toString().includes("priority_id=") ||
        params.toString().includes("procedure_id=") ||
        params.toString().includes("stage_id=") ||
        params.toString().includes("name=") ||
        params.toString().includes("email=") ||
        params.toString().includes("interested_category_ids=") ||
        params.toString().includes("interested_property_ids=") ||
        params.toString().includes("sort_by=");

      const endpoint = hasFilters ? "/customers/search" : "/customers";

      // Fetch data with current filters and new page
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(endpoint, { params });
          const { customers, summary, pagination } = response.data.data;
          setCustomersData(customers);
          setTotalCustomers(summary.total_customers);
          setPagination(pagination);
          // Reset selected customers when page changes
          setSelectedCustomers([]);
        } catch (err) {
          console.error("Error fetching customers:", err);
          setError("حدث خطأ أثناء تحميل البيانات.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    },
    [
      setLoading,
      setError,
      setSelectedCustomers,
      setCustomersData,
      setTotalCustomers,
      setPagination,
    ],
  );

  // Function to handle new customer added
  const handleCustomerAdded = useCallback(
    (newCustomer: Customer) => {
      // Refresh the current page to update pagination
      handlePageChange(pagination?.current_page || 1);
    },
    [handlePageChange, pagination?.current_page],
  );

  // Search is now handled by FiltersAndSearch component

  const handleNewCustomerChange =
    (field: keyof typeof newCustomer) => (value: any) => {
      setNewCustomer((prev) => ({ ...prev, [field]: value }));
    };
  const handleNewCustomerInputChange =
    (field: keyof typeof newCustomer) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewCustomer((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddCustomer = async () => {
    // This function is now handled by CustomerPageHeader component
    // The validation and API call logic has been moved there
  };

  const openEditDialog = (customer: Customer) => {
    // تم نقل منطق التعديل إلى صفحة منفصلة
    // يتم التعامل معه الآن في CustomerTable باستخدام router.push
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Note: Loading skeleton is now handled inside CustomerTable component
  // Only show full page skeleton on initial load (when there's no data)
  const isInitialLoad = loading && customersData.length === 0;

  if (isInitialLoad) {
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

  const handleStageUpdated = (customerId: number, newStageId: number) => {
    // Refresh the current page to update data
    handlePageChange(pagination?.current_page || 1);
  };

  // Sort customers (filtering is now handled by API)
  const filteredAndSortedCustomers = customersData.sort((a, b) => {
    let aValue = a[sortField as keyof Customer];
    let bValue = b[sortField as keyof Customer];

    // Handle cases where values might not be strings
    const aStr = String(aValue ?? "").toLowerCase();
    const bStr = String(bValue ?? "").toLowerCase();

    if (sortDirection === "asc") {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredAndSortedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredAndSortedCustomers.map((c) => c.id));
    }
  };

  // Calculate basic statistics
  const activeCustomers = customersData.length; // All customers are considered active
  const totalRevenue = 0; // No revenue data in new API
  const avgCustomerValue = 0; // No value data in new API

  // Customer type statistics
  const buyerCount = customersData.filter(
    (c) => c.type?.name === "مشتري" || c.type?.name === "Buyer",
  ).length;
  const sellerCount = customersData.filter(
    (c) => c.type?.name === "بائع" || c.type?.name === "Seller",
  ).length;
  const renterCount = customersData.filter(
    (c) => c.type?.name === "مستأجر" || c.type?.name === "Rented",
  ).length;
  const landlordCount = customersData.filter(
    (c) => c.type?.name === "مؤجر" || c.type?.name === "Landlord",
  ).length;
  const investorCount = customersData.filter(
    (c) => c.type?.name === "مستثمر" || c.type?.name === "Investor",
  ).length;

  const handleDelete = async (customerId: number) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    try {
      await axiosInstance.delete(`/customers/${customerId}`);
      // Refresh the current page to update pagination
      handlePageChange(pagination?.current_page || 1);
    } catch (error) {
      console.error("Failed to delete customer:", error);
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
            <CustomerPageHeader
              showAddCustomerDialog={showAddCustomerDialog}
              setShowAddCustomerDialog={setShowAddCustomerDialog}
              newCustomer={newCustomer}
              handleNewCustomerChange={handleNewCustomerChange}
              handleNewCustomerInputChange={handleNewCustomerInputChange}
              validationErrors={validationErrors}
              clientErrors={clientErrors}
              isSubmitting={isSubmitting}
              setValidationErrors={setValidationErrors}
              setClientErrors={setClientErrors}
              setIsSubmitting={setIsSubmitting}
              setNewCustomer={setNewCustomer}
              onCustomerAdded={handleCustomerAdded}
            />

            {/* Statistics Cards */}
            <StatisticsCards totalCustomers={totalCustomers} />

            {/* Customer Type Distribution */}
            {/* <CustomerTypeDistribution
              buyerCount={buyerCount}
              sellerCount={sellerCount}
              renterCount={renterCount}
              landlordCount={landlordCount}
              investorCount={investorCount}
            /> */}

            {/* Filters and Search */}
            <FiltersAndSearch
              setCustomersData={handleFilterChange}
              setTotalCustomers={(total: number) => setTotalCustomers(total)}
              setLoading={setLoading}
              setError={setError}
              setPagination={setPagination}
            />

            {/* Main Content */}
            <CustomerTable
              filteredAndSortedCustomers={filteredAndSortedCustomers}
              selectedCustomers={selectedCustomers}
              handleSelectAll={handleSelectAll}
              handleSelectCustomer={handleSelectCustomer}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              openEditDialog={openEditDialog}
              handleDelete={handleDelete}
              showBulkActionsDialog={showBulkActionsDialog}
              setShowBulkActionsDialog={setShowBulkActionsDialog}
              setSelectedCustomers={setSelectedCustomers}
              showStageDialog={showStageDialog}
              setShowStageDialog={setShowStageDialog}
              selectedCustomerForStage={selectedCustomerForStage}
              setSelectedCustomerForStage={setSelectedCustomerForStage}
              onStageUpdated={handleStageUpdated}
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />

            {/* CRM Link */}
            <CrmLinkCard />
          </div>
        </main>
      </div>
    </div>
  );
}
