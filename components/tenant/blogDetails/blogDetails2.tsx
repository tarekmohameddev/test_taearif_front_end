"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultBlogDetails2Data } from "@/context/editorStoreFunctions/blogDetailsFunctions";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
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
interface blogDetails2Props {
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
  };
  displaySettings?: {
    showDescription?: boolean;
    showSpecs?: boolean;
    showGallery?: boolean;
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
export default function blogDetails2(props: blogDetails2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "blogDetails2";
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
          // Use componentId === props.id (most reliable identifier)
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
          // Search by id (most reliable identifier)
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
              ...getDefaultBlogDetails2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultBlogDetails2Data(),
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
  const defaultData = getDefaultBlogDetails2Data();

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

  // جلب بيانات المدونة
  const fetchBlog = async () => {
    // ⭐ NEW: Use mock data in Live Editor
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
    // Add thumbnail if exists
    if (blog?.thumbnail?.url) {
      allImages.push(blog.thumbnail.url);
    }
    // Add media images
    if (blog?.media && blog.media.length > 0) {
      const mediaImages = blog.media
        .filter((item) => item.type === "image" && item.url)
        .map((item) => item.url)
        .filter((url) => url && url.trim() !== "");
      // Filter out thumbnail if it exists in media to avoid duplicates
      const additionalImages = mediaImages.filter(
        (url) => url !== blog.thumbnail?.url,
      );
      allImages.push(...additionalImages);
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

  // جلب بيانات المدونة عند تحميل المكون
  useEffect(() => {
    // ⭐ NEW: In Live Editor, always use mock data
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
    if (blog?.thumbnail?.url) {
      setMainImage(blog.thumbnail.url);
      setMainImageIndex(0);
    }
  }, [blog]);

  // صور المدونة - computed value (includes thumbnail + media)
  const blogImages = getAllImages();

  // Get primary color from tenantData or mergedData
  const primaryColorFromTenant =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#8b5f46";

  const primaryColor =
    mergedData.styling?.primaryColor || primaryColorFromTenant;

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    if (!hex || !hex.startsWith("#")) return "#6b4a3a";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#6b4a3a";

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

  const textColor = mergedData.styling?.textColor || "#967152";
  const formBackgroundColor =
    mergedData.styling?.formBackgroundColor || "#8b5f46";
  const formTextColor = mergedData.styling?.formTextColor || "#ffffff";
  const formButtonBackgroundColor =
    mergedData.styling?.formButtonBackgroundColor || "#d4b996";
  const formButtonTextColor =
    mergedData.styling?.formButtonTextColor || "#7a5c43";

  // Show skeleton loading while tenant or blog is loading
  if (tenantLoading || loadingBlog) {
    return (
      <main className="w-full" dir="rtl">
        <section
          className="relative w-full overflow-hidden animate-pulse"
          style={{ height: mergedData.hero?.height || "500px" }}
        >
          <div className="w-full h-full bg-gray-200" />
        </section>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  // Show error if blog failed to load
  if (blogError || !blog) {
    return (
      <main className="w-full" dir="rtl">
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
          alt={blog?.title || "صورة خلفية"}
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
      </section>

      {/* Overlay Text Top Right */}
      <div className="max-w-[1250px] mx-auto px-4 absolute top-[8rem] md:top-[13rem] left-0 right-0">
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
          dir="rtl"
        >
          <div className="text-white z-[10] w-full md:w-auto">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md text-right"
              style={{
                fontSize: mergedData.typography?.title?.fontSize?.desktop,
              }}
            >
              {blog.title}
            </h1>
          </div>
          {/* Overlay Text Top Left */}
          <div className="z-[2] w-full md:w-auto">
            <span
              className="text-white py-2 px-4 rounded font-bold text-base sm:text-lg md:text-xl inline-block"
              style={{ backgroundColor: primaryColor }}
            >
              {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* BEGIN: Main Content Container */}
      <div
        className="container mx-auto px-4 pb-12 -mt-[12rem]"
        style={{ maxWidth: mergedData.layout?.maxWidth || "1280px" }}
      >
        {/* BEGIN: Hero Section */}
        <section
          className="relative rounded-lg overflow-hidden shadow-xl"
          data-purpose="blog-hero"
        >
          {/* Main Featured Image */}
          <div className="relative h-[600px] w-full group">
            {mainImage ? (
              <>
                <Image
                  alt={blog.title || "صورة المقال"}
                  className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer rounded-lg"
                  src={mainImage}
                  fill
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
                <p className="text-gray-500">لا توجد صورة متاحة</p>
              </div>
            )}
          </div>
        </section>
        {/* END: Hero Section */}

        {/* BEGIN: Gallery Thumbnails */}
        {mergedData.gallery?.showThumbnails !== false &&
          blogImages.length > 0 && blog && (
            <section
              className="pt-10"
              data-purpose="image-gallery"
            >
              <SwiperCarousel
                items={blogImages
                  .filter((imageSrc) => imageSrc && imageSrc.trim() !== "") // Filter out empty images
                  .map((imageSrc, index) => (
                    <div key={index} className="relative h-[12rem] md:h-[180px]">
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

        {/* BEGIN: Main Content Layout */}
        <div
          className="mt-10"
          style={{ gap: mergedData.layout?.gap || "3rem" }}
          dir="rtl"
        >
          {/* Content Column */}
          <div className="space-y-12">
            {/* Blog Content */}
            {mergedData.displaySettings?.showDescription !== false && (
              <section
                className="bg-transparent rounded-lg"
                data-purpose="description-block"
              >
                <h2
                  className="text-3xl font-bold mb-6 text-right"
                  style={{ color: textColor }}
                >
                  {mergedData.content?.descriptionTitle || "محتوى المقال"}
                </h2>
                <p
                  className="leading-relaxed text-right text-lg whitespace-pre-line"
                  style={{ color: textColor }}
                >
                  <div dangerouslySetInnerHTML={{ __html: blog.content || "لا يوجد محتوى متاح لهذا المقال" }} />
                </p>
              </section>
            )}



            {/* No FAQs for blogs - removed */}
            {/* No project link for blogs - removed */}

            {/* Contact Form - COMMENTED OUT */}
            {/* {mergedData.displaySettings?.showContactForm !== false && (
              <section
                className="text-white p-8 rounded-lg h-fit"
                data-purpose="contact-form"
                style={{
                  backgroundColor: formBackgroundColor,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  className="text-2xl font-bold mb-2 text-right"
                  style={{ color: formTextColor }}
                >
                  {mergedData.content?.contactFormTitle ||
                    "استفسر عن هذا العقار"}
                </h2>
                <p
                  className="text-sm mb-6 text-right"
                  style={{ color: formTextColor, opacity: 0.8 }}
                >
                  {mergedData.content?.contactFormDescription ||
                    "استفسر عن المنزل واملأ البيانات لهذا العقار"}
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="اسم العميل"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="رقم الهاتف"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
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
                      className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                      placeholder="الرسالة"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      تم إرسال استفسارك بنجاح! سنتواصل معك قريباً.
                    </div>
                  )}
                  <button
                    className="w-full font-bold py-3 rounded transition-colors shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={formLoading}
                    style={{
                      backgroundColor: formButtonBackgroundColor,
                      color: formButtonTextColor,
                    }}
                  >
                    {formLoading
                      ? "جاري الإرسال..."
                      : mergedData.content?.submitButtonText || "أرسل استفسارك"}
                  </button>
                </form>
              </section>
            )} */}
          </div>
          {/* END Content Column */}
        </div>
      </div>
      {/* END: Main Content Container */}

      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة المقال</DialogTitle>
          {selectedImage && selectedImage.trim() !== "" && blog && (
            <div className="relative w-full h-[80vh] group">
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
    </main>
  );
}
