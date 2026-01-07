"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultPropertiesShowcaseData } from "@/context/editorStoreFunctions/propertiesShowcaseFunctions";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Property {
  ThemeTwo?: string;
  id: string;
  image: string;
  title: string;
  city: string;
  district: string;
  status: string;
  area: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  rooms: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  units: number;
  floors: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  price: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  bathrooms?: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  featured?: boolean;
  url?: string;
}

interface PropertiesShowcaseProps {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    ThemeTwo?: string;
    maxWidth?: string;
    columns?: {
      ThemeTwo?: string;
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    gap?: string;
    padding?: {
      ThemeTwo?: string;
      top?: string;
      bottom?: string;
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    loadMoreButtonText?: string;
    viewAllButtonText?: string;
    cardType?: "card1" | "card2";
  };
  properties?: Property[];
  styling?: {
    ThemeTwo?: string;
    backgroundColor?: string;
    titleColor?: string;
    dividerColor?: string;
    viewAllButtonColor?: string;
    viewAllButtonHoverColor?: string;
    loadMoreButtonColor?: string;
    loadMoreButtonHoverColor?: string;
    loadMoreButtonTextColor?: string;
    loadMoreButtonHoverTextColor?: string;
  };
  typography?: {
    ThemeTwo?: string;
    title?: {
      ThemeTwo?: string;
      fontSize?: {
        ThemeTwo?: string;
        mobile?: string;
        tablet?: string;
        desktop?: string;
      };
      fontWeight?: string;
      fontFamily?: string;
    };
  };
  responsive?: {
    ThemeTwo?: string;
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
    desktopBreakpoint?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
  dataSource?: {
    apiUrl?: string;
    enabled?: boolean;
  };
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

// Helper function to convert old API URLs to new format
const convertLegacyApiUrl = (url: string, tenantId: string): string => {
  if (url === "/api/properties/latestSales") {
    return `/v1/tenant-website/${tenantId}/properties?purpose=sale&latest=1&limit=10`;
  } else if (url === "/api/properties/latestRentals") {
    return `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`;
  } else if (url === "/api/projects/latestProjects") {
    return `/v1/tenant-website/${tenantId}/projects?featured=1&limit=10`;
  }
  // If it's already the new format with placeholder, replace tenantId
  return url.replace("{tenantId}", tenantId);
};

// Helper function to parse price string to number
const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    // Remove currency symbols and spaces, extract numbers
    const cleaned = price.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper function to parse area string to number
const parseArea = (area: string | number | undefined): number => {
  if (typeof area === "number") return area;
  if (typeof area === "string") {
    // Remove units and spaces, extract numbers
    const cleaned = area.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper function to convert API property to PropertiesShowcase format
const convertApiPropertyToShowcaseFormat = (property: any): Property => {
  // Parse price - handle both string and number formats
  const priceValue = property.price || property.priceRange || "0";
  const priceNum = parsePrice(priceValue);

  // Parse area - handle both string and number formats
  const areaValue = property.area || property.size || "0";
  const areaNum = parseArea(areaValue);

  // Parse bedrooms/rooms
  const bedrooms = property.bedrooms || property.rooms || 0;
  const bathrooms = property.bathrooms || 0;

  // Parse location
  const city =
    property.city ||
    property.location?.city ||
    property.address?.city ||
    "غير محدد";
  const district =
    property.district ||
    property.location?.district ||
    property.address?.district ||
    property.location?.address ||
    "غير محدد";

  // Parse status
  const status =
    property.status || property.transactionType === "rent"
      ? "للإيجار"
      : property.transactionType === "sale"
        ? "للبيع"
        : "غير محدد";

  // Parse floors - try to extract from property data
  const floorsMin = property.floors?.min || property.minFloors || 1;
  const floorsMax =
    property.floors?.max || property.maxFloors || property.floors || 1;

  // Parse units - for properties, usually 1, but can be extracted from data
  const units = property.units || 1;

  const propertyId = property.id || property.slug || String(Date.now());
  const propertySlug = property.slug || property.id || String(Date.now());

  return {
    ThemeTwo: "property",
    id: propertyId,
    image: property.image || property.images?.[0] || "",
    title: property.title || "عقار",
    city: city,
    district: district,
    status: status,
    area: {
      ThemeTwo: "area",
      min: areaNum > 0 ? areaNum : 100,
      max: areaNum > 0 ? areaNum : 200,
    },
    rooms: {
      ThemeTwo: "rooms",
      min: bedrooms > 0 ? bedrooms : 2,
      max: bedrooms > 0 ? bedrooms : 4,
    },
    units: units,
    floors: {
      ThemeTwo: "floors",
      min: floorsMin,
      max: floorsMax,
    },
    price: {
      ThemeTwo: "price",
      min: priceNum > 0 ? priceNum : 100000,
      max: priceNum > 0 ? priceNum : 500000,
    },
    bathrooms: {
      ThemeTwo: "bathrooms",
      min: bathrooms > 0 ? bathrooms : 1,
      max: bathrooms > 0 ? bathrooms : 2,
    },
    featured: property.featured || false,
    url: `/property/${propertySlug}`,
  };
};

// Helper function to convert API project to PropertiesShowcase format
const convertApiProjectToShowcaseFormat = (project: any): Property => {
  // Parse price - projects usually have minPrice and maxPrice
  const minPrice = parsePrice(project.minPrice);
  const maxPrice = parsePrice(project.maxPrice);

  // Parse area - projects might have area range
  const minArea = parseArea(project.minArea) || 150;
  const maxArea = parseArea(project.maxArea) || 300;

  // Parse rooms - projects might have room range
  const minRooms = project.minRooms || project.minBedrooms || 3;
  const maxRooms = project.maxRooms || project.maxBedrooms || 5;

  // Parse floors
  const floorsMin = project.minFloors || project.floors?.min || 3;
  const floorsMax =
    project.maxFloors || project.floors?.max || project.floors || 5;

  // Parse units
  const units = project.units || 50;

  // Parse location
  const city =
    project.city ||
    project.location?.city ||
    project.address?.city ||
    "غير محدد";
  const district =
    project.district ||
    project.location?.district ||
    project.address?.district ||
    project.location?.address ||
    project.address ||
    "غير محدد";

  // Parse status
  const status =
    project.completeStatus === "1" || project.status === "completed"
      ? "مكتمل"
      : "قيد الإنشاء";

  const projectId = project.id || project.slug || String(Date.now());
  const projectSlug = project.slug || project.id || String(Date.now());

  return {
    ThemeTwo: "property",
    id: projectId,
    image: project.image || project.images?.[0] || "",
    title: project.title || "مشروع",
    city: city,
    district: district,
    status: status,
    area: {
      ThemeTwo: "area",
      min: minArea,
      max: maxArea,
    },
    rooms: {
      ThemeTwo: "rooms",
      min: minRooms,
      max: maxRooms,
    },
    units: units,
    floors: {
      ThemeTwo: "floors",
      min: floorsMin,
      max: floorsMax,
    },
    price: {
      ThemeTwo: "price",
      min: minPrice > 0 ? minPrice : 500000,
      max: maxPrice > 0 ? maxPrice : 1500000,
    },
    bathrooms: {
      ThemeTwo: "bathrooms",
      min: 2,
      max: 4,
    },
    featured: project.featured || false,
    url: `/project/${projectSlug}`,
  };
};

// SVG Icons
const AreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M17.5 22.5v-3.5h-3.5v-1.5h3.5v-3.5h1.5v3.5h3.5v1.5h-3.5v3.5h-1.5Zm-12.5 -3.5V14h1.5v3.5h3.5v1.5H5Zm0 -9V5h5v1.5h-3.5v3.5h-1.5Zm12.5 0v-3.5h-3.5v-1.5h5v5h-1.5Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M1 19V4.375h1.5v9.85h8.825V6.5h8.05c0.99685 0 1.85025 0.3549 2.56025 1.06475C22.6451 8.27475 23 9.12815 23 10.125V19h-1.5v-3.275H2.5V19H1Zm5.75 -6.225c-0.75 0 -1.37915 -0.25415 -1.8875 -0.7625C4.354165 11.50415 4.1 10.875 4.1 10.125s0.254165 -1.37915 0.7625 -1.8875C5.37085 7.72915 6 7.475 6.75 7.475s1.37915 0.25415 1.8875 0.7625c0.50835 0.50835 0.7625 1.1375 0.7625 1.8875s-0.25415 1.37915 -0.7625 1.8875C8.12915 12.52085 7.5 12.775 6.75 12.775Zm6.075 1.45H21.5v-4.1c0 -0.58435 -0.2081 -1.0846 -0.62425 -1.50075C20.4596 8.2081 19.95935 8 19.375 8h-6.55v6.225Zm-6.075 -2.95c0.31665 0 0.5875 -0.1125 0.8125 -0.3375 0.225 -0.225 0.3375 -0.49585 0.3375 -0.8125s-0.1125 -0.5875 -0.3375 -0.8125c-0.225 -0.225 -0.49585 -0.3375 -0.8125 -0.3375s-0.5875 0.1125 -0.8125 0.3375c-0.225 0.225 -0.3375 0.49585 -0.3375 0.8125s0.1125 0.5875 0.3375 0.8125c0.225 0.225 0.49585 0.3375 0.8125 0.3375Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21v-1.5h2.3V3h9.75v1.125h3.675V19.5H21v1.5h-3.775V5.625H15.05V21H3Zm8.275 -8c0.28335 0 0.52085 -0.09585 0.7125 -0.2875s0.2875 -0.42915 0.2875 -0.7125c0 -0.28335 -0.09585 -0.52085 -0.2875 -0.7125S11.55835 11 11.275 11c-0.28335 0 -0.52085 0.09585 -0.7125 0.2875s-0.2875 0.42915 -0.2875 0.7125c0 0.28335 0.09585 0.52085 0.2875 0.7125s0.42915 0.2875 0.7125 0.2875ZM6.8 19.5h6.75V4.5H6.8v15Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StairsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21.75v-1.5h3.75v-4.5h4.5v-4.5h4.5v-4.5h4.5V3h1.5v5.25h-4.5v4.5h-4.5v4.5h-4.5v4.5H3Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    viewBox="0 0 576 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

// Project Card Component
function ProjectCard({ property }: { property: Property }) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA");
  };

  // Check if title is longer than 20 characters
  const isLongTitle = property.title && property.title.length > 20;
  const titleFontSize = isLongTitle ? "text-base" : "text-xl";
  const titleMaxWidth = isLongTitle
    ? "max-w-full lg:max-w-[200px]"
    : "max-w-full";

  const CardContent = (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      {/* Image Section */}
      <div className="relative w-full h-[337px]">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 387px"
        />
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 right-4 bg-yellow-550 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-md">
            <StarIcon />
            <span className="text-black text-sm font-medium">مشروع مميز</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title and Status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h4
              className={`${titleFontSize} ${titleMaxWidth} font-bold text-black break-words flex-1`}
            >
              {property.title}
            </h4>
            <div className="text-green-600 font-semibold text-lg">
              {property.status}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-black">
            <span>في {property.city}</span>
            <span>-</span>
            <span>{property.district}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Area */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AreaIcon />
              <span className="text-[#896042] text-sm font-medium">
                {formatNumber(property.area.min)} -{" "}
                {formatNumber(property.area.max)} م²
              </span>
            </div>
            <span className="text-xs text-gray-600">المساحة</span>
          </div>

          {/* Rooms */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BedIcon />
              <span className="text-[#896042] text-sm font-medium">
                {property.rooms.min} - {property.rooms.max}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الغرف</span>
          </div>

          {/* Units */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BuildingIcon />
              <span className="text-[#896042] text-sm font-medium">
                {property.units}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الوحدات</span>
          </div>

          {/* Floors */}
          <div className="flex flex-col items-center text-center col-start-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <StairsIcon />
              <span className="text-[#896042] text-sm font-medium">
                {property.floors.min} - {property.floors.max}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الطوابق</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-[#896042] rounded-lg px-4 py-3 text-center">
          <div className="text-white text-base font-medium">
            {formatNumber(property.price.min)} -{" "}
            {formatNumber(property.price.max)} ريال سعودي
          </div>
        </div>
      </div>
    </div>
  );

  // Always wrap in Link since we now always have a URL
  return (
    <Link href={property.url || `#`} className="block">
      {CardContent}
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PropertiesShowcase1(props: PropertiesShowcaseProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "propertiesShowcase1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const propertiesShowcaseStates = useEditorStore(
    (s) => s.propertiesShowcaseStates,
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Tenant ID hook for API calls
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // State for API data
  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // ─────────────────────────────────────────────────────────
  // 2.5. FETCH PROPERTIES FROM API
  // ─────────────────────────────────────────────────────────
  const fetchProperties = async (apiUrl?: string) => {
    try {
      setLoading(true);

      if (!currentTenantId) {
        setLoading(false);
        return;
      }

      // Convert legacy API URLs to new format and replace tenantId
      const defaultUrl =
        "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
      const url = convertLegacyApiUrl(apiUrl || defaultUrl, currentTenantId);

      const response = await axiosInstance.get(url);

      // Handle different API response formats
      if (response.data) {
        let dataToSet: Property[] = [];

        // Check if it's projects API response
        if (url.includes("/projects")) {
          let projectsData = [];

          if (response.data.projects) {
            projectsData = response.data.projects;
          } else if (Array.isArray(response.data)) {
            projectsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            projectsData = response.data.data;
          }

          // Convert projects to PropertiesShowcase format
          if (projectsData.length > 0) {
            dataToSet = projectsData.map((project: any) => {
              return convertApiProjectToShowcaseFormat(project);
            });
          } else {
            dataToSet = [];
          }
        }
        // Check if it's properties API response
        else if (response.data.properties) {
          const propertiesData = response.data.properties;
          if (Array.isArray(propertiesData) && propertiesData.length > 0) {
            dataToSet = propertiesData.map((property: any) => {
              return convertApiPropertyToShowcaseFormat(property);
            });
          } else {
            dataToSet = [];
          }
        }
        // Handle direct array response
        else if (Array.isArray(response.data)) {
          // Determine if it's projects or properties based on URL
          if (url.includes("/projects")) {
            dataToSet = response.data.map((item: any) => {
              return convertApiProjectToShowcaseFormat(item);
            });
          } else {
            dataToSet = response.data.map((item: any) => {
              return convertApiPropertyToShowcaseFormat(item);
            });
          }
        }
        // Handle pagination wrapper
        else if (response.data.data && Array.isArray(response.data.data)) {
          const dataArray = response.data.data;
          if (url.includes("/projects")) {
            dataToSet = dataArray.map((item: any) => {
              return convertApiProjectToShowcaseFormat(item);
            });
          } else {
            dataToSet = dataArray.map((item: any) => {
              return convertApiPropertyToShowcaseFormat(item);
            });
          }
        }

        setApiProperties(dataToSet);
      } else {
        setApiProperties([]);
      }
    } catch (error) {
      // Set empty array on error
      setApiProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Track screen size for responsive grid
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1000);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Extract component data from tenantData (BEFORE useEffect)
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
          // Use componentId === props.id (most reliable identifier)
          if (
            (component as any).type === "propertiesShowcase" &&
            (componentId === props.id ||
              (component as any).id === props.id ||
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
            (component as any).type === "propertiesShowcase" &&
            ((component as any).id === props.id ||
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
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPropertiesShowcaseData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultPropertiesShowcaseData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("propertiesShowcase", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
    props,
  ]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = props.useStore
    ? propertiesShowcaseStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("propertiesShowcase", uniqueId) || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultPropertiesShowcaseData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // Merge data with correct priority
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...props, // 2. Props from parent component
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    // Use currentStoreData only if it's not just default data
    // (meaning it has been updated by user) or if tenantComponentData doesn't exist
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // ─────────────────────────────────────────────────────────
  // 5.5. FETCH DATA FROM API
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const apiUrl =
      mergedData.dataSource?.apiUrl ||
      "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
    const useApiData = mergedData.dataSource?.enabled !== false;

    if (useApiData && currentTenantId) {
      fetchProperties(apiUrl);
    }
  }, [
    storeData?.dataSource?.apiUrl,
    storeData?.dataSource?.enabled,
    currentStoreData?.dataSource?.apiUrl,
    currentStoreData?.dataSource?.enabled,
    tenantComponentData?.dataSource?.apiUrl,
    tenantComponentData?.dataSource?.enabled,
    props.dataSource?.apiUrl,
    props.dataSource?.enabled,
    currentTenantId,
  ]);

  // ─────────────────────────────────────────────────────────
  // 6. DETERMINE WHICH DATA TO USE (API vs Static)
  // ─────────────────────────────────────────────────────────
  const useApiData = mergedData.dataSource?.enabled !== false;
  const properties = useApiData ? apiProperties : mergedData.properties || [];

  // ─────────────────────────────────────────────────────────
  // 7. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 8. RENDER
  // ─────────────────────────────────────────────────────────

  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA");
  };

  return (
    <section
      className=""
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#efe5dc",
        paddingTop: mergedData.layout?.padding?.top || "3rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "3rem",
      }}
    >
      <div
        className="container mx-auto"
        style={{ maxWidth: mergedData.layout?.maxWidth || "7xl" }}
      >
        {/* View All Button and Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right">
            <h3
              className={cn(
                "font-bold mb-3",
                `text-${mergedData.typography?.title?.fontSize?.mobile || "xl"} md:text-${mergedData.typography?.title?.fontSize?.tablet || "2xl"} lg:text-${mergedData.typography?.title?.fontSize?.desktop || "3xl"}`,
              )}
              style={{
                color: mergedData.styling?.titleColor || "#1f2937",
                fontFamily:
                  mergedData.typography?.title?.fontFamily || "Tajawal",
                fontWeight: mergedData.typography?.title?.fontWeight || "bold",
              }}
            >
              {mergedData.content?.title || "المشاريع والعقارات"}
            </h3>
            {/* Divider */}
            <div
              className="w-24 h-[2px] mb-4 ml-auto"
              style={{
                backgroundColor: mergedData.styling?.dividerColor || "#8b5f46",
              }}
            ></div>
          </div>
          <button
            className="flex items-center gap-2 font-medium transition-colors duration-300 text-md md:text-xl"
            style={{
              color: mergedData.styling?.viewAllButtonColor || "#8b5f46",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                mergedData.styling?.viewAllButtonHoverColor || "#6b4630";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                mergedData.styling?.viewAllButtonColor || "#8b5f46";
            }}
          >
            <span>{mergedData.content?.viewAllButtonText || "عرض الكل"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{
                  borderBottomColor:
                    mergedData.styling?.loadMoreButtonColor || "#8b5f46",
                }}
              ></div>
              <p className="text-gray-600">جاري تحميل العقارات...</p>
            </div>
          </div>
        ) : properties.length > 0 ? (
          <div
            className="grid gap-6 grid-cols-1"
            style={{
              gap: mergedData.layout?.gap || "1.5rem",
              ...(isLargeScreen && {
                gridTemplateColumns: `repeat(${mergedData.layout?.columns?.desktop || 3}, 1fr)`,
              }),
            }}
          >
            {properties.map((property: Property, index: number) => (
              <ProjectCard key={property.id || index} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                لا توجد عقارات متاحة حالياً
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {useApiData
                  ? "يرجى المحاولة مرة أخرى لاحقاً"
                  : "أضف عقارات من لوحة التحكم"}
              </p>
            </div>
          </div>
        )}

        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <button
            className="px-5 py-3 border-2 font-medium rounded-2xl transition-all duration-300 hover:scale-110"
            style={{
              borderColor: mergedData.styling?.loadMoreButtonColor || "#8b5f46",
              backgroundColor: "transparent",
              color: mergedData.styling?.loadMoreButtonTextColor || "#8b5f46",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                mergedData.styling?.loadMoreButtonHoverColor || "#8b5f46";
              e.currentTarget.style.color =
                mergedData.styling?.loadMoreButtonHoverTextColor || "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color =
                mergedData.styling?.loadMoreButtonTextColor || "#8b5f46";
            }}
          >
            {mergedData.content?.loadMoreButtonText || "تحميل المزيد"}
          </button>
        </div>
      </div>
    </section>
  );
}
