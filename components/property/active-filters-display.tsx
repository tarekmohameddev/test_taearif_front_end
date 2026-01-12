"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

interface ActiveFiltersDisplayProps {
  filters: any;
  onRemoveFilter: (filterKey: string, filterValue?: any) => void;
  onClearAll: () => void;
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersDisplayProps) {
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

  // Fetch districts when city_id filter is present
  useEffect(() => {
    if (filters.city_id) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await axiosInstance.get(`https://nzl-backend.com/api/districts?city_id=${filters.city_id}`);
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
    }
  }, [filters.city_id]);

  const getFilterDisplayName = (key: string, value: any, filters: any) => {
    switch (key) {
      case "purposes_filter":
        return value === "rent"
          ? "للإيجار"
          : value === "sale"
            ? "للبيع"
            : value;
      case "type":
        return value === "residential"
          ? "سكني"
          : value === "commercial"
            ? "تجاري"
            : value === "rent"
              ? "للإيجار"
              : value === "sale"
                ? "للبيع"
                : value;
      case "price_from":
        return `من ${value.toLocaleString()} ريال`;
      case "price_to":
        return `إلى ${value.toLocaleString()} ريال`;
      case "area_from":
        return `من ${value} م²`;
      case "area_to":
        return `إلى ${value} م²`;
      case "beds":
        return `${value}+ غرف`;
      case "baths":
        return `${value}+ حمامات`;
      case "features":
        return value;
      case "city_id": {
        const city = cities.find((c) => c.id === parseInt(value));
        return city ? `المدينة: ${city.name_ar || city.name_en}` : `المدينة: ${value}`;
      }
      case "district_id": {
        const district = districts.find((d) => d.id === parseInt(value));
        return district ? `الحي: ${district.name_ar || district.name_en}` : `الحي: ${value}`;
      }
      default:
        return value;
    }
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{
      key: string;
      value: any;
      displayName: string;
    }> = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((item: any) => {
          activeFilters.push({
            key,
            value: item,
            displayName: getFilterDisplayName(key, item, filters),
          });
          });
        } else if (!Array.isArray(value)) {
          activeFilters.push({
            key,
            value,
            displayName: getFilterDisplayName(key, value, filters),
          });
        }
      }
    });

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <span className="text-sm font-medium text-gray-700">الفلاتر النشطة:</span>

      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value}-${index}`}
          variant="secondary"
          className="bg-black text-white hover:bg-gray-800 flex items-center gap-1"
        >
          {filter.displayName}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-600"
            onClick={() => onRemoveFilter(filter.key, filter.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="text-gray-600 hover:text-black border-gray-300"
      >
        مسح الكل
      </Button>
    </div>
  );
}
