"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { 
  DollarSign, TrendingUp, Calendar, CheckCircle, 
  Clock, AlertCircle, Plus, Receipt, CreditCard,
  Wallet, PieChart, ArrowUpRight, ArrowDownRight,
  Calculator
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FinancialTabProps {
  customer: UnifiedCustomer;
}

interface PaymentSchedule {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  paidAmount?: number;
  method?: string;
  receiptUrl?: string;
  notes?: string;
}

interface Commission {
  id: string;
  description: string;
  amount: number;
  percentage: number;
  dealValue: number;
  status: "calculated" | "approved" | "paid";
  agentName: string;
  date: string;
}

export function FinancialTab({ customer }: FinancialTabProps) {
  // Mock data - would come from API
  const paymentSchedule: PaymentSchedule[] = [
    {
      id: "1",
      title: "الدفعة الأولى - حجز",
      amount: 50000,
      dueDate: "2024-02-01",
      status: "paid",
      paidDate: "2024-01-28",
      paidAmount: 50000,
      method: "bank_transfer",
      receiptUrl: "#",
    },
    {
      id: "2",
      title: "الدفعة الثانية",
      amount: 150000,
      dueDate: "2024-03-01",
      status: "pending",
    },
    {
      id: "3",
      title: "الدفعة الأخيرة",
      amount: 300000,
      dueDate: "2024-04-01",
      status: "pending",
    },
  ];

  const commissions: Commission[] = [
    {
      id: "1",
      description: "عمولة بيع عقار",
      amount: 12500,
      percentage: 2.5,
      dealValue: 500000,
      status: "approved",
      agentName: customer.assignedEmployee?.name || "غير محدد",
      date: "2024-01-28",
    },
  ];

  const totalDealValue = customer.totalDealValue || 500000;
  const paidAmount = customer.paidAmount || 50000;
  const remainingAmount = totalDealValue - paidAmount;
  const paymentProgress = (paidAmount / totalDealValue) * 100;

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { variant: "default" as any, label: "مدفوعة", icon: CheckCircle, color: "text-green-600" },
      pending: { variant: "secondary" as any, label: "قيد الانتظار", icon: Clock, color: "text-yellow-600" },
      overdue: { variant: "destructive" as any, label: "متأخرة", icon: AlertCircle, color: "text-red-600" },
      calculated: { variant: "secondary" as any, label: "محسوبة", icon: Calculator, color: "text-blue-600" },
      approved: { variant: "default" as any, label: "موافق عليها", icon: CheckCircle, color: "text-green-600" },
    };
    const { variant, label, icon: Icon, color } = config[status as keyof typeof config];
    return (
      <Badge variant={variant} className={`gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === "pending" && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">قيمة الصفقة</span>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(totalDealValue)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              إجمالي قيمة العقد
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">المدفوع</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(paidAmount)}
            </div>
            <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {paymentProgress.toFixed(1)}% من الإجمالي
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">المتبقي</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {formatCurrency(remainingAmount)}
            </div>
            <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3" />
              {(100 - paymentProgress).toFixed(1)}% من الإجمالي
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            تقدم الدفع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={paymentProgress} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              تم دفع {paymentSchedule.filter(p => p.status === "paid").length} من {paymentSchedule.length} دفعات
            </span>
            <span className="font-bold text-blue-600">
              {paymentProgress.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              جدول الدفعات
            </CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة دفعة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentSchedule.map((payment) => (
            <Card 
              key={payment.id}
              className={`${
                isOverdue(payment.dueDate, payment.status)
                  ? "border-l-4 border-l-red-500"
                  : payment.status === "paid"
                  ? "border-l-4 border-l-green-500"
                  : "border-l-4 border-l-gray-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{payment.title}</h4>
                      <div className="text-2xl font-bold text-blue-600 mt-1">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">تاريخ الاستحقاق:</span>
                      <div className="font-medium">{formatDate(payment.dueDate)}</div>
                    </div>
                    {payment.paidDate && (
                      <div>
                        <span className="text-gray-600">تاريخ الدفع:</span>
                        <div className="font-medium text-green-600">
                          {formatDate(payment.paidDate)}
                        </div>
                      </div>
                    )}
                  </div>

                  {payment.method && (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                      <span>
                        طريقة الدفع: {payment.method === "bank_transfer" ? "تحويل بنكي" : payment.method}
                      </span>
                    </div>
                  )}

                  {payment.notes && (
                    <p className="text-sm text-gray-600 bg-blue-50 dark:bg-blue-950 p-2 rounded">
                      {payment.notes}
                    </p>
                  )}

                  {payment.status === "paid" && payment.receiptUrl && (
                    <Button size="sm" variant="outline" className="w-full">
                      <Receipt className="h-3 w-3 ml-1" />
                      عرض الإيصال
                    </Button>
                  )}

                  {payment.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تسجيل الدفع
                      </Button>
                      <Button size="sm" variant="outline">
                        <Receipt className="h-3 w-3 ml-1" />
                        إرسال تذكير
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-600" />
            العمولات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {commissions.map((commission) => (
            <Card key={commission.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{commission.description}</h4>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(commission.amount)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {commission.percentage}% من {formatCurrency(commission.dealValue)}
                      </div>
                    </div>
                    {getStatusBadge(commission.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">
                        الوكيل: <strong>{commission.agentName}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">
                        {formatDate(commission.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Financial Notes */}
      <Card className="bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            ملاحظات مالية
          </h4>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>• يرجى متابعة الدفعة الثانية المستحقة في 1 مارس 2024</p>
            <p>• العمولة موافق عليها ومستحقة الدفع للوكيل</p>
            <p>• تم استلام الدفعة الأولى بنجاح</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
