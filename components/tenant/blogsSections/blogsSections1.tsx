"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultBlogsSectionsData } from "@/context/editorStoreFunctions/blogsSectionsFunctions";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Card {
  id?: string;
  image?: string;
  title?: string;
  description?: string;
  readMoreUrl?: string;
  date?: string;
}

interface BlogsSectionsProps {
  visible?: boolean;
  paragraph1?: string;
  paragraph2?: string;
  apiSettings?: {
    enabled?: boolean;
    endpoint?: string;
    limit?: number;
    page?: number;
  };
  styling?: {
    backgroundColor?: string;
    paragraphColor?: string;
    dividerColor?: string;
    cardBackgroundColor?: string;
    cardTitleColor?: string;
    cardTitleHoverColor?: string;
    cardDescriptionColor?: string;
    readMoreColor?: string;
    readMoreHoverColor?: string;
    dateColor?: string;
  };
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
    gap?: {
      paragraphs?: string;
      cards?: string;
    };
    gridColumns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
  };

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function BlogsSections1(props: BlogsSectionsProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "blogsSections1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const blogsSectionsStates = useEditorStore((s) => s.blogsSectionsStates);

  // Get tenant data FIRST
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "blogsSections" &&
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
              (component as any).type === "blogsSections" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultBlogsSectionsData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultBlogsSectionsData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("blogsSections", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]); // ✅ Add tenantComponentData dependency

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = blogsSectionsStates[uniqueId];
  const currentStoreData = getComponentData("blogsSections", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultBlogsSectionsData(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // API DATA FETCHING
  // ─────────────────────────────────────────────────────────
  const [apiCards, setApiCards] = useState<Card[]>([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { tenantId: hookTenantId } = useTenantId();

  // Check if we're in Live Editor
  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  // API Response Interface
  interface ApiPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail?: {
      id: number;
      url: string;
      type: string;
      created_at: string;
    };
    published_at: string;
  }

  interface ApiResponse {
    data: ApiPost[];
    pagination: {
      per_page: number;
      current_page: number;
      from: number;
      to: number;
      total: number;
      last_page: number;
    };
  }

  // Function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Function to convert API data to Card format
  const convertApiDataToCards = useCallback((apiData: ApiPost[]): Card[] => {
    return apiData.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      description: post.excerpt || "",
      image: post.thumbnail?.url || "",
      readMoreUrl: `/blog/${post.slug || post.id}`,
      date: formatDate(post.published_at),
    }));
  }, []);

  // Fetch data from API - Always enabled, data comes from API only
  const fetchBlogsFromApi = useCallback(async () => {
    // Use mock data in Live Editor
    if (isLiveEditor) {
      const mockApiData: ApiPost[] = [
        {
          id: 1,
          title: "مقال تجريبي 1",
          slug: "test-1",
          excerpt: "هذا مقال تجريبي للمحرر المباشر",
          thumbnail: {
            id: 1,
            url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
            type: "image",
            created_at: new Date().toISOString(),
          },
          published_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "مقال تجريبي 2",
          slug: "test-2",
          excerpt: "مقال تجريبي آخر للمحرر المباشر",
          thumbnail: {
            id: 2,
            url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            type: "image",
            created_at: new Date().toISOString(),
          },
          published_at: new Date().toISOString(),
        },
      ];
      setApiCards(convertApiDataToCards(mockApiData));
      setLoadingApi(false);
      return;
    }

    try {
      setLoadingApi(true);
      setApiError(null);

      const endpoint = mergedData.apiSettings?.endpoint || "/api/posts";
      const limit = mergedData.apiSettings?.limit || 10;
      const page = mergedData.apiSettings?.page || 1;

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: limit.toString(),
      });

      const url = `${endpoint}?${params.toString()}`;
      const response = await axiosInstance.get<ApiResponse>(url);

      if (response.data && response.data.data) {
        const cards = convertApiDataToCards(response.data.data);
        setApiCards(cards);
      } else {
        setApiError("لا توجد بيانات متاحة");
        setApiCards([]);
      }
    } catch (error) {
      console.error("BlogsSections: Error fetching blogs from API:", error);
      setApiError("حدث خطأ في تحميل البيانات");
      setApiCards([]);
    } finally {
      setLoadingApi(false);
    }
  }, [
    isLiveEditor,
    mergedData.apiSettings?.endpoint,
    mergedData.apiSettings?.limit,
    mergedData.apiSettings?.page,
    convertApiDataToCards,
  ]);

  // Fetch data when component mounts or settings change - Always fetch from API
  useEffect(() => {
    fetchBlogsFromApi();
  }, [fetchBlogsFromApi]);

  // Cards always come from API
  const displayCards = apiCards;

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <section
      className="w-full py-12 md:py-16"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#8b5f46",
        paddingTop: mergedData.layout?.padding?.top || "3rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "3rem",
      }}
    >
      <div
        className="w-full mx-auto px-4 md:px-6 lg:px-8"
        style={{ maxWidth: mergedData.layout?.maxWidth || "1280px" }}
      >
        {/* Header Section - Two Paragraphs */}
        <div
          className="mb-8 md:mb-12 flex flex-col md:flex-row gap-6 md:gap-8 text-right"
          style={{ gap: mergedData.layout?.gap?.paragraphs || "2rem" }}
        >
          {/* First Paragraph - 50% */}
          <div className="w-full md:w-1/2">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{
                color:
                  mergedData.styling?.paragraphColor ||
                  "rgba(255, 255, 255, 0.9)",
              }}
            >
              {mergedData.paragraph1}
            </p>
          </div>

          {/* Second Paragraph - 50% */}
          <div className="w-full md:w-1/2">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{
                color:
                  mergedData.styling?.paragraphColor ||
                  "rgba(255, 255, 255, 0.9)",
              }}
            >
              {mergedData.paragraph2}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-[1px] my-8 md:my-12"
          style={{
            backgroundColor:
              mergedData.styling?.dividerColor || "rgba(255, 255, 255, 0.3)",
          }}
        ></div>

        {/* Cards Grid */}
        {loadingApi ? (
          <div className="grid gap-6 md:gap-8" style={{
            gridTemplateColumns: `repeat(${mergedData.layout?.gridColumns?.desktop || 3}, 1fr)`,
            gap: mergedData.layout?.gap?.cards || "1.5rem",
          }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="w-full h-[250px] md:h-[280px] bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : apiError ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{apiError}</p>
            <button
              onClick={fetchBlogsFromApi}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div
            className="grid gap-6 md:gap-8"
            style={{
              gridTemplateColumns: `repeat(${mergedData.layout?.gridColumns?.desktop || 3}, 1fr)`,
              gap: mergedData.layout?.gap?.cards || "1.5rem",
            }}
          >
            {displayCards.length > 0 ? (
              displayCards.map((card, index) => (
            <div
              key={card.id || index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundColor:
                  mergedData.styling?.cardBackgroundColor || "#ffffff",
              }}
            >
              {/* Card Image */}
              <Link href={card.readMoreUrl || "#"} className="block">
                <div className="relative w-full h-[250px] md:h-[280px]">
                  <Image
                    src={card.image || ""}
                    alt={card.title || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>

              {/* Card Content */}
              <div className="p-6">
                {/* Title */}
                <Link href={card.readMoreUrl || "#"}>
                  <h3
                    className="text-lg md:text-xl font-bold mb-3 transition-colors"
                    style={{
                      color: mergedData.styling?.cardTitleColor || "#1f2937",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color =
                        mergedData.styling?.cardTitleHoverColor || "#8b5f46";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color =
                        mergedData.styling?.cardTitleColor || "#1f2937";
                    }}
                  >
                    {card.title}
                  </h3>
                </Link>

                {/* Description */}
                <p
                  className="text-sm md:text-base leading-relaxed mb-4"
                  style={{
                    color:
                      mergedData.styling?.cardDescriptionColor || "#4b5563",
                  }}
                >
                  {card.description}
                </p>

                {/* Read More Link */}
                <Link
                  href={card.readMoreUrl || "#"}
                  className="inline-block font-medium transition-colors mb-4"
                  style={{
                    color: mergedData.styling?.readMoreColor || "#8b5f46",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      mergedData.styling?.readMoreHoverColor || "#6b4630";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      mergedData.styling?.readMoreColor || "#8b5f46";
                  }}
                >
                  قراءة المزيد...
                </Link>

                {/* Date */}
                <div className="pt-4 border-t border-gray-200">
                  <span
                    className="text-xs md:text-sm"
                    style={{
                      color: mergedData.styling?.dateColor || "#6b7280",
                    }}
                  >
                    {card.date}
                  </span>
                </div>
              </div>
            </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد مقالات متاحة</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
