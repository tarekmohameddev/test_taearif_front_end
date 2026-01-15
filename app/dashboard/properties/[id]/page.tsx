"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  Building,
  Tag,
  Eye,
  Edit,
  ArrowRight,
  X,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import useAuthStore from "@/context/AuthContext";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";

interface PropertyData {
  id: number;
  project_id: number | null;
  payment_method: string | null;
  title: string;
  address: string;
  price: string;
  views: number;
  pricePerMeter: string;
  purpose: string;
  type: string;
  beds: number;
  bath: number;
  area: string;
  features: string[];
  status: number;
  featured_image: string | null;
  floor_planning_image: string[];
  gallery: string[];
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  show_reservations: boolean;
  city_id: number | null;
  state_id: number | null;
  video_url: string | null;
  virtual_tour: string | null;
  video_image: string | null;
  category_id: number | null;
  size: string | null;
  faqs: any[];
  building: string | null;
  water_meter_number: string | null;
  electricity_meter_number: string | null;
  deed_number: string | null;
  creator: any | null;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const [activeTab, setActiveTab] = useState("properties");

  // جلب token و authLoading من store للمراقبة
  const { userData, IsLoading: authLoading } = useAuthStore();

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeedDialogOpen, setIsDeedDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyId) return;

      // Wait until token is fetched
      if (authLoading || !userData?.token) {
        return; // Exit early if token is not ready
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/properties/${propertyId}`);
        if (response.data.status === "success") {
          setProperty(response.data.data.property);
        } else {
          setError("فشل تحميل بيانات الوحدة");
        }
      } catch (err: any) {
        console.error("Error fetching property details:", err);
        setError(
          err.response?.data?.message || "حدث خطأ أثناء تحميل بيانات الوحدة",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId, userData?.token, authLoading]);

  const formatCurrency = (amount: string | number) => {
    if (!amount) return "غير محدد";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getPaymentMethodText = (method: string | null) => {
    if (!method) return "غير محدد";
    const methods: { [key: string]: string } = {
      cash: "نقدي",
      semi_annual: "نصف سنوي",
      quarterly: "ربع سنوي",
      monthly: "شهري",
      annual: "سنوي",
    };
    return methods[method] || method;
  };

  const getPurposeText = (purpose: string) => {
    const purposes: { [key: string]: string } = {
      sale: "للبيع",
      rent: "للإيجار",
    };
    return purposes[purpose] || purpose;
  };

  const getTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      residential: "سكني",
      commercial: "تجاري",
      industrial: "صناعي",
      land: "أرض",
    };
    return types[type] || type;
  };

  // إذا لم يكن هناك token أو كان التحميل جارياً، نعرض loading
  if (authLoading || !userData?.token || loading) {
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

  if (error || !property) {
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
                    {error || "لم يتم العثور على تفاصيل الوحدة"}
                  </p>
                  <Button onClick={() => router.push("/dashboard/properties")}>
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة إلى الوحدات
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
                  onClick={() => router.push("/dashboard/properties")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {property.title || `وحدة #${property.id}`}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    رقم الوحدة: {property.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/dashboard/properties/${propertyId}/edit`)
                  }
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  تعديل الوحدة
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard/properties")}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* معلومات أساسية */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* العنوان */}
                  {property.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          العنوان
                        </p>
                        <p className="font-medium">{property.address}</p>
                      </div>
                    </div>
                  )}

                  {/* المبنى */}
                  {property.building && (
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          المبنى
                        </p>
                        <p className="font-medium">{property.building}</p>
                      </div>
                    </div>
                  )}

                  {/* السعر */}
                  {property.price && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          السعر
                        </p>
                        <p className="font-medium text-lg text-primary">
                          {formatCurrency(property.price)}
                        </p>
                        {property.pricePerMeter && (
                          <p className="text-xs text-muted-foreground mt-1">
                            السعر للمتر:{" "}
                            {formatCurrency(property.pricePerMeter)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* طريقة الدفع */}
                  {property.payment_method && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        طريقة الدفع
                      </p>
                      <Badge variant="outline">
                        {getPaymentMethodText(property.payment_method)}
                      </Badge>
                    </div>
                  )}

                  {/* الغرض */}
                  {property.purpose && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        الغرض
                      </p>
                      <Badge variant="outline">
                        {getPurposeText(property.purpose)}
                      </Badge>
                    </div>
                  )}

                  {/* النوع */}
                  {property.type && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        نوع الوحدة
                      </p>
                      <Badge variant="outline">
                        {getTypeText(property.type)}
                      </Badge>
                    </div>
                  )}

                  {/* الحالة */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          property.status === 1 ? "default" : "secondary"
                        }
                      >
                        {property.status === 1 ? "منشور" : "مسودة"}
                      </Badge>
                      {property.featured && (
                        <Badge variant="outline" className="border-yellow-500">
                          مميز
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* المواصفات */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    المواصفات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* غرف النوم */}
                    {property.beds && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            غرف النوم
                          </p>
                        </div>
                        <p className="font-semibold text-lg">{property.beds}</p>
                      </div>
                    )}

                    {/* الحمامات */}
                    {property.bath && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            الحمامات
                          </p>
                        </div>
                        <p className="font-semibold text-lg">{property.bath}</p>
                      </div>
                    )}

                    {/* المساحة */}
                    {property.area && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            المساحة
                          </p>
                        </div>
                        <p className="font-semibold text-lg">
                          {property.area} م²
                        </p>
                      </div>
                    )}

                    {/* المشاهدات */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          المشاهدات
                        </p>
                      </div>
                      <p className="font-semibold text-lg">
                        {property.views || 0}
                      </p>
                    </div>
                  </div>

                  {/* المميزات */}
                  {property.features && property.features.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">
                        المميزات
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* الوصف */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    الوصف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* الصور */}
            {(property.featured_image ||
              (property.gallery && property.gallery.length > 0)) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    الصور
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* الصورة الرئيسية */}
                    {property.featured_image && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <img
                          src={property.featured_image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">صورة رئيسية</Badge>
                        </div>
                      </div>
                    )}

                    {/* معرض الصور */}
                    {property.gallery &&
                      property.gallery.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full h-48 rounded-lg overflow-hidden border"
                        >
                          <img
                            src={image}
                            alt={`${property.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* الفيديو */}
            {property.video_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    الفيديو
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full rounded-lg overflow-hidden border">
                    <video
                      src={property.video_url}
                      controls
                      className="w-full h-auto"
                    >
                      متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* معلومات إضافية */}
            {(property.water_meter_number ||
              property.electricity_meter_number ||
              property.deed_number ||
              property.project_id) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    معلومات إضافية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.water_meter_number && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            رقم عداد الماء
                          </p>
                          <p className="font-medium">
                            {property.water_meter_number}
                          </p>
                        </div>
                      )}

                      {property.electricity_meter_number && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            رقم عداد الكهرباء
                          </p>
                          <p className="font-medium">
                            {property.electricity_meter_number}
                          </p>
                        </div>
                      )}

                      {property.project_id && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            رقم المشروع
                          </p>
                          <p className="font-medium">{property.project_id}</p>
                        </div>
                      )}
                    </div>

                    {property.deed_number && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          الصك
                        </p>
                        <div className="relative w-full rounded-lg overflow-hidden border">
                          <img
                            src={property.deed_number}
                            alt="صورة الصك"
                            className="w-full h-auto object-contain max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setIsDeedDialogOpen(true)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Dialog لعرض صورة الصك */}
      {property.deed_number && (
        <CustomDialog
          open={isDeedDialogOpen}
          onOpenChange={setIsDeedDialogOpen}
          maxWidth="max-w-5xl"
        >
          <CustomDialogContent className="p-0">
            <CustomDialogClose onClose={() => setIsDeedDialogOpen(false)} />
            <CustomDialogHeader>
              <CustomDialogTitle>صورة الصك</CustomDialogTitle>
            </CustomDialogHeader>
            <div className="p-4 sm:p-6">
              <div className="relative w-full rounded-lg overflow-hidden">
                <img
                  src={property.deed_number}
                  alt="صورة الصك"
                  className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                />
              </div>
            </div>
          </CustomDialogContent>
        </CustomDialog>
      )}
    </div>
  );
}
