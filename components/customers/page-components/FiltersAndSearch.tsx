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
import { Search, RefreshCw, Loader2, CalendarIcon, User, Phone } from "lucide-react";
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
            />
          </PopoverContent>
        </Popover>

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
