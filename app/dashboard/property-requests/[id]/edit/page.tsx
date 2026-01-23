"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Save, X, Home, MapPin, DollarSign } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { PropertyRequestForm } from "@/components/property-requests/page-components/PropertyRequestForm";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PropertyRequest {
  id: number;
  user_id: number;
  region: string;
  property_type: string;
  category_id: number;
  city_id: number;
  districts_id: number | null;
  category: string | null;
  neighborhoods: string[] | null;
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
  is_read: number;
  is_active?: number;
  status?: string | null;
  employee?: any | null;
  property_id?: number | null;
  property?: any | null;
  created_at: string;
  updated_at: string;
}

interface Property {
  id: number;
  title?: string;
  address?: string;
  price?: number | string;
  pricePerMeter?: number | string;
  area?: number | string;
  size?: number | string;
  type?: string;
  purpose?: string;
  description?: string;
  beds?: number;
  bath?: number;
  bathrooms?: number;
  rooms?: number;
  floors?: number;
  floor_number?: number;
  driver_room?: number;
  maid_room?: number;
  dining_room?: number;
  living_room?: boolean;
  majlis?: number;
  storage_room?: boolean;
  basement?: number;
  swimming_pool?: number;
  kitchen?: number;
  balcony?: boolean;
  garden?: number;
  annex?: boolean;
  elevator?: number;
  private_parking?: number;
  parking_space?: number;
  featured_image?: string;
  city_id?: number;
  state_id?: number;
  district_id?: number;
  category_id?: number;
  project_id?: number;
  building_id?: number;
  payment_method?: string;
}

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

export default function EditPropertyRequestPage() {
  const params = useParams();
  const router = useRouter();
  const propertyRequestId = params?.id as string;
  const { userData, IsLoading: authLoading } = useAuthStore();

  const [propertyRequest, setPropertyRequest] = useState<PropertyRequest | null>(
    null,
  );
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyRequestFormData | null>(
    null,
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Property selection state
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  // دالة لجلب تفاصيل طلب العقار
  const fetchPropertyRequestDetails = async (id: string) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    setLoadingDetails(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/v1/property-requests/${id}`);
      // التحقق من وجود البيانات في أي من الأشكال المحتملة
      const data = response.data?.data || response.data;
      if (data && (data.id || data.user_id)) {
        setPropertyRequest(data);
        // Set selected property ID if exists
        if (data.property_id) {
          setSelectedPropertyId(data.property_id.toString());
        }
        setFormData({
          property_type: data.property_type || "",
          category: data.category || "",
          neighborhoods: data.neighborhoods || [],
          area_from: data.area_from,
          area_to: data.area_to,
          purchase_method: data.purchase_method || "",
          budget_from: data.budget_from,
          budget_to: data.budget_to,
          seriousness: data.seriousness || "",
          purchase_goal: data.purchase_goal || "",
          wants_similar_offers: data.wants_similar_offers,
          full_name: data.full_name || "",
          phone: data.phone || "",
          contact_on_whatsapp: data.contact_on_whatsapp,
          notes: data.notes || "",
        });
      } else {
        setError("فشل تحميل بيانات طلب العقار");
      }
    } catch (error: any) {
      console.error("Error fetching property request details:", error);
      setError(
        error.response?.data?.message ||
          "حدث خطأ أثناء تحميل بيانات طلب العقار",
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    if (propertyRequestId) {
      fetchPropertyRequestDetails(propertyRequestId);
    }
  }, [propertyRequestId, userData?.token, authLoading]);

  // Fetch available properties for selection
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const fetchAvailableProperties = async () => {
      setLoadingProperties(true);
      try {
        const response = await axiosInstance.get("/properties?page=1&per_page=100");
        if (response.data?.status === "success") {
          const propertiesList = response.data.data?.properties || response.data.data || [];
          setAvailableProperties(propertiesList);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        toast.error("فشل في تحميل العقارات");
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchAvailableProperties();
  }, [userData?.token, authLoading]);

  // دالة معالجة التغييرات في النموذج
  const handleChange = (field: keyof PropertyRequestFormData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    // إزالة الأخطاء عند التعديل
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle property selection
  const handlePropertySelect = (propertyId: string) => {
    // Handle "none" value to clear selection
    if (propertyId === "none") {
      setSelectedPropertyId("");
      return;
    }

    setSelectedPropertyId(propertyId);
  };

  // دالة حفظ التعديلات
  const handleUpdatePropertyRequest = async () => {
    if (!formData || !userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // التحقق من الحقول المطلوبة
    const errors: Record<string, string> = {};
    if (!formData.full_name || formData.full_name.trim() === "") {
      errors.full_name = "الاسم الكامل مطلوب";
    }
    if (!formData.phone || formData.phone.trim() === "") {
      errors.phone = "رقم الهاتف مطلوب";
    }
    if (!formData.property_type) {
      errors.property_type = "نوع العقار مطلوب";
    }
    if (!formData.purchase_method) {
      errors.purchase_method = "طريقة الشراء مطلوبة";
    }
    if (!formData.budget_from || formData.budget_from <= 0) {
      errors.budget_from = "الميزانية من مطلوبة";
    }
    if (!formData.budget_to || formData.budget_to <= 0) {
      errors.budget_to = "الميزانية إلى مطلوبة";
    }
    if (formData.budget_from > formData.budget_to) {
      errors.budget_to = "الميزانية إلى يجب أن تكون أكبر من الميزانية من";
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      toast.error("يرجى إكمال جميع الحقول المطلوبة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    setSaving(true);
    setValidationErrors({});
    setClientErrors({});

    try {
      // Prepare payload with property_id if selected
      const payload: any = {
        ...formData,
      };

      // Add property_id if a property is selected
      if (selectedPropertyId) {
        payload.property_id = parseInt(selectedPropertyId);
      } else if (selectedPropertyId === "") {
        // If property was cleared, send null
        payload.property_id = null;
      }

      await axiosInstance.put(
        `/v1/property-requests/${propertyRequestId}`,
        payload,
      );

      toast.success("تم تحديث بيانات طلب العقار بنجاح!", {
        duration: 4000,
        position: "top-center",
      });

      // الانتقال إلى صفحة تفاصيل طلب العقار
      router.push(`/dashboard/property-requests/${propertyRequestId}`);
    } catch (error: any) {
      console.error("Error updating property request:", error);

      // معالجة أخطاء التحقق من الخادم
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      }

      toast.error(
        error.response?.data?.message ||
          "حدث خطأ أثناء تحديث بيانات طلب العقار",
        {
          duration: 4000,
          position: "top-center",
        },
      );
    } finally {
      setSaving(false);
    }
  };

  // التحقق من وجود التوكن
  if (!userData?.token) {
    return (
      <div className="flex h-screen overflow-hidden" dir="rtl">
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500">
                      يرجى تسجيل الدخول لعرض المحتوى
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-10 w-10"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  تعديل بيانات طلب العقار
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/property-requests")}
              >
                <X className="ml-2 h-4 w-4" />
                إلغاء
              </Button>
            </div>

            {/* Content */}
            {loadingDetails ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary ml-2" />
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      جاري تحميل بيانات طلب العقار...
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-red-500 dark:text-red-400 mb-4">
                      {error}
                    </p>
                    <Button
                      onClick={() => fetchPropertyRequestDetails(propertyRequestId)}
                    >
                      إعادة المحاولة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : formData ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات طلب العقار</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <PropertyRequestForm
                        formData={formData}
                        onChange={handleChange}
                        errors={{
                          ...validationErrors,
                          ...clientErrors,
                        }}
                      />
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => router.back()}
                          disabled={saving}
                        >
                          إلغاء
                        </Button>
                        <Button
                          onClick={handleUpdatePropertyRequest}
                          disabled={saving}
                          className="min-w-[120px]"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              جاري الحفظ...
                            </>
                          ) : (
                            <>
                              <Save className="ml-2 h-4 w-4" />
                              حفظ التعديلات
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Selection Card - HIDDEN */}
                {/* 
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        معلومات العقار
                      </CardTitle>
                      <div className="w-full md:w-[500px]">
                        {loadingProperties ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">
                              جاري تحميل العقارات...
                            </span>
                          </div>
                        ) : (
                          <Select
                            value={selectedPropertyId || "none"}
                            onValueChange={handlePropertySelect}
                          >
                            <SelectTrigger>
                              <span className="text-sm">اختر العقار</span>
                            </SelectTrigger>
                            <SelectContent className="text-sm">
                              <SelectItem value="none" className="text-sm">
                                <span className="text-muted-foreground text-sm">
                                  لا يوجد عقار مرتبط
                                </span>
                              </SelectItem>
                              {availableProperties.map((property: any) => {
                                const title = property.title || property.address || `عقار #${property.id}`;
                                const isLongText = title.length > 50;
                                return (
                                  <SelectItem
                                    key={property.id}
                                    value={property.id.toString()}
                                    className="text-sm max-w-[350px] sm:max-w-full"
                                  >
                                    <div className="flex flex-col">
                                      <span className={`font-medium ${isLongText ? 'text-[10px]' : 'text-sm'}`}>
                                        {title}
                                      </span>
                                      {property.address && (
                                        <span className="text-xs text-muted-foreground hidden md:block">
                                          {property.address}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedPropertyId && (() => {
                      const selectedProperty = availableProperties.find(
                        (p) => p.id.toString() === selectedPropertyId
                      ) || propertyRequest?.property || null;

                      if (!selectedProperty) return null;

                      const formatCurrency = (amount: number | string | undefined) => {
                        if (!amount) return "غير محدد";
                        const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
                        if (isNaN(numAmount)) return "غير محدد";
                        return new Intl.NumberFormat("ar-SA", {
                          style: "currency",
                          currency: "SAR",
                          minimumFractionDigits: 0,
                        }).format(numAmount);
                      };

                      const basicInfo = {
                        address: selectedProperty.address || null,
                        price: selectedProperty.price || null,
                        pricePerMeter: selectedProperty.pricePerMeter || null,
                        area: selectedProperty.area || selectedProperty.size || null,
                        property_type: selectedProperty.type || null,
                        title: selectedProperty.title || null,
                        purpose: selectedProperty.purpose || null,
                        description: selectedProperty.description || null,
                        beds: selectedProperty.beds || selectedProperty.rooms || null,
                        bath: selectedProperty.bath || selectedProperty.bathrooms || null,
                        featured_image: selectedProperty.featured_image || null,
                      };

                      const facilities = {
                        bedrooms: selectedProperty.beds || selectedProperty.rooms || null,
                        bathrooms: selectedProperty.bath || selectedProperty.bathrooms || null,
                        rooms: selectedProperty.rooms || null,
                        floors: selectedProperty.floors || null,
                        floor_number: selectedProperty.floor_number || null,
                        drivers_room: selectedProperty.driver_room || null,
                        maids_room: selectedProperty.maid_room || null,
                        dining_room: selectedProperty.dining_room || null,
                        living_room: selectedProperty.living_room || null,
                        majlis: selectedProperty.majlis || null,
                        storage_room: selectedProperty.storage_room || null,
                        basement: selectedProperty.basement || null,
                        swimming_pool: selectedProperty.swimming_pool || null,
                        kitchen: selectedProperty.kitchen || null,
                        balcony: selectedProperty.balcony || null,
                        garden: selectedProperty.garden || null,
                        annex: selectedProperty.annex || null,
                        elevator: selectedProperty.elevator || null,
                        parking_space: selectedProperty.private_parking || selectedProperty.parking_space || null,
                      };

                      return (
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-base border-b pb-2">
                              المعلومات الأساسية
                            </h4>
                            <div className="space-y-4">
                              {basicInfo.featured_image && (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                  <img
                                    src={basicInfo.featured_image}
                                    alt={basicInfo.title || "عقار"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              {(basicInfo.title || basicInfo.address) && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {basicInfo.title ? "العنوان" : "العنوان الكامل"}
                                    </p>
                                    <p className="font-medium">
                                      {basicInfo.title || basicInfo.address}
                                    </p>
                                    {basicInfo.title && basicInfo.address && basicInfo.title !== basicInfo.address && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {basicInfo.address}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {basicInfo.description && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mb-1">الوصف</p>
                                    <p className="font-medium text-sm">{basicInfo.description}</p>
                                  </div>
                                </div>
                              )}

                              {basicInfo.price && (
                                <div className="flex items-start gap-3">
                                  <DollarSign className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mb-1">السعر</p>
                                    <p className="font-medium text-lg text-primary">
                                      {formatCurrency(basicInfo.price)}
                                    </p>
                                    {basicInfo.pricePerMeter && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        السعر للمتر: {formatCurrency(basicInfo.pricePerMeter)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 pt-2">
                                {basicInfo.area && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">المساحة</p>
                                    <p className="font-medium">{basicInfo.area} م²</p>
                                  </div>
                                )}
                                {basicInfo.property_type && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">نوع العقار</p>
                                    <Badge variant="outline">{basicInfo.property_type}</Badge>
                                  </div>
                                )}
                                {basicInfo.beds && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">غرف النوم</p>
                                    <p className="font-medium">{basicInfo.beds}</p>
                                  </div>
                                )}
                                {basicInfo.bath && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">الحمامات</p>
                                    <p className="font-medium">{basicInfo.bath}</p>
                                  </div>
                                )}
                                {basicInfo.purpose && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">الغرض</p>
                                    <Badge variant="outline">{basicInfo.purpose}</Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {Object.keys(facilities).some(
                            (key) => facilities[key as keyof typeof facilities] !== null && facilities[key as keyof typeof facilities] !== 0
                          ) && (
                            <div className="space-y-4">
                              <h4 className="font-semibold text-base border-b pb-2">المرافق</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {facilities.bedrooms && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">غرف النوم</p>
                                    <p className="font-semibold text-lg">{facilities.bedrooms}</p>
                                  </div>
                                )}
                                {facilities.bathrooms && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">الحمامات</p>
                                    <p className="font-semibold text-lg">{facilities.bathrooms}</p>
                                  </div>
                                )}
                                {facilities.parking_space && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">مواقف السيارات</p>
                                    <p className="font-semibold text-lg">{facilities.parking_space}</p>
                                  </div>
                                )}
                                {facilities.elevator && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">مصعد</p>
                                    <Badge variant="outline" className="mt-1">متوفر</Badge>
                                  </div>
                                )}
                                {facilities.swimming_pool && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">مسبح</p>
                                    <p className="font-semibold text-lg">{facilities.swimming_pool}</p>
                                  </div>
                                )}
                                {facilities.rooms && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">غرف</p>
                                    <p className="font-semibold text-lg">{facilities.rooms}</p>
                                  </div>
                                )}
                                {facilities.kitchen && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">مطبخ</p>
                                    <Badge variant="outline" className="mt-1">متوفر</Badge>
                                  </div>
                                )}
                                {facilities.majlis && (
                                  <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">مجلس</p>
                                    <p className="font-semibold text-lg">{facilities.majlis}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
                */}
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      لا توجد بيانات متاحة
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}

