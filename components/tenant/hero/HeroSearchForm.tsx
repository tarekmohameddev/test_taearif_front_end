"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  CircleDollarSign,
  Search,
  ChevronDown,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUrlFilters } from "@/hooks-liveeditor/use-url-filters";
import useTenantStore from "@/context/tenantStore";

interface CityOption {
  id: string | number;
  name: string;
}

interface DistrictOption {
  id: string | number;
  name: string;
}

interface HeroSearchFormProps {
  config: any;
  primaryColor?: string;
  primaryColorHover?: string;
}

export default function HeroSearchForm({
  config,
  primaryColor,
  primaryColorHover,
}: HeroSearchFormProps) {
  const { navigateWithFilters } = useUrlFilters();
  const searchParams = useSearchParams();

  // Get primary color from tenantData if not provided
  const { tenantData } = useTenantStore();
  const defaultPrimaryColor =
    primaryColor ||
    (tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"); // emerald-600 default

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    if (!hex || !hex.startsWith("#")) return "#047857";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#047857";

    const r = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount),
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount),
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount),
    );

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const defaultPrimaryColorHover =
    primaryColorHover || getDarkerColor(defaultPrimaryColor, 20);

  // Cities and districts from API (same as propertyFilter1)
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);

  // Dropdown states
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  // Form state - using IDs not names
  const [purpose, setPurpose] = useState(() => {
    const purposeParam = searchParams?.get("purpose");
    return purposeParam || config?.fields?.purpose?.default || "rent";
  });
  const [cityId, setCityId] = useState(
    () => searchParams?.get("city_id") || "",
  );
  const [cityName, setCityName] = useState(""); // For display only
  const [stateId, setStateId] = useState(
    () => searchParams?.get("state_id") || "",
  );
  const [stateName, setStateName] = useState(""); // For display only
  const [price, setPrice] = useState(
    () => searchParams?.get("max_price") || "",
  );

  // Fetch cities from API
  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        setCityLoading(true);
        const res = await fetch(
          "https://nzl-backend.com/api/cities?country_id=1",
        );
        if (!res.ok) throw new Error(`Failed to load cities: ${res.status}`);
        const data = await res.json();
        const list: CityOption[] = Array.isArray(data?.data)
          ? data.data.map((c: any) => ({
              id: c.id,
              name: c.name_ar || c.name_en || String(c.id),
            }))
          : [];
        if (isMounted) setCityOptions(list);
      } catch (e: any) {
        console.error("Error fetching cities:", e);
      } finally {
        if (isMounted) setCityLoading(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch districts when city is selected
  useEffect(() => {
    let isMounted = true;
    const fetchDistricts = async () => {
      if (!cityId) {
        setDistrictOptions([]);
        setStateId("");
        setStateName("");
        return;
      }

      try {
        setDistrictLoading(true);
        const res = await fetch(
          `https://nzl-backend.com/api/districts?city_id=${cityId}`,
        );
        if (!res.ok) throw new Error(`Failed to load districts: ${res.status}`);
        const data = await res.json();
        const list: DistrictOption[] = Array.isArray(data?.data)
          ? data.data.map((d: any) => ({
              id: d.id,
              name: d.name_ar || d.name_en || String(d.id),
            }))
          : [];
        if (isMounted) {
          setDistrictOptions(list);
          setStateId(""); // Reset district when city changes
          setStateName("");
        }
      } catch (e: any) {
        console.error("Error fetching districts:", e);
      } finally {
        if (isMounted) setDistrictLoading(false);
      }
    };
    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [cityId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityOpen(false);
      }
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDistrictOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update form fields when URL changes
  useEffect(() => {
    if (!searchParams) return;

    const purposeParam = searchParams.get("purpose");
    const cityIdParam = searchParams.get("city_id");
    const stateIdParam = searchParams.get("state_id");
    const priceParam = searchParams.get("max_price");

    if (purposeParam) setPurpose(purposeParam);
    if (cityIdParam) setCityId(cityIdParam);
    if (stateIdParam) setStateId(stateIdParam);
    if (priceParam) setPrice(priceParam);
  }, [searchParams]);

  // Find city name from cityId for display
  useEffect(() => {
    if (cityId && cityOptions.length > 0) {
      const city = cityOptions.find((c) => c.id.toString() === cityId);
      if (city) setCityName(city.name);
    }
  }, [cityId, cityOptions]);

  // Find district name from stateId for display
  useEffect(() => {
    if (stateId && districtOptions.length > 0) {
      const district = districtOptions.find((d) => d.id.toString() === stateId);
      if (district) setStateName(district.name);
    }
  }, [stateId, districtOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Collect all form values using IDs
    const filters = {
      city_id: cityId.trim(),
      state_id: stateId.trim(),
      max_price: price.trim(),
    };

    // Log for debugging
    console.log("🔍 Hero Search Form Submit:", {
      purpose,
      filters,
      hasCity: !!cityId,
      hasDistrict: !!stateId,
      hasPrice: !!price,
    });

    // Navigate to the appropriate listing page with filters
    navigateWithFilters(purpose as "rent" | "sale", filters);
  };

  if (!config?.enabled) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg bg-white p-3 sm:p-4 lg:p-5 shadow-2xl"
      aria-label="نموذج البحث عن العقارات"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Purpose Toggle (full width on mobile, one column on lg+) */}
        {config.fields?.purpose?.enabled && (
          <div className="sm:col-span-2 lg:col-span-1 flex items-center justify-center">
            <div className="inline-flex overflow-hidden rounded-lg border bg-gray-50 p-1 w-full">
              {config.fields.purpose.options?.map((option: any) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => setPurpose(option.value)}
                  style={
                    purpose === option.value
                      ? {
                          backgroundColor: defaultPrimaryColor,
                          color: "#ffffff",
                        }
                      : {}
                  }
                  onMouseEnter={(e) => {
                    if (purpose === option.value) {
                      e.currentTarget.style.backgroundColor =
                        defaultPrimaryColorHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (purpose === option.value) {
                      e.currentTarget.style.backgroundColor =
                        defaultPrimaryColor;
                    }
                  }}
                  className={
                    purpose === option.value
                      ? "rounded-md flex-1 py-2 text-sm font-semibold text-white transition-colors"
                      : "rounded-md bg-transparent flex-1 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* City Dropdown */}
        {config.fields?.city?.enabled && (
          <div className="relative" ref={cityDropdownRef}>
            <div
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors h-[50px]"
              onClick={() => setIsCityOpen(!isCityOpen)}
            >
              <MapPin className="size-5 text-gray-400" />
              <span className="flex-1 text-sm text-gray-700">
                {cityName || config.fields.city.placeholder || "اختر المدينة"}
              </span>
              <ChevronDown className="size-5 text-gray-400" />
            </div>
            {isCityOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                {cityLoading ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    جاري التحميل...
                  </div>
                ) : cityOptions.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    لا توجد مدن
                  </div>
                ) : (
                  cityOptions.map((city) => (
                    <div
                      key={city.id}
                      style={
                        {
                          "--hover-bg": `${defaultPrimaryColor}1A`, // 10% opacity
                        } as React.CSSProperties
                      }
                      className="px-4 py-3 cursor-pointer text-sm transition-colors hover:bg-opacity-10"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${defaultPrimaryColor}1A`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "";
                      }}
                      onClick={() => {
                        setCityId(city.id.toString());
                        setCityName(city.name);
                        setIsCityOpen(false);
                      }}
                    >
                      {city.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* District Dropdown (always visible, disabled when no city selected) */}
        <div className="relative" ref={districtDropdownRef}>
          <div
            className={`flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-3 bg-white transition-colors h-[50px] ${
              !cityId
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50"
            }`}
            onClick={() => cityId && setIsDistrictOpen(!isDistrictOpen)}
            title={!cityId ? "اختر المدينة أولاً" : ""}
          >
            <Home className="size-5 text-gray-400" />
            <span className="flex-1 text-sm text-gray-700">
              {!cityId
                ? "اختر المدينة أولاً"
                : stateName || "اختر الحي (اختياري)"}
            </span>
            <ChevronDown className="size-5 text-gray-400" />
          </div>
          {isDistrictOpen && cityId && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto shadow-xl">
              {districtLoading ? (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  جاري التحميل...
                </div>
              ) : districtOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  لا توجد أحياء لهذه المدينة
                </div>
              ) : (
                districtOptions.map((district) => (
                  <div
                    key={district.id}
                    style={
                      {
                        "--hover-bg": `${defaultPrimaryColor}1A`, // 10% opacity
                      } as React.CSSProperties
                    }
                    className="px-4 py-3 cursor-pointer text-sm transition-colors hover:bg-opacity-10"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${defaultPrimaryColor}1A`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                    }}
                    onClick={() => {
                      setStateId(district.id.toString());
                      setStateName(district.name);
                      setIsDistrictOpen(false);
                    }}
                  >
                    {district.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Price Input */}
        {config.fields?.price?.enabled && (
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-3 bg-white h-[50px]">
            <CircleDollarSign className="size-5 text-gray-400" />
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={config.fields.price.placeholder || "السعر الأقصى"}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm p-0"
              min={0}
            />
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          style={{ backgroundColor: defaultPrimaryColor, color: "#ffffff" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = defaultPrimaryColorHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = defaultPrimaryColor;
          }}
          className="sm:col-span-2 lg:col-span-1 w-full py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Search className="size-5" />
          <span>بحث</span>
        </button>
      </div>
    </form>
  );
}
