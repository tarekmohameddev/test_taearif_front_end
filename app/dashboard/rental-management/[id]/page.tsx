"use client";

import { useState } from "react";
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
import toast from "react-hot-toast";
import type {
  RentalDetails,
  RentalPaymentItem,
} from "@/components/rental-management/rental-details-types";
import {
  formatCurrency,
  formatDate,
  getPaymentStatusColor,
  getPaymentStatusText,
  getPropertyNumber,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getUnitName,
} from "@/components/rental-management/rental-details-helpers";
import { useRentalDetails } from "@/app/dashboard/rental-management/hooks/useRentalDetails";
import { usePaymentReport } from "@/app/dashboard/rental-management/hooks/usePaymentReport";
import { useActualExpenses } from "@/app/dashboard/rental-management/hooks/useActualExpenses";
import { TenantInfoCard } from "@/components/rental-management/TenantInfoCard";
import { PropertyInfoCard } from "@/components/rental-management/PropertyInfoCard";
import { ContractDetailsCard } from "@/components/rental-management/ContractDetailsCard";
import { PaymentsList } from "@/components/rental-management/PaymentsList";
import { AddExpenseDialog } from "@/components/rental-management/AddExpenseDialog";
import { DeleteExpenseDialog } from "@/components/rental-management/DeleteExpenseDialog";

export default function RentalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rentalId = params?.id as string;

  const { openPaymentCollectionDialog } = useStore();

  const {
    details,
    loading,
    error,
    refetch: refetchRentalDetails,
  } = useRentalDetails(rentalId);
  const [activeTab, setActiveTab] = useState<string>("tenant");

  const {
    data: expensesData,
    loading: expensesLoading,
    error: expensesError,
    reset: resetExpensesReport,
  } = usePaymentReport({
    propertyId: details?.property?.id ?? null,
    enabled: activeTab === "expenses",
  });

  const {
    expenses: actualExpensesData,
    loading: actualExpensesLoading,
    error: actualExpensesError,
    refetch: refetchActualExpenses,
    isAddDialogOpen,
    openAddDialog,
    closeAddDialog,
    formData: expenseFormData,
    setFormData: setExpenseFormData,
    formSubmitting: expenseFormLoading,
    createExpense: handleCreateExpense,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    deleting: deleteExpenseLoading,
    expenseToDelete,
    deleteExpense: handleDeleteExpense,
  } = useActualExpenses({
    rentalId,
    enabled: activeTab === "actual-expenses",
  });

  // State for reversing payment
  const [reversingPaymentId, setReversingPaymentId] = useState<number | null>(
    null,
  );

  const handleOpenPaymentCollection = () => {
    if (rentalId) {
      openPaymentCollectionDialog(parseInt(rentalId, 10));
    }
  };

  const handleReversePayment = async (paymentId: number) => {
    if (!rentalId) return;

    const payment = details?.payment_details?.items?.find(
      (p: RentalPaymentItem) => p.id === paymentId,
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
        await refetchRentalDetails();
      } else {
        const errorCode = response.data.error_code;
        const errorMessage = response.data.message;

        if (errorCode === "INSTALLMENT_NOT_FOUND") {
          toast.error(
            `الدفعة #${paymentId} غير موجودة أو لا تنتمي لهذا الإيجار. يرجى تحديث الصفحة.`,
            { duration: 5000 },
          );
          await refetchRentalDetails();
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
        await refetchRentalDetails();
      } else if (error.response?.status === 404) {
        toast.error("الدفعة غير موجودة. يرجى تحديث الصفحة.", {
          duration: 5000,
        });
        await refetchRentalDetails();
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
                    onClick={refetchRentalDetails}
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
                  <TenantInfoCard rental={details.rental} />
                )}

                {activeTab === "property" && (
                  <PropertyInfoCard details={details} />
                )}

                {activeTab === "contract" && (
                  <ContractDetailsCard
                    rental={details.rental}
                    contract={details.contract}
                  />
                )}

                {activeTab === "payments" && (
                  <PaymentsList
                    payments={details.payment_details.items}
                    currency={details.rental.currency || "SAR"}
                    reversingPaymentId={reversingPaymentId}
                    onReverse={handleReversePayment}
                    onOpenPaymentCollection={handleOpenPaymentCollection}
                  />
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

            <AddExpenseDialog
              open={isAddDialogOpen}
              onOpenChange={(open) =>
                open ? openAddDialog() : closeAddDialog()
              }
              formState={expenseFormData}
              onFormChange={setExpenseFormData}
              loading={expenseFormLoading}
              onSubmit={handleCreateExpense}
            />

            <DeleteExpenseDialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) =>
                open ? openDeleteDialog(expenseToDelete!) : closeDeleteDialog()
              }
              expense={expenseToDelete}
              loading={deleteExpenseLoading}
              onConfirm={handleDeleteExpense}
            />
          </div>
        </main>
      </div>
  );
}
