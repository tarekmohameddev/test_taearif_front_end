"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getPropertyRequestsFilters } from "@/lib/api/property-requests-dashboard-api";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { Loader2, X, MapPin, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  Agricultural: "زراعي",
  apartment: "شقة",
  commercial: "تجاري",
  Industrial: "صناعي",
  Residential: "سكني",
};

interface PropertyRequestFormData {
  property_type: string;
  category: string;
  neighborhoods: string[];
  area_from: number | null;
  area_to: number | null;
  purchase_method: string;
  budget_from: number;
  budget_to: number;
  seriousness: string;
  purchase_goal: string;
  wants_similar_offers: boolean;
  full_name: string;
  phone: string;
  contact_on_whatsapp: boolean;
}

interface FiltersData {
  cities: Array<{ id: number; name_ar: string; name_en: string }>;
  districts: Array<{
    id: number;
    city_id: number;
    name_ar: string;
    name_en: string;
  }>;
  categories: Array<{ id: number; name: string; slug: string; icon: string | null }>;
  property_types: string[];
  purchase_goals: string[];
  seriousness_options: string[];
}

export type PropertyModeType = null | "existing" | "new_specs";

interface PropertyOption {
  id: number;
  title: string;
  address?: string;
  price?: number;
  imageUrl?: string;
  image?: string;
  thumbnailUrl?: string;
  main_image_url?: string;
  featured_image?: string;
}

interface PropertyRequestFormProps {
  formData: PropertyRequestFormData;
  onChange: (field: keyof PropertyRequestFormData, value: any) => void;
  errors?: Record<string, string | string[]>;
  /** When provided, shows property mode badges and conditional content (add-request page). */
  propertyMode?: PropertyModeType;
  onPropertyModeChange?: (mode: PropertyModeType) => void;
  selectedPropertyIds?: number[];
  onSelectedPropertyIdsChange?: (ids: number[]) => void;
}

export const PropertyRequestForm = ({
  formData,
  onChange,
  errors = {},
  propertyMode,
  onPropertyModeChange,
  selectedPropertyIds = [],
  onSelectedPropertyIdsChange,
}: PropertyRequestFormProps) => {
  const userData = useAuthStore(selectUserData);
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState<
    FiltersData["districts"]
  >([]);
  const [availableProperties, setAvailableProperties] = useState<PropertyOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const showModeBadges =
    propertyMode !== undefined &&
    onPropertyModeChange !== undefined;

  // Fetch filters data
  useEffect(() => {
    const fetchFilters = async () => {
      if (!userData?.token) {
        return;
      }

      setLoadingFilters(true);
      try {
        const data = await getPropertyRequestsFilters();
        setFiltersData(data);
      } catch (err) {
        console.error("Error fetching filters:", err);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [userData?.token]);

  const fetchAvailableProperties = async () => {
    setLoadingProperties(true);
    try {
      const response = await axiosInstance.get("/properties");
      if (response.data.status === "success") {
        setAvailableProperties(response.data.data.properties || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      toast.error("فشل في تحميل العقارات");
    } finally {
      setLoadingProperties(false);
    }
  };

  const getPropertyImageUrl = (prop: PropertyOption): string | undefined => {
    const p = prop as Record<string, unknown>;
    const url =
      p?.imageUrl ??
      p?.featured_image ??
      p?.main_image_url ??
      p?.thumbnailUrl ??
      p?.thumbnail ??
      p?.image;
    return typeof url === "string" ? url : undefined;
  };

  useEffect(() => {
    if (propertyMode === "existing") {
      fetchAvailableProperties();
    }
  }, [propertyMode]);

  const getError = (field: string): string | undefined => {
    const error = errors[field];
    if (Array.isArray(error)) {
      return error[0];
    }
    return error;
  };

  if (loadingFilters || !filtersData) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>جاري تحميل بيانات الطلب العقاري...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات الاتصال</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">
              الاسم الكامل <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => onChange("full_name", e.target.value)}
              className={getError("full_name") ? "border-red-500" : ""}
            />
            {getError("full_name") && (
              <p className="text-sm text-red-500">{getError("full_name")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              رقم الهاتف <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={getError("phone") ? "border-red-500" : ""}
            />
            {getError("phone") && (
              <p className="text-sm text-red-500">{getError("phone")}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="contact_on_whatsapp"
              checked={formData.contact_on_whatsapp}
              onCheckedChange={(checked) =>
                onChange("contact_on_whatsapp", checked)
              }
            />
            <Label
              htmlFor="contact_on_whatsapp"
              className="text-sm font-normal cursor-pointer"
            >
              متاح للاتصال عبر واتساب
            </Label>
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات العقار</h3>

        {showModeBadges && (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={propertyMode === "existing" ? "default" : "outline"}
              className="cursor-pointer text-sm py-1.5 px-3"
              onClick={() => onPropertyModeChange!("existing")}
            >
              عقار موجود بالفعل
            </Badge>
            <Badge
              variant={propertyMode === "new_specs" ? "default" : "outline"}
              className="cursor-pointer text-sm py-1.5 px-3"
              onClick={() => onPropertyModeChange!("new_specs")}
            >
              مواصفات عقار جديد (لن ينشئ عقار جديد بل هى بيانات تسجل فقط)
            </Badge>
          </div>
        )}

        {showModeBadges && propertyMode === null && (
          <p className="text-sm text-muted-foreground">
            اختر أحد الخيارين أعلاه.
          </p>
        )}

        {showModeBadges && propertyMode === "new_specs" && filtersData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_type">نوع العقار</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) => onChange("property_type", value)}
              >
                <SelectTrigger
                  className={getError("property_type") ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="اختر نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  {filtersData.property_types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {PROPERTY_TYPE_LABELS[type] || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("property_type") && (
                <p className="text-sm text-red-500">
                  {getError("property_type")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase_method">طريقة الشراء</Label>
              <Select
                value={formData.purchase_method}
                onValueChange={(value) => onChange("purchase_method", value)}
              >
                <SelectTrigger
                  className={
                    getError("purchase_method") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="اختر طريقة الشراء" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقدي">نقدي</SelectItem>
                  <SelectItem value="تمويل">تمويل</SelectItem>
                  <SelectItem value="نقدي وتمويل">نقدي وتمويل</SelectItem>
                </SelectContent>
              </Select>
              {getError("purchase_method") && (
                <p className="text-sm text-red-500">
                  {getError("purchase_method")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_from">الميزانية من</Label>
              <Input
                id="budget_from"
                type="number"
                value={formData.budget_from || ""}
                onChange={(e) =>
                  onChange("budget_from", parseFloat(e.target.value) || 0)
                }
                className={getError("budget_from") ? "border-red-500" : ""}
              />
              {getError("budget_from") && (
                <p className="text-sm text-red-500">{getError("budget_from")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_to">الميزانية إلى</Label>
              <Input
                id="budget_to"
                type="number"
                value={formData.budget_to || ""}
                onChange={(e) =>
                  onChange("budget_to", parseFloat(e.target.value) || 0)
                }
                className={getError("budget_to") ? "border-red-500" : ""}
              />
              {getError("budget_to") && (
                <p className="text-sm text-red-500">{getError("budget_to")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_from">المساحة من (م²)</Label>
              <Input
                id="area_from"
                type="number"
                value={formData.area_from || ""}
                onChange={(e) =>
                  onChange(
                    "area_from",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_to">المساحة إلى (م²)</Label>
              <Input
                id="area_to"
                type="number"
                value={formData.area_to || ""}
                onChange={(e) =>
                  onChange(
                    "area_to",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
          </div>
        )}

        {showModeBadges && propertyMode === "existing" && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <Label className="text-sm font-medium">اختر العقار</Label>
            {loadingProperties ? (
              <div className="flex items-center gap-2 py-4 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">جاري تحميل العقارات...</span>
              </div>
            ) : availableProperties.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                لا توجد عقارات متاحة
              </p>
            ) : (
              <>
                <CustomDropdown
                  trigger={
                    <span className="text-sm">
                      {selectedPropertyIds.length > 0
                        ? `تم اختيار ${selectedPropertyIds.length} عقار`
                        : "اختر العقار"}
                    </span>
                  }
                  triggerClassName="w-full justify-between"
                  dropdownWidth="w-[20rem]"
                  maxHeight="280px"
                >
                  {availableProperties.map((property) => {
                    const isSelected = selectedPropertyIds.includes(property.id);
                    return (
                      <DropdownItem
                        key={property.id}
                        onClick={() => {
                          if (!onSelectedPropertyIdsChange) return;
                          if (isSelected) {
                            onSelectedPropertyIdsChange(
                              selectedPropertyIds.filter((id) => id !== property.id)
                            );
                          } else {
                            onSelectedPropertyIdsChange([
                              ...selectedPropertyIds,
                              property.id,
                            ]);
                          }
                        }}
                        className={isSelected ? "bg-muted font-medium" : ""}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{property.title}</span>
                          {property.address && (
                            <span className="text-xs text-muted-foreground">
                              {property.address}
                            </span>
                          )}
                          {property.price != null && (
                            <span className="text-xs text-green-600">
                              {property.price.toLocaleString("ar-SA")} ريال
                            </span>
                          )}
                        </div>
                      </DropdownItem>
                    );
                  })}
                </CustomDropdown>
                {selectedPropertyIds.length > 0 && (
                  <div className="flex flex-col gap-3 mt-3">
                    {selectedPropertyIds.map((id) => {
                      const prop = availableProperties.find((p) => p.id === id);
                      const title = prop?.title ?? `عقار #${id}`;
                      const imageUrl = prop ? getPropertyImageUrl(prop) : undefined;
                      return (
                        <Card
                          key={id}
                          className="overflow-hidden hover:shadow-md transition-shadow w-full"
                        >
                          <CardContent className="p-3">
                            <div className="flex flex-row items-stretch gap-3">
                              {imageUrl ? (
                                <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                                  <img
                                    src={imageUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-32 h-24 rounded-lg bg-muted shrink-0 flex items-center justify-center text-muted-foreground text-xs">
                                  لا صورة
                                </div>
                              )}
                              <div className="flex-1 min-w-0 flex flex-col justify-between text-right">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">
                                      {title}
                                    </h4>
                                    {prop?.address && (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">
                                          {prop.address}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="h-8 w-8 shrink-0 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      onSelectedPropertyIdsChange?.(
                                        selectedPropertyIds.filter((x) => x !== id)
                                      );
                                    }}
                                    aria-label="إزالة العقار"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                {prop?.price != null && (
                                  <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    {(prop.price / 1000).toFixed(0)}k ريال
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!showModeBadges && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtersData && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="property_type">نوع العقار</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => onChange("property_type", value)}
                  >
                    <SelectTrigger
                      className={getError("property_type") ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="اختر نوع العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      {filtersData.property_types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {PROPERTY_TYPE_LABELS[type] || type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError("property_type") && (
                    <p className="text-sm text-red-500">
                      {getError("property_type")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_method">طريقة الشراء</Label>
                  <Select
                    value={formData.purchase_method}
                    onValueChange={(value) => onChange("purchase_method", value)}
                  >
                    <SelectTrigger
                      className={
                        getError("purchase_method") ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="اختر طريقة الشراء" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                      <SelectItem value="تمويل">تمويل</SelectItem>
                      <SelectItem value="نقدي وتمويل">نقدي وتمويل</SelectItem>
                    </SelectContent>
                  </Select>
                  {getError("purchase_method") && (
                    <p className="text-sm text-red-500">
                      {getError("purchase_method")}
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="budget_from">الميزانية من</Label>
              <Input
                id="budget_from"
                type="number"
                value={formData.budget_from || ""}
                onChange={(e) =>
                  onChange("budget_from", parseFloat(e.target.value) || 0)
                }
                className={getError("budget_from") ? "border-red-500" : ""}
              />
              {getError("budget_from") && (
                <p className="text-sm text-red-500">{getError("budget_from")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_to">الميزانية إلى</Label>
              <Input
                id="budget_to"
                type="number"
                value={formData.budget_to || ""}
                onChange={(e) =>
                  onChange("budget_to", parseFloat(e.target.value) || 0)
                }
                className={getError("budget_to") ? "border-red-500" : ""}
              />
              {getError("budget_to") && (
                <p className="text-sm text-red-500">{getError("budget_to")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_from">المساحة من (م²)</Label>
              <Input
                id="area_from"
                type="number"
                value={formData.area_from || ""}
                onChange={(e) =>
                  onChange(
                    "area_from",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_to">المساحة إلى (م²)</Label>
              <Input
                id="area_to"
                type="number"
                value={formData.area_to || ""}
                onChange={(e) =>
                  onChange(
                    "area_to",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional Details */}
      {filtersData && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">تفاصيل إضافية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seriousness">الجدية</Label>
              <Select
                value={formData.seriousness}
                onValueChange={(value) => onChange("seriousness", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجدية" />
                </SelectTrigger>
                <SelectContent>
                  {filtersData.seriousness_options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_goal">هدف الشراء</Label>
              <Select
                value={formData.purchase_goal}
                onValueChange={(value) => onChange("purchase_goal", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر هدف الشراء" />
                </SelectTrigger>
                <SelectContent>
                  {filtersData.purchase_goals.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="wants_similar_offers"
                checked={formData.wants_similar_offers}
                onCheckedChange={(checked) =>
                  onChange("wants_similar_offers", checked)
                }
              />
              <Label
                htmlFor="wants_similar_offers"
                className="text-sm font-normal cursor-pointer"
              >
                يريد عروض مشابهة
              </Label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

