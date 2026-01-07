"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload,
  X,
  Loader2,
  Plus,
  MapPin,
  Save,
  ArrowRight,
  Search,
  Home,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import useCrmStore from "@/context/store/crm";
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import { PropertyCounter } from "@/components/property/propertyCOMP/property-counter";

export default function NewDealForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = useAuthStore();
  const { pipelineStages, newDealData, clearNewDealData } = useCrmStore();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("crm");

  // Customer selection mode: "existing" or "new"
  const customerIdFromUrl = searchParams?.get("customer_id");
  const [customerMode, setCustomerMode] = useState<"existing" | "new">(
    customerIdFromUrl ? "existing" : "new"
  );
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isLoadingCustomerFromUrl, setIsLoadingCustomerFromUrl] = useState(
    !!customerIdFromUrl
  );

  // Property selection mode: "existing" or "new"
  const [propertyMode, setPropertyMode] = useState<"existing" | "new">("existing");
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [propertySearchOpen, setPropertySearchOpen] = useState(false);
  const [propertySearchQuery, setPropertySearchQuery] = useState("");

  const [formData, setFormData] = useState({
    // Customer info (from cache or manual input)
    customer_id: null as number | null,
    customer_name: "",
    customer_phone: "",
    stage_id: "",

    // Property info
    property_id: null as number | null,

    // Basic Information
    address: "",
    building: null as string | null,
    price: "",
    payment_method: "",
    price_per_sqm: "",
    listing_type: "",
    property_category: "",
    project: null as string | null,
    city: null as number | null,
    district: null as string | number | null,
    area: "",
    property_type: "",

    // Details
    features: [] as string[],

    // Attributes
    area_sqft: "",
    year_built: "",

    // Facilities
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    rooms: null as number | null,
    floors: null as number | null,
    floor_number: null as number | null,
    drivers_room: null as number | null,
    maids_room: null as number | null,
    dining_room: null as number | null,
    living_room: null as number | null,
    majlis: null as number | null,
    storage_room: null as number | null,
    basement: null as number | null,
    swimming_pool: null as number | null,
    kitchen: null as number | null,
    balcony: null as number | null,
    garden: null as number | null,
    annex: null as number | null,
    elevator: null as number | null,
    parking_space: null as number | null,
  });

  const [currentFeature, setCurrentFeature] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);

  // Load cached data from store on mount (optional - can be written manually)
  useEffect(() => {
    // Read from store directly on mount
    const storeData = newDealData;
    console.log("storeData", storeData);
    if (storeData) {
      setFormData((prev) => ({
        ...prev,
        customer_name: storeData.customer_name || "",
        customer_phone: storeData.customer_phone || "",
        stage_id: storeData.stage_id || "",
      }));
      // Clear store data after loading
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDealData]); // Run only on mount

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
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [userData?.token]);

  // Fetch properties from /properties endpoint
  useEffect(() => {
    const fetchProperties = async () => {
      if (!userData?.token) return;

      setLoadingProperties(true);
      try {
        const response = await axiosInstance.get("/properties?page=1&per_page=100");
        if (response.data?.data?.properties) {
          const propertiesList = response.data.data.properties || [];
          setProperties(propertiesList);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        toast.error("فشل في جلب العقارات");
      } finally {
        setLoadingProperties(false);
      }
    };

    if (propertyMode === "existing") {
      fetchProperties();
    }
  }, [userData?.token, propertyMode]);

  // Fetch categories, projects, buildings
  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.token) {
        return;
      }

      // Fetch categories
      try {
        const categoriesRes = await axiosInstance.get("/properties/categories");
        if (categoriesRes.data?.data) {
          setCategories(
            Array.isArray(categoriesRes.data.data)
              ? categoriesRes.data.data
              : [],
          );
        }
      } catch (categoriesErr) {
        console.error("Error fetching categories:", categoriesErr);
        // Continue without categories - not critical
      }

      // Fetch projects
      try {
        const projectsRes = await axiosInstance.get("/user/projects");
        if (projectsRes.data?.data?.user_projects) {
          setProjects(
            Array.isArray(projectsRes.data.data.user_projects)
              ? projectsRes.data.data.user_projects
              : [],
          );
        }
      } catch (projectsErr) {
        console.error("Error fetching projects:", projectsErr);
        // Continue without projects - not critical
      }

      // Fetch buildings
      try {
        const buildingsRes = await axiosInstance.get("/buildings");
        if (
          buildingsRes.data?.status === "success" &&
          buildingsRes.data.data?.buildings
        ) {
          setBuildings(
            Array.isArray(buildingsRes.data.data.buildings)
              ? buildingsRes.data.data.buildings
              : [],
          );
        }
      } catch (buildingsErr) {
        console.error("Error fetching buildings:", buildingsErr);
        // Continue without buildings - not critical
      }
    };

    fetchData();
  }, [userData?.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle customer selection change
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const selectedCustomer = customers.find(
      (c) => c.id.toString() === customerId,
    );
    if (selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name || "",
        customer_phone: selectedCustomer.phone_number || "",
      }));
    }
    if (errors.customer_id || errors.customer_name || errors.customer_phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customer_id;
        delete newErrors.customer_name;
        delete newErrors.customer_phone;
        return newErrors;
      });
    }
  };

  // Auto-select customer from URL query parameter
  useEffect(() => {
    const customerIdFromUrl = searchParams?.get("customer_id");
    if (customerIdFromUrl) {
      if (customers.length > 0) {
        // Verify customer exists in the list
        const customerExists = customers.find(
          (c) => c.id.toString() === customerIdFromUrl
        );
        if (customerExists) {
          setCustomerMode("existing");
          setSelectedCustomerId(customerIdFromUrl);
          setFormData((prev) => ({
            ...prev,
            customer_id: customerExists.id,
            customer_name: customerExists.name || "",
            customer_phone: customerExists.phone_number || "",
          }));
          setIsLoadingCustomerFromUrl(false);
        }
        // If customer not found but customers are loaded, keep loading until customer is selected
      }
      // If customers are still loading, keep isLoadingCustomerFromUrl true
    } else {
      // No customer_id in URL, stop loading
      setIsLoadingCustomerFromUrl(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, customers, selectedCustomerId]);

  // Stop loading when customer is manually selected
  useEffect(() => {
    if (selectedCustomerId && isLoadingCustomerFromUrl) {
      setIsLoadingCustomerFromUrl(false);
    }
  }, [selectedCustomerId, isLoadingCustomerFromUrl]);

  // Handle customer mode change
  const handleCustomerModeChange = (mode: "existing" | "new") => {
    setCustomerMode(mode);
    // Reset customer data when switching modes
    setSelectedCustomerId("");
    setFormData((prev) => ({
      ...prev,
      customer_id: null,
      customer_name: "",
      customer_phone: "",
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.customer_id;
      delete newErrors.customer_name;
      delete newErrors.customer_phone;
      return newErrors;
    });
  };

  // Handle property selection
  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const selectedPropertyData = properties.find(
      (p) => p.id.toString() === propertyId,
    );
    
    if (selectedPropertyData) {
      setSelectedProperty(selectedPropertyData);
      setFormData((prev) => ({
        ...prev,
        property_id: selectedPropertyData.id,
        // Auto-fill from property data
        address: selectedPropertyData.address || prev.address,
        building: selectedPropertyData.building_id?.toString() || prev.building,
        price: selectedPropertyData.price?.toString() || prev.price,
        payment_method: selectedPropertyData.payment_method || prev.payment_method,
        price_per_sqm: selectedPropertyData.price_per_sqm?.toString() || prev.price_per_sqm,
        listing_type: selectedPropertyData.transaction_type === "sale" || selectedPropertyData.transaction_type === "1" ? "sale" : "rent",
        property_category: selectedPropertyData.category_id?.toString() || prev.property_category,
        project: selectedPropertyData.project_id?.toString() || prev.project,
        city: selectedPropertyData.city_id || prev.city,
        district: selectedPropertyData.district_id || prev.district,
        area: selectedPropertyData.size?.toString() || prev.area,
        property_type: selectedPropertyData.type || prev.property_type,
        features: Array.isArray(selectedPropertyData.features) ? selectedPropertyData.features : prev.features,
        area_sqft: selectedPropertyData.area_sqft?.toString() || prev.area_sqft,
        year_built: selectedPropertyData.building_age?.toString() || prev.year_built,
        bedrooms: selectedPropertyData.bedrooms || prev.bedrooms,
        bathrooms: selectedPropertyData.bathrooms || prev.bathrooms,
        rooms: selectedPropertyData.rooms || prev.rooms,
        floors: selectedPropertyData.floors || prev.floors,
        floor_number: selectedPropertyData.floor_number || prev.floor_number,
        drivers_room: selectedPropertyData.driver_room || prev.drivers_room,
        maids_room: selectedPropertyData.maid_room || prev.maids_room,
        dining_room: selectedPropertyData.dining_room || prev.dining_room,
        majlis: selectedPropertyData.majlis || prev.majlis,
        basement: selectedPropertyData.basement || prev.basement,
        swimming_pool: selectedPropertyData.swimming_pool || prev.swimming_pool,
        kitchen: selectedPropertyData.kitchen || prev.kitchen,
        garden: selectedPropertyData.garden || prev.garden,
        elevator: selectedPropertyData.elevator || prev.elevator,
        parking_space: selectedPropertyData.private_parking || prev.parking_space,
      }));
    }
    setPropertySearchOpen(false);
    
    if (errors.property_id) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.property_id;
        return newErrors;
      });
    }
  };

  // Handle property mode change
  const handlePropertyModeChange = (mode: "existing" | "new") => {
    setPropertyMode(mode);
    // Reset property data when switching modes
    setSelectedPropertyId("");
    setSelectedProperty(null);
    setFormData((prev) => ({
      ...prev,
      property_id: null,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.property_id;
      return newErrors;
    });
  };

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) => {
    if (!propertySearchQuery) return true;
    const query = propertySearchQuery.toLowerCase();
    return (
      property.title?.toLowerCase().includes(query) ||
      property.address?.toLowerCase().includes(query) ||
      property.id?.toString().includes(query)
    );
  });

  const handleStringNumberChange = (
    name: string,
    value: string,
    max?: number,
  ) => {
    // Allow only numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    if (max && parseInt(numericValue) > max) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleCounterChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (
      currentFeature.trim() !== "" &&
      !formData.features.includes(currentFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const buildRequestData = () => {
    const baseData: any = {
      stage_id: parseInt(formData.stage_id),
    };

    // If existing customer is selected, use customer_id
    if (customerMode === "existing" && formData.customer_id) {
      baseData.customer_id = formData.customer_id;
    } else {
      // If new customer, use customer_name and customer_phone
      baseData.customer_name = formData.customer_name;
      baseData.customer_phone = formData.customer_phone;
    }

    // If existing property is selected, use property_id
    if (propertyMode === "existing" && formData.property_id) {
      baseData.property_id = formData.property_id;
      // Return minimal data when using existing property
      return baseData;
    }

    // If new property, include all property specifications
    return {
      ...baseData,
      property_specifications: {
        basic_information: {
          address: formData.address || null,
          building: formData.building || null,
          price: parseFloat(formData.price) || 0,
          payment_method: formData.payment_method || null,
          price_per_sqm: parseFloat(formData.price_per_sqm) || 0,
          listing_type: formData.listing_type || null,
          property_category: formData.property_category || null,
          project: formData.project || null,
          city: formData.city || null,
          district: formData.district || null,
          area: parseFloat(formData.area) || null,
          property_type: formData.property_type || null,
        },
        details: {
          features: formData.features,
        },
        attributes: {
          area_sqft: parseFloat(formData.area_sqft) || null,
          year_built: formData.year_built
            ? parseInt(formData.year_built)
            : null,
        },
        facilities: {
          bedrooms: formData.bedrooms ?? null,
          bathrooms: formData.bathrooms ?? null,
          rooms: formData.rooms ?? null,
          floors: formData.floors ?? null,
          floor_number: formData.floor_number ?? null,
          drivers_room: formData.drivers_room ?? null,
          maids_room: formData.maids_room ?? null,
          dining_room: formData.dining_room ?? null,
          living_room: true, // Always true
          majlis: formData.majlis ?? null,
          storage_room: true, // Always true
          basement: formData.basement ?? null,
          swimming_pool: formData.swimming_pool ?? null,
          kitchen: formData.kitchen ?? null,
          balcony: true, // Always true
          garden: formData.garden ?? null,
          annex: true, // Always true
          elevator: formData.elevator ?? null,
          parking_space: formData.parking_space ?? null,
        },
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (customerMode === "existing") {
      if (!formData.customer_id) {
        newErrors.customer_id = "يرجى اختيار عميل موجود";
      }
    } else {
      if (!formData.customer_name.trim()) {
        newErrors.customer_name = "اسم العميل مطلوب";
      }
      if (!formData.customer_phone.trim()) {
        newErrors.customer_phone = "رقم الهاتف مطلوب";
      }
    }

    if (propertyMode === "existing") {
      if (!formData.property_id) {
        newErrors.property_id = "يرجى اختيار عقار موجود";
      }
    }
    
    if (!formData.stage_id) {
      newErrors.stage_id = "المرحلة مطلوبة";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("الرجاء إكمال الحقول المطلوبة");
      return;
    }

    setIsLoading(true);

    try {
      const requestData = buildRequestData();

      const response = await axiosInstance.post(
        "/v1/crm/requests",
        requestData,
      );

      if (response.data.status === "success" || response.data.status === true) {
        toast.success("تم إنشاء الصفقة بنجاح");
        router.push("/dashboard/crm");
      } else {
        toast.error(response.data.message || "فشل في إنشاء الصفقة");
      }
    } catch (err: any) {
      console.error("Error creating deal:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إنشاء الصفقة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  إنشاء صفقة جديدة
                </h1>
                <p className="text-muted-foreground mt-1">
                  أضف تفاصيل العقار المرتبط بالصفقة
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/crm")}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العميل</CardTitle>
                  <CardDescription>
                    اختر عميل موجود أو أدخل بيانات عميل جديد
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingCustomerFromUrl ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          جاري تحميل بيانات العميل...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Customer Mode Selection */}
                      <div className="space-y-2">
                        <Label>نوع العميل *</Label>
                        <RadioGroup
                          value={customerMode}
                          onValueChange={(value) =>
                            handleCustomerModeChange(value as "existing" | "new")
                          }
                          className="flex flex-row gap-6"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="existing" id="existing" />
                            <Label
                              htmlFor="existing"
                              className="font-normal cursor-pointer"
                            >
                              عميل موجود
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="new" id="new" />
                            <Label
                              htmlFor="new"
                              className="font-normal cursor-pointer"
                            >
                              عميل جديد
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                  {/* Existing Customer Selection */}
                  {customerMode === "existing" && (
                    <div className="space-y-2">
                      <Label htmlFor="customer_id">اختر العميل *</Label>
                      <Select
                        value={selectedCustomerId}
                        onValueChange={handleCustomerSelect}
                        disabled={loadingCustomers}
                      >
                        <SelectTrigger
                          id="customer_id"
                          className={
                            errors.customer_id ? "border-red-500" : ""
                          }
                        >
                          <SelectValue
                            placeholder={
                              loadingCustomers
                                ? "جاري تحميل العملاء..."
                                : "اختر عميل موجود"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.length === 0 ? (
                            <SelectItem value="no-customers" disabled>
                              لا توجد عملاء متاحة
                            </SelectItem>
                          ) : (
                            customers.map((customer) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.id.toString()}
                              >
                                {customer.name} - {customer.phone_number}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.customer_id && (
                        <p className="text-sm text-red-500">
                          {errors.customer_id}
                        </p>
                      )}
                      {selectedCustomerId && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">الاسم:</span>{" "}
                            {formData.customer_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">الهاتف:</span>{" "}
                            {formData.customer_phone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Customer Input Fields */}
                  {customerMode === "new" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer_name">اسم العميل *</Label>
                        <Input
                          id="customer_name"
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسم العميل"
                          required
                          className={
                            errors.customer_name ? "border-red-500" : ""
                          }
                        />
                        {errors.customer_name && (
                          <p className="text-sm text-red-500">
                            {errors.customer_name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customer_phone">
                          رقم هاتف العميل *
                        </Label>
                        <Input
                          id="customer_phone"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          placeholder="+966500000000"
                          required
                          className={
                            errors.customer_phone ? "border-red-500" : ""
                          }
                        />
                        {errors.customer_phone && (
                          <p className="text-sm text-red-500">
                            {errors.customer_phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                    </>
                  )}

                  {/* Stage Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="stage_id">المرحلة *</Label>
                    <Select
                      value={formData.stage_id}
                      onValueChange={(value) =>
                        handleSelectChange("stage_id", value)
                      }
                    >
                      <SelectTrigger
                        id="stage_id"
                        className={errors.stage_id ? "border-red-500" : ""}
                      >
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
                    {errors.stage_id && (
                      <p className="text-sm text-red-500">{errors.stage_id}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العقار</CardTitle>
                  <CardDescription>
                    اختر عقار موجود أو أدخل بيانات عقار جديد
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property Mode Selection */}
                  <div className="space-y-2">
                    <Label>نوع العقار *</Label>
                    <RadioGroup
                      value={propertyMode}
                      onValueChange={(value) =>
                        handlePropertyModeChange(value as "existing" | "new")
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="existing" id="property-existing" />
                        <Label
                          htmlFor="property-existing"
                          className="font-normal cursor-pointer"
                        >
                          عقار موجود
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="new" id="property-new" />
                        <Label
                          htmlFor="property-new"
                          className="font-normal cursor-pointer"
                        >
                          عقار جديد
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Existing Property Selection */}
                  {propertyMode === "existing" && (
                    <div className="space-y-2">
                      <Label htmlFor="property_id">اختر العقار *</Label>
                      <Popover open={propertySearchOpen} onOpenChange={setPropertySearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={propertySearchOpen}
                            className="w-full justify-between"
                            disabled={loadingProperties}
                          >
                            {selectedProperty
                              ? `${selectedProperty.title || `عقار #${selectedProperty.id}`} - ${selectedProperty.address || ""}`
                              : loadingProperties
                              ? "جاري تحميل العقارات..."
                              : "اختر عقار موجود"}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="ابحث عن عقار..."
                              value={propertySearchQuery}
                              onValueChange={setPropertySearchQuery}
                            />
                            <CommandList>
                              <CommandEmpty>
                                {loadingProperties
                                  ? "جاري التحميل..."
                                  : "لا توجد عقارات"}
                              </CommandEmpty>
                              <CommandGroup>
                                {filteredProperties.map((property) => (
                                  <CommandItem
                                    key={property.id}
                                    value={property.id.toString()}
                                    onSelect={() =>
                                      handlePropertySelect(property.id.toString())
                                    }
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      {property.featured_image && (
                                        <img
                                          src={property.featured_image}
                                          alt={property.title}
                                          className="h-12 w-12 rounded object-cover"
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                          {property.title || `عقار #${property.id}`}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                          {property.address || "لا يوجد عنوان"}
                                        </p>
                                        {property.price && (
                                          <p className="text-sm font-semibold text-primary mt-1">
                                            {property.price.toLocaleString()} ريال
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {errors.property_id && (
                        <p className="text-sm text-red-500">
                          {errors.property_id}
                        </p>
                      )}
                      {selectedProperty && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-start gap-4">
                            {selectedProperty.featured_image && (
                              <img
                                src={selectedProperty.featured_image}
                                alt={selectedProperty.title}
                                className="h-20 w-20 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg">
                                  {selectedProperty.title || `عقار #${selectedProperty.id}`}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/properties/${selectedProperty.id}`,
                                    )
                                  }
                                  className="h-8"
                                >
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                  عرض التفاصيل
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {selectedProperty.address && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {selectedProperty.address}
                                    </span>
                                  </div>
                                )}
                                {selectedProperty.price && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                      {selectedProperty.price.toLocaleString()} ريال
                                    </span>
                                  </div>
                                )}
                                {selectedProperty.size && (
                                  <div className="text-muted-foreground">
                                    المساحة: {selectedProperty.size} م²
                                  </div>
                                )}
                                {selectedProperty.bedrooms && (
                                  <div className="text-muted-foreground">
                                    غرف النوم: {selectedProperty.bedrooms}
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                  {selectedProperty.transaction_type === "sale" ||
                                  selectedProperty.transaction_type === "1"
                                    ? "للبيع"
                                    : "للإيجار"}
                                </Badge>
                                {selectedProperty.status === 1 && (
                                  <Badge variant="outline">منشور</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Property Note */}
                  {propertyMode === "new" && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        سيتم إنشاء عقار جديد مع الصفقة. يمكنك إدخال بيانات العقار أدناه.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Basic Information - Only show when creating new property */}
              {propertyMode === "new" && (
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                  <CardDescription>البيانات الأساسية للعقار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="أدخل العنوان"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleStringNumberChange("price", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_per_sqm">السعر لكل متر مربع</Label>
                      <Input
                        id="price_per_sqm"
                        name="price_per_sqm"
                        type="number"
                        value={formData.price_per_sqm}
                        onChange={(e) =>
                          handleStringNumberChange(
                            "price_per_sqm",
                            e.target.value,
                          )
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_method">طريقة الدفع</Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value) =>
                          handleSelectChange("payment_method", value)
                        }
                      >
                        <SelectTrigger id="payment_method">
                          <SelectValue placeholder="اختر طريقة الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">نقدي</SelectItem>
                          <SelectItem value="installments">تقسيط</SelectItem>
                          <SelectItem value="quarterly">ربع سنوي</SelectItem>
                          <SelectItem value="half-yearly">نصف سنوي</SelectItem>
                          <SelectItem value="yearly">سنوي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="listing_type">نوع القائمة</Label>
                      <Select
                        value={formData.listing_type}
                        onValueChange={(value) =>
                          handleSelectChange("listing_type", value)
                        }
                      >
                        <SelectTrigger id="listing_type">
                          <SelectValue placeholder="اختر نوع القائمة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rent">إيجار</SelectItem>
                          <SelectItem value="sale">بيع</SelectItem>
                          <SelectItem value="Sold">مباع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_category">فئة العقار</Label>
                      <Select
                        value={formData.property_category}
                        onValueChange={(value) =>
                          handleSelectChange("property_category", value)
                        }
                      >
                        <SelectTrigger id="property_category">
                          <SelectValue placeholder="اختر فئة العقار" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name || category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_type">نوع العقار</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) =>
                          handleSelectChange("property_type", value)
                        }
                      >
                        <SelectTrigger id="property_type">
                          <SelectValue placeholder="اختر نوع العقار" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">سكني</SelectItem>
                          <SelectItem value="commercial">تجاري</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">المساحة</Label>
                      <Input
                        id="area"
                        name="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) =>
                          handleStringNumberChange("area", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">المشروع</Label>
                      <Select
                        value={formData.project || ""}
                        onValueChange={(value) =>
                          handleSelectChange("project", value)
                        }
                      >
                        <SelectTrigger id="project">
                          <SelectValue placeholder="اختر المشروع" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id.toString()}
                            >
                              {project.name || project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="building">العمارة</Label>
                      <Select
                        value={formData.building || ""}
                        onValueChange={(value) =>
                          handleSelectChange("building", value)
                        }
                      >
                        <SelectTrigger id="building">
                          <SelectValue placeholder="اختر العمارة" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map((building) => (
                            <SelectItem
                              key={building.id}
                              value={building.id.toString()}
                            >
                              {building.name || building.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة</Label>
                      <CitySelector
                        selectedCityId={formData.city}
                        onCitySelect={(cityId) =>
                          setFormData((prev) => ({ ...prev, city: cityId }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">الحي</Label>
                      <DistrictSelector
                        selectedCityId={formData.city}
                        selectedDistrictId={formData.district}
                        onDistrictSelect={(districtId) => {
                          // Convert to number if possible, otherwise keep as is
                          const districtValue =
                            typeof districtId === "string"
                              ? isNaN(Number(districtId))
                                ? districtId
                                : Number(districtId)
                              : districtId;
                          setFormData((prev) => ({
                            ...prev,
                            district: districtValue,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Details - Only show when creating new property */}
              {propertyMode === "new" && (
              <Card>
                <CardHeader>
                  <CardTitle>التفاصيل</CardTitle>
                  <CardDescription>الميزات والتفاصيل الإضافية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featureInput">الميزات</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="featureInput"
                        placeholder="أدخل ميزة"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={addFeature}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 text-sm rounded-full flex items-center gap-2"
                      >
                        <span>{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="h-auto w-auto p-0.5 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Attributes - Only show when creating new property */}
              {propertyMode === "new" && (
              <Card>
                <CardHeader>
                  <CardTitle>الخصائص</CardTitle>
                  <CardDescription>الخصائص الإضافية للعقار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area_sqft">المساحة (قدم مربع)</Label>
                      <Input
                        id="area_sqft"
                        name="area_sqft"
                        type="number"
                        value={formData.area_sqft}
                        onChange={(e) =>
                          handleStringNumberChange("area_sqft", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year_built">سنة البناء</Label>
                      <Input
                        id="year_built"
                        name="year_built"
                        type="number"
                        value={formData.year_built}
                        onChange={(e) =>
                          handleStringNumberChange("year_built", e.target.value)
                        }
                        placeholder="2024"
                        min="1900"
                        max={new Date().getFullYear() + 10}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Facilities - Only show when creating new property */}
              {propertyMode === "new" && (
              <Card>
                <CardHeader>
                  <CardTitle>المرافق</CardTitle>
                  <CardDescription>مرافق وخدمات العقار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "bedrooms", label: "غرف النوم" },
                      { key: "bathrooms", label: "الحمامات" },
                      { key: "rooms", label: "الغرف" },
                      { key: "floors", label: "الطوابق" },
                      { key: "floor_number", label: "رقم الطابق" },
                      { key: "drivers_room", label: "غرفة السائق" },
                      { key: "maids_room", label: "غرفة الخادمة" },
                      { key: "dining_room", label: "غرفة الطعام" },
                      { key: "living_room", label: "غرفة المعيشة" },
                      { key: "majlis", label: "المجلس" },
                      { key: "storage_room", label: "مستودع" },
                      { key: "basement", label: "قبو" },
                      { key: "swimming_pool", label: "مسبح" },
                      { key: "kitchen", label: "مطبخ" },
                      { key: "balcony", label: "شرفة" },
                      { key: "garden", label: "حديقة" },
                      { key: "annex", label: "ملحق" },
                      { key: "elevator", label: "مصعد" },
                      { key: "parking_space", label: "موقف سيارات" },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <PropertyCounter
                          label={label}
                          value={
                            formData[key as keyof typeof formData] as
                              | number
                              | null
                              | undefined
                          }
                          onChange={(value) => handleCounterChange(key, value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/crm")}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="ml-2 h-4 w-4" />
                      حفظ الصفقة
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
