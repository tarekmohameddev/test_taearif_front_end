"use client";
import { Search, FilterX, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ActiveFiltersDisplay } from "@/components/property/active-filters-display";

interface FiltersSectionProps {
  filterCityId: string | null;
  setFilterCityId: (id: string | null) => void;
  filterDistrictId: string | null;
  setFilterDistrictId: (id: string | null) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  filterPurpose: string | null;
  setFilterPurpose: (purpose: string | null) => void;
  filterBeds: string | null;
  setFilterBeds: (beds: string | null) => void;
  filterPriceFrom: string;
  setFilterPriceFrom: (price: string) => void;
  filterPriceTo: string;
  setFilterPriceTo: (price: string) => void;
  tempPriceFrom: string;
  setTempPriceFrom: (price: string) => void;
  tempPriceTo: string;
  setTempPriceTo: (price: string) => void;
  isPricePopoverOpen: boolean;
  setIsPricePopoverOpen: (open: boolean) => void;
  localSearchValue: string;
  setLocalSearchValue: (value: string) => void;
  cities: any[];
  districts: any[];
  loadingCities: boolean;
  loadingDistricts: boolean;
  newFilters: Record<string, any>;
  handleSearchOnly: () => void;
  handleClearFilters: () => void;
  handleRemoveFilter: (key: string, value?: any) => void;
  handleClearAllFilters: () => void;
}

export function FiltersSection({
  filterCityId,
  setFilterCityId,
  filterDistrictId,
  setFilterDistrictId,
  filterType,
  setFilterType,
  filterPurpose,
  setFilterPurpose,
  filterBeds,
  setFilterBeds,
  filterPriceFrom,
  setFilterPriceFrom,
  filterPriceTo,
  setFilterPriceTo,
  tempPriceFrom,
  setTempPriceFrom,
  tempPriceTo,
  setTempPriceTo,
  isPricePopoverOpen,
  setIsPricePopoverOpen,
  localSearchValue,
  setLocalSearchValue,
  cities,
  districts,
  loadingCities,
  loadingDistricts,
  newFilters,
  handleSearchOnly,
  handleClearFilters,
  handleRemoveFilter,
  handleClearAllFilters,
}: FiltersSectionProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        {/* السطر الأول: باقي الفلاتر */}
        <div className="flex flex-wrap gap-4">
          {/* المدينة */}
          <div className="space-y-2 w-[180px]">
            <Label>المدينة</Label>
            <Select
              value={filterCityId || undefined}
              onValueChange={(value) => {
                setFilterCityId(value || null);
                setFilterDistrictId(null);
              }}
              disabled={loadingCities}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name_ar || city.name_en || city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الحي */}
          <div className="space-y-2 w-[180px]">
            <Label>الحي</Label>
            <Select
              value={filterDistrictId || undefined}
              onValueChange={(value) => {
                setFilterDistrictId(value || null);
              }}
              disabled={loadingDistricts || !filterCityId}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الحي" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name_ar || district.name_en || district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* نوع العقار */}
          <div className="space-y-2 w-[150px]">
            <Label>نوع العقار</Label>
            <Select
              value={filterType || undefined}
              onValueChange={(value) => {
                setFilterType(value || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="شقة">شقة</SelectItem>
                <SelectItem value="فيلا">فيلا</SelectItem>
                <SelectItem value="منزل">منزل</SelectItem>
                <SelectItem value="أرض">أرض</SelectItem>
                <SelectItem value="محل">محل</SelectItem>
                <SelectItem value="مكتب">مكتب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* إيجار أو بيع */}
          <div className="space-y-2 w-[150px]">
            <Label>نوع المعاملة</Label>
            <Select
              value={filterPurpose || undefined}
              onValueChange={(value) => {
                setFilterPurpose(value || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">للبيع</SelectItem>
                <SelectItem value="rent">للإيجار</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* عدد الغرف */}
          <div className="space-y-2 w-[140px]">
            <Label>عدد الغرف</Label>
            <Select
              value={filterBeds || undefined}
              onValueChange={(value) => {
                setFilterBeds(value || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر عدد الغرف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* السعر */}
          <div className="space-y-2 w-[200px]">
            <Label>السعر</Label>
            <Popover
              open={isPricePopoverOpen}
              onOpenChange={(open) => {
                setIsPricePopoverOpen(open);
                if (open) {
                  setTempPriceFrom(filterPriceFrom);
                  setTempPriceTo(filterPriceTo);
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={`w-full justify-between ${
                    filterPriceFrom || filterPriceTo
                      ? "text-primary border-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {filterPriceFrom || filterPriceTo ? (
                    <span className="truncate">
                      {filterPriceFrom && filterPriceTo
                        ? `${Number(filterPriceFrom).toLocaleString()} - ${Number(filterPriceTo).toLocaleString()}`
                        : filterPriceFrom
                        ? `من ${Number(filterPriceFrom).toLocaleString()}`
                        : `إلى ${Number(filterPriceTo).toLocaleString()}`}
                    </span>
                  ) : (
                    "تحديد السعر"
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">نطاق السعر</h4>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="price-from">من</Label>
                      <Input
                        id="price-from"
                        type="number"
                        placeholder="0"
                        value={tempPriceFrom}
                        onChange={(e) => setTempPriceFrom(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="price-to">إلى</Label>
                      <Input
                        id="price-to"
                        type="number"
                        placeholder="Any"
                        value={tempPriceTo}
                        onChange={(e) => setTempPriceTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setFilterPriceFrom(tempPriceFrom);
                        setFilterPriceTo(tempPriceTo);
                        setIsPricePopoverOpen(false);
                      }}
                    >
                      تطبيق
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* زر إعادة التعيين */}
          <div className="space-y-2 w-[130px]">
            <Label className="opacity-0 text-[1px]">ازالة الفلاتر</Label>
            <Label className="opacity-0 text-[1px]">إعادة تعيين</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className={`w-full text-sm ${
                filterCityId ||
                filterDistrictId ||
                filterType ||
                filterPurpose ||
                filterBeds ||
                filterPriceFrom ||
                filterPriceTo ||
                localSearchValue
                  ? "border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                  : ""
              }`}
            >
              <FilterX className="h-3.5 w-3.5 mr-1.5" />
              إعادة تعيين
            </Button>
          </div>
        </div>

        {/* السطر الثاني: البحث والفلاتر النشطة */}
        <div className="flex flex-wrap items-start gap-4">
          {/* البحث */}
          <div className="space-y-2 w-[300px] shrink-0">
            <Label>البحث</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="كود الوحدة أو العنوان"
                  value={localSearchValue}
                  onChange={(e) => {
                    setLocalSearchValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchOnly();
                    }
                  }}
                  className="pr-10"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearchOnly}
                size="default"
                className="shrink-0"
              >
                <Search className="h-4 w-4 ml-2" />
                بحث
              </Button>
            </div>
          </div>

          {/* عرض الفلاتر النشطة */}
          <div className="flex-1 min-w-[300px] mt-0">
            <div className="pt-[20px]">
              <ActiveFiltersDisplay
                filters={newFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
