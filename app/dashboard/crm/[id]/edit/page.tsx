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
  Building,
  User,
  Loader2,
  AlertCircle,
  MessageSquare,
  PlusCircle,
  Save,
  Home,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
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

  // Property selection
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  // Property form data
  const [propertyData, setPropertyData] = useState<any>(null);
  const [propertyFormData, setPropertyFormData] = useState({
    // Basic information
    address: "",
    building: "",
    price: "",
    payment_method: "",
    price_per_sqm: "",
    listing_type: "",
    property_category: "",
    project: "",
    city: "",
    district: "",
    area: "",
    property_type: "",
    title: "",
    purpose: "",
    description: "",
    // Facilities
    bedrooms: "",
    bathrooms: "",
    rooms: "",
    floors: "",
    floor_number: "",
    drivers_room: "",
    maids_room: "",
    dining_room: "",
    living_room: false,
    majlis: "",
    storage_room: false,
    basement: "",
    swimming_pool: "",
    kitchen: "",
    balcony: false,
    garden: "",
    annex: false,
    elevator: "",
    parking_space: "",
  });

  // Cards/Activities
  const [cards, setCards] = useState<CrmCard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Deal data state
  const [dealData, setDealData] = useState<any>(null);

  // Selected customer data - use dealData.customer if available, otherwise find in customers list
  const selectedCustomer = dealData?.customer || customers.find(
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
          const data = response.data.data;
          setDealData(data);
          setSelectedCustomerId(data.customer?.id?.toString() || "");
          // Get stage_id from request.stage_id or request.stage.id
          setStageId(
            data.request?.stage_id?.toString() ||
              data.request?.stage?.id?.toString() ||
              "",
          );
          // Set selected property ID if exists
          setSelectedPropertyId(data.request?.property_id?.toString() || "");

          // Load property data if exists
          // Property data comes directly from data.property (not nested in property_specifications)
          const property = data.property || data.property_basic || null;
          const propertySpecs = data.property_specifications || null;
          
          if (property || propertySpecs) {
            setPropertyData({ property, propertySpecs });
            
            // Get data from property_specifications if exists, otherwise from property directly
            const basicInfo = propertySpecs?.basic_information || {};
            const facilities = propertySpecs?.facilities || {};
            
            // Helper function to safely convert to string, handling null and 0
            const safeToString = (value: any): string => {
              if (value === null || value === undefined) return "";
              return value.toString();
            };

            setPropertyFormData({
              // Basic information - prioritize property_specifications, fallback to property
              address: basicInfo.address ?? property?.address ?? "",
              building: basicInfo.building ?? property?.building ?? "",
              price: safeToString(basicInfo.price ?? property?.price),
              payment_method: basicInfo.payment_method ?? property?.payment_method ?? "",
              price_per_sqm: safeToString(basicInfo.price_per_sqm ?? property?.pricePerMeter),
              listing_type: basicInfo.listing_type ?? "",
              property_category: basicInfo.property_category ?? "",
              project: safeToString(basicInfo.project ?? property?.project_id),
              city: safeToString(basicInfo.city ?? property?.city_id),
              district: safeToString(basicInfo.district ?? property?.state_id),
              area: safeToString(basicInfo.area ?? property?.area ?? property?.size),
              property_type: basicInfo.property_type ?? property?.type ?? "",
              title: property?.title ?? "",
              purpose: property?.purpose ?? "",
              description: property?.description ?? "",
              // Facilities - prioritize property_specifications, fallback to property
              bedrooms: safeToString(facilities.bedrooms ?? property?.beds),
              bathrooms: safeToString(facilities.bathrooms ?? property?.bath ?? property?.bathrooms),
              rooms: safeToString(facilities.rooms ?? property?.rooms),
              floors: safeToString(facilities.floors ?? property?.floors),
              floor_number: safeToString(facilities.floor_number ?? property?.floor_number),
              drivers_room: safeToString(facilities.drivers_room ?? property?.driver_room),
              maids_room: safeToString(facilities.maids_room ?? property?.maid_room),
              dining_room: safeToString(facilities.dining_room ?? property?.dining_room),
              living_room: facilities.living_room ?? property?.living_room ?? false,
              majlis: safeToString(facilities.majlis ?? property?.majlis),
              storage_room: facilities.storage_room ?? property?.storage_room ?? false,
              basement: safeToString(facilities.basement ?? property?.basement),
              swimming_pool: safeToString(facilities.swimming_pool ?? property?.swimming_pool),
              kitchen: safeToString(facilities.kitchen ?? property?.kitchen),
              balcony: facilities.balcony ?? property?.balcony ?? false,
              garden: safeToString(facilities.garden ?? property?.garden),
              annex: facilities.annex ?? property?.annex ?? false,
              elevator: safeToString(facilities.elevator ?? property?.elevator),
              parking_space: safeToString(facilities.parking_space ?? property?.private_parking),
            });
          }
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

  // Update selectedCustomer when customers are loaded and customerId is set
  useEffect(() => {
    if (selectedCustomerId && customers.length > 0) {
      const customer = customers.find(
        (c) => c.id.toString() === selectedCustomerId,
      );
      if (!customer && dealData?.customer) {
        // If customer not found in list, add it from dealData
        setCustomers((prev) => [dealData.customer, ...prev]);
      }
    }
  }, [selectedCustomerId, customers, dealData]);

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

  // Fetch available properties for selection
  useEffect(() => {
    const fetchAvailableProperties = async () => {
      if (!userData?.token) return;

      setLoadingProperties(true);
      try {
        const response = await axiosInstance.get("/properties?page=1&per_page=100");
        if (response.data?.status === "success") {
          const propertiesList = response.data.data?.properties || response.data.data || [];
          setAvailableProperties(propertiesList);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchAvailableProperties();
  }, [userData?.token]);

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

  // Handle property selection
  const handlePropertySelect = (propertyId: string) => {
    // Handle "none" value to clear selection
    if (propertyId === "none") {
      setSelectedPropertyId("");
      return;
    }

    setSelectedPropertyId(propertyId);
    const selectedProperty = availableProperties.find(
      (p) => p.id.toString() === propertyId,
    ) as any;

    if (selectedProperty) {
      // Update property form data with selected property data
      const safeToString = (value: any): string => {
        if (value === null || value === undefined) return "";
        return value.toString();
      };

      setPropertyFormData({
        address: selectedProperty.address ?? "",
        building: safeToString(selectedProperty.building_id),
        price: safeToString(selectedProperty.price),
        payment_method: selectedProperty.payment_method ?? "",
        price_per_sqm: safeToString(selectedProperty.pricePerMeter),
        listing_type: "",
        property_category: safeToString(selectedProperty.category_id),
        project: safeToString(selectedProperty.project_id),
        city: safeToString(selectedProperty.city_id),
        district: safeToString(selectedProperty.state_id),
        area: safeToString(selectedProperty.area ?? selectedProperty.size),
        property_type: selectedProperty.type ?? "",
        title: selectedProperty.title ?? "",
        purpose: selectedProperty.purpose ?? "",
        description: selectedProperty.description ?? "",
        bedrooms: safeToString(selectedProperty.beds),
        bathrooms: safeToString(selectedProperty.bath ?? selectedProperty.bathrooms),
        rooms: safeToString(selectedProperty.rooms),
        floors: safeToString(selectedProperty.floors),
        floor_number: safeToString(selectedProperty.floor_number),
        drivers_room: safeToString(selectedProperty.driver_room),
        maids_room: safeToString(selectedProperty.maid_room),
        dining_room: safeToString(selectedProperty.dining_room),
        living_room: selectedProperty.living_room ?? false,
        majlis: safeToString(selectedProperty.majlis),
        storage_room: selectedProperty.storage_room ?? false,
        basement: safeToString(selectedProperty.basement),
        swimming_pool: safeToString(selectedProperty.swimming_pool),
        kitchen: safeToString(selectedProperty.kitchen),
        balcony: selectedProperty.balcony ?? false,
        garden: safeToString(selectedProperty.garden),
        annex: selectedProperty.annex ?? false,
        elevator: safeToString(selectedProperty.elevator),
        parking_space: safeToString(selectedProperty.private_parking),
      });
    }
  };

  // Handle property form change
  const handlePropertyChange = (field: string, value: any) => {
    setPropertyFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle submit - update deal
  const handleSubmit = async () => {
    if (!selectedCustomerId || !stageId) {
      toast.error("يرجى اختيار العميل والمرحلة");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        customer_id: parseInt(selectedCustomerId),
        stage_id: parseInt(stageId),
      };

      // Add property_id if a new property is selected
      if (selectedPropertyId && selectedPropertyId !== dealData?.request?.property_id?.toString()) {
        payload.property_id = parseInt(selectedPropertyId);
      }

      // Add property data if property exists and form has data
      if ((dealData?.request?.property_id || selectedPropertyId) && propertyData) {
        payload.property = {
          // Basic information
          address: propertyFormData.address || null,
          building: propertyFormData.building || null,
          price: propertyFormData.price ? parseFloat(propertyFormData.price) : null,
          payment_method: propertyFormData.payment_method || null,
          price_per_sqm: propertyFormData.price_per_sqm ? parseFloat(propertyFormData.price_per_sqm) : null,
          listing_type: propertyFormData.listing_type || null,
          property_category: propertyFormData.property_category || null,
          project: propertyFormData.project || null,
          city: propertyFormData.city || null,
          district: propertyFormData.district || null,
          area: propertyFormData.area ? parseFloat(propertyFormData.area) : null,
          property_type: propertyFormData.property_type || null,
          title: propertyFormData.title || null,
          purpose: propertyFormData.purpose || null,
          description: propertyFormData.description || null,
          // Facilities
          bedrooms: propertyFormData.bedrooms ? parseInt(propertyFormData.bedrooms) : null,
          bathrooms: propertyFormData.bathrooms ? parseInt(propertyFormData.bathrooms) : null,
          rooms: propertyFormData.rooms ? parseInt(propertyFormData.rooms) : null,
          floors: propertyFormData.floors ? parseInt(propertyFormData.floors) : null,
          floor_number: propertyFormData.floor_number ? parseInt(propertyFormData.floor_number) : null,
          drivers_room: propertyFormData.drivers_room ? parseInt(propertyFormData.drivers_room) : null,
          maids_room: propertyFormData.maids_room ? parseInt(propertyFormData.maids_room) : null,
          dining_room: propertyFormData.dining_room ? parseInt(propertyFormData.dining_room) : null,
          living_room: propertyFormData.living_room || false,
          majlis: propertyFormData.majlis ? parseInt(propertyFormData.majlis) : null,
          storage_room: propertyFormData.storage_room || false,
          basement: propertyFormData.basement ? parseInt(propertyFormData.basement) : null,
          swimming_pool: propertyFormData.swimming_pool ? parseInt(propertyFormData.swimming_pool) : null,
          kitchen: propertyFormData.kitchen ? parseInt(propertyFormData.kitchen) : null,
          balcony: propertyFormData.balcony || false,
          garden: propertyFormData.garden ? parseInt(propertyFormData.garden) : null,
          annex: propertyFormData.annex || false,
          elevator: propertyFormData.elevator ? parseInt(propertyFormData.elevator) : null,
          parking_space: propertyFormData.parking_space ? parseInt(propertyFormData.parking_space) : null,
        };
      }

      const response = await axiosInstance.put(
        `/v1/crm/requests/${dealId}`,
        payload,
      );

      if (response.data.status === "success" || response.data.status === true) {
        toast.success("تم تحديث الصفقة بنجاح!");
        router.push(`/dashboard/crm/${dealId}`);
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
                  onClick={() => router.push(`/dashboard/crm/${dealId}`)}
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

                {/* Property Selection */}
                <div className="space-y-2">
                  <Label htmlFor="property">
                    العقار المرتبط
                  </Label>
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
                      <SelectTrigger id="property">
                        <SelectValue placeholder="اختر العقار (اختياري)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <span className="text-muted-foreground">
                            لا يوجد عقار مرتبط
                          </span>
                        </SelectItem>
                        {availableProperties.map((property: any) => (
                          <SelectItem
                            key={property.id}
                            value={property.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {property.title || property.address || `عقار #${property.id}`}
                              </span>
                              {property.address && (
                                <span className="text-xs text-muted-foreground">
                                  {property.address}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {selectedPropertyId && (
                    <p className="text-xs text-muted-foreground">
                      سيتم ربط هذا العقار بالصفقة. يمكنك تعديل بياناته أدناه.
                    </p>
                  )}
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
                            {dealData?.request?.stage?.name ||
                              getStageById(stageId)?.name ||
                              "غير محدد"}
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

                {/* Property Edit Form - Only show if property exists */}
                {propertyData && dealData?.request?.property_id && (
                  <Card>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="property-edit" className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer">
                          <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Home className="h-5 w-5" />
                            تعديل بيانات العقار
                          </CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-6 pb-6 space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-base border-b pb-2">
                          المعلومات الأساسية
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="property-title">العنوان/الاسم</Label>
                            <Input
                              id="property-title"
                              value={propertyFormData.title}
                              onChange={(e) =>
                                handlePropertyChange("title", e.target.value)
                              }
                              placeholder="عنوان العقار"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-address">العنوان الكامل</Label>
                            <Input
                              id="property-address"
                              value={propertyFormData.address}
                              onChange={(e) =>
                                handlePropertyChange("address", e.target.value)
                              }
                              placeholder="العنوان الكامل"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-price">السعر</Label>
                            <Input
                              id="property-price"
                              type="number"
                              value={propertyFormData.price}
                              onChange={(e) =>
                                handlePropertyChange("price", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-price-per-sqm">
                              السعر للمتر
                            </Label>
                            <Input
                              id="property-price-per-sqm"
                              type="number"
                              value={propertyFormData.price_per_sqm}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "price_per_sqm",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-area">المساحة (م²)</Label>
                            <Input
                              id="property-area"
                              type="number"
                              value={propertyFormData.area}
                              onChange={(e) =>
                                handlePropertyChange("area", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-type">نوع العقار</Label>
                            <Input
                              id="property-type"
                              value={propertyFormData.property_type}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "property_type",
                                  e.target.value,
                                )
                              }
                              placeholder="نوع العقار"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-purpose">الغرض</Label>
                            <Input
                              id="property-purpose"
                              value={propertyFormData.purpose}
                              onChange={(e) =>
                                handlePropertyChange("purpose", e.target.value)
                              }
                              placeholder="بيع/إيجار"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="property-payment-method">
                              طريقة الدفع
                            </Label>
                            <Input
                              id="property-payment-method"
                              value={propertyFormData.payment_method}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "payment_method",
                                  e.target.value,
                                )
                              }
                              placeholder="طريقة الدفع"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="property-description">الوصف</Label>
                          <Textarea
                            id="property-description"
                            value={propertyFormData.description}
                            onChange={(e) =>
                              handlePropertyChange("description", e.target.value)
                            }
                            placeholder="وصف العقار"
                            rows={4}
                          />
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-base border-b pb-2">
                          المرافق
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bedrooms">غرف النوم</Label>
                            <Input
                              id="bedrooms"
                              type="number"
                              value={propertyFormData.bedrooms}
                              onChange={(e) =>
                                handlePropertyChange("bedrooms", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bathrooms">الحمامات</Label>
                            <Input
                              id="bathrooms"
                              type="number"
                              value={propertyFormData.bathrooms}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "bathrooms",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rooms">الغرف</Label>
                            <Input
                              id="rooms"
                              type="number"
                              value={propertyFormData.rooms}
                              onChange={(e) =>
                                handlePropertyChange("rooms", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="floors">الأدوار</Label>
                            <Input
                              id="floors"
                              type="number"
                              value={propertyFormData.floors}
                              onChange={(e) =>
                                handlePropertyChange("floors", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="floor-number">رقم الطابق</Label>
                            <Input
                              id="floor-number"
                              type="number"
                              value={propertyFormData.floor_number}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "floor_number",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="elevator">المصاعد</Label>
                            <Input
                              id="elevator"
                              type="number"
                              value={propertyFormData.elevator}
                              onChange={(e) =>
                                handlePropertyChange("elevator", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="parking-space">مواقف السيارات</Label>
                            <Input
                              id="parking-space"
                              type="number"
                              value={propertyFormData.parking_space}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "parking_space",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="swimming-pool">المسابح</Label>
                            <Input
                              id="swimming-pool"
                              type="number"
                              value={propertyFormData.swimming_pool}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "swimming_pool",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="majlis">المجالس</Label>
                            <Input
                              id="majlis"
                              type="number"
                              value={propertyFormData.majlis}
                              onChange={(e) =>
                                handlePropertyChange("majlis", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="kitchen">المطابخ</Label>
                            <Input
                              id="kitchen"
                              type="number"
                              value={propertyFormData.kitchen}
                              onChange={(e) =>
                                handlePropertyChange("kitchen", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="drivers-room">غرف السائقين</Label>
                            <Input
                              id="drivers-room"
                              type="number"
                              value={propertyFormData.drivers_room}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "drivers_room",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maids-room">غرف الخادمات</Label>
                            <Input
                              id="maids-room"
                              type="number"
                              value={propertyFormData.maids_room}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "maids_room",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dining-room">غرف الطعام</Label>
                            <Input
                              id="dining-room"
                              type="number"
                              value={propertyFormData.dining_room}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "dining_room",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="basement">القبو</Label>
                            <Input
                              id="basement"
                              type="number"
                              value={propertyFormData.basement}
                              onChange={(e) =>
                                handlePropertyChange("basement", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="garden">الحديقة</Label>
                            <Input
                              id="garden"
                              type="number"
                              value={propertyFormData.garden}
                              onChange={(e) =>
                                handlePropertyChange("garden", e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="living-room"
                              checked={propertyFormData.living_room}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "living_room",
                                  e.target.checked,
                                )
                              }
                              className="rounded"
                            />
                            <Label htmlFor="living-room">صالة</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="storage-room"
                              checked={propertyFormData.storage_room}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "storage_room",
                                  e.target.checked,
                                )
                              }
                              className="rounded"
                            />
                            <Label htmlFor="storage-room">مخزن</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="balcony"
                              checked={propertyFormData.balcony}
                              onChange={(e) =>
                                handlePropertyChange("balcony", e.target.checked)
                              }
                              className="rounded"
                            />
                            <Label htmlFor="balcony">شرفة</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="annex"
                              checked={propertyFormData.annex}
                              onChange={(e) =>
                                handlePropertyChange("annex", e.target.checked)
                              }
                              className="rounded"
                            />
                            <Label htmlFor="annex">ملحق</Label>
                          </div>
                        </div>
                      </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                )}

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
                    onClick={() => router.push(`/dashboard/crm/${dealId}`)}
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
