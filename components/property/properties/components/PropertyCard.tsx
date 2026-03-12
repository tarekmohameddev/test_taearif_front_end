"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Copy,
  Edit,
  ExternalLink,
  Grid3X3,
  List,
  MapPin,
  MoreHorizontal,
  Ruler,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { getPaymentMethodText, truncateTitle, formatAddress } from "../utils/helpers";
import type { PropertyCardProps } from "../types/properties.types";

export function PropertyCard({
  property,
  allProperties = [],
  currentIndex = 0,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onShare,
  setReorderPopup,
  showIncompleteOnly = false,
  onCompleteDraft,
}: PropertyCardProps & { setReorderPopup: any; showIncompleteOnly?: boolean; onCompleteDraft?: (id: string) => void }) {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const [columnsCount, setColumnsCount] = useState(4);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // تحديث عدد الأعمدة بناءً على حجم الشاشة
  useEffect(() => {
    const updateColumnsCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setColumnsCount(4); // lg:grid-cols-4
      } else if (width >= 640) {
        setColumnsCount(3); // sm:grid-cols-3
      } else {
        setColumnsCount(1); // default
      }
      setIsSmallScreen(width < 2500);
    };
    
    updateColumnsCount();
    window.addEventListener('resize', updateColumnsCount);
    return () => window.removeEventListener('resize', updateColumnsCount);
  }, []);
  
  // التحقق من وجود سعر بمواصفات (سنوي، شهري، إلخ) في أي card في نفس الـ row
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

  // التحقق من وجود مميزات في أي card في نفس الـ row
  const hasFeaturesInSameRow = () => {
    if (!allProperties || allProperties.length === 0) return false;
    
    const currentRow = Math.floor(currentIndex / columnsCount);
    const rowStart = currentRow * columnsCount;
    const rowEnd = rowStart + columnsCount;
    
    // التحقق من وجود مميزات في أي card في نفس الـ row
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
    router.push(`/dashboard/properties/${property.id}`);
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
            alt={property.title || property.contents[0].title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {property.featured && (
          <div className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            مميز
          </div>
        )}
        <div
          className={`absolute left-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
            property.status === "منشور"
              ? "bg-green-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {property.status}
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle
              className={`line-clamp-2 max-w-[300px] font-semibold ${(property.title || property.contents?.[0]?.title || "Untitled").length > 20 ? "text-sm " : ""}`}
            >
              {truncateTitle(property.title || property.contents?.[0]?.title || "Untitled")}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formattedAddress || "لا يوجد عنوان"}
            </CardDescription>
            {showIncompleteOnly && (
              <div className="mt-2 space-y-1">
                {property.missing_fields && property.missing_fields.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {property.missing_fields.slice(0, 3).map((field: string, index: number) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {property.missing_fields.length > 3 && (
                      <Badge variant="destructive" className="text-xs">
                        +{property.missing_fields.length - 3} أكثر
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
            )}
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
              {/* ترتيب الوحدة في الرئيسية */}
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
              {/* ترتيب الوحدة */}
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
                  router.push("/dashboard/properties/" + property.id + "/edit")
                }
              >
                <Edit className="ml-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
              {showIncompleteOnly && onCompleteDraft && (
                <DropdownMenuItem
                  onClick={() => onCompleteDraft(property.id.toString())}
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  إكمال المسودة
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  let domain = useAuthStore.getState().userData?.domain || "";
                  if (process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN === "mandhoor.com") {
                    domain = domain.replace("taearif", "mandhoor");
                  }
                  if (process.env.NODE_ENV === "development") {
                    domain = domain.replace("taearif.com", "localhost:3000");
                    domain = domain.replace("https://", "http://");
                  }
                  const url = domain.startsWith("http")
                    ? `${domain}property/${property.slug}`
                    : process.env.NODE_ENV === "development"
                    ? `http://${domain}/property/${property.slug}`
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
              {property.status === "مسودة" ? (
                <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                  <ExternalLink className="ml-2 h-4 w-4" />
                  نشر
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                  <Edit className="ml-2 h-4 w-4" />
                  إلغاء النشر
                </DropdownMenuItem>
              )}
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
        <div
          className={`grid gap-2 text-sm ${property.status === "منشور" && property.creator ? "grid-cols-3" : "grid-cols-2"}`}
        >
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
          {property.status === "منشور" && property.creator && (
            <div className="flex flex-col items-end justify-center">
              <div className="rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white mt-1">
                {property.creator.name === "User"
                  ? userData?.first_name && userData?.last_name
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData?.username || userData?.first_name || "User"
                  : property.creator.name}
              </div>
            </div>
          )}
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
            router.push("/dashboard/properties/" + property.id + "/edit")
          }
        >
          <Edit className="h-3.5 w-3.5" />
          تعديل
        </Button>
      </CardFooter>
    </Card>
  );
}
