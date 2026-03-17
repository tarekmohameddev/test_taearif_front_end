"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { getPropertyRequestsFilters } from "@/lib/api/property-requests-dashboard-api";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import {
  Loader2,
  X,
  MapPin,
  DollarSign,
  ChevronDown,
  Home,
  Info,
  Phone,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS_AR,
} from "@/lib/properties/propertyType";

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
  notes: string;
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
  selectedPropertyIds?: number[];
  onSelectedPropertyIdsChange?: (ids: number[]) => void;
}

export const PropertyRequestForm = ({
  formData,
  onChange,
  errors = {},
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
  const [openSections, setOpenSections] = useState({
    propertyInfo: false,
    budget: false,
    extra: false,
    contact: false,
    addProperty: false,
  });

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
    const p = prop as unknown as Record<string, unknown>;
    const url =
      p.imageUrl ??
      p.featured_image ??
      p.main_image_url ??
      p.thumbnailUrl ??
      p.thumbnail ??
      p.image;
    return typeof url === "string" ? url : undefined;
  };

  // إذا كان هناك handler لاختيار العقارات، قم بجلب قائمة العقارات مرة واحدة
  useEffect(() => {
    if (!onSelectedPropertyIdsChange) return;
    fetchAvailableProperties();
  }, [onSelectedPropertyIdsChange]);

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
      {/* 1- معلومات العقار المطلوب */}
      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer"
          onClick={() =>
            setOpenSections((prev) => ({ ...prev, propertyInfo: !prev.propertyInfo }))
          }
        >
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>معلومات العقار المطلوب</span>
          </CardTitle>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.propertyInfo ? "rotate-180" : ""
            }`}
          />
        </CardHeader>
        {openSections.propertyInfo && (
          <CardContent>
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
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {PROPERTY_TYPE_LABELS_AR[type.value]}
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
            </div>
          </CardContent>
        )}
      </Card>

      {/* 2- معلومات الميزانية والدفع */}
      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer"
          onClick={() =>
            setOpenSections((prev) => ({ ...prev, budget: !prev.budget }))
          }
        >
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>معلومات الميزانية والدفع</span>
          </CardTitle>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.budget ? "rotate-180" : ""
            }`}
          />
        </CardHeader>
        {openSections.budget && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectValue placeholder="طريقة الشراء*" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="كاش">كاش</SelectItem>
                    <SelectItem value="تمويل بنكي">تمويل بنكي</SelectItem>
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
                  <p className="text-sm text-red-500">
                    {getError("budget_from")}
                  </p>
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
                  <p className="text-sm text-red-500">
                    {getError("budget_to")}
                  </p>
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
          </CardContent>
        )}
      </Card>

      {/* 3- تفاصيل إضافية */}
      {filtersData && (
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() =>
              setOpenSections((prev) => ({ ...prev, extra: !prev.extra }))
            }
          >
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>تفاصيل إضافية</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openSections.extra ? "rotate-180" : ""
              }`}
            />
          </CardHeader>
          {openSections.extra && (
            <CardContent>
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                    placeholder="اكتب أي تفاصيل إضافية عن الطلب أو العميل"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 4- بيانات التواصل */}
      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer"
          onClick={() =>
            setOpenSections((prev) => ({ ...prev, contact: !prev.contact }))
          }
        >
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>بيانات التواصل</span>
          </CardTitle>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.contact ? "rotate-180" : ""
            }`}
          />
        </CardHeader>
        {openSections.contact && (
          <CardContent>
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

              <div className="flex items-center space-x-2 space-x-reverse md:col-span-2">
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
          </CardContent>
        )}
      </Card>

      {/* 5- إضافة عقار على الطلب العقاري */}
      {onSelectedPropertyIdsChange && (
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() =>
              setOpenSections((prev) => ({ ...prev, addProperty: !prev.addProperty }))
            }
          >
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>إضافة عقار على الطلب العقاري</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openSections.addProperty ? "rotate-180" : ""
              }`}
            />
          </CardHeader>
          {openSections.addProperty && (
            <CardContent>
              <div className="space-y-3">
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
                                  selectedPropertyIds.filter(
                                    (id) => id !== property.id,
                                  ),
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
                          const imageUrl = prop
                            ? getPropertyImageUrl(prop)
                            : undefined;
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
                                            selectedPropertyIds.filter(
                                              (x) => x !== id,
                                            ),
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
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

