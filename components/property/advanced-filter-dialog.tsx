"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";

interface FilterData {
  purposes_filter: string[];
  specifics_filters: {
    price_range: {
      min: string;
      max: string;
    };
    area_range: {
      min: string;
    };
    purpose: string[];
    type: string[];
    beds: number[];
    bath: number[];
    features: string[];
  };
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filterData: FilterData | null;
  onApplyFilters: (filters: any) => void;
  appliedFilters?: Record<string, any>;
}

export function AdvancedFilterDialog({
  isOpen,
  onClose,
  filterData,
  onApplyFilters,
  appliedFilters = {},
}: FilterDialogProps) {

  // State for filters
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 0]);
  const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
  const [selectedBaths, setSelectedBaths] = useState<number[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  
  // Cities and Districts data
  const [cities, setCities] = useState<Array<{ id: number; name_ar: string; name_en: string }>>([]);
  const [districts, setDistricts] = useState<Array<{ id: number; city_id: number; name_ar: string; name_en: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axiosInstance.get("https://nzl-backend.com/api/cities?country_id=1");
        setCities(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Fetch districts when city is selected
  useEffect(() => {
    if (selectedCityId) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await axiosInstance.get(`https://nzl-backend.com/api/districts?city_id=${selectedCityId}`);
          setDistricts(response.data?.data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrictId(null);
    }
  }, [selectedCityId]);

  // Initialize filters from appliedFilters when dialog opens
  useEffect(() => {
    if (isOpen && filterData) {
      // Initialize from appliedFilters if available, otherwise use defaults
      const minPrice = parseInt(filterData.specifics_filters.price_range.min);
      const maxPrice = parseInt(filterData.specifics_filters.price_range.max);
      const minArea = parseInt(filterData.specifics_filters.area_range.min);

      setSelectedPurposes(
        Array.isArray(appliedFilters.purposes_filter)
          ? appliedFilters.purposes_filter
          : appliedFilters.purposes_filter
            ? [appliedFilters.purposes_filter]
            : []
      );
      setSelectedTypes(
        Array.isArray(appliedFilters.type)
          ? appliedFilters.type
          : appliedFilters.type
            ? [appliedFilters.type]
            : []
      );
      setSelectedFeatures(
        Array.isArray(appliedFilters.features)
          ? appliedFilters.features
          : appliedFilters.features
            ? [appliedFilters.features]
            : []
      );
      setSelectedBeds(
        Array.isArray(appliedFilters.beds)
          ? appliedFilters.beds
          : appliedFilters.beds
            ? [appliedFilters.beds]
            : []
      );
      setSelectedBaths(
        Array.isArray(appliedFilters.baths)
          ? appliedFilters.baths
          : appliedFilters.baths
            ? [appliedFilters.baths]
            : []
      );
      setPriceRange([
        appliedFilters.price_from || minPrice,
        appliedFilters.price_to || maxPrice,
      ]);
      setAreaRange([
        appliedFilters.area_from || minArea,
        appliedFilters.area_to || maxPrice,
      ]);
      setSelectedCityId(appliedFilters.city_id || null);
      setSelectedDistrictId(appliedFilters.district_id || null);
    }
  }, [isOpen, filterData, appliedFilters]);

  // Initialize ranges from filter data
  useEffect(() => {
    if (filterData) {
      const minPrice = parseInt(filterData.specifics_filters.price_range.min);
      const maxPrice = parseInt(filterData.specifics_filters.price_range.max);
      const minArea = parseInt(filterData.specifics_filters.area_range.min);

      // استخدام useRef أو state منفصل لتجنب infinite loop
      setPriceRange((prev) => {
        if (prev[0] === 0 && prev[1] === 0) {
          return [minPrice, maxPrice];
        }
        return prev;
      });

      setAreaRange((prev) => {
        if (prev[0] === 0 && prev[1] === 0) {
          return [minArea, maxPrice]; // Using maxPrice as max area for now
        }
        return prev;
      });
    }
  }, [filterData]); // إزالة priceRange و areaRange من dependencies

  const handlePurposeToggle = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose],
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const handleBedToggle = (bed: number) => {
    setSelectedBeds((prev) =>
      prev.includes(bed) ? prev.filter((b) => b !== bed) : [...prev, bed],
    );
  };

  const handleBathToggle = (bath: number) => {
    setSelectedBaths((prev) =>
      prev.includes(bath) ? prev.filter((b) => b !== bath) : [...prev, bath],
    );
  };

  const resetFilters = () => {
    setSelectedPurposes([]);
    setSelectedTypes([]);
    setSelectedFeatures([]);
    setSelectedBeds([]);
    setSelectedBaths([]);
    setSelectedCityId(null);
    setSelectedDistrictId(null);
    if (filterData) {
      const minPrice = parseInt(filterData.specifics_filters.price_range.min);
      const maxPrice = parseInt(filterData.specifics_filters.price_range.max);
      const minArea = parseInt(filterData.specifics_filters.area_range.min);
      setPriceRange([minPrice, maxPrice]);
      setAreaRange([minArea, maxPrice]);
    }
  };

  const applyFilters = () => {
    if (!filterData) return;

    const minPrice = parseInt(filterData.specifics_filters.price_range.min);
    const maxPrice = parseInt(filterData.specifics_filters.price_range.max);
    const minArea = parseInt(filterData.specifics_filters.area_range.min);

    const filters: any = {};

    // Only include filters that are different from defaults or have values
    if (selectedPurposes.length > 0) {
      filters.purposes_filter = selectedPurposes;
    }
    if (selectedTypes.length > 0) {
      filters.type = selectedTypes;
    }
    if (selectedFeatures.length > 0) {
      filters.features = selectedFeatures;
    }
    if (selectedBeds.length > 0) {
      filters.beds = selectedBeds;
    }
    if (selectedBaths.length > 0) {
      filters.baths = selectedBaths;
    }
    if (selectedCityId) {
      filters.city_id = selectedCityId;
    }
    if (selectedDistrictId) {
      filters.district_id = selectedDistrictId;
    }
    // Only include price filters if they differ from defaults
    if (priceRange[0] !== minPrice) {
      filters.price_from = priceRange[0];
    }
    if (priceRange[1] !== maxPrice) {
      filters.price_to = priceRange[1];
    }
    // Only include area filters if they differ from defaults
    if (areaRange[0] !== minArea) {
      filters.area_from = areaRange[0];
    }
    if (areaRange[1] !== maxPrice) {
      filters.area_to = areaRange[1];
    }

    // Apply filters through callback (don't navigate - we're in dashboard)
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedPurposes.length > 0) count++;
    if (selectedTypes.length > 0) count++;
    if (selectedFeatures.length > 0) count++;
    if (selectedBeds.length > 0) count++;
    if (selectedBaths.length > 0) count++;
    if (selectedCityId) count++;
    if (selectedDistrictId) count++;
    if (
      priceRange[0] >
      parseInt(filterData?.specifics_filters.price_range.min || "0")
    )
      count++;
    if (
      priceRange[1] <
      parseInt(filterData?.specifics_filters.price_range.max || "0")
    )
      count++;
    if (
      areaRange[0] >
      parseInt(filterData?.specifics_filters.area_range.min || "0")
    )
      count++;
    if (
      areaRange[1] <
      parseInt(filterData?.specifics_filters.price_range.max || "0")
    )
      count++;
    return count;
  };

  if (!filterData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
              <SlidersHorizontal className="h-6 w-6" />
              فلترة الوحدات
            </DialogTitle>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-black text-white">
                  {getActiveFiltersCount()} فلتر نشط
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-600 hover:text-black"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                إعادة تعيين
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          {/* المدينة */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              المدينة
            </h3>
            <Select
              value={selectedCityId?.toString() || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedCityId(null);
                  setSelectedDistrictId(null);
                } else {
                  setSelectedCityId(parseInt(value));
                  setSelectedDistrictId(null); // Reset district when city changes
                }
              }}
            >
              <SelectTrigger className="w-full border-black">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المدن</SelectItem>
                {loadingCities ? (
                  <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name_ar || city.name_en}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* الحي */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              الحي
            </h3>
            <Select
              value={selectedDistrictId?.toString() || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedDistrictId(null);
                } else {
                  setSelectedDistrictId(parseInt(value));
                }
              }}
              disabled={!selectedCityId || loadingDistricts}
            >
              <SelectTrigger className="w-full border-black" disabled={!selectedCityId || loadingDistricts}>
                <SelectValue placeholder={loadingDistricts ? "جاري التحميل..." : selectedCityId ? "اختر الحي" : "اختر المدينة أولاً"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأحياء</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name_ar || district.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الهدف من العقار */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              الهدف من الوحدة
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filterData.purposes_filter.map((purpose) => (
                <div key={purpose} className="flex items-center space-x-3">
                  <Checkbox
                    id={`purpose-${purpose}`}
                    checked={selectedPurposes.includes(purpose)}
                    onCheckedChange={() => handlePurposeToggle(purpose)}
                    className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black mx-1"
                  />
                  <Label
                    htmlFor={`purpose-${purpose}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {purpose === "rent"
                      ? "للإيجار"
                      : purpose === "sale"
                        ? "للبيع"
                        : purpose}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* نوع العقار */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              نوع الوحدة
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filterData.specifics_filters.type.map((type) => (
                <div key={type} className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                    className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black mx-1"
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {type === "residential"
                      ? "سكني"
                      : type === "commercial"
                        ? "تجاري"
                        : type === "rent"
                          ? "للإيجار"
                          : type === "sale"
                            ? "للبيع"
                            : type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* نطاق السعر */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              نطاق السعر
            </h3>
            <div className="space-y-4">
              <div className="px-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) =>
                    setPriceRange(value as [number, number])
                  }
                  max={parseInt(filterData.specifics_filters.price_range.max)}
                  min={parseInt(filterData.specifics_filters.price_range.min)}
                  step={10000}
                  className="w-full"
                  dir="rtl"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>من {priceRange[0].toLocaleString()} ريال</span>
                <span>إلى {priceRange[1].toLocaleString()} ريال</span>
              </div>
            </div>
          </div>

          {/* عدد الغرف */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              عدد الغرف
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bed) => (
                <div key={bed} className="flex items-center space-x-3">
                  <Checkbox
                    id={`bed-${bed}`}
                    checked={selectedBeds.includes(bed)}
                    onCheckedChange={() => handleBedToggle(bed)}
                    className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black mx-1"
                  />
                  <Label
                    htmlFor={`bed-${bed}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {bed}+
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* نطاق المساحة */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              نطاق المساحة (م²)
            </h3>
            <div className="space-y-4">
              <div className="px-4">
                <Slider
                  value={areaRange}
                  onValueChange={(value) =>
                    setAreaRange(value as [number, number])
                  }
                  max={parseInt(filterData.specifics_filters.price_range.max)} // Using price max as area max for now
                  min={parseInt(filterData.specifics_filters.area_range.min)}
                  step={1000}
                  className="w-full"
                  dir="rtl"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>من {areaRange[0]} م²</span>
                <span>إلى {areaRange[1]} م²</span>
              </div>
            </div>
          </div>

          {/* عدد الحمامات */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
              عدد الحمامات
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6].map((bath) => (
                <div key={bath} className="flex items-center space-x-3">
                  <Checkbox
                    id={`bath-${bath}`}
                    checked={selectedBaths.includes(bath)}
                    onCheckedChange={() => handleBathToggle(bath)}
                    className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black mx-1"
                  />
                  <Label
                    htmlFor={`bath-${bath}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {bath}+
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* المميزات */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
            المميزات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {filterData.specifics_filters.features.map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                  className="border-black data-[state=checked]:bg-black data-[state=checked]:border-black mx-1"
                />
                <Label
                  htmlFor={`feature-${feature}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-black text-black hover:bg-gray-100"
          >
            إلغاء
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
            <Button
              onClick={applyFilters}
              className="bg-black text-white hover:bg-gray-800"
            >
              تطبيق الفلاتر
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white text-black">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
