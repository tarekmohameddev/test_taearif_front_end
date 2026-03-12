"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Loader2,
  AlertCircle,
  Edit,
  Save,
  Trash2,
  MoreVertical,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

// مكون إضافة إيجار جديد محدث
interface AddRentalFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function UpdatedAddRentalForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: AddRentalFormProps) {
  const userData = useAuthStore(selectUserData);

  const [formData, setFormData] = useState({
    tenant_full_name: "",
    contract_number: "",
    tenant_phone: "",
    tenant_email: "",
    tenant_job_title: "",
    tenant_social_status: "single",
    tenant_national_id: "",
    office_commission_type: "percentage",
    office_commission_value: "",
    property_number: "",
    property_id: "",
    project_id: "",
    move_in_date: "",
    rental_period: 12,
    rental_period_type: "",
    rental_period_multiplier: 1,
    rental_period_value: 0,
    rental_type: "monthly",
    rental_duration: 12,
    paying_plan: "monthly",
    base_rent_amount: "",
    currency: "SAR",
    deposit_amount: "",
    platform_fee: "",
    water_fee: "",
    notes: "",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [availableProperties, setAvailableProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openProject, setOpenProject] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);
  const [openAvailableProperty, setOpenAvailableProperty] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");

  // Dynamic Cost Center State
  const [costCenterItems, setCostCenterItems] = useState<
    Array<{
      id: string;
      name: string;
      cost: string;
      type: "percentage" | "fixed";
      payer: "tenant" | "owner";
      payment_frequency: "one_time" | "per_installment";
      description: string;
    }>
  >([]);

  // Function to calculate payment amounts based on contract type, duration, and payment frequency
  const calculatePaymentAmount = () => {
    if (
      !formData.base_rent_amount ||
      !formData.rental_duration ||
      !formData.rental_type ||
      !formData.paying_plan
    ) {
      return null;
    }

    const totalAmount = parseFloat(formData.base_rent_amount);
    const duration = formData.rental_duration;
    const contractType = formData.rental_type; // "monthly" or "annual"
    const paymentFrequency = formData.paying_plan; // "monthly", "quarterly", "semi_annual", "annual"

    // Convert duration to months
    const totalMonths = contractType === "annual" ? duration * 12 : duration;

    // Calculate how many payment periods based on frequency
    let paymentPeriods = 0;
    let periodName = "";

    switch (paymentFrequency) {
      case "monthly":
        paymentPeriods = totalMonths;
        periodName = "شهري";
        break;
      case "quarterly":
        paymentPeriods = Math.ceil(totalMonths / 3);
        periodName = "ربع سنوي";
        break;
      case "semi_annual":
        paymentPeriods = Math.ceil(totalMonths / 6);
        periodName = "نصف سنوي";
        break;
      case "annual":
        paymentPeriods = Math.ceil(totalMonths / 12);
        periodName = "سنوي";
        break;
      default:
        paymentPeriods = totalMonths;
        periodName = "شهري";
    }

    const paymentAmount = Math.round(totalAmount / paymentPeriods);

    return {
      paymentAmount,
      paymentPeriods,
      periodName,
      totalMonths,
      totalAmount,
    };
  };

  // Cost Center Management Functions
  const addCostCenterItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
      cost: "",
      type: "fixed" as const,
      payer: "tenant" as const,
      payment_frequency: "per_installment" as const,
      description: "",
    };
    setCostCenterItems((prev) => [...prev, newItem]);
  };

  const updateCostCenterItem = (id: string, field: string, value: string) => {
    setCostCenterItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const removeCostCenterItem = (id: string) => {
    setCostCenterItems((prev) => prev.filter((item) => item.id !== id));
  };

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isRed, setIsRed] = useState(true);
  // جلب البيانات عند فتح النموذج
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRed(false);
    }, 30000); // 30 ثانية

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log(
        "No token available, skipping fetchData in UpdatedAddRentalForm",
      );
      setLoading(false);
      setErrors({ general: "Authentication required. Please login." });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, propertiesRes, availablePropertiesRes] =
          await Promise.all([
            axiosInstance.get("/projects"),
            axiosInstance.get("/properties"),
            axiosInstance.get("/properties/available-units"),
          ]);

        // معالجة بيانات المشاريع
        if (
          projectsRes.data?.data?.projects &&
          Array.isArray(projectsRes.data.data.projects)
        ) {
          setProjects(projectsRes.data.data.projects);
        } else if (
          projectsRes.data?.projects &&
          Array.isArray(projectsRes.data.projects)
        ) {
          setProjects(projectsRes.data.projects);
        } else {
          setProjects([]);
        }

        // معالجة بيانات العقارات
        if (
          propertiesRes.data?.data?.properties &&
          Array.isArray(propertiesRes.data.data.properties)
        ) {
          setProperties(propertiesRes.data.data.properties);
        } else if (
          propertiesRes.data?.properties &&
          Array.isArray(propertiesRes.data.properties)
        ) {
          setProperties(propertiesRes.data.properties);
        } else {
          setProperties([]);
        }

        // معالجة بيانات العقارات المتاحة
        if (
          availablePropertiesRes.data?.data &&
          Array.isArray(availablePropertiesRes.data.data)
        ) {
          setAvailableProperties(availablePropertiesRes.data.data);
        } else {
          console.log("No available properties data found");
          setAvailableProperties([]);
        }
      } catch (error) {
        setErrors({ general: "حدث خطأ في جلب البيانات" });
        setProjects([]);
        setProperties([]);
        setAvailableProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.token]);

  // دالة التحقق من البيانات - محدثة حسب API
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // === الحقول المطلوبة حسب API ===

    // التحقق من الاسم الكامل (مطلوب، أقصى 150 حرف)
    if (!formData.tenant_full_name.trim()) {
      newErrors.tenant_full_name = "الاسم الكامل مطلوب";
    } else if (formData.tenant_full_name.length > 150) {
      newErrors.tenant_full_name = "الاسم الكامل لا يجب أن يتجاوز 150 حرف";
    }

    // التحقق من رقم الهاتف (مطلوب، أقصى 32 حرف)
    if (!formData.tenant_phone.trim()) {
      newErrors.tenant_phone = "رقم الهاتف مطلوب";
    } else if (formData.tenant_phone.length > 32) {
      newErrors.tenant_phone = "رقم الهاتف لا يجب أن يتجاوز 32 حرف";
    }

    // التحقق من نوع الإيجار (مطلوب، enum: monthly, annual)
    if (!formData.rental_type.trim()) {
      newErrors.rental_type = "نوع الإيجار مطلوب";
    } else if (!["monthly", "annual"].includes(formData.rental_type)) {
      newErrors.rental_type = "نوع الإيجار يجب أن يكون شهري أو سنوي";
    }

    // التحقق من مدة الإيجار (مطلوب، أقصى 1)
    if (!formData.rental_duration || formData.rental_duration < 1) {
      newErrors.rental_duration = "مدة الإيجار مطلوبة ولا تقل عن 1";
    } else if (!Number.isInteger(formData.rental_duration)) {
      newErrors.rental_duration = "مدة الإيجار يجب أن تكون رقم صحيح";
    }

    // التحقق من خطة الدفع (مطلوب، enum: monthly, quarterly, semi_annual, annual)
    if (!formData.paying_plan.trim()) {
      newErrors.paying_plan = "خطة الدفع مطلوبة";
    } else if (
      !["monthly", "quarterly", "semi_annual", "annual"].includes(
        formData.paying_plan,
      )
    ) {
      newErrors.paying_plan = "خطة الدفع غير صحيحة";
    }

    // التحقق من إجمالي مبلغ الإيجار (مطلوب، أقصى 0)
    if (
      !formData.base_rent_amount ||
      parseFloat(formData.base_rent_amount) < 0
    ) {
      newErrors.base_rent_amount = "مبلغ الإيجار مطلوب ولا يجب أن يكون سالب";
    } else if (isNaN(parseFloat(formData.base_rent_amount))) {
      newErrors.base_rent_amount = "مبلغ الإيجار يجب أن يكون رقم صحيح";
    }

    // === الحقول الاختيارية ===

    // التحقق من البريد الإلكتروني (اختياري، صيغة email)
    if (
      formData.tenant_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant_email)
    ) {
      newErrors.tenant_email = "البريد الإلكتروني غير صحيح";
    }

    // التحقق من المهنة (اختياري، أقصى 120 حرف)
    if (formData.tenant_job_title && formData.tenant_job_title.length > 120) {
      newErrors.tenant_job_title = "المهنة لا يجب أن تتجاوز 120 حرف";
    }

    // التحقق من الحالة الاجتماعية (اختياري، enum)
    if (
      formData.tenant_social_status &&
      !["single", "married", "divorced", "widowed", "other"].includes(
        formData.tenant_social_status,
      )
    ) {
      newErrors.tenant_social_status = "الحالة الاجتماعية غير صحيحة";
    }

    // التحقق من رقم الهوية (اختياري، أقصى 20 حرف)
    if (
      formData.tenant_national_id &&
      formData.tenant_national_id.length > 20
    ) {
      newErrors.tenant_national_id = "رقم الهوية لا يجب أن يتجاوز 20 حرف";
    }

    // التحقق من تاريخ الانتقال (اختياري، صيغة YYYY-MM-DD)
    if (formData.move_in_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.move_in_date)) {
        newErrors.move_in_date = "تاريخ الانتقال يجب أن يكون بصيغة YYYY-MM-DD";
      }
    }

    // التحقق من العملة (اختياري، 3 أحرف بالضبط)
    if (formData.currency && formData.currency.length !== 3) {
      newErrors.currency = "رمز العملة يجب أن يكون 3 أحرف بالضبط";
    }

    // التحقق من رقم العقد (اختياري، أقصى 255 حرف)
    if (formData.contract_number && formData.contract_number.length > 255) {
      newErrors.contract_number = "رقم العقد لا يجب أن يتجاوز 255 حرف";
    }

    // === التحقق من cost_items ===
    if (costCenterItems.length > 0) {
      costCenterItems.forEach((item, index) => {
        // التحقق من اسم التكلفة (مطلوب إذا كان هناك cost_items)
        if (!item.name.trim()) {
          newErrors[`cost_item_${index}_name`] =
            `اسم التكلفة ${index + 1} مطلوب`;
        } else if (item.name.length > 255) {
          newErrors[`cost_item_${index}_name`] =
            `اسم التكلفة ${index + 1} لا يجب أن يتجاوز 255 حرف`;
        }

        // التحقق من التكلفة (مطلوب إذا كان هناك cost_items، أقصى 0)
        if (!item.cost || parseFloat(item.cost) < 0) {
          newErrors[`cost_item_${index}_cost`] =
            `تكلفة ${index + 1} مطلوبة ولا يجب أن تكون سالبة`;
        } else if (isNaN(parseFloat(item.cost))) {
          newErrors[`cost_item_${index}_cost`] =
            `تكلفة ${index + 1} يجب أن تكون رقم صحيح`;
        }

        // التحقق من نوع التكلفة (مطلوب إذا كان هناك cost_items، enum)
        if (!item.type || !["fixed", "percentage"].includes(item.type)) {
          newErrors[`cost_item_${index}_type`] =
            `نوع التكلفة ${index + 1} يجب أن يكون مبلغ ثابت أو نسبة مئوية`;
        }

        // التحقق من من يدفع (مطلوب إذا كان هناك cost_items، enum)
        if (!item.payer || !["owner", "tenant"].includes(item.payer)) {
          newErrors[`cost_item_${index}_payer`] =
            `من يدفع ${index + 1} يجب أن يكون مالك أو مستأجر`;
        }

        // التحقق من تكرار الدفع (مطلوب إذا كان هناك cost_items، enum)
        if (
          !item.payment_frequency ||
          !["one_time", "per_installment"].includes(item.payment_frequency)
        ) {
          newErrors[`cost_item_${index}_payment_frequency`] =
            `تكرار الدفع ${index + 1} يجب أن يكون مرة واحدة أو لكل قسط`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // تحويل البيانات إلى الأنواع الصحيحة لتطابق الـ API المطلوب
    const processedFormData: any = {
      tenant_full_name: formData.tenant_full_name,
      tenant_phone: formData.tenant_phone,
      tenant_email: formData.tenant_email || null,
      tenant_job_title: formData.tenant_job_title || null,
      tenant_social_status: formData.tenant_social_status || null,
      tenant_national_id: formData.tenant_national_id || null,
      unit_id: formData.property_id ? parseInt(formData.property_id) : null,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      building_id: selectedBuildingId || null,
      move_in_date: formData.move_in_date || null,
      rental_type: formData.rental_type,
      rental_duration: Number(formData.rental_duration),
      paying_plan: formData.paying_plan,
      total_rental_amount: formData.base_rent_amount
        ? parseFloat(formData.base_rent_amount)
        : 0,
      currency: formData.currency || null,
      contract_number: formData.contract_number || null,
      notes: formData.notes || null,
      cost_items:
        costCenterItems.length > 0
          ? costCenterItems.map((item) => ({
              name: item.name,
              cost: item.cost ? parseFloat(item.cost) : 0,
              type: item.type,
              payer: item.payer,
              payment_frequency: item.payment_frequency,
              description: item.description || null,
            }))
          : null,
    };

    console.log("Processed form data for API:", processedFormData);
    onSubmit(processedFormData);
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-500">
              يرجى تسجيل الدخول لعرض المحتوى
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 ml-2" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
              معلومات المستأجر
            </h4>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_full_name"
                className="text-sm font-medium text-gray-700"
              >
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tenant_full_name"
                value={formData.tenant_full_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_full_name: e.target.value,
                  }));
                  if (errors.tenant_full_name) {
                    setErrors((prev) => ({ ...prev, tenant_full_name: "" }));
                  }
                }}
                placeholder="أدخل الاسم الكامل"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_full_name ? "border-red-500" : ""}`}
              />
              {errors.tenant_full_name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_full_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contract_number"
                className="text-sm font-medium text-gray-700"
              >
                رقم العقد <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contract_number"
                value={formData.contract_number}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    contract_number: e.target.value,
                  }));
                  if (errors.contract_number) {
                    setErrors((prev) => ({ ...prev, contract_number: "" }));
                  }
                }}
                placeholder="5454545454"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.contract_number ? "border-red-500" : ""}`}
              />
              {errors.contract_number && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.contract_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_phone"
                className="text-sm font-medium text-gray-700"
              >
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tenant_phone"
                value={formData.tenant_phone}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_phone: e.target.value,
                  }));
                  if (errors.tenant_phone) {
                    setErrors((prev) => ({ ...prev, tenant_phone: "" }));
                  }
                }}
                placeholder="0551234567"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_phone ? "border-red-500" : ""}`}
              />
              {errors.tenant_phone && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_email"
                className="text-sm font-medium text-gray-700"
              >
                البريد الإلكتروني
              </Label>
              <Input
                id="tenant_email"
                type="email"
                value={formData.tenant_email}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_email: e.target.value,
                  }));
                  if (errors.tenant_email) {
                    setErrors((prev) => ({ ...prev, tenant_email: "" }));
                  }
                }}
                placeholder="example@email.com"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_email ? "border-red-500" : ""}`}
              />
              {errors.tenant_email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_job_title"
                className="text-sm font-medium text-gray-700"
              >
                المهنة
              </Label>
              <Input
                id="tenant_job_title"
                value={formData.tenant_job_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_job_title: e.target.value,
                  }))
                }
                placeholder="مهندس، طبيب، معلم..."
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_social_status"
                className="text-sm font-medium text-gray-700"
              >
                الحالة الاجتماعية
              </Label>
              <Select
                value={formData.tenant_social_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_social_status: value,
                  }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">أعزب</SelectItem>
                  <SelectItem value="married">متزوج</SelectItem>
                  <SelectItem value="divorced">مطلق</SelectItem>
                  <SelectItem value="widowed">أرمل</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_national_id"
                className="text-sm font-medium text-gray-700"
              >
                رقم الهوية
              </Label>
              <Input
                id="tenant_national_id"
                value={formData.tenant_national_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_national_id: e.target.value,
                  }))
                }
                placeholder="1234567890"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
              تفاصيل العقد
            </h4>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                العقار <span className="text-red-500">*</span>
              </Label>
              <Popover
                open={openAvailableProperty && !loading}
                onOpenChange={setOpenAvailableProperty}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openAvailableProperty}
                    disabled={loading}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري التحميل...
                      </>
                    ) : formData.property_id ? (
                      availableProperties.find(
                        (property) =>
                          property.id.toString() === formData.property_id,
                      )?.title || `عقار ${formData.property_id}`
                    ) : (
                      "اختر عقار..."
                    )}
                    {!loading && (
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0 z-50"
                  side="bottom"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandInput
                      placeholder="ابحث عن عقار..."
                      disabled={loading}
                    />
                    <CommandList>
                      {loading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>جاري تحميل العقارات...</span>
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>
                            لا يوجد عقارات متاحة للإيجار
                          </CommandEmpty>
                          <CommandGroup>
                            {Array.isArray(availableProperties) &&
                              availableProperties.map((property) => (
                                <CommandItem
                                  key={property.id}
                                  value={property.id.toString()}
                                  className="cursor-pointer"
                                  onSelect={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      property_id: property.id.toString(),
                                      project_id:
                                        property.project?.id?.toString() || "",
                                    }));
                                    // تحديث العمارة والمشروع عند اختيار العقار
                                    setSelectedBuilding(
                                      property.building?.name || "",
                                    );
                                    setSelectedBuildingId(
                                      property.building?.id?.toString() || "",
                                    );
                                    setSelectedProject(
                                      property.project?.name || "",
                                    );
                                    setOpenAvailableProperty(false);
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      property_id: property.id.toString(),
                                      project_id:
                                        property.project?.id?.toString() || "",
                                    }));
                                    // تحديث العمارة والمشروع عند اختيار العقار
                                    setSelectedBuilding(
                                      property.building?.name || "",
                                    );
                                    setSelectedBuildingId(
                                      property.building?.id?.toString() || "",
                                    );
                                    setSelectedProject(
                                      property.project?.name || "",
                                    );
                                    setOpenAvailableProperty(false);
                                  }}
                                  onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      property_id: property.id.toString(),
                                      project_id:
                                        property.project?.id?.toString() || "",
                                    }));
                                    // تحديث العمارة والمشروع عند اختيار العقار
                                    setSelectedBuilding(
                                      property.building?.name || "",
                                    );
                                    setSelectedBuildingId(
                                      property.building?.id?.toString() || "",
                                    );
                                    setSelectedProject(
                                      property.project?.name || "",
                                    );
                                    setOpenAvailableProperty(false);
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      property_id: property.id.toString(),
                                      project_id:
                                        property.project?.id?.toString() || "",
                                    }));
                                    // تحديث العمارة والمشروع عند اختيار العقار
                                    setSelectedBuilding(
                                      property.building?.name || "",
                                    );
                                    setSelectedBuildingId(
                                      property.building?.id?.toString() || "",
                                    );
                                    setSelectedProject(
                                      property.project?.name || "",
                                    );
                                    setOpenAvailableProperty(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      formData.property_id ===
                                      property.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {property.title || `عقار ${property.id}`}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.property_number && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.property_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                المشروع
              </Label>
              <Input
                value={selectedProject}
                disabled
                placeholder="سيتم ملء هذا الحقل تلقائياً عند اختيار العقار"
                className="border-gray-300 bg-gray-50 text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                العمارة
              </Label>
              <Input
                value={selectedBuilding}
                disabled
                placeholder="سيتم ملء هذا الحقل تلقائياً عند اختيار العقار"
                className="border-gray-300 bg-gray-50 text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="move_in_date"
                className="text-sm font-medium text-gray-700"
              >
                تاريخ الانتقال <span className="text-red-500">*</span>
              </Label>
              <Input
                id="move_in_date"
                type="date"
                value={formData.move_in_date}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    move_in_date: e.target.value,
                  }));
                  if (errors.move_in_date) {
                    setErrors((prev) => ({ ...prev, move_in_date: "" }));
                  }
                }}
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.move_in_date ? "border-red-500" : ""}`}
              />
              {errors.move_in_date && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.move_in_date}
                </p>
              )}
            </div>

            {/* اسلوب الدفع - في الأعلى */}
            <div className="space-y-2">
              <Label
                htmlFor="paying_plan"
                className="text-sm font-medium text-gray-700"
              >
                اسلوب الدفع
              </Label>
              <Select
                value={formData.paying_plan}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, paying_plan: value }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="base_rent_amount"
                className="text-sm font-medium text-gray-700"
              >
                مبلغ الإيجار الاجمالي<span className="text-red-500">*</span>
              </Label>
              <Input
                id="base_rent_amount"
                type="number"
                value={formData.base_rent_amount}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    base_rent_amount: e.target.value,
                  }));
                  if (errors.base_rent_amount) {
                    setErrors((prev) => ({ ...prev, base_rent_amount: "" }));
                  }
                }}
                placeholder="6500"
                min="100"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.base_rent_amount ? "border-red-500" : ""}`}
              />
              <Label
                htmlFor="base_rent_amount"
                className={`text-xs font-medium transition-colors duration-500 ${
                  isRed ? "text-red-700" : "text-gray-700"
                }`}
              >
                اكتب إجمالي قيمة الإيجار عن كامل المدة، لا عن كل دفعة.
              </Label>
              {errors.base_rent_amount && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.base_rent_amount}
                </p>
              )}

              {/* حساب تقسيم مبلغ الإيجار على المدة */}
              {(() => {
                const calculation = calculatePaymentAmount();
                if (!calculation) return null;

                return (
                  <div className="text-sm bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-blue-800">
                        المبلغ {calculation.periodName}:{" "}
                        {calculation.paymentAmount.toLocaleString()}{" "}
                        {formData.currency || "ريال"}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-white px-3 py-2 rounded-md border border-blue-200">
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div>
                            <span className="text-gray-600">
                              المدة الإجمالية:
                            </span>
                            <span className="font-medium text-blue-800 block">
                              {calculation.totalMonths} شهر
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">عدد الدفعات:</span>
                            <span className="font-medium text-blue-800 block">
                              {calculation.paymentPeriods} دفعة
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-blue-600 bg-white px-2 py-1 rounded-md border">
                        <span className="font-medium">
                          {calculation.totalAmount.toLocaleString()} ÷{" "}
                          {calculation.paymentPeriods} ={" "}
                          {calculation.paymentAmount.toLocaleString()}{" "}
                          {formData.currency || "ريال"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* خيار الإيجار */}
            <div className="space-y-2">
              <Label
                htmlFor="rental_type"
                className="text-sm font-medium text-gray-700"
              >
                خيار الإيجار (نوع العقد) <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.rental_type}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    rental_type: value,
                  }));
                  if (errors.rental_type) {
                    setErrors((prev) => ({ ...prev, rental_type: "" }));
                  }
                }}
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue placeholder="اختر نوع الإيجار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                </SelectContent>
              </Select>
              {errors.rental_type && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.rental_type}
                </p>
              )}
            </div>

            {/* عدد الشهور أو السنوات */}
            <div className="space-y-2">
              <Label
                htmlFor="rental_duration"
                className="text-sm font-medium text-gray-700"
              >
                {formData.rental_type === "annual"
                  ? "عدد السنوات"
                  : "عدد الشهور"}{" "}
                (مدة العقد) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rental_duration"
                type="number"
                value={formData.rental_duration}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData((prev) => ({
                    ...prev,
                    rental_duration: value,
                  }));
                  if (errors.rental_duration) {
                    setErrors((prev) => ({ ...prev, rental_duration: "" }));
                  }
                }}
                placeholder={formData.rental_type === "annual" ? "1" : "12"}
                min="1"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.rental_duration ? "border-red-500" : ""}`}
              />
              {errors.rental_duration && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.rental_duration}
                </p>
              )}
              {formData.rental_duration && formData.rental_duration > 0 && (
                <div className="text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-800 font-medium">
                      المدة الإجمالية: {formData.rental_duration}{" "}
                      {formData.rental_type === "annual" ? "سنة" : "شهر"}
                      {formData.rental_type === "annual" && (
                        <span className="text-gray-600">
                          {" "}
                          ({formData.rental_duration * 12} شهر)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* مركز التكلفة */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
              مركز التكلفة
            </h4>
            <Button
              type="button"
              onClick={addCostCenterItem}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              إضافة تكلفة
            </Button>
          </div>

          {costCenterItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p>لا توجد تكاليف مضافة بعد</p>
              <p className="text-sm">
                اضغط على "إضافة تكلفة" لإضافة تكلفة جديدة
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {costCenterItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">
                      تكلفة #{index + 1}
                    </h5>
                    <Button
                      type="button"
                      onClick={() => removeCostCenterItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      variant="ghost"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* اسم التكلفة */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        اسم التكلفة *
                      </Label>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateCostCenterItem(item.id, "name", e.target.value)
                        }
                        placeholder="مثال: رسوم الصيانة"
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>

                    {/* التكلفة */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        التكلفة *
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.cost}
                        onChange={(e) =>
                          updateCostCenterItem(item.id, "cost", e.target.value)
                        }
                        placeholder="100.00"
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>

                    {/* نوع التكلفة */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        نوع التكلفة
                      </Label>
                      <Select
                        value={item.type}
                        onValueChange={(value) =>
                          updateCostCenterItem(item.id, "type", value)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                          <SelectItem value="percentage">نسبة مئوية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* من يدفع */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        من يدفع
                      </Label>
                      <Select
                        value={item.payer}
                        onValueChange={(value) =>
                          updateCostCenterItem(item.id, "payer", value)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant">المستأجر</SelectItem>
                          <SelectItem value="owner">المالك</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* تكرار الدفع */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        تكرار الدفع
                      </Label>
                      <Select
                        value={item.payment_frequency}
                        onValueChange={(value) =>
                          updateCostCenterItem(
                            item.id,
                            "payment_frequency",
                            value,
                          )
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">مرة واحدة</SelectItem>
                          <SelectItem value="per_installment">
                            لكل قسط
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* الوصف */}
                    <div className="space-y-2 md:col-span-2 lg:col-span-1">
                      <Label className="text-sm font-medium text-gray-700">
                        الوصف
                      </Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateCostCenterItem(
                            item.id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="وصف التكلفة..."
                        rows={2}
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            ملاحظات
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="ملاحظات إضافية حول العقد..."
            rows={3}
            className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  إضافة الإيجار
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </div>
  );
}
