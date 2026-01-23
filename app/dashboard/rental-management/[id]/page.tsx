"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaymentCollectionDialog } from "@/components/rental-management/payment-collection-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  MapPin,
  Hash,
  Loader2,
  RefreshCw,
  ClipboardList,
  Receipt,
  Trash2,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";

interface RentalDetails {
  rental: {
    rental_duration: number;
    id: number;
    tenant_full_name: string;
    tenant_phone: string;
    tenant_email: string;
    tenant_job_title: string;
    tenant_social_status: string;
    tenant_national_id: string;
    base_rent_amount: number;
    deposit_amount: number;
    currency: string;
    move_in_date: string;
    paying_plan: string;
    rental_period_months: number;
    status: string;
    notes: string;
    unit_name?: string;
    unit_label?: string;
    property_name?: string;
    project_name?: string;
    building_name?: string;
    property_number?: string;
    property_id?: number;
    project_id?: number;
    building_id?: number;
  };
  property: {
    id: number | null;
    name: string | null;
    unit_label?: string;
    property_number?: string;
    building?: {
      id: number | null;
      name: string | null;
    } | null;
    project: {
      id: number | null;
      name: string | null;
    };
  };
  contract: {
    id: number;
    contract_number: string;
    start_date: string;
    end_date: string;
    status: string;
    property_name?: string;
    project_name?: string;
    property_id?: number;
    project_id?: number;
  };
  payment_details: {
    items: Array<{
      id: number;
      sequence_no: number;
      due_date: string;
      amount: number;
      paid_amount: number;
      status: string;
      payment_type: string;
      payment_status: string;
      reference: string | null;
      paid_at: string | null;
      payment_id: number | null;
      can_reverse: boolean;
    }>;
  };
}

export default function RentalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rentalId = params?.id as string;

  const { openPaymentCollectionDialog } = useStore();
  const { userData } = useAuthStore();

  const [details, setDetails] = useState<RentalDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("tenant");
  const [sidebarActiveTab, setSidebarActiveTab] =
    useState<string>("rental-management");

  // States for expenses data
  const [expensesData, setExpensesData] = useState<any>(null);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);

  // States for actual expenses data
  const [actualExpensesData, setActualExpensesData] = useState<any>(null);
  const [actualExpensesLoading, setActualExpensesLoading] = useState(false);
  const [actualExpensesError, setActualExpensesError] = useState<string | null>(
    null,
  );

  // States for add expense dialog
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [expenseFormData, setExpenseFormData] = useState({
    expense_name: "",
    amount_type: "fixed",
    amount_value: "",
    cost_center: "tenant",
    is_active: true,
    image: null as File | null,
    image_path: "",
  });
  const [expenseFormLoading, setExpenseFormLoading] = useState(false);

  // States for delete expense dialog
  const [isDeleteExpenseDialogOpen, setIsDeleteExpenseDialogOpen] =
    useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);
  const [deleteExpenseLoading, setDeleteExpenseLoading] = useState(false);

  // State for reversing payment
  const [reversingPaymentId, setReversingPaymentId] = useState<number | null>(
    null,
  );

  // Fetch rental details when page loads
  useEffect(() => {
    if (rentalId && userData?.token) {
      fetchRentalDetails();
      setExpensesData(null);
      setExpensesError(null);
    }
  }, [rentalId, userData?.token]);

  // Fetch expenses data when expenses tab is active
  useEffect(() => {
    if (activeTab === "expenses" && details?.property?.id) {
      fetchExpensesData();
    }
  }, [activeTab, details?.property?.id]);

  // Fetch actual expenses data when actual-expenses tab is active
  useEffect(() => {
    if (activeTab === "actual-expenses" && rentalId) {
      fetchActualExpensesData();
    }
  }, [activeTab, rentalId]);

  // Helper function to get unit name from all possible locations
  const getUnitName = (details: RentalDetails | null): string => {
    if (!details) return "غير محدد";

    // 1. Check contract first
    if (details.contract?.property_name) {
      return details.contract.property_name;
    }
    if (details.contract?.project_name) {
      return details.contract.project_name;
    }

    // 2. Check property object
    if (details.property?.name) {
      return details.property.name;
    }
    if (details.property?.unit_label) {
      return details.property.unit_label;
    }
    if (details.property?.building?.name) {
      return details.property.building.name;
    }
    if (details.property?.project?.name) {
      return details.property.project.name;
    }

    // 3. Check rental object
    if (details.rental?.unit_name) {
      return details.rental.unit_name;
    }
    if (details.rental?.unit_label) {
      return details.rental.unit_label;
    }
    if (details.rental?.property_name) {
      return details.rental.property_name;
    }
    if (details.rental?.project_name) {
      return details.rental.project_name;
    }
    if (details.rental?.building_name) {
      return details.rental.building_name;
    }

    return "غير محدد";
  };

  // Helper function to get property number from all possible locations
  const getPropertyNumber = (details: RentalDetails | null): string => {
    if (!details) return "غير محدد";

    // 1. Check contract first
    if (details.contract?.property_id) {
      return String(details.contract.property_id);
    }
    if (details.contract?.project_id) {
      return String(details.contract.project_id);
    }

    // 2. Check property object
    if (details.property?.property_number) {
      return details.property.property_number;
    }
    if (details.property?.id) {
      return String(details.property.id);
    }
    if (details.property?.building?.id) {
      return String(details.property.building.id);
    }
    if (details.property?.project?.id) {
      return String(details.property.project.id);
    }

    // 3. Check rental object
    if (details.rental?.property_number) {
      return details.rental.property_number;
    }
    if (details.rental?.property_id) {
      return String(details.rental.property_id);
    }
    if (details.rental?.project_id) {
      return String(details.rental.project_id);
    }
    if (details.rental?.building_id) {
      return String(details.rental.building_id);
    }

    return "غير محدد";
  };

  const fetchRentalDetails = async () => {
    if (!rentalId) return;

    if (!userData?.token) {
      console.log("No token available, skipping fetchRentalDetails");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/rentals/${rentalId}/details`,
      );

      if (response.data.status) {
        setDetails(response.data.data);
      } else {
        setError("فشل في تحميل تفاصيل طلب الإيجار");
      }
    } catch (err: any) {
      console.error("Error fetching rental details:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل التفاصيل");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesData = async () => {
    if (!details?.property?.id) return;

    setExpensesLoading(true);
    setExpensesError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/payment-report?property_id=${details.property.id}`,
      );

      if (response.data.status) {
        setExpensesData(response.data.data);
      } else {
        setExpensesError("فشل في تحميل بيانات تقارير الدفع");
      }
    } catch (err: any) {
      console.error("Error fetching expenses data:", err);

      if (
        err.response?.data?.errors?.property_id?.includes(
          "The selected property id is invalid.",
        )
      ) {
        setExpensesError("العقار تم حذفه من النظام");
      } else {
        setExpensesError(
          err.response?.data?.message ||
            "حدث خطأ أثناء تحميل بيانات تقارير الدفع",
        );
      }
    } finally {
      setExpensesLoading(false);
    }
  };

  const fetchActualExpensesData = async () => {
    if (!rentalId) return;

    try {
      setActualExpensesLoading(true);
      setActualExpensesError(null);

      const response = await axiosInstance.get(
        `/v1/rms/rentals/${rentalId}/expenses`,
      );

      if (response.data.status) {
        setActualExpensesData(response.data.data);
      } else {
        setActualExpensesError("فشل في تحميل بيانات المصروفات");
      }
    } catch (err: any) {
      console.error("Error fetching actual expenses data:", err);
      setActualExpensesError(
        err.response?.data?.message || "حدث خطأ أثناء تحميل بيانات المصروفات",
      );
    } finally {
      setActualExpensesLoading(false);
    }
  };

  const uploadExpenseImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        "/v1/rms/expenses/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        return response.data.data.image_path;
      } else {
        throw new Error(response.data.message || "فشل في رفع الصورة");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      throw new Error(error.response?.data?.message || "فشل في رفع الصورة");
    }
  };

  const handleCreateExpense = async () => {
    if (!rentalId) return;

    try {
      setExpenseFormLoading(true);

      let imagePath = "";
      if (expenseFormData.image) {
        imagePath = await uploadExpenseImage(expenseFormData.image);
      }

      const expenseData = {
        expense_name: expenseFormData.expense_name,
        amount_type: expenseFormData.amount_type,
        amount_value: parseFloat(expenseFormData.amount_value),
        cost_center: expenseFormData.cost_center,
        is_active: expenseFormData.is_active,
        ...(imagePath && { image_path: imagePath }),
      };

      const response = await axiosInstance.post(
        `/v1/rms/rentals/${rentalId}/expenses`,
        expenseData,
      );

      if (response.data.status) {
        setIsAddExpenseDialogOpen(false);
        setExpenseFormData({
          expense_name: "",
          amount_type: "fixed",
          amount_value: "",
          cost_center: "tenant",
          is_active: true,
          image: null,
          image_path: "",
        });
        fetchActualExpensesData();
        toast.success("تم إضافة المصروف بنجاح");
      } else {
        toast.error(
          "فشل في إضافة المصروف: " + (response.data.message || "خطأ غير معروف"),
        );
      }
    } catch (error: any) {
      console.error("Error creating expense:", error);
      toast.error(
        "خطأ في إضافة المصروف: " +
          (error.response?.data?.message || error.message || "خطأ غير معروف"),
      );
    } finally {
      setExpenseFormLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!rentalId || !expenseToDelete?.id) return;

    try {
      setDeleteExpenseLoading(true);

      const response = await axiosInstance.delete(
        `/v1/rms/rentals/${rentalId}/expenses/${expenseToDelete.id}`,
      );

      if (response.data.status) {
        setIsDeleteExpenseDialogOpen(false);
        setExpenseToDelete(null);
        fetchActualExpensesData();
        toast.success("تم حذف المصروف بنجاح");
      } else {
        toast.error(
          "فشل في حذف المصروف: " + (response.data.message || "خطأ غير معروف"),
        );
      }
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      toast.error(
        "خطأ في حذف المصروف: " +
          (error.response?.data?.message || error.message || "خطأ غير معروف"),
      );
    } finally {
      setDeleteExpenseLoading(false);
    }
  };

  const openDeleteExpenseDialog = (expense: any) => {
    setExpenseToDelete(expense);
    setIsDeleteExpenseDialogOpen(true);
  };

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat("ar-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 ml-1" />;
      case "pending":
        return <Clock className="h-4 w-4 ml-1" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 ml-1" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 ml-1" />;
      default:
        return <AlertCircle className="h-4 w-4 ml-1" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (payment: any) => {
    if (payment.paid_amount >= payment.amount) {
      return "bg-green-100 text-green-800 border-green-200";
    }

    if (payment.status === "paid" || payment.status === "paid_in_full") {
      return "bg-green-100 text-green-800 border-green-200";
    }

    switch (payment.payment_status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "not_due":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusText = (payment: any) => {
    if (payment.paid_amount >= payment.amount) {
      return "مدفوع";
    }

    if (payment.status === "paid" || payment.status === "paid_in_full") {
      return "مدفوع";
    }

    switch (payment.payment_status) {
      case "pending":
        return "في الانتظار";
      case "overdue":
        return "متأخر";
      case "not_due":
        return "غير مستحق";
      default:
        return payment.payment_status;
    }
  };

  const handleOpenPaymentCollection = () => {
    if (rentalId) {
      openPaymentCollectionDialog(parseInt(rentalId));
    }
  };

  const handleReversePayment = async (paymentId: number) => {
    if (!rentalId) return;

    const payment = details?.payment_details?.items?.find(
      (p) => p.id === paymentId,
    );
    if (!payment) {
      toast.error("الدفعة غير موجودة في البيانات الحالية");
      return;
    }

    if (!payment.can_reverse) {
      toast.error("لا يمكن التراجع عن هذه الدفعة");
      return;
    }

    if (!payment.payment_id) {
      toast.error("معرف الدفعة غير موجود");
      return;
    }

    const paymentIdToUse = payment.payment_id;

    try {
      setReversingPaymentId(payment.id);

      const response = await axiosInstance.post(
        `/v1/rms/rentals/${rentalId}/payments/${paymentIdToUse}/reverse`,
      );

      if (response.data.status) {
        toast.success("تم التراجع عن الدفعة بنجاح");
        await fetchRentalDetails();
      } else {
        const errorCode = response.data.error_code;
        const errorMessage = response.data.message;

        if (errorCode === "INSTALLMENT_NOT_FOUND") {
          toast.error(
            `الدفعة #${paymentId} غير موجودة أو لا تنتمي لهذا الإيجار. يرجى تحديث الصفحة.`,
            { duration: 5000 },
          );
          await fetchRentalDetails();
        } else {
          toast.error(
            "فشل في التراجع عن الدفعة: " + (errorMessage || "خطأ غير معروف"),
          );
        }
      }
    } catch (error: any) {
      console.error("Error reversing payment:", error);

      const errorData = error.response?.data;
      const errorCode = errorData?.error_code;
      const errorMessage = errorData?.message;

      if (errorCode === "INSTALLMENT_NOT_FOUND") {
        const installmentId =
          errorData?.error_data?.installment_id || paymentId;
        toast.error(
          `الدفعة #${installmentId} غير موجودة أو لا تنتمي لهذا الإيجار. يرجى تحديث الصفحة.`,
          { duration: 5000 },
        );
        await fetchRentalDetails();
      } else if (error.response?.status === 404) {
        toast.error("الدفعة غير موجودة. يرجى تحديث الصفحة.", {
          duration: 5000,
        });
        await fetchRentalDetails();
      } else if (error.response?.status === 403) {
        toast.error("ليس لديك صلاحية للتراجع عن هذه الدفعة.", {
          duration: 5000,
        });
      } else {
        toast.error(
          "خطأ في التراجع عن الدفعة: " +
            (errorMessage || error.message || "خطأ غير معروف"),
        );
      }
    } finally {
      setReversingPaymentId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="w-full max-w-6xl mx-auto text-right" dir="rtl">
            {/* Header */}
            <div className="space-y-2 sm:space-y-4 text-right mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/rental-management")}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    العودة
                  </Button>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
                    تفاصيل طلب الإيجار
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  {details && details.rental && (
                    <Badge
                      className={`${getStatusColor(details.rental.status)} border`}
                    >
                      {getStatusIcon(details.rental.status)}
                      <span className="mr-1">
                        {getStatusText(details.rental.status)}
                      </span>
                    </Badge>
                  )}
                  <button
                    onClick={fetchRentalDetails}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8 sm:py-12 text-right">
                <span className="ml-2 text-sm sm:text-base text-gray-500">
                  جاري تحميل التفاصيل...
                </span>
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-8 sm:py-12 text-right">
                <span className="text-sm sm:text-base text-red-500">
                  {error}
                </span>
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2" />
              </div>
            )}

            {details && details.rental && details.property && !loading && (
              <div className="space-y-4 sm:space-y-6 text-right">
                {/* Custom Tabs Navigation */}
                <div className="w-full" dir="rtl">
                  <div
                    className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg"
                    dir="rtl"
                  >
                    <button
                      onClick={() => setActiveTab("tenant")}
                      className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                        activeTab === "tenant" ? "bg-white " : ""
                      }`}
                      dir="rtl"
                    >
                      <span className="hidden lg:inline">بيانات المستأجر</span>
                      <span className="lg:hidden">المستأجر</span>
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("property")}
                      className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                        activeTab === "property" ? "bg-white " : ""
                      }`}
                      dir="rtl"
                    >
                      <span className="hidden lg:inline">بيانات العقار</span>
                      <span className="lg:hidden">العقار</span>
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("contract")}
                      className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                        activeTab === "contract" ? "bg-white " : ""
                      }`}
                      dir="rtl"
                    >
                      <span className="hidden lg:inline">العقد</span>
                      <span className="lg:hidden">العقد</span>
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("payments")}
                      className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                        activeTab === "payments" ? "bg-white " : ""
                      }`}
                      dir="rtl"
                    >
                      <span className="hidden lg:inline">المدفوعات</span>
                      <span className="lg:hidden">المدفوعات</span>
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    {/* <button
                onClick={() => setActiveTab("expenses")}
                className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                  activeTab === "expenses" ? "bg-white " : ""
                }`}
                dir="rtl"
              >
                <span className="hidden lg:inline">تقارير الدفع</span>
                <span className="lg:hidden">تقارير الدفع</span>
                <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4" />
              </button> */}
                    {/* <button
                onClick={() => setActiveTab("actual-expenses")}
                className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                  activeTab === "actual-expenses" ? "bg-white " : ""
                }`}
                dir="rtl"
              >
                <span className="hidden lg:inline">المصروفات</span>
                <span className="lg:hidden">المصروفات</span>
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              </button> */}
                  </div>
                </div>

                {/* Tab Content - نفس المحتوى من الـ dialog */}
                {activeTab === "tenant" && (
                  <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle
                          className="flex items-center gap-2 text-right text-base sm:text-lg"
                          dir="rtl"
                        >
                          معلومات المستأجر
                          <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent
                        className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
                        dir="rtl"
                      >
                        <div
                          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                          dir="rtl"
                        >
                          <div className="space-y-1 text-right" dir="rtl">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                              {details.rental.tenant_full_name || "غير محدد"}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-right">
                              {details.rental.tenant_job_title || "غير محدد"}
                            </p>
                            <Badge
                              variant="outline"
                              className="w-fit text-xs sm:text-sm"
                            >
                              {details.rental.tenant_social_status === "married"
                                ? "متزوج"
                                : "أعزب"}
                            </Badge>
                          </div>
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                            <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-600 text-white text-lg sm:text-xl font-bold">
                              {details.rental.tenant_full_name
                                ? details.rental.tenant_full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                : "??"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <Separator />

                        <div
                          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
                          dir="rtl"
                        >
                          <div className="space-y-2 sm:space-y-3">
                            <div
                              className="flex items-center gap-2 sm:gap-3"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  رقم الهاتف
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-right">
                                  {details.rental.tenant_phone || "غير محدد"}
                                </p>
                              </div>
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </div>
                            <div
                              className="flex items-center gap-2 sm:gap-3"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  البريد الإلكتروني
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-right break-all">
                                  {details.rental.tenant_email || "غير محدد"}
                                </p>
                              </div>
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <div
                              className="flex items-center gap-2 sm:gap-3"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  رقم الهوية
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-right">
                                  {details.rental.tenant_national_id ||
                                    "غير محدد"}
                                </p>
                              </div>
                              <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </div>
                          </div>
                        </div>

                        {details.rental.notes && (
                          <>
                            <Separator />
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-2 text-right">
                                ملاحظات
                              </p>
                              <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg text-right">
                                {details.rental.notes}
                              </p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "property" && (
                  <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle
                          className="flex items-center gap-2 text-right text-base sm:text-lg"
                          dir="rtl"
                        >
                          معلومات العقار
                          <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent
                        className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
                        dir="rtl"
                      >
                        <div
                          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                          dir="rtl"
                        >
                          <div className="space-y-1 text-right" dir="rtl">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                              {getUnitName(details)}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-right">
                              الوحدة: {getUnitName(details)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 text-right">
                              رقم العقار: {getPropertyNumber(details)}
                            </p>
                          </div>
                          <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                            <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                        </div>

                        <Separator />

                        <div
                          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
                          dir="rtl"
                        >
                          <div className="space-y-2 sm:space-y-3">
                            <div
                              className="flex items-center gap-2 sm:gap-3"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  رقم العقار
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-right">
                                  {getPropertyNumber(details)}
                                </p>
                              </div>
                              <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </div>
                            <div
                              className="flex items-center gap-2 sm:gap-3"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  الوحدة
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-right">
                                  {getUnitName(details)}
                                </p>
                              </div>
                              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            {details.property.project?.name && (
                              <div
                                className="flex items-center gap-2 sm:gap-3"
                                dir="rtl"
                              >
                                <div className="text-right" dir="rtl">
                                  <p className="text-xs sm:text-sm text-gray-500 text-right">
                                    المشروع
                                  </p>
                                  <p className="text-sm sm:text-base font-semibold text-right">
                                    {details.property.project.name}
                                  </p>
                                </div>
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "contract" && (
                  <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle
                          className="flex items-center gap-2 text-right text-base sm:text-lg"
                          dir="rtl"
                        >
                          تفاصيل العقد
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent
                        className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
                        dir="rtl"
                      >
                        <div
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
                          dir="rtl"
                        >
                          <Badge
                            className={`${getStatusColor(details.contract?.status || "unknown")} border text-xs sm:text-sm`}
                          >
                            {getStatusIcon(
                              details.contract?.status || "unknown",
                            )}
                            <span className="mr-1">
                              {getStatusText(
                                details.contract?.status || "unknown",
                              )}
                            </span>
                          </Badge>
                          <div className="text-right" dir="rtl">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                              {details.contract?.contract_number || "غير محدد"}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-right">
                              رقم العقد
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div
                          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                          dir="rtl"
                        >
                          <div className="space-y-3 sm:space-y-4">
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                                مبلغ الإيجار الأساسي
                              </p>
                              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
                                {formatCurrency(
                                  details.rental.base_rent_amount || 0,
                                  details.rental.currency || "SAR",
                                )}
                              </p>
                            </div>
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                                مبلغ الضمان
                              </p>
                              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                                {formatCurrency(
                                  details.rental.deposit_amount || 0,
                                  details.rental.currency || "SAR",
                                )}
                              </p>
                            </div>
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                                خطة الدفع
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                {details.rental.paying_plan === "monthly"
                                  ? "شهري"
                                  : details.rental.paying_plan === "quarterly"
                                    ? "ربع سنوي"
                                    : details.rental.paying_plan ===
                                        "semi_annual"
                                      ? "نصف سنوي"
                                      : details.rental.paying_plan === "annual"
                                        ? "سنوي"
                                        : details.rental.paying_plan ||
                                          "غير محدد"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                                مدة الإيجار
                              </p>
                              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                                {details.rental.rental_duration || 0} شهر
                              </p>
                            </div>
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                                تاريخ بداية العقد
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                {details.contract?.start_date
                                  ? formatDate(details.contract.start_date)
                                  : "غير محدد"}
                              </p>
                            </div>
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                                تاريخ انتهاء العقد
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                {details.contract?.end_date
                                  ? formatDate(details.contract.end_date)
                                  : "غير محدد"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "payments" && (
                  <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                    {/* Payment Collection Button */}
                    <div className="flex justify-center mb-4">
                      <Button
                        onClick={handleOpenPaymentCollection}
                        className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-800 hover:border-gray-900"
                        dir="rtl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-lg font-bold">
                            دفع المستحقات
                          </span>
                          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </Button>
                    </div>

                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle
                          className="flex items-center gap-2 text-right text-base sm:text-lg"
                          dir="rtl"
                        >
                          جدول المدفوعات
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-right p-3 sm:p-6" dir="rtl">
                        <div className="space-y-3" dir="rtl">
                          {details.payment_details.items.map(
                            (payment, index) => (
                              <div
                                key={payment.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-4"
                                dir="rtl"
                              >
                                <div
                                  className="flex items-center gap-3 sm:gap-4"
                                  dir="rtl"
                                >
                                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                    {payment.sequence_no}
                                  </div>
                                  <div className="text-right" dir="rtl">
                                    <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                      الدفعة رقم {payment.sequence_no}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 text-right">
                                      مستحق في: {formatDate(payment.due_date)}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="flex items-center gap-3 sm:gap-4"
                                  dir="rtl"
                                >
                                  <div className="text-right" dir="rtl">
                                    <p className="text-sm sm:text-base font-bold text-gray-900 text-right">
                                      {formatCurrency(
                                        payment.amount,
                                        details.rental.currency || "SAR",
                                      )}
                                    </p>
                                    {payment.paid_amount > 0 && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs sm:text-sm text-green-600 text-right">
                                          مدفوع:{" "}
                                          {formatCurrency(
                                            payment.paid_amount,
                                            details.rental.currency || "SAR",
                                          )}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <Badge
                                    className={`${getPaymentStatusColor(payment)} border text-xs sm:text-sm`}
                                  >
                                    {getPaymentStatusText(payment)}
                                  </Badge>
                                  {payment.can_reverse === true && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleReversePayment(payment.id)
                                      }
                                      disabled={
                                        reversingPaymentId === payment.id
                                      }
                                      className="text-xs sm:text-sm h-6 sm:h-7 px-2 sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 "
                                      dir="rtl"
                                    >
                                      {reversingPaymentId === payment.id ? (
                                        <>
                                          <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                                          جاري...
                                        </>
                                      ) : (
                                        "تراجع"
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* {activeTab === "expenses" && (
            <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
              <Card>
                <CardContent className="text-right p-3 sm:p-6" dir="rtl">
                  {expensesLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-600">
                          جاري تحميل بيانات المدفوعات...
                        </p>
                      </div>
                    </div>
                  )}

                  {expensesError && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-600">{expensesError}</p>
                      </div>
                    </div>
                  )}

                  {expensesData && !expensesLoading && (
                    <div className="space-y-6">
                    Summary Cards
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">
                            إجمالي المتوقع
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(
                              expensesData.summary?.total_expected || 0,
                            )}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">
                            إجمالي المحصل
                          </p>
                          <p className="text-xl font-bold text-green-700">
                            {formatCurrency(
                              expensesData.summary?.total_collected || 0,
                            )}
                          </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">
                            إجمالي المتبقي
                          </p>
                          <p className="text-xl font-bold text-red-700">
                            {formatCurrency(
                              expensesData.summary?.total_outstanding || 0,
                            )}
                          </p>
                        </div>
                      </div>

                      {expensesData.properties?.map(
                        (property: any, propertyIndex: number) => (
                          <div key={propertyIndex} className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                              {property.rentals?.map(
                                (rental: any, rentalIndex: number) =>
                                  rental.payment_history?.length > 0 && (
                                    <div
                                      key={`history-${rentalIndex}`}
                                      className="border-t border-gray-200"
                                    >
                                      <div className="px-4 py-3 bg-gray-50">
                                        <h4 className="font-medium text-gray-900">
                                          سجل المدفوعات - {rental.tenant_name}
                                        </h4>
                                      </div>
                                      <div className="overflow-x-auto">
                                        <table className="w-full">
                                          <thead className="bg-gray-100">
                                            <tr>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                نوع الدفع
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                المبلغ
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                تاريخ الدفع
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                المرجع
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {rental.payment_history.map(
                                              (
                                                payment: any,
                                                paymentIndex: number,
                                              ) => (
                                                <tr
                                                  key={paymentIndex}
                                                  className="border-b border-gray-100"
                                                >
                                                  <td className="px-4 py-2 text-xs text-gray-900">
                                                    {payment.payment_type ===
                                                    "rent"
                                                      ? "إيجار"
                                                      : payment.payment_type}
                                                  </td>
                                                  <td className="px-4 py-2 text-xs font-medium text-gray-900">
                                                    {formatCurrency(
                                                      payment.amount,
                                                    )}
                                                  </td>
                                                  <td className="px-4 py-2 text-xs text-gray-600">
                                                    {new Date(
                                                      payment.payment_date,
                                                    ).toLocaleDateString(
                                                      "ar-US",
                                                    )}
                                                  </td>
                                                  <td className="px-4 py-2 text-xs text-gray-600">
                                                    {payment.reference ||
                                                      "غير محدد"}
                                                  </td>
                                                </tr>
                                              ),
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  ),
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {!expensesData && !expensesLoading && !expensesError && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <ClipboardList className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          لا توجد بيانات مدفوعات
                        </h3>
                        <p className="text-gray-600">
                          لم يتم العثور على أي بيانات مدفوعات لهذا العقار
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )} */}

                {/* {activeTab === "actual-expenses" && (
            <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsAddExpenseDialogOpen(true)}
                  className="bg-black hover:scale-105 transition-all duration-300 text-white"
                >
                  <FileText className="ml-2 h-4 w-4" />
                  إضافة مصروف
                </Button>
              </div>

              <Card>
                <CardContent className="text-right p-3 sm:p-6" dir="rtl">
                  {actualExpensesLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-600">
                          جاري تحميل بيانات المصروفات...
                        </p>
                      </div>
                    </div>
                  )}

                  {actualExpensesError && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-600">{actualExpensesError}</p>
                      </div>
                    </div>
                  )}

                  {actualExpensesData &&
                    actualExpensesData.length > 0 &&
                    !actualExpensesLoading && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          {actualExpensesData.map(
                            (expense: any, index: number) => (
                              <div
                                key={expense.id || index}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                      {expense.expense_name}
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        {formatCurrency(
                                          expense.calculated_amount,
                                        )}
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          expense.amount_type === "fixed"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {expense.amount_type === "fixed"
                                          ? "ثابت"
                                          : "متغير"}
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          expense.cost_center === "tenant"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-purple-100 text-purple-800"
                                        }`}
                                      >
                                        {expense.cost_center === "tenant"
                                          ? "المستأجر"
                                          : "المالك"}
                                      </span>
                                    </div>
                                  </div>

                                  {expense.image_url && (
                                    <div className="ml-4">
                                      <img
                                        src={expense.image_url}
                                        alt={expense.expense_name}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <span>
                                    تم الإنشاء:{" "}
                                    {new Date(
                                      expense.created_at,
                                    ).toLocaleDateString("ar-US")}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        expense.is_active
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {expense.is_active ? "نشط" : "غير نشط"}
                                    </span>
                                    {expense.can_be_modified && (
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        قابل للتعديل
                                      </span>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        openDeleteExpenseDialog(expense)
                                      }
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                    >
                                      <Trash2 className="h-3 w-3 ml-1" />
                                      إزالة
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {(!actualExpensesData ||
                    actualExpensesData.length === 0) &&
                    !actualExpensesLoading &&
                    !actualExpensesError && (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            لا توجد مصروفات
                          </h3>
                          <p className="text-gray-600">
                            لم يتم العثور على أي مصروفات لهذا العقد
                          </p>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          )} */}
              </div>
            )}

            {/* Payment Collection Dialog */}
            <PaymentCollectionDialog />

            {/* Add Expense Dialog */}
            <Dialog
              open={isAddExpenseDialogOpen}
              onOpenChange={setIsAddExpenseDialogOpen}
            >
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>إضافة مصروف جديد</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense_name">
                      اسم المصروف <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expense_name"
                      value={expenseFormData.expense_name}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          expense_name: e.target.value,
                        })
                      }
                      placeholder="مثال: تكييف الهواء"
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount_type">
                      نوع المبلغ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={expenseFormData.amount_type}
                      onValueChange={(value) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          amount_type: value,
                        })
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">ثابت</SelectItem>
                        <SelectItem value="percentage">نسبة مئوية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount_value">
                      قيمة المبلغ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount_value"
                      type="number"
                      step="0.01"
                      value={expenseFormData.amount_value}
                      onChange={(e) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          amount_value: e.target.value,
                        })
                      }
                      placeholder={
                        expenseFormData.amount_type === "fixed"
                          ? "150.00"
                          : "5.0"
                      }
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500">
                      {expenseFormData.amount_type === "fixed"
                        ? "أدخل المبلغ بالريال"
                        : "أدخل النسبة المئوية (مثال: 5.0 لـ 5%)"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost_center">
                      مركز التكلفة <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={expenseFormData.cost_center}
                      onValueChange={(value) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          cost_center: value,
                        })
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

                  <div className="space-y-2">
                    <Label htmlFor="expense_image">صورة المصروف</Label>
                    <Input
                      id="expense_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setExpenseFormData({
                            ...expenseFormData,
                            image: file,
                          });
                        }
                      }}
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500">
                      اختر صورة للمصروف (اختياري)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">نشط</Label>
                    <Switch
                      id="is_active"
                      checked={expenseFormData.is_active}
                      onCheckedChange={(checked) =>
                        setExpenseFormData({
                          ...expenseFormData,
                          is_active: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddExpenseDialogOpen(false)}
                    disabled={expenseFormLoading}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleCreateExpense}
                    disabled={
                      expenseFormLoading ||
                      !expenseFormData.expense_name ||
                      !expenseFormData.amount_value
                    }
                    className="bg-black hover:scale-105 transition-all duration-300 text-white"
                  >
                    {expenseFormLoading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الإضافة...
                      </>
                    ) : (
                      "إضافة المصروف"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Expense Dialog */}
            <Dialog
              open={isDeleteExpenseDialogOpen}
              onOpenChange={setIsDeleteExpenseDialogOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-red-600">
                    تأكيد حذف المصروف
                  </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="text-right" dir="rtl">
                      <p className="text-gray-900 font-medium mb-2">
                        هل أنت متأكد من حذف هذا المصروف؟
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        سيتم حذف المصروف:{" "}
                        <span className="font-semibold text-gray-900">
                          {expenseToDelete?.expense_name}
                        </span>
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800 font-medium">
                          ⚠️ تحذير: لا يمكن التراجع عن هذا الإجراء
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteExpenseDialogOpen(false)}
                    disabled={deleteExpenseLoading}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleDeleteExpense}
                    disabled={deleteExpenseLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteExpenseLoading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحذف...
                      </>
                    ) : (
                      <>
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف المصروف
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
  );
}
