"use client";

import { useState, useEffect } from "react";
import useStore from "@/context/Store";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Building2,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Settings,
  DollarSign,
  FileText,
  MapPin,
  Sparkles,
  TrendingUp,
  Activity,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface MaintenanceRequest {
  id: number;
  user_id: number;
  rental_id: number;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  estimated_cost: string;
  payer: "tenant" | "landlord" | "management";
  payer_share_percent: number;
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled";
  scheduled_date: string;
  assigned_to_vendor_id: number | null;
  attachments_count: number;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApiResponse {
  status: boolean;
  data: MaintenanceRequest[];
}

interface Property {
  id: number;
  region_id: number | null;
  payment_method: string | null;
  user_id: number;
  project_id: number | null;
  category_id: number | null;
  featured_image: string;
  floor_planning_image: string | null;
  video_image: string | null;
  price: string;
  pricePerMeter: string | null;
  purpose: string;
  type: string;
  beds: number;
  bath: number;
  area: string;
  video_url: string | null;
  virtual_tour: string | null;
  status: number;
  featured: number;
  features: string[] | null;
  faqs: any[];
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  reorder: number;
  reorder_featured: number;
}

interface Rental {
  id: number;
  user_id: number;
  property_number: string;
  unit_label: string;
  tenant_full_name: string;
  tenant_phone: string;
  tenant_email: string;
  tenant_job_title: string;
  tenant_social_status: string;
  tenant_national_id: string;
  base_rent_amount: string;
  currency: string;
  deposit_amount: string;
  move_in_date: string;
  paying_plan: string;
  rental_period_months: number;
  status: string;
  notes: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  active_contract: {
    id: number;
    user_id: number;
    rental_id: number;
    contract_number: string;
    start_date: string;
    end_date: string;
    status: string;
    termination_reason: string | null;
    file_path: string;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  property: Property | null;
}

interface RentalsApiResponse {
  status: boolean;
  data: {
    current_page: number;
    data: Rental[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface RentalMaintenanceServiceProps {
  openCreateDialogCounter?: number;
}

export function RentalMaintenanceService({
  openCreateDialogCounter = 0,
}: RentalMaintenanceServiceProps) {
  const { rentalMaintenance, setRentalMaintenance } = useStore();
  const {
    requests,
    loading,
    searchTerm,
    filterStatus,
    filterPriority,
    selectedRequest,
    isCreateRequestDialogOpen,
    rentals,
    rentalsLoading,
    stats,
    formData,
    requestsInitialized,
    rentalsInitialized,
    lastProcessedOpenCreateDialogCounter,
  } = rentalMaintenance;
  const userData = useAuthStore(selectUserData);

  // Open Create Maintenance Request dialog when requested by parent
  useEffect(() => {
    // Simplified logic: if counter > last processed, open dialog
    if (
      openCreateDialogCounter > 0 &&
      openCreateDialogCounter > lastProcessedOpenCreateDialogCounter
    ) {
      setRentalMaintenance({
        isCreateRequestDialogOpen: true,
        lastProcessedOpenCreateDialogCounter: openCreateDialogCounter,
      });
    } else if (
      lastProcessedOpenCreateDialogCounter === -1 &&
      openCreateDialogCounter >= 0
    ) {
      setRentalMaintenance({
        lastProcessedOpenCreateDialogCounter: openCreateDialogCounter,
      });
    }
  }, [
    openCreateDialogCounter,
    lastProcessedOpenCreateDialogCounter,
    setRentalMaintenance,
  ]);

  // Fetch rentals from API
  const fetchRentals = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log(
        "No token available, skipping fetchRentals in RentalMaintenanceService",
      );
      setRentalMaintenance({ rentalsLoading: false });
      return;
    }

    try {
      setRentalMaintenance({ rentalsLoading: true });

      const response =
        await axiosInstance.get<RentalsApiResponse>("/v1/rms/rentals");

      if (response.data.status) {
        setRentalMaintenance({
          rentals: response.data.data.data,
          rentalsInitialized: true,
        });
      } else {
        toast.error("فشل في تحميل العقارات المؤجرة");
      }
    } catch (error) {
      toast.error("حدث خطأ في تحميل العقارات المؤجرة");
    } finally {
      setRentalMaintenance({ rentalsLoading: false });
    }
  };

  // Fetch maintenance requests from API
  const fetchRequests = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log(
        "No token available, skipping fetchRequests in RentalMaintenanceService",
      );
      setRentalMaintenance({ loading: false });
      return;
    }

    try {
      setRentalMaintenance({ loading: true });

      const response = await axiosInstance.get<ApiResponse>(
        "/v1/rms/maintenance",
      );

      if (response.data.status) {
        setRentalMaintenance({
          requests: response.data.data,
          requestsInitialized: true,
        });

        // Calculate stats
        const data = response.data.data;
        const newStats = {
          total: data.length,
          open: data.filter((r) => r.status === "open").length,
          inProgress: data.filter((r) => r.status === "in_progress").length,
          completed: data.filter((r) => r.status === "completed").length,
          urgent: data.filter((r) => r.priority === "urgent").length,
        };
        setRentalMaintenance({ stats: newStats });
      } else {
        toast.error("فشل في تحميل البيانات");
      }
    } catch (error) {
      toast.error("حدث خطأ في تحميل طلبات الصيانة");
    } finally {
      setRentalMaintenance({ loading: false });
    }
  };

  // Refresh data function
  const refreshData = () => {
    fetchRequests();
    toast.success("تم تحديث البيانات بنجاح");
  };

  // Reset form data
  const resetForm = () => {
    setRentalMaintenance({
      formData: {
        rental_id: rentals.length > 0 ? rentals[0].id : 0,
        category: "",
        priority: "",
        title: "",
        description: "",
        estimated_cost: "",
        payer: "",
        payer_share_percent: 100,
        scheduled_date: "",
        assigned_to_vendor_id: null,
        notes: "",
      },
    });
  };

  // Create new maintenance request
  const createMaintenanceRequest = async () => {
    try {
      // Validate required fields
      if (
        !formData.rental_id ||
        !formData.category ||
        !formData.priority ||
        !formData.title ||
        !formData.description
      ) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }

      const requestData = {
        rental_id: formData.rental_id,
        category: formData.category,
        priority: formData.priority,
        title: formData.title,
        description: formData.description,
        estimated_cost: parseFloat(formData.estimated_cost) || 0,
        payer: formData.payer,
        payer_share_percent: formData.payer_share_percent,
        scheduled_date: formData.scheduled_date || null,
        assigned_to_vendor_id: formData.assigned_to_vendor_id,
        notes: formData.notes,
      };

      const response = await axiosInstance.post(
        "/v1/rms/maintenance",
        requestData,
      );

      if (response.data.status) {
        // Add the new request to the state
        setRentalMaintenance({ requests: [response.data.data, ...requests] });

        // Update stats
        const newRequest = response.data.data;
        setRentalMaintenance({
          stats: {
            total: stats.total + 1,
            open: stats.open + (newRequest.status === "open" ? 1 : 0),
            inProgress:
              stats.inProgress + (newRequest.status === "in_progress" ? 1 : 0),
            completed:
              stats.completed + (newRequest.status === "completed" ? 1 : 0),
            urgent: stats.urgent + (newRequest.priority === "urgent" ? 1 : 0),
          },
        });

        // Reset form
        resetForm();

        setRentalMaintenance({ isCreateRequestDialogOpen: false });
        toast.success("تم إضافة طلب الصيانة بنجاح");
      } else {
        toast.error("فشل في إضافة طلب الصيانة");
      }
    } catch (error) {
      toast.error("حدث خطأ في إضافة طلب الصيانة");
    }
  };

  useEffect(() => {
    if (!requestsInitialized && userData?.token) {
      fetchRequests();
    }
  }, [requestsInitialized, userData?.token]);

  const filteredRequests = requests.filter((request: MaintenanceRequest) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "assigned":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "in_progress":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "مفتوح";
      case "assigned":
        return "مُعيّن";
      case "in_progress":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "medium":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "high":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "urgent":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "منخفض";
      case "medium":
        return "متوسط";
      case "high":
        return "عالي";
      case "urgent":
        return "عاجل";
      default:
        return priority;
    }
  };

  const getCategoryText = (category: string) => {
    const categories: { [key: string]: string } = {
      AC: "تكييف",
      plumbing: "سباكة",
      electrical: "كهرباء",
      painting: "دهان",
      flooring: "أرضيات",
      doors_windows: "أبواب ونوافذ",
      appliances: "أجهزة",
      general: "عام",
    };
    return categories[category] || category;
  };

  const getPayerText = (payer: string) => {
    switch (payer) {
      case "tenant":
        return "المستأجر";
      case "landlord":
        return "المالك";
      case "management":
        return "الإدارة";
      default:
        return payer;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />;
      case "assigned":
        return <User className="h-4 w-4" />;
      case "in_progress":
        return <Settings className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Debug info

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header and Stats */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              طلبات الصيانة
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              إدارة ومتابعة طلبات الصيانة والإصلاحات
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={refreshData}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              <Activity className="h-4 w-4 mr-2" />
              تحديث
            </Button>
            <Dialog
              open={isCreateRequestDialogOpen}
              onOpenChange={(open) => {
                if (open) {
                  // Load rentals when dialog opens if not initialized
                  if (!rentalsInitialized) fetchRentals();
                } else {
                  resetForm();
                }
                setRentalMaintenance({ isCreateRequestDialogOpen: open });
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة طلب صيانة
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    إضافة طلب صيانة جديد
                  </DialogTitle>
                  <DialogDescription>
                    تسجيل طلب صيانة أو إصلاح للعقار
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Rental Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="rental">العقار</Label>
                    <Select
                      value={
                        rentalsLoading
                          ? "loading"
                          : formData.rental_id > 0
                            ? formData.rental_id.toString()
                            : ""
                      }
                      onValueChange={(value) => {
                        if (value !== "loading" && value !== "no-rentals") {
                          setRentalMaintenance({
                            formData: {
                              ...formData,
                              rental_id: parseInt(value),
                            },
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            rentalsLoading
                              ? "جاري التحميل..."
                              : "اختر العقار المؤجر"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {rentalsLoading ? (
                          <SelectItem value="loading" disabled>
                            جاري تحميل العقارات المؤجرة...
                          </SelectItem>
                        ) : rentals.length > 0 ? (
                          rentals.map((rental: Rental) => (
                            <SelectItem
                              key={rental.id}
                              value={rental.id.toString()}
                            >
                              {rental.unit_label} - {rental.tenant_full_name}{" "}
                              {rental.property
                                ? `(${rental.property.beds} غرف)`
                                : ""}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-rentals" disabled>
                            لا توجد عقارات مؤجرة متاحة
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">فئة الصيانة *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setRentalMaintenance({
                            formData: { ...formData, category: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">تكييف</SelectItem>
                          <SelectItem value="plumbing">سباكة</SelectItem>
                          <SelectItem value="electrical">كهرباء</SelectItem>
                          <SelectItem value="painting">دهان</SelectItem>
                          <SelectItem value="flooring">أرضيات</SelectItem>
                          <SelectItem value="doors_windows">
                            أبواب ونوافذ
                          </SelectItem>
                          <SelectItem value="appliances">أجهزة</SelectItem>
                          <SelectItem value="general">عام</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">الأولوية *</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setRentalMaintenance({
                            formData: { ...formData, priority: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الأولوية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="high">عالي</SelectItem>
                          <SelectItem value="urgent">عاجل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الطلب *</Label>
                    <Input
                      id="title"
                      placeholder="مثال: مشكلة في التكييف"
                      value={formData.title}
                      onChange={(e) =>
                        setRentalMaintenance({
                          formData: { ...formData, title: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف المشكلة *</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف تفصيلي للمشكلة أو الإصلاح المطلوب..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setRentalMaintenance({
                          formData: {
                            ...formData,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  {/* Cost and Payer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimated-cost">
                        التكلفة المتوقعة (ر.س)
                      </Label>
                      <Input
                        id="estimated-cost"
                        type="number"
                        placeholder="500"
                        value={formData.estimated_cost}
                        onChange={(e) =>
                          setRentalMaintenance({
                            formData: {
                              ...formData,
                              estimated_cost: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payer">يتحمل التكلفة</Label>
                      <Select
                        value={formData.payer}
                        onValueChange={(value) =>
                          setRentalMaintenance({
                            formData: { ...formData, payer: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="من يدفع؟" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="landlord">المالك</SelectItem>
                          <SelectItem value="tenant">المستأجر</SelectItem>
                          <SelectItem value="management">الإدارة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Payer Share Percent */}
                  <div className="space-y-2">
                    <Label htmlFor="payer-share">نسبة الدفع (%)</Label>
                    <Input
                      id="payer-share"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="100"
                      value={formData.payer_share_percent}
                      onChange={(e) =>
                        setRentalMaintenance({
                          formData: {
                            ...formData,
                            payer_share_percent:
                              parseInt(e.target.value) || 100,
                          },
                        })
                      }
                    />
                  </div>

                  {/* Scheduled Date */}
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-date">
                      موعد الصيانة (اختياري)
                    </Label>
                    <Input
                      id="scheduled-date"
                      type="datetime-local"
                      value={formData.scheduled_date}
                      onChange={(e) =>
                        setRentalMaintenance({
                          formData: {
                            ...formData,
                            scheduled_date: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات أو تفاصيل إضافية..."
                      rows={2}
                      value={formData.notes}
                      onChange={(e) =>
                        setRentalMaintenance({
                          formData: { ...formData, notes: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setRentalMaintenance({
                        isCreateRequestDialogOpen: false,
                      });
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={createMaintenanceRequest}>
                    إضافة الطلب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    إجمالي الطلبات
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-xs text-gray-500">
                    محمل: {requests.length}
                  </p>
                </div>
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    مفتوحة
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {stats.open}
                  </p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    قيد التنفيذ
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {stats.inProgress}
                  </p>
                </div>
                <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    مكتملة
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    عاجلة
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {stats.urgent}
                  </p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في طلبات الصيانة..."
            value={searchTerm}
            onChange={(e) =>
              setRentalMaintenance({ searchTerm: e.target.value })
            }
            className="pl-10 border-2 focus:border-gray-500 transition-colors"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => setRentalMaintenance({ filterStatus: v })}
        >
          <SelectTrigger className="w-full lg:w-48 border-2 focus:border-gray-500 transition-colors">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="open">مفتوح</SelectItem>
            <SelectItem value="assigned">مُعيّن</SelectItem>
            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterPriority}
          onValueChange={(v) => setRentalMaintenance({ filterPriority: v })}
        >
          <SelectTrigger className="w-full lg:w-48 border-2 focus:border-gray-500 transition-colors">
            <SelectValue placeholder="الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأولويات</SelectItem>
            <SelectItem value="low">منخفض</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">عالي</SelectItem>
            <SelectItem value="urgent">عاجل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      {filteredRequests.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 gap-2">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              تم العثور على {filteredRequests.length} طلب صيانة من أصل{" "}
              {requests.length}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            آخر تحديث: {new Date().toLocaleTimeString("ar-US")}
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request: MaintenanceRequest) => (
          <Card
            key={request.id}
            className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 group"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="space-y-4 flex-1 w-full">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                      #{request.id}
                    </h3>
                    <Badge
                      className={`${getStatusColor(request.status)} border text-xs sm:text-sm`}
                    >
                      {getStatusIcon(request.status)}
                      <span className="mr-1">
                        {getStatusText(request.status)}
                      </span>
                    </Badge>
                    <Badge
                      className={`${getPriorityColor(request.priority)} border text-xs sm:text-sm`}
                    >
                      {getPriorityText(request.priority)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-xs sm:text-sm"
                    >
                      {getCategoryText(request.category)}
                    </Badge>
                    {request.attachments_count > 0 && (
                      <Badge
                        variant="outline"
                        className="border-gray-300 text-gray-700 text-xs sm:text-sm"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {request.attachments_count} مرفق
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {request.title}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {request.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-gray-50 rounded-lg">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        <span className="font-medium text-gray-700">
                          التكلفة:
                        </span>
                        <span className="text-gray-900 font-bold">
                          {parseFloat(request.estimated_cost).toLocaleString()}{" "}
                          ر.س
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        <span className="font-medium text-gray-700">يدفع:</span>
                        <span className="text-gray-900">
                          {getPayerText(request.payer)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-gray-50 rounded-lg">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        <span className="font-medium text-gray-700">
                          تاريخ التقديم:
                        </span>
                        <span className="text-gray-900">
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-2">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 mt-0.5" />
                          <p className="text-xs sm:text-sm text-gray-800">
                            {request.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {request.scheduled_date && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                          <span className="text-xs sm:text-sm font-medium text-gray-800">
                            موعد الصيانة:
                          </span>
                          <span className="text-xs sm:text-sm text-gray-700">
                            {formatDateTime(request.scheduled_date)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 w-full lg:w-auto lg:mr-6">
                  <div className="text-right w-full lg:w-auto">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      آخر تحديث: {formatDateTime(request.updated_at)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setRentalMaintenance({ selectedRequest: request })
                      }
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      التفاصيل
                    </Button>
                    {request.status === "open" && (
                      <Button
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 w-full sm:w-auto"
                      >
                        تعيين فني
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Details Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setRentalMaintenance({ selectedRequest: null })}
      >
        <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              تفاصيل طلب الصيانة
            </DialogTitle>
            <DialogDescription>
              طلب رقم #{selectedRequest?.id} - {selectedRequest?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="details" className="text-xs sm:text-sm">
                  تفاصيل الطلب
                </TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs sm:text-sm">
                  الجدول الزمني
                </TabsTrigger>
                <TabsTrigger value="costs" className="text-xs sm:text-sm">
                  التكاليف
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs sm:text-sm">
                  الإجراءات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base sm:text-lg">
                      معلومات الطلب
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          رقم الطلب
                        </Label>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          #{selectedRequest.id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          العنوان
                        </Label>
                        <p className="text-sm sm:text-base text-gray-900">
                          {selectedRequest.title}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          الفئة
                        </Label>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs sm:text-sm"
                        >
                          {getCategoryText(selectedRequest.category)}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          الأولوية
                        </Label>
                        <Badge
                          className={`${getPriorityColor(selectedRequest.priority)} mt-1 text-xs sm:text-sm`}
                        >
                          {getPriorityText(selectedRequest.priority)}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          الحالة
                        </Label>
                        <Badge
                          className={`${getStatusColor(selectedRequest.status)} mt-1 text-xs sm:text-sm`}
                        >
                          {getStatusText(selectedRequest.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base sm:text-lg">
                      الوصف
                    </h4>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {selectedRequest.description}
                      </p>
                    </div>
                    {selectedRequest.notes && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                          ملاحظات
                        </h5>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs sm:text-sm text-gray-800">
                            {selectedRequest.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        تم إنشاء الطلب
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(selectedRequest.created_at)}
                      </p>
                    </div>
                  </div>

                  {selectedRequest.scheduled_date && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          موعد الصيانة المجدول
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(selectedRequest.scheduled_date)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">آخر تحديث</h4>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(selectedRequest.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="costs" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                          التكلفة المتوقعة
                        </h4>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {parseFloat(
                          selectedRequest.estimated_cost,
                        ).toLocaleString()}{" "}
                        ر.س
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                          يتحمل التكلفة
                        </h4>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {getPayerText(selectedRequest.payer)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        نسبة الدفع: {selectedRequest.payer_share_percent}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="text-center py-6 sm:py-8">
                  <Settings className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">
                    إجراءات الطلب
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    اختر الإجراء المناسب لحالة الطلب
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                    {selectedRequest.status === "open" && (
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto">
                        تعيين فني
                      </Button>
                    )}
                    {selectedRequest.status === "assigned" && (
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto">
                        بدء العمل
                      </Button>
                    )}
                    {selectedRequest.status === "in_progress" && (
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        إكمال الصيانة
                      </Button>
                    )}
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Phone className="mr-2 h-4 w-4" />
                      اتصال بالمستأجر
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setRentalMaintenance({ selectedRequest: null })}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredRequests.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="relative">
            <Wrench className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600 font-bold">
                {requests.length}
              </span>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-medium mb-2">
            لم يتم العثور على طلبات صيانة
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            {searchTerm || filterStatus !== "all" || filterPriority !== "all"
              ? "جرب تعديل معايير البحث"
              : requests.length === 0
                ? "لا توجد طلبات صيانة حالياً"
                : "لا توجد نتائج تطابق البحث"}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <Button
              onClick={() =>
                setRentalMaintenance({ isCreateRequestDialogOpen: true })
              }
              className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              إضافة طلب صيانة
            </Button>
            {(searchTerm ||
              filterStatus !== "all" ||
              filterPriority !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setRentalMaintenance({
                    searchTerm: "",
                    filterStatus: "all",
                    filterPriority: "all",
                  });
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
          {requests.length === 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">
                عدد الطلبات المحملة: {requests.length}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                عدد الطلبات المفلترة: {filteredRequests.length}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50">
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshData}
            className="bg-white shadow-lg border-gray-300 hover:bg-gray-50 h-10 w-10 sm:h-12 sm:w-12 p-0"
          >
            <Activity className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() =>
              setRentalMaintenance({ isCreateRequestDialogOpen: true })
            }
            className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg h-10 w-10 sm:h-12 sm:w-12 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
