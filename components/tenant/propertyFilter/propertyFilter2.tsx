"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";

// القائمة الافتراضية لأنواع العقارات (تُستخدم كـ fallback)
const defaultPropertyTypes = [
  "مزرعة",
  "دور",
  "ارض سكن",
  "بيت",
  "شقة ارضيه",
  "شقة علويه",
  "أرض زراعية",
  "أرض استراحة",
  "استراحة",
  "فلة غير مكتملة",
  "أرض تجارية",
];

interface PropertyType {
  id: number;
  name: string;
}

interface CityOption {
  id: string | number;
  name: string;
}

interface DistrictOption {
  id: string | number;
  name: string;
}

interface PropertyFilter2Props {
  className?: string;
  propertyTypesSource?: "static" | "dynamic";
  propertyTypes?: string[];
  propertyTypesApiUrl?: string;
  tenantId?: string;
  searchPlaceholder?: string;
  propertyTypePlaceholder?: string;
  pricePlaceholder?: string;
  searchButtonText?: string;
  noResultsText?: string;
  useStore?: boolean;
  id?: string;
  variant?: string;
}

export default function PropertyFilter2({
  className,
  propertyTypesSource = "static",
  propertyTypes: staticPropertyTypes = defaultPropertyTypes,
  propertyTypesApiUrl,
  tenantId,
  searchPlaceholder = "أدخل المدينة أو المنطقة",
  propertyTypePlaceholder = "نوع العقار",
  pricePlaceholder = "السعر",
  searchButtonText = "بحث",
  noResultsText = "لم يتم العثور على نتائج.",
  content, // البيانات من backend
  useStore = false,
  id,
  variant = "propertyFilter2",
  ...props
}: PropertyFilter2Props & { content?: any }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "propertyFilter2";
  const uniqueId = id || variantId;

  // Subscribe to editor store updates for this propertyFilter variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const propertyFilterStates = useEditorStore((s) => s.propertyFilterStates);

  useEffect(() => {
    if (useStore) {
      ensureComponentVariant("propertyFilter", uniqueId, props);
    }
  }, [uniqueId, useStore, ensureComponentVariant]);

  // Store state
  const {
    search,
    cityId,
    district,
    propertyType,
    categoryId,
    price,
    setSearch,
    setCityId,
    setDistrict,
    setPropertyType,
    setCategoryId,
    setPrice,
    setTransactionType,
  } = usePropertiesStore();

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // Get tenant data from store
  const { tenantData } = useTenantStore();

  // Get data from store or content prop with fallback logic
  const storeData = useStore
    ? getComponentData("propertyFilter", uniqueId) || {}
    : {};
  const currentStoreData = useStore ? propertyFilterStates[uniqueId] || {} : {};

  // Merge content prop with store data (store data takes priority)
  const mergedContent =
    useStore && storeData && Object.keys(storeData).length > 0
      ? { ...content, ...storeData }
      : content;

  // Get branding colors from WebsiteLayout (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#059669", // emerald-600 default (fallback)
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#059669", // fallback to primary
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#059669", // fallback to primary
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedContent (which includes store data)
    const styling = mergedContent?.styling || {};

    // Navigate to the field using the path (e.g., "searchButton.bgColor")
    const pathParts = fieldPath.split(".");
    let fieldData = styling;
    for (const part of pathParts) {
      if (
        fieldData &&
        typeof fieldData === "object" &&
        !Array.isArray(fieldData)
      ) {
        fieldData = fieldData[part];
      } else {
        fieldData = undefined;
        break;
      }
    }

    // Also check for useDefaultColor and globalColorType at the same path level
    const useDefaultColorPath = `${fieldPath}.useDefaultColor`;
    const globalColorTypePath = `${fieldPath}.globalColorType`;
    const useDefaultColorPathParts = useDefaultColorPath.split(".");
    let useDefaultColorValue = styling;
    for (const part of useDefaultColorPathParts) {
      if (
        useDefaultColorValue &&
        typeof useDefaultColorValue === "object" &&
        !Array.isArray(useDefaultColorValue)
      ) {
        useDefaultColorValue = useDefaultColorValue[part];
      } else {
        useDefaultColorValue = undefined;
        break;
      }
    }

    const globalColorTypePathParts = globalColorTypePath.split(".");
    let globalColorTypeValue = styling;
    for (const part of globalColorTypePathParts) {
      if (
        globalColorTypeValue &&
        typeof globalColorTypeValue === "object" &&
        !Array.isArray(globalColorTypeValue)
      ) {
        globalColorTypeValue = globalColorTypeValue[part];
      } else {
        globalColorTypeValue = undefined;
        break;
      }
    }

    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor =
      useDefaultColorValue !== undefined ? useDefaultColorValue : true;

    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      // Determine default globalColorType based on field path if not set
      let defaultGlobalColorType = "primary";
      if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("Button") ||
        fieldPath.includes("button") ||
        fieldPath.includes("hoverBgColor")
      ) {
        defaultGlobalColorType = "primary";
      }

      const globalColorType = globalColorTypeValue || defaultGlobalColorType;
      const brandingColor =
        brandingColors[globalColorType as keyof typeof brandingColors] ||
        defaultColor;
      return brandingColor;
    }

    // If useDefaultColor is false, try to get custom color
    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      return fieldData;
    }

    // If fieldData is an object, check for value property
    if (
      fieldData &&
      typeof fieldData === "object" &&
      !Array.isArray(fieldData)
    ) {
      if (
        fieldData.value &&
        typeof fieldData.value === "string" &&
        fieldData.value.startsWith("#")
      ) {
        return fieldData.value;
      }
    }

    // Final fallback: use default branding color
    let defaultGlobalColorType = "primary";
    if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // emerald-700 in Tailwind = #047857 (fallback)
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

  // Helper function to get contrast text color (black or white) based on background color
  const getContrastTextColor = (backgroundColor: string): string => {
    if (!backgroundColor || !backgroundColor.startsWith("#")) return "#ffffff";
    const cleanHex = backgroundColor.replace("#", "");
    if (cleanHex.length !== 6) return "#ffffff";

    // Parse RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Calculate relative luminance using WCAG formula
    const getLuminance = (value: number): number => {
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };

    const luminance =
      0.2126 * getLuminance(r) +
      0.7152 * getLuminance(g) +
      0.0722 * getLuminance(b);

    // If luminance is less than 0.5, use white text, otherwise use black text
    return luminance < 0.5 ? "#ffffff" : "#000000";
  };

  // Get colors for search button
  const searchButtonBgColor = getColor("searchButton.bgColor", "#059669");
  const searchButtonTextColor = getContrastTextColor(searchButtonBgColor);
  const searchButtonHoverBgColor = getColor(
    "searchButton.hoverBgColor",
    getDarkerColor(searchButtonBgColor, 20),
  );
  const searchButtonHoverTextColor = getContrastTextColor(
    searchButtonHoverBgColor,
  );

  // Get colors for inputs
  const inputTextColor = getColor("inputs.textColor", "#1f2937");

  // Get colors for dropdown
  const dropdownTextColor = getColor("dropdown.textColor", "#1f2937");
  const dropdownHoverBgColor = getColor("dropdown.hoverBgColor", "#f3f4f6");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // استخراج البيانات من mergedContent إذا كانت متاحة
  const actualPropertyTypesSource =
    mergedContent?.propertyTypesSource || propertyTypesSource;
  const actualPropertyTypesApiUrl =
    mergedContent?.propertyTypesApiUrl || propertyTypesApiUrl;
  const actualTenantId = mergedContent?.tenantId || tenantId || currentTenantId;
  const actualStaticPropertyTypes =
    mergedContent?.propertyTypes || staticPropertyTypes;

  // Cities state fetched from external API
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [cityLoading, setCityLoading] = useState<boolean>(false);
  const [cityError, setCityError] = useState<string | null>(null);

  // Districts state fetched from external API
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [districtLoading, setDistrictLoading] = useState<boolean>(false);
  const [districtError, setDistrictError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        setCityLoading(true);
        setCityError(null);
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
        if (isMounted) setCityError(e?.message || "تعذر تحميل المدن");
      } finally {
        if (isMounted) setCityLoading(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // جلب الأحياء عند اختيار مدينة
  useEffect(() => {
    let isMounted = true;
    const fetchDistricts = async () => {
      if (!search) {
        setDistrictOptions([]);
        setDistrict("");
        return;
      }

      try {
        setDistrictLoading(true);
        setDistrictError(null);

        // البحث عن city_id للمدينة المختارة
        const selectedCity = cityOptions.find((city) => city.name === search);
        if (!selectedCity) {
          setDistrictOptions([]);
          setDistrict("");
          setCityId("");
          return;
        }

        const res = await fetch(
          `https://nzl-backend.com/api/districts?city_id=${selectedCity.id}`,
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
          setDistrict(""); // مسح الحي المختار عند تغيير المدينة
          setCityId(selectedCity.id.toString()); // حفظ city_id
        }
      } catch (e: any) {
        if (isMounted) setDistrictError(e?.message || "تعذر تحميل الأحياء");
      } finally {
        if (isMounted) setDistrictLoading(false);
      }
    };
    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [search, cityOptions]);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const districtDropdownRef = useRef<HTMLDivElement>(null);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  // دالة لجلب أنواع العقارات من API أو استخدام القائمة الثابتة
  const fetchPropertyTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      if (
        actualPropertyTypesSource === "dynamic" &&
        actualPropertyTypesApiUrl &&
        actualTenantId
      ) {
        // جلب البيانات من API
        let apiUrl = actualPropertyTypesApiUrl.replace(
          /\{[^}]*\}/g,
          actualTenantId,
        );

        // Use backend URL from environment variable
        const backendUrl =
          process.env.NEXT_PUBLIC_Backend_URL || "https://api.taearif.com/api";

        // Extract path after /api from the original URL
        const apiMatch = apiUrl.match(/\/api(\/.*)/);

        if (apiMatch && apiMatch[1]) {
          // Construct new URL: backend URL + path
          apiUrl = backendUrl + apiMatch[1];
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setPropertyTypes(data.data);
          setFilteredTypes(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } else if (
        actualPropertyTypesSource === "static" &&
        actualStaticPropertyTypes?.length > 0
      ) {
        // استخدام القائمة الثابتة - تحويل إلى PropertyType format
        const staticTypes = actualStaticPropertyTypes.map(
          (name: string, index: number) => ({
            id: index + 1,
            name: name,
          }),
        );
        setPropertyTypes(staticTypes);
        setFilteredTypes(staticTypes);
      } else {
        // استخدام القائمة الافتراضية كـ fallback
        const defaultTypes = defaultPropertyTypes.map(
          (name: string, index: number) => ({
            id: index + 1,
            name: name,
          }),
        );
        setPropertyTypes(defaultTypes);
        setFilteredTypes(defaultTypes);
      }
    } catch (err) {
      console.error("Error fetching property types:", err);
      setError(
        err instanceof Error ? err.message : "حدث خطأ في جلب أنواع العقارات",
      );
      // في حالة الخطأ، استخدم القائمة الافتراضية
      const defaultTypes = defaultPropertyTypes.map(
        (name: string, index: number) => ({
          id: index + 1,
          name: name,
        }),
      );
      setPropertyTypes(defaultTypes);
      setFilteredTypes(defaultTypes);
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    if (actualPropertyTypesSource === "dynamic" && tenantLoading) {
      return;
    }
    fetchPropertyTypes();
  }, [
    actualPropertyTypesSource,
    actualPropertyTypesApiUrl,
    actualTenantId,
    tenantLoading,
  ]);

  // تحديث البيانات عند تغيير currentTenantId
  useEffect(() => {
    if (currentTenantId && actualPropertyTypesSource === "dynamic") {
      fetchPropertyTypes();
    }
  }, [currentTenantId]);

  // تحديث البيانات عند تغيير content
  useEffect(() => {
    if (content) {
      fetchPropertyTypes();
    }
  }, [content]);

  // تحديث البيانات عند تغيير staticPropertyTypes
  useEffect(() => {
    if (
      actualPropertyTypesSource === "static" &&
      actualStaticPropertyTypes?.length > 0
    ) {
      const staticTypes = actualStaticPropertyTypes.map(
        (name: string, index: number) => ({
          id: index + 1,
          name: name,
        }),
      );
      setPropertyTypes(staticTypes);
      setFilteredTypes(staticTypes);
    }
  }, [actualStaticPropertyTypes, actualPropertyTypesSource]);

  // تحديث الفلتر عند تغيير propertyTypes
  useEffect(() => {
    setFilteredTypes(propertyTypes);
  }, [propertyTypes]);

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
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
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // جلب البيانات من API عند الضغط على submit
    const { fetchProperties } = usePropertiesStore.getState();
    fetchProperties(1);
  };

  const handleTypeSelect = (type: PropertyType) => {
    setPropertyType(type.name); // حفظ الاسم للعرض
    setCategoryId(type.id.toString()); // حفظ الـ ID للـ API
    setIsDropdownOpen(false);
  };

  // State for property status filter
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusOptions = [
    { value: "", label: "بيع / ايجار" },
    { value: "للبيع", label: "للبيع" },
    { value: "للإيجار", label: "للإيجار" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("");

  // Update transactionType when status changes
  useEffect(() => {
    if (selectedStatus === "للبيع") {
      setTransactionType("sale");
    } else if (selectedStatus === "للإيجار") {
      setTransactionType("rent");
    }
  }, [selectedStatus, setTransactionType]);

  return (
    <div className={` ${className || ""} max-w-[1600px] mx-auto`}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mt-4 bg-white rounded-2xl items-center justify-center"
      >
        {/* نوع العقار */}
        <div className="w-[240px] flex flex-col gap-2">
          {/* Icon and Title */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              className="flex-shrink-0"
            >
              <path
                fill="#896042"
                d="M17.95 19.5h0.825v-2.75h2.75v-0.825h-2.75v-2.75H17.95v2.75h-2.75v0.825h2.75V19.5Zm0.3625 1.5c-1.29165 0 -2.39585 -0.4625 -3.3125 -1.3875 -0.91665 -0.925 -1.375 -2.02085 -1.375 -3.2875 0 -1.30715 0.45825 -2.4215 1.37475 -3.343 0.9165 -0.92135 2.0249 -1.382 3.32525 -1.382 1.28335 0 2.3875 0.46065 3.3125 1.382 0.925 0.9215 1.3875 2.03585 1.3875 3.343 0 1.26665 -0.4625 2.3625 -1.3875 3.2875 -0.925 0.925 -2.03335 1.3875 -3.325 1.3875ZM4 19V7L12 1l8 6v3.35c-0.23335 -0.08335 -0.475 -0.14165 -0.725 -0.175 -0.25 -0.03335 -0.50835 -0.05835 -0.775 -0.075v-2.35L12 2.875 5.5 7.75V17.5h6.75c0.04335 0.264 0.10835 0.52165 0.195 0.773 0.08665 0.25135 0.18835 0.49365 0.305 0.727H4Z"
                strokeWidth="0.5"
              />
            </svg>
            <h6 className="text-sm font-medium text-gray-900">نوع العقار</h6>
          </div>
          {/* Dropdown */}
          <div
            className="relative flex items-center justify-center h-12 md:h-14"
            ref={dropdownRef}
          >
            <div
              className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
              onClick={() => setIsDropdownOpen((p) => !p)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className="text-gray-900 text-sm md:text-base">
                {propertyType || "الكل"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
                {loading ? (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                    جاري التحميل...
                  </div>
                ) : error ? (
                  <div className="px-4 py-3 text-red-500 text-sm md:text-base text-center">
                    {error}
                  </div>
                ) : propertyTypes.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                    لا توجد أنواع عقارات متاحة
                  </div>
                ) : filteredTypes.length > 0 ? (
                  <>
                    <div
                      className="px-4 py-3 cursor-pointer text-sm md:text-base transition-colors"
                      style={{
                        color: dropdownTextColor,
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          dropdownHoverBgColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      role="option"
                      onClick={() => {
                        setPropertyType("");
                        setCategoryId("");
                        setIsDropdownOpen(false);
                      }}
                    >
                      الكل
                    </div>
                    {filteredTypes.map((type) => (
                      <div
                        key={type.id}
                        className="px-4 py-3 cursor-pointer text-sm md:text-base transition-colors"
                        style={{
                          color: dropdownTextColor,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            dropdownHoverBgColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        role="option"
                        onClick={() => handleTypeSelect(type)}
                      >
                        {type.name}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base">
                    {noResultsText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* موقع العقار */}
        <div className="w-[240px] flex flex-col gap-2">
          {/* Icon and Title */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              className="flex-shrink-0"
            >
              <path
                fill="#896042"
                d="M12.00225 11.75c0.48185 0 0.8936 -0.1716 1.23525 -0.51475 0.34165 -0.34315 0.5125 -0.75565 0.5125 -1.2375s-0.1716 -0.8936 -0.51475 -1.23525c-0.34315 -0.34165 -0.75565 -0.5125 -1.2375 -0.5125s-0.8936 0.1716 -1.23525 0.51475c-0.34165 0.34315 -0.5125 0.75565 -0.5125 1.2375s0.1716 0.8936 0.51475 1.23525c0.34315 0.34165 0.75565 0.5125 1.2375 0.5125ZM12 20.025c2.21665 -2.01665 3.85415 -3.84585 4.9125 -5.4875C17.97085 12.89585 18.5 11.45 18.5 10.2c0 -1.96315 -0.6274 -3.57065 -1.88225 -4.8225C15.3629 4.125835 13.82365 3.5 12 3.5c-1.82365 0 -3.3629 0.625835 -4.61775 1.8775C6.1274 6.62935 5.5 8.23685 5.5 10.2c0 1.25 0.54165 2.69585 1.625 4.3375 1.08335 1.64165 2.70835 3.47085 4.875 5.4875ZM12 22c-2.68335 -2.28335 -4.6875 -4.40415 -6.0125 -6.3625C4.6625 13.67915 4 11.86665 4 10.2c0 -2.5 0.804165 -4.49165 2.4125 -5.975C8.02085 2.741665 9.88335 2 12 2c2.11665 0 3.97915 0.741665 5.5875 2.225C19.19585 5.70835 20 7.7 20 10.2c0 1.66665 -0.6625 3.47915 -1.9875 5.4375C16.6875 17.59585 14.68335 19.71665 12 22Z"
                strokeWidth="0.5"
              />
            </svg>
            <h6 className="text-sm font-medium text-gray-900">موقع العقار</h6>
          </div>
          {/* Dropdown */}
          <div
            className="relative flex items-center justify-center h-12 md:h-14"
            ref={cityDropdownRef}
          >
            <div
              className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
              onClick={() => setIsCityOpen((p) => !p)}
              aria-haspopup="listbox"
              aria-expanded={isCityOpen}
            >
              <span className="text-gray-900 text-sm md:text-base">
                {search || "اختر المدينة"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            {isCityOpen && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
                {cityLoading ? (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                    جاري تحميل المدن...
                  </div>
                ) : cityError ? (
                  <div className="px-4 py-3 text-red-500 text-sm md:text-base text-center">
                    {cityError}
                  </div>
                ) : cityOptions.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                    لا توجد مدن متاحة
                  </div>
                ) : (
                  <>
                    <div
                      className="px-4 py-3 cursor-pointer text-sm md:text-base transition-colors"
                      style={{
                        color: dropdownTextColor,
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          dropdownHoverBgColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      role="option"
                      onClick={() => {
                        setSearch("");
                        setCityId("");
                        setIsCityOpen(false);
                      }}
                    >
                      اختر المدينة
                    </div>
                    {cityOptions.map((c) => (
                      <div
                        key={String(c.id)}
                        className="px-4 py-3 cursor-pointer text-sm md:text-base transition-colors"
                        style={{
                          color: dropdownTextColor,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            dropdownHoverBgColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        role="option"
                        onClick={() => {
                          setSearch(c.name);
                          setCityId(c.id.toString());
                          setIsCityOpen(false);
                        }}
                      >
                        {c.name}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* حالة العقار */}
        <div className="w-[240px] flex flex-col gap-2">
          {/* Icon and Title */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              className="flex-shrink-0"
            >
              <path
                fill="#896042"
                d="m21.575 13.9 -7.65 7.675c-0.15 0.14165 -0.31875 0.2479 -0.50625 0.31875 -0.1875 0.07085 -0.375 0.10625 -0.5625 0.10625s-0.3729 -0.0375 -0.55625 -0.1125c-0.18335 -0.075 -0.35 -0.17915 -0.5 -0.3125L2.45 12.2c-0.133335 -0.13335 -0.241665 -0.29135 -0.325 -0.474 -0.083335 -0.1825 -0.125 -0.3745 -0.125 -0.576V3.5c0 -0.4125 0.146915 -0.765665 0.44075 -1.0595C2.734415 2.146835 3.0875 2 3.5 2h7.675c0.20115 0 0.3961 0.040585 0.58475 0.12175 0.1885 0.081335 0.3519 0.19075 0.49025 0.32825l9.325 9.325c0.1565 0.15 0.27065 0.31875 0.3425 0.50625 0.07165 0.1875 0.1075 0.375 0.1075 0.5625s-0.0375 0.3771 -0.1125 0.56875c-0.075 0.19165 -0.1875 0.35415 -0.3375 0.4875ZM12.9 20.55l7.65 -7.675L11.175 3.5H3.5v7.6l9.4 9.45ZM6.125 7.4c0.35 0 0.65415 -0.12915 0.9125 -0.3875 0.25835 -0.25835 0.3875 -0.5625 0.3875 -0.9125s-0.12915 -0.65415 -0.3875 -0.9125c-0.25835 -0.258335 -0.5625 -0.3875 -0.9125 -0.3875s-0.65415 0.129165 -0.9125 0.3875c-0.258335 0.25835 -0.3875 0.5625 -0.3875 0.9125s0.129165 0.65415 0.3875 0.9125c0.25835 0.25835 0.5625 0.3875 0.9125 0.3875Z"
                strokeWidth="0.5"
              />
            </svg>
            <h6 className="text-sm font-medium text-gray-900">حالة العقار</h6>
          </div>
          {/* Dropdown */}
          <div
            className="relative flex items-center justify-center h-12 md:h-14"
            ref={statusDropdownRef}
          >
            <div
              className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
              onClick={() => setIsStatusOpen((p) => !p)}
              aria-haspopup="listbox"
              aria-expanded={isStatusOpen}
            >
              <span className="text-gray-900 text-sm md:text-base">
                {selectedStatus
                  ? statusOptions.find((s) => s.value === selectedStatus)
                      ?.label || "بيع / ايجار"
                  : "بيع / ايجار"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            {isStatusOpen && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-3 cursor-pointer text-sm md:text-base transition-colors"
                    style={{
                      color: dropdownTextColor,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        dropdownHoverBgColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    role="option"
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setIsStatusOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* زر البحث */}
        <div className="flex items-end">
          <Button
            type="submit"
            variant="ghost"
            className="text-sm md:text-base flex items-center justify-center h-12 md:h-14 px-6 rounded-[10px] transition-colors whitespace-nowrap"
            style={{
              backgroundColor: "#896042",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7a5235";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#896042";
            }}
          >
            {searchButtonText || "تطبيق البحث"}
          </Button>
        </div>
      </form>
    </div>
  );
}
