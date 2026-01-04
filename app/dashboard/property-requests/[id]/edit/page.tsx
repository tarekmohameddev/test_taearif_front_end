"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Save, X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { PropertyRequestForm } from "@/components/property-requests/page-components/PropertyRequestForm";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

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
  created_at: string;
  updated_at: string;
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
  const { userData } = useAuthStore();

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

  // دالة لجلب تفاصيل طلب العقار
  const fetchPropertyRequestDetails = async (id: string) => {
    if (!userData?.token) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }

    setLoadingDetails(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/v1/property-requests/${id}`);
      // التحقق من وجود البيانات في أي من الأشكال المحتملة
      const data = response.data?.data || response.data;
      if (data && (data.id || data.user_id)) {
        setPropertyRequest(data);
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
    if (propertyRequestId) {
      fetchPropertyRequestDetails(propertyRequestId);
    }
  }, [propertyRequestId, userData?.token]);

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

    setSaving(true);
    setValidationErrors({});
    setClientErrors({});

    try {
      await axiosInstance.put(
        `/v1/property-requests/${propertyRequestId}`,
        formData,
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
        <EnhancedSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
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
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      <EnhancedSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
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
    </div>
  );
}

