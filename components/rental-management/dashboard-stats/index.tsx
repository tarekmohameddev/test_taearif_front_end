"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiHandTapLight } from "react-icons/pi";
import {
  CreditCard,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Home,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";
import { useDashboardData } from "./hooks";
import { formatCurrency } from "./utils";
import {
  OngoingRentalsDialog,
  ExpiringContractsDialog,
  PaymentsDueDialog,
  PaymentsOverdueDialog,
  MaintenanceOpenDialog,
  MaintenanceInProgressDialog,
} from "./components";
import { RentalDashboardStatsProps } from "./types";

export function RentalDashboardStats({
  collectionsPeriod = "this_month",
  collectionsFromDate = "",
  collectionsToDate = "",
  paymentsDuePeriod = "this_month",
  paymentsDueFromDate = "",
  paymentsDueToDate = "",
}: RentalDashboardStatsProps) {
  const {
    dashboardData,
    loading,
    error,
    isInitialized,
    openOngoingRentalsDialog,
  } = useRentalDashboardStore();

  // State للdialog المدفوعات المتأخرة
  const [isOverduePaymentsDialogOpen, setOverduePaymentsDialogOpen] =
    useState(false);
  const [activeOverdueTab, setActiveOverdueTab] = useState<
    "current" | "last" | "yearly"
  >("current");

  // State للdialog المستحقات
  const [isPaymentsDueDialogOpen, setPaymentsDueDialogOpen] = useState(false);
  const [activePaymentsTab, setActivePaymentsTab] = useState<
    "current" | "next" | "yearly"
  >("current");

  // استخدام hook لجلب البيانات
  const { fetchDashboardData } = useDashboardData({
    collectionsPeriod,
    collectionsFromDate,
    collectionsToDate,
    paymentsDuePeriod,
    paymentsDueFromDate,
    paymentsDueToDate,
    isInitialized,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchDashboardData}>
          <Loader2 className="ml-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات الإيجارات */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* بطاقة العقارات والإيجارات المدمجة */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group relative border-l-4 border-l-blue-500"
          onClick={openOngoingRentalsDialog}
        >
          <div className="absolute top-3 left-3 h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <PiHandTapLight
              className="h-3 w-3 text-gray-500"
              style={{
                animation: "scaleAnimation 1s ease-in-out 7",
                animationFillMode: "forwards",
              }}
            />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  العقارات والإيجارات
                </p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">
                    {dashboardData?.property_stats?.total_properties || 0}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            {/* تفاصيل العقارات */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  إجمالي الوحدات المعروضة للإيجار
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {dashboardData?.property_stats?.total_properties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">الوحدات المؤجرة</span>
                <span className="text-sm font-semibold text-green-600">
                  {dashboardData?.property_stats?.rented_properties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  الوحدات الغير مؤجرة
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {dashboardData?.property_stats?.available_properties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">معدل الإشغال</span>
                <span className="text-sm font-bold text-blue-600">
                  {dashboardData?.property_stats?.occupancy_rate || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* كارد الدفعات خلال الشهر الحالي والقادم */}
        <Card className="border-l-4 border-l-gray-600 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group relative">
          <CardContent
            className="p-6"
            onClick={() => setPaymentsDueDialogOpen(true)}
          >
            {/* العلامة في الزاوية السفلية اليسرى */}
            <div className="absolute top-3 left-3 h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <PiHandTapLight
                className="h-3 w-3 text-gray-500"
                style={{
                  animation: "scaleAnimation 1s ease-in-out 7",
                  animationFillMode: "forwards",
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  الدفعات المستحقة
                </p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-800">
                    {(dashboardData?.payments_due_current_month_details
                      ?.total_amount || 0) +
                      (dashboardData?.payments_due_next_month_details
                        ?.total_amount || 0) >
                    0
                      ? formatCurrency(
                          (dashboardData?.payments_due_current_month_details
                            ?.total_amount || 0) +
                            (dashboardData?.payments_due_next_month_details
                              ?.total_amount || 0),
                        )
                      : "0 ريال"}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>
            </div>

            {/* تفاصيل الدفعات */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">هذا الشهر</span>
                <span className="text-sm font-semibold text-gray-700">
                  {dashboardData?.payments_due_current_month_details
                    ?.total_amount
                    ? formatCurrency(
                        dashboardData.payments_due_current_month_details
                          .total_amount,
                      )
                    : "0 ريال"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">الشهر القادم</span>
                <span className="text-sm font-semibold text-gray-600">
                  {dashboardData?.payments_due_next_month_details?.total_amount
                    ? formatCurrency(
                        dashboardData.payments_due_next_month_details
                          .total_amount,
                      )
                    : "0 ريال"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">المدفوع هذا الشهر</span>
                <span className="text-sm font-semibold text-gray-700">
                  {dashboardData?.payments_due_current_month_details?.paid_amount
                    ? formatCurrency(
                        dashboardData.payments_due_current_month_details
                          .paid_amount,
                      )
                    : "0 ريال"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">غير مدفوع</span>
                <span className="text-sm font-bold text-gray-600">
                  {dashboardData?.payments_due_current_month_details
                    ?.unpaid_amount
                    ? formatCurrency(
                        dashboardData.payments_due_current_month_details
                          .unpaid_amount,
                      )
                    : "0 ريال"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* كارد المدفوعات المتأخرة */}
        <Card
          className={`border-l-4 ${(dashboardData?.overdue_payments_details?.total_overdue_count || 0) > 1 ? "border-l-red-500" : "border-l-gray-700"} cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group relative`}
        >
          <CardContent
            className="p-6"
            onClick={() => setOverduePaymentsDialogOpen(true)}
          >
            {/* العلامة في الزاوية السفلية اليسرى */}
            <div
              className={`absolute top-3 left-3 h-6 w-6 ${(dashboardData?.overdue_payments_details?.total_overdue_count || 0) > 1 ? "bg-red-100" : "bg-gray-200"} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
            >
              <PiHandTapLight
                className="h-3 w-3 text-gray-500"
                style={{
                  animation: "scaleAnimation 1s ease-in-out 7",
                  animationFillMode: "forwards",
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  المدفوعات المتأخرة
                </p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p
                    className={`text-2xl font-bold ${(dashboardData?.overdue_payments_details?.total_overdue_count || 0) > 1 ? "text-red-600" : "text-gray-800"}`}
                  >
                    {dashboardData?.overdue_payments_details
                      ?.total_overdue_count || 0}
                  </p>
                )}
              </div>
              <div
                className={`h-12 w-12 ${(dashboardData?.overdue_payments_details?.total_overdue_count || 0) > 1 ? "bg-red-50" : "bg-gray-200"} rounded-lg flex items-center justify-center`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${(dashboardData?.overdue_payments_details?.total_overdue_count || 0) > 1 ? "text-red-600" : "text-gray-700"}`}
                />
              </div>
            </div>

            {/* تفاصيل المدفوعات المتأخرة */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">إجمالي المبلغ</span>
                <span
                  className={`text-sm font-semibold ${(dashboardData?.overdue_payments_details?.total_overdue_count || 0) > 1 ? "text-red-600" : "text-gray-700"}`}
                >
                  {dashboardData?.overdue_payments_details?.total_overdue_amount
                    ? formatCurrency(
                        dashboardData.overdue_payments_details
                          .total_overdue_amount,
                      )
                    : "0 ريال"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">هذا الشهر</span>
                <span
                  className={`text-sm font-semibold ${(dashboardData?.overdue_payments_details?.current_month?.count || 0) > 0 ? "text-red-500" : "text-gray-600"}`}
                >
                  {dashboardData?.overdue_payments_details?.current_month
                    ?.count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">الشهر الماضي</span>
                <span className="text-sm font-semibold text-gray-500">
                  {dashboardData?.overdue_payments_details?.last_month?.count ||
                    0}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">هذه السنة</span>
                <span
                  className={`text-sm font-bold ${(dashboardData?.overdue_payments_details?.yearly_overview?.count || 0) > 0 ? "text-red-600" : "text-gray-800"}`}
                >
                  {dashboardData?.overdue_payments_details?.yearly_overview
                    ?.count || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog المدفوعات المتأخرة */}
      <Dialog
        open={isOverduePaymentsDialogOpen}
        onOpenChange={setOverduePaymentsDialogOpen}
      >
        <DialogContent
          className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              المدفوعات المتأخرة
            </DialogTitle>
            <DialogDescription>
              تفاصيل المدفوعات المتأخرة مقسمة حسب الفترة الزمنية
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveOverdueTab("current")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeOverdueTab === "current"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              هذا الشهر (
              {dashboardData?.overdue_payments_details?.current_month?.count ||
                0}
              )
            </button>
            <button
              onClick={() => setActiveOverdueTab("last")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeOverdueTab === "last"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              الشهر الماضي (
              {dashboardData?.overdue_payments_details?.last_month?.count || 0})
            </button>
            <button
              onClick={() => setActiveOverdueTab("yearly")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeOverdueTab === "yearly"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              هذه السنة (
              {dashboardData?.overdue_payments_details?.yearly_overview
                ?.count || 0}
              )
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeOverdueTab === "current" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  المدفوعات المتأخرة - هذا الشهر
                </h3>
                {dashboardData?.overdue_payments_details?.current_month
                  ?.payments?.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد مدفوعات متأخرة هذا الشهر
                    </h3>
                    <p className="text-gray-500">
                      جميع المدفوعات محدثة لهذا الشهر
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المستأجر
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            العقار
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المبلغ
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            تاريخ الاستحقاق
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الحالة
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.overdue_payments_details?.current_month?.payments?.map(
                          (payment: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {payment.tenant_name || "غير محدد"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {payment.tenant_phone || "غير محدد"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-900">
                                  {payment.property?.name || "عقار غير محدد"}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-red-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-900">
                                  {payment.due_date
                                    ? new Date(
                                        payment.due_date,
                                      ).toLocaleDateString("ar-US")
                                    : "غير محدد"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="destructive"
                                  className="bg-red-100 text-red-800"
                                >
                                  متأخر
                                </Badge>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeOverdueTab === "last" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  المدفوعات المتأخرة - الشهر الماضي
                </h3>
                {dashboardData?.overdue_payments_details?.last_month?.payments
                  ?.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد مدفوعات متأخرة الشهر الماضي
                    </h3>
                    <p className="text-gray-500">
                      جميع المدفوعات محدثة للشهر الماضي
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المستأجر
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            العقار
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المبلغ
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            تاريخ الاستحقاق
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الحالة
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.overdue_payments_details?.last_month?.payments?.map(
                          (payment: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {payment.tenant_name || "غير محدد"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {payment.tenant_phone || "غير محدد"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-900">
                                  {payment.property?.name || "عقار غير محدد"}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-red-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-900">
                                  {payment.due_date
                                    ? new Date(
                                        payment.due_date,
                                      ).toLocaleDateString("ar-US")
                                    : "غير محدد"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="destructive"
                                  className="bg-red-100 text-red-800"
                                >
                                  متأخر
                                </Badge>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeOverdueTab === "yearly" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  المدفوعات المتأخرة - هذه السنة
                </h3>
                {dashboardData?.overdue_payments_details?.yearly_overview
                  ?.payments?.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد مدفوعات متأخرة هذه السنة
                    </h3>
                    <p className="text-gray-500">
                      جميع المدفوعات محدثة لهذه السنة
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المستأجر
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            العقار
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المبلغ
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            تاريخ الاستحقاق
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الحالة
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.overdue_payments_details?.yearly_overview?.payments?.map(
                          (payment: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {payment.tenant_name || "غير محدد"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {payment.tenant_phone || "غير محدد"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-900">
                                  {payment.property?.name || "عقار غير محدد"}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-red-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-900">
                                  {payment.due_date
                                    ? new Date(
                                        payment.due_date,
                                      ).toLocaleDateString("ar-US")
                                    : "غير محدد"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="destructive"
                                  className="bg-red-100 text-red-800"
                                >
                                  متأخر
                                </Badge>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog المستحقات */}
      <Dialog
        open={isPaymentsDueDialogOpen}
        onOpenChange={setPaymentsDueDialogOpen}
      >
        <DialogContent
          className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              المستحقات المالية
            </DialogTitle>
            <DialogDescription>
              تفاصيل المستحقات مقسمة حسب الفترة الزمنية
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActivePaymentsTab("current")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activePaymentsTab === "current"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              هذا الشهر (
              {dashboardData?.payments_due_current_month_details?.count || 0})
            </button>
            <button
              onClick={() => setActivePaymentsTab("next")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activePaymentsTab === "next"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              الشهر القادم (
              {dashboardData?.payments_due_next_month_details?.count || 0})
            </button>
            <button
              onClick={() => setActivePaymentsTab("yearly")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activePaymentsTab === "yearly"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              هذه السنة (
              {dashboardData?.yearly_overview?.summary?.total_contracts || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activePaymentsTab === "current" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  المستحقات - هذا الشهر
                </h3>
                {dashboardData?.payments_due_current_month_details?.payments
                  ?.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد مستحقات هذا الشهر
                    </h3>
                    <p className="text-gray-500">
                      جميع المدفوعات محدثة لهذا الشهر
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المستأجر
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            العقار
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المبلغ
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            تاريخ الاستحقاق
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الأيام المتبقية
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الحالة
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.payments_due_current_month_details?.payments?.map(
                          (payment: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {payment.tenant_name || "غير محدد"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {payment.tenant_phone || "غير محدد"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-900">
                                  {payment.property?.name || "عقار غير محدد"}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-blue-600">
                                  {formatCurrency(
                                    payment.payment_details?.amount,
                                  )}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-900">
                                  {payment.payment_details?.due_date
                                    ? new Date(
                                        payment.payment_details.due_date,
                                      ).toLocaleDateString("ar-US")
                                    : "غير محدد"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`text-sm font-semibold ${
                                    (payment.days_remaining || 0) < 0
                                      ? "text-red-600"
                                      : (payment.days_remaining || 0) <= 7
                                        ? "text-orange-600"
                                        : "text-green-600"
                                  }`}
                                >
                                  {payment.days_remaining || 0} يوم
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    payment.payment_details?.payment_status ===
                                    "paid"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    payment.payment_details?.payment_status ===
                                    "paid"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-orange-100 text-orange-800"
                                  }
                                >
                                  {payment.payment_details?.payment_status ===
                                  "paid"
                                    ? "مدفوع"
                                    : "مستحق"}
                                </Badge>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activePaymentsTab === "next" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  المستحقات - الشهر القادم
                </h3>
                {dashboardData?.payments_due_next_month_details?.payments
                  ?.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد مستحقات الشهر القادم
                    </h3>
                    <p className="text-gray-500">
                      جميع المدفوعات محدثة للشهر القادم
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المستأجر
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            العقار
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            المبلغ
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            تاريخ الاستحقاق
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الأيام المتبقية
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">
                            الحالة
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.payments_due_next_month_details?.payments?.map(
                          (payment: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {payment.tenant_name || "غير محدد"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {payment.tenant_phone || "غير محدد"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-900">
                                  {payment.property?.name || "عقار غير محدد"}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(
                                    payment.payment_details?.amount,
                                  )}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-gray-900">
                                  {payment.payment_details?.due_date
                                    ? new Date(
                                        payment.payment_details.due_date,
                                      ).toLocaleDateString("ar-US")
                                    : "غير محدد"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`text-sm font-semibold ${
                                    (payment.days_remaining || 0) < 0
                                      ? "text-red-600"
                                      : (payment.days_remaining || 0) <= 7
                                        ? "text-orange-600"
                                        : "text-green-600"
                                  }`}
                                >
                                  {payment.days_remaining || 0} يوم
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    payment.payment_details?.payment_status ===
                                    "paid"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    payment.payment_details?.payment_status ===
                                    "paid"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {payment.payment_details?.payment_status ===
                                  "paid"
                                    ? "مدفوع"
                                    : "مستحق"}
                                </Badge>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activePaymentsTab === "yearly" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  المستحقات - هذه السنة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            إجمالي العقود
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {dashboardData?.yearly_overview?.summary
                              ?.total_contracts || 0}
                          </p>
                        </div>
                        <FileText className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            المبلغ المتوقع
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(
                              dashboardData?.yearly_overview?.summary
                                ?.total_expected || 0,
                            )}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            المبلغ المجمع
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(
                              dashboardData?.yearly_overview?.summary
                                ?.total_collected || 0,
                            )}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900">
                    ملخص سنوي
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          العقود النشطة:
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {dashboardData?.yearly_overview?.summary
                            ?.active_contracts || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          العقود المنتهية:
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          {dashboardData?.yearly_overview?.summary
                            ?.terminated_contracts || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          العقود المنتهية الصلاحية:
                        </span>
                        <span className="text-sm font-semibold text-orange-600">
                          {dashboardData?.yearly_overview?.summary
                            ?.expired_contracts || 0}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          المبلغ المعلق:
                        </span>
                        <span className="text-sm font-semibold text-orange-600">
                          {formatCurrency(
                            dashboardData?.yearly_overview?.summary
                              ?.total_pending || 0,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          المبلغ المتأخر:
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          {formatCurrency(
                            dashboardData?.yearly_overview?.summary
                              ?.total_overdue || 0,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          معدل التحصيل:
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {dashboardData?.yearly_overview?.summary
                            ?.collection_rate || 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <OngoingRentalsDialog />
      <ExpiringContractsDialog />
      <PaymentsDueDialog />
      <PaymentsOverdueDialog />
      <MaintenanceOpenDialog />
      <MaintenanceInProgressDialog />
    </div>
  );
}
