"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Home,
  User,
  Loader2,
  AlertCircle,
  Clock,
  MessageSquare,
  PlusCircle,
  Edit,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import {
  CrmActivityCard,
  CrmCard,
  Project,
  Property,
} from "@/components/crm/dialogs/crm-activity-card";
import { AddActivityForm } from "@/components/crm/dialogs/add-activity-form";
import useCrmStore from "@/context/store/crm";

interface DealDetailsData {
  request: {
    id: number;
    user_id: number;
    customer_id: number;
    stage_id: number;
    property_id: number | null;
    position: number;
    created_at: string;
    updated_at: string;
  };
  customer: {
    id: number;
    name: string;
    phone_number: string;
    stage_id: number | null;
    priority_id: number | null;
    type_id: number | null;
    responsible_employee: {
      id: number;
      name: string;
      email: string;
      whatsapp_number: string;
    } | null;
  };
  cards: Array<{
    id: number;
    card_content: string;
    card_procedure: string;
    card_date: string;
    created_at: string;
  }>;
  property_source: string;
  property_specifications: {
    basic_information: {
      address: string | null;
      building: string | null;
      price: number;
      payment_method: string | null;
      price_per_sqm: number;
      listing_type: string | null;
      property_category: string | null;
      project: string | null;
      city: string | null;
      district: string | number | null;
      area: number | null;
      property_type: string | null;
    };
    details: {
      features: any[];
    };
    attributes: {
      area_sqft: number | null;
      year_built: number | null;
    };
    facilities: {
      bedrooms: number | null;
      bathrooms: number | null;
      rooms: number | null;
      floors: number | null;
      floor_number: number | null;
      drivers_room: number | null;
      maids_room: number | null;
      dining_room: number | null;
      living_room: boolean | null;
      majlis: number | null;
      storage_room: boolean | null;
      basement: number | null;
      swimming_pool: number | null;
      kitchen: number | null;
      balcony: boolean | null;
      garden: number | null;
      annex: boolean | null;
      elevator: number | null;
      parking_space: number | null;
    };
  };
}

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = (params?.id as string) || "";
  const [activeTab, setActiveTab] = useState("crm");
  const { pipelineStages, getStageById, setPipelineStages } = useCrmStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DealDetailsData | null>(null);

  // States for cards/activities (from popup)
  const [cards, setCards] = useState<CrmCard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [errorCards, setErrorCards] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `/v1/crm/requests/${dealId}/details`,
        );
        if (response.data.status === "success") {
          setData(response.data.data);
        } else {
          setError("فشل في تحميل تفاصيل الصفقة");
        }
      } catch (err: any) {
        console.error("Error fetching deal details:", err);
        setError(
          err.response?.data?.message || "حدث خطأ أثناء تحميل تفاصيل الصفقة",
        );
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  // Fetch pipeline stages if not in store
  useEffect(() => {
    const fetchStages = async () => {
      if (pipelineStages.length === 0) {
        try {
          const response = await axiosInstance.get("/v1/crm/requests");
          if (response.data.status === "success") {
            const { stages } = response.data.data || {};
            const transformedStages = (stages || []).map((stage: any) => ({
              id: String(stage.id),
              name: stage.stage_name,
              color: stage.color || "#6366f1",
              icon: stage.icon || "Target",
              count: stage.requests?.length || 0,
              value: 0,
            }));
            setPipelineStages(transformedStages);
          }
        } catch (err) {
          console.error("Error fetching stages:", err);
        }
      }
    };
    fetchStages();
  }, [pipelineStages.length, setPipelineStages]);

  // Fetch cards, projects, and properties (from popup)
  useEffect(() => {
    if (data?.request?.id) {
      const fetchCardsData = async () => {
        setIsLoadingCards(true);
        setErrorCards(null);
        try {
          const [cardsRes, projectsRes, propertiesRes] = await Promise.all([
            axiosInstance.get(
              `/v1/crm/cards?card_request_id=${data.request.id}`,
            ),
            axiosInstance.get("/projects"),
            axiosInstance.get("/properties"),
          ]);

          // Merge cards from API details with cards from cards endpoint
          const cardsFromApi = Array.isArray(data.cards)
            ? data.cards.map(
                (card: any): CrmCard => ({
                  id: card.id,
                  user_id: card.user_id,
                  card_customer_id: card.card_customer_id,
                  card_request_id: card.card_request_id || data.request.id,
                  card_content: card.card_content || "",
                  card_procedure: card.card_procedure || "note",
                  card_project: card.card_project ?? null,
                  card_property: card.card_property ?? null,
                  card_date:
                    card.card_date ||
                    card.created_at ||
                    new Date().toISOString(),
                  created_at: card.created_at,
                  updated_at: card.updated_at,
                  deleted_at: card.deleted_at,
                }),
              )
            : [];

          const cardsFromEndpoint =
            cardsRes.data.status === "success" || cardsRes.data.status === true
              ? (cardsRes.data.data?.cards || cardsRes.data.data || []).map(
                  (card: any): CrmCard => ({
                    id: card.id,
                    user_id: card.user_id,
                    card_customer_id: card.card_customer_id,
                    card_request_id: card.card_request_id || data.request.id,
                    card_content: card.card_content || "",
                    card_procedure: card.card_procedure || "note",
                    card_project: card.card_project ?? null,
                    card_property: card.card_property ?? null,
                    card_date:
                      card.card_date ||
                      card.created_at ||
                      new Date().toISOString(),
                    created_at: card.created_at,
                    updated_at: card.updated_at,
                    deleted_at: card.deleted_at,
                  }),
                )
              : [];

          // Merge and remove duplicates based on id
          const mergedCards = [...cardsFromApi];
          cardsFromEndpoint.forEach((card: CrmCard) => {
            if (!mergedCards.find((c: CrmCard) => c.id === card.id)) {
              mergedCards.push(card);
            }
          });

          setCards(mergedCards);

          if (projectsRes.data.status === "success") {
            setProjects(
              projectsRes.data.data?.projects || projectsRes.data.data || [],
            );
          }
          if (propertiesRes.data.status === "success") {
            setProperties(
              propertiesRes.data.data?.properties ||
                propertiesRes.data.data ||
                [],
            );
          }
        } catch (err) {
          console.error("Failed to fetch cards data:", err);
          // Fallback to cards from API details if endpoint fails
          const cardsFromApi = Array.isArray(data.cards)
            ? data.cards.map(
                (card: any): CrmCard => ({
                  id: card.id,
                  user_id: card.user_id,
                  card_customer_id: card.card_customer_id,
                  card_request_id: card.card_request_id || data.request.id,
                  card_content: card.card_content || "",
                  card_procedure: card.card_procedure || "note",
                  card_project: card.card_project ?? null,
                  card_property: card.card_property ?? null,
                  card_date:
                    card.card_date ||
                    card.created_at ||
                    new Date().toISOString(),
                  created_at: card.created_at,
                  updated_at: card.updated_at,
                  deleted_at: card.deleted_at,
                }),
              )
            : [];
          setCards(cardsFromApi);
          setErrorCards("فشل في تحميل الأنشطة والبطاقات.");
        } finally {
          setIsLoadingCards(false);
        }
      };
      fetchCardsData();
    } else if (data?.cards) {
      // If no request id but cards exist in data, use them
      const cardsFromApi = Array.isArray(data.cards)
        ? data.cards.map(
            (card: any): CrmCard => ({
              id: card.id,
              user_id: card.user_id,
              card_customer_id: card.card_customer_id,
              card_request_id: card.card_request_id,
              card_content: card.card_content || "",
              card_procedure: card.card_procedure || "note",
              card_project: card.card_project ?? null,
              card_property: card.card_property ?? null,
              card_date:
                card.card_date || card.created_at || new Date().toISOString(),
              created_at: card.created_at,
              updated_at: card.updated_at,
              deleted_at: card.deleted_at,
            }),
          )
        : [];
      setCards(cardsFromApi);
    }
  }, [data?.request?.id, data?.cards]);

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

  // Handle add card (from popup)
  const handleAddCard = async (cardData: any) => {
    if (!data?.request?.id) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...cardData,
        card_request_id: data.request.id,
      };
      const response = await axiosInstance.post("/v1/crm/cards", payload);
      if (response.data.status === true || response.data.status === "success") {
        const newCard = response.data.data?.card || response.data.data;
        setCards((prev) => [newCard, ...prev]);
        setShowAddForm(false);
      } else {
        setErrorCards(response.data.message || "فشل في إضافة النشاط.");
      }
    } catch (err) {
      console.error("Failed to add card:", err);
      setErrorCards("حدث خطأ أثناء إضافة النشاط.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle call
  const handleCall = () => {
    if (customer?.phone_number) {
      window.open(`tel:${customer.phone_number}`, "_blank");
    }
  };

  // Handle WhatsApp
  const handleWhatsApp = () => {
    if (customer?.phone_number) {
      const message = `مرحباً ${customer.name}، أتمنى أن تكون بخير.`;
      const whatsappUrl = `https://wa.me/${customer.phone_number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (loading) {
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

  if (error || !data) {
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
                    {error || "لم يتم العثور على تفاصيل الصفقة"}
                  </p>
                  <Button onClick={() => router.push("/dashboard/crm")}>
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة إلى CRM
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const {
    request,
    customer,
    cards: cardsFromApi,
    property_specifications,
    property_basic,
    property,
  } = data as any;

  // Debug: Log to check data structure
  console.log("Full Data:", data);
  console.log("Property:", property);
  console.log("Property Basic:", property_basic);
  console.log("Property Specifications:", property_specifications);

  // Get property data from multiple possible locations (property, property_basic, or request.property_basic)
  const propertyBasicData =
    property ||
    property_basic ||
    (data as any).request?.property_basic ||
    (data as any).property ||
    (data as any).property_basic ||
    null;

  console.log("Property Basic Data:", propertyBasicData);

  // Get property specifications
  const propertySpecsData =
    property_specifications || (data as any).property_specifications || null;

  // Extract basic info - try from property_specifications first, then property/property_basic
  const basicInfoFromSpecs = propertySpecsData?.basic_information || {};
  const basicInfoFromBasic = propertyBasicData || {};

  // Merge both sources, giving priority to property_specifications
  const basicInfo = {
    address: basicInfoFromSpecs.address || basicInfoFromBasic.address || null,
    building:
      basicInfoFromSpecs.building || basicInfoFromBasic.building || null,
    price:
      basicInfoFromSpecs.price ||
      (basicInfoFromBasic.price ? parseFloat(basicInfoFromBasic.price) : 0) ||
      0,
    payment_method:
      basicInfoFromSpecs.payment_method ||
      basicInfoFromBasic.payment_method ||
      null,
    price_per_sqm:
      basicInfoFromSpecs.price_per_sqm ||
      (basicInfoFromBasic.pricePerMeter
        ? parseFloat(basicInfoFromBasic.pricePerMeter)
        : 0) ||
      0,
    listing_type: basicInfoFromSpecs.listing_type || null,
    property_category: basicInfoFromSpecs.property_category || null,
    project: basicInfoFromSpecs.project || null,
    city: basicInfoFromSpecs.city || basicInfoFromBasic.city_id || null,
    district:
      basicInfoFromSpecs.district || basicInfoFromBasic.district || null,
    area:
      basicInfoFromSpecs.area ||
      (basicInfoFromBasic.area ? parseFloat(basicInfoFromBasic.area) : null) ||
      null,
    property_type:
      basicInfoFromSpecs.property_type || basicInfoFromBasic.type || null,
    // From property/property_basic
    title: basicInfoFromBasic.title || null,
    purpose: basicInfoFromBasic.purpose || null,
    beds: basicInfoFromBasic.beds || basicInfoFromBasic.rooms || null,
    bath: basicInfoFromBasic.bath || basicInfoFromBasic.bathrooms || null,
    featured_image: basicInfoFromBasic.featured_image || null,
    description: basicInfoFromBasic.description || null,
  };

  // Get facilities from property_specifications or from property directly
  const facilitiesFromSpecs = propertySpecsData?.facilities || {};
  const facilities = {
    bedrooms:
      facilitiesFromSpecs.bedrooms ||
      basicInfoFromBasic.beds ||
      basicInfoFromBasic.rooms ||
      null,
    bathrooms:
      facilitiesFromSpecs.bathrooms ||
      basicInfoFromBasic.bath ||
      basicInfoFromBasic.bathrooms ||
      null,
    rooms: facilitiesFromSpecs.rooms || basicInfoFromBasic.rooms || null,
    floors: facilitiesFromSpecs.floors || basicInfoFromBasic.floors || null,
    floor_number:
      facilitiesFromSpecs.floor_number ||
      basicInfoFromBasic.floor_number ||
      null,
    drivers_room:
      facilitiesFromSpecs.drivers_room ||
      basicInfoFromBasic.driver_room ||
      null,
    maids_room:
      facilitiesFromSpecs.maids_room || basicInfoFromBasic.maid_room || null,
    dining_room:
      facilitiesFromSpecs.dining_room || basicInfoFromBasic.dining_room || null,
    living_room:
      facilitiesFromSpecs.living_room || basicInfoFromBasic.living_room || null,
    majlis: facilitiesFromSpecs.majlis || basicInfoFromBasic.majlis || null,
    storage_room:
      facilitiesFromSpecs.storage_room ||
      basicInfoFromBasic.storage_room ||
      null,
    basement:
      facilitiesFromSpecs.basement || basicInfoFromBasic.basement || null,
    swimming_pool:
      facilitiesFromSpecs.swimming_pool ||
      basicInfoFromBasic.swimming_pool ||
      null,
    kitchen: facilitiesFromSpecs.kitchen || basicInfoFromBasic.kitchen || null,
    balcony: facilitiesFromSpecs.balcony || basicInfoFromBasic.balcony || null,
    garden: facilitiesFromSpecs.garden || basicInfoFromBasic.garden || null,
    annex: facilitiesFromSpecs.annex || basicInfoFromBasic.annex || null,
    elevator:
      facilitiesFromSpecs.elevator || basicInfoFromBasic.elevator || null,
    parking_space:
      facilitiesFromSpecs.parking_space ||
      basicInfoFromBasic.private_parking ||
      null,
  };

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
                  onClick={() => router.push("/dashboard/crm")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    تفاصيل الصفقة #{request.id}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    تم الإنشاء في {formatDate(request.created_at)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/crm/${dealId}/edit`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">تعديل الصفقة</span>
                <span className="sm:hidden">تعديل</span>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* معلومات العميل */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      معلومات العميل
                    </CardTitle>
                    {customer?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/customers/${customer.id}`)
                        }
                        className="gap-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="hidden sm:inline">عرض التفاصيل</span>
                        <span className="sm:hidden">التفاصيل</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      العميل #{customer.id}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    {customer.phone_number ? (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${customer.phone_number}`}
                          className="text-sm hover:text-primary"
                        >
                          {customer.phone_number}
                        </a>
                      </div>
                    ) : null}
                  </div>

                  {customer.responsible_employee ? (
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
                            {customer.responsible_employee.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {customer.responsible_employee.whatsapp_number}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {request.stage_id ? (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          المرحلة:
                        </span>
                        <Badge variant="secondary">
                          {getStageById(String(request.stage_id))?.name ||
                            `#${request.stage_id}`}
                        </Badge>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* معلومات الصفقة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    معلومات الصفقة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        رقم الصفقة
                      </p>
                      <p className="font-semibold">#{request.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المرحلة</p>
                      <Badge variant="secondary">
                        {getStageById(String(request.stage_id))?.name ||
                          `#${request.stage_id}`}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        تاريخ الإنشاء
                      </p>
                      <p className="font-semibold text-sm">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">آخر تحديث</p>
                      <p className="font-semibold text-sm">
                        {formatDate(request.updated_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* معلومات العقار - دمج property_specifications و property_basic */}
            {propertySpecsData || propertyBasicData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      معلومات العقار
                    </CardTitle>
                    {request.property_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/properties/${request.property_id}`,
                          )
                        }
                        className="gap-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="hidden sm:inline">تفاصيل العقار</span>
                        <span className="sm:hidden">التفاصيل</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* المعلومات الأساسية */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-base border-b pb-2">
                        المعلومات الأساسية
                      </h4>
                      <div className="space-y-4">
                        {/* Title or Address */}
                        {basicInfo.title || basicInfo.address ? (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-1">
                                {basicInfo.title ? "العنوان" : "العنوان الكامل"}
                              </p>
                              <p className="font-medium">
                                {basicInfo.title || basicInfo.address}
                              </p>
                              {basicInfo.title &&
                              basicInfo.address &&
                              basicInfo.title !== basicInfo.address ? (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {basicInfo.address}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        {/* Description */}
                        {basicInfo.description ? (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-1">
                                الوصف
                              </p>
                              <p className="font-medium text-sm">
                                {basicInfo.description}
                              </p>
                            </div>
                          </div>
                        ) : null}
                        {/* Price */}
                        {(basicInfo.price && basicInfo.price > 0) ||
                        (propertyBasicData?.price &&
                          parseFloat(String(propertyBasicData.price)) > 0) ? (
                          <div className="flex items-start gap-3">
                            <DollarSign className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-1">
                                السعر
                              </p>
                              <p className="font-medium text-lg text-primary">
                                {formatCurrency(
                                  basicInfo.price ||
                                    (propertyBasicData?.price
                                      ? typeof propertyBasicData.price ===
                                        "string"
                                        ? parseFloat(propertyBasicData.price)
                                        : propertyBasicData.price
                                      : 0),
                                )}
                              </p>
                              {(basicInfo.price_per_sqm &&
                                basicInfo.price_per_sqm > 0) ||
                              (propertyBasicData?.pricePerMeter &&
                                parseFloat(
                                  String(propertyBasicData.pricePerMeter),
                                ) > 0) ? (
                                <p className="text-xs text-muted-foreground mt-1">
                                  السعر للمتر:{" "}
                                  {formatCurrency(
                                    basicInfo.price_per_sqm ||
                                      (propertyBasicData?.pricePerMeter
                                        ? typeof propertyBasicData.pricePerMeter ===
                                          "string"
                                          ? parseFloat(
                                              propertyBasicData.pricePerMeter,
                                            )
                                          : propertyBasicData.pricePerMeter
                                        : 0),
                                  )}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        {/* Payment Method */}
                        {basicInfo.payment_method ? (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              طريقة الدفع
                            </p>
                            <Badge variant="outline">
                              {basicInfo.payment_method}
                            </Badge>
                          </div>
                        ) : null}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {/* Area */}
                          {basicInfo.area || propertyBasicData?.area ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                المساحة
                              </p>
                              <p className="font-medium">
                                {basicInfo.area || propertyBasicData?.area} م²
                              </p>
                            </div>
                          ) : null}
                          {/* Property Type */}
                          {basicInfo.property_type ||
                          (propertyBasicData?.type &&
                            propertyBasicData.type !== "") ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                نوع العقار
                              </p>
                              <Badge variant="outline">
                                {basicInfo.property_type ||
                                  propertyBasicData?.type}
                              </Badge>
                            </div>
                          ) : null}
                          {/* City */}
                          {basicInfo.city ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                المدينة
                              </p>
                              <p className="font-medium">{basicInfo.city}</p>
                            </div>
                          ) : null}
                          {/* District */}
                          {basicInfo.district ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                الحي
                              </p>
                              <p className="font-medium">
                                {basicInfo.district}
                              </p>
                            </div>
                          ) : null}
                          {/* Beds */}
                          {basicInfo.beds ||
                          propertyBasicData?.beds ||
                          propertyBasicData?.rooms ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                غرف النوم
                              </p>
                              <p className="font-medium">
                                {basicInfo.beds ||
                                  propertyBasicData?.beds ||
                                  propertyBasicData?.rooms}
                              </p>
                            </div>
                          ) : null}
                          {/* Bath */}
                          {basicInfo.bath ||
                          propertyBasicData?.bath ||
                          propertyBasicData?.bathrooms ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                الحمامات
                              </p>
                              <p className="font-medium">
                                {basicInfo.bath ||
                                  propertyBasicData?.bath ||
                                  propertyBasicData?.bathrooms}
                              </p>
                            </div>
                          ) : null}
                          {/* Purpose */}
                          {propertyBasicData?.purpose ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                الغرض
                              </p>
                              <Badge variant="outline">
                                {propertyBasicData.purpose}
                              </Badge>
                            </div>
                          ) : null}
                        </div>
                        {/* Featured Image */}
                        {propertyBasicData?.featured_image ? (
                          <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">
                              الصورة الرئيسية
                            </p>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                              <img
                                src={propertyBasicData.featured_image}
                                alt={basicInfo.title || "عقار"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* المرافق */}
                    {Object.keys(facilities).some(
                      (key) =>
                        facilities[key as keyof typeof facilities] !== null &&
                        facilities[key as keyof typeof facilities] !== 0,
                    ) ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-base border-b pb-2">
                          المرافق
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Bedrooms */}
                          {facilities.bedrooms ||
                          basicInfo.beds ||
                          propertyBasicData?.beds ||
                          propertyBasicData?.rooms ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                غرف النوم
                              </p>
                              <p className="font-semibold text-lg">
                                {facilities.bedrooms ||
                                  basicInfo.beds ||
                                  propertyBasicData?.beds ||
                                  propertyBasicData?.rooms}
                              </p>
                            </div>
                          ) : null}
                          {/* Bathrooms */}
                          {facilities.bathrooms ||
                          basicInfo.bath ||
                          propertyBasicData?.bath ||
                          propertyBasicData?.bathrooms ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                الحمامات
                              </p>
                              <p className="font-semibold text-lg">
                                {facilities.bathrooms ||
                                  basicInfo.bath ||
                                  propertyBasicData?.bath ||
                                  propertyBasicData?.bathrooms}
                              </p>
                            </div>
                          ) : null}
                          {/* Parking */}
                          {facilities.parking_space ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                مواقف السيارات
                              </p>
                              <p className="font-semibold text-lg">
                                {facilities.parking_space}
                              </p>
                            </div>
                          ) : null}
                          {/* Elevator */}
                          {facilities.elevator ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                مصعد
                              </p>
                              <Badge variant="outline" className="mt-1">
                                متوفر
                              </Badge>
                            </div>
                          ) : null}
                          {/* Swimming Pool */}
                          {facilities.swimming_pool ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                مسبح
                              </p>
                              <p className="font-semibold text-lg">
                                {facilities.swimming_pool}
                              </p>
                            </div>
                          ) : null}
                          {/* Rooms */}
                          {facilities.rooms ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                غرف
                              </p>
                              <p className="font-semibold text-lg">
                                {facilities.rooms}
                              </p>
                            </div>
                          ) : null}
                          {/* Kitchen */}
                          {facilities.kitchen ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                مطبخ
                              </p>
                              <Badge variant="outline" className="mt-1">
                                متوفر
                              </Badge>
                            </div>
                          ) : null}
                          {/* Majlis */}
                          {facilities.majlis ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                مجلس
                              </p>
                              <p className="font-semibold text-lg">
                                {facilities.majlis}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* إذا لم تكن هناك بيانات عقار، اعرض card فارغة للمساعدة في التصحيح */}
            {!propertySpecsData && !propertyBasicData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    معلومات العقار
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    رقم العقار: {request.property_id || "غير متوفر"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (بيانات العقار غير متوفرة في الـ response)
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {/* الأنشطة والبطاقات - من popup */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    الأنشطة والبطاقات ({cards.length})
                  </CardTitle>
                  {customer?.phone_number ? (
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
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!showAddForm ? (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setShowAddForm(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                      إضافة نشاط أو ملاحظة
                    </Button>
                  ) : null}

                  {showAddForm ? (
                    <AddActivityForm
                      projects={projects}
                      properties={properties}
                      onSubmit={handleAddCard}
                      onCancel={() => setShowAddForm(false)}
                      isSubmitting={isSubmitting}
                    />
                  ) : null}

                  {isLoadingCards ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          جاري تحميل الأنشطة...
                        </p>
                      </div>
                    </div>
                  ) : errorCards ? (
                    <div className="flex flex-col items-center justify-center h-48 text-red-500">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p className="text-sm text-center">{errorCards}</p>
                    </div>
                  ) : cards.length > 0 ? (
                    <div className="space-y-4">
                      {cards.map((card) => (
                        <CrmActivityCard
                          key={card.id}
                          card={{
                            ...card,
                            card_request_id:
                              request?.id || card.card_request_id,
                          }}
                          projects={projects}
                          properties={properties}
                          onCardUpdate={(updatedCard) => {
                            setCards((prev) =>
                              prev.map((c) =>
                                c.id === updatedCard.id ? updatedCard : c,
                              ),
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <p className="text-sm text-muted-foreground text-center">
                        لا توجد ملاحظات أو أنشطة لهذه الصفقة.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
