"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Search,
  Move,
  Calendar,
  BarChart3,
  Bell,
  User,
  Loader2,
  Plus,
  Mail,
  ArrowUpDown,
  Phone,
  RefreshCw,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PipelineStage } from "@/types/crm";
import axiosInstance from "@/lib/axiosInstance";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";
import useCustomersFiltersStore from "@/context/store/customersFilters";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// Helper function to get priority label
const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 3:
      return "عالية";
    case 2:
      return "متوسطة";
    case 1:
      return "منخفضة";
    default:
      return "متوسطة";
  }
};

interface CrmFiltersProps {
  activeView: string;
  setActiveView: (view: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStage: string;
  setFilterStage: (stage: string) => void;
  filterUrgency: string;
  setFilterUrgency: (urgency: string) => void;
  pipelineStages: PipelineStage[];
  onSearchResults?: (results: any[]) => void;
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

const translateProcedure = (name: string): string => {
  const translations: { [key: string]: string } = {
    meeting: "اجتماع",
    visit: "زيارة",
  };
  return translations[name] || name;
};

export default function CrmFilters({
  activeView,
  setActiveView,
  searchTerm,
  setSearchTerm,
  filterStage,
  setFilterStage,
  filterUrgency,
  setFilterUrgency,
  pipelineStages,
  onSearchResults,
}: CrmFiltersProps) {
  const { userData } = useAuthStore();
  const { setShowAddDealDialog } = useCrmStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const { setCustomers, setPipelineStages } = useCrmStore();

  // Get additional filters from store
  const {
    filterType,
    filterCity,
    filterDistrict,
    filterPriority,
    filterProcedure,
    filterName,
    filterEmail,
    interestedCategoryIds,
    interestedPropertyIds,
    sortBy,
    sortDir,
    dateRange,
    filterData,
    loadingFilters,
    setFilterType,
    setFilterCity,
    setFilterDistrict,
    setFilterPriority,
    setFilterProcedure,
    setFilterName,
    setFilterEmail,
    setInterestedCategoryIds,
    setInterestedPropertyIds,
    setSortBy,
    setSortDir,
    setDateRange,
    setFilterData,
    setLoadingFilters,
    clearAllFilters,
    hasActiveFilters,
  } = useCustomersFiltersStore();

  // Fetch filter data on mount
  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [setFilterData, setLoadingFilters, userData?.token]);

  // Debounced search function
  const performSearch = useCallback(
    async (query: string, stageId: string, priority: string) => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        return;
      }

      setIsSearching(true);
      try {
        // Build query params for /v1/crm/requests
        const params = new URLSearchParams();

        if (query.trim()) {
          params.append("q", query.trim());
        }

        if (stageId !== "all") {
          params.append("stage_id", stageId);
        }

        if (priority !== "all") {
          // Convert priority text to number
          const priorityMap: { [key: string]: string } = {
            عالية: "3",
            متوسطة: "2",
            منخفضة: "1",
          };
          params.append("priority_id", priorityMap[priority] || priority);
        }

        // Add date range filter
        if (dateRange?.from) {
          params.append("created_from", format(dateRange.from, "yyyy-MM-dd"));
        }
        if (dateRange?.to) {
          params.append("created_to", format(dateRange.to, "yyyy-MM-dd"));
        }

        // City and District filters - Active
        if (filterCity !== "all") {
          params.append("city_id", filterCity);
        }
        if (filterDistrict !== "all") {
          params.append("district_id", filterDistrict);
        }

        // Commented out filters - can be enabled later
        // if (filterType !== "all") {
        //   params.append("type_id", filterType);
        // }
        // if (filterProcedure !== "all") {
        //   params.append("procedure_id", filterProcedure);
        // }
        // if (filterName.trim()) {
        //   params.append("name", filterName.trim());
        // }
        // if (filterEmail.trim()) {
        //   params.append("email", filterEmail.trim());
        // }
        // if (interestedCategoryIds.length > 0) {
        //   interestedCategoryIds.forEach((id: string | number) => {
        //     params.append("interested_category_ids", id.toString());
        //   });
        // }
        // if (interestedPropertyIds.length > 0) {
        //   interestedPropertyIds.forEach((id: string | number) => {
        //     params.append("interested_property_ids", id.toString());
        //   });
        // }
        // if (sortBy) {
        //   params.append("sort_by", sortBy);
        // }
        // if (sortDir) {
        //   params.append("sort_dir", sortDir);
        // }

        // Use /customers/search endpoint with all filters
        const url = params.toString()
          ? `/customers/search?${params.toString()}`
          : "/customers/search";

        const response = await axiosInstance.get(url);
        const crmData = response.data;

        if (crmData.status === "success") {
          const { customers, summary, pagination } = crmData.data || {};

          // Transform customers data to match CRM format
          const transformedCustomers = (customers || []).map((customer: any) => ({
            id: customer.id,
            request_id: customer.id,
            customer_id: customer.id,
            name: customer.name || "",
            phone_number: customer.phone_number || "",
            phone: customer.phone_number || "",
            email: customer.email || null,
            stage_id: customer.stage_id || null,
            priority_id: customer.priority_id || null,
            type_id: customer.type_id || null,
            procedure_id: customer.procedure_id || null,
            city_id: customer.city_id || null,
            district_id: customer.district_id || null,
            pipelineStage: String(customer.stage_id || ""),
            urgency: customer.priority_id
              ? getPriorityLabel(customer.priority_id)
              : "",
            created_at: customer.created_at || "",
            updated_at: customer.updated_at || "",
          }));

          // Group customers by stage for pipeline view
          const stagesMap = new Map();
          pipelineStages.forEach((stage) => {
            stagesMap.set(stage.id, {
              id: String(stage.id),
              name: stage.name,
              color: stage.color || "#6366f1",
              icon: stage.icon || "Target",
              count: 0,
              value: 0,
            });
          });

          transformedCustomers.forEach((customer: any) => {
            const stageId = customer.stage_id?.toString() || "all";
            if (stagesMap.has(stageId)) {
              const stage = stagesMap.get(stageId);
              stage.count += 1;
            }
          });

          const transformedStages = Array.from(stagesMap.values());

          // Update store
          setPipelineStages(transformedStages);
          setCustomers(transformedCustomers);
          if (onSearchResults) {
            onSearchResults(transformedCustomers);
          }
        }
      } catch (error) {
        console.error("خطأ في البحث:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [
      setCustomers,
      setPipelineStages,
      onSearchResults,
      userData?.token,
      dateRange,
      filterCity,
      filterDistrict,
      // Commented out dependencies - can be enabled later
      // filterType,
      // filterProcedure,
      // filterName,
      // filterEmail,
      // interestedCategoryIds,
      // interestedPropertyIds,
      // sortBy,
      // sortDir,
    ],
  );

  // Handle search input changes with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      performSearch(value, filterStage, filterUrgency);
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  // Handle filter changes
  const handleStageChange = (stageId: string) => {
    setFilterStage(stageId);
    performSearch(searchTerm, stageId, filterUrgency);
  };

  const handleUrgencyChange = (priority: string) => {
    setFilterUrgency(priority);
    performSearch(searchTerm, filterStage, priority);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    setTimeout(() => performSearch(searchTerm, filterStage, filterUrgency), 0);
  };

  // Handle filter changes for City and District - Active
  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case "city":
        setFilterCity(value);
        setFilterDistrict("all");
        break;
      case "district":
        setFilterDistrict(value);
        break;
      // Commented out cases - can be enabled later
      // case "type":
      //   setFilterType(value);
      //   break;
      // case "priority":
      //   setFilterPriority(value);
      //   break;
      // case "procedure":
      //   setFilterProcedure(value);
      //   break;
      // case "sortBy":
      //   setSortBy(value);
      //   break;
      // case "sortDir":
      //   setSortDir(value);
      //   break;
    }
    setTimeout(() => performSearch(searchTerm, filterStage, filterUrgency), 0);
  };

  // Commented out handlers - can be enabled later
  //     case "type":
  //       setFilterType(value);
  //       break;
  //     case "priority":
  //       setFilterPriority(value);
  //       break;
  //     case "procedure":
  //       setFilterProcedure(value);
  //       break;
  //     case "sortBy":
  //       setSortBy(value);
  //       break;
  //     case "sortDir":
  //       setSortDir(value);
  //       break;
  //   }
  //   setTimeout(() => performSearch(searchTerm, filterStage, filterUrgency), 0);
  // };

  // const handleNameChange = (value: string) => {
  //   setFilterName(value);
  //   if (searchTimeout) {
  //     clearTimeout(searchTimeout);
  //   }
  //   const timeout = setTimeout(() => {
  //     performSearch(searchTerm, filterStage, filterUrgency);
  //   }, 500);
  //   setSearchTimeout(timeout);
  // };

  // const handleEmailChange = (value: string) => {
  //   setFilterEmail(value);
  //   if (searchTimeout) {
  //     clearTimeout(searchTimeout);
  //   }
  //   const timeout = setTimeout(() => {
  //     performSearch(searchTerm, filterStage, filterUrgency);
  //   }, 500);
  //   setSearchTimeout(timeout);
  // };

  // const handleCategoryToggle = (categoryId: string | number) => {
  //   const idStr = categoryId.toString();
  //   const newIds = interestedCategoryIds.includes(idStr)
  //     ? interestedCategoryIds.filter((id) => id !== idStr)
  //     : [...interestedCategoryIds, idStr];
  //   setInterestedCategoryIds(newIds);
  //   setTimeout(() => performSearch(searchTerm, filterStage, filterUrgency), 0);
  // };

  // const handlePropertyToggle = (propertyId: string | number) => {
  //   const idStr = propertyId.toString();
  //   const newIds = interestedPropertyIds.includes(idStr)
  //     ? interestedPropertyIds.filter((id) => id !== idStr)
  //     : [...interestedPropertyIds, idStr];
  //   setInterestedPropertyIds(newIds);
  //   setTimeout(() => performSearch(searchTerm, filterStage, filterUrgency), 0);
  // };

  // const handleResetFilters = () => {
  //   clearAllFilters();
  //   setSearchTerm("");
  //   setFilterStage("all");
  //   setFilterUrgency("all");
  //   setTimeout(() => performSearch("", "all", "all"), 0);
  // };

  // Get filtered districts based on selected city - Active
  const getFilteredDistricts = () => {
    if (!filterData?.districts || filterCity === "all") {
      return filterData?.districts || [];
    }
    return filterData.districts.filter(
      (district: any) => district.city_id.toString() === filterCity,
    );
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Load all customers on component mount
  useEffect(() => {
    performSearch("", "all", "all");
  }, []);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* <Button
          variant={activeView === "pipeline" ? "default" : "outline"}
          onClick={() => setActiveView("pipeline")}
          className="flex items-center gap-2"
        >
          <Move className="h-4 w-4" />
          <span className="hidden sm:inline">مراحل العملاء</span>
          <span className="sm:hidden">المراحل</span>
        </Button> */}
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => setShowAddDealDialog(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">انشاء صفقة جديدة</span>
          <span className="sm:hidden">انشاء صفقة</span>
        </Button>
        {/* <Button
          variant={activeView === "appointments" ? "default" : "outline"}
          onClick={() => setActiveView("appointments")}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">المواعيد</span>
          <span className="sm:hidden">المواعيد</span>
        </Button>
        <Button
          variant={activeView === "reminders" ? "default" : "outline"}
          onClick={() => setActiveView("reminders")}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">التذكيرات</span>
          <span className="sm:hidden">التذكيرات</span>
        </Button>
        <Button
          variant={activeView === "inquiry" ? "default" : "outline"}
          onClick={() => setActiveView("inquiry")}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">طلبات العملاء</span>
          <span className="sm:hidden">طلبات العملاء</span>
        </Button> */}
        {/* <Button
          variant={activeView === "analytics" ? "default" : "outline"}
          onClick={() => setActiveView("analytics")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">التحليلات</span>
          <span className="sm:hidden">التحليلات</span>
        </Button> */}
      </div>

      {/* Responsive Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div className="relative">
          {isSearching ? (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            type="search"
            placeholder="العملاء..."
            className="pr-8 w-full sm:w-[250px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Stage Filter - Commented out */}
          {/* <Select value={filterStage} onValueChange={handleStageChange}>
            <SelectTrigger className="w-full sm:w-[120px] lg:w-[150px]">
              <SelectValue placeholder="المراحل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {pipelineStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* Urgency Filter - Active */}
          <Select value={filterUrgency} onValueChange={handleUrgencyChange}>
            <SelectTrigger className="w-full sm:w-[100px] lg:w-[120px]">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="عالية">عالية</SelectItem>
              <SelectItem value="متوسطة">متوسطة</SelectItem>
              <SelectItem value="منخفضة">منخفضة</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter - Active */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[140px] lg:w-[200px] justify-start text-right font-normal"
              >
                <Calendar className="ml-2 h-4 w-4" />
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
              <CalendarComponent
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

          {/* Type Filter - Commented out */}
          {/* <Select
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
          </Select> */}

          {/* City Filter - Active */}
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

          {/* District Filter - Active */}
          <Select
            value={filterDistrict}
            onValueChange={(value) => handleFilterChange("district", value)}
            disabled={filterCity === "all"}
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

          {/* Procedure Filter - Commented out */}
          {/* <Select
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
          </Select> */}

          {/* Name Filter - Commented out */}
          {/* <div className="relative w-full sm:w-[180px] lg:w-[160px]">
            <User className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="الاسم"
              className="pr-8"
              value={filterName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div> */}

          {/* Email Filter - Commented out */}
          {/* <div className="relative w-full sm:w-[180px] lg:w-[160px]">
            <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              className="pr-8"
              value={filterEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div> */}

          {/* Interested Categories Filter - Commented out */}
          {/* <Popover>
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
          </Popover> */}

          {/* Interested Properties Filter - Commented out */}
          {/* <Popover>
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
          </Popover> */}

          {/* Sort By Filter - Commented out */}
          {/* <Select
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
          </Select> */}

          {/* Sort Direction Filter - Commented out */}
          {/* <Select
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
          </Select> */}

          {/* Reset Button - Commented out */}
          {/* <Button
            variant="outline"
            size="icon"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters() && searchTerm === "" && filterStage === "all" && filterUrgency === "all"}
            className="flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
