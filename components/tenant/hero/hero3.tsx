"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Home, MapPin, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultHero3Data } from "@/context/editorStoreFunctions/heroFunctions";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useSearchParams, useRouter } from "next/navigation";
import { useBrandingColors } from "@/hooks/useBrandingColors";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HeroProps {
  visible?: boolean;
  height?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  minHeight?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  background?: {
    image?: string;
    video?: string;
    videoStart?: number;
    playOnMobile?: boolean;
    privacyMode?: boolean;
    alt?: string;
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
    };
  };
  content?: {
    title?: string;
    subtitle?: string;
    font?: {
      title?: {
        family?: string;
        size?: { desktop?: string; tablet?: string; mobile?: string };
        weight?: string;
        color?: string;
        lineHeight?: string;
      };
      subtitle?: {
        family?: string;
        size?: { desktop?: string; tablet?: string; mobile?: string };
        weight?: string;
        color?: string;
      };
    };
    alignment?: string;
    maxWidth?: string;
    paddingTop?: string;
  };
  searchForm?: {
    enabled?: boolean;
    position?: string;
    offset?: string;
    background?: {
      color?: string;
      opacity?: string;
      shadow?: string;
      border?: string;
      borderRadius?: string;
    };
    fields?: {
      type?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
      city?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
      status?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
    };
    responsive?: {
      desktop?: string;
      tablet?: string;
      mobile?: string;
    };
    buttons?: {
      color?: {
        useDefaultColor?: boolean;
        globalColorType?: string;
      } | string;
      advancedButtonEnabled?: boolean;
    };
  };
  animations?: {
    title?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    subtitle?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    searchForm?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// Search Form Component - Memoized to prevent unnecessary re-renders
const SearchForm = React.memo(function SearchForm({
  config,
  savedConfig,
}: {
  config: any;
  savedConfig?: any; // Saved data from heroStates/pageComponentsByPage (not tempData)
}) {
  const { navigateWithFilters } = useUrlFilters();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get branding colors from the correct source (editorStore in live editor, tenantStore in normal view)
  // This hook automatically detects if we're in live editor and uses the appropriate store
  const brandingColors = useBrandingColors();
  
  // ✅ FIX: Use savedConfig (from heroStates/pageComponentsByPage) instead of config (which may include tempData)
  // This makes it behave like "height" field - changes only appear after "Save Changes"
  // Priority: savedConfig (saved data) > config (mergedData)
  const sourceConfig = savedConfig || config;
  
  // Helper function to get icon color based on useDefaultColor and globalColorType
  const getIconColor = (): string => {
    const colorField = sourceConfig?.iconColor;
    
    // Read useDefaultColor from path FIRST, before checking colorField type
    const useDefaultColorValue = sourceConfig?.iconColor?.useDefaultColor;
    const globalColorTypeValue = sourceConfig?.iconColor?.globalColorType;
    
    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : true;
    
    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      const globalColorType = globalColorTypeValue || "primary";
      const brandingColor =
        brandingColors[globalColorType as keyof typeof brandingColors] ||
        brandingColors.primary;
      return brandingColor;
    }
    
    // If useDefaultColor is false, colorField should be a string
    if (
      colorField &&
      typeof colorField === "string" &&
      colorField.trim() !== "" &&
      colorField.startsWith("#")
    ) {
      return colorField.trim();
    }
    
    // If colorField is an object (shouldn't happen when useDefaultColor = false, but handle it)
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      if (
        colorField.value &&
        typeof colorField.value === "string" &&
        colorField.value.trim() !== "" &&
        colorField.value.startsWith("#")
      ) {
        return colorField.value.trim();
      }
    }
    
    // Final fallback: use primary branding color
    return brandingColors.primary;
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getButtonColor = (): string => {
    
    // ColorFieldRendererWithToggle saves data in this structure:
    // When useDefaultColor = true:
    //   - buttons.color.useDefaultColor = true
    //   - buttons.color.globalColorType = "primary" | "secondary" | "accent"
    //   - buttons.color might be undefined or the object itself
    // When useDefaultColor = false:
    //   - buttons.color = "#hexcolor" (direct string)
    //   - buttons.color.useDefaultColor = false (stored at buttons.color.useDefaultColor)
    
    const colorField = sourceConfig?.buttons?.color;
    
    // ✅ FIX: Read useDefaultColor from path FIRST, before checking colorField type
    // When useDefaultColor = false, colorField is a string, so we can't read useDefaultColor from it
    // But useDefaultColor is stored at buttons.color.useDefaultColor (separate path)
    // Use sourceConfig (savedConfig or config) to read from saved state first
    const useDefaultColorValue = sourceConfig?.buttons?.color?.useDefaultColor;
    const globalColorTypeValue = sourceConfig?.buttons?.color?.globalColorType;
    
    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : true;
    
    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      const globalColorType = globalColorTypeValue || "primary";
      const brandingColor =
        brandingColors[globalColorType as keyof typeof brandingColors] ||
        brandingColors.primary;
      return brandingColor;
    }
    
    // ✅ FIX: If useDefaultColor is false, colorField should be a string
    // Read it directly (it's stored as string at buttons.color)
    if (
      colorField &&
      typeof colorField === "string" &&
      colorField.trim() !== "" &&
      colorField.startsWith("#")
    ) {
      return colorField.trim();
    }
    
    // If colorField is an object (shouldn't happen when useDefaultColor = false, but handle it)
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      if (
        colorField.value &&
        typeof colorField.value === "string" &&
        colorField.value.trim() !== "" &&
        colorField.value.startsWith("#")
      ) {
        return colorField.value.trim();
      }
    }
    
    // Final fallback: use primary branding color
    return brandingColors.primary;
  };
  
  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // Original hover color = #6b4630 (fallback)
    if (!hex || !hex.startsWith('#')) return "#6b4630";
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return "#6b4630";
    
    const r = Math.max(0, Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount));
    const g = Math.max(0, Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount));
    const b = Math.max(0, Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // Get icon color using the helper function
  const iconColor = getIconColor();
  
  // Get button color using the helper function
  const buttonColor = getButtonColor();
  const buttonColorHover = getDarkerColor(buttonColor, 20);
  
  // Get advanced button enabled state (default: true if not specified)
  const advancedButtonEnabled = sourceConfig?.buttons?.advancedButtonEnabled !== undefined 
    ? sourceConfig.buttons.advancedButtonEnabled 
    : true;

  // City options from API
  interface CityOption {
    id: string | number;
    name: string;
  }
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [cityLoading, setCityLoading] = useState(false);

  // Form state
  const [status, setStatus] = useState(() => {
    const purposeParam = searchParams?.get("purpose");
    if (purposeParam === "rent") return "للإيجار";
    if (purposeParam === "sale") return "للبيع";
    return "";
  });
  const [cityId, setCityId] = useState(() => searchParams?.get("city_id") || "");
  const [cityName, setCityName] = useState("");
  const [type, setType] = useState("");
  
  // Advanced search state
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState(() => searchParams?.get("search") || "");


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
        // Fallback to config options if API fails
        if (isMounted && config.fields?.city?.options) {
          const fallbackOptions: CityOption[] = config.fields.city.options
            .filter((opt: string) => opt !== "اختر المدينة")
            .map((opt: string, index: number) => ({
              id: index + 1,
              name: opt,
            }));
          setCityOptions(fallbackOptions);
        }
      } finally {
        if (isMounted) setCityLoading(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update form fields when URL changes
  useEffect(() => {
    if (!searchParams) return;

    const purposeParam = searchParams.get("purpose");
    const cityIdParam = searchParams.get("city_id");
    const searchParam = searchParams.get("search");

    if (purposeParam === "rent") setStatus("للإيجار");
    else if (purposeParam === "sale") setStatus("للبيع");
    if (cityIdParam) setCityId(cityIdParam);
    if (searchParam) setSearchText(searchParam);
  }, [searchParams]);

  // Find city name from cityId for display
  useEffect(() => {
    if (cityId && cityOptions.length > 0) {
      const city = cityOptions.find((c) => c.id.toString() === cityId);
      if (city) setCityName(city.name);
    } else {
      setCityName("");
    }
  }, [cityId, cityOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Collect filters
    const filters: {
      city_id?: string;
      state_id?: string;
      max_price?: string;
      category_id?: string;
      type_id?: string;
      search?: string;
    } = {};

    // Add city_id if city is selected
    if (cityId && cityId.trim()) {
      filters.city_id = cityId.trim();
    }

    // Add type as type_id if provided and not "الكل"
    if (type && type.trim() && type !== "الكل") {
      filters.type_id = type.trim();
    }

    // Add search text if provided
    if (searchText && searchText.trim()) {
      filters.search = searchText.trim();
    }

    // Log for debugging
    console.log("🔍 Hero3 Search Form Submit:", {
      status,
      cityId,
      cityName,
      type,
      searchText,
      filters,
    });

    // If search text exists, navigate to /real-estate with search only
    // Advanced search should only send search parameter, no filters or purpose
    if (searchText && searchText.trim()) {
      const params = new URLSearchParams();
      
      // Only add search parameter for advanced search
      if (filters.search) params.set("search", filters.search);
      
      const queryString = params.toString();
      const url = queryString ? `/real-estate?${queryString}` : "/real-estate";
      
      router.push(url);
    } else {
      // Default behavior: navigate to for-rent or for-sale
      // Convert status to transactionType
      let transactionType: "rent" | "sale" = "rent";
      if (status === "للبيع") {
        transactionType = "sale";
      } else if (status === "للإيجار") {
        transactionType = "rent";
      } else {
        // Default to rent if no status selected
        transactionType = "rent";
      }

      // Navigate to the appropriate listing page with filters
      navigateWithFilters(transactionType, filters);
    }
  };

  if (!config?.enabled) return null;

  // Default options based on the HTML code provided - Memoized to prevent re-computation
  const typeOptions = useMemo(() => config.fields?.type?.options || [
    "الكل",
    "شقق",
    "فلل",
    "اراضي",
    "ادوار",
    "عمائر",
    "تاون هاوس",
    "أبراج",
  ], [config.fields?.type?.options]);
  
  const statusOptions = useMemo(() => config.fields?.status?.options || [
    "بيع / ايجار",
    "للبيع",
    "للإيجار",
  ], [config.fields?.status?.options]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full rounded-2xl bg-white p-4 sm:px-6 shadow-lg max-w-6xl overflow-hidden transition-all duration-300 ease-in-out",
        isAdvancedSearchOpen ? "max-h-[200px]" : "max-h-[200px]"
      )}
      aria-label="نموذج البحث عن العقارات"
    >
      {/* Desktop Layout: all in one row */}
      <div className="hidden lg:flex items-end gap-4">
        {!isAdvancedSearchOpen && (
          <>
            {/* Property Type */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <Home className="size-5" style={{ color: iconColor }} />
                <h6 className="text-sm font-medium text-gray-700">نوع العقار</h6>
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger 
                  className="h-12 border border-gray-200 rounded-2xl text-black justify-end text-right [&>svg]:hidden"
                  style={{ color: "black", "--tw-ring-color": iconColor } as React.CSSProperties & { "--tw-ring-color": string }}
                >
                  <SelectValue placeholder={type || "الكل"} />
                </SelectTrigger>
                <SelectContent align="end">
                  {typeOptions.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <MapPin className="size-5" style={{ color: iconColor }} />
                <h6 className="text-sm font-medium text-gray-700">موقع العقار</h6>
              </div>
              <Select
                value={cityId}
                onValueChange={(value) => {
                  setCityId(value);
                  const city = cityOptions.find((c) => c.id.toString() === value);
                  if (city) setCityName(city.name);
                }}
              >
                <SelectTrigger 
                  className="h-12 border border-gray-200 rounded-2xl text-black justify-end text-right [&>svg]:hidden"
                  style={{ color: "black", "--tw-ring-color": iconColor } as React.CSSProperties & { "--tw-ring-color": string }}
                >
                  <SelectValue
                    placeholder={
                      cityLoading
                        ? "جاري التحميل..."
                        : cityName || "اختر المدينة"
                    }
                  />
                </SelectTrigger>
                <SelectContent align="end">
                  {cityLoading ? (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  ) : cityOptions.length === 0 ? (
                    <SelectItem value="no-cities" disabled>
                      لا توجد مدن
                    </SelectItem>
                  ) : (
                    cityOptions.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Property Status */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <Tag className="size-5" style={{ color: iconColor }} />
                <h6 className="text-sm font-medium text-gray-700">حالة العقار</h6>
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger 
                  className="h-12 border border-gray-200 rounded-2xl text-black justify-end text-right [&>svg]:hidden"
                  style={{ color: "black", "--tw-ring-color": iconColor } as React.CSSProperties & { "--tw-ring-color": string }}
                >
                  <SelectValue placeholder={status || "بيع / ايجار"} />
                </SelectTrigger>
                <SelectContent align="end">
                  {statusOptions.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {isAdvancedSearchOpen && (
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Search className="size-5" style={{ color: iconColor }} />
              <h6 className="text-sm font-medium text-gray-700">البحث</h6>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث عن اسم أو صفة العقار"
                className="h-12 border border-gray-200 rounded-2xl text-black text-right pr-10"
                style={{ "--tw-ring-color": iconColor } as React.CSSProperties & { "--tw-ring-color": string }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex flex-col gap-2">
          <div className="flex   flex-col w-full">
          <div className="flex flex-col items-center w-full">
  {/* الزر العلوي: تطبيق البحث */}
  <button
    type="submit"
    style={{ backgroundColor: buttonColor, color: "#ffffff" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = buttonColorHover;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = buttonColor;
    }}
    className="h-12 w-full px-8 rounded-2xl font-medium text-white transition-colors whitespace-nowrap"
  >
    تطبيق البحث
  </button>

  {/* الزر السفلي: بحث متقدم */}
  {advancedButtonEnabled && (
    <button
      type="button"
      onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
      aria-expanded={isAdvancedSearchOpen}
      style={{ backgroundColor: buttonColor, color: "#ffffff" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = buttonColorHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = buttonColor;
      }}
      className="h-8 px-4 rounded-b-2xl rounded-t-none text-[12px] font-medium text-white transition-colors whitespace-nowrap opacity-90 hover:opacity-100"
    >
      {isAdvancedSearchOpen ? "إخفاء البحث المتقدم" : "بحث متقدم"}
    </button>
  )}
</div>
</div>
        </div>
      </div>

      {/* Tablet/Mobile Layout */}
      <div className="grid gap-4 lg:hidden">
        {!isAdvancedSearchOpen && (
          <>
            {/* Property Type */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Home className="size-5" style={{ color: iconColor }} />
                <h6 className="text-sm font-medium text-gray-700">نوع العقار</h6>
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger 
                  className="h-12 border border-gray-200 rounded-2xl text-black justify-end text-right [&>svg]:hidden"
                  style={{ color: "black" }}
                >
                  <SelectValue placeholder={type || "الكل"} />
                </SelectTrigger>
                <SelectContent align="end">
                  {typeOptions.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="size-5" style={{ color: iconColor }} />
                <h6 className="text-sm font-medium text-gray-700">موقع العقار</h6>
              </div>
              <Select
                value={cityId}
                onValueChange={(value) => {
                  setCityId(value);
                  const city = cityOptions.find((c) => c.id.toString() === value);
                  if (city) setCityName(city.name);
                }}
              >
                <SelectTrigger 
                  className="h-12 border border-gray-200 rounded-2xl text-black justify-end text-right [&>svg]:hidden"
                  style={{ color: "black" }}
                >
                  <SelectValue
                    placeholder={
                      cityLoading
                        ? "جاري التحميل..."
                        : cityName || "اختر المدينة"
                    }
                  />
                </SelectTrigger>
                <SelectContent align="end">
                  {cityLoading ? (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  ) : cityOptions.length === 0 ? (
                    <SelectItem value="no-cities" disabled>
                      لا توجد مدن
                    </SelectItem>
                  ) : (
                    cityOptions.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Property Status */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Tag className="size-5" style={{ color: iconColor }} />
                <h6 className="text-sm font-medium text-gray-700">حالة العقار</h6>
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger 
                  className="h-12 border border-gray-200 rounded-2xl text-black justify-end text-right [&>svg]:hidden"
                  style={{ color: "black" }}
                >
                  <SelectValue placeholder={status || "بيع / ايجار"} />
                </SelectTrigger>
                <SelectContent align="end">
                  {statusOptions.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {isAdvancedSearchOpen && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Search className="size-5" style={{ color: iconColor }} />
              <h6 className="text-sm font-medium text-gray-700">البحث</h6>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث عن اسم أو صفة العقار"
                className="h-12 border border-gray-200 rounded-2xl text-black text-right pr-10"
                style={{ "--tw-ring-color": iconColor } as React.CSSProperties & { "--tw-ring-color": string }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex flex-col items-center w-full">
  {/* الزر العلوي: تطبيق البحث */}
  <button
    type="submit"
    style={{ backgroundColor: buttonColor, color: "#ffffff" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = buttonColorHover;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = buttonColor;
    }}
    className="h-12 w-full px-8 rounded-2xl font-medium text-white transition-colors whitespace-nowrap"
  >
    تطبيق البحث
  </button>

  {/* الزر السفلي: بحث متقدم */}
  {advancedButtonEnabled && (
    <button
      type="button"
      onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
      aria-expanded={isAdvancedSearchOpen}
      style={{ backgroundColor: buttonColor, color: "#ffffff" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = buttonColorHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = buttonColor;
      }}
      className="h-6 px-2 rounded-b-2xl rounded-t-none text-[10px] font-medium text-white transition-colors whitespace-nowrap opacity-90 hover:opacity-100"
    >
      {isAdvancedSearchOpen ? "إخفاء البحث المتقدم" : "بحث متقدم"}
    </button>
  )}
</div>
      </div>
    </form>
  );
});

// ═══════════════════════════════════════════════════════════
// COMPONENT - Memoized to prevent unnecessary re-renders
// ═══════════════════════════════════════════════════════════
function Hero3(props: HeroProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "hero3";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const heroStates = useEditorStore((s) => s.heroStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  // ⚠️ REMOVED: fetchTenantData useEffect - causes infinite re-renders
  // Tenant data should be loaded at a higher level, not in component

  // Extract component data from tenantData (memoized to prevent re-computation)
  const tenantComponentData = useMemo(() => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "hero" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "hero" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  }, [tenantData, variantId, props.id]);

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHero3Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHero3Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("hero", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = heroStates[uniqueId];
  const currentStoreData = getComponentData("hero", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER) - Memoized to prevent re-computation
  // ─────────────────────────────────────────────────────────
  const mergedData = useMemo(() => ({
    ...getDefaultHero3Data(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state (from heroStates - saved data)
    ...currentStoreData, // 3. Current store data (from pageComponentsByPage - saved data)
    ...props, // 4. Props (highest priority)
    // Note: tempData is NOT included here - this makes it behave like "height" field
  }), [storeData, currentStoreData, props]);
  
  // ✅ FIX: Get saved searchForm data (from heroStates/pageComponentsByPage, not tempData)
  // This ensures changes only appear after "Save Changes" button is pressed
  const savedSearchForm = useMemo(() => {
    // Priority: storeData > currentStoreData > mergedData.searchForm
    if (storeData?.searchForm) {
      return storeData.searchForm;
    }
    if (currentStoreData?.searchForm) {
      return currentStoreData.searchForm;
    }
    return mergedData.searchForm;
  }, [storeData, currentStoreData, mergedData.searchForm]);

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────

  // Helper function to normalize height values
  const normalizeHeight = (value: string | undefined, fallback: string): string => {
    if (!value) return fallback;
    const trimmed = value.trim();
    // Check if it's a number only (no units like vh, px, %, etc.)
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}vh`;
    }
    // Convert percentage (%) to vh
    if (/^\d+(\.\d+)?%$/.test(trimmed)) {
      return trimmed.replace('%', 'vh');
    }
    // If it already has a unit (vh, px, etc.), return as is
    return trimmed;
  };

  // Normalize height values
  const heightDesktop = normalizeHeight(mergedData.height?.desktop, "90vh");
  const heightTablet = normalizeHeight(mergedData.height?.tablet, heightDesktop);
  const heightMobile = normalizeHeight(mergedData.height?.mobile, heightDesktop);

  // Generate dynamic styles with responsive height
  const sectionStyles = {
    "--hero-height-desktop": heightDesktop,
    "--hero-height-tablet": heightTablet,
    "--hero-height-mobile": heightMobile,
  } as React.CSSProperties;

  const titleStyles = {
    fontFamily: mergedData.content?.font?.title?.family || "Tajawal",
    fontWeight: mergedData.content?.font?.title?.weight || "extrabold",
    color: mergedData.content?.font?.title?.color || "#ffffff",
    lineHeight: mergedData.content?.font?.title?.lineHeight || "1.25",
  };

  const subtitleStyles = {
    fontFamily: mergedData.content?.font?.subtitle?.family || "Tajawal",
    fontWeight: mergedData.content?.font?.subtitle?.weight || "normal",
    color:
      mergedData.content?.font?.subtitle?.color || "rgba(255, 255, 255, 0.85)",
  };

  const overlayStyles = {
    backgroundColor: mergedData.background?.overlay?.color || "#000000",
    opacity: mergedData.background?.overlay?.opacity || "0.45",
  };

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return match ? match[1] : null;
  };

  // Default video URL
  const defaultVideoUrl = "https://youtu.be/ULzl51V38lw?si=iwlRp_cUXmTe50Gc";

  // Use video from data, or fallback to default video
  const videoUrl = mergedData.background?.video || defaultVideoUrl;
  const videoId = getYouTubeVideoId(videoUrl);
  const videoStart = mergedData.background?.videoStart || 0;
  const playOnMobile = mergedData.background?.playOnMobile !== false;
  const privacyMode = mergedData.background?.privacyMode !== false;

  // Build YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    if (!videoId) return "";
    const baseUrl = privacyMode
      ? "https://www.youtube-nocookie.com/embed"
      : "https://www.youtube.com/embed";
    const params = new URLSearchParams({
      controls: "0",
      rel: "0",
      playsinline: "1",
      cc_load_policy: "0",
      enablejsapi: "1",
      origin: typeof window !== "undefined" ? window.location.origin : "",
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: videoId, // Required for loop to work
      start: videoStart.toString(),
    });
    return `${baseUrl}/${videoId}?${params.toString()}`;
  };

  // Note: primaryColor is now handled inside SearchForm component

  // Generate unique ID for style tag to avoid conflicts
  const styleId = `hero3-height-${uniqueId.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${styleId} {
            height: var(--hero-height-mobile);
          }
          @media (min-width: 768px) {
            #${styleId} {
              height: var(--hero-height-tablet);
            }
          }
          @media (min-width: 1024px) {
            #${styleId} {
              height: var(--hero-height-desktop);
            }
          }
        `
      }} />
      <section
        id={styleId}
        className="relative w-full overflow-hidden max-h-[95dvh]"
        style={sectionStyles}
        data-debug="hero-component"
      >
      {/* Background Video */}
      {videoId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src={getYouTubeEmbedUrl()}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100vw",
              height: "56.25vw",
              minHeight: "100vh",
              minWidth: "177.77vh",
              transform: "translate(-50%, -50%)",
              border: "none",
            }}
            title="Background Video"
          />

          {/* Overlay */}
          {mergedData.background?.overlay?.enabled && (
            <div className="absolute inset-0 z-[1]" style={overlayStyles} />
          )}
        </div>
      ) : (
        <>
          <Image
            src={
              mergedData.background?.image ||
              "https://dalel-lovat.vercel.app/images/hero.webp"
            }
            alt={mergedData.background?.alt || "صورة خلفية"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Overlay */}
          {mergedData.background?.overlay?.enabled && (
            <div className="absolute inset-0 z-[1]" style={overlayStyles} />
          )}
        </>
      )}

      {/* Content - Centered in middle */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Desktop/Tablet Layout */}
          <div className="hidden md:flex flex-col items-center text-center text-white">
            {mergedData.showTitle !== false && (
              <h2
                className={cn(
                  "mx-auto text-balance mb-3 font-bold",
                  `text-${mergedData.content?.font?.title?.size?.tablet || "4xl"} md:text-${mergedData.content?.font?.title?.size?.desktop || "5xl"}`,
                  `max-w-${mergedData.content?.maxWidth || "5xl"}`,
                )}
                style={titleStyles}
              >
                {mergedData.content?.title ||
                  "مع باهية... اجعل حلمك السكني استثمارا يدوم"}
              </h2>
            )}
            {mergedData.showSubtitle !== false && (
              <p
                className={cn(
                  "mx-auto mb-6",
                  `text-${mergedData.content?.font?.subtitle?.size?.tablet || "xs"} md:text-${mergedData.content?.font?.subtitle?.size?.desktop || "md"}`,
                  `max-w-${mergedData.content?.maxWidth || "4xl"}`,
                )}
                style={subtitleStyles}
              >
                {mergedData.content?.subtitle ||
                  "في باهية، نرتقي بتجربة العقار عبر رؤية احترافية، وخدمة مصمّمة خصيصًا لتليق بتطلعاتك، لنمنحك حلولًا عقارية متكاملة تُلبي طموحاتك وتحقق استثمارًا يدوم."}
              </p>
            )}
            {/* Hero Search Form for Desktop/Tablet */}
            {mergedData.searchForm?.enabled && (
              <div className="w-full pointer-events-auto flex items-center justify-center">
                <SearchForm
                  config={mergedData.searchForm}
                  savedConfig={savedSearchForm}
                />
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center text-center text-white">
            {mergedData.showTitle !== false && (
              <h2
                className={cn(
                  "mx-auto text-balance mb-3",
                  `text-${mergedData.content?.font?.title?.size?.mobile || "2xl"}`,
                  `max-w-${mergedData.content?.maxWidth || "5xl"}`,
                )}
                style={titleStyles}
              >
                {mergedData.content?.title ||
                  "مع باهية... اجعل حلمك السكني استثمارا يدوم"}
              </h2>
            )}
            {mergedData.showSubtitle !== false && (
              <p
                className={cn(
                  "mx-auto mb-6",
                  `text-${mergedData.content?.font?.subtitle?.size?.mobile || "xs"}`,
                  `max-w-${mergedData.content?.maxWidth || "4xl"}`,
                )}
                style={subtitleStyles}
              >
                {mergedData.content?.subtitle ||
                  "في باهية، نرتقي بتجربة العقار عبر رؤية احترافية، وخدمة مصمّمة خصيصًا لتليق بتطلعاتك، لنمنحك حلولًا عقارية متكاملة تُلبي طموحاتك وتحقق استثمارًا يدوم."}
              </p>
            )}
            {/* Hero Search Form for Mobile */}
            {mergedData.searchForm?.enabled && (
              <div className="w-full px-4 pointer-events-auto">
                <SearchForm
                  config={mergedData.searchForm}
                  savedConfig={savedSearchForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default React.memo(Hero3, (prevProps, nextProps) => {
  // Only re-render if id changes or props actually change
  if (prevProps.id !== nextProps.id) return false;
  
  // Deep comparison for props (excluding functions)
  const prevKeys = Object.keys(prevProps).filter(k => k !== 'id');
  const nextKeys = Object.keys(nextProps).filter(k => k !== 'id');
  
  if (prevKeys.length !== nextKeys.length) return false;
  
  for (const key of prevKeys) {
    if (JSON.stringify(prevProps[key as keyof HeroProps]) !== 
        JSON.stringify(nextProps[key as keyof HeroProps])) {
      return false;
    }
  }
  
  return true; // Props are equal, skip re-render
});
