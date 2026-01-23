"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import {
  Search,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  Share2,
  Link2,
  Download,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";

export function AffiliateDashboardPage() {
  const {
    affiliateData: { data: dashboardData, loading },
    fetchAffiliateData,
  } = useStore();
  const { userData } = useAuthStore();

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      return;
    }
    fetchAffiliateData();
  }, [fetchAffiliateData, userData?.token]);

  // معالجة البيانات
  const referrals = dashboardData?.referrals || [];
  const paymentHistory = dashboardData?.payment_history || [];
  const stats = {
    totalCommissions: Number(dashboardData?.total_commissions || 0),
    totalReferrals: Number(dashboardData?.total_referrals || 0),
    paidSubscribers: Number(dashboardData?.paid_subscribers_count || 0),
    pendingPayments: Number(dashboardData?.pending_payments_count || 0),
    collectedPayments: Number(dashboardData?.collected_payments_count || 0),
    pendingAmount: Number(dashboardData?.pending_amount || 0),
    availableAmount: Number(dashboardData?.available_amount || 0),
    endOfMonthPayment: Number(dashboardData?.end_of_month_payment || 0),
  };
  const affiliateData = {
    referralCode: dashboardData?.referral_code,
    affiliateLink: dashboardData?.referral_code
      ? `https://taearif.com/register?ref=${dashboardData.referral_code}`
      : "-",
  };
  const currentBalance = {
    pending: Number(dashboardData?.pending_amount || 0),
    available: Number(dashboardData?.available_amount || 0),
    nextPaymentDate: dashboardData?.end_of_month_payment || "-",
    minimumPayout: 100.0,
  };

  // تصفية وترتيب المحالين
  const filteredAndSortedReferrals = referrals
    .filter((referral: any) => {
      const matchesSearch =
        (referral.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (referral.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || referral.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "date":
          aValue = new Date(a.joined_at);
          bValue = new Date(b.joined_at);
          break;
        case "amount":
          aValue =
            Number(a.collected_commission) + Number(a.pending_commission);
          bValue =
            Number(b.collected_commission) + Number(b.pending_commission);
          break;
        default:
          aValue = a.joined_at;
          bValue = b.joined_at;
      }
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`تم نسخ ${type} إلى الحافظة بنجاح`);
    } catch (err) {
      toast("حدث خطأ أثناء نسخ النص");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "رابط الإحالة الخاص بي",
          text: "انضم إلينا باستخدام رابط الإحالة الخاص بي",
          url: affiliateData.affiliateLink,
        });
      } catch (err) {
        // User cancelled sharing or error occurred
        copyToClipboard(affiliateData.affiliateLink, "الرابط");
      }
    } else {
      copyToClipboard(affiliateData.affiliateLink, "الرابط");
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 ml-1" />
            مدفوع
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 ml-1" />
            معلق
          </Badge>
        );
      case "unpaid":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="h-3 w-3 ml-1" />
            غير مدفوع
          </Badge>
        );
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getPaymentHistoryStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">قيد المعالجة</Badge>
        );
      case "failed":
        return <Badge className="bg-red-100 text-red-800">فشل</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Toaster position="top-center" />
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="affiliate" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-8">
              {/* Header Skeleton */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              {/* Stats Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              {/* Referral Code & Link Skeleton */}
              <Skeleton className="h-40 w-full" />
              {/* Referrals Table Skeleton */}
              <Skeleton className="h-16 w-1/2 mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-32 w-full" />
              {/* Payments Section Skeleton */}
              <Skeleton className="h-10 w-1/3 mb-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-10 w-1/4 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }
  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Toaster position="top-center" />
        <span className="text-lg text-destructive">تعذر تحميل البيانات</span>
      </div>
    );
  }

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="affiliate" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">لوحة تحكم الشريك</h1>
                <p className="text-muted-foreground">
                  تتبع أداءك وأرباحك من برنامج الشراكة
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-1" />
                  تصدير التقرير
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي الأرباح
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalCommissions} ريال
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    أرباح هذا الشهر
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.endOfMonthPayment} ريال
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Affiliate Link & Referral Code Section */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  رابط الإحالة وكود الشريك
                </CardTitle>
                <CardDescription>
                  استخدم هذا الرابط والكود لدعوة عملاء جدد وكسب العمولات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Referral Code */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      كود الإحالة الخاص بك
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      نشط
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-white border-2 border-primary/20 rounded-lg">
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-primary font-mono">
                        {affiliateData.referralCode}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          affiliateData.referralCode,
                          "كود الإحالة",
                        )
                      }
                      className="border-primary/20 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 ml-1" />
                      نسخ
                    </Button>
                  </div>
                </div>

                {/* Affiliate Link */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    رابط الإحالة الخاص بك
                  </h3>
                  <div className="flex items-center gap-2 p-4 bg-white border-2 border-primary/20 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-primary truncate">
                        {affiliateData.affiliateLink}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            affiliateData.affiliateLink,
                            "رابط الإحالة",
                          )
                        }
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <Copy className="h-4 w-4 ml-1" />
                        نسخ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareLink}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <Share2 className="h-4 w-4 ml-1" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referrals Section */}
            <Card>
              <CardHeader>
                <CardTitle>المحالين المسجلين</CardTitle>
                <CardDescription>
                  جميع المستخدمين الذين سجلوا من خلال روابطك
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="البحث بالاسم أو البريد الإلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="حالة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                      <SelectItem value="unpaid">غير مدفوع</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="ترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">تاريخ التسجيل</SelectItem>
                      <SelectItem value="name">الاسم</SelectItem>
                      <SelectItem value="email">البريد الإلكتروني</SelectItem>
                      <SelectItem value="amount">المبلغ</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                    {sortOrder === "asc" ? "تصاعدي" : "تنازلي"}
                  </Button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المحالين
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {stats.paidSubscribers}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      عملاء مدفوعين
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pendingPayments}
                    </p>
                    <p className="text-sm text-muted-foreground">دفعات معلقة</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {referrals
                        .reduce(
                          (sum: number, r: any) =>
                            sum +
                            Number(r.collected_commission) +
                            Number(r.pending_commission),
                          0,
                        )
                        .toFixed(2)}{" "}
                      ريال
                    </p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي العمولات
                    </p>
                  </div>
                </div>

                {/* Referrals Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">المستخدم</TableHead>
                          <TableHead className="text-right">
                            تاريخ التسجيل
                          </TableHead>
                          <TableHead className="text-right">المبلغ</TableHead>
                          <TableHead className="text-right">العمولة</TableHead>
                          <TableHead className="text-right">
                            حالة الدفع
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedReferrals.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              لا توجد نتائج مطابقة للبحث
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAndSortedReferrals.map((referral: any) => (
                            <TableRow key={referral.id}>
                              <TableCell className="font-medium">
                                {referral.name}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  {referral.joined_at}
                                </div>
                              </TableCell>
                              <TableCell>
                                {Number(referral.collected_commission) +
                                  Number(referral.pending_commission)}{" "}
                                ريال
                              </TableCell>
                              <TableCell className="font-medium text-green-600">
                                {Number(referral.collected_commission).toFixed(
                                  2,
                                )}{" "}
                                ريال
                              </TableCell>
                              <TableCell>
                                {getPaymentStatusBadge(referral.status)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 ml-1" />
                    تصدير البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payments Section */}
            <Card>
              <CardHeader>
                <CardTitle>المدفوعات والأرباح</CardTitle>
                <CardDescription>
                  تتبع مدفوعاتك والأرباح المعلقة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Balance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        الرصيد المعلق
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {currentBalance.pending} ريال
                      </div>
                      <p className="text-xs text-muted-foreground">
                        سيتم الدفع في {currentBalance.nextPaymentDate}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        الرصيد المتاح
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {currentBalance.available} ريال
                      </div>
                      <p className="text-xs text-muted-foreground">
                        متاح للسحب الآن
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        الدفعة التالية
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentBalance.nextPaymentDate}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        الدفع الشهري التلقائي
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment History */}
                <div>
                  <h3 className="font-medium mb-4">سجل المدفوعات</h3>
                  <div className="space-y-4">
                    {paymentHistory.map((payment: any) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.amount} ريال</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.type} • {payment.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getPaymentHistoryStatusBadge(payment.status)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {payment.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}
