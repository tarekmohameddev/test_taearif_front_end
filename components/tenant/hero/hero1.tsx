"use client";

import { useEffect, useState } from "react";
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
import {
  ChevronDown,
  CircleDollarSign,
  Home,
  MapPin,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/context/Store";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultHeroData } from "@/context/editorStoreFunctions/heroFunctions";
import HeroSearchForm from "./HeroSearchForm";

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
      purpose?: {
        enabled?: boolean;
        options?: Array<{ value: string; label: string }>;
        default?: string;
      };
      city?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
      };
      type?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
      price?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: Array<{ id: string; label: string }>;
      };
      keywords?: {
        enabled?: boolean;
        placeholder?: string;
      };
    };
    responsive?: {
      desktop?: string;
      tablet?: string;
      mobile?: string;
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

// Search Form Component
function SearchForm({
  config,
  primaryColor,
  primaryColorHover,
}: {
  config: any;
  primaryColor?: string;
  primaryColorHover?: string;
}) {
  const [purpose, setPurpose] = useState(
    config?.fields?.purpose?.default || "rent",
  );
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [keywords, setKeywords] = useState("");

  // Default colors if not provided
  const defaultPrimaryColor = primaryColor || "#059669";
  const defaultPrimaryColorHover = primaryColorHover || "#047857";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Navigate to results page or trigger search
  };

  if (!config?.enabled) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg bg-white p-2 sm:p-3 lg:p-4 shadow-2xl ring-1 ring-black/5"
      aria-label="نموذج البحث عن العقارات"
    >
      {/* Large Desktop: all in one row */}
      <div className="hidden items-stretch gap-2 xl:flex">
        {/* Purpose toggle */}
        {config.fields?.purpose?.enabled && (
          <>
            <div className="flex items-center">
              <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1">
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
                        ? "rounded-lg px-4 xl:px-5 py-2 text-sm font-semibold text-white transition-colors"
                        : "rounded-lg bg-transparent px-4 xl:px-5 py-2 text-sm font-semibold text-foreground hover:bg-white"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <Divider />
          </>
        )}

        {/* City */}
        {config.fields?.city?.enabled && (
          <>
            <div className="flex min-w-[200px] xl:min-w-[220px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <MapPin
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={config.fields.city.placeholder}
                className="h-9 border-0 bg-transparent pe-0 ps-0 focus-visible:ring-0"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Property Type */}
        {config.fields?.type?.enabled && (
          <>
            <div className="flex min-w-[150px] xl:min-w-[170px] items-center gap-2 rounded-xl px-3 py-2">
              <Home
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 w-[140px] xl:w-[160px] border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={config.fields.type.placeholder} />
                </SelectTrigger>
                <SelectContent align="end">
                  {config.fields.type.options?.map((option: any) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Divider />
          </>
        )}

        {/* Price */}
        {config.fields?.price?.enabled && (
          <>
            <div className="flex min-w-[150px] xl:min-w-[170px] items-center gap-2 rounded-xl px-3 py-2">
              <CircleDollarSign
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="h-9 w-[140px] xl:w-[160px] border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={config.fields.price.placeholder} />
                </SelectTrigger>
                <SelectContent align="end">
                  {config.fields.price.options?.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Divider />
          </>
        )}

        {/* Keywords + Search */}
        {config.fields?.keywords?.enabled && (
          <div className="flex min-w-[240px] xl:min-w-[260px] flex-1 items-center gap-3 rounded-xl px-3 py-2">
            <button
              type="submit"
              style={{ backgroundColor: defaultPrimaryColor, color: "#ffffff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  defaultPrimaryColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = defaultPrimaryColor;
              }}
              className="grid size-10 place-items-center rounded-full text-white shadow transition-colors"
              aria-label="بحث"
            >
              <Search className="size-5" />
            </button>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={config.fields.keywords.placeholder}
              className="h-10 border-0 bg-transparent pe-0 ps-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        )}
      </div>

      {/* Medium Desktop/Tablet: two rows layout */}
      <div className="hidden lg:grid xl:hidden gap-3">
        <div className="flex items-stretch gap-2">
          {/* Purpose toggle */}
          {config.fields?.purpose?.enabled && (
            <>
              <div className="flex items-center">
                <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1">
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
                          ? "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                          : "rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-white"
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Divider />
            </>
          )}

          {/* City */}
          {config.fields?.city?.enabled && (
            <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <MapPin
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={config.fields.city.placeholder}
                className="h-9 border-0 bg-transparent pe-0 ps-0 focus-visible:ring-0"
              />
            </div>
          )}
        </div>

        <div className="flex items-stretch gap-2">
          {/* Property Type */}
          {config.fields?.type?.enabled && (
            <>
              <div className="flex min-w-[150px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
                <Home
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-9 border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder={config.fields.type.placeholder} />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {config.fields.type.options?.map((option: any) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Divider />
            </>
          )}

          {/* Price */}
          {config.fields?.price?.enabled && (
            <>
              <div className="flex min-w-[150px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
                <CircleDollarSign
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Select value={price} onValueChange={setPrice}>
                  <SelectTrigger className="h-9 border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue
                      placeholder={config.fields.price.placeholder}
                    />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {config.fields.price.options?.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Divider />
            </>
          )}

          {/* Keywords + Search */}
          {config.fields?.keywords?.enabled && (
            <div className="flex min-w-[200px] flex-1 items-center gap-3 rounded-xl px-3 py-2">
              <button
                type="submit"
                style={{
                  backgroundColor: defaultPrimaryColor,
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    defaultPrimaryColorHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = defaultPrimaryColor;
                }}
                className="grid size-10 place-items-center rounded-full text-white shadow transition-colors"
                aria-label="بحث"
              >
                <Search className="size-5" />
              </button>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={config.fields.keywords.placeholder}
                className="h-10 border-0 bg-transparent pe-0 ps-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Small tablet layout */}
      <div className="hidden md:grid lg:hidden gap-3">
        {config.fields?.purpose?.enabled && (
          <div className="flex items-center justify-center">
            <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1">
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
                      ? "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                      : "rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {config.fields?.keywords?.enabled && (
          <div className="flex items-center gap-2">
            <button
              type="submit"
              style={{ backgroundColor: defaultPrimaryColor, color: "#ffffff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  defaultPrimaryColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = defaultPrimaryColor;
              }}
              className="grid size-10 place-items-center rounded-full text-white shadow transition-colors"
              aria-label="بحث"
            >
              <Search className="size-5" />
            </button>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={config.fields.keywords.placeholder}
              className="h-10"
            />
          </div>
        )}

        {config.fields?.city?.enabled && (
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={config.fields.city.placeholder}
            className="h-10"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          {config.fields?.type?.enabled && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10">
                <Home className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.type.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.type.options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {config.fields?.price?.enabled && (
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="h-10">
                <CircleDollarSign className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.price.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.price.options?.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="grid gap-3 md:hidden">
        {config.fields?.purpose?.enabled && (
          <div className="flex justify-center">
            <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1 w-full max-w-xs">
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
                      ? "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors flex-1"
                      : "rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-white flex-1"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {config.fields?.keywords?.enabled && (
          <div className="flex items-center gap-2">
            <button
              type="submit"
              style={{ backgroundColor: defaultPrimaryColor, color: "#ffffff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  defaultPrimaryColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = defaultPrimaryColor;
              }}
              className="grid size-10 shrink-0 place-items-center rounded-full text-white shadow transition-colors"
              aria-label="بحث"
            >
              <Search className="size-5" />
            </button>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={config.fields.keywords.placeholder}
              className="h-10 flex-1"
            />
          </div>
        )}

        {config.fields?.city?.enabled && (
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={config.fields.city.placeholder}
            className="h-10"
          />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {config.fields?.type?.enabled && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10">
                <Home className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.type.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.type.options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {config.fields?.price?.enabled && (
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="h-10">
                <CircleDollarSign className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.price.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.price.options?.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </form>
  );
}

function Divider() {
  return <span aria-hidden="true" className="my-2 w-px bg-border" />;
}

/**
 * Hero1 Component - Advanced Hero Section
 *
 * This component follows the same pattern as componentsCachingSystem.md:
 * - 99% of the data comes from getDefaultHeroData() (default data)
 * - 1% of the data comes from store/tenant data (customizations)
 *
 * Data Priority Order (highest to lowest):
 * 1. Store Data (storeData) - Highest priority (editor changes)
 * 2. Backend Data (tenantComponentData) - Backend data
 * 3. Props Data (props) - Component props
 * 4. Default Data (defaultData) - Base data (99%)
 *
 * This follows the exact same pattern as whyChooseUs1.tsx and testimonials1.tsx
 * in the componentsCachingSystem.md documentation.
 */
const Hero1 = (props: HeroProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "hero1";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this hero variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("hero", uniqueId, props);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get primary color from WebsiteLayout branding (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const primaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"; // emerald-600 default

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // emerald-700 in Tailwind = #047857
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

  const primaryColorHover = getDarkerColor(primaryColor, 20);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("hero", uniqueId) || {}
    : {};

  // Subscribe to store updates to re-render when data changes
  const heroStates = useEditorStore((s) => s.heroStates);

  // Find the actual hero data in heroStates
  // The data might be stored with a different key than uniqueId
  const findHeroData = () => {
    if (!props.useStore || !heroStates) return {};

    // Look for the first hero data in the store that has actual content
    // Skip entries that only contain metadata (id, type, visible, variant, useStore)
    for (const [key, data] of Object.entries(heroStates)) {
      if (data && typeof data === "object" && data.visible !== undefined) {
        // Check if this is actual hero data (has content, background, etc.)
        if (data.content || data.background || data.searchForm) {
          return data;
        }
      }
    }

    // Fallback: try to get data by uniqueId if no actual hero data found
    if (heroStates[uniqueId]) {
      return heroStates[uniqueId];
    }

    return {};
  };

  const currentStoreData = findHeroData();

  // Get tenant data for this specific component variant - memoized
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
          if (
            (component as any).type === "hero" &&
            (component as any).componentName === variantId &&
            componentId === props.id
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Debug: Log the data sources to help troubleshoot
  if (props.useStore) {
  }

  // Get default data as base (99% of the data) - memoized
  const defaultData = getDefaultHeroData();

  // Merge data with priority: currentStoreData > tenantComponentData > props > default
  // This follows the exact same pattern as componentsCachingSystem.md
  // Priority order: Current Store > Backend > Props > Default
  const mergedData = {
    ...defaultData, // 99% - Default data as base
    ...props, // Props from parent component
    ...tenantComponentData, // Backend data (tenant data)
    ...currentStoreData, // Current store data (highest priority)
  };

  const { user, loading } = useAuth();
  const router = useRouter();
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const error = useTenantStore((s) => s.error);

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

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Generate unique ID for style tag to avoid conflicts
  const styleId = `hero1-height-${uniqueId.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
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
      {/* Background Image */}
      <Image
        src={
          mergedData.background?.image ||
          "https://dalel-lovat.vercel.app/images/hero.webp"
        }
        alt={mergedData.background?.alt || "صورة خلفية لغرفة معيشة حديثة"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      {mergedData.background?.overlay?.enabled && (
        <div className="absolute inset-0" style={overlayStyles} />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col items-center px-4 text-center text-white">
        {/* Desktop/Tablet Layout */}
        <div
          className="hidden md:block"
          style={{ paddingTop: mergedData.content?.paddingTop || "200px" }}
        >
          <h1
            className={cn(
              "mx-auto text-balance",
              `text-${mergedData.content?.font?.title?.size?.tablet || "4xl"} md:text-${mergedData.content?.font?.title?.size?.desktop || "5xl"}`,
              `max-w-${mergedData.content?.maxWidth || "5xl"}`,
            )}
            style={titleStyles}
          >
            {mergedData.content?.title || "اكتشف عقارك المثالي في أفضل المواقع"}
          </h1>
          <p
            className={cn(
              "mt-4",
              `text-${mergedData.content?.font?.subtitle?.size?.tablet || "2xl"} md:text-${mergedData.content?.font?.subtitle?.size?.desktop || "2xl"}`,
            )}
            style={subtitleStyles}
          >
            {mergedData.content?.subtitle ||
              "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية"}
          </p>
        </div>

        {/* Mobile Layout - Content and Form in proper order */}
        <div className="md:hidden flex flex-col items-center justify-center h-full w-full">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1
              className={cn(
                "mx-auto text-balance mb-4",
                `text-${mergedData.content?.font?.title?.size?.mobile || "2xl"}`,
                `max-w-${mergedData.content?.maxWidth || "5xl"}`,
              )}
              style={titleStyles}
            >
              {mergedData.content?.title ||
                "اكتشف عقارك المثالي في أفضل المواقع"}
            </h1>
            <p
              className={cn(
                "mb-8",
                `text-${mergedData.content?.font?.subtitle?.size?.mobile || "2xl"}`,
              )}
              style={subtitleStyles}
            >
              {mergedData.content?.subtitle ||
                "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية"}
            </p>
          </div>

          {/* Hero Search Form for Mobile */}
          {mergedData.searchForm?.enabled && (
            <div className="w-full max-w-2xl px-4 pb-8">
              <HeroSearchForm
                config={mergedData.searchForm}
                primaryColor={primaryColor}
                primaryColorHover={primaryColorHover}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hero Search Form for Desktop/Tablet */}
      {mergedData.searchForm?.enabled && (
        <div
          className={cn(
            "pointer-events-auto absolute inset-x-0 z-10 mx-auto px-4 sm:px-6 lg:px-8 bottom-32 max-w-[1600px] hidden md:block",
          )}
        >
          <HeroSearchForm
            config={mergedData.searchForm}
            primaryColor={primaryColor}
            primaryColorHover={primaryColorHover}
          />
        </div>
      )}
    </section>
    </>
  );
};

export default Hero1;
