"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnifiedCustomer } from "@/types/unified-customer";
import { Shield, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

interface BrokerageLicenseCardProps {
  customer: UnifiedCustomer;
}

export function BrokerageLicenseCard({ customer }: BrokerageLicenseCardProps) {
  const license = customer.ksaCompliance?.brokerageLicense;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 ml-1" />نشط</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />منتهي</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />معلق</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" />قيد المراجعة</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  if (!license || license.status === 'none') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            رخصة السمسرة (FAL)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">لا توجد معلومات رخصة سمسرة</p>
            <Button variant="outline">
              <Shield className="h-4 w-4 ml-2" />
              إضافة رخصة سمسرة
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
            <Shield className="h-5 w-5" />
            رخصة السمسرة (FAL)
          </CardTitle>
          {getStatusBadge(license.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">رقم الرخصة</label>
            <p className="font-medium">{license.licenseNumber || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">نوع الرخصة</label>
            <p className="font-medium">
              {license.licenseType === 'individual' ? 'فردي' : 
               license.licenseType === 'establishment' ? 'منشأة' : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">تاريخ الإصدار</label>
            <p className="font-medium">
              {license.issuedDate ? new Date(license.issuedDate).toLocaleDateString('ar-SA') : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">تاريخ الانتهاء</label>
            <p className="font-medium">
              {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString('ar-SA') : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">الجهة المصدرة</label>
            <p className="font-medium">{license.issuedBy || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">تاريخ التحقق</label>
            <p className="font-medium">
              {license.verifiedAt ? new Date(license.verifiedAt).toLocaleDateString('ar-SA') : 'غير محقق'}
            </p>
          </div>
        </div>

        {license.notes && (
          <div>
            <label className="text-sm text-gray-500">ملاحظات</label>
            <p className="text-sm mt-1">{license.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            التحقق من الرخصة
          </Button>
          <Button variant="outline" size="sm">
            تحديث المعلومات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
