"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";

interface HeroSection2Props {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function HeroSection2(props: HeroSection2Props = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "hero2";

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("hero", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s: any) => s.tenantData);
  const fetchTenantData = useTenantStore((s: any) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);
  const router = useRouter();

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

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("hero", variantId) || {}
    : {};

  // Subscribe to store updates to re-render when data changes
  const heroStates = useEditorStore((s) => s.heroStates);
  const currentStoreData = props.useStore ? heroStates[variantId] || {} : {};

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

  // Default data for hero2
  const getDefaultHero2Data = () => ({
    visible: true,
    title: "من نحن",
    description: "شريكك الموثوق في تحقيق أفضل الفرص العقارية",
    imageSrc: "https://dalel-lovat.vercel.app/images/hero.webp",
    imageAlt: "Background",
    height: {
      desktop: "229px",
      tablet: "229px",
      mobile: "229px",
    },
    minHeight: {
      desktop: "229px",
      tablet: "229px",
      mobile: "229px",
    },
    background: {
      image: "https://dalel-lovat.vercel.app/images/hero.webp",
      alt: "Background",
      overlay: {
        enabled: true,
        opacity: "0.6",
        color: "#000000",
      },
    },
    content: {
      title: "من نحن",
      description: "شريكك الموثوق في تحقيق أفضل الفرص العقارية",
      alignment: "center",
      maxWidth: "5xl",
      font: {
        title: {
          family: "Tajawal",
          size: { desktop: "36px", tablet: "36px", mobile: "36px" },
          weight: "bold",
          color: "#ffffff",
          lineHeight: "1.25",
        },
        description: {
          family: "Tajawal",
          size: { desktop: "15px", tablet: "15px", mobile: "15px" },
          weight: "normal",
          color: "#ffffff",
        },
      },
    },
    animations: {
      title: {
        enabled: true,
        type: "fade-up",
        duration: 600,
        delay: 200,
      },
      description: {
        enabled: true,
        type: "fade-up",
        duration: 600,
        delay: 400,
      },
    },
  });

  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultHero2Data(),
    ...props,
    ...tenantComponentData,
    ...currentStoreData,
  };

  // Extract values from merged data
  const {
    title = "عنوان الصفحة",
    description = "وصف الصفحة",
    imageSrc = "https://dalel-lovat.vercel.app/images/hero.webp",
    imageAlt = "صورة خلفية",
    visible = true,
    height = { desktop: "229px", tablet: "229px", mobile: "229px" },
    minHeight = { desktop: "229px", tablet: "229px", mobile: "229px" },
    background = {
      image: "https://dalel-lovat.vercel.app/images/hero.webp",
      alt: "صورة خلفية",
      overlay: { enabled: true, opacity: "0.6", color: "#000000" },
    },
    content = {
      title: "عنوان الصفحة",
      description: "وصف الصفحة",
      alignment: "center",
      maxWidth: "5xl",
      font: {
        title: {
          family: "Tajawal",
          size: { desktop: "36px", tablet: "36px", mobile: "36px" },
          weight: "bold",
          color: "#ffffff",
          lineHeight: "1.25",
        },
        description: {
          family: "Tajawal",
          size: { desktop: "15px", tablet: "15px", mobile: "15px" },
          weight: "normal",
          color: "#ffffff",
        },
      },
    },
  } = mergedData;

  if (!visible) return null;

  return (
    <section className="relative w-full min-h-[229px] md:min-h-[368px] flex items-center justify-center overflow-hidden">
      <Image
        src={background.image || imageSrc}
        alt={background.alt || imageAlt}
        fill
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
        priority={false}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundColor:
            mergedData.background?.overlay?.color || primaryColor,
        }}
      ></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-[36px] md:text-[60px] text-white mb-4 md:mb-10">
          {content.title || title}
        </h1>
        <p className="text-[15px] md:text-[30px] text-white text-center">
          {content.description || description}
        </p>
      </div>
    </section>
  );
}
