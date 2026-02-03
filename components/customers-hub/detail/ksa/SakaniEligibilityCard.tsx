"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnifiedCustomer } from "@/types/unified-customer";
import { FileCheck, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

interface SakaniEligibilityCardProps {
  customer: UnifiedCustomer;
}

export function SakaniEligibilityCard({ customer }: SakaniEligibilityCardProps) {
  const eligibility = customer.ksaCompliance?.sakaniEligibility;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'eligible':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 ml-1" />مؤهل</Badge>;
      case 'not_eligible':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />غير مؤهل</Badge>;
      case 'pending_verification':
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" />قيد التحقق</Badge>;
      case 'not_checked':
        return <Badge variant="outline">لم يتم التحقق</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!eligibility || eligibility.status === 'not_checked') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            أهلية سكني
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">لم يتم التحقق من أهلية برنامج سكني</p>
            <Button variant="outline">
              <FileCheck className="h-4 w-4 ml-2" />
              التحقق من الأهلية
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            أهلية سكني (Sakani/NHC)
          </CardTitle>
          {getStatusBadge(eligibility.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {eligibility.status === 'eligible' && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
            <p className="text-green-800 dark:text-green-300 text-sm">
              ✓ العميل مؤهل للاستفادة من برنامج سكني
            </p>
          </div>
        )}

        {eligibility.status === 'not_eligible' && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
            <p className="text-red-800 dark:text-red-300 text-sm">
              ✗ العميل غير مؤهل للاستفادة من برنامج سكني
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {eligibility.sakaniId && (
            <div>
              <label className="text-sm text-gray-500">رقم المستفيد</label>
              <p className="font-medium font-mono">{eligibility.sakaniId}</p>
            </div>
          )}
          {eligibility.eligibilityCheckedAt && (
            <div>
              <label className="text-sm text-gray-500">تاريخ التحقق</label>
              <p className="font-medium">
                {new Date(eligibility.eligibilityCheckedAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
          )}
          {eligibility.householdIncome && (
            <div>
              <label className="text-sm text-gray-500">دخل الأسرة</label>
              <p className="font-medium">{eligibility.householdIncome.toLocaleString()} ريال</p>
            </div>
          )}
          {eligibility.householdSize && (
            <div>
              <label className="text-sm text-gray-500">حجم الأسرة</label>
              <p className="font-medium">{eligibility.householdSize} أفراد</p>
            </div>
          )}
          <div>
            <label className="text-sm text-gray-500">المالك لأول مرة</label>
            <p className="font-medium">
              {eligibility.firstTimeOwner === true ? 'نعم' : 
               eligibility.firstTimeOwner === false ? 'لا' : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">يمتلك عقار حاليًا</label>
            <p className="font-medium">
              {eligibility.currentlyOwnsProperty === true ? 'نعم' : 
               eligibility.currentlyOwnsProperty === false ? 'لا' : '-'}
            </p>
          </div>
        </div>

        {eligibility.status === 'eligible' && (
          <div className="space-y-3 pt-4 border-t">
            {eligibility.approvedLoanAmount && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <label className="text-sm text-gray-600 dark:text-gray-400">مبلغ القرض المعتمد</label>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {eligibility.approvedLoanAmount.toLocaleString()} ريال
                </p>
              </div>
            )}
            {eligibility.downPaymentSupport && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <label className="text-sm text-gray-600 dark:text-gray-400">دعم الدفعة الأولى</label>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {eligibility.downPaymentSupport.toLocaleString()} ريال
                </p>
              </div>
            )}
          </div>
        )}

        {eligibility.interestedProducts && eligibility.interestedProducts.length > 0 && (
          <div>
            <label className="text-sm text-gray-500 mb-2 block">المنتجات المهتم بها</label>
            <div className="flex flex-wrap gap-2">
              {eligibility.interestedProducts.map((product) => (
                <Badge key={product} variant="outline">
                  {product === 'ready_unit' ? 'وحدة جاهزة' :
                   product === 'under_construction' ? 'تحت الإنشاء' :
                   product === 'self_construction' ? 'بناء ذاتي' :
                   product === 'moh_land' ? 'أراضي الوزارة' :
                   product === 'easy_installment' ? 'تقسيط ميسر' : product}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {eligibility.eligibilityNotes && (
          <div>
            <label className="text-sm text-gray-500">ملاحظات الأهلية</label>
            <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded">
              {eligibility.eligibilityNotes}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث الأهلية
          </Button>
          {eligibility.status === 'eligible' && (
            <Button size="sm">
              عرض المنتجات المتاحة
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
