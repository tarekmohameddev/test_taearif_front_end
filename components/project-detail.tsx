"use client";

import { useState, useRef, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingIcon,
  UsersIcon,
  HomeIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  PlayIcon,
  LayersIcon,
  ArrowUpDownIcon,
  RulerIcon,
  TagIcon,
  WrenchIcon,
  StarIcon,
  CopyIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  MessageCircleIcon,
  EyeIcon,
  BedIcon,
  Eye,
  Bed,
  Bath,
  Square,
  MapPin,
} from "lucide-react";

interface Project {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  address?: string;
  metaKeyword?: string;
  metaDescription?: string;
  developer?: string;
  units?: number;
  completionDate?: string;
  completeStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  image?: string;
  images?: string[];
  floorplans?: string[];
  videoUrl?: string | null;
  amenities?: string[];
  featured?: boolean;
  published?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  specifications?: any[];
  types?: any[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for compatibility
  district?: string;
  price?: string;
  views?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: string;
  transactionType?: string;
  status?: string;
  features?: string[];
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  floors?: number;
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

interface ProjectDetailProps {
  projectSlug: string;
}

export default function ProjectDetail({ projectSlug }: ProjectDetailProps) {
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

  // Tenant ID hook
  const { tenantId, isLoading: tenantLoading } = useTenantId();

  // Get tenant data from store
  const { tenantData, loadingTenantData } = useTenantStore();

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

  // Helper function to convert hex color to CSS filter for SVG coloring
  const hexToFilter = (hex: string): string => {
    if (!hex || !hex.startsWith("#")) {
      // Default emerald-600 filter
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(93%) contrast(94%)";
    }

    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) {
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(93%) contrast(94%)";
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
    const hue = Math.round(h * 360);
    const saturation = Math.round(s * 100);
    const lightness = Math.round(l * 100);

    const brightness = lightness > 50 ? (lightness - 50) * 2 : 0;
    const contrast = 100 + saturation * 0.5;

    return `brightness(0) saturate(100%) invert(${Math.round((1 - lightness / 100) * 100)}%) sepia(${Math.round(saturation)}%) saturate(${Math.round(saturation * 5)}%) hue-rotate(${hue}deg) brightness(${Math.round(100 + brightness)}%) contrast(${Math.round(contrast)}%)`;
  };

  const primaryColorHover = getDarkerColor(primaryColor, 20);
  const primaryColorFilter = hexToFilter(primaryColor);

  // Project data state
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  // الحصول على مشاريع مشابهة من API
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // جلب بيانات المشروع
  const fetchProject = async () => {
    try {
      setLoadingProject(true);
      setProjectError(null);

      if (!tenantId) {
        setLoadingProject(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${tenantId}/projects/${projectSlug}`,
      );

      // Handle new API response format
      if (response.data && response.data.project) {
        setProject(response.data.project);
      } else if (response.data) {
        // If the project is returned directly
        setProject(response.data);
      } else {
        setProjectError("المشروع غير موجود");
      }
    } catch (error) {
      console.error("ProjectDetail: Error fetching project:", error);
      setProjectError("حدث خطأ في تحميل بيانات المشروع");
    } finally {
      setLoadingProject(false);
    }
  };

  // جلب المشاريع المشابهة
  const fetchSimilarProjects = async () => {
    try {
      setLoadingSimilar(true);

      if (!tenantId) {
        setLoadingSimilar(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${tenantId}/projects?latest=1&limit=10`,
      );

      // Handle new API response format
      if (response.data && response.data.projects) {
        setSimilarProjects(response.data.projects);
        console.log(
          `ProjectDetail: ✅ Similar projects loaded: ${response.data.projects.length} items`,
        );
      } else if (response.data && Array.isArray(response.data)) {
        // If projects are returned directly as array
        setSimilarProjects(response.data);
        console.log(
          `ProjectDetail: ✅ Similar projects loaded: ${response.data.length} items`,
        );
      } else {
        console.log("ProjectDetail: ⚠️ No similar projects found in response");
        setSimilarProjects([]);
      }
    } catch (error) {
      console.error("Error fetching similar projects:", error);
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

  // Sharing functions
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const getShareText = () => {
    if (!project) return "";
    return `شاهد هذا المشروع العقاري الرائع: ${project.title} - ${project.address || project.district}`;
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

  const handlePreviousImage = () => {
    if (projectImages.length === 0) return;

    const prevIndex =
      selectedImageIndex > 0
        ? selectedImageIndex - 1
        : projectImages.length - 1;

    const prevImage = projectImages[prevIndex];
    if (prevImage && prevImage.trim() !== "") {
      setSelectedImageIndex(prevIndex);
      setSelectedImage(prevImage);
    }
  };

  const handleNextImage = () => {
    if (projectImages.length === 0) return;

    const nextIndex =
      selectedImageIndex < projectImages.length - 1
        ? selectedImageIndex + 1
        : 0;

    const nextImage = projectImages[nextIndex];
    if (nextImage && nextImage.trim() !== "") {
      setSelectedImageIndex(nextIndex);
      setSelectedImage(nextImage);
    }
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

  // جلب بيانات المشروع والمشاريع المشابهة عند تحميل المكون
  useEffect(() => {
    if (tenantId) {
      fetchProject();
      fetchSimilarProjects();
    }
  }, [tenantId, projectSlug]);

  // تحديث الصورة الرئيسية عند تحميل المشروع
  useEffect(() => {
    if (project?.image) {
      setMainImage(project.image);
    }
  }, [project]);

  // صور المشروع - computed value
  const projectImages =
    project && project.image
      ? [
          project.image,
          ...(project.images || []), // Add additional images if available
        ].filter((img) => img && img.trim() !== "")
      : []; // Filter out empty images

  // Show skeleton loading while tenant or project is loading
  if (tenantLoading || loadingProject) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
            {/* المحتوى الرئيسي - Skeleton */}
            <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
              <div className="flex flex-col gap-y-8 lg:gap-y-10">
                {/* العنوان ونوع العرض - Skeleton */}
                <div className="flex flex-row items-center justify-between">
                  <div className="h-8 w-20 bg-emerald-200 rounded-md animate-pulse md:w-28 md:h-11"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* تفاصيل المشروع - Skeleton */}
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

                {/* تفاصيل المشروع في شبكة - Skeleton */}
                <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="flex flex-row gap-x-2 md:gap-x-6 items-center"
                    >
                      <div className="flex flex-row gap-x-2 items-center">
                        <div className="w-4 h-4 bg-emerald-200 rounded animate-pulse"></div>
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
            {/* وصف المشروع ونموذج الحجز - Skeleton */}
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
                <div className="h-10 bg-emerald-200 rounded-md animate-pulse w-full"></div>
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

                  <div className="h-12 bg-emerald-200 rounded-md animate-pulse w-[200px] mx-auto"></div>
                </div>
              </div>
            </div>

            {/* المشاريع المشابهة - Skeleton */}
            <div className="flex-1">
              <div className="h-10 bg-emerald-200 rounded-md animate-pulse w-full mb-8 md:h-13"></div>

              {/* عرض المشاريع المشابهة للديسكتوب - Skeleton */}
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

              {/* عرض المشاريع المشابهة للموبايل - Skeleton */}
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

  // Show error if project failed to load
  if (projectError || !project) {
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
              {projectError || "المشروع غير موجود"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من صحة رابط المشروع
            </p>
            <button
              onClick={() => fetchProject()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
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
              {/* العنوان ونوع العرض */}
              <div className="flex flex-row items-center justify-between">
                <h1
                  className="font-bold text-xs xs:text-sm leading-4 rounded-md text-white px-3 py-2 flex items-center justify-center md:text-xl lg:text-2xl md:px-4 md:py-3 whitespace-nowrap"
                  style={{ backgroundColor: primaryColor }}
                >
                  مشروع عقاري
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

              {/* تفاصيل المشروع */}
              <div className="space-y-4">
                <p className="font-bold text-gray-600 text-xs xs:text-sm leading-4 md:text-2xl md:leading-7">
                  {project.district}
                </p>
                <p className="font-bold text-gray-600 text-xl leading-6 md:leading-7">
                  {project.title}
                </p>
                {(project.minPrice &&
                  project.minPrice.trim() !== "" &&
                  parseFloat(project.minPrice) > 0) ||
                (project.maxPrice &&
                  project.maxPrice.trim() !== "" &&
                  parseFloat(project.maxPrice) > 0) ||
                (project.price && project.price.trim() !== "") ? (
                  <p
                    className="text-2xl leading-7 font-bold md:text-3xl lg:leading-9 flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    {project.minPrice &&
                    project.maxPrice &&
                    parseFloat(project.minPrice) > 0 &&
                    parseFloat(project.maxPrice) > 0 ? (
                      <>
                        {project.minPrice} - {project.maxPrice}
                        <img
                          src="/Saudi_Riyal_Symbol.svg"
                          alt="ريال سعودي"
                          className="w-6 h-6"
                        />
                      </>
                    ) : project.price ? (
                      <>
                        {project.price}
                        <img
                          src="/Saudi_Riyal_Symbol.svg"
                          alt="ريال سعودي"
                          className="w-6 h-6"
                        />
                      </>
                    ) : null}
                  </p>
                ) : null}

                <p className="text-gray-600 text-sm leading-6 font-normal md:text-base lg:text-xl lg:leading-7 whitespace-pre-line">
                  {project.description || "لا يوجد وصف متاح لهذا المشروع"}
                </p>
              </div>

              {/* تفاصيل المشروع في شبكة */}
              <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                {/* عنوان المشروع */}
                {project.address && project.address.trim() !== "" ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <MapPinIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        العنوان:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.address}
                    </p>
                  </div>
                ) : null}

                {/* المطور */}
                {project.developer && project.developer.trim() !== "" ? (
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
                        المطور:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.developer}
                    </p>
                  </div>
                ) : null}

                {/* عدد الوحدات */}
                {project.units && project.units > 0 ? (
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
                        عدد الوحدات:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.units} وحدة
                    </p>
                  </div>
                ) : null}

                {/* تاريخ التسليم */}
                {project.completionDate &&
                project.completionDate.trim() !== "" ? (
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
                        تاريخ التسليم:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {new Date(project.completionDate).toLocaleDateString(
                        "ar-US",
                      )}
                    </p>
                  </div>
                ) : null}

                {/* حالة الإكمال */}
                {project.completeStatus &&
                project.completeStatus.trim() !== "" ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <WrenchIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        حالة الإكمال:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.completeStatus === "1" ? "مكتمل" : "قيد الإنشاء"}
                    </p>
                  </div>
                ) : null}

                {/* السعر الأدنى */}
                {project.minPrice &&
                project.minPrice.trim() !== "" &&
                parseFloat(project.minPrice) > 0 ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        السعر الأدنى:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.minPrice} ريال
                    </p>
                  </div>
                ) : null}

                {/* السعر الأعلى */}
                {project.maxPrice &&
                  project.maxPrice.trim() !== "" &&
                  parseFloat(project.maxPrice) > 0 && (
                    <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                      <div className="flex flex-row gap-x-2">
                        <p
                          className="font-normal text-xs xs:text-sm md:text-base leading-4"
                          style={{ color: primaryColor }}
                        >
                          السعر الأعلى:
                        </p>
                      </div>
                      <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                        {project.maxPrice} ريال
                      </p>
                    </div>
                  )}

                {/* فيديو المشروع */}
                {project.videoUrl && project.videoUrl.trim() !== "" ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <PlayIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        فيديو المشروع:
                      </p>
                    </div>
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold leading-4 text-xs xs:text-sm md:text-base underline"
                      style={{ color: primaryColor }}
                    >
                      مشاهدة الفيديو
                    </a>
                  </div>
                ) : null}

                {/* الموقع */}
                {project.location &&
                  ((project.location.lat && project.location.lng) ||
                    (project.location.address &&
                      project.location.address.trim() !== "")) && (
                    <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                      <div className="flex flex-row gap-x-2">
                        <MapPinIcon
                          className="w-4 h-4"
                          style={{ color: primaryColor }}
                        />
                      </div>
                      {project.location.lat && project.location.lng ? (
                        <a
                          href={`https://maps.google.com/?q=${project.location.lat},${project.location.lng}&entry=gps`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold leading-4 text-xs xs:text-sm md:text-base underline"
                          style={{ color: primaryColor }}
                        >
                          عرض الموقع
                        </a>
                      ) : (
                        <span className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                          {project.location.address}
                        </span>
                      )}
                    </div>
                  )}

                {/* تاريخ الإنشاء */}
                {project.createdAt && project.createdAt.trim() !== "" ? (
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
                        تاريخ الإنشاء:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {new Date(project.createdAt).toLocaleDateString("ar-US")}
                    </p>
                  </div>
                ) : null}

                {/* تاريخ التحديث */}
                {project.updatedAt && project.updatedAt.trim() !== "" ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <ClockIcon
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        آخر تحديث:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {new Date(project.updatedAt).toLocaleDateString("ar-US")}
                    </p>
                  </div>
                ) : null}

                {/* المرافق */}
                {project.amenities && project.amenities.length > 0 ? (
                  <div className="col-span-2">
                    <div className="flex flex-row gap-x-2 md:gap-x-6">
                      <div className="flex flex-row gap-x-2">
                        <StarIcon
                          className="w-4 h-4"
                          style={{ color: primaryColor }}
                        />
                        <p
                          className="font-normal text-xs xs:text-sm md:text-base leading-4"
                          style={{ color: primaryColor }}
                        >
                          المرافق:
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${primaryColor}20`,
                              color: getDarkerColor(primaryColor, 40),
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* المواصفات */}
                {project.specifications && project.specifications.length > 0 ? (
                  <div className="col-span-2">
                    <div className="flex flex-row gap-x-2 md:gap-x-6">
                      <div className="flex flex-row gap-x-2">
                        <WrenchIcon
                          className="w-4 h-4"
                          style={{ color: primaryColor }}
                        />
                        <p
                          className="font-normal text-xs xs:text-sm md:text-base leading-4"
                          style={{ color: primaryColor }}
                        >
                          المواصفات:
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.specifications.map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {typeof spec === "object"
                              ? spec.name || spec.title
                              : spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* الأنواع */}
                {project.types && project.types.length > 0 ? (
                  <div className="col-span-2">
                    <div className="flex flex-row gap-x-2 md:gap-x-6">
                      <div className="flex flex-row gap-x-2">
                        <TagIcon
                          className="w-4 h-4"
                          style={{ color: primaryColor }}
                        />
                        <p
                          className="font-normal text-xs xs:text-sm md:text-base leading-4"
                          style={{ color: primaryColor }}
                        >
                          الأنواع:
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.types.map((type, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {typeof type === "object"
                              ? type.name || type.title
                              : type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {project.features && project.features.length > 0 ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        المميزات:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.features.join(", ")}
                    </p>
                  </div>
                ) : null}

                {project.status ? (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <p
                        className="font-normal text-xs xs:text-sm md:text-base leading-4"
                        style={{ color: primaryColor }}
                      >
                        الحالة:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {project.status === "available" ? "متاح" : project.status}
                    </p>
                  </div>
                ) : null}

                {project.createdAt ? (
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
                        تاريخ الإضافة:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {new Date(project.createdAt).toLocaleDateString("ar-US")}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              {/* الصورة الأساسية */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6">
                {mainImage && project ? (
                  <Image
                    src={mainImage}
                    alt={project.title || "صورة المشروع"}
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
                <div className="absolute bottom-2 right-2 opacity-80">
                  <div className="w-24 h-fit bg-white/20 rounded flex items-center justify-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`}
                      alt="تعاريف العقارية"
                      width={160}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* نص توضيحي - يظهر فقط عند وجود صور إضافية */}
              {projectImages.length > 1 && (
                <p className="text-xs text-gray-500 mb-2 text-center">
                  اضغط على أي صورة لفتحها في نافذة منبثقة
                </p>
              )}

              {/* Carousel للصور المصغرة - يظهر فقط عند وجود صور إضافية */}
              {projectImages.length > 0 && project && (
                <SwiperCarousel
                  items={projectImages
                    .filter((imageSrc) => imageSrc && imageSrc.trim() !== "") // Filter out empty images
                    .map((imageSrc, index) => (
                      <div key={index} className="relative h-[10rem] md:h-24">
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
                        <div className="absolute bottom-2 right-2 opacity-80">
                          <div className="w-12 h-fit bg-white/20 rounded flex items-center justify-center">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`}
                              alt="تعاريف العقارية"
                              width={160}
                              height={80}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  space={16}
                  autoplay={false}
                  desktopCount={4}
                  slideClassName="!h-[10rem] md:!h-[96px]"
                />
              )}

              {/* مخططات الأرضية */}
              {project.floorplans &&
                project.floorplans.length > 0 &&
                project.floorplans.some(
                  (plan) => plan && plan.trim() !== "",
                ) && (
                  <div className="mt-8">
                    <h3
                      className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      مخططات الأرضية
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {project.floorplans
                        .filter((plan) => plan && plan.trim() !== "")
                        .map((floorplan, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={floorplan}
                              alt={`مخطط الأرضية ${index + 1}`}
                              width={200}
                              height={150}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                setSelectedImage(floorplan);
                                setSelectedImageIndex(0);
                                setIsDialogOpen(true);
                              }}
                            />
                            <div className="absolute bottom-1 right-1 opacity-50">
                              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                <span className="text-white text-xs">مخطط</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* خريطة الموقع */}
              {project.location &&
              project.location.lat &&
              project.location.lng ? (
                <div className="mt-8">
                  <h3
                    className="pr-4 md:pr-0 mb-4 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                    style={{ backgroundColor: primaryColor }}
                  >
                    موقع المشروع
                  </h3>
                  <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
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
                  </div>
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
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المشاريع المشابهة */}
          {loadingSimilar ? (
            <div className="flex-1">
              <div>
                <h3
                  className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  مشاريع مشابهة
                </h3>

                {/* عرض المشاريع المشابهة للديسكتوب */}
                <div className="hidden md:block">
                  {loadingSimilar ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse"
                        >
                          <div className="relative w-full h-96 bg-gray-200"></div>
                          <div className="p-6">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                            <div className="flex gap-2">
                              <div className="h-8 bg-gray-200 rounded w-16"></div>
                              <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {similarProjects.map((similarProject) => (
                        <Link
                          key={similarProject.id}
                          href={`/project/${similarProject.slug || similarProject.id}`}
                          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 cursor-pointer"
                        >
                          {/* Image Container */}
                          <div className="relative w-full h-96 overflow-hidden">
                            <Image
                              src={similarProject.image ?? "/placeholder.jpg"}
                              alt={similarProject.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            {/* Views Counter - Top Right */}
                            {similarProject.views && (
                              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm backdrop-blur-sm">
                                <>
                                  <Eye className="w-4 h-4" />
                                  <span>{similarProject.views}</span>
                                </>
                              </div>
                            )}
                            {/* Content Overlay - Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              {/* Title */}
                              <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                                {similarProject.title}
                              </h3>

                              {/* District */}
                              {similarProject.district &&
                                similarProject.district.trim() !== "" && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-blue-300" />
                                    <span className="text-sm text-gray-200">
                                      {similarProject.district}
                                    </span>
                                  </div>
                                )}

                              {/* Project Details */}
                              <div className="flex items-center gap-4 mb-4 flex-wrap">
                                {similarProject.developer &&
                                  similarProject.developer.trim() !== "" &&
                                  similarProject.developer !==
                                    "Unknown Developer" && (
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                                      <BuildingIcon className="w-4 h-4" />
                                      <span className="text-sm font-medium">
                                        {similarProject.developer}
                                      </span>
                                    </div>
                                  )}
                                {similarProject.completionDate && (
                                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      {new Date(
                                        similarProject.completionDate,
                                      ).toLocaleDateString("ar-US")}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Price */}
                              {((similarProject.minPrice &&
                                similarProject.minPrice.trim() !== "" &&
                                parseFloat(similarProject.minPrice) > 0) ||
                                (similarProject.maxPrice &&
                                  similarProject.maxPrice.trim() !== "" &&
                                  parseFloat(similarProject.maxPrice) > 0) ||
                                (similarProject.price &&
                                  similarProject.price.trim() !== "")) && (
                                <div className="flex items-center gap-2">
                                  <p className="text-2xl font-bold text-white">
                                    {similarProject.minPrice &&
                                    similarProject.maxPrice &&
                                    parseFloat(similarProject.minPrice) > 0 &&
                                    parseFloat(similarProject.maxPrice) > 0
                                      ? `${similarProject.minPrice} - ${similarProject.maxPrice}`
                                      : similarProject.price
                                        ? similarProject.price
                                        : similarProject.minPrice &&
                                            parseFloat(
                                              similarProject.minPrice,
                                            ) > 0
                                          ? similarProject.minPrice
                                          : similarProject.maxPrice &&
                                              parseFloat(
                                                similarProject.maxPrice,
                                              ) > 0
                                            ? similarProject.maxPrice
                                            : null}
                                  </p>
                                  <img
                                    src="/Saudi_Riyal_Symbol.svg"
                                    alt="ريال سعودي"
                                    className="w-6 h-6"
                                    style={{
                                      filter: "brightness(100)",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* عرض المشاريع المشابهة للموبايل */}
                <div className="block md:hidden">
                  <div className="flex gap-4 overflow-x-auto">
                    {loadingSimilar
                      ? [1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 min-w-[300px] animate-pulse"
                          >
                            <div className="relative w-full h-64 bg-gray-200"></div>
                            <div className="p-4">
                              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                              <div className="flex gap-2">
                                <div className="h-6 bg-gray-200 rounded w-12"></div>
                                <div className="h-6 bg-gray-200 rounded w-12"></div>
                              </div>
                            </div>
                          </div>
                        ))
                      : similarProjects.map((similarProject) => (
                          <Link
                            key={similarProject.id}
                            href={`/project/${similarProject.slug || similarProject.id}`}
                            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 cursor-pointer min-w-[300px]"
                          >
                            {/* Image Container */}
                            <div className="relative w-full h-64 overflow-hidden">
                              <Image
                                src={similarProject.image ?? "/placeholder.jpg"}
                                alt={similarProject.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                              {/* Views Counter - Top Right */}
                              {similarProject.views && (
                                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs backdrop-blur-sm">
                                  <Eye className="w-3 h-3" />
                                  <span>{similarProject.views}</span>
                                </div>
                              )}

                              {/* Content Overlay - Bottom */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                {/* Title */}
                                <h3 className="text-lg font-bold mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                                  {similarProject.title}
                                </h3>

                                {/* District */}
                                {similarProject.district &&
                                  similarProject.district.trim() !== "" && (
                                    <div className="flex items-center gap-1 mb-2">
                                      <MapPin className="w-3 h-3 text-blue-300" />
                                      <span className="text-xs text-gray-200">
                                        {similarProject.district}
                                      </span>
                                    </div>
                                  )}

                                {/* Project Details */}
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  {similarProject.developer &&
                                    similarProject.developer.trim() !== "" &&
                                    similarProject.developer !==
                                      "Unknown Developer" && (
                                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                                        <BuildingIcon className="w-3 h-3" />
                                        <span className="text-xs font-medium">
                                          {similarProject.developer}
                                        </span>
                                      </div>
                                    )}
                                  {similarProject.units &&
                                    typeof similarProject.units === "number" &&
                                    similarProject.units > 0 && (
                                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                                        <HomeIcon className="w-3 h-3" />
                                        <span className="text-xs font-medium">
                                          {similarProject.units} وحدة
                                        </span>
                                      </div>
                                    )}
                                  {similarProject.completionDate && (
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                                      <CalendarIcon className="w-3 h-3" />
                                      <span className="text-xs font-medium">
                                        {new Date(
                                          similarProject.completionDate,
                                        ).toLocaleDateString("ar-US")}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Price */}
                                {((similarProject.minPrice &&
                                  similarProject.minPrice.trim() !== "" &&
                                  parseFloat(similarProject.minPrice) > 0) ||
                                  (similarProject.maxPrice &&
                                    similarProject.maxPrice.trim() !== "" &&
                                    parseFloat(similarProject.maxPrice) > 0) ||
                                  (similarProject.price &&
                                    similarProject.price.trim() !== "")) && (
                                  <div className="flex items-center gap-1">
                                    <p className="text-lg font-bold text-white">
                                      {similarProject.minPrice &&
                                      similarProject.maxPrice &&
                                      parseFloat(similarProject.minPrice) > 0 &&
                                      parseFloat(similarProject.maxPrice) > 0
                                        ? `${similarProject.minPrice} - ${similarProject.maxPrice}`
                                        : similarProject.price
                                          ? similarProject.price
                                          : similarProject.minPrice &&
                                              parseFloat(
                                                similarProject.minPrice,
                                              ) > 0
                                            ? similarProject.minPrice
                                            : similarProject.maxPrice &&
                                                parseFloat(
                                                  similarProject.maxPrice,
                                                ) > 0
                                              ? similarProject.maxPrice
                                              : null}
                                    </p>
                                    <img
                                      src="/Saudi_Riyal_Symbol.svg"
                                      alt="ريال سعودي"
                                      className="w-4 h-4"
                                      style={{
                                        filter: "brightness(0) saturate(100%)",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة المشروع</DialogTitle>
          {selectedImage && selectedImage.trim() !== "" && project && (
            <div
              className="relative w-full h-[80vh] group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={selectedImage}
                alt={project.title || "صورة المشروع"}
                fill
                className="object-contain rounded-lg"
              />

              {/* أسهم التنقل */}
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

              {/* عداد الصور */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {projectImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog لمشاركة المشروع */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-gray-800">
              مشاركة المشروع
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-sm">
              شارك هذا المشروع مع أصدقائك
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
                className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
