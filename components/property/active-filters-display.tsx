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

  // Translation function for payment methods
  const translatePaymentMethod = (method: string): string => {
    const translations: { [key: string]: string } = {
      annual: "سنوي",
      monthly: "شهري",
      semi_annual: "نصف سنوي",
      quarterly: "ربع سنوي",
      cash: "نقدي",
      installment: "تقسيط",
    };
    return translations[method] || method;
  };

  // دالة لتنسيق الأرقام بشكل أفضل
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return String(price);
    return numPrice.toLocaleString("ar-SA");
  };

  const getFilterDisplayName = (key: string, value: any, filters: any) => {
    switch (key) {
      case "purposes_filter":
        return value === "rent"
          ? "للإيجار"
          : value === "sale"
            ? "للبيع"
            : value;
      case "purpose":
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
      case "price_min":
        // إذا كان هناك price_max أو price_to، سنعرضهما معاً في badge واحد
        const maxPrice = filters.price_max || filters.price_to;
        if (maxPrice) {
          return null; // سنعرضه في case price_max/price_to
        }
        return `من ${formatPrice(value)} ريال`;
      case "price_to":
      case "price_max":
        // إذا كان هناك price_min أو price_from، اعرضهما معاً
        const minPrice = filters.price_min || filters.price_from;
        if (minPrice) {
          return `من ${formatPrice(minPrice)} إلى ${formatPrice(value)} ريال`;
        }
        return `إلى ${formatPrice(value)} ريال`;
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
      case "payment_method":
        return `طريقة الدفع: ${translatePaymentMethod(value)}`;
      case "search":
        return `البحث: ${value}`;
      case "date_from":
        return `من تاريخ: ${value}`;
      case "date_to":
        return `إلى تاريخ: ${value}`;
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

    // معالجة خاصة للسعر - إذا كان هناك price_min و price_max، اعرضهما معاً
    const hasPriceMin = filters.price_min && filters.price_min !== "" && filters.price_min !== 0;
    const hasPriceMax = filters.price_max && filters.price_max !== "" && filters.price_max !== 0;
    const hasPriceFrom = filters.price_from && filters.price_from !== "" && filters.price_from !== 0;
    const hasPriceTo = filters.price_to && filters.price_to !== "" && filters.price_to !== 0;

    // إذا كان هناك price_min و price_max، اعرضهما معاً وتجاهل price_from و price_to
    if (hasPriceMin && hasPriceMax) {
      activeFilters.push({
        key: "price_range",
        value: { min: filters.price_min, max: filters.price_max },
        displayName: `من ${formatPrice(filters.price_min)} إلى ${formatPrice(filters.price_max)} ريال`,
      });
    } else if (hasPriceMin) {
      activeFilters.push({
        key: "price_min",
        value: filters.price_min,
        displayName: getFilterDisplayName("price_min", filters.price_min, filters),
      });
    } else if (hasPriceMax) {
      activeFilters.push({
        key: "price_max",
        value: filters.price_max,
        displayName: getFilterDisplayName("price_max", filters.price_max, filters),
      });
    } else if (hasPriceFrom && hasPriceTo) {
      // للتوافق مع الكود القديم
      activeFilters.push({
        key: "price_range",
        value: { min: filters.price_from, max: filters.price_to },
        displayName: `من ${formatPrice(filters.price_from)} إلى ${formatPrice(filters.price_to)} ريال`,
      });
    } else if (hasPriceFrom) {
      activeFilters.push({
        key: "price_from",
        value: filters.price_from,
        displayName: getFilterDisplayName("price_from", filters.price_from, filters),
      });
    } else if (hasPriceTo) {
      activeFilters.push({
        key: "price_to",
        value: filters.price_to,
        displayName: getFilterDisplayName("price_to", filters.price_to, filters),
      });
    }

    // معالجة باقي الفلاتر
    Object.entries(filters).forEach(([key, value]) => {
      // تخطي price_from, price_to, price_min, price_max لأننا عالجناها أعلاه
      if (key === "price_from" || key === "price_to" || key === "price_min" || key === "price_max") {
        return;
      }

      if (value && value !== "" && value !== 0) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((item: any) => {
            const displayName = getFilterDisplayName(key, item, filters);
            if (displayName !== null) {
              activeFilters.push({
                key,
                value: item,
                displayName,
              });
            }
          });
        } else if (!Array.isArray(value)) {
          const displayName = getFilterDisplayName(key, value, filters);
          if (displayName !== null) {
            activeFilters.push({
              key,
              value,
              displayName,
            });
          }
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
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
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
