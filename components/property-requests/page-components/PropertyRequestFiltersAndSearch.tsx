import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, X, FilterX, RotateCcw } from "lucide-react";

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

interface FiltersData {
  cities: FilterCity[];
  districts: FilterDistrict[];
  categories: FilterCategory[];
  property_types: string[];
  purchase_goals: string[];
  seriousness_options: string[];
}

interface PropertyRequestFiltersAndSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  cityId: string;
  setCityId: (value: string) => void;
  districtId: string;
  setDistrictId: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  purchaseGoal: string;
  setPurchaseGoal: (value: string) => void;
  seriousness: string;
  setSeriousness: (value: string) => void;
  filtersData: FiltersData;
  filteredDistricts: FilterDistrict[];
  onResetFilters: () => void;
}

export const PropertyRequestFiltersAndSearch = ({
  searchTerm,
  setSearchTerm,
  cityId,
  setCityId,
  districtId,
  setDistrictId,
  categoryId,
  setCategoryId,
  propertyType,
  setPropertyType,
  purchaseGoal,
  setPurchaseGoal,
  seriousness,
  setSeriousness,
  filtersData,
  filteredDistricts,
  onResetFilters,
}: PropertyRequestFiltersAndSearchProps) => {
  const hasActiveFilters =
    cityId ||
    districtId ||
    categoryId ||
    propertyType ||
    purchaseGoal ||
    seriousness ||
    searchTerm;

  return (
    <div className="space-y-4">
      {/* Search Bar and Clear Filters Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث في طلبات العقارات..."
            className="pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant={hasActiveFilters ? "destructive" : "outline"}
          size="default"
          onClick={onResetFilters}
          disabled={!hasActiveFilters}
          className={`flex items-center gap-2 transition-all ${
            hasActiveFilters
              ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
              : "opacity-50 cursor-not-allowed"
          }`}
          title={hasActiveFilters ? "إزالة جميع الفلاتر والبحث" : "لا توجد فلاتر نشطة"}
        >
          <FilterX className="h-4 w-4" />
          <span className="font-semibold">إزالة الفلاتر</span>
          {hasActiveFilters && (
            <span className="mr-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
              {[
                cityId,
                districtId,
                categoryId,
                propertyType,
                purchaseGoal,
                seriousness,
                searchTerm,
              ].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* City Filter */}
        <Select value={cityId || "all"} onValueChange={(value) => setCityId(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
            {filtersData.cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District Filter */}
        <Select
          value={districtId || "all"}
          onValueChange={(value) => setDistrictId(value === "all" ? "" : value)}
          disabled={!cityId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الحي" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأحياء</SelectItem>
            {filteredDistricts.map((district) => (
              <SelectItem key={district.id} value={district.id.toString()}>
                {district.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryId || "all"} onValueChange={(value) => setCategoryId(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {filtersData.categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property Type Filter */}
        <Select value={propertyType || "all"} onValueChange={(value) => setPropertyType(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع العقار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {filtersData.property_types.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "Residential" ? "سكني" : "زراعي"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Purchase Goal Filter */}
        <Select value={purchaseGoal || "all"} onValueChange={(value) => setPurchaseGoal(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="هدف الشراء" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأهداف</SelectItem>
            {filtersData.purchase_goals.map((goal) => (
              <SelectItem key={goal} value={goal}>
                {goal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Seriousness Filter */}
        <Select value={seriousness || "all"} onValueChange={(value) => setSeriousness(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الجدية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستويات</SelectItem>
            {filtersData.seriousness_options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
