"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  Edit,
  MessageSquare,
  MapPin,
  Target,
  ArrowRight,
  X,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function PropertyRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyRequestId = params?.id as string;
  const { userData, IsLoading: authLoading } = useAuthStore();

  const [propertyRequest, setPropertyRequest] = useState<PropertyRequest | null>(
    null,
  );
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const openWhatsApp = (raw: string) => {
    const phone = raw.replace(/\D/g, ""); // remove non-digits
    let full = "";

    // Saudi numbers
    if (phone.startsWith("05")) full = "966" + phone.slice(1);
    else if (phone.startsWith("5")) full = "966" + phone;
    // Egyptian numbers
    else if (phone.startsWith("1")) full = "20" + phone;
    // fallback: assume KSA
    else full = "966" + phone;

    window.open(`https://wa.me/${full}`, "_blank");
  };

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      <EnhancedSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
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
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {propertyRequest?.full_name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("") || "PR"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {propertyRequest?.full_name || "تفاصيل طلب العقار"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      طلب عقار • منذ{" "}
                      {propertyRequest?.created_at
                        ? new Date(
                            propertyRequest.created_at,
                          ).toLocaleDateString("ar-US")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/property-requests/${propertyRequestId}/edit`,
                    )
                  }
                >
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل الطلب
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/property-requests")}
                >
                  <X className="ml-2 h-4 w-4" />
                  إغلاق
                </Button>
              </div>
            </div>

            {/* Content */}
            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
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
            ) : propertyRequest ? (
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      propertyRequest.property_type === "سكني"
                        ? "border-blue-500 text-blue-700"
                        : propertyRequest.property_type === "تجاري"
                          ? "border-green-500 text-green-700"
                          : propertyRequest.property_type === "صناعي"
                            ? "border-purple-500 text-purple-700"
                            : propertyRequest.property_type === "أرض"
                              ? "border-orange-500 text-orange-700"
                              : "border-red-500 text-red-700"
                    }
                  >
                    {propertyRequest.property_type}
                  </Badge>
                  <Badge
                    variant={
                      propertyRequest.is_active === 1 ? "default" : "secondary"
                    }
                  >
                    {propertyRequest.is_active === 1 ? "نشط" : "غير نشط"}
                  </Badge>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Phone className="ml-2 h-5 w-5" />
                        معلومات الاتصال
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>الهاتف:</span>
                        {propertyRequest.phone ? (
                          <span className="font-medium flex items-center">
                            <Phone className="ml-1 h-3 w-3 text-green-600" />
                            {propertyRequest.phone}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">
                            غير متوفر
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>واتساب:</span>
                        {propertyRequest.contact_on_whatsapp ? (
                          <span className="font-medium flex items-center">
                            <MessageSquare className="ml-1 h-3 w-3 text-green-500" />
                            متاح
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">
                            غير متوفر
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الاسم الكامل:</span>
                        <span className="font-medium">
                          {propertyRequest.full_name}
                        </span>
                      </div>
                      {propertyRequest.phone && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => openWhatsApp(propertyRequest.phone)}
                          >
                            <MessageSquare className="ml-2 h-4 w-4" />
                            واتساب
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Property Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="ml-2 h-5 w-5" />
                        تفاصيل العقار
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>نوع العقار:</span>
                        <span className="font-medium flex items-center">
                          <MapPin className="ml-1 h-3 w-3 text-blue-500" />
                          {propertyRequest.property_type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>المنطقة:</span>
                        <span className="font-medium">
                          {propertyRequest.region || "غير محددة"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>طريقة الشراء:</span>
                        <span className="font-medium">
                          {propertyRequest.purchase_method}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الميزانية:</span>
                        <span className="font-medium flex items-center">
                          <Target className="ml-1 h-3 w-3 text-purple-500" />
                          {propertyRequest.budget_from.toLocaleString()} -{" "}
                          {propertyRequest.budget_to.toLocaleString()} ريال
                        </span>
                      </div>
                      {propertyRequest.area_from && propertyRequest.area_to && (
                        <div className="flex items-center justify-between">
                          <span>المساحة:</span>
                          <span className="font-medium">
                            {propertyRequest.area_from} -{" "}
                            {propertyRequest.area_to} م²
                          </span>
                        </div>
                      )}
                      {propertyRequest.neighborhoods &&
                        propertyRequest.neighborhoods.length > 0 && (
                          <div className="flex items-start justify-between">
                            <span>الأحياء:</span>
                            <span className="font-medium text-right text-sm">
                              {propertyRequest.neighborhoods.join("، ")}
                            </span>
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  {/* Additional Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Target className="ml-2 h-5 w-5" />
                        تفاصيل إضافية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>الجدية:</span>
                        <span className="font-medium">
                          {propertyRequest.seriousness}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>هدف الشراء:</span>
                        <span className="font-medium">
                          {propertyRequest.purchase_goal}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>عروض مشابهة:</span>
                        {propertyRequest.wants_similar_offers ? (
                          <Badge variant="default">نعم</Badge>
                        ) : (
                          <Badge variant="secondary">لا</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الحالة:</span>
                        <Badge
                          variant={
                            propertyRequest.is_active === 1
                              ? "default"
                              : "secondary"
                          }
                        >
                          {propertyRequest.is_active === 1 ? "نشط" : "غير نشط"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>تاريخ الإنشاء:</span>
                        <span className="font-medium text-sm">
                          {new Date(
                            propertyRequest.created_at,
                          ).toLocaleDateString("ar-US")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>آخر تحديث:</span>
                        <span className="font-medium text-sm">
                          {new Date(
                            propertyRequest.updated_at,
                          ).toLocaleDateString("ar-US")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notes Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">الملاحظات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {propertyRequest.notes ? (
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {propertyRequest.notes}
                      </p>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground italic text-sm">
                          لا توجد ملاحظات مضافة لهذا الطلب
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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

