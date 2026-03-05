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
  onApplyFilters?: () => void;
}

const priorityLabels: Record<string, string> = {
  urgent: "عاجل",
  high: "عالي",
  medium: "متوسط",
  low: "منخفض",
};

export function FiltersBar({ filterOptions, onSearch, onApplyFilters }: FiltersBarProps) {
  const { filters, setFilters, clearFilters, applyFilters } = useUnifiedCustomersStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { employees } = useCustomersHubAssignment();
  
  // Use stages from Zustand store (fetched once, shared across all components)
  const { stages: dynamicStages } = useCustomersHubStagesStore();
  
  const cities = filterOptions?.cities ?? [];
  const districts = filterOptions?.districts ?? [];
  
  // Use filterOptions.stages if provided, otherwise use dynamic stages, otherwise fallback to LIFECYCLE_STAGES
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

  const propertyTypes = [
    { value: "villa", label: "فيلا" },
    { value: "apartment", label: "شقة" },
    { value: "land", label: "أرض" },
    { value: "commercial", label: "تجاري" },
  ];

  const priorities = [
    { value: "urgent", label: "عاجل" },
    { value: "high", label: "عالي" },
    { value: "medium", label: "متوسط" },
    { value: "low", label: "منخفض" },
  ];

  const sources = [
    { value: "inquiry", label: "استفسار موقع" },
    { value: "manual", label: "يدوي" },
    { value: "whatsapp", label: "واتساب" },
    { value: "import", label: "استيراد" },
    { value: "referral", label: "إحالة" },
  ];

  const handleSearch = () => {
    setFilters({ search: searchQuery || undefined });
    if (onSearch) {
      onSearch(searchQuery);
    } else if (onApplyFilters) {
      onApplyFilters();
    } else {
      applyFilters();
    }
  };

  const handleStageToggle = (stageId: string) => {
    const currentStages = filters.stage || [];
    const newStages = currentStages.includes(stageId as any)
      ? currentStages.filter(s => s !== stageId)
      : [...currentStages, stageId as any];
    
    setFilters({ stage: newStages.length > 0 ? newStages : undefined });
    if (onApplyFilters) {
      onApplyFilters();
    } else {
      applyFilters();
    }
  };

  const handlePropertyTypeToggle = (type: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setFilters({ propertyType: newTypes.length > 0 ? newTypes : undefined });
    if (onApplyFilters) {
      onApplyFilters();
    } else {
      applyFilters();
    }
  };

  const handlePriorityToggle = (priority: string) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority as any)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority as any];
    
    setFilters({ priority: newPriorities.length > 0 ? newPriorities : undefined });
    if (onApplyFilters) {
      onApplyFilters();
    } else {
      applyFilters();
    }
  };

  const handleSourceToggle = (source: string) => {
    const currentSources = filters.source || [];
    const newSources = currentSources.includes(source as any)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source as any];
    
    setFilters({ source: newSources.length > 0 ? newSources : undefined });
    if (onApplyFilters) {
      onApplyFilters();
    } else {
      applyFilters();
    }
  };

  const handleCityToggle = (cityId: number) => {
    const current = filters.city || [];
    const next = current.includes(cityId) ? current.filter((id) => id !== cityId) : [...current, cityId];
    setFilters({ city: next.length > 0 ? next : undefined });
    if (onApplyFilters) onApplyFilters();
    else applyFilters();
  };

  const handleDistrictToggle = (districtId: number) => {
    const current = filters.district || [];
    const next = current.includes(districtId) ? current.filter((id) => id !== districtId) : [...current, districtId];
    setFilters({ district: next.length > 0 ? next : undefined });
    if (onApplyFilters) onApplyFilters();
    else applyFilters();
  };

  const handleEmployeeToggle = (employeeId: string) => {
    const current = filters.assignedEmployee || [];
    const next = current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId];
    setFilters({ assignedEmployee: next.length > 0 ? next : undefined });
    if (onApplyFilters) onApplyFilters();
    else applyFilters();
  };

  const hasActiveFilters = 
    (filters.stage && filters.stage.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.propertyType && filters.propertyType.length > 0) ||
    (filters.source && filters.source.length > 0) ||
    (filters.city && filters.city.length > 0) ||
    (filters.district && filters.district.length > 0) ||
    (filters.assignedEmployee && filters.assignedEmployee.length > 0) ||
    filters.search;

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

              {/* Priority Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Clock className="h-4 w-4" />
                    جميع الأولويات
                    {filters.priority && filters.priority.length > 0 && (
                      <Badge variant="secondary" className="mr-1">
                        {filters.priority.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {priorities.map((priority) => (
                    <DropdownMenuCheckboxItem
                      key={priority.value}
                      checked={filters.priority?.includes(priority.value as any)}
                      onCheckedChange={() => handlePriorityToggle(priority.value)}
                    >
                      {priorityLabels[priority.value] || priority.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Source Dropdown */}
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
                  {sources.map((source) => (
                    <DropdownMenuCheckboxItem
                      key={source.value}
                      checked={filters.source?.includes(source.value as any)}
                      onCheckedChange={() => handleSourceToggle(source.value)}
                    >
                      {source.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Property Type Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Home className="h-4 w-4" />
                    نوع العقار
                    {filters.propertyType && filters.propertyType.length > 0 && (
                      <Badge variant="secondary" className="mr-1">
                        {filters.propertyType.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>نوع العقار</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {propertyTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type.value}
                      checked={filters.propertyType?.includes(type.value)}
                      onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                    >
                      {type.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={() => {
                  clearFilters();
                  setSearchQuery("");
                  if (onApplyFilters) {
                    onApplyFilters();
                  } else {
                    applyFilters();
                  }
                }} className="gap-1">
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
