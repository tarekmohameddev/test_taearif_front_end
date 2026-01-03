"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultBlogsSectionsData } from "@/context/editorStoreFunctions/blogsSectionsFunctions";

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
  cards?: Card[];
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
        <div
          className="grid gap-6 md:gap-8"
          style={{
            gridTemplateColumns: `repeat(${mergedData.layout?.gridColumns?.desktop || 3}, 1fr)`,
            gap: mergedData.layout?.gap?.cards || "1.5rem",
          }}
        >
          {mergedData.cards?.map((card, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
