"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultProjectDetails2Data } from "@/context/editorStoreFunctions/projectDetailsFunctions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import SwiperCarousel from "@/components/ui/swiper-carousel2";
import Link from "next/link";
import PropertyCard3 from "@/components/tenant/cards/card3";

interface Project {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  address?: string;
  developer?: string;
  units?: number;
  completionDate?: string;
  minPrice?: string;
  maxPrice?: string;
  price?: string;
  image?: string;
  images?: string[];
  floorplans?: string[];
  videoUrl?: string | null;
  amenities?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  specifications?: any[];
  types?: any[];
  district?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  features?: string[];
  properties?: Array<{
    id: number;
    project_id?: number;
    title: string;
    slug: string;
    address?: string;
    description?: string;
    price: string;
    pricePerMeter?: string;
    purpose?: string;
    type?: string;
    beds?: number;
    bath?: number;
    area?: string;
    size?: string;
    featured_image: string;
    gallery?: string[];
    location?: {
      latitude: string;
      longitude: string;
    };
    status?: boolean;
    featured?: boolean;
    property_status?: string;
    features?: string[];
    faqs?: any[];
    category_id?: number;
    payment_method?: string | null;
    video_url?: string | null;
    virtual_tour?: string | null;
    created_at?: string;
    updated_at?: string;
  }>;
}

interface ProjectDetails2Props {
  // Component-specific props
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
    gap?: string;
  };
  styling?: {
    backgroundColor?: string;
    primaryColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    formBackgroundColor?: string;
    formTextColor?: string;
    formButtonBackgroundColor?: string;
    formButtonTextColor?: string;
  };
  content?: {
    descriptionTitle?: string;
    specsTitle?: string;
    contactFormTitle?: string;
    contactFormDescription?: string;
    videoTourText?: string;
    submitButtonText?: string;
  };
  displaySettings?: {
    showDescription?: boolean;
    showSpecs?: boolean;
    showContactForm?: boolean;
    showVideoUrl?: boolean;
    showMap?: boolean;
  };
  hero?: {
    height?: string;
    overlayOpacity?: number;
  };
  gallery?: {
    showThumbnails?: boolean;
    thumbnailGridColumns?: number;
    thumbnailHeight?: string;
  };

  // Required prop for fetching project data
  projectSlug: string;

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function ProjectDetails2(props: ProjectDetails2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "projectDetails2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const projectDetailsStates = useEditorStore((s) => s.projectDetailsStates);

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

  // Extract component data from tenantData
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
            (component as any).type === "projectDetails" &&
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
            (component as any).type === "projectDetails" &&
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
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultProjectDetails2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultProjectDetails2Data(),
              ...props,
            };

      ensureComponentVariant("projectDetails", uniqueId, initialData);
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
    ? projectDetailsStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("projectDetails", uniqueId) || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultProjectDetails2Data();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field)
  const isStoreDataDefault =
    currentStoreData?.content?.descriptionTitle ===
    defaultData?.content?.descriptionTitle;

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

  // Get primary color
  const primaryColor =
    mergedData.styling?.primaryColor ||
    (tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#8b5f46");

  // Get logo image from tenantData
  const { loadingTenantData } = useTenantStore();
  const logoImage = loadingTenantData
    ? null
    : tenantData?.globalComponentsData?.header?.logo?.image ||
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`;

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

  // Helper function to convert hex color to CSS filter for SVG coloring
  const hexToFilter = (hex: string): string => {
    if (!hex || !hex.startsWith("#")) {
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
    }

    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) {
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
    }

    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    const hue = Math.round(h * 360);
    const saturation = Math.round(s * 100);
    const lightness = Math.round(l * 100);
    const brightness = lightness > 50 ? (lightness - 50) * 2 : 0;
    const contrast = 100 + saturation * 0.5;

    return `brightness(0) saturate(100%) invert(${Math.round((1 - lightness / 100) * 100)}%) sepia(${Math.round(saturation)}%) saturate(${Math.round(saturation * 5)}%) hue-rotate(${hue}deg) brightness(${Math.round(100 + brightness)}%) contrast(${Math.round(contrast)}%)`;
  };

  const primaryColorHover = getDarkerColor(primaryColor, 20);
  const primaryColorFilter = hexToFilter(primaryColor);

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────

  // Project data state (from API)
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  // UI state
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Tenant ID hook
  const { tenantId: hookTenantId, isLoading: tenantLoading } = useTenantId();

  // Check if we're in Live Editor
  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  // Mock data for Live Editor
  const mockProject: Project = {
    id: "mock-project-1",
    slug: "mock-project",
    title: "مشروع عقاري متميز",
    description:
      "هذا مشروع عقاري متميز يقع في موقع استراتيجي ويوفر جميع المرافق والخدمات الحديثة. المشروع مصمم بأحدث المعايير العالمية ويوفر تجربة سكنية فريدة.",
    address: "الرياض، حي النرجس، شارع الملك فهد",
    district: "حي النرجس",
    developer: "شركة التطوير العقاري المتميزة",
    units: 150,
    completionDate: "2025-12-31",
    minPrice: "500000",
    maxPrice: "2000000",
    price: "1250000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    floorplans: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    amenities: [
      "موقف سيارات",
      "حديقة",
      "صالة ألعاب",
      "مسبح",
      "نادي صحي",
      "أمن 24/7",
    ],
    location: {
      lat: 24.7136,
      lng: 46.6753,
      address: "الرياض، حي النرجس",
    },
    specifications: [
      { name: "المساحة الإجمالية", value: "50,000 متر مربع" },
      { name: "عدد الطوابق", value: "15 طابق" },
      { name: "نوع البناء", value: "خرسانة مسلحة" },
    ],
    types: [
      { name: "شقق", value: "apartments" },
      { name: "فلل", value: "villas" },
    ],
    features: ["إطلالة رائعة", "تصميم عصري", "مواصلات قريبة"],
    properties: [
      {
        id: 1,
        project_id: 1,
        title: "عقار فاخر للبيع",
        slug: "luxury-property-1",
        address: "الرياض، حي النرجس",
        description: "عقار فاخر في موقع ممتاز",
        price: "1,250,000",
        pricePerMeter: "8,333",
        purpose: "sale",
        type: "residential",
        beds: 3,
        bath: 2,
        area: "150",
        size: "150",
        featured_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        gallery: [],
        location: {
          latitude: "24.7136",
          longitude: "46.6753",
        },
        status: true,
        featured: true,
        property_status: "available",
        features: [],
        faqs: [],
        category_id: 1,
        payment_method: null,
        video_url: null,
        virtual_tour: null,
        created_at: "2024-01-15",
        updated_at: "2024-12-01",
      },
      {
        id: 2,
        project_id: 1,
        title: "شقة للإيجار",
        slug: "apartment-rent-1",
        address: "الرياض، حي العليا",
        description: "شقة حديثة للإيجار",
        price: "5,000",
        pricePerMeter: "33",
        purpose: "rent",
        type: "residential",
        beds: 2,
        bath: 1,
        area: "120",
        size: "120",
        featured_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        gallery: [],
        location: {
          latitude: "24.7136",
          longitude: "46.6753",
        },
        status: true,
        featured: false,
        property_status: "available",
        features: [],
        faqs: [],
        category_id: 1,
        payment_method: "monthly",
        video_url: null,
        virtual_tour: null,
        created_at: "2024-01-15",
        updated_at: "2024-12-01",
      },
    ],
  };

  // جلب بيانات المشروع
  const fetchProject = async () => {
    // ⭐ NEW: Use mock data in Live Editor
    if (isLiveEditor) {
      setProject(mockProject);
      setLoadingProject(false);
      setMainImage(mockProject.image || "");
      setMainImageIndex(0);
      setSelectedImage(mockProject.image || "");
      return;
    }

    try {
      setLoadingProject(true);
      setProjectError(null);

      const finalTenantId = hookTenantId || tenantId;
      if (!finalTenantId) {
        setLoadingProject(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${finalTenantId}/projects/${props.projectSlug}`,
      );

      if (response.data && response.data.project) {
        setProject(response.data.project);
      } else if (response.data) {
        setProject(response.data);
      } else {
        setProjectError("المشروع غير موجود");
      }
    } catch (error) {
      console.error("ProjectDetails2: Error fetching project:", error);
      setProjectError("حدث خطأ في تحميل بيانات المشروع");
    } finally {
      setLoadingProject(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // جلب بيانات المشروع عند تحميل المكون
  useEffect(() => {
    // ⭐ NEW: In Live Editor, always use mock data
    if (isLiveEditor) {
      fetchProject();
      return;
    }

    const finalTenantId = hookTenantId || tenantId;
    if (finalTenantId && props.projectSlug) {
      fetchProject();
    }
  }, [hookTenantId, tenantId, props.projectSlug, isLiveEditor]);

  // تحديث الصورة الرئيسية عند تحميل المشروع
  useEffect(() => {
    if (project?.image) {
      setMainImage(project.image);
      setMainImageIndex(0);
      setSelectedImage(project.image);
    }
  }, [project]);

  // صور المشروع - computed value (includes main images + floor planning images)
  const projectImages =
    project && project.image
      ? [
          project.image,
          // Filter out the main image if it exists in images array to avoid duplicates
          ...(project.images || []).filter(
            (img) => img && img.trim() !== "" && img !== project.image,
          ),
          // Filter out the main image if it exists in floor planning images to avoid duplicates
          ...(project.floorplans || []).filter(
            (img) => img && img.trim() !== "" && img !== project.image,
          ),
        ].filter((img) => img && img.trim() !== "")
      : []; // Filter out empty images

  // Get all images (main images + floor planning images)
  const getAllImages = () => {
    const allImages = [];
    if (project?.image) {
      allImages.push(project.image);
    }
    if (project?.images) {
      // Filter out the main image if it exists in images array to avoid duplicates
      const additionalImages = project.images.filter(
        (img) => img && img.trim() !== "" && img !== project.image,
      );
      allImages.push(...additionalImages);
    }
    if (project?.floorplans) {
      // Filter out the main image if it exists in floor planning images to avoid duplicates
      const floorImages = project.floorplans.filter(
        (img) => img && img.trim() !== "" && img !== project.image,
      );
      allImages.push(...floorImages);
    }
    // Filter out empty images and remove duplicates
    const filtered = allImages.filter((img) => img && img.trim() !== "");
    // Remove duplicates by converting to Set and back to array
    return Array.from(new Set(filtered));
  };

  // Navigation functions for dialog
  const handlePreviousImage = () => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      const currentIndex = selectedImageIndex;
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setSelectedImage(allImages[previousIndex]);
      setSelectedImageIndex(previousIndex);
    }
  };

  const handleNextImage = () => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      const currentIndex = selectedImageIndex;
      const nextIndex =
        currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(allImages[nextIndex]);
      setSelectedImageIndex(nextIndex);
    }
  };

  const handleImageClick = (imageSrc: string, index?: number) => {
    if (imageSrc && imageSrc.trim() !== "") {
      setSelectedImage(imageSrc);
      setSelectedImageIndex(index || 0);
      setIsDialogOpen(true);
    }
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    // Update main image and index when clicking thumbnail
    setMainImage(imageSrc);
    setMainImageIndex(index);
    // Also open dialog
    handleImageClick(imageSrc, index);
  };

  // Navigation functions for main image (same logic as dialog)
  const handleMainImagePrevious = () => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      const currentIndex = mainImageIndex;
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setMainImage(allImages[previousIndex]);
      setMainImageIndex(previousIndex);
    }
  };

  const handleMainImageNext = () => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      const currentIndex = mainImageIndex;
      const nextIndex =
        currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setMainImage(allImages[nextIndex]);
      setMainImageIndex(nextIndex);
    }
  };

  // Show loading skeleton
  if (tenantLoading || loadingProject) {
    return (
      <main className="w-full" dir="rtl">
        <section
          className="relative w-full overflow-hidden"
          style={{ height: mergedData.hero?.height || "500px" }}
        >
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        </section>
        <div
          className="container mx-auto px-4 pb-12"
          style={{ maxWidth: mergedData.layout?.maxWidth }}
        >
          <div className="relative h-[600px] w-full bg-gray-200 rounded-lg animate-pulse mt-[-12rem]"></div>
        </div>
      </main>
    );
  }

  // Show error if no tenant ID
  if (!hookTenantId && !tenantId) {
    return (
      <main className="w-full" dir="rtl">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-yellow-600 font-medium">
            لم يتم العثور على معرف الموقع
          </p>
        </div>
      </main>
    );
  }

  // Show error if project failed to load
  if (projectError || !project) {
    return (
      <main className="w-full" dir="rtl">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-red-600 font-medium">
            {projectError || "المشروع غير موجود"}
          </p>
          <button
            onClick={() => fetchProject()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full" dir="rtl">
      {/* BEGIN: Top Hero Image Section - Full Width */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: mergedData.hero?.height || "500px" }}
      >
        <Image
          src="/images/placeholders/projectDetails2/hero.jpg"
          alt={project.title || "صورة المشروع"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#361c16",
            opacity: 0.8,
          }}
        />

        {/* Overlay Text */}
        <div className="container mx-auto px-4 absolute top-[13rem] left-0 right-0">
          <div
            className="flex flex-row justify-between items-center"
            dir="rtl"
            style={{ maxWidth: mergedData.layout?.maxWidth }}
          >
            <div className="text-white z-[10]">
              <h1
                className="text-3xl md:text-4xl font-bold drop-shadow-md text-right"
                style={{
                  fontSize: mergedData.typography?.title?.fontSize?.desktop,
                }}
              >
                {project.title}
              </h1>
            </div>
            {/* Price Badge */}
            {((project.minPrice &&
              project.minPrice.trim() !== "" &&
              parseFloat(project.minPrice) > 0) ||
              (project.maxPrice &&
                project.maxPrice.trim() !== "" &&
                parseFloat(project.maxPrice) > 0) ||
              (project.price && project.price.trim() !== "")) && (
              <div className="z-[2]">
                <span
                  className="text-white py-2 px-4 rounded font-bold text-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  {project.minPrice &&
                  project.maxPrice &&
                  parseFloat(project.minPrice) > 0 &&
                  parseFloat(project.maxPrice) > 0
                    ? `${project.minPrice} - ${project.maxPrice}`
                    : project.price
                      ? project.price
                      : project.minPrice && parseFloat(project.minPrice) > 0
                        ? project.minPrice
                        : project.maxPrice && parseFloat(project.maxPrice) > 0
                          ? project.maxPrice
                          : ""}{" "}
                  ريال سعودي
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BEGIN: Main Content Container */}
      <div
        className="container mx-auto px-4 pb-12 -mt-[12rem]"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        {/* BEGIN: Hero Section */}
        <section
          className="relative rounded-lg overflow-hidden shadow-xl"
          data-purpose="property-hero"
        >
          {/* Main Featured Image */}
          <div className="relative h-[600px] w-full group">
            {mainImage && project ? (
              <>
                <Image
                  src={mainImage}
                  alt={project.title || "صورة المشروع"}
                  fill
                  className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer rounded-lg"
                  priority
                  onClick={() => {
                    handleImageClick(mainImage, mainImageIndex);
                  }}
                />

                {/* Navigation arrows - show only if there's more than one image */}
                {getAllImages().length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMainImagePrevious();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                      aria-label="الصورة السابقة"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMainImageNext();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                      aria-label="الصورة التالية"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {mainImageIndex + 1} / {getAllImages().length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">لا توجد صورة متاحة</p>
                </div>
              </div>
            )}
            {logoImage && (
              <div className="absolute bottom-2 right-2 opacity-80">
                <div className="w-24 h-fit bg-white/20 rounded flex items-center justify-center">
                  <Image
                    src={logoImage}
                    alt="Logo"
                    width={160}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
        {/* END: Hero Section */}

        {/* BEGIN: Gallery Thumbnails */}
        {mergedData.gallery?.showThumbnails !== false &&
          projectImages.length > 0 && project && (
            <section
              className="pt-10"
              data-purpose="image-gallery"
            >
              <SwiperCarousel
                items={projectImages
                  .filter((imageSrc) => imageSrc && imageSrc.trim() !== "") // Filter out empty images
                  .map((imageSrc, index) => (
                    <div key={index} className="relative h-[12rem] md:h-[180px]">
                      <Image
                        src={imageSrc}
                        alt={`${project.title || "المشروع"} - صورة ${index + 1}`}
                        fill
                        className={`w-full h-full object-cover cursor-pointer rounded-lg transition-all duration-300 border-2 ${
                          mainImage === imageSrc ? "" : "border-transparent"
                        }`}
                        style={
                          mainImage === imageSrc
                            ? {
                                borderColor: primaryColor,
                                borderWidth: "2px",
                              }
                            : {}
                        }
                        onClick={() => handleThumbnailClick(imageSrc, index)}
                      />
                    </div>
                  ))}
                space={16}
                autoplay={true}
                desktopCount={4}
                slideClassName="!h-[12rem] md:!h-[180px]"
              />
            </section>
          )}
        {/* END: Gallery Thumbnails */}

        {/* BEGIN: Main Grid Layout - Two Columns (Description & Specs | Video & Map) */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10"
          style={{ gap: mergedData.layout?.gap || "3rem" }}
          dir="rtl"
        >
          {/* Right Column: Description & Specs */}
          <div className="space-y-12">
            {/* Property Description */}
            {mergedData.displaySettings?.showDescription !== false && (
              <section className="bg-transparent rounded-lg" data-purpose="description-block">
                <h2
                  className="text-3xl font-bold mb-6 text-right"
                  style={{ color: mergedData.styling?.textColor || primaryColor }}
                >
                  {mergedData.content?.descriptionTitle || "وصف المشروع"}
                </h2>
                <p
                  className="leading-relaxed text-right text-lg whitespace-pre-line"
                  style={{ color: mergedData.styling?.textColor }}
                >
                  {project.description || "لا يوجد وصف متاح لهذا المشروع"}
                </p>
              </section>
            )}

            {/* Specs Section */}
            {mergedData.displaySettings?.showSpecs !== false ? (
              <section className="bg-transparent" data-purpose="property-specs">
                <h2
                  className="text-3xl font-bold mb-8 text-right"
                  style={{
                    color: mergedData.styling?.textColor || primaryColor,
                  }}
                >
                  {mergedData.content?.specsTitle || "مواصفات المشروع"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
                  {/* Developer */}
                  {project.developer && project.developer.trim() !== "" ? (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{
                          color: mergedData.styling?.textColor || primaryColor,
                        }}
                      >
                        المطور: {project.developer}
                      </span>
                    </div>
                  ) : null}

                  {/* Units */}
                  {project.units && project.units > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{
                          color: mergedData.styling?.textColor || primaryColor,
                        }}
                      >
                        عدد الوحدات: {project.units}
                      </span>
                    </div>
                  ) : null}

                  {/* Completion Date */}
                  {project.completionDate &&
                  project.completionDate.trim() !== "" ? (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{
                          color:
                            mergedData.styling?.textColor || primaryColor,
                        }}
                      >
                        تاريخ التسليم:{" "}
                        {new Date(project.completionDate).toLocaleDateString(
                          "ar-US",
                        )}
                      </span>
                    </div>
                  ) : null}

                  {/* Address */}
                  {project.address && project.address.trim() !== "" ? (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                          <path
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg text-center"
                        style={{
                          color: mergedData.styling?.textColor || primaryColor,
                        }}
                      >
                        {project.address}
                      </span>
                    </div>
                  ) : null}

                  {/* Amenities */}
                  {project.amenities && project.amenities.length > 0 ? (
                    <div className="flex flex-col items-center justify-center col-span-2 md:col-span-3">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {project.amenities.slice(0, 6).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${primaryColor}20`,
                              color:
                                mergedData.styling?.textColor || primaryColor,
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
          {/* END Right Column */}

          {/* Left Column: Video & Map */}
          <div className="space-y-12">
            {/* Video */}
            {mergedData.displaySettings?.showVideoUrl &&
              project.videoUrl &&
              project.videoUrl.trim() !== "" && (
                <section
                  className="rounded-lg overflow-hidden shadow-md bg-black relative h-64"
                  data-purpose="video-section"
                >
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster={project.image || undefined}
                    >
                      <source src={project.videoUrl} type="video/mp4" />
                      متصفحك لا يدعم عرض الفيديو.
                    </video>
                  </div>
                </section>
              )}

            {/* Map */}
            {mergedData.displaySettings?.showMap &&
              project.location &&
              project.location.lat &&
              project.location.lng && (
                <section
                  className="rounded-lg overflow-hidden shadow-md border-4 border-white h-[550px] relative"
                  data-purpose="map-section"
                >
                  <iframe
                    src={`https://maps.google.com/maps?q=${project.location.lat},${project.location.lng}&hl=ar&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع المشروع"
                  />
                  <div className="mt-4 text-center">
                    <a
                      href={`https://maps.google.com/?q=${project.location.lat},${project.location.lng}&entry=gps`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: primaryColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          primaryColorHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor;
                      }}
                    >
                      <MapPinIcon className="w-4 h-4" />
                      فتح في خرائط جوجل
                    </a>
                  </div>
                </section>
              )}
          </div>
          {/* END Left Column */}
        </div>
        {/* END: Main Grid Layout */}

        {/* BEGIN: Related Properties Grid */}
        {project.properties && project.properties.length > 0 ? (
          <section className="mt-16" data-purpose="related-properties">
            <h2
              className="text-3xl font-bold mb-8 text-right"
              style={{
                color: mergedData.styling?.textColor || primaryColor,
              }}
            >
              العقارات المرتبطة بهذا المشروع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {project.properties.map((property) => {
                // Transform API property data to PropertyCard3 format
                const cardProperty = {
                  id: String(property.id),
                  slug: property.slug,
                  title: property.title,
                  district: property.address || "",
                  price: property.price || "0",
                  views: 0,
                  bedrooms: property.beds || 0,
                  bathrooms: property.bath || 0,
                  area: property.area || property.size || "",
                  type: property.type || "",
                  transactionType: property.purpose === "sale" ? "للبيع" : property.purpose === "rent" ? "للإيجار" : "",
                  image: property.featured_image || "",
                  status: property.property_status === "available" || property.status === true ? "متاح" : property.property_status || "غير متاح",
                  createdAt: property.created_at,
                  description: property.description,
                  features: property.features || [],
                  location: property.location
                    ? {
                        lat: parseFloat(property.location.latitude),
                        lng: parseFloat(property.location.longitude),
                        address: property.address || "",
                      }
                    : undefined,
                };

                return (
                  <PropertyCard3
                    key={property.id}
                    property={cardProperty}
                    showImage={true}
                    showPrice={true}
                    showDetails={false}
                    showViews={false}
                    showStatus={false}
                  />
                );
              })}
            </div>
          </section>
        ) : null}
        {/* END: Related Properties Grid */}

        {/* BEGIN: Contact Form - COMMENTED OUT */}
        {/* {mergedData.displaySettings?.showContactForm && (
              <section
                className="text-white p-8 rounded-lg h-fit"
                data-purpose="contact-form"
                style={{
                  backgroundColor:
                    mergedData.styling?.formBackgroundColor || primaryColor,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  className="text-2xl font-bold mb-2 text-right"
                  style={{
                    color: mergedData.styling?.formTextColor || "#ffffff",
                  }}
                >
                  {mergedData.content?.contactFormTitle ||
                    "استفسر عن هذا المشروع"}
                </h2>
                <p
                  className="text-sm mb-6 text-right"
                  style={{
                    color: mergedData.styling?.formTextColor
                      ? `${mergedData.styling.formTextColor}CC`
                      : "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {mergedData.content?.contactFormDescription ||
                    "استفسر عن المشروع واملأ البيانات لهذا المشروع"}
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                        style={
                          {
                            "--tw-ring-color": primaryColor,
                          } as React.CSSProperties
                        }
                        placeholder="اسم العميل"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                        style={
                          {
                            "--tw-ring-color": primaryColor,
                          } as React.CSSProperties
                        }
                        placeholder="رقم الهاتف"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                        style={
                          {
                            "--tw-ring-color": primaryColor,
                          } as React.CSSProperties
                        }
                        placeholder="البريد الإلكتروني"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <textarea
                      className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                      style={
                        {
                          "--tw-ring-color": primaryColor,
                        } as React.CSSProperties
                      }
                      placeholder="الرسالة"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <button
                    className="w-full font-bold py-3 rounded transition-colors shadow-md text-lg"
                    style={{
                      backgroundColor:
                        mergedData.styling?.formButtonBackgroundColor ||
                        "#d4b996",
                      color:
                        mergedData.styling?.formButtonTextColor || "#7a5c43",
                    }}
                    type="submit"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {mergedData.content?.submitButtonText || "أرسل استفسارك"}
                  </button>
                </form>
              </section>
            )} */}
      </div>
      {/* END: Main Content Container */}

      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة المشروع</DialogTitle>
          {selectedImage && selectedImage.trim() !== "" && project && (
            <div className="relative w-full h-[80vh] group">
              <Image
                src={selectedImage}
                alt={project?.title || "صورة المشروع"}
                fill
                className="object-contain rounded-lg"
              />

              {/* أسهم التنقل - تظهر فقط إذا كان هناك أكثر من صورة واحدة */}
              {getAllImages().length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="الصورة السابقة"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="الصورة التالية"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* عداد الصور */}
              {getAllImages().length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {getAllImages().length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
