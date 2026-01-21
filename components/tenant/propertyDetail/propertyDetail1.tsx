"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  BuildingIcon,
  CarIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  LayersIcon,
  ArrowUpDownIcon,
  BedIcon,
  BathIcon,
  ChefHatIcon,
  SofaIcon,
  UsersIcon,
  UtensilsIcon,
  UserIcon,
  Car,
  PackageIcon,
  Layers,
  WavesIcon,
  SquareIcon,
  TreePineIcon,
  ArrowUpDown,
  ParkingCircleIcon,
  RulerIcon,
  CopyIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  MessageCircleIcon,
  EyeIcon,
} from "lucide-react";

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
  // Additional fields from backend
  payment_method?: string;
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
  length?: string;
  width?: string;
  street_width_north?: string;
  street_width_south?: string;
  street_width_east?: string;
  street_width_west?: string;
  rooms?: number;
  annex?: number;
  size?: string;
  facade_id?: number;
  property_id?: number;
  building?: any;
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
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import SwiperCarousel from "@/components/ui/swiper-carousel2";

interface propertyDetailProps {
  propertySlug: string;
  whatsApp?: {
    showButton?: boolean;
    buttonText?: string;
    phoneNumber?: string;
  };
  // Backward compatibility - deprecated, use whatsApp instead
  displaySettings?: {
    showWhatsAppButton?: boolean;
  };
  content?: {
    whatsAppButtonText?: string;
    whatsAppPhoneNumber?: string;
  };
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

export default function propertyDetail({
  propertySlug,
  whatsApp,
  displaySettings,
  content,
}: propertyDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  // Reservation states
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [reservationForm, setReservationForm] = useState({
    customerName: "",
    customerPhone: "",
    desiredDate: "",
    message: "",
  });

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

  // Sharing functions
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const getShareText = () => {
    if (!property) return "";
    return `شاهد هذا العقار الرائع: ${property.title} - ${property.district} - ${property.price} ريال`;
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

  const shareToTelegram = () => {
    const url = getCurrentUrl();
    const text = getShareText();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank");
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

  // Image navigation functions
  const goToPreviousSlide = () => {
    if (property?.images && property.images.length > 0) {
      const currentIndex = property.images.findIndex(
        (img) => img === mainImage,
      );
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : property.images.length - 1;
      setMainImage(property.images[previousIndex]);
    }
  };

  const goToNextSlide = () => {
    if (property?.images && property.images.length > 0) {
      const currentIndex = property.images.findIndex(
        (img) => img === mainImage,
      );
      const nextIndex =
        currentIndex < property.images.length - 1 ? currentIndex + 1 : 0;
      setMainImage(property.images[nextIndex]);
    }
  };

  // Get all images (main images + floor planning images)
  const getAllImages = () => {
    const allImages = [];
    if (property?.images) {
      allImages.push(...property.images);
    }
    if (property?.floor_planning_image) {
      allImages.push(...property.floor_planning_image);
    }
    console.log("getAllImages result:", allImages);
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

  // Tenant ID hook
  const { tenantId, isLoading: tenantLoading } = useTenantId();

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
    contact: {
      name: "شركة تعاريف العقارية",
      phone: "+966501234567",
      email: "info@example.com",
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
    rooms: 4,
    annex: 0,
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

  // Handle create reservation
  const handleCreateReservation = async () => {
    if (!tenantId) {
      setReservationError("لم يتم العثور على معرف المستأجر");
      return;
    }

    if (!property?.slug) {
      setReservationError("لم يتم العثور على معرف العقار");
      return;
    }

    // Validation
    if (!reservationForm.customerName.trim()) {
      setReservationError("يرجى إدخال اسمك");
      return;
    }

    if (!reservationForm.customerPhone.trim()) {
      setReservationError("يرجى إدخال رقم الهاتف");
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(reservationForm.customerPhone.replace(/\s/g, ""))) {
      setReservationError("يرجى إدخال رقم هاتف صحيح (مثال: +966501234567)");
      return;
    }

    // Validate desiredDate if provided
    if (reservationForm.desiredDate) {
      const selectedDate = new Date(reservationForm.desiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      selectedDate.setHours(0, 0, 0, 0); // Reset time to start of day

      if (selectedDate < today) {
        setDateError("التاريخ المفضل يجب أن يكون تاريخ اليوم أو بعده");
        setReservationError("التاريخ المفضل يجب أن يكون تاريخ اليوم أو بعده");
        return;
      }
    }

    // Check if there's a date error (from real-time validation)
    if (dateError) {
      setReservationError(dateError);
      return;
    }

    setReservationLoading(true);
    setReservationError(null);
    setReservationSuccess(false);

    try {
      const payload: any = {
        propertySlug: property.slug,
        customerName: reservationForm.customerName.trim(),
        customerPhone: reservationForm.customerPhone.trim(),
      };

      if (reservationForm.desiredDate) {
        payload.desiredDate = reservationForm.desiredDate;
      }
      if (reservationForm.message.trim()) {
        payload.message = reservationForm.message.trim();
      }

      const response = await axiosInstance.post(
        `/api/v1/tenant-website/${tenantId}/reservations`,
        payload,
      );

      if (response.data.success) {
        setReservationSuccess(true);
        // Reset form
        setReservationForm({
          customerName: "",
          customerPhone: "",
          desiredDate: "",
          message: "",
        });
        setDateError(null);
        // Hide form after 2 seconds
        setTimeout(() => {
          setShowReservationForm(false);
          setReservationSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error creating reservation:", err);

      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        // Priority: desiredDate > customerName > customerPhone > message
        const errorMessage =
          errors.desiredDate?.[0] ||
          errors.customerName?.[0] ||
          errors.customerPhone?.[0] ||
          errors.message?.[0] ||
          err.response?.data?.message ||
          "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى";
        setReservationError(errorMessage);

        // If the error is about desiredDate, also set dateError
        if (errors.desiredDate?.[0]) {
          setDateError(errors.desiredDate[0]);
        }
      } else {
        setReservationError(
          err.response?.data?.message ||
            "حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى",
        );
      }
    } finally {
      setReservationLoading(false);
    }
  };

  // Get tenant data from store
  const { tenantData, loadingTenantData } = useTenantStore();

  // Get logo image from tenantData with fallback (only after loading is complete)
  const logoImage = loadingTenantData
    ? null // لا تعرض شيئاً أثناء التحميل
    : tenantData?.globalComponentsData?.header?.logo?.image ||
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`;

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

  // Helper function to create lighter color (for skeleton loading)
  const getLighterColor = (hex: string, opacity: number = 0.2): string => {
    if (!hex || !hex.startsWith("#")) return `${primaryColor}33`; // 20% opacity default
    // Return hex color with opacity using rgba
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return `${primaryColor}33`;

    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Helper function to convert hex color to CSS filter for SVG coloring
  // This converts any hex color to a CSS filter that can be applied to SVG images
  const hexToFilter = (hex: string): string => {
    if (!hex || !hex.startsWith("#")) {
      // Default emerald-600 filter
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
    }

    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) {
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
    }

    // Parse RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

    // Convert RGB to HSL
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

    // Convert HSL to filter values
    // First, make the image black (brightness(0) saturate(100%))
    // Then invert to white
    // Then apply color transformation
    const hue = Math.round(h * 360);
    const saturation = Math.round(s * 100);
    const lightness = Math.round(l * 100);

    // Calculate filter values
    // This is a simplified approach - for more accuracy, we'd need complex calculations
    // But this works well for most colors
    const brightness = lightness > 50 ? (lightness - 50) * 2 : 0;
    const contrast = 100 + saturation * 0.5;

    return `brightness(0) saturate(100%) invert(${Math.round((1 - lightness / 100) * 100)}%) sepia(${Math.round(saturation)}%) saturate(${Math.round(saturation * 5)}%) hue-rotate(${hue}deg) brightness(${Math.round(100 + brightness)}%) contrast(${Math.round(contrast)}%)`;
  };

  const primaryColorHover = getDarkerColor(primaryColor, 20);
  const primaryColorLight = getLighterColor(primaryColor, 0.2); // 20% opacity for skeleton
  const primaryColorFilter = hexToFilter(primaryColor); // CSS filter for SVG coloring

  // Get WhatsApp data from tenantData or props
  const getWhatsAppData = () => {
    // Priority 1: Try to get from tenantData.StaticPages.property.components
    if (tenantData?.StaticPages?.property?.components) {
      const components = Array.isArray(tenantData.StaticPages.property.components)
        ? tenantData.StaticPages.property.components
        : tenantData.StaticPages.property.components;
      
      if (Array.isArray(components)) {
        const propertyDetailComponent = components.find(
          (comp: any) => comp.componentName === "propertyDetail1" || comp.type === "propertyDetail"
        );
        if (propertyDetailComponent?.data?.whatsApp) {
          return {
            showButton: propertyDetailComponent.data.whatsApp.showButton || false,
            buttonText: propertyDetailComponent.data.whatsApp.buttonText || "استفسار عن طريق الواتساب",
            phoneNumber: propertyDetailComponent.data.whatsApp.phoneNumber || "",
          };
        }
      }
    }
    
    // Priority 2: Try to get from props.whatsApp (new structure)
    if (whatsApp) {
      return {
        showButton: whatsApp.showButton || false,
        buttonText: whatsApp.buttonText || "استفسار عن طريق الواتساب",
        phoneNumber: whatsApp.phoneNumber || "",
      };
    }
    
    // Priority 3: Fallback to old props structure (for backward compatibility)
    return {
      showButton: displaySettings?.showWhatsAppButton || false,
      buttonText: content?.whatsAppButtonText || "استفسار عن طريق الواتساب",
      phoneNumber: content?.whatsAppPhoneNumber || "",
    };
  };

  const whatsAppData = getWhatsAppData();

  // Property data state
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  // الحصول على عقارات مشابهة من API
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

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

      if (!tenantId) {
        setLoadingProperty(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${tenantId}/properties/${propertySlug}`,
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

  // جلب العقارات المشابهة
  const fetchSimilarProperties = async () => {
    // ⭐ NEW: Use mock data in Live Editor
    if (isLiveEditor) {
      const mockSimilarProperties: Property[] = [
        {
          ...mockProperty,
          id: "mock-2",
          title: "عقار فاخر ثاني",
          district: "حي العليا",
          price: "1,500,000",
        },
        {
          ...mockProperty,
          id: "mock-3",
          title: "عقار فاخر ثالث",
          district: "حي المطار",
          price: "2,000,000",
        },
        {
          ...mockProperty,
          id: "mock-4",
          title: "عقار فاخر رابع",
          district: "حي الياسمين",
          price: "1,800,000",
        },
      ];
      setSimilarProperties(mockSimilarProperties);
      setLoadingSimilar(false);
      return;
    }

    try {
      setLoadingSimilar(true);

      if (!tenantId) {
        setLoadingSimilar(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`,
      );

      // Handle new API response format
      if (response.data && response.data.properties) {
        setSimilarProperties(response.data.properties);
        console.log(
          `propertyDetail: ✅ Similar properties loaded: ${response.data.properties.length} items`,
        );
      } else {
        console.log(
          "propertyDetail: ⚠️ No similar properties found in response",
        );
        setSimilarProperties([]);
      }
    } catch (error) {
      console.error("Error fetching similar properties:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle booking submission
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = (imageSrc: string, index?: number) => {
    if (imageSrc && imageSrc.trim() !== "") {
      setSelectedImage(imageSrc);
      setSelectedImageIndex(index || 0);
      setIsDialogOpen(true);
    }
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    // افتح الصورة في dialog عند الضغط عليها
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

  // جلب بيانات العقار والعقارات المشابهة عند تحميل المكون
  useEffect(() => {
    // ⭐ NEW: In Live Editor, always use mock data
    if (isLiveEditor) {
      fetchProperty();
      fetchSimilarProperties();
      return;
    }

    if (tenantId) {
      fetchProperty();
      fetchSimilarProperties();
    }
  }, [tenantId, propertySlug, isLiveEditor]);

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

  // Show skeleton loading while tenant or property is loading
  if (tenantLoading || loadingProperty) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
            {/* المحتوى الرئيسي - Skeleton */}
            <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
              <div className="flex flex-col gap-y-8 lg:gap-y-10">
                {/* العنوان ونوع العرض - Skeleton */}
                <div className="flex flex-row items-center justify-between">
                  <div
                    className="h-8 w-20 rounded-md animate-pulse md:w-28 md:h-11"
                    style={{
                      backgroundColor: primaryColorLight || `${primaryColor}33`,
                    }}
                  ></div>
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* تفاصيل العقار - Skeleton */}
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 md:h-6"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 md:h-10"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>

                {/* تفاصيل العقار في شبكة - Skeleton */}
                <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="flex flex-row gap-x-2 md:gap-x-6 items-center"
                    >
                      <div className="flex flex-row gap-x-2 items-center">
                        <div
                          className="w-4 h-4 rounded animate-pulse"
                          style={{
                            backgroundColor:
                              primaryColorLight || `${primaryColor}33`,
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
                {/* الصورة الأساسية - Skeleton */}
                <div className="relative h-80 md:h-80 xl:h-96 mb-6 bg-gray-200 rounded-lg animate-pulse">
                  <div className="absolute bottom-2 right-2 opacity-50">
                    <div className="w-12 h-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Carousel للصور المصغرة - Skeleton */}
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative h-24 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
                    >
                      <div className="absolute bottom-1 right-1 opacity-50">
                        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* القسم السفلي - Skeleton */}
          <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
            {/* وصف العقار ونموذج الحجز - Skeleton */}
            <div className="flex-1">
              <div className="mb-8 md:mb-18">
                <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-32 lg:h-7"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
                  </div>
                </div>
              </div>

              {/* نموذج الحجز - Skeleton */}
              <div className="flex flex-col gap-y-6">
                <div
                  className="h-10 rounded-md animate-pulse w-full"
                  style={{
                    backgroundColor: primaryColorLight || `${primaryColor}33`,
                  }}
                ></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>

                <div className="flex flex-col gap-y-6 md:gap-y-8">
                  <div className="flex flex-row gap-x-4">
                    <div className="flex flex-col gap-y-6 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                    <div className="flex flex-col gap-y-6 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                  </div>

                  <div className="flex flex-row gap-x-4">
                    <div className="flex-1 flex flex-col gap-y-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-y-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                  </div>

                  <div
                    className="h-12 rounded-md animate-pulse w-[200px] mx-auto"
                    style={{
                      backgroundColor: primaryColorLight || `${primaryColor}33`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* العقارات المشابهة - Skeleton */}
            <div className="flex-1">
              <div
                className="h-10 rounded-md animate-pulse w-full mb-8 md:h-13"
                style={{
                  backgroundColor: primaryColorLight || `${primaryColor}33`,
                }}
              ></div>

              {/* عرض العقارات المشابهة للديسكتوب - Skeleton */}
              <div className="hidden md:block space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg"
                  >
                    <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                    <div className="flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                      <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* عرض العقارات المشابهة للموبايل - Skeleton */}
              <div className="block md:hidden">
                <div className="flex gap-4 overflow-x-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px]"
                    >
                      <div className="relative w-full h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mt-4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
                      <div className="flex flex-row items-center justify-between pt-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!tenantId) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من أنك تصل إلى الموقع من الرابط الصحيح
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if property failed to load
  if (propertyError || !property) {
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
              {propertyError || "العقار غير موجود"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من صحة رابط العقار
            </p>
            <button
              onClick={() => fetchProperty()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  const transactionTypeLabel = getTransactionTypeLabel(
    property.transactionType,
    property.transactionType_en,
  );

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المحتوى الرئيسي */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              {/* العنوان ونوع العرض */}
              <div className="flex flex-row items-center justify-between">
                <h1
                  className="font-bold text-xs xs:text-sm leading-4 rounded-md text-white w-20 h-8 flex items-center justify-center md:text-xl lg:text-2xl md:w-28 md:h-11"
                  style={{ backgroundColor: primaryColor }}
                >
                  {transactionTypeLabel}
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

              {/* تفاصيل العقار */}
              <div className="space-y-4">
                <p className="font-bold text-gray-600 text-xs xs:text-sm leading-4 md:text-2xl md:leading-7">
                  {property.district}
                </p>
                <p className="font-bold text-gray-600 text-xl leading-6 md:leading-7">
                  {property.title}
                </p>
                <p
                  className="text-2xl leading-7 font-bold md:text-3xl lg:leading-9 flex items-center gap-2"
                  style={{ color: "#000000" }}
                >
                  {property.price}
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-6 h-6"
                    style={{
                      filter: "brightness(0) saturate(100%)",
                    }}
                  />
                </p>
                <p className="text-gray-600 text-sm leading-6 font-normal md:text-base lg:text-xl lg:leading-7 whitespace-pre-line">
                  {property.description || "لا يوجد وصف متاح لهذا العقار"}
                </p>

                {/* احجز الآن Button & Form */}
                {/* مخفي حالياً بشكل مؤقت ولا اريد ازالته */}
                {/* <div className="mt-6 space-y-4">
                  <button
                    onClick={() => {
                      setShowReservationForm(!showReservationForm);
                      setReservationError(null);
                      setReservationSuccess(false);
                      setDateError(null);
                    }}
                    className="w-full text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-base md:text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColorHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                    }}
                  >
                    <span>احجز الآن</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        showReservationForm ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {showReservationForm && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          exit={{ y: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 space-y-4"
                        >
                        {reservationSuccess && (
                          <div 
                            className="p-3 border rounded-lg text-sm text-center"
                            style={{
                              backgroundColor: getLighterColor(primaryColor, 0.1),
                              borderColor: primaryColor,
                              color: getDarkerColor(primaryColor, 40),
                            }}
                          >
                            ✅ تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.
                          </div>
                        )}

                        {reservationError && !reservationSuccess && (
                          <div className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-800 text-sm text-center">
                            {reservationError}
                          </div>
                        )}

                        {!reservationSuccess && (
                          <div className="space-y-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                الاسم <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={reservationForm.customerName}
                                onChange={(e) =>
                                  setReservationForm({
                                    ...reservationForm,
                                    customerName: e.target.value,
                                  })
                                }
                                placeholder="أدخل اسمك"
                                disabled={reservationLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:bg-gray-100 text-sm md:text-base"
                                style={{
                                  '--focus-ring-color': primaryColor,
                                  '--focus-border-color': primaryColor,
                                } as React.CSSProperties}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = primaryColor;
                                  e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '';
                                  e.currentTarget.style.boxShadow = '';
                                }}
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                رقم الهاتف <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                value={reservationForm.customerPhone}
                                onChange={(e) =>
                                  setReservationForm({
                                    ...reservationForm,
                                    customerPhone: e.target.value,
                                  })
                                }
                                placeholder="+966501234567"
                                disabled={reservationLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:bg-gray-100 text-sm md:text-base"
                                style={{
                                  '--focus-ring-color': primaryColor,
                                  '--focus-border-color': primaryColor,
                                } as React.CSSProperties}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = primaryColor;
                                  e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '';
                                  e.currentTarget.style.boxShadow = '';
                                }}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                مثال: +966501234567
                              </p>
                            </div>

                             <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                التاريخ المفضل (اختياري)
                              </label>
                              <input
                                type="date"
                                value={reservationForm.desiredDate}
                                onChange={(e) => {
                                  const selectedDate = e.target.value;
                                  setReservationForm({
                                    ...reservationForm,
                                    desiredDate: selectedDate,
                                  });
                                  
                                  // Real-time validation
                                  if (selectedDate) {
                                    const date = new Date(selectedDate);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    date.setHours(0, 0, 0, 0);
                                    
                                    if (date < today) {
                                      setDateError("التاريخ المفضل يجب أن يكون تاريخ اليوم أو بعده");
                                    } else {
                                      setDateError(null);
                                      setReservationError(null);
                                    }
                                  } else {
                                    setDateError(null);
                                  }
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                disabled={reservationLoading}
                                className={`w-full px-4 py-2 border rounded-lg outline-none disabled:bg-gray-100 text-sm md:text-base ${
                                  dateError
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              {dateError && (
                                <p className="mt-1 text-xs text-red-600">{dateError}</p>
                              )}
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                ملاحظات (اختياري)
                              </label>
                              <textarea
                                value={reservationForm.message}
                                onChange={(e) =>
                                  setReservationForm({
                                    ...reservationForm,
                                    message: e.target.value,
                                  })
                                }
                                placeholder="أدخل أي ملاحظات أو استفسارات..."
                                rows={3}
                                disabled={reservationLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:bg-gray-100 resize-vertical text-sm md:text-base"
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = primaryColor;
                                  e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '';
                                  e.currentTarget.style.boxShadow = '';
                                }}
                              />
                            </div>

                            <button
                              onClick={handleCreateReservation}
                              disabled={reservationLoading}
                              className="w-full disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm md:text-base"
                              style={{ backgroundColor: primaryColor }}
                              onMouseEnter={(e) => {
                                if (!e.currentTarget.disabled) {
                                  e.currentTarget.style.backgroundColor = primaryColorHover;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!e.currentTarget.disabled) {
                                  e.currentTarget.style.backgroundColor = primaryColor;
                                }
                              }}
                            >
                              {reservationLoading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
                            </button>
                          </div>
                        )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div> */}
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              {/* الصورة الأساسية */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6">
                {mainImage && property ? (
                  <Image
                    src={mainImage}
                    alt={property.title || "صورة العقار"}
                    fill
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
                    onClick={() => handleImageClick(mainImage, 0)}
                  />
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
                        alt="تعاريف العقارية"
                        width={160}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* نص توضيحي - يظهر فقط عند وجود صور إضافية */}
              {propertyImages.length > 1 && (
                <p className="text-xs text-gray-500 mb-2 text-center">
                  اضغط على أي صورة لفتحها في نافذة منبثقة
                </p>
              )}

              {/* Carousel للصور المصغرة - يظهر فقط عند وجود صور إضافية */}
              {propertyImages.length > 0 && property && (
                <SwiperCarousel
                  items={propertyImages
                    .filter((imageSrc) => imageSrc && imageSrc.trim() !== "") // Filter out empty images
                    .map((imageSrc, index) => (
                      <div key={index} className="relative h-[10rem] md:h-24">
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
                        {logoImage && (
                          <div className="absolute bottom-2 right-2 opacity-80">
                            <div className="w-12 h-fit bg-white/20 rounded flex items-center justify-center">
                              <Image
                                src={logoImage}
                                alt="تعاريف العقارية"
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
            {/* تفاصيل العقار في شبكة */}
            <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
              <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                <div className="flex flex-row gap-x-2">
                  <HomeIcon
                    className="w-4 h-4"
                    style={{ color: primaryColor }}
                  />
                  <p
                    className="font-normal text-xs xs:text-sm md:text-base leading-4"
                    style={{ color: primaryColor }}
                  >
                    نوع العرض:
                  </p>
                </div>
                <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                  {transactionTypeLabel}
                </p>
              </div>

              {property.area && parseFloat(property.area) > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <RulerIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      المساحة:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.area} م²
                  </p>
                </div>
              ) : null}

              <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                <div className="flex flex-row gap-x-2">
                  <BuildingIcon
                    className="w-4 h-4"
                    style={{ color: primaryColor }}
                  />
                  <p
                    className="font-normal text-xs xs:text-sm md:text-base leading-4"
                    style={{ color: primaryColor }}
                  >
                    نوع العقار:
                  </p>
                </div>
                <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                  {property.type}
                </p>
              </div>

              {property.payment_method ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <CreditCardIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      طريقة الدفع:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.payment_method === "quarterly"
                      ? "ربعي"
                      : property.payment_method === "monthly"
                        ? "شهري"
                        : property.payment_method === "yearly"
                          ? "سنوي"
                          : property.payment_method}
                  </p>
                </div>
              ) : null}

              {property.pricePerMeter ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <img
                      src="/Saudi_Riyal_Symbol.svg"
                      alt="ريال سعودي"
                      className="w-4 h-4"
                      style={{
                        filter: primaryColorFilter,
                      }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      السعر للمتر:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.pricePerMeter}
                  </p>
                </div>
              ) : null}

              {property.building_age ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <CalendarDaysIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      عمر العمارة:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.building_age} سنة
                  </p>
                </div>
              ) : null}

              {property.floors ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <LayersIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      عدد الطوابق:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.floors} طابق
                  </p>
                </div>
              ) : null}

              {property.floor_number ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <ArrowUpDownIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      رقم الطابق:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    الطابق {property.floor_number}
                  </p>
                </div>
              ) : null}

              {property.bedrooms > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <BedIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      عدد الغرف:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.bedrooms} غرفة
                  </p>
                </div>
              ) : null}

              {property.bathrooms && property.bathrooms > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <BathIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      الحمامات:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.bathrooms} حمام
                  </p>
                </div>
              ) : null}

              {property.kitchen && property.kitchen > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <ChefHatIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      المطابخ:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.kitchen} مطبخ
                  </p>
                </div>
              ) : null}

              {property.living_room && property.living_room > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <SofaIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      الصالات:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.living_room} صالة
                  </p>
                </div>
              ) : null}

              {property.majlis && property.majlis > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <UsersIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      المجالس:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.majlis} مجلس
                  </p>
                </div>
              ) : null}

              {property.dining_room && property.dining_room > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <UtensilsIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      غرف الطعام:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.dining_room} غرفة طعام
                  </p>
                </div>
              ) : null}

              {property.maid_room && property.maid_room > 0 ? (
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
                      غرف الخدم:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.maid_room} غرفة خادمة
                  </p>
                </div>
              ) : null}

              {property.driver_room && property.driver_room > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <CarIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      غرف السائق:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.driver_room} غرفة سائق
                  </p>
                </div>
              ) : null}

              {property.storage_room && property.storage_room > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <PackageIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      المخازن:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.storage_room} مخزن
                  </p>
                </div>
              ) : null}

              {property.basement && property.basement > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <Layers
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      القبو:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.basement} قبو
                  </p>
                </div>
              ) : null}

              {property.swimming_pool && property.swimming_pool > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <WavesIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      المسبح:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.swimming_pool} مسبح
                  </p>
                </div>
              ) : null}

              {property.balcony && property.balcony > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <SquareIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      الشرفات:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.balcony} شرفة
                  </p>
                </div>
              ) : null}

              {property.garden && property.garden > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <TreePineIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      الحدائق:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.garden} حديقة
                  </p>
                </div>
              ) : null}

              {property.elevator && property.elevator > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <ArrowUpDown
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      المصاعد:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.elevator} مصعد
                  </p>
                </div>
              ) : null}

              {property.private_parking && property.private_parking > 0 ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <ParkingCircleIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      مواقف السيارات:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.private_parking} موقف
                  </p>
                </div>
              ) : null}

              {property.length && property.width ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <RulerIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                    <p
                      className="font-normal text-xs xs:text-sm md:text-base leading-4"
                      style={{ color: primaryColor }}
                    >
                      الأبعاد:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.length} × {property.width} م
                  </p>
                </div>
              ) : null}

              {property.location &&
              ((property.location.lat && property.location.lng) ||
                property.location.address) ? (
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <MapPinIcon
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                    />
                  </div>
                  {property.location.lat && property.location.lng ? (
                    <a
                      href={`https://maps.google.com/?q=${property.location.lat},${property.location.lng}&entry=gps`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold leading-4 text-xs xs:text-sm md:text-base underline"
                      style={{ color: primaryColor }}
                    >
                      عرض العنوان
                    </a>
                  ) : (
                    <span className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {property.location.address}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

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

            {/* الأسئلة الشائعة */}
            {property.faqs && property.faqs.length > 0 ? (
              <div className="mb-8 md:mb-18">
                <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                  <h3 className="text-gray-600 font-bold text-xl leading-6 lg:text-2xl lg:leading-7">
                    الأسئلة الشائعة
                  </h3>
                  <div className="w-full space-y-4">
                    {property.faqs
                      .filter((faq) => faq.displayOnPage)
                      .map((faq, index) => {
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
                                <h4 className="text-gray-800 font-semibold text-base leading-6">
                                  {faq.question}
                                </h4>
                              </div>
                              <div className="mr-3 flex-shrink-0">
                                {isExpanded ? (
                                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4">
                                <p className="text-gray-600 text-sm leading-6">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : null}

            {/* نموذج الحجز */}
            {/* انه مخفي فقط الان ولا اريد ازالته */}
            {/* <div className="flex flex-col gap-y-6">
              <h2 
                className="pr-4 text-white font-bold rounded-md leading-6 w-full h-10 flex items-center justify-start"
                style={{ backgroundColor: primaryColor }}
              >
                احجز الآن
              </h2>
              <p className="text-sm text-gray-600 font-normal">
                احجز الآن وقم باختيار الوقت والتاريخ المناسب لك، وسيتم التواصل
                معك لتأكيد الحجز وتقديم التفاصيل اللازمة.
              </p>

              <form
                onSubmit={handleBookingSubmit}
                className="flex flex-col gap-y-6 md:gap-y-8"
              >
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-6 flex-1">
                    <label
                      htmlFor="name"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      الاسم
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="ادخل الاسم"
                      value={bookingForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full h-12 outline-none border border-gray-300 rounded-lg placeholder:text-sm px-2"
                      name="name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-y-6 flex-1">
                    <label
                      htmlFor="phone"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      رقم الهاتف
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="ادخل رقم الهاتف"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full h-12 outline-none border border-gray-300 rounded-lg placeholder:text-sm px-2 text-end"
                      name="phone"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-x-4">
                  <div className="flex-1 flex flex-col gap-y-6 relative">
                    <label
                      htmlFor="date"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      التاريخ
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-right font-normal cursor-pointer text-base font-medium text-gray-600 rounded-lg border border-gray-300 p-2 outline-none h-12"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = primaryColor;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '';
                          }}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: ar })
                          ) : (
                            <span className="text-gray-500">اختر التاريخ</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          locale={ar}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1 flex flex-col gap-y-6 relative">
                    <label
                      htmlFor="time"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      الوقت
                    </label>
                    <div className="w-full relative">
                      <input
                        id="time"
                        required
                        className="order-1 w-full font-medium text-gray-600 rounded-lg border border-gray-300 p-2 outline-none pr-10 h-12"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = primaryColor;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '';
                        }}
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={!selectedDate}
                      />
                      <div className="absolute pointer-events-none top-0 bottom-0 right-3 flex items-center order-2">
                        <ClockIcon className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      {!selectedDate && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white/70 z-10 cursor-not-allowed rounded-lg" />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-[200px] mx-auto h-12 rounded-md text-white font-bold transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColorHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  تأكيد الحجز
                </button>
              </form>
            </div> */}
          </div>

          {/* العمود الثاني - الصور والعقارات المشابهة ونموذج الحجز */}
          <div className="lg:col-span-1 space-y-8">
            {property.floor_planning_image &&
            property.floor_planning_image.length > 0 ? (
              <div>
                <div className="flex flex-col gap-y-6">
                  {/* مخططات الأرضية */}
                  {property.floor_planning_image &&
                    property.floor_planning_image.length > 0 && (
                      <div className="mt-6">
                        <h3
                          className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                          style={{ backgroundColor: primaryColor }}
                        >
                          مخططات الأرضية
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {property.floor_planning_image.map(
                            (planImage, index) => (
                              <div
                                key={index}
                                className="relative group"
                                onClick={(e) => {
                                  handleThumbnailClick(planImage, index);
                                }}
                              >
                                <img
                                  src={planImage}
                                  alt={`مخطط الأرضية ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={(e) => {
                                    handleThumbnailClick(planImage, index);
                                    // Simple test - just open dialog with the image
                                    setSelectedImage(planImage);
                                    setSelectedImageIndex(0);
                                    setIsDialogOpen(true);
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ) : null}

            {/* فيديو العقار */}
            {property.video_url && (
              <div className="mb-8">
                <h3
                  className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  فيديو العقار
                </h3>
                <div className="w-full rounded-lg overflow-hidden shadow-lg">
                  <video
                    controls
                    className="w-full h-auto"
                    poster={property.video_image || undefined}
                  >
                    <source src={property.video_url} type="video/mp4" />
                    متصفحك لا يدعم عرض الفيديو.
                  </video>
                </div>
              </div>
            )}

            {/* الجولة الافتراضية */}
            {property.virtual_tour && (
              <div className="mb-8">
                <h3
                  className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  جولة افتراضية
                </h3>
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
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
              </div>
            )}

            {/* خريطة الموقع */}
            {property.location &&
            property.location.lat &&
            property.location.lng ? (
              <div className="mb-8">
                <h3
                  className="pr-4 md:pr-0 mb-4 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  موقع العقار
                </h3>
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
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
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={`https://maps.google.com/?q=${property.location.lat},${property.location.lng}&entry=gps`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColorHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                    }}
                  >
                    <MapPinIcon className="w-4 h-4" />
                    فتح في خرائط جوجل
                  </a>
                </div>
              </div>
            ) : null}

            {/* عقارات مشابهة */}
            {loadingSimilar ? (
              <div>
                <div className="flex-1">
                  <div>
                    <h3
                      className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      عقارات مشابهة
                    </h3>
                    {/* عرض العقارات المشابهة للديسكتوب */}
                    <div className="hidden md:block space-y-8">
                      {loadingSimilar ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg animate-pulse"
                            >
                              <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                              </div>
                              <div className="flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        similarProperties.map((similarProperty) => (
                          <Link
                            key={similarProperty.id}
                            href={`/property/${similarProperty.slug || similarProperty.id}`}
                            className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                          >
                            <div className="flex-[40%] py-8 flex flex-col gap-y-4 justify-center">
                              <h4 className="text-ellipsis overflow-hidden font-bold text-xl text-gray-600">
                                {similarProperty.title}
                              </h4>
                              <p className="text-ellipsis font-bold text-base text-gray-600 leading-5">
                                {similarProperty.district}
                              </p>
                              <div className="flex flex-row items-center justify-start">
                                <p className="flex items-center justify-center leading-6 font-bold text-xl gap-2">
                                  {similarProperty.price}
                                  <img
                                    src="/Saudi_Riyal_Symbol.svg"
                                    alt="ريال سعودي"
                                    className="w-5 h-5"
                                    style={{
                                      filter: primaryColorFilter,
                                    }}
                                  />
                                </p>
                              </div>
                            </div>
                            <figure className="relative flex-[60%] py-4 rounded-lg overflow-hidden w-full h-full">
                              <div className="bg-white mt-3 absolute w-fit h-7 gap-x-5 md:h-9 flex items-center justify-between px-3 top-4 md:top-5 lg:top-4 right-2 rounded-md">
                                <div className="flex flex-row items-center justify-center gap-x-1">
                                  <EyeIcon className="w-4 h-4 text-gray-600" />
                                  <p className="text-sm md:text-base font-bold text-gray-600">
                                    {similarProperty.views}
                                  </p>
                                </div>
                                <div className="flex flex-row items-center justify-center gap-x-1">
                                  <BedIcon className="w-4 h-4 text-gray-600" />
                                  <p className="text-sm md:text-base font-bold text-gray-600">
                                    {similarProperty.bedrooms || 0}
                                  </p>
                                </div>
                              </div>
                              <Image
                                src={similarProperty.image}
                                alt="RealEstate Image"
                                fill
                                className="w-full h-full object-cover rounded-lg overflow-hidden relative -z-10"
                              />
                              {logoImage && (
                                <div className="absolute bottom-2 right-2 opacity-50">
                                  <div className="w-12 h-fit bg-white/20 rounded flex items-center justify-center">
                                    <Image
                                      src={logoImage}
                                      alt="تعاريف العقارية"
                                      width={160}
                                      height={80}
                                      className="object-contain"
                                    />
                                  </div>
                                </div>
                              )}
                            </figure>
                          </Link>
                        ))
                      )}
                    </div>

                    {/* عرض العقارات المشابهة للموبايل */}
                    <div className="block md:hidden">
                      <div className="flex gap-4 overflow-x-auto">
                        {loadingSimilar
                          ? [1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px] animate-pulse"
                              >
                                <div className="relative w-full h-64 flex items-center justify-center rounded-2xl overflow-hidden bg-gray-200"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                              </div>
                            ))
                          : similarProperties.map((similarProperty) => (
                              <Link
                                key={similarProperty.id}
                                href={`/property/${similarProperty.slug || similarProperty.id}`}
                              >
                                <div className="relative h-88 md:h-91 flex flex-col justify-center min-w-[300px]">
                                  <div className="bg-white z-40 absolute w-36 mt-3 h-7 md:w-46 md:h-9 flex items-center justify-between px-3 top-4 md:top-5 lg:top-4 right-2 rounded-md">
                                    <div className="flex flex-row items-center justify-center gap-x-1">
                                      <EyeIcon className="w-4 h-4 text-gray-600" />
                                      <p className="text-sm md:text-base font-bold text-gray-600">
                                        {similarProperty.views}
                                      </p>
                                    </div>
                                    <div className="flex flex-row items-center justify-center gap-x-1">
                                      <BedIcon className="w-4 h-4 text-gray-600" />
                                      <p className="text-sm md:text-base font-bold text-gray-600">
                                        {similarProperty.bedrooms || 0}
                                      </p>
                                    </div>
                                  </div>
                                  <figure className="relative w-full h-64 flex items-center justify-center rounded-2xl overflow-hidden">
                                    <Image
                                      src={similarProperty.image}
                                      alt="RealEstateImage"
                                      width={800}
                                      height={600}
                                      className="w-full h-full object-cover"
                                    />
                                    {logoImage && (
                                      <div className="absolute bottom-2 right-2 opacity-50">
                                        <div className="w-12 h-fit bg-white/20 rounded flex items-center justify-center">
                                          <Image
                                            src={logoImage}
                                            alt="تعاريف العقارية"
                                            width={160}
                                            height={80}
                                            className="object-contain"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </figure>
                                  <p className="text-gray-800 pt-4 text-base md:text-lg xl:text-xl font-normal leading-5 xl:leading-6 text-ellipsis overflow-hidden">
                                    {similarProperty.title}
                                  </p>
                                  <p className="text-gray-500 pt-2 font-normal text-sm xl:text-base text-ellipsis overflow-hidden leading-4 xl:leading-5">
                                    {similarProperty.district}
                                  </p>
                                  <div className="flex flex-row items-center justify-between pt-4">
                                    <p className="text-ellipsis overflow-hidden text-gray-800 font-bold text-base leading-5 md:text-lg xl:text-xl xl:leading-6 flex items-center gap-2">
                                      {similarProperty.price}
                                      <img
                                        src="/Saudi_Riyal_Symbol.svg"
                                        alt="ريال سعودي"
                                        className="w-5 h-5"
                                        style={{
                                          filter: primaryColorFilter,
                                        }}
                                      />
                                    </p>
                                    <p
                                      className="font-bold text-base leading-5 xl:leading-6 xl:text-lg"
                                      style={{ color: primaryColor }}
                                    >
                                      تفاصيل
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* العقارات المشابهة - القسم المنفصل */}
      </div>
      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة العقار</DialogTitle>
          {selectedImage && selectedImage.trim() !== "" && property && (
            <div
              className="relative w-full h-[80vh] group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
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

      {/* Dialog لمشاركة العقار */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-gray-800">
              مشاركة العقار
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-sm">
              شارك هذا العقار مع أصدقائك
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