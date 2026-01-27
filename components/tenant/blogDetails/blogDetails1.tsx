"use client";

import { useState, useEffect } from "react";
import {
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  MessageCircleIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultBlogDetails1Data } from "@/context/editorStoreFunctions/blogDetailsFunctions";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import SwiperCarousel from "@/components/ui/swiper-carousel2";

// ═══════════════════════════════════════════════════════════
// BLOG INTERFACE - Based on API response structure
// ═══════════════════════════════════════════════════════════
interface Blog {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string; // Full HTML content
  excerpt: string | null;
  thumbnail: {
    id: number;
    url: string;
    type: string;
    created_at: string;
  } | null;
  status: "published" | "draft";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories: Array<{
    id: number;
    name: string;
  }>;
  media: Array<{
    id: number;
    url: string;
    type: string;
  }>;
  author: {
    id: number;
    name: string;
  } | null;
}

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface blogDetails1Props {
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
  };
  content?: {
    descriptionTitle?: string;
  };
  displaySettings?: {
    showDescription?: boolean;
    showAuthor?: boolean;
    showCategories?: boolean;
    showPublishedDate?: boolean;
  };
  gallery?: {
    showThumbnails?: boolean;
    thumbnailGridColumns?: number;
    thumbnailHeight?: string;
  };
  whatsApp?: {
    showButton?: boolean;
    buttonText?: string;
    phoneNumber?: string;
  };

  // Required prop for fetching blog data
  blogSlug: string;

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function blogDetails1(props: blogDetails1Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "blogDetails1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const blogDetailsStates = useEditorStore((s) => s.blogDetailsStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Tenant ID hook
  const { tenantId: tenantIdFromHook, isLoading: tenantLoading } =
    useTenantId();
  const finalTenantId = tenantId || tenantIdFromHook;

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
          if (
            (component as any).type === "blogDetails" &&
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
          if (
            (component as any).type === "blogDetails" &&
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
              ...getDefaultBlogDetails1Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultBlogDetails1Data(),
              ...props,
            };

      ensureComponentVariant("blogDetails", uniqueId, initialData);
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
    ? blogDetailsStates?.[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("blogDetails", uniqueId) || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultBlogDetails1Data();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data
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
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. BLOG DATA FETCHING
  // ─────────────────────────────────────────────────────────

  // Check if we're in Live Editor
  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  // Mock data for Live Editor
  const mockBlog: Blog = {
    id: 1,
    user_id: 1430,
    title: "مقال تجريبي عن العقارات",
    slug: "test-article",
    content: "<p>هذا محتوى تجريبي للمقال. يحتوي على معلومات مفيدة عن العقارات والاستثمار.</p>",
    excerpt: "مقال تجريبي عن العقارات",
    thumbnail: {
      id: 10,
      url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
      type: "image",
      created_at: "2026-01-26T01:21:57.000000Z",
    },
    status: "published",
    published_at: "2026-01-26T01:21:59.000000Z",
    created_at: "2026-01-26T01:21:59.000000Z",
    updated_at: "2026-01-26T01:21:59.000000Z",
    categories: [
      { id: 1, name: "عقارات" },
      { id: 2, name: "استثمار" },
    ],
    media: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        type: "image",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        type: "image",
      },
    ],
    author: {
      id: 1430,
      name: "أحمد محمد",
    },
  };

  // Blog data state
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  // Image states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [blogId, setBlogId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // جلب بيانات المدونة
  const fetchBlog = async () => {
    // ⭐ Use mock data in Live Editor
    if (isLiveEditor) {
      setBlog(mockBlog);
      setLoadingBlog(false);
      setMainImage(mockBlog.thumbnail?.url || "");
      setMainImageIndex(0);
      return;
    }

    try {
      setLoadingBlog(true);
      setBlogError(null);

      // Always use /api/posts/{slug} - no tenant ID needed
      const response = await axiosInstance.get(
        `/api/posts/${props.blogSlug}`,
      );

      // Handle API response format: response.data.data
      if (response.data && response.data.data) {
        setBlog(response.data.data);
        // Set main image from thumbnail
        if (response.data.data.thumbnail?.url) {
          setMainImage(response.data.data.thumbnail.url);
        }
      } else {
        setBlogError("المقال غير موجود");
      }
    } catch (error) {
      setBlogError("حدث خطأ في تحميل بيانات المقال");
    } finally {
      setLoadingBlog(false);
    }
  };

  // Get all images (thumbnail + media)
  const getAllImages = () => {
    const allImages = [];
    const seen = new Set<string>(); // Track seen images to avoid duplicates
    
    // Add thumbnail if exists
    if (blog?.thumbnail?.url) {
      allImages.push(blog.thumbnail.url);
      seen.add(blog.thumbnail.url);
    }
    
    // Add media images
    if (blog?.media && blog.media.length > 0) {
      const mediaImages = blog.media
        .filter((item) => item.type === "image" && item.url)
        .map((item) => item.url)
        .filter((url) => url && url.trim() !== "");
      // Filter out thumbnail if it exists in media to avoid duplicates
      const additionalImages = mediaImages.filter(
        (url) => url && !seen.has(url),
      );
      allImages.push(...additionalImages);
    }
    
    // Filter out empty images and remove duplicates
    return Array.from(new Set(allImages.filter((img) => img && img.trim() !== "")));
  };

  // Navigation functions for main image
  const handleMainImagePrevious = () => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      setMainImageIndex((currentIndex) => {
        const previousIndex =
          currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
        setMainImage(allImages[previousIndex]);
        return previousIndex;
      });
    }
  };

  const handleMainImageNext = () => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      setMainImageIndex((currentIndex) => {
        const nextIndex =
          currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
        setMainImage(allImages[nextIndex]);
        return nextIndex;
      });
    }
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

  // وظائف السحب باليد
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePreviousImage();
    }
  };

  // جلب بيانات المدونة عند تحميل المكون
  useEffect(() => {
    // ⭐ In Live Editor, always use mock data
    if (isLiveEditor) {
      fetchBlog();
      return;
    }

    if (props.blogSlug) {
      fetchBlog();
    }
  }, [props.blogSlug, isLiveEditor]);

  // تحديث الصورة الرئيسية عند تحميل المدونة
  useEffect(() => {
    if (blog?.id && blog?.thumbnail?.url) {
      // إذا كان هذا مقال جديد (id مختلف)، قم بإعادة تعيين الصورة
      if (blog.id !== blogId) {
        setBlogId(blog.id);
        setMainImage(blog.thumbnail.url);
        // Find the index of the thumbnail in getAllImages()
        const allImages = getAllImages();
        const index = allImages.findIndex((img) => img === blog.thumbnail?.url);
        setMainImageIndex(index >= 0 ? index : 0);
      } else if (!mainImage) {
        // إذا لم تكن هناك صورة رئيسية، قم بتعيينها
        setMainImage(blog.thumbnail.url);
        const allImages = getAllImages();
        const index = allImages.findIndex((img) => img === blog.thumbnail?.url);
        setMainImageIndex(index >= 0 ? index : 0);
      }
    }
  }, [blog?.id, blog?.thumbnail?.url]);

  // صور المدونة - computed value
  const blogImages = getAllImages();

  // Get primary color from tenantData or mergedData
  const primaryColorFromTenant =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"; // emerald-600 default

  const primaryColor =
    mergedData.styling?.primaryColor || primaryColorFromTenant;

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    if (!hex || !hex.startsWith("#")) return "#047857"; // emerald-700
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

  const textColor = mergedData.styling?.textColor || "#374151";
  const secondaryTextColor = mergedData.styling?.secondaryTextColor || "#6b7280";

  // Get WhatsApp data from mergedData
  const getWhatsAppData = () => {
    if (mergedData.whatsApp) {
      return {
        showButton: mergedData.whatsApp.showButton || false,
        buttonText: mergedData.whatsApp.buttonText || "استفسار عن طريق الواتساب",
        phoneNumber: mergedData.whatsApp.phoneNumber || "",
      };
    }
    return {
      showButton: false,
      buttonText: "استفسار عن طريق الواتساب",
      phoneNumber: "",
    };
  };

  const whatsAppData = getWhatsAppData();

  // Get logo image from tenantData
  const logoImage = tenantData?.globalComponentsData?.header?.logo?.image ||
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`;

  // Sharing functions
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const getShareText = () => {
    if (!blog) return "";
    return `اقرأ هذا المقال: ${blog.title}`;
  };

  const shareToFacebook = () => {
    const url = getCurrentUrl();
    const text = getShareText();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareToTwitter = () => {
    const url = getCurrentUrl();
    const text = getShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const url = getCurrentUrl();
    const text = getShareText();
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    window.open(linkedinUrl, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = () => {
    const url = getCurrentUrl();
    const text = getShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      const url = getCurrentUrl();
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Show skeleton loading while tenant or blog is loading
  if (tenantLoading || loadingBlog) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
            {/* المحتوى الرئيسي - Skeleton */}
            <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
              <div className="flex flex-col gap-y-8 lg:gap-y-10">
                {/* العنوان - Skeleton */}
                <div className="flex flex-row items-center justify-between">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* تفاصيل المقال - Skeleton */}
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 md:h-6"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 md:h-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  </div>
                </div>

                {/* تفاصيل المقال في شبكة - Skeleton */}
                <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex flex-row gap-x-2 md:gap-x-6 items-center"
                    >
                      <div className="flex flex-row gap-x-2 items-center">
                        <div
                          className="w-4 h-4 rounded animate-pulse"
                          style={{
                            backgroundColor: `${primaryColor}33`,
                          }}
                        ></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* معرض الصور - Skeleton */}
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
                <div className="relative h-80 md:h-80 xl:h-96 mb-6 bg-gray-200 rounded-lg animate-pulse">
                  <div className="absolute bottom-2 right-2 opacity-50">
                    <div className="w-12 h-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative h-24 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error if blog failed to load
  if (blogError || !blog) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium">
              {blogError || "المقال غير موجود"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من صحة رابط المقال
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المحتوى الرئيسي */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              {/* العنوان وزر المشاركة */}
              <div className="flex flex-row items-center justify-between">
                <h1 className="font-bold text-gray-600 text-xl leading-6 md:text-2xl md:leading-7">
                  {blog.title}
                </h1>
                <div className="sharesocials flex flex-row gap-x-6" dir="ltr">
                  <button
                    className="cursor-pointer"
                    onClick={() => setIsShareDialogOpen(true)}
                  >
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* تفاصيل المقال */}
              <div className="space-y-4">
                {blog.excerpt && (
                  <p className="text-gray-600 text-sm leading-6 font-normal md:text-base lg:text-lg lg:leading-7">
                    {blog.excerpt}
                  </p>
                )}

                {/* تاريخ النشر */}
                {mergedData.displaySettings?.showPublishedDate !== false &&
                  blog.published_at && (
                    <p
                      className="text-sm leading-6 font-normal md:text-base"
                      style={{ color: secondaryTextColor }}
                    >
                      {formatDate(blog.published_at)}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              {/* الصورة الأساسية */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6 group">
                {mainImage && blog ? (
                  <>
                    <Image
                      src={mainImage}
                      alt={blog.title || "صورة المقال"}
                      fill
                      className="w-full h-full object-cover cursor-pointer rounded-lg"
                      onClick={() => handleImageClick(mainImage, mainImageIndex)}
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

              {/* نص توضيحي - يظهر فقط عند وجود صور إضافية */}
              {blogImages.length > 1 && (
                <p className="text-xs text-gray-500 mb-2 text-center">
                  اضغط على أي صورة لفتحها في نافذة منبثقة
                </p>
              )}

              {/* Carousel للصور المصغرة - يظهر فقط عند وجود صور إضافية */}
              {mergedData.gallery?.showThumbnails !== false &&
                blogImages.length > 0 &&
                blog && (
                  <SwiperCarousel
                    items={blogImages
                      .filter((imageSrc) => imageSrc && imageSrc.trim() !== "")
                      .map((imageSrc, index) => (
                        <div key={index} className="relative h-[10rem] md:h-24">
                          <Image
                            src={imageSrc}
                            alt={`${blog.title || "المقال"} - صورة ${index + 1}`}
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
                          {logoImage && (
                            <div className="absolute bottom-2 right-2 opacity-80">
                              <div className="w-12 h-fit bg-white/20 rounded flex items-center justify-center">
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
                      ))}
                    space={16}
                    autoplay={true}
                    desktopCount={4}
                    slideClassName="!h-[10rem] md:!h-[96px]"
                  />
                )}
            </div>
          </div>
        </div>

        {/* القسم السفلي - عمودان */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأول - المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* تفاصيل المقال في شبكة */}
            <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
              {/* المؤلف */}
              {mergedData.displaySettings?.showAuthor !== false &&
                blog.author && (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <UserIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        المؤلف:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {blog.author.name}
                    </p>
                  </div>
                )}

              {/* تاريخ النشر */}
              {mergedData.displaySettings?.showPublishedDate !== false &&
                blog.published_at && (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <CalendarIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        تاريخ النشر:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {formatDate(blog.published_at)}
                    </p>
                  </div>
                )}

              {/* التصنيفات */}
              {mergedData.displaySettings?.showCategories !== false &&
                blog.categories &&
                blog.categories.length > 0 && (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6 col-span-2">
                    <div className="flex flex-row gap-x-2">
                      <TagIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        التصنيفات:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {blog.categories.map((cat) => cat.name).join("، ")}
                    </p>
                  </div>
                )}
            </div>

            {/* محتوى المقال */}
            {mergedData.displaySettings?.showDescription !== false && (
              <div className="mb-8 md:mb-18">
                <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                  <h2
                    className="text-gray-600 font-bold text-xl leading-6 lg:text-2xl lg:leading-7"
                    style={{ color: textColor }}
                  >
                    {mergedData.content?.descriptionTitle || "محتوى المقال"}
                  </h2>
                  <div
                    className="leading-relaxed text-right text-base lg:text-lg whitespace-pre-line"
                    style={{ color: textColor }}
                    dangerouslySetInnerHTML={{
                      __html: blog.content || "لا يوجد محتوى متاح لهذا المقال",
                    }}
                  />
                </div>
              </div>
            )}

            {/* WhatsApp Button */}
            {whatsAppData.showButton &&
              whatsAppData.phoneNumber &&
              whatsAppData.phoneNumber.trim() !== "" && (
                <div className="mt-8">
                  <a
                    href={`https://wa.me/${whatsAppData.phoneNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: "#25D366" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#20BA5A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#25D366";
                    }}
                  >
                    {/* WhatsApp Icon */}
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span>{whatsAppData.buttonText}</span>
                  </a>
                </div>
              )}
          </div>

          {/* العمود الثاني - يمكن إضافة محتوى إضافي هنا لاحقاً */}
          <div className="lg:col-span-1 space-y-8">
            {/* يمكن إضافة محتوى إضافي هنا */}
          </div>
        </div>
      </div>

      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة المقال</DialogTitle>
          {selectedImage && selectedImage.trim() !== "" && blog && (
            <div
              className="relative w-full h-[80vh] group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={selectedImage}
                alt={blog?.title || "صورة المقال"}
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
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="الصورة التالية"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
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

      {/* Dialog لمشاركة المقال */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-gray-800">
              مشاركة المقال
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-sm">
              شارك هذا المقال مع أصدقائك
            </p>

            {/* Social Media Icons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Facebook */}
              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
                <span className="text-sm font-medium">فيسبوك</span>
              </button>

              {/* Twitter */}
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <TwitterIcon className="w-5 h-5" />
                <span className="text-sm font-medium">تويتر</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={shareToLinkedIn}
                className="flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <LinkedinIcon className="w-5 h-5" />
                <span className="text-sm font-medium">لينكد إن</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareToWhatsApp}
                className="flex items-center justify-center gap-2 p-3 text-white rounded-lg transition-colors"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColorHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                }}
              >
                <MessageCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">واتساب</span>
              </button>
            </div>

            {/* Copy Link Button */}
            <div className="pt-4 border-t">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <CopyIcon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {copySuccess ? "تم النسخ!" : "نسخ الرابط"}
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
