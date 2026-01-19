"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";
import toast from "react-hot-toast";
import {
  Activity,
  Copy,
  Edit,
  ExternalLink,
  FilterX,
  Grid3X3,
  Eye,
  List,
  MapPin,
  MoreHorizontal,
  Ruler,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Building,
  Tag,
  Key,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import EmptyState from "@/components/empty-state";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ActiveFiltersDisplay } from "@/components/property/active-filters-display";
import { Badge } from "@/components/ui/badge";

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  from,
  to,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  from: number;
  to: number;
}) {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        عرض {from} إلى {to} من {totalItems} وحدة
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SkeletonPropertyCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-gray-300"></div>
      </div>
      <CardHeader className="p-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="h-8 w-full bg-gray-300 rounded"></div>
        <div className="h-8 w-full bg-gray-300 rounded"></div>
      </CardFooter>
    </Card>
  );
}

const getPaymentMethodText = (paymentMethod: any) => {
  const paymentMethods: { [key: string]: string } = {
    monthly: "شهري",
    quarterly: "ربع سنوي",
    semi_annual: "نصف سنوي",
    annual: "سنوي",
  };
  return paymentMethods[paymentMethod] || null;
};

const truncateTitle = (title: string, maxLength: number = 40): string => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
};

// Helper function to translate validation errors
const translateValidationError = (error: string): string => {
  if (typeof error !== 'string') return error;
  
  if (error.includes("City location is required") || 
      error.includes("Please provide city_id or city_name")) {
    return "المدينة مطلوبة. يرجى اختيار المدينة.";
  }
  
  return error;
};

// Helper function to translate validation errors array
const translateValidationErrors = (errors: string[]): string[] => {
  if (!Array.isArray(errors)) return [];
  return errors.map(translateValidationError);
};

// Helper function to extract city and district/neighborhood from property
function formatAddress(property: any): string {
  const city = property?.city?.name_ar || property?.city?.name || property?.city_name || property?.city;
  const district = property?.district?.name_ar || property?.district?.name || property?.district_name || property?.district || property?.neighborhood?.name_ar || property?.neighborhood?.name || property?.neighborhood;
  
  if (district && city) {
    return `${district}، ${city}`;
  } else if (city) {
    return city;
  } else if (district) {
    return district;
  }
  
  const address = property?.address || property?.contents?.[0]?.address;
  if (!address) return "";
  
  const cities = [
    "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", 
    "الخبر", "الطائف", "بريدة", "تبوك", "خميس مشيط", "حائل",
    "الجبيل", "نجران", "أبها", "ينبع", "الباحة", "عرعر", "سكاكا"
  ];
  
  let parsedCity = "";
  let parsedDistrict = "";
  
  const addressParts = address.split(/[،,،\-–—]/).map(p => p.trim()).filter(p => p);
  
  for (let i = addressParts.length - 1; i >= 0; i--) {
    const part = addressParts[i];
    for (const cityName of cities) {
      if (part.includes(cityName)) {
        parsedCity = cityName;
        break;
      }
    }
    if (parsedCity) break;
  }
  
  if (addressParts.length > 0) {
    const cityIndex = addressParts.findIndex(p => p.includes(parsedCity));
    
    if (cityIndex > 0) {
      parsedDistrict = addressParts[cityIndex - 1];
    } else if (addressParts.length > 0 && !parsedCity) {
      parsedDistrict = addressParts[0];
    }
  }
  
  if (parsedDistrict && parsedCity) {
    return `${parsedDistrict}، ${parsedCity}`;
  } else if (parsedCity) {
    return parsedCity;
  } else if (parsedDistrict) {
    return parsedDistrict;
  }
  
  return address;
}

interface PropertyCardProps {
  property: any;
  allProperties?: any[];
  currentIndex?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (property: any) => void;
  onToggleStatus?: (property: any) => void;
  setReorderPopup?: any;
  onCompleteDraft?: (id: string) => void;
}

function PropertyCard({
  property,
  allProperties = [],
  currentIndex = 0,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onToggleStatus,
  setReorderPopup,
  onCompleteDraft,
}: PropertyCardProps & { setReorderPopup: any; onCompleteDraft?: (id: string) => void }) {
  const router = useRouter();
  const { userData } = useAuthStore();
  const [columnsCount, setColumnsCount] = useState(4);
  
  useEffect(() => {
    const updateColumnsCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setColumnsCount(4);
      } else if (width >= 640) {
        setColumnsCount(3);
      } else {
        setColumnsCount(1);
      }
    };
    
    updateColumnsCount();
    window.addEventListener('resize', updateColumnsCount);
    return () => window.removeEventListener('resize', updateColumnsCount);
  }, []);
  
  const hasStackedFooterInSameRow = () => {
    if (!allProperties || allProperties.length === 0) return false;
    
    const currentRow = Math.floor(currentIndex / columnsCount);
    const rowStart = currentRow * columnsCount;
    const rowEnd = rowStart + columnsCount;
    
    for (let i = rowStart; i < rowEnd && i < allProperties.length; i++) {
      const prop = allProperties[i];
      if (getPaymentMethodText(prop.payment_method) && prop.transaction_type !== "sale" && prop.purpose !== "sale") {
        return true;
      }
    }
    return false;
  };
  
  const hasFeaturesInSameRow = () => {
    if (!allProperties || allProperties.length === 0) return false;
    
    const currentRow = Math.floor(currentIndex / columnsCount);
    const rowStart = currentRow * columnsCount;
    const rowEnd = rowStart + columnsCount;
    
    for (let i = rowStart; i < rowEnd && i < allProperties.length; i++) {
      const prop = allProperties[i];
      if (Array.isArray(prop.features) && prop.features.length > 0) {
        return true;
      }
    }
    return false;
  };
  
  const formattedAddress = formatAddress(property);
  
  const handleCardClick = () => {
    router.push(`/dashboard/properties/${property.id}?draft=true`);
  };
  
  const isStackedFooter = hasStackedFooterInSameRow();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
      dir="rtl"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={
              property.thumbnail ||
              property.featured_image ||
              "/placeholder.svg"
            }
            alt={property.title || property.contents?.[0]?.title || "Property"}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {property.featured && (
          <div className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            مميز
          </div>
        )}
        <div className="absolute left-2 top-2 rounded-md px-2 py-1 text-xs font-medium bg-amber-500 text-white">
          مسودة
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle
              className={`line-clamp-2 max-w-[300px] font-semibold ${(property.title || property.contents?.[0]?.title || "").length > 20 ? "text-sm " : ""}`}
            >
              {property.title || property.contents?.[0]?.title ? (
                truncateTitle(property.title || property.contents?.[0]?.title)
              ) : (
                <span className="text-sm text-muted-foreground font-normal">لا يوجد عنوان للعقار</span>
              )}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formattedAddress || "لا يوجد عنوان"}
            </CardDescription>
            <div className="mt-2 space-y-1">
              {property.missing_fields_ar && property.missing_fields_ar.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {property.missing_fields_ar.slice(0, 3).map((field: string, index: number) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                  {property.missing_fields_ar.length > 3 && (
                    <Badge variant="destructive" className="text-xs">
                      +{property.missing_fields_ar.length - 3} أكثر
                    </Badge>
                  )}
                </div>
              )}
              {property.validation_errors && property.validation_errors.length > 0 && (
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="inline h-3 w-3 ml-1" />
                  {property.validation_errors[0]}
                  {property.validation_errors.length > 1 && (
                    <span> (+{property.validation_errors.length - 1} أخطاء أخرى)</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="-mr-2 bg-muted hover:bg-muted/80"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-1 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              {property.featured && (
                <DropdownMenuItem
                  onClick={() => {
                    setReorderPopup({ open: true, type: "featured" });
                  }}
                >
                  <Grid3X3 className="ml-2 h-4 w-4" />
                  ترتيب الوحدة في الرئيسية
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setReorderPopup({ open: true, type: "normal" });
                }}
              >
                <List className="ml-2 h-4 w-4" />
                ترتيب الوحدة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push("/dashboard/properties/" + property.id + "/edit?draft=true")
                }
              >
                <Edit className="ml-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const domain = useAuthStore.getState().userData?.domain || "";
                  const url = domain.startsWith("http")
                    ? `${domain}property/${property.slug}`
                    : `https://${domain}/property/${property.slug}`;
                  window.open(url, "_blank");
                }}
              >
                <ExternalLink className="ml-2 h-4 w-4" />
                معاينة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url = `/dashboard/activity-logs/property/${property.id}`;
                  window.open(url, "_blank");
                }}
              >
                <Activity className="ml-2 h-4 w-4" />
                سجل النشاطات
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(property)}>
                <Copy className="ml-2 h-4 w-4" />
                مضاعفة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                <ExternalLink className="ml-2 h-4 w-4" />
                نشر
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(property.id)}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف الوحدة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="grid gap-2 text-sm grid-cols-2">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">مشاهدات</span>
            <span className="font-medium flex items-center gap-1">
              <Eye className="h-3 w-3" /> {property.visits || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">المساحة</span>
            <span className="font-medium flex items-center gap-1">
              <Ruler className="h-3 w-3" /> {property.size || property.area || 0} م²
            </span>
          </div>
        </div>
        <div className={hasFeaturesInSameRow() ? "pt-2 min-h-[30px]" : ""}>
          {Array.isArray(property.features) && property.features.length > 0 ? (
            <div className="grid grid-cols-2 gap-1">
              {property.features
                .slice(0, 2)
                .map((feature: string, index: number) => (
                  <div key={index} className="flex justify-center">
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold justify-center max-w-[150px]"
                    >
                      {feature}
                    </Badge>
                  </div>
                ))}
            </div>
          ) : hasFeaturesInSameRow() ? (
            <div className="h-[30px]"></div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter 
        className="p-4 pt-0 flex flex-col gap-2" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-semibold flex gap-1 text-lg w-full justify-center">
          {property.transaction_type === "sale" ||
          property.purpose === "sale" ? (
            <>
              <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-[1.35rem] h-[1.35rem] filter brightness-0 contrast-100 mt-0.5"
              />
            </>
          ) : (
            <>
              <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className={`filter brightness-0 contrast-100 mt-0.5 ${getPaymentMethodText(property.payment_method) ? "w-[1.1rem] h-[1.1rem]" : "w-[1.35rem] h-[1.35rem]"}`}
              />
              {getPaymentMethodText(property.payment_method) && (
                <span className="text-sm">/{getPaymentMethodText(property.payment_method)}</span>
              )}
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 w-full"
          onClick={() =>
            router.push("/dashboard/properties/" + property.id + "/edit?draft=true")
          }
        >
          <Edit className="h-3.5 w-3.5" />
          تعديل
        </Button>
      </CardFooter>
    </Card>
  );
}

function PropertyListItem({
  property,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onToggleStatus,
  setReorderPopup,
  onCompleteDraft,
}: PropertyCardProps & { onCompleteDraft?: (id: string) => void }) {
  const router = useRouter();
  
  const formattedAddress = formatAddress(property);
  
  const handleCardClick = () => {
    router.push(`/dashboard/properties/${property.id}?draft=true`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row-reverse h-64">
        <div className="relative w-full sm:w-64 flex-shrink-0 h-full">
          <div className="w-full h-full overflow-hidden">
            <img
              src={
                property.thumbnail ||
                property.featured_image ||
                "/placeholder.svg"
              }
              alt={property.title || property.contents?.[0]?.title || "Property"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-row-reverse items-start justify-between">
            <div className="text-lg font-semibold">
              {property.transaction_type === "sale" ||
              property.purpose === "sale" ? (
                <div className="flex gap-1">
                  <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-[1.15rem] h-[1.15rem] filter brightness-0 contrast-100 mt-0.5"
                  />
                </div>
              ) : (
                <div className="flex gap-1">
                  <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-[1.15rem] h-[1.15rem] filter brightness-0 contrast-100 mt-0.5"
                  />
                  {getPaymentMethodText(property.payment_method) && (
                    <span>/{getPaymentMethodText(property.payment_method)}</span>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <h3 className="font-semibold">
                {property.title || property.contents?.[0]?.title ? (
                  property.title || property.contents?.[0]?.title
                ) : (
                  <span className="text-sm text-muted-foreground font-normal">لا يوجد عنوان للعقار</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground flex  items-center gap-1">
                <MapPin className="h-3 w-3" />{" "}
                {formattedAddress || "لا يوجد عنوان"}
              </p>
              <div className="mt-2 space-y-1">
                {property.missing_fields_ar && property.missing_fields_ar.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {property.missing_fields_ar.slice(0, 3).map((field: string, index: number) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {property.missing_fields_ar.length > 3 && (
                      <Badge variant="destructive" className="text-xs">
                        +{property.missing_fields_ar.length - 3} أكثر
                      </Badge>
                    )}
                  </div>
                )}
                {property.validation_errors && property.validation_errors.length > 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="inline h-3 w-3 ml-1" />
                    {property.validation_errors[0]}
                    {property.validation_errors.length > 1 && (
                      <span> (+{property.validation_errors.length - 1} أخطاء أخرى)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {property.featured && (
              <Badge variant="outline" className="bg-primary text-primary-foreground border-primary">
                مميز
              </Badge>
            )}
            <Badge
              variant="outline"
              className="bg-amber-500 text-white border-amber-500"
            >
              مسودة
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <Eye className="h-3 w-3" />
              <span>{property.visits || 0} مشاهدات</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <Ruler className="h-3 w-3" />
              <span>{property.size || property.area || 0} م²</span>
            </Badge>
          </div>
          <div className="mt-auto pt-4 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push("/dashboard/properties/" + property.id + "/edit?draft=true")
              }
            >
              <Edit className="mr-1 h-3.5 w-3.5" />
              تعديل
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-muted hover:bg-muted/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-1 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                  onClick={() => {
                    const domain = useAuthStore.getState().userData?.domain || "";
                    const url = domain.startsWith("http")
                      ? `${domain}property/${property.slug}`
                      : `https://${domain}/property/${property.slug}`;
                    window.open(url, "_blank");
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  معاينة
                </DropdownMenuItem>
                {property.featured && (
                  <DropdownMenuItem
                    onClick={() => {
                      setReorderPopup({ open: true, type: "featured" });
                    }}
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    ترتيب الوحدة في الرئيسية
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    setReorderPopup({ open: true, type: "normal" });
                  }}
                >
                  <List className="mr-2 h-4 w-4" />
                  ترتيب الوحدة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(property)}>
                  <Copy className="mr-2 h-4 w-4" />
                  مضاعفة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  نشر
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(property.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف الوحدة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function IncompletePropertiesManagementPage() {
  // تتبع ما إذا تم تحميل البيانات في هذا المكون
  const hasLoadedRef = useRef(false);
  const fetchCalledRef = useRef(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [filterCityId, setFilterCityId] = useState<string | null>(null);
  const [filterDistrictId, setFilterDistrictId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterPurpose, setFilterPurpose] = useState<string | null>(null);
  const [filterBeds, setFilterBeds] = useState<string | null>(null);
  const [filterPriceFrom, setFilterPriceFrom] = useState<string>("");
  const [filterPriceTo, setFilterPriceTo] = useState<string>("");
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [statistics, setStatistics] = useState<{
    incomplete_count: number;
    for_sale: number;
    for_rent: number;
    total: number;
  } | null>(null);
  const [loadingStatistics, setLoadingStatistics] = useState(true);
  const { userData, IsLoading: authLoading } = useAuthStore();

  const router = useRouter();
  const {
    propertiesManagement: {
      viewMode,
      favorites,
      properties,
      loading,
      error,
      isInitialized,
      pagination,
    },
    setPropertiesManagement,
  } = useStore();

  const [reorderPopup, setReorderPopup] = useState<{
    open: boolean;
    type: "featured" | "normal";
  }>({ open: false, type: "normal" });

  const normalizeStatus = (status: any) => {
    if (status === "1" || status === 1) return "منشور";
    if (status === "0" || status === 0) return "مسودة";
    return status;
  };

  const fetchDrafts = async (page = 1, filters = {}) => {
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      setPropertiesManagement({
        loading: false,
        error: "Authentication required. Please login.",
      });
      return;
    }

    setPropertiesManagement({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              if (key === "employee_id" || key === "category_id" || key === "purpose") {
                value.forEach((item) => {
                  params.append(`${key}[]`, item.toString());
                });
              } else {
                params.set(key, value.join(","));
              }
            }
          } else {
            params.set(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.get(
        `/properties/drafts?${params.toString()}`,
      );

      // الـ API يعيد البيانات مباشرة في data كمصفوفة، وليس في data.drafts
      const drafts = Array.isArray(response.data?.data) 
        ? response.data.data 
        : response.data?.data?.drafts || [];
      const pagination = response.data?.pagination || response.data?.data?.pagination || null;

      const mappedDrafts = drafts.map((draft: any) => {
        let listingType = "للإيجار";
        if (
          draft.purpose === "sold" ||
          draft.purpose === "sale" ||
          String(draft.transaction_type) === "1" ||
          draft.transaction_type === "sale"
        ) {
          listingType = "للبيع";
        }

        return {
          ...draft,
          thumbnail: draft.featured_image,
          listingType,
          status: "مسودة",
          lastUpdated: new Date(draft.created_at).toLocaleDateString("ar-AE"),
          features: Array.isArray(draft.features) ? draft.features : [],
          missing_fields_ar: draft.missing_fields_ar || [],
          validation_errors: translateValidationErrors(draft.validation_errors || []),
        };
      });

      setPropertiesManagement({
        properties: mappedDrafts,
        pagination,
        loading: false,
        isInitialized: true,
      });
    } catch (error) {
      logError(error, "fetchDrafts");
      setPropertiesManagement({
        error: formatErrorMessage(error, "حدث خطأ أثناء جلب المسودات"),
        loading: false,
        isInitialized: true,
      });
    }
  };

  const handleCompleteDraft = async (id: string) => {
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول لإكمال المسودة");
      return;
    }

    try {
      await axiosInstance.post(`/properties/${id}/complete-draft`);
      toast.success("تم إكمال المسودة بنجاح");
      fetchDrafts(currentPage, appliedFilters);
    } catch (error) {
      toast.error("فشل في إكمال المسودة");
      console.error("Error completing draft:", error);
    }
  };

  const normalizedProperties = useMemo(() => {
    return properties.map((property: any) => ({
      ...property,
      status: normalizeStatus(property.status),
    }));
  }, [properties]);

  const setViewMode = (mode: "grid" | "list") => {
    setPropertiesManagement({ viewMode: mode });
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((item: any) => item !== id)
      : [...favorites, id];
    setPropertiesManagement({ favorites: newFavorites });
  };

  const handleDeleteProperty = async (id: string) => {
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping handleDeleteProperty");
      alert("Authentication required. Please login.");
      return;
    }

    const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذه الوحدة؟");
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`properties/${id}`);
        toast.success("تم حذف الوحدة بنجاح");
        fetchDrafts(currentPage, appliedFilters);
      } catch (error) {
        toast.error("فشل في حذف الوحدة");
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleDuplicateProperty = async (property: any) => {
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping handleDuplicateProperty");
      alert("Authentication required. Please login.");
      return;
    }

    try {
      const duplicateData = {
        title: property.title || property.contents?.[0]?.title || "لا يوجد عنوان للعقار",
        price: property.price,
      };

      await axiosInstance.post(
        `/properties/${property.id}/duplicate`,
        duplicateData,
      );
      toast.success("تم مضاعفة الوحدة بنجاح");
      fetchDrafts(currentPage, appliedFilters);
    } catch (error) {
      toast.error("فشل في مضاعفة الوحدة");
      console.error("Error duplicating property:", error);
    }
  };

  const handleToggleStatus = async (property: any) => {
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping handleToggleStatus");
      alert("Authentication required. Please login.");
      return;
    }

    try {
      await axiosInstance.post(`/properties/${property.id}/toggle-status`);
      toast.success("تم النشر بنجاح");
      fetchDrafts(currentPage, appliedFilters);
    } catch (error) {
      toast.error("فشل في تغيير حالة النشر");
      console.error("Error toggling status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchDrafts(page, appliedFilters);
  };

  const applyFilters = () => {
    const newFilters: Record<string, any> = {};
    
    if (filterCityId) newFilters.city_id = filterCityId;
    if (filterDistrictId) newFilters.district_id = filterDistrictId;
    if (filterType) newFilters.type = filterType;
    if (filterPurpose) newFilters.purpose = filterPurpose;
    if (filterBeds) newFilters.beds = filterBeds;
    if (filterPriceFrom) newFilters.price_from = filterPriceFrom;
    if (filterPriceTo) newFilters.price_to = filterPriceTo;
    
    setAppliedFilters(newFilters);
    setCurrentPage(1);
    fetchDrafts(1, newFilters);
  };

  const handleClearFilters = () => {
    setFilterCityId(null);
    setFilterDistrictId(null);
    setFilterType(null);
    setFilterPurpose(null);
    setFilterBeds(null);
    setFilterPriceFrom("");
    setFilterPriceTo("");
    setAppliedFilters({});
    setCurrentPage(1);
    fetchDrafts(1, {});
  };

  const handleRemoveFilter = (filterKey: string, filterValue?: any) => {
    const newFilters: Record<string, any> = { ...appliedFilters };

    if (Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = newFilters[filterKey].filter(
        (item: any) => item !== filterValue,
      );
      if (newFilters[filterKey].length === 0) {
        delete newFilters[filterKey];
      }
    } else {
      delete newFilters[filterKey];
    }

    setAppliedFilters(newFilters);
    setCurrentPage(1);
    fetchDrafts(1, newFilters);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({});
    setCurrentPage(1);
    fetchDrafts(1, {});
  };

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axiosInstance.get("https://nzl-backend.com/api/cities?country_id=1");
        setCities(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Fetch districts when city is selected
  useEffect(() => {
    if (filterCityId) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await axiosInstance.get(`https://nzl-backend.com/api/districts?city_id=${filterCityId}`);
          setDistricts(response.data?.data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setFilterDistrictId(null);
    }
  }, [filterCityId]);

  // جلب الإحصائيات من /properties/cards
  useEffect(() => {
    const fetchStatistics = async () => {
      const { userData } = useAuthStore.getState();
      if (!userData?.token || authLoading) {
        return;
      }

      setLoadingStatistics(true);
      try {
        const response = await axiosInstance.get("/properties/cards");
        const { data } = response.data;

        if (data && typeof data === "object") {
          setStatistics({
            incomplete_count: data.incomplete_count || 0,
            for_sale: data.incomplete?.for_sale || 0,
            for_rent: data.incomplete?.for_rent || 0,
            total: data.total || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoadingStatistics(false);
      }
    };

    fetchStatistics();
  }, [userData?.token, authLoading]);

  useEffect(() => {
    // Wait until token is fetched (following makeSureIsTokenExist.txt pattern)
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // تحميل البيانات عند mount فقط إذا لم يتم تحميلها من قبل
    if (!fetchCalledRef.current) {
      fetchCalledRef.current = true;
      hasLoadedRef.current = true;
      
      const loadDrafts = async () => {
        // إعادة تعيين الحالة
        setPropertiesManagement({
          isInitialized: false,
          loading: true,
          properties: [],
          pagination: null,
          error: null,
        });

        try {
          // إرسال الطلب مباشرة إلى /properties/drafts
          console.log("Making API request to /properties/drafts");
          const response = await axiosInstance.get("/properties/drafts?page=1");
          console.log("API response received:", response);

          // معالجة الاستجابة
          const drafts = Array.isArray(response.data?.data) 
            ? response.data.data 
            : response.data?.data?.drafts || [];
          const pagination = response.data?.pagination || response.data?.data?.pagination || null;

          const mappedDrafts = drafts.map((draft: any) => {
            let listingType = "للإيجار";
            if (
              draft.purpose === "sold" ||
              draft.purpose === "sale" ||
              String(draft.transaction_type) === "1" ||
              draft.transaction_type === "sale"
            ) {
              listingType = "للبيع";
            }

            return {
              ...draft,
              thumbnail: draft.featured_image,
              listingType,
              status: "مسودة",
              lastUpdated: new Date(draft.created_at).toLocaleDateString("ar-AE"),
              features: Array.isArray(draft.features) ? draft.features : [],
              missing_fields_ar: draft.missing_fields_ar || [],
              validation_errors: translateValidationErrors(draft.validation_errors || []),
            };
          });

          setPropertiesManagement({
            properties: mappedDrafts,
            pagination,
            loading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error("Error fetching drafts:", error);
          setPropertiesManagement({
            error: formatErrorMessage(error, "حدث خطأ أثناء جلب المسودات"),
            loading: false,
            isInitialized: true,
          });
          fetchCalledRef.current = false; // إعادة تعيين في حالة الخطأ
        }
      };

      loadDrafts();
    }
  }, [userData?.token, authLoading]);

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <SkeletonPropertyCard key={idx} />
      ))}
    </div>
  );

  const reorderList =
    reorderPopup.type === "featured"
      ? normalizedProperties.filter((p: any) => p.featured)
      : normalizedProperties;

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* العنوان وزر العودة وأزرار العرض في نفس الصف */}
            <div className="flex items-center justify-between gap-4">
              {/* زر العودة */}
              <Button
                variant="outline"
                className="gap-2 w-fit flex-shrink-0"
                onClick={() => router.push("/dashboard/properties")}
              >
                <ArrowRight className="h-4 w-4" />
                العودة للوحدات
              </Button>

              {/* العنوان في المنتصف */}
              <h1 className="text-2xl font-bold tracking-tight text-red-800 dark:text-red-600 text-center flex-1">
                الوحدات الغير مكتملة
              </h1>

              {/* أزرار العرض */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>

            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* إجمالي الوحدات الغير مكتملة */}
              <Card className="hover:shadow-lg transition-all duration-300 border border-red-100 bg-red-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm font-medium text-gray-700">
                          إجمالي الوحدات الغير مكتملة
                        </p>
                      </div>
                      {loadingStatistics ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span className="text-gray-400 text-sm">
                            جاري التحميل...
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-red-600">
                          {statistics?.incomplete_count || 0}
                        </p>
                      )}
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* إجمالي الوحدات غير المكتملة للبيع */}
              <Card className="hover:shadow-lg transition-all duration-300 border border-orange-100 bg-orange-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <p className="text-sm font-medium text-gray-700">
                          الوحدات غير المكتملة للبيع
                        </p>
                      </div>
                      {loadingStatistics ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span className="text-gray-400 text-sm">
                            جاري التحميل...
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-orange-600">
                          {statistics?.for_sale || 0}
                        </p>
                      )}
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* إجمالي الوحدات غير المكتملة للإيجار */}
              <Card className="hover:shadow-lg transition-all duration-300 border border-orange-100 bg-orange-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <p className="text-sm font-medium text-gray-700">
                          الوحدات غير المكتملة للإيجار
                        </p>
                      </div>
                      {loadingStatistics ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span className="text-gray-400 text-sm">
                            جاري التحميل...
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-orange-600">
                          {statistics?.for_rent || 0}
                        </p>
                      )}
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Key className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* إجمالي الوحدات */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        إجمالي الوحدات
                      </p>
                      {loadingStatistics ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span className="text-gray-400 text-sm">
                            جاري التحميل...
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-purple-600">
                          {statistics?.total || 0}
                        </p>
                      )}
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الفلاتر */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                  {/* المدينة */}
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Select
                      value={filterCityId || undefined}
                      onValueChange={(value) => {
                        setFilterCityId(value || null);
                        setFilterDistrictId(null);
                        setTimeout(() => applyFilters(), 0);
                      }}
                      disabled={loadingCities}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name_ar || city.name_en || city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* الحي */}
                  <div className="space-y-2">
                    <Label>الحي</Label>
                    <Select
                      value={filterDistrictId || undefined}
                      onValueChange={(value) => {
                        setFilterDistrictId(value || null);
                        setTimeout(() => applyFilters(), 0);
                      }}
                      disabled={loadingDistricts || !filterCityId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحي" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id.toString()}>
                            {district.name_ar || district.name_en || district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* نوع العقار */}
                  <div className="space-y-2">
                    <Label>نوع العقار</Label>
                    <Select
                      value={filterType || undefined}
                      onValueChange={(value) => {
                        setFilterType(value || null);
                        setTimeout(() => applyFilters(), 0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="شقة">شقة</SelectItem>
                        <SelectItem value="فيلا">فيلا</SelectItem>
                        <SelectItem value="منزل">منزل</SelectItem>
                        <SelectItem value="أرض">أرض</SelectItem>
                        <SelectItem value="محل">محل</SelectItem>
                        <SelectItem value="مكتب">مكتب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* إيجار أو بيع */}
                  <div className="space-y-2">
                    <Label>نوع المعاملة</Label>
                    <Select
                      value={filterPurpose || undefined}
                      onValueChange={(value) => {
                        setFilterPurpose(value || null);
                        setTimeout(() => applyFilters(), 0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">للبيع</SelectItem>
                        <SelectItem value="rent">للإيجار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* عدد الغرف */}
                  <div className="space-y-2">
                    <Label>عدد الغرف</Label>
                    <Select
                      value={filterBeds || undefined}
                      onValueChange={(value) => {
                        setFilterBeds(value || null);
                        setTimeout(() => applyFilters(), 0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر عدد الغرف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* السعر */}
                  <div className="space-y-2">
                    <Label>السعر</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="من"
                        value={filterPriceFrom}
                        onChange={(e) => {
                          setFilterPriceFrom(e.target.value);
                        }}
                        onBlur={() => applyFilters()}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="إلى"
                        value={filterPriceTo}
                        onChange={(e) => {
                          setFilterPriceTo(e.target.value);
                        }}
                        onBlur={() => applyFilters()}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* زر إعادة التعيين */}
                  <div className="space-y-2 max-w-[130px]">
                    <Label className="opacity-0 text-[1px]">ازالة الفلاتر</Label>
                    <Label className="opacity-0 text-[1px]">إعادة تعيين</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearFilters} 
                      className={`w-fit text-sm ${
                        filterCityId || filterDistrictId || filterType || filterPurpose || filterBeds || filterPriceFrom || filterPriceTo
                          ? "border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                          : ""
                      }`}
                    >
                      <FilterX className="h-3.5 w-3.5 mr-1.5" />
                      إعادة تعيين
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* عرض الفلاتر النشطة */}
            <ActiveFiltersDisplay
              filters={appliedFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {loading ? (
              renderSkeletons()
            ) : error ? (
              <ErrorDisplay
                error={error}
                onRetry={() => fetchDrafts(currentPage, appliedFilters)}
                title="خطأ في تحميل الوحدات"
              />
            ) : (
              <Tabs defaultValue="all">
                <TabsContent value="all" className="mt-4">
                  {normalizedProperties.length === 0 ? (
                    <EmptyState type="وحدات" />
                  ) : (
                    <>
                      {viewMode === "grid" ? (
                        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4  ">
                          {normalizedProperties.map((property: any, index: number) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              allProperties={normalizedProperties}
                              currentIndex={index}
                              isFavorite={favorites.includes(
                                property.id.toString(),
                              )}
                              onToggleFavorite={toggleFavorite}
                              onDelete={handleDeleteProperty}
                              onDuplicate={handleDuplicateProperty}
                              onToggleStatus={handleToggleStatus}
                              setReorderPopup={setReorderPopup}
                              onCompleteDraft={handleCompleteDraft}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {normalizedProperties.map((property: any) => (
                            <PropertyListItem
                              key={property.id}
                              property={property}
                              isFavorite={favorites.includes(
                                property.id.toString(),
                              )}
                              onToggleFavorite={toggleFavorite}
                              onDelete={handleDeleteProperty}
                              onDuplicate={handleDuplicateProperty}
                              onToggleStatus={handleToggleStatus}
                              setReorderPopup={setReorderPopup}
                              onCompleteDraft={handleCompleteDraft}
                            />
                          ))}
                        </div>
                      )}

                      {pagination && pagination.last_page > 1 && (
                        <Pagination
                          currentPage={pagination.current_page}
                          totalPages={pagination.last_page}
                          onPageChange={handlePageChange}
                          totalItems={pagination.total}
                          itemsPerPage={pagination.per_page}
                          from={pagination.from}
                          to={pagination.to}
                        />
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>

          {reorderPopup.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() =>
                  setReorderPopup({ ...reorderPopup, open: false })
                }
              />
              <div className="relative z-10 bg-white dark:bg-background rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="font-bold mb-4 text-lg text-center">
                  {reorderPopup.type === "featured"
                    ? "ترتيب الوحدات المميزة"
                    : "ترتيب الوحدات"}
                </h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {reorderList.map((property: any, idx: number) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span>
                        {property.title || property.contents?.[0]?.title}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex justify-evenly"
                          >
                            <div className="w-2">
                              {property.reorder_featured ||
                                property.reorder ||
                                idx + 1}
                            </div>
                            <ChevronDown className="-ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[15rem] overflow-y-auto">
                          {(() => {
                            let itemCount =
                              reorderPopup.type === "featured"
                                ? reorderList.length
                                : pagination?.total || reorderList.length;
                            return [...Array(itemCount)].map((_, i) => (
                              <DropdownMenuItem
                                key={i}
                                onClick={async () => {
                                  setReorderPopup({
                                    open: false,
                                    type: reorderPopup.type,
                                  });
                                  const toastId = toast.loading(
                                    "جاري تحديث الترتيب...",
                                  );
                                  try {
                                    if (reorderPopup.type === "featured") {
                                      await axiosInstance.post(
                                        "/properties/reorder-featured",
                                        [
                                          {
                                            id: property.id,
                                            reorder_featured: i + 1,
                                          },
                                        ],
                                      );
                                    } else {
                                      await axiosInstance.post(
                                        "/properties/reorder",
                                        [{ id: property.id, reorder: i + 1 }],
                                      );
                                    }
                                    toast.success("تم تحديث الترتيب");
                                    fetchDrafts(currentPage, appliedFilters);
                                  } catch (e) {
                                    toast.error("حدث خطأ أثناء الترتيب");
                                  } finally {
                                    toast.dismiss(toastId);
                                  }
                                }}
                              >
                                {i + 1}
                              </DropdownMenuItem>
                            ));
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
