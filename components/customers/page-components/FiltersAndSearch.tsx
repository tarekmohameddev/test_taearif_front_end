import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw, Loader2, CalendarIcon, User, Phone, Mail, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useCustomersFiltersStore from "@/context/store/customersFilters";
import useAuthStore from "@/context/AuthContext";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// Interface for filter data from API
interface FilterData {
  cities: Array<{ id: number; name_ar: string; name_en: string }>;
  districts: Array<{
    id: number;
    city_id: number;
    name_ar: string;
    name_en: string;
  }>;
  types: Array<{
    id: number;
    name: string;
    value: string;
    icon: string;
    color: string;
  }>;
  priorities: Array<{
    id: number;
    name: string;
    value: number;
    icon: string;
    color: string;
  }>;
  stages: Array<{
    id: number;
    name: string;
    icon: string | null;
    color: string | null;
  }>;
  procedures: Array<{ id: number; name: string; icon: string; color: string }>;
  employees: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  categories?: Array<{ id: number; name: string; name_ar?: string; name_en?: string }>;
  properties?: Array<{ id: number; name: string; name_ar?: string; name_en?: string }>;
}

// Translation functions for filter data
const translateType = (name: string): string => {
  const translations: { [key: string]: string } = {
    Rent: "إيجار",
    Sale: "بيع",
    Rented: "مؤجر",
    Sold: "مباع",
    Both: "كلاهما",
  };
  return translations[name] || name;
};

const translatePriority = (name: string): string => {
  const translations: { [key: string]: string } = {
    Low: "منخفضة",
    Medium: "متوسطة",
    High: "عالية",
  };
  return translations[name] || name;
};

const translateProcedure = (name: string): string => {
  const translations: { [key: string]: string } = {
    meeting: "اجتماع",
    visit: "زيارة",
  };
  return translations[name] || name;
};

export const FiltersAndSearch = ({
  setCustomersData,
  setTotalCustomers,
  setLoading,
  setError,
  setPagination,
}: any) => {
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const { userData } = useAuthStore();

  // Get filter states and actions from the Zustand store
  const {
    searchTerm,
    filterType,
    filterCity,
    filterDistrict,
    filterPriority,
    filterEmployee,
    filterEmployeePhone,
    dateRange,
    filterProcedure,
    filterStage,
    filterName,
    filterEmail,
    interestedCategoryIds,
    interestedPropertyIds,
    sortBy,
    sortDir,
    filterData,
    loadingFilters,
    setSearchTerm,
    setFilterType,
    setFilterCity,
    setFilterDistrict,
    setFilterPriority,
    setFilterEmployee,
    setFilterEmployeePhone,
    setDateRange,
    setFilterProcedure,
    setFilterStage,
    setFilterName,
    setFilterEmail,
    setInterestedCategoryIds,
    setInterestedPropertyIds,
    setSortBy,
    setSortDir,
    setFilterData,
    setLoadingFilters,
    clearAllFilters,
    hasActiveFilters,
  } = useCustomersFiltersStore();

  // Effect to fetch initial filter data from the API
  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      return;
    }

    const fetchFilters = async () => {
      try {
        setLoadingFilters(true);
        const response = await axiosInstance.get("/customers/filters");

        if (response.data.status === "success") {
          setFilterData(response.data.data);
        } else {
          console.error("Failed to fetch filters:", response.data.message);
          // Optionally set an error state for the UI
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
        // Handle error, maybe show a toast notification
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [setFilterData, setLoadingFilters, userData?.token]);

  // The core search function, rewritten for correctness and clarity
  const performSearch = useCallback(async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      return;
    }

    setIsSearching(true);
    setLoading(true);
    setError(null); // Reset error on new search

    try {
      // Get the latest state directly from the store to avoid stale state issues in callbacks
      const currentState = useCustomersFiltersStore.getState();
      const params = new URLSearchParams();

      // Build parameters object only with active filters
      if (currentState.searchTerm.trim()) {
        params.append("q", currentState.searchTerm.trim());
      }
      if (currentState.filterCity !== "all") {
        params.append("city_id", currentState.filterCity);
      }
      if (currentState.filterDistrict !== "all") {
        params.append("district_id", currentState.filterDistrict);
      }
      if (currentState.filterType !== "all") {
        params.append("type_id", currentState.filterType);
      }
      // **FIX**: Send the `id` for priority with the correct parameter name `priority_id`.
      if (currentState.filterPriority !== "all") {
        params.append("priority_id", currentState.filterPriority);
      }
      if (currentState.filterEmployee !== "all") {
        params.append("responsible_employee_id", currentState.filterEmployee);
      }
      if (currentState.filterEmployeePhone.trim()) {
        params.append("phone_number", currentState.filterEmployeePhone.trim());
      }
      if (currentState.dateRange.from) {
        params.append("created_from", format(currentState.dateRange.from, "yyyy-MM-dd"));
      }
      if (currentState.dateRange.to) {
        params.append("created_to", format(currentState.dateRange.to, "yyyy-MM-dd"));
      }
      if (currentState.filterProcedure !== "all") {
        params.append("procedure_id", currentState.filterProcedure);
      }
      if (currentState.filterStage !== "all") {
        params.append("stage_id", currentState.filterStage);
      }
      if (currentState.filterName.trim()) {
        params.append("name", currentState.filterName.trim());
      }
      if (currentState.filterEmail.trim()) {
        params.append("email", currentState.filterEmail.trim());
      }
      if (currentState.interestedCategoryIds.length > 0) {
        currentState.interestedCategoryIds.forEach((id: string | number) => {
          params.append("interested_category_ids", id.toString());
        });
      }
      if (currentState.interestedPropertyIds.length > 0) {
        currentState.interestedPropertyIds.forEach((id: string | number) => {
          params.append("interested_property_ids", id.toString());
        });
      }
      if (currentState.sortBy) {
        params.append("sort_by", currentState.sortBy);
      }
      if (currentState.sortDir) {
        params.append("sort_dir", currentState.sortDir);
      }

      let response;
      // If there are any active filters or a search term, use the search endpoint.
      if (params.toString()) {
        response = await axiosInstance.get("/customers/search", { params });
      } else {
        // Otherwise, fetch all customers.
        response = await axiosInstance.get("/customers");
      }

      if (response.data.status === "success") {
        const { customers, summary, pagination } = response.data.data;
        setCustomersData(customers || []);
        setTotalCustomers(summary.total_customers || 0);
        setPagination(pagination);
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (err: any) {
      console.error("Error in search/fetch operation:", err);
      setError(err.message || "An error occurred while fetching data.");
      setCustomersData([]);
      setTotalCustomers(0);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  }, [
    setCustomersData,
    setTotalCustomers,
    setLoading,
    setError,
    userData?.token,
  ]);

  // Debounced search on input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 500); // 500ms delay
  };

  // Handle changes in any of the select filters
  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case "city":
        setFilterCity(value);
        // Reset district when city changes to avoid inconsistent state
        setFilterDistrict("all");
        break;
      case "district":
        setFilterDistrict(value);
        break;
      case "type":
        setFilterType(value);
        break;
      case "priority":
        setFilterPriority(value);
        break;
      case "employee":
        setFilterEmployee(value);
        break;
      case "procedure":
        setFilterProcedure(value);
        break;
      case "stage":
        setFilterStage(value);
        break;
      case "sortBy":
        setSortBy(value);
        break;
      case "sortDir":
        setSortDir(value);
        break;
    }

    // Use setTimeout to ensure the state update is processed before triggering the search
    setTimeout(performSearch, 0);
  };

  // Handle employee phone change
  const handleEmployeePhoneChange = (value: string) => {
    setFilterEmployeePhone(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 500);
  };

  // Handle name filter change
  const handleNameChange = (value: string) => {
    setFilterName(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 500);
  };

  // Handle email filter change
  const handleEmailChange = (value: string) => {
    setFilterEmail(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 500);
  };

  // Handle category selection (multi-select)
  const handleCategoryToggle = (categoryId: string | number) => {
    const idStr = categoryId.toString();
    const currentIds = interestedCategoryIds;
    const newIds = currentIds.includes(idStr)
      ? currentIds.filter((id) => id !== idStr)
      : [...currentIds, idStr];
    setInterestedCategoryIds(newIds);
    setTimeout(performSearch, 0);
  };

  // Handle property selection (multi-select)
  const handlePropertyToggle = (propertyId: string | number) => {
    const idStr = propertyId.toString();
    const currentIds = interestedPropertyIds;
    const newIds = currentIds.includes(idStr)
      ? currentIds.filter((id) => id !== idStr)
      : [...currentIds, idStr];
    setInterestedPropertyIds(newIds);
    setTimeout(performSearch, 0);
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    setTimeout(performSearch, 0);
  };

  // Reset all filters and fetch all customers
  const handleResetFilters = () => {
    clearAllFilters();
    setTimeout(performSearch, 0);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    const timeout = searchTimeout.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  // Memoized calculation for filtered districts based on the selected city
  const getFilteredDistricts = useCallback(() => {
    if (!filterData?.districts || filterCity === "all") {
      return filterData?.districts || [];
    }
    return filterData.districts.filter(
      (district: any) => district.city_id.toString() === filterCity,
    );
  }, [filterData?.districts, filterCity]);

  // Loading state for filters
  if (loadingFilters) {
    return (
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4">
        <div className="h-10 w-full lg:w-[300px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        <div className="flex flex-wrap items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full sm:w-[140px] lg:w-[120px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Search Box */}
      <div className="relative w-full lg:w-auto">
        {isSearching ? (
          <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          type="search"
          placeholder="البحث في العملاء..."
          className="pr-8 w-full lg:w-[300px]"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type Filter */}
        <Select
          value={filterType}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {filterData?.types
              ?.filter((type: any) => type.name !== "Both" && translateType(type.name) !== "كلاهما")
              ?.map((type: any) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {translateType(type.name)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* City Filter */}
        <Select
          value={filterCity}
          onValueChange={(value) => handleFilterChange("city", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
            {filterData?.cities?.map((city: any) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District Filter */}
        <Select
          value={filterDistrict}
          onValueChange={(value) => handleFilterChange("district", value)}
          disabled={filterCity === "all"} // Disable if no city is selected
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="الحي" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأحياء</SelectItem>
            {getFilteredDistricts()?.map((district: any) => (
              <SelectItem key={district.id} value={district.id.toString()}>
                {district.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filterPriority}
          onValueChange={(value) => handleFilterChange("priority", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأولويات</SelectItem>
            {filterData?.priorities?.map((priority: any) => (
              // **FIX**: The value is now `priority.id` as requested by the user.
              <SelectItem key={priority.id} value={priority.id.toString()}>
                {translatePriority(priority.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Employee Filter */}
        <Select
          value={filterEmployee}
          onValueChange={(value) => handleFilterChange("employee", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="الموظف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الموظفين</SelectItem>
            {filterData?.employees?.map((employee: any) => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Employee Phone Filter */}
        <div className="relative w-full sm:w-[180px] lg:w-[160px]">
          <Phone className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="رقم هاتف الموظف"
            className="pr-8"
            value={filterEmployeePhone}
            onChange={(e) => handleEmployeePhoneChange(e.target.value)}
          />
        </div>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[140px] lg:w-[200px] justify-start text-right font-normal"
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "yyyy-MM-dd", { locale: ar })} -{" "}
                    {format(dateRange.to, "yyyy-MM-dd", { locale: ar })}
                  </>
                ) : (
                  format(dateRange.from, "yyyy-MM-dd", { locale: ar })
                )
              ) : (
                <span>نطاق التاريخ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              locale={ar}
              toDate={new Date()}
            />
          </PopoverContent>
        </Popover>

        {/* Procedure Filter */}
        <Select
          value={filterProcedure}
          onValueChange={(value) => handleFilterChange("procedure", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="الإجراء" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الإجراءات</SelectItem>
            {filterData?.procedures?.map((procedure: any) => (
              <SelectItem key={procedure.id} value={procedure.id.toString()}>
                {translateProcedure(procedure.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stage Filter */}
        <Select
          value={filterStage}
          onValueChange={(value) => handleFilterChange("stage", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="المرحلة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المراحل</SelectItem>
            {filterData?.stages?.map((stage: any) => (
              <SelectItem key={stage.id} value={stage.id.toString()}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Name Filter */}
        <div className="relative w-full sm:w-[180px] lg:w-[160px]">
          <User className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="الاسم"
            className="pr-8"
            value={filterName}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        {/* Email Filter */}
        <div className="relative w-full sm:w-[180px] lg:w-[160px]">
          <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            className="pr-8"
            value={filterEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
        </div>

        {/* Interested Categories Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[180px] lg:w-[160px] justify-start text-right font-normal"
            >
              <span className="truncate">
                {interestedCategoryIds.length > 0
                  ? `الفئات (${interestedCategoryIds.length})`
                  : "الفئات المهتمة"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-4" align="end">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">اختر الفئات</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filterData?.categories && filterData.categories.length > 0 ? (
                  filterData.categories.map((category: any) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={interestedCategoryIds.includes(category.id.toString())}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {category.name_ar || category.name_en || category.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد فئات متاحة</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Interested Properties Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[180px] lg:w-[160px] justify-start text-right font-normal"
            >
              <span className="truncate">
                {interestedPropertyIds.length > 0
                  ? `العقارات (${interestedPropertyIds.length})`
                  : "العقارات المهتمة"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-4" align="end">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">اختر العقارات</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filterData?.properties && filterData.properties.length > 0 ? (
                  filterData.properties.map((property: any) => (
                    <div
                      key={property.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <Checkbox
                        id={`property-${property.id}`}
                        checked={interestedPropertyIds.includes(property.id.toString())}
                        onCheckedChange={() => handlePropertyToggle(property.id)}
                      />
                      <Label
                        htmlFor={`property-${property.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {property.name_ar || property.name_en || property.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد عقارات متاحة</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort By Filter */}
        <Select
          value={sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] lg:w-[120px]">
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">تاريخ الإنشاء</SelectItem>
            <SelectItem value="name">الاسم</SelectItem>
            <SelectItem value="email">البريد الإلكتروني</SelectItem>
            <SelectItem value="updated_at">تاريخ التحديث</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Direction Filter */}
        <Select
          value={sortDir}
          onValueChange={(value) => handleFilterChange("sortDir", value)}
        >
          <SelectTrigger className="w-full sm:w-[100px] lg:w-[100px]">
            <SelectValue placeholder="الاتجاه" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3 rotate-180" />
                <span>تصاعدي</span>
              </div>
            </SelectItem>
            <SelectItem value="desc">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3" />
                <span>تنازلي</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetFilters}
          disabled={!hasActiveFilters()} // Disable if no filters are active
          className="flex-shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
