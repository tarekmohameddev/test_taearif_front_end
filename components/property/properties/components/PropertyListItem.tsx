"use client";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bath,
  Bed,
  Building,
  Calendar as CalendarIcon,
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
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import useAuthStore from "@/context/AuthContext";
import { getPaymentMethodText, formatAddress } from "../utils/helpers";
import type { PropertyCardProps } from "../types/properties.types";

export function PropertyListItem({
  property,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onShare,
  setReorderPopup,
  showIncompleteOnly = false,
  onCompleteDraft,
}: PropertyCardProps & { showIncompleteOnly?: boolean; onCompleteDraft?: (id: string) => void }) {
  const router = useRouter();
  
  const formattedAddress = formatAddress(property);
  
  const handleCardClick = () => {
    router.push(`/dashboard/properties/${property.id}`);
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
              alt={property.title || property.contents[0].title}
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
                {property.title || property.contents?.[0]?.title || "Untitled"}
              </h3>
              <p className="text-sm text-muted-foreground flex  items-center gap-1">
                <MapPin className="h-3 w-3" />{" "}
                {formattedAddress || "لا يوجد عنوان"}
              </p>
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
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {property.featured && (
              <Badge variant="outline" className="bg-primary text-primary-foreground border-primary">
                مميز
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`${
                property.status === "منشور"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-amber-500 text-white border-amber-500"
              }`}
            >
              {property.status}
            </Badge>
            {property.status === "منشور" && property.creator && (
              <Badge variant="outline" className="bg-blue-500 text-white border-blue-500">
                {property.creator.name}
              </Badge>
            )}
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
            {property.beds && (
              <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                <Bed className="h-3 w-3" />
                <span>{property.beds} غرفة</span>
              </Badge>
            )}
            {property.bath && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                <Bath className="h-3 w-3" />
                <span>{property.bath} حمام</span>
              </Badge>
            )}
            {property.type && (
              <Badge variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200">
                <Building className="h-3 w-3" />
                <span>
                  {property.type === "residential" ? "سكني" : 
                   property.type === "commercial" ? "تجاري" : 
                   property.type === "industrial" ? "صناعي" : 
                   property.type === "land" ? "أرض" : property.type}
                </span>
              </Badge>
            )}
            {property.show_reservations && (
              <Badge variant="outline" className="flex items-center gap-1 bg-pink-50 text-pink-700 border-pink-200">
                <CalendarIcon className="h-3 w-3" />
                <span>قابل للحجز</span>
              </Badge>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {property.features &&
              property.features.map((feature: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {feature}
                </span>
              ))}
          </div>
          {(property.created_at || property.updated_at) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {property.created_at && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    تاريخ الإنشاء: {format(new Date(property.created_at), "yyyy-MM-dd HH:mm", { locale: ar })}
                  </span>
                </div>
              )}
              {property.updated_at && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    آخر تعديل: {format(new Date(property.updated_at), "yyyy-MM-dd HH:mm", { locale: ar })}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="mt-auto pt-4 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push("/dashboard/properties/" + property.id + "/edit")
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
                  <ExternalLink className="mr-2 h-4 w-4" />
                  معاينة
                </DropdownMenuItem>
                {/* ترتيب الوحدة في الرئيسية */}
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
                {/* ترتيب الوحدة */}
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
                {property.status === "مسودة" ? (
                  <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    نشر
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                    <Edit className="mr-2 h-4 w-4" />
                    إلغاء النشر
                  </DropdownMenuItem>
                )}
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
