"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultPropertyFilterData } from "@/context/editorStoreFunctions/propertyFilterFunctions";

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

interface PropertyFilterProps {
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

export default function PropertyFilter({
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
  variant = "propertyFilter1",
  ...props
}: PropertyFilterProps & { content?: any }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "propertyFilter1";
  const uniqueId = id || variantId;

  // Subscribe to editor store updates for this propertyFilter variant
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const propertyFilterStates = useEditorStore((s) => s.propertyFilterStates);

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
  } = usePropertiesStore();

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // Get tenant data from store
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantIdFromStore = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    const finalTenantId = tenantIdFromStore || currentTenantId;
    if (finalTenantId) {
      fetchTenantData(finalTenantId);
    }
  }, [tenantIdFromStore, currentTenantId, fetchTenantData]);

  // Get data from store or content prop with fallback logic
  const storeData = useStore
    ? getComponentData("propertyFilter", uniqueId) || {}
    : {};
  const currentStoreData = useStore ? propertyFilterStates[uniqueId] || {} : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by ID
          // Use componentId === id (most reliable identifier)
          if (
            (component as any).type === "propertyFilter" &&
            (componentId === id ||
              (component as any).id === id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
      // Also handle array format
      if (Array.isArray(pageComponents)) {
        for (const component of pageComponents) {
          // Search by id (most reliable identifier)
          if (
            (component as any).type === "propertyFilter" &&
            ((component as any).id === id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (useStore) {
      // ⭐ CRITICAL: Use getState() directly to avoid dependency issues
      // ensureComponentVariant is stable but including it in deps can cause loops
      const store = useEditorStore.getState();
      
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPropertyFilterData(),
              ...tenantComponentData, // Database data takes priority
              ...content,
              ...props,
            }
          : {
              ...getDefaultPropertyFilterData(),
              ...content,
              ...props,
            };
      store.ensureComponentVariant("propertyFilter", uniqueId, initialData);
    }
    // ⭐ CRITICAL: Only depend on uniqueId and useStore
    // Don't include ensureComponentVariant, tenantComponentData, content, or props to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueId, useStore]);

  // Get default data
  const defaultData = getDefaultPropertyFilterData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data
  const isStoreDataDefault =
    JSON.stringify(currentStoreData) === JSON.stringify(defaultData);

  // Merge content prop with correct priority
  const mergedContent = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...content, // 2. Content props from parent component
    ...props, // 3. Other props
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 4. Backend data (tenant data)
    // Use currentStoreData only if it's not just default data
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 5. Current store data (highest priority if not default)
  };

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

    // Debug: Log only for searchButton.bgColor
    const shouldDebug = fieldPath === "searchButton.bgColor";
    if (shouldDebug) {
      console.group(`🔍 getColor Debug for ${fieldPath}`);
      console.log("Content:", mergedContent);
      console.log("Styling:", styling);
      console.log("Content Styling:", mergedContent?.styling);
      console.log("SearchButton:", styling?.searchButton);
      console.log("SearchButton BgColor:", styling?.searchButton?.bgColor);
      console.log("Store Data:", storeData);
      console.log("Use Store:", useStore);
      console.groupEnd();
    }

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
    // These are stored separately: styling.searchButton.bgColor.useDefaultColor
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

    // Debug: Log the field data only for searchButton.bgColor
    if (shouldDebug) {
      console.group(`🎨 getColor for ${fieldPath}`);
      console.log("Field Data:", fieldData);
      console.log("Use Default Color Value:", useDefaultColorValue);
      console.log("Global Color Type Value:", globalColorTypeValue);
      console.log("Type:", typeof fieldData);
      console.log("Is String:", typeof fieldData === "string");
      console.log(
        "Is Object:",
        typeof fieldData === "object" && fieldData !== null,
      );
      console.log("Styling:", styling);
      console.log("Content:", mergedContent);
      console.groupEnd();
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
      if (shouldDebug) {
        console.log(
          `✅ Using branding color (${globalColorType}): ${brandingColor}`,
        );
      }
      return brandingColor;
    }

    // If useDefaultColor is false, try to get custom color
    // The color might be stored directly as string or in a value property of an object
    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      if (shouldDebug) {
        console.log(`✅ Using custom color (string): ${fieldData}`);
      }
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
        if (shouldDebug) {
          console.log(`✅ Using custom color (from value): ${fieldData.value}`);
        }
        return fieldData.value;
      }
      // If object has useDefaultColor but no value, it means the color was lost
      // This shouldn't happen, but we'll log it for debugging
      if (
        shouldDebug &&
        fieldData.useDefaultColor === false &&
        !fieldData.value
      ) {
        console.warn(
          `⚠️ Color object has useDefaultColor=false but no value property`,
        );
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
    if (shouldDebug) {
      console.log(
        `⚠️ Using fallback branding color (${defaultGlobalColorType}): ${brandingColor}`,
      );
    }
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
  // Uses WCAG luminance formula to determine if background is light or dark
  const getContrastTextColor = (backgroundColor: string): string => {
    if (!backgroundColor || !backgroundColor.startsWith("#")) return "#ffffff";
    const cleanHex = backgroundColor.replace("#", "");
    if (cleanHex.length !== 6) return "#ffffff";

    // Parse RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Calculate relative luminance using WCAG formula
    // https://www.w3.org/WAI/GL/wiki/Relative_luminance
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
  // Always calculate text color from background color (black or white) - ignore custom text color
  const searchButtonTextColor = getContrastTextColor(searchButtonBgColor);
  const searchButtonHoverBgColor = getColor(
    "searchButton.hoverBgColor",
    getDarkerColor(searchButtonBgColor, 20),
  );
  // Always calculate hover text color from hover background color
  const searchButtonHoverTextColor = getContrastTextColor(
    searchButtonHoverBgColor,
  );

  // Get colors for inputs
  const inputTextColor = getColor("inputs.textColor", "#1f2937");

  // Get colors for dropdown
  const dropdownTextColor = getColor("dropdown.textColor", "#1f2937");
  const dropdownHoverBgColor = getColor("dropdown.hoverBgColor", "#f3f4f6");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]); // تغيير إلى PropertyType[]
  const [filteredTypes, setFilteredTypes] = useState<PropertyType[]>([]); // تغيير إلى PropertyType[]
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
        // Example: https://taearif.com/api/v1/tenant-website/kkkkk/properties/categories/direct
        // Becomes: /v1/tenant-website/kkkkk/properties/categories/direct
        const apiMatch = apiUrl.match(/\/api(\/.*)/);

        if (apiMatch && apiMatch[1]) {
          // Construct new URL: backend URL + path
          apiUrl = backendUrl + apiMatch[1];
        }

        console.log("🔗 Property Types API URL:", apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          // استخدام البيانات كاملة مع الـ IDs
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
        // استخدام القائمة الافتراضية كـ fallback - تحويل إلى PropertyType format
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
      // في حالة الخطأ، استخدم القائمة الافتراضية - تحويل إلى PropertyType format
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
    // لا نجلب البيانات إذا كان tenantId لا يزال يتم تحميله
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
      // تحويل إلى PropertyType format
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
    console.log("Property type selected:", { name: type.name, id: type.id }); // Debug
    setIsDropdownOpen(false);
    // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
  };

  return (
    <div className={`mb-6 md:mb-18 ${className || ""} max-w-[1600px] mx-auto`}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xs:grid-cols-2 md:flex flex-col md:flex-row mt-4 bg-white rounded-[10px] gap-x-5 md:gap-x-5 gap-y-4 p-4 "
      >
        {/* البحث عن المدينة */}
        <div
          className="py-2 w-full md:w-[32.32%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]"
          ref={cityDropdownRef}
        >
          <div
            className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
            onClick={() => setIsCityOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={isCityOpen}
          >
            <span className="text-gray-900 text-xs xs:text-base md:text-lg">
              {search || searchPlaceholder}
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
                cityOptions.map((c) => (
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
                      setIsCityOpen(false);
                    }}
                  >
                    {c.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* الحي السكني */}
        <div
          className="py-2 w-full md:w-[23.86%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]"
          ref={districtDropdownRef}
        >
          <div
            className={`w-full h-full flex items-center justify-between px-2 cursor-pointer select-none ${!search ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => search && setIsDistrictOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={isDistrictOpen}
          >
            <span className="text-gray-900 text-xs xs:text-base md:text-lg">
              {district
                ? districtOptions.find((d) => d.id.toString() === district)
                    ?.name || district
                : "اختر الحي السكني"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          {isDistrictOpen && search && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
              {districtLoading ? (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                  جاري تحميل الأحياء...
                </div>
              ) : districtError ? (
                <div className="px-4 py-3 text-red-500 text-sm md:text-base text-center">
                  {districtError}
                </div>
              ) : districtOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                  لا توجد أحياء متاحة
                </div>
              ) : (
                districtOptions.map((d) => (
                  <div
                    key={String(d.id)}
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
                      setDistrict(d.id.toString()); // حفظ state_id بدلاً من الاسم
                      setIsDistrictOpen(false);
                    }}
                  >
                    {d.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* نوع العقار */}
        <div
          className="py-2 w-full md:w-[23.86%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]"
          ref={dropdownRef}
        >
          <div
            className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
            onClick={() => setIsDropdownOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span className="text-gray-900 text-xs xs:text-base md:text-lg">
              {propertyType || propertyTypePlaceholder}
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
                filteredTypes.map((type) => (
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
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base">
                  {noResultsText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* السعر */}
        <div className="w-full md:w-[23.86%] h-12 relative flex items-center justify-center py-2 border border-gray-200 md:h-14 rounded-[10px]">
          <Input
            placeholder={pricePlaceholder}
            value={price}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setPrice(v);
                return;
              }
              const n = Number(v);
              if (Number.isNaN(n)) return;
              const finalPrice = String(n >= 0 ? n : 0);
              setPrice(finalPrice);
              // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
            }}
            className="w-full h-full outline-none pr-2 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border-0 focus-visible:ring-0"
            style={{ color: inputTextColor }}
            type="number"
            min={0}
            inputMode="numeric"
            name="price"
          />
        </div>

        {/* زر البحث */}
        <div className="w-full md:w-[15.18%] h-full relative">
          <Button
            type="submit"
            variant="ghost"
            className="text-xs xs:text-base md:text-lg flex items-center justify-center w-full h-12 md:h-14 rounded-[10px] transition-colors"
            style={{
              backgroundColor: searchButtonBgColor,
              color: searchButtonTextColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = searchButtonHoverBgColor;
              e.currentTarget.style.color = searchButtonHoverTextColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = searchButtonBgColor;
              e.currentTarget.style.color = searchButtonTextColor;
            }}
          >
            {searchButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
