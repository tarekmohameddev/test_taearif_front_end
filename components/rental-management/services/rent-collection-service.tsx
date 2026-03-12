"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Send,
  CreditCard,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface RentPayment {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantNameAr: string;
  tenantAvatar: string;
  unit: string;
  property: string;
  propertyAr: string;
  amount: number;
  dueDate: string;
  dueDateHijri: string;
  paidDate?: string;
  paidDateHijri?: string;
  status: "paid" | "pending" | "overdue" | "partial";
  statusAr: string;
  paymentMethod?: string;
  paymentMethodAr?: string;
  lateFee?: number;
  notes?: string;
  notesAr?: string;
}

interface CollectionSummary {
  totalExpected: number;
  totalCollected: number;
  totalOverdue: number;
  collectionRate: number;
  pendingPayments: number;
  overduePayments: number;
}

export function RentCollectionService() {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [summary, setSummary] = useState<CollectionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(
    null,
  );
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchRentData");
      return;
    }

    // Simulate API call to rent collection microservice
    const fetchRentData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockPayments: RentPayment[] = [
        {
          id: "1",
          tenantId: "1",
          tenantName: "Ahmed Al-Rashid",
          tenantNameAr: "أحمد الراشد",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          unit: "أ-204",
          property: "Al-Noor Residential Complex",
          propertyAr: "مجمع النور السكني",
          amount: 4500,
          dueDate: "2024-01-01",
          dueDateHijri: "1446/07/01",
          paidDate: "2024-01-01",
          paidDateHijri: "1446/07/01",
          status: "paid",
          statusAr: "مدفوع",
          paymentMethod: "Bank Transfer",
          paymentMethodAr: "تحويل بنكي",
          notes: "Paid on time",
          notesAr: "دُفع في الوقت المحدد",
        },
        {
          id: "2",
          tenantId: "2",
          tenantName: "Mohammed Al-Otaibi",
          tenantNameAr: "محمد العتيبي",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          unit: "ب-105",
          property: "Jeddah Towers",
          propertyAr: "أبراج جدة",
          amount: 6200,
          dueDate: "2024-01-01",
          dueDateHijri: "1446/07/01",
          status: "overdue",
          statusAr: "متأخر",
          lateFee: 200,
          notes: "5 days overdue",
          notesAr: "متأخر 5 أيام",
        },
        {
          id: "3",
          tenantId: "3",
          tenantName: "Sarah Al-Mansouri",
          tenantNameAr: "سارة المنصوري",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          unit: "ج-301",
          property: "Dammam Gardens",
          propertyAr: "حدائق الدمام",
          amount: 8500,
          dueDate: "2024-01-15",
          dueDateHijri: "1446/07/15",
          status: "pending",
          statusAr: "قيد الانتظار",
          notes: "Due in 10 days",
          notesAr: "مستحق خلال 10 أيام",
        },
        {
          id: "4",
          tenantId: "4",
          tenantName: "Khalid Al-Harbi",
          tenantNameAr: "خالد الحربي",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          unit: "د-102",
          property: "Makkah Heights",
          propertyAr: "مرتفعات مكة",
          amount: 3200,
          dueDate: "2024-01-01",
          dueDateHijri: "1446/07/01",
          paidDate: "2024-01-02",
          paidDateHijri: "1446/07/02",
          status: "partial",
          statusAr: "جزئي",
          paymentMethod: "Credit Card",
          paymentMethodAr: "بطاقة ائتمان",
          notes: "Partial payment of 2000 SAR",
          notesAr: "دفعة جزئية بقيمة 2000 ر.س",
        },
      ];

      setPayments(mockPayments);

      // Calculate summary
      const totalExpected = mockPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      );
      const totalCollected = mockPayments
        .filter((p) => p.status === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0);
      const totalOverdue = mockPayments
        .filter((p) => p.status === "overdue")
        .reduce(
          (sum, payment) => sum + payment.amount + (payment.lateFee || 0),
          0,
        );

      setSummary({
        totalExpected,
        totalCollected,
        totalOverdue,
        collectionRate: (totalCollected / totalExpected) * 100,
        pendingPayments: mockPayments.filter((p) => p.status === "pending")
          .length,
        overduePayments: mockPayments.filter((p) => p.status === "overdue")
          .length,
      });

      setLoading(false);
    };

    fetchRentData();
  }, [userData?.token]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.tenantNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyAr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      case "partial":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المتوقع
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.totalExpected.toLocaleString()} ر.س
              </div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المحصل
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.totalCollected.toLocaleString()} ر.س
              </div>
              <p className="text-xs text-muted-foreground">
                معدل التحصيل {summary.collectionRate.toFixed(1)}%
              </p>
              <Progress value={summary.collectionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المبلغ المتأخر
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {summary.totalOverdue.toLocaleString()} ر.س
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.overduePayments} دفعة متأخرة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الدفعات المعلقة
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {summary.pendingPayments}
              </div>
              <p className="text-xs text-muted-foreground">مستحقة هذا الشهر</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">تحصيل الإيجارات</h2>
          <p className="text-muted-foreground">تتبع وإدارة مدفوعات الإيجار</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
          <Dialog
            open={isRecordPaymentOpen}
            onOpenChange={setIsRecordPaymentOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                تسجيل دفعة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>تسجيل دفعة إيجار</DialogTitle>
                <DialogDescription>
                  تسجيل دفعة إيجار جديدة من مستأجر
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-select">المستأجر</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستأجر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        أحمد الراشد - الوحدة أ-204
                      </SelectItem>
                      <SelectItem value="2">
                        محمد العتيبي - الوحدة ب-105
                      </SelectItem>
                      <SelectItem value="3">
                        سارة المنصوري - الوحدة ج-301
                      </SelectItem>
                      <SelectItem value="4">
                        خالد الحربي - الوحدة د-102
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">المبلغ (ر.س)</Label>
                    <Input id="amount" type="number" placeholder="4500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-date">تاريخ الدفع</Label>
                    <Input id="payment-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">طريقة الدفع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطريقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="credit-card">بطاقة ائتمان</SelectItem>
                      <SelectItem value="check">شيك</SelectItem>
                      <SelectItem value="cash">نقداً</SelectItem>
                      <SelectItem value="stc-pay">STC Pay</SelectItem>
                      <SelectItem value="apple-pay">Apple Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" placeholder="ملاحظات إضافية..." />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRecordPaymentOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={() => setIsRecordPaymentOpen(false)}>
                  تسجيل الدفعة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الدفعات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="paid">مدفوع</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="overdue">متأخر</SelectItem>
            <SelectItem value="partial">جزئي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={payment.tenantAvatar || "/placeholder.svg"}
                      alt={payment.tenantNameAr}
                    />
                    <AvatarFallback>
                      {payment.tenantNameAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h3 className="font-semibold">{payment.tenantNameAr}</h3>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="mr-1">{payment.statusAr}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <span>
                        {payment.propertyAr} - الوحدة {payment.unit}
                      </span>
                      <span>مستحق: {payment.dueDateHijri}</span>
                      {payment.paidDateHijri && (
                        <span>دُفع: {payment.paidDateHijri}</span>
                      )}
                    </div>
                    {payment.notesAr && (
                      <p className="text-sm text-muted-foreground">
                        {payment.notesAr}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">
                    {payment.amount.toLocaleString()} ر.س
                    {payment.lateFee && (
                      <span className="text-sm text-red-600 mr-2">
                        +{payment.lateFee} ر.س غرامة
                      </span>
                    )}
                  </div>
                  {payment.paymentMethodAr && (
                    <p className="text-sm text-muted-foreground">
                      {payment.paymentMethodAr}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {payment.status === "overdue" && (
                      <Button size="sm" variant="outline">
                        <Send className="h-3 w-3 ml-1" />
                        إرسال تذكير
                      </Button>
                    )}
                    {payment.status !== "paid" && (
                      <Button size="sm">
                        <CreditCard className="h-3 w-3 ml-1" />
                        تسجيل دفعة
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على دفعات</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all"
              ? "جرب تعديل معايير البحث أو التصفية"
              : "لم يتم تسجيل دفعات إيجار بعد"}
          </p>
          <Button onClick={() => setIsRecordPaymentOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            تسجيل دفعة
          </Button>
        </div>
      )}
    </div>
  );
}
