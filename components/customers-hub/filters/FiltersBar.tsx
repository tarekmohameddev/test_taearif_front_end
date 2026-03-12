"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { 
  Search, X, Home, Users, Clock, MapPin, ChevronDown, Building2, UserCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { LIFECYCLE_STAGES, getStageNameAr } from "@/types/unified-customer";
import type { CustomerFilters } from "@/types/unified-customer";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import { useCustomersHubAssignment } from "@/hooks/useCustomersHubAssignment";

interface FiltersBarProps {
  filterOptions?: {
    stages?: Array<{ 
      id: string;                 // stage_id (string)
      label?: string;              // Arabic label
      labelEn?: string;           // English label
      name?: string;               // Alias for label (backward compatibility)
      color: string;
      order: number;
    }>;
    priorities?: Array<{ id: number; name: string }>;
    types?: Array<{ id: number; name: string }>;
    cities?: Array<{ id: number; name: string }>;
    districts?: Array<{ id: number; name: string; cityId: number }>;
  };
  onSearch?: (query: string) => void;
  /** عند تغيير أي فلتر يُستدعى مع التحديث ليرسل مباشرة في params الـ API */
  onApplyFilters?: (filtersOverride?: Partial<CustomerFilters>) => void;
}

/** خيارات المصدر (قيم تُرسل للـ API كما هي) */
const SOURCE_OPTIONS = [
  { value: "inquiry", label: "استفسار موقع" },
  { value: "manual", label: "يدوي" },
  { value: "whatsapp", label: "واتساب" },
  { value: "import", label: "استيراد" },
  { value: "referral", label: "إحالة" },
  { value: "employee_dashboard", label: "لوحة الموظف" },
] as const;

export function FiltersBar({ filterOptions, onSearch, onApplyFilters }: FiltersBarProps) {
  const filters = useUnifiedCustomersStore((state) => state.filters);
  const setFilters = useUnifiedCustomersStore((state) => state.setFilters);
  const clearFilters = useUnifiedCustomersStore((state) => state.clearFilters);
  const applyFilters = useUnifiedCustomersStore((state) => state.applyFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const { employees } = useCustomersHubAssignment();
  
  const { stages: dynamicStages } = useCustomersHubStagesStore();
  const cities = filterOptions?.cities ?? [];
  const districts = filterOptions?.districts ?? [];
  /** أولويات من الباكند (id + name) */
  const apiPriorities = filterOptions?.priorities ?? [];
  /** أنواع العقار من الباكند (id + name) */
  const apiTypes = filterOptions?.types ?? [];
  
  const displayStages = filterOptions?.stages && filterOptions.stages.length > 0
    ? filterOptions.stages.map(s => ({
        id: s.id,
        nameAr: s.label || s.name || "",
        nameEn: s.labelEn || s.name || "",
        color: s.color,
        order: s.order,
      }))
    : dynamicStages && dynamicStages.length > 0
    ? dynamicStages.map(s => ({
        id: s.stage_id,
        nameAr: s.stage_name_ar,
        nameEn: s.stage_name_en,
        color: s.color,
        order: s.order,
      }))
    : LIFECYCLE_STAGES;

  const handleSearch = () => {
    const search = searchQuery || undefined;
    setFilters({ search });
    if (onSearch) onSearch(searchQuery);
    else onApplyFilters?.({ search });
    if (!onApplyFilters && !onSearch) applyFilters();
  };

  const handleStageToggle = (stageId: string) => {
    const current = filters.stage || [];
    const newStages = current.includes(stageId as any) ? current.filter((s) => s !== stageId) : [...current, stageId as any];
    const update = { stage: newStages.length > 0 ? newStages : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const handlePriorityToggle = (priorityId: number) => {
    const current = filters.priorityIds || [];
    const next = current.includes(priorityId) ? current.filter((id) => id !== priorityId) : [...current, priorityId];
    const update = { priorityIds: next.length > 0 ? next : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const handleSourceToggle = (sourceValue: string) => {
    const current = filters.source || [];
    const next = current.includes(sourceValue as any) ? current.filter((s) => s !== sourceValue) : [...current, sourceValue as any];
    const update = { source: next.length > 0 ? next : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const handlePropertyTypeToggle = (typeId: number) => {
    const current = filters.typeIds || [];
    const next = current.includes(typeId) ? current.filter((id) => id !== typeId) : [...current, typeId];
    const update = { typeIds: next.length > 0 ? next : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const handleCityToggle = (cityId: number) => {
    const current = filters.city || [];
    const next = current.includes(cityId) ? current.filter((id) => id !== cityId) : [...current, cityId];
    const update = { city: next.length > 0 ? next : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const handleDistrictToggle = (districtId: number) => {
    const current = filters.district || [];
    const next = current.includes(districtId) ? current.filter((id) => id !== districtId) : [...current, districtId];
    const update = { district: next.length > 0 ? next : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const handleEmployeeToggle = (employeeId: string) => {
    const current = filters.assignedEmployee || [];
    const next = current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId];
    const update = { assignedEmployee: next.length > 0 ? next : undefined };
    setFilters(update);
    onApplyFilters?.(update);
    if (!onApplyFilters) applyFilters();
  };

  const clearAllAndRefetch = () => {
    clearFilters();
    setSearchQuery("");
    onApplyFilters?.({
      search: undefined,
      stage: undefined,
      priorityIds: undefined,
      typeIds: undefined,
      source: undefined,
      assignedEmployee: undefined,
      city: undefined,
      district: undefined,
    });
    if (!onApplyFilters) applyFilters();
  };

  const hasActiveFilters =
    (filters.stage && filters.stage.length > 0) ||
    (filters.priorityIds && filters.priorityIds.length > 0) ||
    (filters.typeIds && filters.typeIds.length > 0) ||
    (filters.source && filters.source.length > 0) ||
    (filters.city && filters.city.length > 0) ||
    (filters.district && filters.district.length > 0) ||
    (filters.assignedEmployee && filters.assignedEmployee.length > 0) ||
    !!filters.search;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث بالاسم، رقم الجوال، البريد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  className="pr-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="sm"
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                بحث
              </Button>
            </div>

            {/* Filters Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* مرحلة (Stages) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    مرحلة
                    {filters.stage && filters.stage.length > 0 && (
                      <Badge variant="secondary" className="mr-1">
                        {filters.stage.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
                  <DropdownMenuLabel>المرحلة</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {displayStages.map((stage) => (
                    <DropdownMenuCheckboxItem
                      key={stage.id}
                      checked={filters.stage?.includes(stage.id as any)}
                      onCheckedChange={() => handleStageToggle(stage.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        {stage.nameAr || getStageNameAr(stage.id, dynamicStages)}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* مدينة (City) */}
              {cities.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      مدينة
                      {filters.city && filters.city.length > 0 && (
                        <Badge variant="secondary" className="mr-1">
                          {filters.city.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>المدينة</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {cities.map((city) => (
                      <DropdownMenuCheckboxItem
                        key={city.id}
                        checked={filters.city?.includes(city.id)}
                        onCheckedChange={() => handleCityToggle(city.id)}
                      >
                        {city.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* حي (District) */}
              {districts.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MapPin className="h-4 w-4" />
                      حي
                      {filters.district && filters.district.length > 0 && (
                        <Badge variant="secondary" className="mr-1">
                          {filters.district.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>الحي</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {districts.map((d) => (
                      <DropdownMenuCheckboxItem
                        key={d.id}
                        checked={filters.district?.includes(d.id)}
                        onCheckedChange={() => handleDistrictToggle(d.id)}
                      >
                        {d.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* موظف (Employee) */}
              {employees.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserCircle className="h-4 w-4" />
                      موظف
                      {filters.assignedEmployee && filters.assignedEmployee.length > 0 && (
                        <Badge variant="secondary" className="mr-1">
                          {filters.assignedEmployee.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                    <DropdownMenuLabel>الموظف المسؤول</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {employees.filter((e) => e.isActive).map((emp) => (
                      <DropdownMenuCheckboxItem
                        key={emp.id}
                        checked={filters.assignedEmployee?.includes(emp.id)}
                        onCheckedChange={() => handleEmployeeToggle(emp.id)}
                      >
                        {emp.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* جميع الأولويات — من الباكند */}
              {apiPriorities.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Clock className="h-4 w-4" />
                      جميع الأولويات
                      {filters.priorityIds && filters.priorityIds.length > 0 && (
                        <Badge variant="secondary" className="mr-1">
                          {filters.priorityIds.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {apiPriorities.map((p) => (
                      <DropdownMenuCheckboxItem
                        key={p.id}
                        checked={filters.priorityIds?.includes(p.id)}
                        onCheckedChange={() => handlePriorityToggle(p.id)}
                      >
                        {p.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* المصدر — القيم تُرسل مباشرة في params */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    المصدر
                    {filters.source && filters.source.length > 0 && (
                      <Badge variant="secondary" className="mr-1">
                        {filters.source.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>المصدر</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {SOURCE_OPTIONS.map((source) => (
                    <DropdownMenuCheckboxItem
                      key={source.value}
                      checked={filters.source?.includes(source.value)}
                      onCheckedChange={() => handleSourceToggle(source.value)}
                    >
                      {source.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* نوع العقار — من الباكند */}
              {apiTypes.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Home className="h-4 w-4" />
                      نوع العقار
                      {filters.typeIds && filters.typeIds.length > 0 && (
                        <Badge variant="secondary" className="mr-1">
                          {filters.typeIds.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>نوع العقار</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {apiTypes.map((t) => (
                      <DropdownMenuCheckboxItem
                        key={t.id}
                        checked={filters.typeIds?.includes(t.id)}
                        onCheckedChange={() => handlePropertyTypeToggle(t.id)}
                      >
                        {t.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllAndRefetch} className="gap-1">
                  <X className="h-4 w-4" />
                  مسح الفلاتر
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
