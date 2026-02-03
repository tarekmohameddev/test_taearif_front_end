"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnifiedCustomer } from "@/types/unified-customer";
import { FileText, Plus } from "lucide-react";

interface BrokerageContractsCardProps {
  customer: UnifiedCustomer;
}

export function BrokerageContractsCard({ customer }: BrokerageContractsCardProps) {
  const contracts = customer.ksaCompliance?.brokerageContracts || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">نشط</Badge>;
      case 'completed':
        return <Badge variant="secondary">مكتمل</Badge>;
      case 'pending_approval':
        return <Badge variant="outline">قيد الموافقة</Badge>;
      case 'draft':
        return <Badge variant="secondary">مسودة</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            عقود السمسرة
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 ml-2" />
            إضافة عقد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا توجد عقود سمسرة
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {contract.contractNumber || `عقد #${contract.id.slice(0, 8)}`}
                      </span>
                      {getStatusBadge(contract.status)}
                    </div>
                    {contract.propertyTitle && (
                      <p className="text-sm text-gray-500 mt-1">{contract.propertyTitle}</p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {contract.type === 'sale' ? 'بيع' : 
                     contract.type === 'rent' ? 'إيجار' : 'بيع وإيجار'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">العمولة: </span>
                    <span className="font-medium">
                      {contract.commissionRate ? `${contract.commissionRate}%` : 
                       contract.commissionAmount ? `${contract.commissionAmount.toLocaleString()} ريال` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">فترة الحصرية: </span>
                    <span className="font-medium">
                      {contract.exclusivityPeriod ? `${contract.exclusivityPeriod} يوم` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">تاريخ البدء: </span>
                    <span className="font-medium">
                      {new Date(contract.startDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {contract.endDate && (
                    <div>
                      <span className="text-gray-500">تاريخ الانتهاء: </span>
                      <span className="font-medium">
                        {new Date(contract.endDate).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  )}
                </div>

                {contract.regaContractId && (
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">معرف العقد في REGA: </span>
                    <span className="font-mono text-xs">{contract.regaContractId}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm">عرض التفاصيل</Button>
                  <Button variant="ghost" size="sm">المستندات</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
