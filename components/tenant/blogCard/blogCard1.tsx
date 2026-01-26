"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultBlogCardData } from "@/context/editorStoreFunctions/blogCardFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Blog {
  id: string;
  image: string;
  title: string;
  description: string;
  readMoreUrl: string;
  date: string;
}

interface BlogCard1Props {
  visible?: boolean;
  blog?: Blog;
  styling?: {
    cardBackgroundColor?: string;
    cardTitleColor?: string;
    cardTitleHoverColor?: string;
    cardDescriptionColor?: string;
    readMoreColor?: string;
    readMoreHoverColor?: string;
    dateColor?: string;
  };
  responsive?: {
    imageHeight?: {
      mobile?: string;
      desktop?: string;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function BlogCard1(props: BlogCard1Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "blogCard1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const blogCardStates = useEditorStore((s) => s.blogCardStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
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
          component.type === "blogCard" &&
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
              (component as any).type === "blogCard" &&
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

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultBlogCardData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultBlogCardData(),
              ...props,
            };

      // ⭐ CRITICAL: Use getState() directly to avoid dependency issues
      const store = useEditorStore.getState();
      store.ensureComponentVariant("blogCard", uniqueId, initialData);
    }
    // ⭐ CRITICAL: Only depend on uniqueId, props.useStore, and tenantComponentData
    // Don't include ensureComponentVariant to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueId, props.useStore, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = blogCardStates[uniqueId];
  const currentStoreData = getComponentData("blogCard", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultBlogCardData(), // 1. Defaults (lowest priority)
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
  const blog = mergedData.blog || getDefaultBlogCardData().blog;
  const styling = mergedData.styling || {};
  const responsive = mergedData.responsive || {};

  const imageHeight = responsive.imageHeight || {};
  const desktopHeight = imageHeight.desktop || "280px";
  const mobileHeight = imageHeight.mobile || "250px";

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{
        backgroundColor: styling.cardBackgroundColor || "#ffffff",
      }}
    >
      {/* Card Image */}
      <Link href={blog.readMoreUrl || "#"} className="block">
        <div
          className="relative w-full"
          style={{
            height: mobileHeight,
          }}
        >
          <style jsx>{`
            @media (min-width: 768px) {
              div {
                height: ${desktopHeight};
              }
            }
          `}</style>
          <Image
            src={blog.image || ""}
            alt={blog.title || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <Link href={blog.readMoreUrl || "#"}>
          <h3
            className="text-lg md:text-xl font-bold mb-3 transition-colors"
            style={{
              color: styling.cardTitleColor || "#1f2937",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                styling.cardTitleHoverColor || "#8b5f46";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                styling.cardTitleColor || "#1f2937";
            }}
          >
            {blog.title}
          </h3>
        </Link>

        {/* Description */}
        <p
          className="text-sm md:text-base leading-relaxed mb-4"
          style={{
            color: styling.cardDescriptionColor || "#4b5563",
          }}
        >
          {blog.description}
        </p>

        {/* Read More Link */}
        <Link
          href={blog.readMoreUrl || "#"}
          className="inline-block font-medium transition-colors mb-4"
          style={{
            color: styling.readMoreColor || "#8b5f46",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color =
              styling.readMoreHoverColor || "#6b4630";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color =
              styling.readMoreColor || "#8b5f46";
          }}
        >
          قراءة المزيد...
        </Link>

        {/* Date */}
        <div className="pt-4 border-t border-gray-200">
          <span
            className="text-xs md:text-sm"
            style={{
              color: styling.dateColor || "#6b7280",
            }}
          >
            {blog.date}
          </span>
        </div>
      </div>
    </div>
  );
}
