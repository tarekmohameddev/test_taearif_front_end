"use client";
import { useState } from "react";
import {
  Building as BuildingIcon,
  Building2,
  MapPin,
  Home,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Ruler,
  Bath,
  Bed,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  BarChart3,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";

import { Building } from "./types";

interface BuildingCardProps {
  building: Building;
  viewMode: "grid" | "list";
  onSelect?: (buildingId: number) => void;
  isSelected?: boolean;
}

export default function BuildingCard({
  building,
  viewMode,
  onSelect,
  isSelected = false,
}: BuildingCardProps) {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBuilding = async () => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    // تأكيد قبل الحذف
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف العمارة "${building.name}"؟\nهذا الإجراء لا يمكن التراجع عنه.`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(`/buildings/${building.id}`);

      if (response.data.status === "success") {
        toast.success("تم حذف العمارة بنجاح");
        // إعادة تحميل الصفحة أو تحديث القائمة
        window.location.reload();
      } else {
        toast.error("فشل في حذف العمارة");
      }
    } catch (error) {
      console.error("Error deleting building:", error);
      toast.error("حدث خطأ أثناء حذف العمارة");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ar-US", {
      style: "currency",
      currency: "SAR",
    }).format(parseFloat(price));
  };

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "rented":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sold":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPropertyStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "متاح";
      case "rented":
        return "مؤجر";
      case "sold":
        return "مباع";
      default:
        return status;
    }
  };

  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case "residential":
        return "سكني";
      case "commercial":
        return "تجاري";
      case "industrial":
        return "صناعي";
      default:
        return type;
    }
  };

  const getPropertyPurposeText = (purpose: string) => {
    if (!purpose) return "غير محدد";

    switch (purpose.toLowerCase()) {
      case "rent":
        return "إيجار";
      case "sale":
        return "بيع";
      case "rented":
        return "مؤجر";
      case "sold":
        return "مباع";
      default:
        return purpose;
    }
  };

  const displayedProperties = showAllProperties
    ? building.properties
    : building.properties.slice(0, 3);

  const availableProperties = building.properties.filter(
    (p) => p.property_status === "available",
  ).length;
  const rentedProperties = building.properties.filter(
    (p) => p.property_status === "rented",
  ).length;

  if (viewMode === "list") {
    return (
      <Card
        className={`border border-gray-200 hover:shadow-lg transition-all duration-200 ${
          isSelected ? "ring-2 ring-black ring-opacity-50" : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {building.image_url ? (
                    <img
                      src={building.image_url}
                      alt={building.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-black truncate">
                      {building.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {building.properties.length} عقار •
                      {building.deed_number
                        ? ` صك رقم ${building.deed_number}`
                        : " بدون صك"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-black">
                        {building.properties.length}
                      </div>
                      <div className="text-xs text-gray-500">عقار</div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {availableProperties}
                      </div>
                      <div className="text-xs text-gray-500">متاح</div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {rentedProperties}
                      </div>
                      <div className="text-xs text-gray-500">مؤجر</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/buildings/${building.id}`)
                }
                className="border-gray-300 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                عرض
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/buildings/${building.id}/edit`)
                }
                className="border-gray-300 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleDeleteBuilding}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "جاري الحذف..." : "حذف"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border border-gray-200 hover:shadow-lg transition-all duration-200 ${
        isSelected ? "ring-2 ring-black ring-opacity-50" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-black mb-1">
              {building.name}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {building.properties.length} عقار
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDeleteBuilding}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "جاري الحذف..." : "حذف"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Building Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-black">
              {building.properties.length}
            </div>
            <div className="text-xs text-gray-500">إجمالي العقارات</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {availableProperties}
            </div>
            <div className="text-xs text-gray-500">متاح</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {rentedProperties}
            </div>
            <div className="text-xs text-gray-500">مؤجر</div>
          </div>
        </div>

        {/* Building Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>رقم الصك: {building.deed_number || "غير محدد"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BuildingIcon className="w-4 h-4 mr-2" />
            <span>
              عداد المياه: {building.water_meter_number || "غير محدد"}
            </span>
          </div>
        </div>

        {/* Properties Preview */}
        {building.properties.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-black text-sm">العقارات:</h4>
              {building.properties.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllProperties(!showAllProperties)}
                  className="text-xs text-gray-600 hover:text-black"
                >
                  {showAllProperties ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      إخفاء
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      عرض الكل
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {displayedProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    {/* Property Name and Address */}
                    <div className="mb-2">
                      <h5 className="text-sm font-semibold text-black mb-1">
                        {property.title || `عقار ${property.id}`}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {property.address ||
                          building.name ||
                          "العنوان غير محدد"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-black">
                        {formatPrice(property.price)}
                      </span>
                      <Badge
                        className={`text-xs ${getPropertyStatusColor(property.property_status)}`}
                      >
                        {getPropertyStatusText(property.property_status)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                      <span className="flex items-center">
                        <Bed className="w-3 h-3 mr-1" />
                        {property.beds}
                      </span>
                      <span className="flex items-center">
                        <Bath className="w-3 h-3 mr-1" />
                        {property.bath}
                      </span>
                      <span className="flex items-center">
                        <Ruler className="w-3 h-3 mr-1" />
                        {property.area} م²
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {getPropertyTypeText(property.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getPropertyPurposeText(property.purpose)}
                      </Badge>
                    </div>

                    {/* Features */}
                    {property.features && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">
                          الميزات:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            let featuresArray = [];

                            if (Array.isArray(property.features)) {
                              featuresArray = property.features;
                            } else if (typeof property.features === "string") {
                              try {
                                // محاولة تحليل JSON
                                const parsed = JSON.parse(property.features);
                                if (Array.isArray(parsed)) {
                                  featuresArray = parsed;
                                } else {
                                  featuresArray = [property.features];
                                }
                              } catch {
                                // إذا فشل التحليل، تعامل معه كـ string عادي
                                featuresArray = property.features
                                  .split(",")
                                  .map((f) => f.trim())
                                  .filter((f) => f);
                              }
                            }

                            return featuresArray
                              .slice(0, 3)
                              .map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ));
                          })()}
                          {(() => {
                            let featuresArray = [];

                            if (Array.isArray(property.features)) {
                              featuresArray = property.features;
                            } else if (typeof property.features === "string") {
                              try {
                                const parsed = JSON.parse(property.features);
                                if (Array.isArray(parsed)) {
                                  featuresArray = parsed;
                                } else {
                                  featuresArray = [property.features];
                                }
                              } catch {
                                featuresArray = property.features
                                  .split(",")
                                  .map((f) => f.trim())
                                  .filter((f) => f);
                              }
                            }

                            return (
                              featuresArray.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{featuresArray.length - 3} أخرى
                                </Badge>
                              )
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const subdomain = building.user?.username;
                      
                      if (!subdomain) {
                        toast.error("لا يمكن فتح رابط العقار: اسم المستخدم غير متوفر");
                        return;
                      }
                      
                      const propertySlug = property.slug || property.id;

                      // تحديد الدومين حسب البيئة
                      const isDevelopment =
                        process.env.NODE_ENV === "development";
                      const localDomain =
                        process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
                      const productionDomain =
                        process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ||
                        "taearif.com";

                      const domain = isDevelopment
                        ? `${localDomain}:3000`
                        : productionDomain;

                      const protocol = isDevelopment ? "http" : "https";
                      const url = `${protocol}://${subdomain}.${domain}/property/${propertySlug}`;

                      window.open(url, "_blank");
                    }}
                    className="text-gray-400 hover:text-black"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner Info */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={building.user?.photo || ""} />
                <AvatarFallback className="text-xs">
                  {building.user?.first_name?.charAt(0)?.toUpperCase() || 
                   building.user?.username?.charAt(0)?.toUpperCase() || 
                   "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {building.user?.first_name || ""} {building.user?.last_name || ""}
                {!building.user?.first_name && !building.user?.last_name && building.user?.username && (
                  <span>{building.user.username}</span>
                )}
                {!building.user?.first_name && !building.user?.last_name && !building.user?.username && (
                  <span className="text-gray-400">غير محدد</span>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(building.created_at).toLocaleDateString("ar-US")}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 hover:bg-gray-50"
            onClick={() =>
              router.push(`/dashboard/buildings/${building.id}/edit`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            تعديل
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
