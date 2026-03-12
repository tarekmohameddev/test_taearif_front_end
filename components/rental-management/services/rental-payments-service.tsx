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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Calendar,
  Building2,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Receipt,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface RentalPayment {
  id: string;
  paymentNumber: string;
  contractId: string;
  contractNumber: string;
  propertyTitle: string;
  propertyTitleAr: string;
  tenant: {
    name: string;
    nameAr: string;
    phone: string;
    email: string;
  };
  paymentDetails: {
    amount: number;
    dueDate: string;
    dueDateHijri: string;
    paidDate?: string;
    paidDateHijri?: string;
    paymentMethod: string;
    paymentMethodAr: string;
    transactionId?: string;
    receiptNumber?: string;
  };
  status: "pending" | "paid" | "overdue" | "partial" | "cancelled";
  statusAr: string;
  paymentType: "rent" | "deposit" | "commission" | "late_fee" | "maintenance";
  paymentTypeAr: string;
  notes: string;
  notesAr: string;
  createdDate: string;
  createdDateHijri: string;
  lateFee?: number;
  daysOverdue?: number;
}

export function RentalPaymentsService() {
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<RentalPayment | null>(
    null,
  );
  const [isRecordPaymentDialogOpen, setIsRecordPaymentDialogOpen] =
    useState(false);
  const userData = useAuthStore(selectUserData);

  // Active contracts for creating payment records
  const activeContracts = [
    {
      id: "1",
      contractNumber: "RC-2024-001",
      tenantName: "أحمد الراشد",
      propertyTitle: "شقة فاخرة في حي العليا",
      monthlyRent: 4500,
    },
    {
      id: "2",
      contractNumber: "RC-2024-002",
      tenantName: "سارة المنصوري",
      propertyTitle: "فيلا واسعة في جدة",
      monthlyRent: 8500,
    },
    {
      id: "3",
      contractNumber: "RC-2024-003",
      tenantName: "خالد الحربي",
      propertyTitle: "استوديو حديث في الدمام",
      monthlyRent: 2200,
    },
  ];

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchPayments");
      return;
    }

    const fetchPayments = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPayments([
        {
          id: "1",
          paymentNumber: "PAY-2024-001",
          contractId: "1",
          contractNumber: "RC-2024-001",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          tenant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            phone: "+966 50 123 4567",
            email: "ahmed.rashid@email.com",
          },
          paymentDetails: {
            amount: 4500,
            dueDate: "2024-02-01",
            dueDateHijri: "1446/08/01",
            paidDate: "2024-01-30",
            paidDateHijri: "1446/07/30",
            paymentMethod: "bank_transfer",
            paymentMethodAr: "تحويل بنكي",
            transactionId: "TXN-001-2024",
            receiptNumber: "REC-001-2024",
          },
          status: "paid",
          statusAr: "مدفوع",
          paymentType: "rent",
          paymentTypeAr: "إيجار",
          notes: "Payment received on time",
          notesAr: "تم استلام الدفعة في الموعد",
          createdDate: "2024-01-15",
          createdDateHijri: "1446/07/15",
        },
        {
          id: "2",
          paymentNumber: "PAY-2024-002",
          contractId: "2",
          contractNumber: "RC-2024-002",
          propertyTitle: "Spacious Villa in Jeddah",
          propertyTitleAr: "فيلا واسعة في جدة",
          tenant: {
            name: "Sarah Al-Mansouri",
            nameAr: "سارة المنصوري",
            phone: "+966 56 345 6789",
            email: "sarah.mansouri@email.com",
          },
          paymentDetails: {
            amount: 8500,
            dueDate: "2024-02-05",
            dueDateHijri: "1446/08/05",
            paidDate: "2024-02-03",
            paidDateHijri: "1446/08/03",
            paymentMethod: "bank_transfer",
            paymentMethodAr: "تحويل بنكي",
            transactionId: "TXN-002-2024",
            receiptNumber: "REC-002-2024",
          },
          status: "paid",
          statusAr: "مدفوع",
          paymentType: "rent",
          paymentTypeAr: "إيجار",
          notes: "Early payment received",
          notesAr: "تم استلام الدفعة مبكراً",
          createdDate: "2024-01-20",
          createdDateHijri: "1446/07/20",
        },
        {
          id: "3",
          paymentNumber: "PAY-2024-003",
          contractId: "1",
          contractNumber: "RC-2024-001",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          tenant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            phone: "+966 50 123 4567",
            email: "ahmed.rashid@email.com",
          },
          paymentDetails: {
            amount: 4500,
            dueDate: "2024-03-01",
            dueDateHijri: "1446/09/01",
            paymentMethod: "bank_transfer",
            paymentMethodAr: "تحويل بنكي",
          },
          status: "pending",
          statusAr: "معلق",
          paymentType: "rent",
          paymentTypeAr: "إيجار",
          notes: "Monthly rent payment due",
          notesAr: "دفعة الإيجار الشهري مستحقة",
          createdDate: "2024-02-15",
          createdDateHijri: "1446/08/15",
        },
        {
          id: "4",
          paymentNumber: "PAY-2024-004",
          contractId: "3",
          contractNumber: "RC-2024-003",
          propertyTitle: "Modern Studio in Dammam",
          propertyTitleAr: "استوديو حديث في الدمام",
          tenant: {
            name: "Khalid Al-Harbi",
            nameAr: "خالد الحربي",
            phone: "+966 54 456 7890",
            email: "khalid.harbi@email.com",
          },
          paymentDetails: {
            amount: 2200,
            dueDate: "2024-02-20",
            dueDateHijri: "1446/08/20",
            paymentMethod: "cash",
            paymentMethodAr: "نقداً",
          },
          status: "overdue",
          statusAr: "متأخر",
          paymentType: "rent",
          paymentTypeAr: "إيجار",
          notes: "Payment overdue by 5 days",
          notesAr: "الدفعة متأخرة بـ 5 أيام",
          createdDate: "2024-02-01",
          createdDateHijri: "1446/08/01",
          lateFee: 50,
          daysOverdue: 5,
        },
        {
          id: "5",
          paymentNumber: "PAY-2024-005",
          contractId: "1",
          contractNumber: "RC-2024-001",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          tenant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            phone: "+966 50 123 4567",
            email: "ahmed.rashid@email.com",
          },
          paymentDetails: {
            amount: 9000,
            dueDate: "2024-01-20",
            dueDateHijri: "1446/07/20",
            paidDate: "2024-01-20",
            paidDateHijri: "1446/07/20",
            paymentMethod: "bank_transfer",
            paymentMethodAr: "تحويل بنكي",
            transactionId: "TXN-005-2024",
            receiptNumber: "REC-005-2024",
          },
          status: "paid",
          statusAr: "مدفوع",
          paymentType: "deposit",
          paymentTypeAr: "تأمين",
          notes: "Security deposit payment",
          notesAr: "دفعة مبلغ التأمين",
          createdDate: "2024-01-15",
          createdDateHijri: "1446/07/15",
        },
      ]);
      setLoading(false);
    };

    fetchPayments();
  }, [userData?.token]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.tenant.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyTitleAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    const matchesType =
      filterType === "all" || payment.paymentType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      case "partial":
        return <DollarSign className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rent":
        return "bg-blue-100 text-blue-800";
      case "deposit":
        return "bg-purple-100 text-purple-800";
      case "commission":
        return "bg-green-100 text-green-800";
      case "late_fee":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkAsPaid = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "paid" as any,
              statusAr: "مدفوع",
              paymentDetails: {
                ...payment.paymentDetails,
                paidDate: new Date().toISOString().split("T")[0],
                paidDateHijri: "1446/07/17",
                transactionId: `TXN-${paymentId}-2024`,
                receiptNumber: `REC-${paymentId}-2024`,
              },
            }
          : payment,
      ),
    );
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
          {[...Array(5)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة المدفوعات</h2>
          <p className="text-muted-foreground">
            تتبع ومراقبة مدفوعات الإيجار والرسوم
          </p>
        </div>
        <Dialog
          open={isRecordPaymentDialogOpen}
          onOpenChange={setIsRecordPaymentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              تسجيل دفعة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
              <DialogDescription>
                تسجيل دفعة إيجار أو رسوم أخرى
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contract">العقد</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.contractNumber} - {contract.tenantName} (
                        {contract.monthlyRent.toLocaleString()} ر.س/شهر)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-type">نوع الدفعة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">إيجار شهري</SelectItem>
                      <SelectItem value="deposit">مبلغ التأمين</SelectItem>
                      <SelectItem value="commission">عمولة وساطة</SelectItem>
                      <SelectItem value="late_fee">رسوم تأخير</SelectItem>
                      <SelectItem value="maintenance">رسوم صيانة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ (ر.س)</Label>
                  <Input id="amount" type="number" placeholder="4500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">تاريخ الاستحقاق</Label>
                  <Input id="due-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">طريقة الدفع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطريقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="cash">نقداً</SelectItem>
                      <SelectItem value="check">شيك</SelectItem>
                      <SelectItem value="online">دفع إلكتروني</SelectItem>
                      <SelectItem value="card">بطاقة ائتمانية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paid-date">تاريخ الدفع (اختياري)</Label>
                  <Input id="paid-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-id">رقم المعاملة (اختياري)</Label>
                  <Input id="transaction-id" placeholder="TXN-001-2024" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="ملاحظات حول الدفعة..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRecordPaymentDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={() => setIsRecordPaymentDialogOpen(false)}>
                تسجيل الدفعة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المدفوعات..."
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
            <SelectItem value="pending">معلق</SelectItem>
            <SelectItem value="paid">مدفوع</SelectItem>
            <SelectItem value="overdue">متأخر</SelectItem>
            <SelectItem value="partial">جزئي</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="نوع الدفعة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="rent">إيجار</SelectItem>
            <SelectItem value="deposit">تأمين</SelectItem>
            <SelectItem value="commission">عمولة</SelectItem>
            <SelectItem value="late_fee">رسوم تأخير</SelectItem>
            <SelectItem value="maintenance">صيانة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h3 className="font-semibold text-lg">
                      {payment.paymentNumber}
                    </h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusIcon(payment.status)}
                      <span className="mr-1">{payment.statusAr}</span>
                    </Badge>
                    <Badge className={getTypeColor(payment.paymentType)}>
                      {payment.paymentTypeAr}
                    </Badge>
                    {payment.status === "overdue" && payment.daysOverdue && (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        <AlertTriangle className="h-3 w-3 ml-1" />
                        متأخر {payment.daysOverdue} أيام
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">المستأجر:</span>
                        <span>{payment.tenant.nameAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">العقار:</span>
                        <span>{payment.propertyTitleAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Receipt className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">رقم العقد:</span>
                        <span>{payment.contractNumber}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">تاريخ الاستحقاق:</span>
                        <span>{payment.paymentDetails.dueDateHijri}</span>
                      </div>
                      {payment.paymentDetails.paidDateHijri && (
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="font-medium">تاريخ الدفع:</span>
                          <span>{payment.paymentDetails.paidDateHijri}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">طريقة الدفع:</span>
                        <span>{payment.paymentDetails.paymentMethodAr}</span>
                      </div>
                    </div>
                  </div>

                  {payment.notesAr && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {payment.notesAr}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {payment.paymentDetails.amount.toLocaleString()} ر.س
                    </div>
                    {payment.lateFee && (
                      <div className="text-sm text-red-600">
                        + {payment.lateFee} ر.س رسوم تأخير
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {payment.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleMarkAsPaid(payment.id)}
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تأكيد الدفع
                      </Button>
                    )}
                    {payment.status === "overdue" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleMarkAsPaid(payment.id)}
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تأكيد الدفع
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <Eye className="h-3 w-3 ml-1" />
                      التفاصيل
                    </Button>
                    {payment.status === "paid" &&
                      payment.paymentDetails.receiptNumber && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 ml-1" />
                          الإيصال
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Details Dialog */}
      <Dialog
        open={!!selectedPayment}
        onOpenChange={() => setSelectedPayment(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الدفعة</DialogTitle>
            <DialogDescription>
              دفعة رقم {selectedPayment?.paymentNumber} -{" "}
              {selectedPayment?.tenant.nameAr}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">تفاصيل الدفعة</TabsTrigger>
                <TabsTrigger value="contract">معلومات العقد</TabsTrigger>
                <TabsTrigger value="history">سجل الدفعات</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">معلومات الدفعة</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">
                          رقم الدفعة
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedPayment.paymentNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          نوع الدفعة
                        </Label>
                        <Badge
                          className={getTypeColor(selectedPayment.paymentType)}
                        >
                          {selectedPayment.paymentTypeAr}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">المبلغ</Label>
                        <p className="text-sm text-muted-foreground font-bold text-green-600">
                          {selectedPayment.paymentDetails.amount.toLocaleString()}{" "}
                          ر.س
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الحالة</Label>
                        <Badge
                          className={getStatusColor(selectedPayment.status)}
                        >
                          {selectedPayment.statusAr}
                        </Badge>
                      </div>
                      {selectedPayment.lateFee && (
                        <div>
                          <Label className="text-sm font-medium">
                            رسوم التأخير
                          </Label>
                          <p className="text-sm text-red-600">
                            {selectedPayment.lateFee} ر.س
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">تفاصيل الدفع</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">
                          تاريخ الاستحقاق
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedPayment.paymentDetails.dueDateHijri}
                        </p>
                      </div>
                      {selectedPayment.paymentDetails.paidDateHijri && (
                        <div>
                          <Label className="text-sm font-medium">
                            تاريخ الدفع
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {selectedPayment.paymentDetails.paidDateHijri}
                          </p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">
                          طريقة الدفع
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedPayment.paymentDetails.paymentMethodAr}
                        </p>
                      </div>
                      {selectedPayment.paymentDetails.transactionId && (
                        <div>
                          <Label className="text-sm font-medium">
                            رقم المعاملة
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {selectedPayment.paymentDetails.transactionId}
                          </p>
                        </div>
                      )}
                      {selectedPayment.paymentDetails.receiptNumber && (
                        <div>
                          <Label className="text-sm font-medium">
                            رقم الإيصال
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {selectedPayment.paymentDetails.receiptNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {selectedPayment.notesAr && (
                  <div>
                    <h4 className="font-semibold mb-2">ملاحظات</h4>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        {selectedPayment.notesAr}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contract" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">رقم العقد</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.contractNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">العقار</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.propertyTitleAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">المستأجر</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.tenant.nameAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الهاتف</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.tenant.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">
                      البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.tenant.email}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  {filteredPayments
                    .filter((p) => p.contractId === selectedPayment.contractId)
                    .map((payment, index) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="flex-shrink-0">
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {payment.paymentTypeAr}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.paymentDetails.dueDateHijri}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {payment.paymentDetails.amount.toLocaleString()} ر.س
                          </p>
                          <Badge
                            className={`text-xs ${getStatusColor(payment.status)}`}
                          >
                            {payment.statusAr}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedPayment(null)}>
              إغلاق
            </Button>
            {selectedPayment?.status === "paid" &&
              selectedPayment.paymentDetails.receiptNumber && (
                <Button variant="outline">
                  <Download className="ml-2 h-4 w-4" />
                  تحميل الإيصال
                </Button>
              )}
            {(selectedPayment?.status === "pending" ||
              selectedPayment?.status === "overdue") && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleMarkAsPaid(selectedPayment.id);
                  setSelectedPayment(null);
                }}
              >
                <CheckCircle className="ml-2 h-4 w-4" />
                تأكيد الدفع
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            لم يتم العثور على مدفوعات
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" || filterType !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا توجد مدفوعات مسجلة حالياً"}
          </p>
          <Button onClick={() => setIsRecordPaymentDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            تسجيل دفعة جديدة
          </Button>
        </div>
      )}
    </div>
  );
}
