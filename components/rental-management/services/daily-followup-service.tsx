"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
  Phone,
  Mail,
  Search,
  Filter,
  XCircle,
  User,
  Loader2,
  AlertCircle,
  Check,
  ChevronsUpDown,
  CreditCard,
  RotateCcw,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import useDailyFollowupStore from "@/context/store/dailyFollowup";
import toast from "react-hot-toast";

interface DailyFollowupServiceProps {
  openAddDialogCounter?: number;
}

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

export function DailyFollowupService() {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const isInitialMount = useRef(true);

  const {
    paymentData,
    buildings,
    loading,
    error,
    searchTerm,
    statusFilter,
    buildingFilter,
    dateFilter,
    fromDate,
    toDate,
    currentPage,
    itemsPerPage,
    totalPages,
    totalRecords,
    setSearchTerm,
    setStatusFilter,
    setBuildingFilter,
    setDateFilter,
    setFromDate,
    setToDate,
    setCurrentPage,
    fetchDailyFollowupData,
    getFilteredData,
    formatCurrency,
    formatDate,
    getStatusColor,
    getStatusText,
    goToPage,
    nextPage,
    prevPage,
    validateCurrentPage,
    resetFilters,
  } = useDailyFollowupStore();

  // جلب البيانات
  const fetchPaymentData = async () => {
    if (userData?.token) {
      await fetchDailyFollowupData();
      // التحقق من صحة الصفحة الحالية بعد جلب البيانات
      validateCurrentPage();
    }
  };

  // جلب البيانات عند التحميل الأولي فقط
  useEffect(() => {
    if (userData?.token && isInitialMount.current) {
      fetchPaymentData();
      isInitialMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.token]);

  // جلب البيانات عند تغيير الصفحة فقط (وليس عند التحميل الأولي)
  useEffect(() => {
    if (userData?.token && !isInitialMount.current) {
      fetchPaymentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchPaymentData}>
            <Loader2 className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            متابعة المستحقات المالية
          </h2>
          <p className="text-gray-600 mt-1">
            متابعة المستحقات والمدفوعات المتأخرة
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">البحث</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="ابحث عن مستأجر أو عقار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchPaymentData();
                      }
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">حالة الدفع</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">قادم</SelectItem>
                    <SelectItem value="overdue">متأخر</SelectItem>
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
              {/* Date inputs when custom is selected */}
              {dateFilter === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="from-date">من تاريخ</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-date">إلى تاريخ</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="building">العمارة</Label>
                <Select
                  value={buildingFilter}
                  onValueChange={setBuildingFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العمارة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المباني</SelectItem>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3 pt-2 border-t">
              <Button
                onClick={fetchPaymentData}
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                dir="rtl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 ml-2" />
                    بحث / تطبيق الفلاتر
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  resetFilters();
                  fetchPaymentData();
                }}
                variant="outline"
                className="w-full md:w-auto border-gray-300 hover:bg-gray-50"
                dir="rtl"
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Payments Table */}
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
                  المبلغ المستحق
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  تاريخ الاستحقاق
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  الحالة
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  المتأخرات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
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
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد مستحقات للعرض
                      </h3>
                      <p className="text-gray-500 mb-4">
                        سيتم عرض المستحقات المالية هنا عند توفر البيانات
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={`${item.rental_id}-${item.installment_info?.installment_id || index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src=""
                            alt={item.tenant_name || "غير محدد"}
                          />
                          <AvatarFallback>
                            {(item.tenant_name || "غير محدد").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.tenant_name || "غير محدد"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {item.mobile_number || "غير محدد"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.unit_information?.unit_name || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {item.unit_information?.unit_address || "غير محدد"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.building?.building_name || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.project?.project_name || "غير محدد"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount_to_be_paid || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(item.due_date || "")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(item.payment_status)}>
                        {getStatusText(item.payment_status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {(item.arrears?.total_unpaid_amount || 0) > 0 ? (
                          <span className="text-red-600 font-medium">
                            {formatCurrency(
                              item.arrears?.total_unpaid_amount || 0,
                            )}
                          </span>
                        ) : (
                          <span className="text-green-600">
                            لا توجد متأخرات
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <PaginationComponent />

      {/* Dialogs will be added here */}
    </div>
  );
}
