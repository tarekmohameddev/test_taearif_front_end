"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Calendar,
  Building2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Hash,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import useContractsStore from "@/context/store/contracts";

interface PaymentData {
  rental_id: number;
  contract_number: string;
  tenant_name: string;
  mobile_number: string;
  email: string | null;
  unit_information: {
    unit_id: number;
    unit_name: string;
    unit_address: string;
  };
  building: {
    building_id: number | null;
    building_name: string;
  };
  project: {
    project_id: number | null;
    project_name: string;
  };
  installment_info: {
    installment_id: number;
    sequence_no: number;
    amount: number;
    paid_amount: number;
    remaining_amount: number;
  };
  amount_to_be_paid: number;
  rental_method: string;
  arrears: {
    total_unpaid_amount: number;
    overdue_amount: number;
  };
  due_date: string;
  days_overdue: number;
  contract_info: {
    contract_id: number;
    start_date: string;
    end_date: string;
    status: string;
  };
  contract_expiration_date: string;
  payment_status: string;
}

export function ContractsService() {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);

  const {
    contractsData,
    buildings,
    loading,
    error,
    searchTerm,
    contractStatusFilter,
    paymentStatusFilter,
    rentalMethodFilter,
    buildingFilter,
    dateFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    totalRecords,
    setSearchTerm,
    setContractStatusFilter,
    setPaymentStatusFilter,
    setRentalMethodFilter,
    setBuildingFilter,
    setDateFilter,
    setCurrentPage,
    fetchContractsData,
    getFilteredData,
    formatCurrency,
    formatDate,
    getContractStatusColor,
    getContractStatusText,
    getPaymentStatusColor,
    getPaymentStatusText,
    goToPage,
    nextPage,
    prevPage,
    validateCurrentPage,
  } = useContractsStore();

  // جلب البيانات
  const fetchPaymentData = async () => {
    if (userData?.token) {
      await fetchContractsData();
      // التحقق من صحة الصفحة الحالية بعد جلب البيانات
      validateCurrentPage();
    }
  };

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    if (userData?.token) {
      fetchPaymentData();
    }
  }, [userData?.token]);

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    if (userData?.token) {
      fetchPaymentData();
    }
  }, [
    searchTerm,
    contractStatusFilter,
    paymentStatusFilter,
    rentalMethodFilter,
    buildingFilter,
    dateFilter,
    currentPage,
  ]);

  // فلترة البيانات
  const filteredData = getFilteredData();

  // Pagination Component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-between mt-6" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            صفحة {currentPage} من {totalPages}
          </span>
          <span className="text-sm text-gray-500">({totalRecords} سجل)</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ArrowRight className="h-4 w-4" />
            السابق
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            التالي
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchPaymentData}>
            <AlertTriangle className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">قائمة العقود</h2>
              <p className="text-gray-600 mt-1">
                جميع عقود الإيجار والمستأجرين
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="البحث في العقود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-status">حالة العقد</Label>
              <Select
                value={contractStatusFilter}
                onValueChange={setContractStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر حالة العقد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="expired">منتهي</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="terminated">ملغي/موقوف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-status">حالة الدفع</Label>
              <Select
                value={paymentStatusFilter}
                onValueChange={setPaymentStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر حالة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="pending">مستحق</SelectItem>
                  <SelectItem value="overdue">متأخر</SelectItem>
                  <SelectItem value="not_due">غير مستحق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rental-method">طريقة الإيجار</Label>
              <Select
                value={rentalMethodFilter}
                onValueChange={setRentalMethodFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الإيجار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطرق</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربعي</SelectItem>
                  <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">العمارة</Label>
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العمارة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المباني</SelectItem>
                  {buildings.map((building: any) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Modern Contracts Table */}
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            dir="rtl"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      المستأجر
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      الوحدة
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      العمارة
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      مبلغ الإيجار
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      طريقة الإيجار
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      تاريخ البدء
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      حالة العقد
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                      حالة الدفع
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          <span className="mr-2 text-gray-500">
                            جاري التحميل...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            لا توجد عقود للعرض
                          </h3>
                          <p className="text-gray-500 mb-4">
                            سيتم عرض العقود هنا عند توفر البيانات
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item: any, index: number) => (
                      <tr
                        key={`${item.contract_id}-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* المستأجر */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src=""
                                alt={
                                  item.tenant_information?.tenant_name ||
                                  "غير محدد"
                                }
                              />
                              <AvatarFallback>
                                {(
                                  item.tenant_information?.tenant_name ||
                                  "غير محدد"
                                ).charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.tenant_information?.tenant_name ||
                                  "غير محدد"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {item.tenant_information?.tenant_phone ||
                                  "غير محدد"}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* الوحدة */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.unit_information?.unit_name || "غير محدد"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {item.unit_information?.unit_address ||
                                "غير محدد"}
                            </div>
                          </div>
                        </td>
                        {/* العمارة */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.building?.building_name || "غير محدد"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.building?.building_address || "غير محدد"}
                            </div>
                          </div>
                        </td>
                        {/* مبلغ الإيجار */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.rent_amount || 0)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.currency || "SAR"}
                          </div>
                        </td>
                        {/* طريقة الإيجار */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {item.rental_method === "Monthly"
                              ? "شهري"
                              : item.rental_method === "Quarterly"
                                ? "ربعي"
                                : item.rental_method === "Semi-Annual"
                                  ? "نصف سنوي"
                                  : item.rental_method === "Annual"
                                    ? "سنوي"
                                    : item.rental_method || "غير محدد"}
                          </div>
                        </td>
                        {/* تاريخ البدء */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(item.lease_term?.start_date || "")}
                          </div>
                          <div className="text-xs text-gray-500">
                            انتهاء:{" "}
                            {formatDate(item.lease_term?.end_date || "")}
                          </div>
                        </td>
                        {/* حالة العقد */}
                        <td className="px-6 py-4">
                          <Badge
                            className={getContractStatusColor(
                              item.contract_status,
                            )}
                          >
                            {getContractStatusText(item.contract_status)}
                          </Badge>
                        </td>
                        {/* حالة الدفع */}
                        <td className="px-6 py-4">
                          <Badge
                            className={getPaymentStatusColor(
                              item.payment_status,
                            )}
                          >
                            {getPaymentStatusText(item.payment_status)}
                          </Badge>
                          {item.payment_details?.message && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.payment_details.message ===
                              "Payment not due yet"
                                ? "غير مستحق الآن"
                                : item.payment_details.message}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <PaginationComponent />

      {/* Dialogs will be added here */}
    </div>
  );
}
