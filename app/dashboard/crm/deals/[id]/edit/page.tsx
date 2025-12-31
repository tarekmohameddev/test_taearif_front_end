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
  Save,
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
import useAuthStore from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone_number: string;
  type: {
    id: number;
    name: string;
  } | null;
  stage: {
    id: number;
    name: string;
  } | null;
  priority: {
    id: number;
    name: string;
  } | null;
  procedure: {
    id: number;
    name: string;
  } | null;
  responsible_employee: {
    id: number;
    name: string;
    email: string;
    whatsapp_number: string;
  } | null;
  district: {
    id: number;
    name_ar: string;
    name_en: string;
    city_id: number;
    city_name_ar: string;
  } | null;
}

export default function EditDealPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params?.id as string;
  const { userData } = useAuthStore();
  const { pipelineStages, getStageById, setPipelineStages } = useCrmStore();
  const [activeTab, setActiveTab] = useState("crm");

  // Loading states
  const [loadingDeal, setLoadingDeal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Customer selection
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // Form data
  const [stageId, setStageId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cards/Activities
  const [cards, setCards] = useState<CrmCard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Selected customer data
  const selectedCustomer = customers.find(
    (c) => c.id.toString() === selectedCustomerId,
  );

  // Fetch deal details
  useEffect(() => {
    const fetchDealDetails = async () => {
      if (!dealId || !userData?.token) return;

      setLoadingDeal(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/v1/crm/requests/${dealId}/details`,
        );
        if (response.data.status === "success") {
          const dealData = response.data.data;
          setSelectedCustomerId(dealData.customer?.id?.toString() || "");
          setStageId(dealData.request?.stage_id?.toString() || "");
        } else {
          setError("فشل في تحميل تفاصيل الصفقة");
        }
      } catch (err: any) {
        console.error("Error fetching deal details:", err);
        setError(
          err.response?.data?.message || "حدث خطأ أثناء تحميل تفاصيل الصفقة",
        );
      } finally {
        setLoadingDeal(false);
      }
    };

    fetchDealDetails();
  }, [dealId, userData?.token]);

  // Fetch customers from /customers endpoint
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!userData?.token) return;

      setLoadingCustomers(true);
      try {
        const response = await axiosInstance.get("/customers");
        if (response.data.status === "success") {
          setCustomers(response.data.data.customers || []);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        toast.error("فشل في تحميل العملاء");
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [userData?.token]);

  // Fetch pipeline stages
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

  // Fetch cards, projects and properties
  useEffect(() => {
    const fetchData = async () => {
      if (!dealId || !userData?.token) return;

      setIsLoadingCards(true);
      try {
        const [cardsRes, projectsRes, propertiesRes] = await Promise.all([
          axiosInstance.get(`/v1/crm/cards?card_request_id=${dealId}`),
          axiosInstance.get("/projects"),
          axiosInstance.get("/properties"),
        ]);

        if (
          cardsRes.data.status === "success" ||
          cardsRes.data.status === true
        ) {
          const cardsData = (
            cardsRes.data.data?.cards ||
            cardsRes.data.data ||
            []
          ).map(
            (card: any): CrmCard => ({
              id: card.id,
              user_id: card.user_id,
              card_customer_id: card.card_customer_id,
              card_request_id: card.card_request_id || parseInt(dealId),
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
          );
          setCards(cardsData);
        }

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
      } finally {
        setIsLoadingCards(false);
      }
    };

    if (dealId) {
      fetchData();
    }
  }, [dealId, userData?.token]);

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

  // Handle add card
  const handleAddCard = async (cardData: any) => {
    if (!dealId) return;

    setIsLoadingCards(true);
    try {
      const payload = {
        ...cardData,
        card_request_id: parseInt(dealId),
        card_customer_id: selectedCustomerId
          ? parseInt(selectedCustomerId)
          : null,
      };

      const response = await axiosInstance.post("/v1/crm/cards", payload);
      if (response.data.status === true || response.data.status === "success") {
        const newCard = response.data.data?.card || response.data.data;
        setCards((prev) => [newCard, ...prev]);
        setShowAddForm(false);
        toast.success("تم إضافة النشاط بنجاح");
      } else {
        toast.error(response.data.message || "فشل في إضافة النشاط");
      }
    } catch (err: any) {
      console.error("Failed to add card:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة النشاط");
    } finally {
      setIsLoadingCards(false);
    }
  };

  // Handle submit - update deal
  const handleSubmit = async () => {
    if (!selectedCustomerId || !stageId) {
      toast.error("يرجى اختيار العميل والمرحلة");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_id: parseInt(selectedCustomerId),
        stage_id: parseInt(stageId),
      };

      const response = await axiosInstance.put(
        `/v1/crm/requests/${dealId}`,
        payload,
      );

      if (response.data.status === "success" || response.data.status === true) {
        toast.success("تم تحديث الصفقة بنجاح!");
        router.push(`/dashboard/crm/deals/${dealId}`);
      } else {
        toast.error(response.data.message || "فشل في تحديث الصفقة");
      }
    } catch (err: any) {
      console.error("Failed to update deal:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تحديث الصفقة");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle call
  const handleCall = () => {
    if (selectedCustomer?.phone_number) {
      window.open(`tel:${selectedCustomer.phone_number}`, "_blank");
    }
  };

  // Handle WhatsApp
  const handleWhatsApp = () => {
    if (selectedCustomer?.phone_number) {
      const message = `مرحباً ${selectedCustomer.name}، أتمنى أن تكون بخير.`;
      const whatsappUrl = `https://wa.me/${selectedCustomer.phone_number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (loadingDeal) {
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

  if (error) {
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
                  <p className="text-muted-foreground mb-4">{error}</p>
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
                  onClick={() => router.push(`/dashboard/crm/deals/${dealId}`)}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    تعديل الصفقة #{dealId}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    قم بتعديل بيانات الصفقة
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>اختيار العميل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">
                    العميل <span className="text-red-500">*</span>
                  </Label>
                  {loadingCustomers ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        جاري تحميل العملاء...
                      </span>
                    </div>
                  ) : (
                    <Select
                      value={selectedCustomerId}
                      onValueChange={setSelectedCustomerId}
                    >
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="اختر العميل" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {customer.name}
                              </span>
                              {customer.phone_number && (
                                <span className="text-xs text-muted-foreground">
                                  {customer.phone_number}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">
                    المرحلة <span className="text-red-500">*</span>
                  </Label>
                  <Select value={stageId} onValueChange={setStageId}>
                    <SelectTrigger id="stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelineStages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info Card - Same as details page */}
            {selectedCustomer && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* معلومات العميل */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          معلومات العميل
                        </CardTitle>
                        {selectedCustomer.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/customers/${selectedCustomer.id}`,
                              )
                            }
                            className="gap-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              عرض التفاصيل
                            </span>
                            <span className="sm:hidden">التفاصيل</span>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {selectedCustomer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          العميل #{selectedCustomer.id}
                        </p>
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        {selectedCustomer.phone_number ? (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${selectedCustomer.phone_number}`}
                              className="text-sm hover:text-primary"
                            >
                              {selectedCustomer.phone_number}
                            </a>
                          </div>
                        ) : null}
                        {selectedCustomer.email ? (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${selectedCustomer.email}`}
                              className="text-sm hover:text-primary"
                            >
                              {selectedCustomer.email}
                            </a>
                          </div>
                        ) : null}
                      </div>

                      {selectedCustomer.responsible_employee ? (
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
                                {selectedCustomer.responsible_employee.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {
                                  selectedCustomer.responsible_employee
                                    .whatsapp_number
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {selectedCustomer.stage ? (
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              المرحلة الحالية:
                            </span>
                            <Badge variant="secondary">
                              {selectedCustomer.stage.name}
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
                            المرحلة
                          </p>
                          <Badge variant="secondary">
                            {getStageById(stageId)?.name || "غير محدد"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            رقم الصفقة
                          </p>
                          <p className="font-semibold">#{dealId}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* الأنشطة والبطاقات - Same as details page */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        الأنشطة والبطاقات ({cards.length})
                      </CardTitle>
                      {selectedCustomer.phone_number ? (
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
                          isSubmitting={isLoadingCards}
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
                      ) : cards.length > 0 ? (
                        <div className="space-y-4">
                          {cards.map((card) => (
                            <CrmActivityCard
                              key={card.id}
                              card={card}
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

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/crm/deals/${dealId}`)
                    }
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedCustomerId || !stageId}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري التحديث...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        حفظ التعديلات
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
