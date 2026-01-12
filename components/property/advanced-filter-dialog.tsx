"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
}

export function AdvancedFilterDialog({
  isOpen,
  onClose,
  filterData,
  onApplyFilters,
}: FilterDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 0]);
  const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
  const [selectedBaths, setSelectedBaths] = useState<number[]>([]);

  // Initialize filters from URL params
  useEffect(() => {
    if (searchParams) {
      const purposes = searchParams.get("purposes_filter")?.split(",") || [];
      const types = searchParams.get("type")?.split(",") || [];
      const features = searchParams.get("features")?.split(",") || [];
      const priceFrom = searchParams.get("price_from")
        ? parseInt(searchParams.get("price_from")!)
        : 0;
      const priceTo = searchParams.get("price_to")
        ? parseInt(searchParams.get("price_to")!)
        : 0;
      const areaFrom = searchParams.get("area_from")
        ? parseInt(searchParams.get("area_from")!)
        : 0;
      const areaTo = searchParams.get("area_to")
        ? parseInt(searchParams.get("area_to")!)
        : 0;
      const beds = searchParams.get("beds")?.split(",").map(Number) || [];
      const baths = searchParams.get("baths")?.split(",").map(Number) || [];

      setSelectedPurposes(purposes);
      setSelectedTypes(types);
      setSelectedFeatures(features);
      setPriceRange([priceFrom, priceTo]);
      setAreaRange([areaFrom, areaTo]);
      setSelectedBeds(beds);
      setSelectedBaths(baths);
    }
  }, [searchParams]);

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
    if (filterData) {
      const minPrice = parseInt(filterData.specifics_filters.price_range.min);
      const maxPrice = parseInt(filterData.specifics_filters.price_range.max);
      const minArea = parseInt(filterData.specifics_filters.area_range.min);
      setPriceRange([minPrice, maxPrice]);
      setAreaRange([minArea, maxPrice]);
    }
  };

  const applyFilters = () => {
    const filters = {
      purposes_filter: selectedPurposes,
      type: selectedTypes,
      features: selectedFeatures,
      price_from: priceRange[0],
      price_to: priceRange[1],
      area_from: areaRange[0],
      area_to: areaRange[1],
      beds: selectedBeds,
      baths: selectedBaths,
    };

    // Build URL params
    const params = new URLSearchParams();

    if (selectedPurposes.length > 0) {
      params.set("purposes_filter", selectedPurposes.join(","));
    }
    if (selectedTypes.length > 0) {
      params.set("type", selectedTypes.join(","));
    }
    if (selectedFeatures.length > 0) {
      params.set("features", selectedFeatures.join(","));
    }
    if (priceRange[0] > 0) {
      params.set("price_from", priceRange[0].toString());
    }
    if (priceRange[1] > 0) {
      params.set("price_to", priceRange[1].toString());
    }
    if (areaRange[0] > 0) {
      params.set("area_from", areaRange[0].toString());
    }
    if (areaRange[1] > 0) {
      params.set("area_to", areaRange[1].toString());
    }
    if (selectedBeds.length > 0) {
      params.set("beds", selectedBeds.join(","));
    }
    if (selectedBaths.length > 0) {
      params.set("baths", selectedBaths.join(","));
    }

    // Update URL
    const newUrl = params.toString()
      ? `/properties?${params.toString()}`
      : "/properties";
    router.push(newUrl);

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
