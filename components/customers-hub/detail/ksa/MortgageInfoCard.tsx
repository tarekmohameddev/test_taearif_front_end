"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UnifiedCustomer } from "@/types/unified-customer";
import { Landmark, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface MortgageInfoCardProps {
  customer: UnifiedCustomer;
}

export function MortgageInfoCard({ customer }: MortgageInfoCardProps) {
  const mortgage = customer.ksaCompliance?.mortgageInfo;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 ml-1" />معتمد</Badge>;
      case 'pre_approved':
        return <Badge className="bg-blue-500"><CheckCircle className="h-3 w-3 ml-1" />معتمد مسبقًا</Badge>;
      case 'disbursed':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 ml-1" />مصروف</Badge>;
      case 'application_submitted':
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" />قيد المراجعة</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />مرفوض</Badge>;
      case 'not_applied':
        return <Badge variant="outline">لم يتقدم</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!mortgage || mortgage.status === 'not_applied') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            معلومات التمويل العقاري
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">لم يتم التقدم للحصول على تمويل عقاري</p>
            <Button variant="outline">
              <Landmark className="h-4 w-4 ml-2" />
              بدء طلب تمويل
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const downPaymentProgress = mortgage.downPaymentRequired && mortgage.downPaymentPaid
    ? (mortgage.downPaymentPaid / mortgage.downPaymentRequired) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            معلومات التمويل العقاري
          </CardTitle>
          {getStatusBadge(mortgage.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Financial Info */}
        {(mortgage.status === 'pre_approved' || mortgage.status === 'approved' || mortgage.status === 'disbursed') && (
          <div className="grid grid-cols-2 gap-4">
            {mortgage.preApprovedAmount && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <label className="text-sm text-gray-600 dark:text-gray-400">المبلغ المعتمد مسبقًا</label>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {mortgage.preApprovedAmount.toLocaleString()} ريال
                </p>
              </div>
            )}
            {mortgage.approvedAmount && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <label className="text-sm text-gray-600 dark:text-gray-400">المبلغ المعتمد</label>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {mortgage.approvedAmount.toLocaleString()} ريال
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bank & Application Info */}
        <div className="grid grid-cols-2 gap-4">
          {mortgage.bankName && (
            <div>
              <label className="text-sm text-gray-500">البنك</label>
              <p className="font-medium">{mortgage.bankName}</p>
            </div>
          )}
          {mortgage.financingType && (
            <div>
              <label className="text-sm text-gray-500">نوع التمويل</label>
              <p className="font-medium">
                {mortgage.financingType === 'conventional' ? 'تقليدي' :
                 mortgage.financingType === 'islamic' ? 'إسلامي' :
                 mortgage.financingType === 'subsidized' ? 'مدعوم' : 'تمويل ذاتي'}
              </p>
            </div>
          )}
          {mortgage.applicationNumber && (
            <div>
              <label className="text-sm text-gray-500">رقم الطلب</label>
              <p className="font-medium font-mono text-sm">{mortgage.applicationNumber}</p>
            </div>
          )}
          {mortgage.interestRate && (
            <div>
              <label className="text-sm text-gray-500">سعر الفائدة</label>
              <p className="font-medium">{mortgage.interestRate}%</p>
            </div>
          )}
          {mortgage.loanTenure && (
            <div>
              <label className="text-sm text-gray-500">مدة القرض</label>
              <p className="font-medium">{mortgage.loanTenure} سنة</p>
            </div>
          )}
          {mortgage.monthlyPayment && (
            <div>
              <label className="text-sm text-gray-500">القسط الشهري</label>
              <p className="font-medium text-orange-600">
                {mortgage.monthlyPayment.toLocaleString()} ريال
              </p>
            </div>
          )}
        </div>

        {/* Down Payment Progress */}
        {mortgage.downPaymentRequired && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">الدفعة الأولى</span>
              <span className="text-sm font-bold">
                {mortgage.downPaymentPaid?.toLocaleString() || 0} / {mortgage.downPaymentRequired.toLocaleString()} ريال
              </span>
            </div>
            <Progress value={downPaymentProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(downPaymentProgress)}% مدفوع
            </p>
          </div>
        )}

        {/* REDF Support */}
        {mortgage.redfSupport && mortgage.redfAmount && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  دعم صندوق التنمية العقارية (REDF)
                </label>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  {mortgage.redfAmount.toLocaleString()} ريال
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-2 pt-4 border-t">
          {mortgage.applicationDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ تقديم الطلب</span>
              <span className="font-medium">
                {new Date(mortgage.applicationDate).toLocaleDateString('ar-SA')}
              </span>
            </div>
          )}
          {mortgage.approvalDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ الموافقة</span>
              <span className="font-medium">
                {new Date(mortgage.approvalDate).toLocaleDateString('ar-SA')}
              </span>
            </div>
          )}
          {mortgage.disbursementDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ الصرف</span>
              <span className="font-medium">
                {new Date(mortgage.disbursementDate).toLocaleDateString('ar-SA')}
              </span>
            </div>
          )}
        </div>

        {mortgage.notes && (
          <div>
            <label className="text-sm text-gray-500">ملاحظات</label>
            <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded">
              {mortgage.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 ml-2" />
            عرض المستندات
          </Button>
          {mortgage.status === 'pre_approved' && (
            <Button size="sm">
              تقديم طلب رسمي
            </Button>
          )}
          {mortgage.status === 'approved' && (
            <Button size="sm">
              تتبع الصرف
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
