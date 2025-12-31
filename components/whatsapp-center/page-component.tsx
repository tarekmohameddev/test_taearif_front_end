"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  CreditCard,
  Power,
  PowerOff,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { WhatsappIcon } from "@/components/icons";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import PaymentPopup from "@/components/popup/PopupForWhatsapp";

interface WhatsAppNumber {
  id: number;
  phoneNumber: string;
  name: string | null;
  status: string;
  request_status: string;
  linkingMethod: string;
  apiMethod: string;
  requestId: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: number;
    name: string;
    email: string;
  };
}

interface WhatsAppPlan {
  id: number;
  name: string;
  price: number;
  duration: number;
  duration_unit: string;
  is_active: boolean;
}

interface WhatsAppResponse {
  success: boolean;
  data: {
    plans: WhatsAppPlan[];
    numbers: WhatsAppNumber[];
    quota: number;
    usage: number;
  };
}

interface RedirectResponse {
  success: boolean;
  redirect_url: string;
  mode: string;
  config_id: string;
}

interface AddonPurchaseResponse {
  status?: string;
  success?: boolean;
  redirect_url?: string;
  mode?: string;
  config_id?: string;
  data?: {
    whatsapp_number_id: number;
    plan_id: number;
    qty: number;
    amount: string;
    status: string;
    payment_ref: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
  payment_url?: string;
  message?: string;
  total_amount?: number;
  package_price?: number;
  period?: number;
  package_term?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
}

interface EmployeesResponse {
  current_page: number;
  data: Employee[];
  total: number;
}

export function WhatsAppCenterPage() {
  const [connectedNumbers, setConnectedNumbers] = useState<WhatsAppNumber[]>(
    [],
  );
  const [plans, setPlans] = useState<WhatsAppPlan[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [quota, setQuota] = useState(0);
  const [usage, setUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [numberToDelete, setNumberToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [togglingNumberId, setTogglingNumberId] = useState<number | null>(null);
  const [assignEmployeeDialogOpen, setAssignEmployeeDialogOpen] =
    useState(false);
  const [unlinkEmployeeDialogOpen, setUnlinkEmployeeDialogOpen] =
    useState(false);
  const [numberToUnlink, setNumberToUnlink] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedNumberId, setSelectedNumberId] = useState<string>("");
  const [assigningEmployee, setAssigningEmployee] = useState(false);
  const [unlinkingEmployee, setUnlinkingEmployee] = useState(false);
  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [addonId, setAddonId] = useState<number | undefined>(undefined);
  const { userData } = useAuthStore();

  // Fetch WhatsApp data function (reusable)
  const fetchWhatsAppData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // axiosInstance interceptor will automatically add the Authorization header
      const response = await axiosInstance.get<WhatsAppResponse>(
        "/api/whatsapp/addons/plans",
      );

      if (response.data.success && response.data.data) {
        const numbers = response.data.data.numbers || [];
        const plansData = response.data.data.plans || [];

        setConnectedNumbers(numbers);
        setPlans(plansData);

        setQuota(response.data.data.quota || 0);
        setUsage(response.data.data.usage || 0);
      } else {
        setError("فشل في تحميل البيانات");
      }
    } catch (err: any) {
      console.error("Error fetching WhatsApp data:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch WhatsApp data on component mount
  useEffect(() => {
    // Wait for userData to be available before making the request
    if (!userData?.token) {
      return;
    }

    fetchWhatsAppData();
  }, [userData?.token]);

  // Set default selected plan when plans are loaded
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      const activePlan = plans.find((plan) => plan.is_active) || plans[0];
      if (activePlan) {
        setSelectedPlan(activePlan.id);
      }
    }
  }, [plans, selectedPlan]);

  const handleFacebookLogin = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const response = await axiosInstance.get("/whatsapp/meta/redirect", {
        params: {
          mode: "existing",
        },
      });

      if (response.data.success && response.data.redirect_url) {
        // Open redirect URL in new tab
        window.open(response.data.redirect_url, "_blank");
      } else {
        setError("فشل في الحصول على رابط التوجيه");
      }
    } catch (err: any) {
      console.error("Error getting redirect URL:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء محاولة الربط");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeleteNumber = async (id: number) => {
    try {
      await axiosInstance.delete(`/whatsapp/${id}`);
      setConnectedNumbers((prev) => prev.filter((num) => num.id !== id));
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (err: any) {
      console.error("Error deleting number:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء حذف الرقم");
    } finally {
      setDeleteDialogOpen(false);
      setNumberToDelete(null);
    }
  };

  const confirmDelete = (id: number) => {
    setNumberToDelete(String(id));
    setDeleteDialogOpen(true);
  };

  const handleUnlinkNumber = async (id: number) => {
    try {
      setTogglingNumberId(id);
      setError(null);

      const response = await axiosInstance.post(`/whatsapp/${id}/unlink`);

      if (response.data.success) {
        // Refresh the numbers list
        const fetchResponse = await axiosInstance.get<WhatsAppResponse>(
          "/api/whatsapp/addons/plans",
        );
        if (fetchResponse.data.success && fetchResponse.data.data) {
          setConnectedNumbers(fetchResponse.data.data.numbers || []);
        }
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        setError("فشل في إلغاء تفعيل الرقم");
      }
    } catch (err: any) {
      console.error("Error unlinking number:", err);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء إلغاء تفعيل الرقم",
      );
    } finally {
      setTogglingNumberId(null);
    }
  };

  const handleActivateNumber = async (id: number) => {
    try {
      setTogglingNumberId(id);
      setError(null);

      // Count active numbers
      const activeNumbersCount = connectedNumbers.filter(
        (num) => num.status === "active",
      ).length;

      // Check if limit is reached
      if (activeNumbersCount >= quota) {
        // Limit reached, need to purchase addon
        if (!selectedPlan) {
          setError("يرجى اختيار خطة أولاً");
          setTogglingNumberId(null);
          return;
        }

        // Call the addon purchase API
        const response = await axiosInstance.post<AddonPurchaseResponse>(
          "/whatsapp/addons",
          {
            whatsapp_number_id: id,
            qty: 1,
            plan_id: selectedPlan,
            payment_method: "test",
          },
        );

        if (response.data.status === "success" || response.data.success) {
          if (response.data.payment_url) {
            // Open payment popup with iframe
            console.log("Payment response data:", response.data);
            console.log("Addon ID from response:", response.data.data?.id);
            setPaymentUrl(response.data.payment_url);
            setAddonId(response.data.data?.id);
            setPaymentPopupOpen(true);
          } else {
            // Refresh the numbers list
            const fetchResponse = await axiosInstance.get<WhatsAppResponse>(
              "/api/whatsapp/addons/plans",
            );
            if (fetchResponse.data.success && fetchResponse.data.data) {
              setConnectedNumbers(fetchResponse.data.data.numbers || []);
            }
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);
          }
        } else {
          setError("فشل في إنشاء طلب الشراء");
        }
      } else {
        // Limit not reached, use normal activation
        const response = await axiosInstance.post(`/whatsapp/${id}/link`);

        if (response.data.success) {
          // Refresh the numbers list
          const fetchResponse = await axiosInstance.get<WhatsAppResponse>(
            "/api/whatsapp/addons/plans",
          );
          if (fetchResponse.data.success && fetchResponse.data.data) {
            setConnectedNumbers(fetchResponse.data.data.numbers || []);
          }
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 5000);
        } else {
          setError("فشل في ربط الرقم");
        }
      }
    } catch (err: any) {
      console.error("Error activating number:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تفعيل الرقم");
    } finally {
      setTogglingNumberId(null);
    }
  };

  // Fetch employees when dialog opens
  useEffect(() => {
    if (assignEmployeeDialogOpen && userData?.token) {
      const fetchEmployees = async () => {
        try {
          setLoadingEmployees(true);
          const response =
            await axiosInstance.get<EmployeesResponse>("/v1/employees");
          if (response.data && response.data.data) {
            setEmployees(response.data.data);
          }
        } catch (err: any) {
          console.error("Error fetching employees:", err);
          setError(
            err.response?.data?.message || "حدث خطأ أثناء تحميل الموظفين",
          );
        } finally {
          setLoadingEmployees(false);
        }
      };
      fetchEmployees();
    }
  }, [assignEmployeeDialogOpen, userData?.token]);

  const handleAssignEmployee = async () => {
    if (!selectedNumberId || !selectedEmployeeId) {
      setError("يرجى اختيار الرقم والموظف");
      return;
    }

    try {
      setAssigningEmployee(true);
      setError(null);

      const response = await axiosInstance.patch(
        `/whatsapp/${selectedNumberId}/employee`,
        {
          employeeId:
            selectedEmployeeId === "none" ? null : Number(selectedEmployeeId),
        },
      );

      if (response.data.success) {
        // Refresh the numbers list
        const fetchResponse = await axiosInstance.get<WhatsAppResponse>(
          "/api/whatsapp/addons/plans",
        );
        if (fetchResponse.data.success && fetchResponse.data.data) {
          setConnectedNumbers(fetchResponse.data.data.numbers || []);
        }
        setAssignEmployeeDialogOpen(false);
        setSelectedEmployeeId("");
        setSelectedNumberId("");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        setError("فشل في ربط الرقم بالموظف");
      }
    } catch (err: any) {
      console.error("Error assigning employee:", err);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء ربط الرقم بالموظف",
      );
    } finally {
      setAssigningEmployee(false);
    }
  };

  const handleUnlinkEmployee = async () => {
    if (!numberToUnlink) {
      return;
    }

    try {
      setUnlinkingEmployee(true);
      setError(null);

      const response = await axiosInstance.patch(
        `/whatsapp/${numberToUnlink}/employee`,
        {
          employeeId: null,
        },
      );

      if (response.data.success) {
        // Refresh the numbers list
        const fetchResponse = await axiosInstance.get<WhatsAppResponse>(
          "/api/whatsapp/addons/plans",
        );
        if (fetchResponse.data.success && fetchResponse.data.data) {
          setConnectedNumbers(fetchResponse.data.data.numbers || []);
        }
        setUnlinkEmployeeDialogOpen(false);
        setNumberToUnlink(null);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        setError("فشل في فك الربط عن الموظف");
      }
    } catch (err: any) {
      console.error("Error unlinking employee:", err);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء فك الربط عن الموظف",
      );
    } finally {
      setUnlinkingEmployee(false);
    }
  };

  const handlePurchaseAddon = async () => {
    try {
      setIsPurchasing(true);
      setError(null);

      if (!selectedPlan) {
        setError("يرجى اختيار خطة أولاً");
        setIsPurchasing(false);
        return;
      }

      // Get first active WhatsApp number
      const firstActiveNumber = connectedNumbers.find(
        (num) => num.status === "active",
      );

      if (!firstActiveNumber) {
        setError("لا يوجد رقم واتساب نشط. يرجى إضافة رقم أولاً");
        setIsPurchasing(false);
        return;
      }

      // Call the addon purchase API
      const response = await axiosInstance.post<AddonPurchaseResponse>(
        "/whatsapp/addons",
        {
          whatsapp_number_id: firstActiveNumber.id,
          qty: 1,
          plan_id: selectedPlan,
          payment_method: "test",
        },
      );

      if (response.data.success && response.data.redirect_url) {
        // Redirect to payment gateway
        window.location.href = response.data.redirect_url;
      } else {
        setError("فشل في إنشاء طلب الشراء");
      }
    } catch (err: any) {
      console.error("Error purchasing addon:", err);
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء محاولة الشراء. يرجى المحاولة مرة أخرى",
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="whatsapp-center" />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                مركز الواتساب
              </h1>
              <p className="text-muted-foreground">
                قم بربط أرقام الواتساب الخاصة بك عبر فيسبوك بيزنس لإدارة الرسائل
                والتواصل مع العملاء
              </p>
            </div>

            {/* Success Alert */}
            {showSuccessAlert && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  تم الربط بنجاح!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  تم ربط رقم الواتساب الجديد بحسابك بنجاح. يمكنك الآن استخدامه
                  للتواصل مع العملاء.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الأرقام المسجلة
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : connectedNumbers.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    إجمالي الأرقام المسجلة
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الأرقام النشطة
                  </CardTitle>
                  <Power className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isLoading
                      ? "..."
                      : connectedNumbers.filter(
                          (num) => num.status === "active",
                        ).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    أرقام واتساب نشطة
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الرسائل المرسلة
                  </CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : totalMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">رسالة مرسلة</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الحد المسموح به
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : quota.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {`المستخدم: ${usage.toLocaleString()} من ${quota.toLocaleString()}`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    حالة الاتصال
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isLoading
                      ? "..."
                      : connectedNumbers.length > 0
                        ? "متصل"
                        : "غير متصل"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {connectedNumbers.length > 0
                      ? "جميع الأرقام تعمل بشكل طبيعي"
                      : "لا توجد أرقام متصلة"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Add New Number Card */}
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  إضافة رقم واتساب جديد
                </CardTitle>
                <CardDescription>
                  اربط رقم واتساب بيزنس جديد عبر حساب فيسبوك الخاص بك لبدء
                  التواصل مع العملاء
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>متطلبات الربط</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>
                        يجب ان يكون واتساب تطبيق اعمال حصرياً, وليس واتساب عادي
                      </li>
                      <li>حساب فيسبوك بيزنس مُفعّل</li>
                      <li>رقم هاتف غير مرتبط بحساب واتساب آخر</li>
                      <li>إمكانية استقبال رمز التحقق عبر SMS</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleFacebookLogin}
                  disabled={isConnecting}
                  className="w-full md:w-auto bg-[#1877F2] hover:bg-[#166FE5] text-white gap-2"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      جاري الربط...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      تسجيل الدخول عبر فيسبوك
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  بالنقر على الزر، ستتم إعادة توجيهك إلى فيسبوك لتسجيل الدخول
                  وربط حساب واتساب بيزنس الخاص بك.
                </p>
              </CardContent>
            </Card>

            {/* Connected Numbers Table */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <WhatsappIcon className="h-5 w-5 text-[#25D366]" />
                    الأرقام المتصلة
                  </CardTitle>
                  <CardDescription>
                    جميع أرقام الواتساب المرتبطة بحسابك
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                    <p>جاري تحميل البيانات...</p>
                  </div>
                ) : connectedNumbers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أرقام متصلة حالياً</p>
                    <p className="text-sm">قم بإضافة رقم واتساب جديد للبدء</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الهاتف</TableHead>
                        <TableHead className="text-right">
                          الاسم المعروض
                        </TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        {/* <TableHead className="text-right">حالة الطلب</TableHead> */}
                        <TableHead className="text-right">
                          تاريخ الربط
                        </TableHead>
                        <TableHead className="text-right">آخر تحديث</TableHead>
                        <TableHead className="text-right">
                          الموظف المسؤول
                        </TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connectedNumbers.map((number) => (
                        <TableRow key={number.id}>
                          <TableCell className="font-medium" dir="ltr">
                            {number.phoneNumber}
                          </TableCell>
                          <TableCell>{number.name || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                number.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                number.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : ""
                              }
                            >
                              {number.status === "active"
                                ? "نشط"
                                : number.status === "inactive"
                                  ? "غير نشط"
                                  : number.status === "not_linked"
                                    ? "غير مرتبط"
                                    : number.status}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <Badge
                              variant={
                                number.request_status === "active"
                                  ? "default"
                                  : number.request_status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={
                                number.request_status === "active"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : number.request_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : ""
                              }
                            >
                              {number.request_status === "active"
                                ? "نشط"
                                : number.request_status === "pending"
                                  ? "قيد الانتظار"
                                  : number.request_status}
                            </Badge>
                          </TableCell> */}
                          <TableCell>
                            {new Date(number.created_at).toLocaleDateString(
                              "ar-US",
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(number.updated_at).toLocaleDateString(
                              "ar-US",
                            )}
                          </TableCell>
                          <TableCell>
                            {number.employee
                              ? `${number.employee.name} (${number.employee.email})`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={togglingNumberId === number.id}
                                  >
                                    {togglingNumberId === number.id ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Settings className="h-4 w-4" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="rtl"
                                >
                                  {number.status === "active" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUnlinkNumber(number.id)
                                      }
                                      disabled={togglingNumberId === number.id}
                                      className="cursor-pointer"
                                    >
                                      <PowerOff className="h-4 w-4 ml-2" />
                                      إلغاء التفعيل
                                    </DropdownMenuItem>
                                  )}
                                  {number.employee ? (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setNumberToUnlink(number.id);
                                        setUnlinkEmployeeDialogOpen(true);
                                      }}
                                      className="cursor-pointer text-destructive"
                                    >
                                      <Settings className="h-4 w-4 ml-2" />
                                      فك الربط عن الموظف
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedNumberId(String(number.id));
                                        setAssignEmployeeDialogOpen(true);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Settings className="h-4 w-4 ml-2" />
                                      ربط بالموظف
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => confirmDelete(number.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {number.status !== "active" &&
                                (() => {
                                  const activeNumbersCount =
                                    connectedNumbers.filter(
                                      (num) => num.status === "active",
                                    ).length;
                                  const needsAddon =
                                    activeNumbersCount >= quota;

                                  return (
                                    <Button
                                      onClick={() =>
                                        handleActivateNumber(number.id)
                                      }
                                      disabled={togglingNumberId === number.id}
                                      className={
                                        needsAddon
                                          ? "bg-green-600 hover:bg-green-700 text-white gap-2"
                                          : "bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                      }
                                      size="default"
                                    >
                                      {togglingNumberId === number.id ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 animate-spin" />
                                          {needsAddon
                                            ? "جاري التفعيل..."
                                            : "جاري الربط..."}
                                        </>
                                      ) : (
                                        <>
                                          <Power className="h-4 w-4" />
                                          {needsAddon ? "تفعيل" : "ربط"}
                                        </>
                                      )}
                                    </Button>
                                  );
                                })()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Help Section */}
            {/* مخفي حالياً */}
            {/* <Card>
              <CardHeader>
                <CardTitle>هل تحتاج مساعدة؟</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="p-2 rounded-full bg-blue-100">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">دليل الإعداد</h4>
                      <p className="text-sm text-muted-foreground">تعرف على كيفية إعداد حساب واتساب بيزنس الخاص بك</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="p-2 rounded-full bg-green-100">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">الدعم الفني</h4>
                      <p className="text-sm text-muted-foreground">تواصل مع فريق الدعم للحصول على المساعدة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد فصل هذا الرقم؟ لن تتمكن من استقبال أو
              إرسال الرسائل عبره بعد الآن.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                numberToDelete && handleDeleteNumber(Number(numberToDelete))
              }
            >
              نعم، فصل الرقم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Employee Dialog */}
      <CustomDialog
        open={assignEmployeeDialogOpen}
        onOpenChange={setAssignEmployeeDialogOpen}
        maxWidth="max-w-md"
      >
        <CustomDialogContent>
          <CustomDialogClose
            onClose={() => setAssignEmployeeDialogOpen(false)}
          />
          <CustomDialogHeader>
            <CustomDialogTitle>ربط الرقم بالموظف</CustomDialogTitle>
          </CustomDialogHeader>
          <div className="space-y-4 p-4 sm:p-6">
            {/* Number Selection */}
            <div className="space-y-2">
              <Label htmlFor="number-select">اختر الرقم</Label>
              <Select
                value={selectedNumberId}
                onValueChange={setSelectedNumberId}
              >
                <SelectTrigger id="number-select">
                  <SelectValue placeholder="اختر الرقم" />
                </SelectTrigger>
                <SelectContent>
                  {connectedNumbers
                    .filter((num) => num.status === "active")
                    .map((number) => (
                      <SelectItem key={number.id} value={String(number.id)}>
                        {number.phoneNumber}{" "}
                        {number.name ? `- ${number.name}` : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employee-select">اختر الموظف</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
                disabled={loadingEmployees}
              >
                <SelectTrigger id="employee-select">
                  <SelectValue
                    placeholder={
                      loadingEmployees
                        ? "جاري تحميل الموظفين..."
                        : "اختر الموظف"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا يوجد موظف</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.first_name} {employee.last_name} (
                      {employee.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingEmployees && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  جاري تحميل الموظفين...
                </p>
              )}
            </div>

            {/* Assign Button */}
            <Button
              onClick={handleAssignEmployee}
              disabled={
                assigningEmployee ||
                !selectedNumberId ||
                !selectedEmployeeId ||
                selectedEmployeeId === "none" ||
                loadingEmployees ||
                employees.length < 1
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              size="lg"
            >
              {assigningEmployee ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  جاري الربط...
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5" />
                  ربط بالموظف
                </>
              )}
            </Button>
          </div>
        </CustomDialogContent>
      </CustomDialog>

      {/* Unlink Employee Confirmation Dialog */}
      <CustomDialog
        open={unlinkEmployeeDialogOpen}
        onOpenChange={setUnlinkEmployeeDialogOpen}
        maxWidth="max-w-md"
      >
        <CustomDialogContent>
          <CustomDialogClose
            onClose={() => setUnlinkEmployeeDialogOpen(false)}
          />
          <CustomDialogHeader>
            <CustomDialogTitle>تأكيد فك الربط</CustomDialogTitle>
          </CustomDialogHeader>
          <div className="space-y-4 p-4 sm:p-6">
            <p className="text-gray-700">
              هل أنت متأكد من رغبتك في فك الربط عن الموظف؟
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setUnlinkEmployeeDialogOpen(false);
                  setNumberToUnlink(null);
                }}
                disabled={unlinkingEmployee}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUnlinkEmployee}
                disabled={unlinkingEmployee}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {unlinkingEmployee ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    جاري فك الربط...
                  </>
                ) : (
                  "تأكيد فك الربط"
                )}
              </Button>
            </div>
          </div>
        </CustomDialogContent>
      </CustomDialog>

      {/* Payment Popup */}
      {paymentPopupOpen && (
        <PaymentPopup
          paymentUrl={paymentUrl}
          addonId={addonId}
          onClose={() => {
            setPaymentPopupOpen(false);
            setPaymentUrl("");
            setAddonId(undefined);
          }}
          onPaymentSuccess={() => {
            // Close popup first
            setPaymentPopupOpen(false);
            setPaymentUrl("");
            setAddonId(undefined);
            // Then refresh data with loading skeleton
            fetchWhatsAppData();
          }}
        />
      )}
    </div>
  );
}
