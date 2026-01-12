"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Edit,
  MessageSquare,
  MapPin,
  ArrowRight,
  User,
  Building,
  Loader2,
  AlertCircle,
  Home,
  DollarSign,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
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

  const [activeTab, setActiveTab] = useState("property-requests");
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير محدد";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ar-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "غير محدد";
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCall = () => {
    if (propertyRequest?.phone) {
      window.open(`tel:${propertyRequest.phone}`, "_blank");
    }
  };

  const handleWhatsApp = () => {
    if (propertyRequest?.phone) {
      const phone = propertyRequest.phone.replace(/\D/g, "");
      let full = "";

      // Saudi numbers
      if (phone.startsWith("05")) full = "966" + phone.slice(1);
      else if (phone.startsWith("5")) full = "966" + phone;
      // Egyptian numbers
      else if (phone.startsWith("1")) full = "20" + phone;
      // fallback: assume KSA
      else full = "966" + phone;

      const message = `مرحباً ${propertyRequest.full_name}، أتمنى أن تكون بخير.`;
      const whatsappUrl = `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (loadingDetails) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !propertyRequest) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
                  <p className="text-muted-foreground mb-4">
                    {error || "لم يتم العثور على تفاصيل طلب العقار"}
                  </p>
                  <Button onClick={() => router.push("/dashboard/property-requests")}>
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة إلى طلبات العقارات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard/property-requests")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    تفاصيل طلب العقار #{propertyRequest.id}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    تم الإنشاء في {formatDate(propertyRequest.created_at)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/dashboard/property-requests/${propertyRequestId}/edit`,
                  )
                }
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">تعديل الطلب</span>
                <span className="sm:hidden">تعديل</span>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* معلومات العميل */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {propertyRequest.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      طلب عقار #{propertyRequest.id}
                    </p>
                  </div>

                  {/* معلومات الاتصال */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-sm mb-3">معلومات الاتصال</h4>
                    {propertyRequest.phone ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الهاتف:</span>
                        <a
                          href={`tel:${propertyRequest.phone}`}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {propertyRequest.phone}
                        </a>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">واتساب:</span>
                      {propertyRequest.contact_on_whatsapp ? (
                        <span className="text-sm font-medium">متاح</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">غير متاح</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">الاسم الكامل:</span>
                      <span className="text-sm font-medium">
                        {propertyRequest.full_name}
                      </span>
                    </div>
                  </div>

                  {propertyRequest.employee ? (
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-muted-foreground">
                          الموظف المسؤول:
                        </span>
                      </div>
                      <div className="space-y-2 pr-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {propertyRequest.employee.name || "غير محدد"}
                          </span>
                        </div>
                        {propertyRequest.employee.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {propertyRequest.employee.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {propertyRequest.phone && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={handleCall}
                        >
                          <Phone className="h-4 w-4" />
                          <span className="hidden sm:inline">اتصل</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={handleWhatsApp}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">واتساب</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* معلومات الطلب */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    معلومات الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الطلب</p>
                      <p className="font-semibold">#{propertyRequest.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الحالة</p>
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
                    <div>
                      <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                      <p className="font-semibold text-sm">
                        {formatDate(propertyRequest.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">آخر تحديث</p>
                      <p className="font-semibold text-sm">
                        {formatDate(propertyRequest.updated_at)}
                      </p>
                    </div>
                  </div>

                  {/* تفاصيل العقار */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-sm mb-3">تفاصيل العقار</h4>
                    {propertyRequest.property_type ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">نوع العقار:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.property_type}
                        </span>
                      </div>
                    ) : null}
                    {propertyRequest.region ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">المنطقة:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.region}
                        </span>
                      </div>
                    ) : null}
                    {propertyRequest.purchase_method ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">طريقة الشراء:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.purchase_method}
                        </span>
                      </div>
                    ) : null}
                    {(propertyRequest.budget_from || propertyRequest.budget_to) ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الميزانية:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.budget_from
                            ? propertyRequest.budget_from.toLocaleString()
                            : ""}{" "}
                          -{" "}
                          {propertyRequest.budget_to
                            ? propertyRequest.budget_to.toLocaleString()
                            : ""}{" "}
                          ريال
                        </span>
                      </div>
                    ) : null}
                    {propertyRequest.area_from && propertyRequest.area_to ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">المساحة:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.area_from} -{" "}
                          {propertyRequest.area_to} م²
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* تفاصيل إضافية */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-sm mb-3">تفاصيل إضافية</h4>
                    {propertyRequest.seriousness ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الجدية:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.seriousness}
                        </span>
                      </div>
                    ) : null}
                    {propertyRequest.purchase_goal ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">هدف الشراء:</span>
                        <span className="font-medium text-sm">
                          {propertyRequest.purchase_goal}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">عروض مشابهة:</span>
                      {propertyRequest.wants_similar_offers ? (
                        <Badge variant="default">نعم</Badge>
                      ) : (
                        <Badge variant="secondary">لا</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* معلومات العقار المطلوب */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  معلومات العقار المطلوب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* المعلومات الأساسية */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base border-b pb-2">
                      المعلومات الأساسية
                    </h4>
                    <div className="space-y-4">
                      {/* نوع العقار */}
                      {propertyRequest.property_type ? (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">
                              نوع العقار
                            </p>
                            <Badge variant="outline">
                              {propertyRequest.property_type}
                            </Badge>
                          </div>
                        </div>
                      ) : null}

                      {/* المنطقة */}
                      {propertyRequest.region ? (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">
                              المنطقة
                            </p>
                            <p className="font-medium">{propertyRequest.region}</p>
                          </div>
                        </div>
                      ) : null}

                      {/* الميزانية */}
                      {(propertyRequest.budget_from || propertyRequest.budget_to) ? (
                        <div className="flex items-start gap-3">
                          <DollarSign className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">
                              الميزانية
                            </p>
                            <p className="font-medium text-lg text-primary">
                              {propertyRequest.budget_from
                                ? formatCurrency(propertyRequest.budget_from)
                                : ""}{" "}
                              -{" "}
                              {propertyRequest.budget_to
                                ? formatCurrency(propertyRequest.budget_to)
                                : ""}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {/* طريقة الشراء */}
                      {propertyRequest.purchase_method ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            طريقة الشراء
                          </p>
                          <Badge variant="outline">
                            {propertyRequest.purchase_method}
                          </Badge>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {/* المساحة */}
                        {propertyRequest.area_from && propertyRequest.area_to ? (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              المساحة
                            </p>
                            <p className="font-medium">
                              {propertyRequest.area_from} -{" "}
                              {propertyRequest.area_to} م²
                            </p>
                          </div>
                        ) : null}

                        {/* الأحياء */}
                        {propertyRequest.neighborhoods &&
                        propertyRequest.neighborhoods.length > 0 ? (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              الأحياء
                            </p>
                            <p className="font-medium text-sm">
                              {propertyRequest.neighborhoods.join("، ")}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* التفاصيل الإضافية */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base border-b pb-2">
                      التفاصيل الإضافية
                    </h4>
                    <div className="space-y-4">
                      {/* الجدية */}
                      {propertyRequest.seriousness ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            الجدية
                          </p>
                          <Badge variant="outline">
                            {propertyRequest.seriousness}
                          </Badge>
                        </div>
                      ) : null}

                      {/* هدف الشراء */}
                      {propertyRequest.purchase_goal ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            هدف الشراء
                          </p>
                          <p className="font-medium">
                            {propertyRequest.purchase_goal}
                          </p>
                        </div>
                      ) : null}

                      {/* عروض مشابهة */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          عروض مشابهة
                        </p>
                        {propertyRequest.wants_similar_offers ? (
                          <Badge variant="default">نعم</Badge>
                        ) : (
                          <Badge variant="secondary">لا</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الملاحظات */}
            {propertyRequest.notes ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    الملاحظات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {propertyRequest.notes}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

