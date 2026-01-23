"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  DollarSign,
  Calendar,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react";

export function AffiliatePaymentsPage() {
  const [paymentMethod, setPaymentMethod] = useState({
    type: "bank",
    bankName: "البنك الأهلي السعودي",
    accountNumber: "1234567890",
    iban: "SA00 0000 0000 0000 0000 0000",
  });

  const [paymentHistory] = useState([
    {
      id: 1,
      amount: 2850.0,
      date: "2024-01-01",
      status: "completed",
      method: "تحويل بنكي",
      reference: "PAY-2024-001",
    },
    {
      id: 2,
      amount: 2150.75,
      date: "2023-12-01",
      status: "completed",
      method: "تحويل بنكي",
      reference: "PAY-2023-012",
    },
    {
      id: 3,
      amount: 1890.5,
      date: "2023-11-01",
      status: "completed",
      method: "تحويل بنكي",
      reference: "PAY-2023-011",
    },
    {
      id: 4,
      amount: 1650.25,
      date: "2023-10-01",
      status: "completed",
      method: "تحويل بنكي",
      reference: "PAY-2023-010",
    },
  ]);

  const [currentBalance] = useState({
    pending: 2100.25,
    available: 850.5,
    nextPaymentDate: "2024-02-01",
    minimumPayout: 100.0,
  });

  const handleUpdatePaymentMethod = () => {
    toast({
      title: "تم تحديث طريقة الدفع",
      description: "تم حفظ معلومات الدفع الجديدة بنجاح",
    });
  };

  const requestPayout = () => {
    if (currentBalance.available < currentBalance.minimumPayout) {
      toast({
        title: "لا يمكن طلب الدفع",
        description: `الحد الأدنى للدفع هو ${currentBalance.minimumPayout} ريال`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم طلب الدفع",
      description: "سيتم معالجة طلب الدفع خلال 3-5 أيام عمل",
    });
  };

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">المدفوعات والأرباح</h1>
                <p className="text-muted-foreground">
                  إدارة مدفوعاتك وتتبع أرباحك
                </p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 ml-1" />
                تصدير كشف حساب
              </Button>
            </div>

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
                    {currentBalance.pending.toLocaleString()} ريال
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
                    {currentBalance.available.toLocaleString()} ريال
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={requestPayout}
                    disabled={
                      currentBalance.available < currentBalance.minimumPayout
                    }
                  >
                    <DollarSign className="h-4 w-4 ml-1" />
                    طلب دفع فوري
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 ml-1" />
                    تحميل فاتورة ضريبية
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 ml-1" />
                    إعدادات الدفع
                  </Button>
                </div>
                {currentBalance.available < currentBalance.minimumPayout && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      الحد الأدنى للدفع الفوري هو {currentBalance.minimumPayout}{" "}
                      ريال. رصيدك الحالي: {currentBalance.available} ريال
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="history" className="space-y-4">
              <TabsList>
                <TabsTrigger value="history">سجل المدفوعات</TabsTrigger>
                <TabsTrigger value="settings">إعدادات الدفع</TabsTrigger>
                <TabsTrigger value="tax">المعلومات الضريبية</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>سجل المدفوعات</CardTitle>
                    <CardDescription>
                      جميع المدفوعات السابقة والحالية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {payment.amount.toLocaleString()} ريال
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {payment.date} • {payment.method}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(payment.status)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {payment.reference}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات طريقة الدفع</CardTitle>
                    <CardDescription>
                      إدارة معلومات الدفع الخاصة بك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentType">طريقة الدفع</Label>
                      <Select
                        value={paymentMethod.type}
                        onValueChange={(value) =>
                          setPaymentMethod({ ...paymentMethod, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">تحويل بنكي</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="wise">Wise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentMethod.type === "bank" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="bankName">اسم البنك</Label>
                          <Input
                            id="bankName"
                            value={paymentMethod.bankName}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                bankName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">رقم الحساب</Label>
                          <Input
                            id="accountNumber"
                            value={paymentMethod.accountNumber}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                accountNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iban">رقم الآيبان</Label>
                          <Input
                            id="iban"
                            value={paymentMethod.iban}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                iban: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    <Button onClick={handleUpdatePaymentMethod}>
                      <CreditCard className="h-4 w-4 ml-1" />
                      حفظ التغييرات
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الضريبية</CardTitle>
                    <CardDescription>
                      إدارة المعلومات الضريبية والفواتير
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxId">الرقم الضريبي</Label>
                        <Input id="taxId" placeholder="أدخل الرقم الضريبي" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">اسم الشركة</Label>
                        <Input id="companyName" placeholder="أدخل اسم الشركة" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Input id="address" placeholder="أدخل العنوان الكامل" />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        معلومات مهمة
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• سيتم إصدار فاتورة ضريبية لكل دفعة</li>
                        <li>• يمكنك تحميل الفواتير من سجل المدفوعات</li>
                        <li>• تأكد من صحة المعلومات الضريبية</li>
                      </ul>
                    </div>

                    <Button>حفظ المعلومات الضريبية</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
    </div>
  );
}
