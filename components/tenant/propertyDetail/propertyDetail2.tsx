"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultpropertyDetail2Data } from "@/context/editorStoreFunctions/propertyDetailFunctions";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import SwiperCarousel from "@/components/ui/swiper-carousel2";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// PROPERTY INTERFACE
// ═══════════════════════════════════════════════════════════
interface Property {
  id: string;
  slug?: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms?: number;
  area?: string;
  type: string;
  transactionType: string;
  transactionType_en?: string;
  image: string;
  status?: string;
  description?: string;
  features?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  images?: string[];
  payment_method?: string;
  payment_method_en?: string;
  pricePerMeter?: string;
  building_age?: number;
  floors?: number;
  floor_number?: number;
  kitchen?: number;
  living_room?: number;
  majlis?: number;
  dining_room?: number;
  maid_room?: number;
  driver_room?: number;
  storage_room?: number;
  basement?: number;
  swimming_pool?: number;
  balcony?: number;
  garden?: number;
  elevator?: number;
  private_parking?: number;
  annex?: number;
  rooms?: number;
  length?: string;
  width?: string;
  street_width_north?: string;
  street_width_south?: string;
  street_width_east?: string;
  street_width_west?: string;
  facade_id?: number;
  building?: string | null;
  size?: string;
  floor_planning_image?: string[];
  video_url?: string;
  virtual_tour?: string;
  video_image?: string;
  faqs?: Array<{
    id: number;
    question: string;
    answer: string;
    displayOnPage: boolean;
  }>;
}

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface propertyDetail2Props {
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
    submitButtonText?: string;
  };
  displaySettings?: {
    showDescription?: boolean;
    showSpecs?: boolean;
    showContactForm?: boolean;
    showVideoUrl?: boolean;
    showMap?: boolean;
  };
  whatsApp?: {
    showButton?: boolean;
    buttonText?: string;
    phoneNumber?: string;
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

  // Required prop for fetching property data
  propertySlug: string;

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

const getTransactionTypeLabel = (
  transactionType?: string | null,
  transactionTypeEn?: string | null,
) => {
  const normalized = transactionType?.trim().toLowerCase();
  const normalizedEn = transactionTypeEn?.trim().toLowerCase();

  if (
    normalizedEn === "rent" ||
    normalizedEn === "lease" ||
    normalized === "rent" ||
    normalized === "للإيجار" ||
    normalized?.includes("إيجار") ||
    normalized?.includes("ايجار")
  ) {
    return "للإيجار";
  }

  return "للبيع";
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function propertyDetail2(props: propertyDetail2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "propertyDetail2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const propertyDetailStates = useEditorStore((s) => s.propertyDetailStates);

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
            (component as any).type === "propertyDetail" &&
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
            (component as any).type === "propertyDetail" &&
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
              ...getDefaultpropertyDetail2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultpropertyDetail2Data(),
              ...props,
            };

      ensureComponentVariant("propertyDetail", uniqueId, initialData);
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
    ? propertyDetailStates?.[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("propertyDetail", uniqueId) || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultpropertyDetail2Data();

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
  // 7. PROPERTY DATA FETCHING
  // ─────────────────────────────────────────────────────────

  // Check if we're in Live Editor
  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  // Mock data for Live Editor
  const mockProperty: Property = {
    id: "mock-property-1",
    slug: "mock-property",
    title: "عقار فاخر للبيع",
    district: "حي النرجس",
    price: "1,250,000",
    views: 1250,
    bedrooms: 3,
    bathrooms: 2,
    area: "150",
    type: "شقة",
    transactionType: "للبيع",
    transactionType_en: "sale",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    floor_planning_image: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description:
      "عقار فاخر للبيع في موقع استراتيجي. يتميز بمساحات واسعة وتصميم عصري يوفر جميع وسائل الراحة والرفاهية. العقار مجهز بأحدث التقنيات ويوفر إطلالة رائعة.",
    status: "available",
    location: {
      lat: 24.7136,
      lng: 46.6753,
      address: "الرياض، حي النرجس، شارع الملك فهد",
    },
    payment_method: "quarterly",
    pricePerMeter: "8,333",
    building_age: 5,
    floors: 10,
    floor_number: 5,
    kitchen: 1,
    living_room: 1,
    majlis: 1,
    dining_room: 1,
    maid_room: 1,
    driver_room: 1,
    storage_room: 1,
    basement: 0,
    swimming_pool: 1,
    balcony: 2,
    garden: 0,
    elevator: 1,
    private_parking: 2,
    length: "15",
    width: "10",
    video_url: "https://example.com/video.mp4",
    virtual_tour: "https://example.com/virtual-tour",
    faqs: [
      {
        id: 1,
        question: "ما هي مساحة العقار؟",
        answer: "مساحة العقار 150 متر مربع",
        displayOnPage: true,
      },
      {
        id: 2,
        question: "هل يوجد موقف سيارات؟",
        answer: "نعم، يوجد موقفان للسيارات",
        displayOnPage: true,
      },
    ],
  };

  // Property data state
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  // Image states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // FAQ states
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  // Function to toggle FAQ expansion
  const toggleFaq = (faqId: number) => {
    setExpandedFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  // Form handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      if (!finalTenantId) {
        setFormError("لم يتم العثور على معرف المستأجر");
        return;
      }

      if (!property?.slug) {
        setFormError("لم يتم العثور على معرف العقار");
        return;
      }

      // Validation
      if (!formData.name.trim()) {
        setFormError("يرجى إدخال اسمك");
        return;
      }

      if (!formData.phone.trim()) {
        setFormError("يرجى إدخال رقم الهاتف");
        return;
      }

      // Validate phone format
      const phoneRegex = /^\+?\d{7,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        setFormError("يرجى إدخال رقم هاتف صحيح (مثال: +966501234567)");
        return;
      }

      const payload: any = {
        propertySlug: property.slug,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
      };

      if (formData.email.trim()) {
        payload.customerEmail = formData.email.trim();
      }
      if (formData.message.trim()) {
        payload.message = formData.message.trim();
      }

      const response = await axiosInstance.post(
        `/api/v1/tenant-website/${finalTenantId}/reservations`,
        payload,
      );

      if (response.data.success) {
        setFormSuccess(true);
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
        // Hide success message after 3 seconds
        setTimeout(() => {
          setFormSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessage =
          errors.customerName?.[0] ||
          errors.customerPhone?.[0] ||
          errors.message?.[0] ||
          err.response?.data?.message ||
          "حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى";
        setFormError(errorMessage);
      } else {
        setFormError(
          err.response?.data?.message ||
            "حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى",
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // جلب بيانات العقار
  const fetchProperty = async () => {
    // ⭐ NEW: Use mock data in Live Editor
    if (isLiveEditor) {
      setProperty(mockProperty);
      setLoadingProperty(false);
      setMainImage(mockProperty.image || "");
      return;
    }

    try {
      setLoadingProperty(true);
      setPropertyError(null);

      if (!finalTenantId) {
        setLoadingProperty(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${finalTenantId}/properties/${props.propertySlug}`,
      );

      // Handle new API response format
      if (response.data && response.data.property) {
        setProperty(response.data.property);
      } else if (response.data) {
        // If the property is returned directly
        setProperty(response.data);
      } else {
        setPropertyError("العقار غير موجود");
      }
    } catch (error) {
      setPropertyError("حدث خطأ في تحميل بيانات العقار");
    } finally {
      setLoadingProperty(false);
    }
  };

  // Get all images (main images + floor planning images)
  const getAllImages = () => {
    const allImages = [];
    if (property?.image) {
      allImages.push(property.image);
    }
    if (property?.images) {
      allImages.push(...property.images);
    }
    if (property?.floor_planning_image) {
      allImages.push(...property.floor_planning_image);
    }
    return allImages;
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
    handleImageClick(imageSrc, index);
  };

  // جلب بيانات العقار عند تحميل المكون
  useEffect(() => {
    // ⭐ NEW: In Live Editor, always use mock data
    if (isLiveEditor) {
      fetchProperty();
      return;
    }

    if (finalTenantId && props.propertySlug) {
      fetchProperty();
    }
  }, [finalTenantId, props.propertySlug, isLiveEditor]);

  // تحديث الصورة الرئيسية عند تحميل العقار
  useEffect(() => {
    if (property?.image) {
      setMainImage(property.image);
    }
  }, [property]);

  // صور العقار - computed value
  const propertyImages =
    property && property.image
      ? [
          property.image,
          ...(property.images || []), // Add additional images if available
        ].filter((img) => img && img.trim() !== "")
      : []; // Filter out empty images

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

  // Show skeleton loading while tenant or property is loading
  if (tenantLoading || loadingProperty) {
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

  // Show error if property failed to load
  if (propertyError || !property) {
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
                {propertyError || "العقار غير موجود"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                تأكد من صحة رابط العقار
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
          alt={property?.title || "صورة خلفية"}
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
              {property.title}
            </h1>
          </div>
          {/* Overlay Text Top Left */}
          <div className="z-[2] w-full md:w-auto">
            <span
              className="text-white py-2 px-4 rounded font-bold text-base sm:text-lg md:text-xl inline-block"
              style={{ backgroundColor: primaryColor }}
            >
              {property.price} ريال سعودي
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
          data-purpose="property-hero"
        >
          {/* Main Featured Image */}
          <div className="relative h-[600px] w-full">
            {mainImage ? (
              <Image
                alt={property.title || "صورة العقار"}
                className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer rounded-lg"
                src={mainImage}
                fill
                priority
                onClick={() => handleImageClick(mainImage, 0)}
              />
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
          propertyImages.length > 0 && property && (
            <section
              className="pt-10"
              data-purpose="image-gallery"
            >
              <SwiperCarousel
                items={propertyImages
                  .filter((imageSrc) => imageSrc && imageSrc.trim() !== "") // Filter out empty images
                  .map((imageSrc, index) => (
                    <div key={index} className="relative h-[12rem] md:h-[180px]">
                      <Image
                        src={imageSrc}
                        alt={`${property.title || "العقار"} - صورة ${index + 1}`}
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

        {/* BEGIN: Property Description */}
        {mergedData.displaySettings?.showDescription !== false && (
          <section
            className="bg-transparent py-10 rounded-lg"
            data-purpose="description-block"
            dir="rtl"
          >
            <h2
              className="text-3xl font-bold mb-6 text-right"
              style={{ color: textColor }}
            >
              {mergedData.content?.descriptionTitle || "وصف العقار"}
            </h2>
            <p
              className="leading-relaxed text-right text-lg whitespace-pre-line"
              style={{ color: textColor }}
            >
              {property.description || "لا يوجد وصف متاح لهذا العقار"}
            </p>
          </section>
        )}
        {/* END: Property Description */}

        {/* BEGIN: Main Grid Layout (Specs & Video / Map & Form) */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          style={{ gap: mergedData.layout?.gap || "3rem" }}
        >
          {/* Right Column: Specs & Form */}
          <div className="space-y-12 order-2 lg:order-1">
            {/* Specs Section */}
            {mergedData.displaySettings?.showSpecs !== false ? (
              <section className="bg-transparent" data-purpose="property-specs">
                <h2
                  className="text-3xl font-bold mb-8 text-right"
                  style={{ color: textColor }}
                >
                  {mergedData.content?.specsTitle || "مواصفات العقار"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
                  {/* غرف النوم */}
                  {property.bedrooms > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        غرف النوم: {property.bedrooms}
                      </span>
                    </div>
                  ) : null}

                  {/* الحمامات */}
                  {property.bathrooms && property.bathrooms > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        الحمامات: {property.bathrooms}
                      </span>
                    </div>
                  ) : null}

                  {/* المساحة */}
                  {property.area && parseFloat(property.area) > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        المساحة: {property.area} م²
                      </span>
                    </div>
                  ): null}

                  {/* Size (إذا كان مختلف عن area) */}
                  {property.size &&
                    property.size !== property.area &&
                    parseFloat(property.size) > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          الحجم: {property.size} م²
                      </span>
                    </div>
                  ) : null}

                  {/* الطول */}
                  {property.length && parseFloat(property.length) > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        الطول: {property.length} م
                      </span>
                    </div>
                  ) : null}

                  {/* العرض */}
                  {property.width && parseFloat(property.width) > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        العرض: {property.width} م
                      </span>
                    </div>
                  ) : null}

                  {/* عدد الغرف */}
                  {property.rooms && property.rooms > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        عدد الغرف: {property.rooms}
                      </span>
                    </div>
                  ) : null}

                  {/* المطابخ */}
                  {property.kitchen && property.kitchen > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        المطابخ: {property.kitchen}
                      </span>
                    </div>
                  ) : null}

                  {/* الصالات */}
                  {property.living_room && property.living_room > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        الصالات: {property.living_room}
                      </span>
                    </div>
                  ) : null}

                  {/* المجالس */}
                  {property.majlis && property.majlis > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        المجالس: {property.majlis}
                      </span>
                    </div>
                  ) : null}

                  {/* غرف الطعام */}
                  {property.dining_room && property.dining_room > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        غرف الطعام: {property.dining_room}
                      </span>
                    </div>
                  ) : null}

                  {/* غرف الخادمة */}
                  {property.maid_room && property.maid_room > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        غرف الخادمة: {property.maid_room}
                      </span>
                    </div>
                  ) : null}

                  {/* غرف السائق */}
                  {property.driver_room && property.driver_room > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        غرف السائق: {property.driver_room}
                      </span>
                    </div>
                  ) : null}

                  {/* غرف التخزين */}
                  {property.storage_room && property.storage_room > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        غرف التخزين: {property.storage_room}
                      </span>
                    </div>
                  ) : null}

                  {/* القبو */}
                  {property.basement && property.basement > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        القبو: {property.basement}
                      </span>
                    </div>
                  ) : null}

                  {/* المسبح */}
                  {property.swimming_pool && property.swimming_pool > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        المسبح: {property.swimming_pool}
                      </span>
                    </div>
                  ) : null}

                  {/* الشرفات */}
                  {property.balcony && property.balcony > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        الشرفات: {property.balcony}
                      </span>
                    </div>
                  ) : null}

                  {/* الحديقة */}
                  {property.garden && property.garden > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        الحديقة: {property.garden}
                      </span>
                    </div>
                  ) : null}

                  {/* المصعد */}
                  {property.elevator && property.elevator > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        المصعد: {property.elevator}
                      </span>
                    </div>
                  ) : null}

                  {/* موقف السيارات */}
                  {property.private_parking && property.private_parking > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        موقف سيارات: {property.private_parking}
                      </span>
                    </div>
                  ) : null}

                  {/* الملحق */}
                  {property.annex && property.annex > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        الملحق: {property.annex}
                      </span>
                    </div>
                  ) : null}

                  {/* عدد الطوابق */}
                  {property.floors && property.floors > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3" style={{ color: textColor }}>
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
                        style={{ color: textColor }}
                      >
                        عدد الطوابق: {property.floors}
                      </span>
                    </div>
                  ): null}

                  {/* رقم الطابق */}
                  {property.floor_number !== undefined &&
                    property.floor_number !== null ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
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
                          style={{ color: textColor }}
                        >
                          رقم الطابق: {property.floor_number}
                        </span>
                      </div>
                    ) : null}

                  {/* عمر العقار */}
                  {property.building_age !== undefined &&
                    property.building_age !== null ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
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
                          style={{ color: textColor }}
                        >
                          عمر العقار:{" "}
                          {property.building_age === 0
                            ? "جديد"
                            : `${property.building_age} سنة`}
                        </span>
                      </div>
                    ) : null}

                  {/* طريقة الدفع */}
                  {property.payment_method &&
                    property.payment_method.trim() !== "" ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          طريقة الدفع: {property.payment_method}
                        </span>
                      </div>
                    ) : null}

                  {/* السعر للمتر */}
                  {property.pricePerMeter &&
                    parseFloat(property.pricePerMeter) > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          السعر للمتر: {property.pricePerMeter} ريال
                        </span>
                      </div>
                    ) : null}

                  {/* عرض الشارع الشمالي */}
                  {property.street_width_north &&
                    parseFloat(property.street_width_north) > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          عرض الشارع الشمالي: {property.street_width_north} م
                        </span>
                      </div>
                    ) : null}

                  {/* عرض الشارع الجنوبي */}
                  {property.street_width_south &&
                    parseFloat(property.street_width_south) > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          عرض الشارع الجنوبي: {property.street_width_south} م
                        </span>
                      </div>
                    ) : null}

                  {/* عرض الشارع الشرقي */}
                  {property.street_width_east &&
                    parseFloat(property.street_width_east) > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          عرض الشارع الشرقي: {property.street_width_east} م
                        </span>
                      </div>
                    ) : null}

                  {/* عرض الشارع الغربي */}
                  {property.street_width_west &&
                    parseFloat(property.street_width_west) > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <span
                          className="font-bold text-lg"
                          style={{ color: textColor }}
                        >
                          عرض الشارع الغربي: {property.street_width_west} م
                        </span>
                      </div>
                    ): null}

                  {/* نوع الواجهة */}
                  {property.facade_id !== undefined &&
                    property.facade_id !== null ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
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
                          style={{ color: textColor }}
                        >
                          نوع الواجهة: {property.facade_id}
                        </span>
                      </div>
                    ) : null}

                  {/* المبنى */}
                  {property.building &&
                    property.building !== null &&
                    property.building.trim() !== "" ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3" style={{ color: textColor }}>
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
                          style={{ color: textColor }}
                        >
                          المبنى: {property.building}
                        </span>
                      </div>
                    ) : null}
                </div>
              </section>
            ) : null}

            {/* WhatsApp Button */}
            {mergedData.whatsApp?.showButton &&
              mergedData.whatsApp?.phoneNumber &&
              mergedData.whatsApp.phoneNumber.trim() !== "" && (
                <section className="bg-transparent" data-purpose="whatsapp-button">
                  <a
                    href={`https://wa.me/${mergedData.whatsApp.phoneNumber.replace(/[^0-9]/g, "")}`}
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
                    <span>
                      {mergedData.whatsApp?.buttonText ||
                        "استفسار عن طريق الواتساب"}
                    </span>
                  </a>
                </section>
              )}

            {/* الأسئلة الشائعة */}
            {property.faqs && property.faqs.length > 0 && (
              <section className="bg-transparent" data-purpose="faqs-section">
                <h2
                  className="text-3xl font-bold mb-8 text-right"
                  style={{ color: textColor }}
                >
                  الأسئلة الشائعة
                </h2>
                <div className="w-full space-y-4">
                  {property.faqs
                    .filter((faq) => faq.displayOnPage)
                    .map((faq) => {
                      const isExpanded = expandedFaqs.has(faq.id);
                      return (
                        <div
                          key={faq.id}
                          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full p-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex-1">
                              <h4
                                className="font-semibold text-base leading-6 text-right"
                                style={{ color: textColor }}
                              >
                                {faq.question}
                              </h4>
                            </div>
                            <div className="mr-3 flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUpIcon
                                  className="w-5 h-5"
                                  style={{ color: primaryColor }}
                                />
                              ) : (
                                <ChevronDownIcon
                                  className="w-5 h-5"
                                  style={{ color: primaryColor }}
                                />
                              )}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4">
                              <p
                                className="text-sm leading-6 text-right"
                                style={{ color: textColor }}
                              >
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

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
          {/* END Right Column */}

          {/* Left Column: Video & Map */}
          <div className="space-y-12 order-1 lg:order-2">
            {/* Video Section */}
            {mergedData.displaySettings?.showVideoUrl !== false &&
              property.video_url && (
                <section
                  className="rounded-lg overflow-hidden shadow-md bg-black relative h-64"
                  data-purpose="video-section"
                >
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster={property.video_image || undefined}
                    >
                      <source src={property.video_url} type="video/mp4" />
                      متصفحك لا يدعم عرض الفيديو.
                    </video>
                  </div>
                  <div
                    className="absolute top-4 right-4 text-white px-4 py-2 rounded text-sm font-bold text-right"
                    style={{ backgroundColor: primaryColor }}
                  >
                    جولة فيديو للمقار
                  </div>
                </section>
              )}

            {/* Virtual Tour */}
            {property.virtual_tour && (
              <section className="rounded-lg overflow-hidden shadow-md bg-black relative h-96">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <iframe
                    src={property.virtual_tour}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="جولة افتراضية للعقار"
                  />
                </div>
              </section>
            )}

            {/* Map Section */}
            {mergedData.displaySettings?.showMap !== false &&
              property.location &&
              property.location.lat &&
              property.location.lng && (
                <section
                  className="rounded-lg overflow-hidden shadow-md border-4 border-white h-[550px] relative"
                  data-purpose="map-section"
                >
                  <iframe
                    src={`https://maps.google.com/maps?q=${property.location.lat},${property.location.lng}&hl=ar&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع العقار"
                  />
                  <div className="mt-4 text-center">
                    <a
                      href={`https://maps.google.com/?q=${property.location.lat},${property.location.lng}&entry=gps`}
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
      </div>
      {/* END: Main Content Container */}

      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة العقار</DialogTitle>
          {selectedImage && selectedImage.trim() !== "" && property && (
            <div className="relative w-full h-[80vh] group">
              <Image
                src={selectedImage}
                alt={property?.title || "صورة العقار"}
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
