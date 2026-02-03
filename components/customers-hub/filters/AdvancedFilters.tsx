"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { 
  Filter, X, Search, DollarSign, Calendar,
  MapPin, Home, Users, Clock
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { LIFECYCLE_STAGES, getStageNameAr } from "@/types/unified-customer";

export function AdvancedFilters() {
  const { filters, setFilters, clearFilters, applyFilters } = useUnifiedCustomersStore();
  const [isOpen, setIsOpen] = useState(false);

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

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof typeof filters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }).length;

  const handleStageToggle = (stageId: string) => {
    const currentStages = filters.stage || [];
    const newStages = currentStages.includes(stageId as any)
      ? currentStages.filter(s => s !== stageId)
      : [...currentStages, stageId as any];
    
    setFilters({ stage: newStages.length > 0 ? newStages : undefined });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setFilters({ propertyType: newTypes.length > 0 ? newTypes : undefined });
  };

  const handlePriorityToggle = (priority: string) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority as any)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority as any];
    
    setFilters({ priority: newPriorities.length > 0 ? newPriorities : undefined });
  };

  const handleSourceToggle = (source: string) => {
    const currentSources = filters.source || [];
    const newSources = currentSources.includes(source as any)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source as any];
    
    setFilters({ source: newSources.length > 0 ? newSources : undefined });
  };

  return (
    <div className="space-y-4">
      {/* Filter Button & Active Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              تصفية متقدمة
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 px-1.5 py-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] max-h-[600px] overflow-y-auto" align="start">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-semibold text-lg">التصفية المتقدمة</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    clearFilters();
                    setIsOpen(false);
                  }}
                >
                  إعادة تعيين
                </Button>
              </div>

              {/* Lifecycle Stages */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  المراحل
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {LIFECYCLE_STAGES.map((stage) => (
                    <div
                      key={stage.id}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                        filters.stage?.includes(stage.id as any)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleStageToggle(stage.id)}
                    >
                      <Checkbox 
                        checked={filters.stage?.includes(stage.id as any)} 
                        onCheckedChange={() => handleStageToggle(stage.id)}
                      />
                      <span className="text-sm">{getStageNameAr(stage.id)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  نطاق الميزانية (ريال)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">من</Label>
                    <Input
                      type="number"
                      step={10000}
                      placeholder="0"
                      value={filters.budgetMin || ""}
                      onChange={(e) => setFilters({ budgetMin: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">إلى</Label>
                    <Input
                      type="number"
                      step={10000}
                      placeholder="1000000"
                      value={filters.budgetMax || ""}
                      onChange={(e) => setFilters({ budgetMax: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  نوع العقار
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                        filters.propertyType?.includes(type.value)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePropertyTypeToggle(type.value)}
                    >
                      <Checkbox 
                        checked={filters.propertyType?.includes(type.value)} 
                        onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                      />
                      <span className="text-sm">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  الأولوية
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map((priority) => (
                    <div
                      key={priority.value}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                        filters.priority?.includes(priority.value as any)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePriorityToggle(priority.value)}
                    >
                      <Checkbox 
                        checked={filters.priority?.includes(priority.value as any)} 
                        onCheckedChange={() => handlePriorityToggle(priority.value)}
                      />
                      <span className="text-sm">{priority.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  المصدر
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {sources.map((source) => (
                    <div
                      key={source.value}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                        filters.source?.includes(source.value as any)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSourceToggle(source.value)}
                    >
                      <Checkbox 
                        checked={filters.source?.includes(source.value as any)} 
                        onCheckedChange={() => handleSourceToggle(source.value)}
                      />
                      <span className="text-sm">{source.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  تاريخ الإضافة
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">من</Label>
                    <Input
                      type="date"
                      value={filters.createdFrom || ""}
                      onChange={(e) => setFilters({ createdFrom: e.target.value || undefined })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">إلى</Label>
                    <Input
                      type="date"
                      value={filters.createdTo || ""}
                      onChange={(e) => setFilters({ createdTo: e.target.value || undefined })}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    applyFilters();
                    setIsOpen(false);
                  }}
                >
                  <Search className="h-4 w-4 ml-2" />
                  تطبيق التصفية
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => clearFilters()}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filter Badges */}
        {filters.stage && filters.stage.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            المراحل: {filters.stage.length}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => setFilters({ stage: undefined })}
            />
          </Badge>
        )}

        {filters.propertyType && filters.propertyType.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            الأنواع: {filters.propertyType.length}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => setFilters({ propertyType: undefined })}
            />
          </Badge>
        )}

        {(filters.budgetMin || filters.budgetMax) && (
          <Badge variant="secondary" className="gap-1">
            الميزانية: {(filters.budgetMin || 0) / 1000}K-{(filters.budgetMax || 0) / 1000}K
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => setFilters({ budgetMin: undefined, budgetMax: undefined })}
            />
          </Badge>
        )}

        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-600"
          >
            <X className="h-4 w-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>
    </div>
  );
}
