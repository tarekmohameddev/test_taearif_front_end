"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnifiedCustomer } from "@/types/unified-customer";
import { Home, Plus, ExternalLink } from "lucide-react";

interface EjarContractsCardProps {
  customer: UnifiedCustomer;
}

export function EjarContractsCard({ customer }: EjarContractsCardProps) {
  const contracts = customer.ksaCompliance?.ejarContracts || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">نشط</Badge>;
      case 'expired':
        return <Badge variant="destructive">منتهي</Badge>;
      case 'terminated':
        return <Badge variant="destructive">مفسوخ</Badge>;
      case 'renewed':
        return <Badge className="bg-blue-500">مجدد</Badge>;
      case 'pending':
        return <Badge variant="outline">قيد المراجعة</Badge>;
      case 'draft':
        return <Badge variant="secondary">مسودة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            عقود إيجار (EJAR)
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 ml-2" />
            إنشاء عقد إيجار
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">لا توجد عقود إيجار</p>
            <p className="text-sm text-gray-400">
              إنشاء عقد إيجار إلكتروني عبر منصة إيجار
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {contract.ejarContractNumber ? (
                        <span className="font-medium font-mono text-sm">
                          {contract.ejarContractNumber}
                        </span>
                      ) : (
                        <span className="font-medium">
                          عقد #{contract.id.slice(0, 8)}
                        </span>
                      )}
                      {getStatusBadge(contract.status)}
                      {contract.createdInEjar && (
                        <Badge variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 ml-1" />
                          EJAR
                        </Badge>
                      )}
                    </div>
                    {contract.propertyTitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {contract.propertyTitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">نوع الإيجار: </span>
                    <span className="font-medium">
                      {contract.tenancyType === 'residential' ? 'سكني' :
                       contract.tenancyType === 'commercial' ? 'تجاري' : 'صناعي'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">الإيجار الشهري: </span>
                    <span className="font-medium text-green-600">
                      {contract.monthlyRent.toLocaleString()} ريال
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">تاريخ البدء: </span>
                    <span className="font-medium">
                      {new Date(contract.startDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">تاريخ الانتهاء: </span>
                    <span className="font-medium">
                      {new Date(contract.endDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {contract.securityDeposit && (
                    <div>
                      <span className="text-gray-500">التأمين: </span>
                      <span className="font-medium">
                        {contract.securityDeposit.toLocaleString()} ريال
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">دورية السداد: </span>
                    <span className="font-medium">
                      {contract.paymentSchedule === 'monthly' ? 'شهري' :
                       contract.paymentSchedule === 'quarterly' ? 'ربع سنوي' :
                       contract.paymentSchedule === 'semi-annual' ? 'نصف سنوي' : 'سنوي'}
                    </span>
                  </div>
                </div>

                {contract.landlordName && (
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">المؤجر: </span>
                    <span className="font-medium">{contract.landlordName}</span>
                  </div>
                )}

                {contract.tenantName && (
                  <div className="mt-1 text-sm">
                    <span className="text-gray-500">المستأجر: </span>
                    <span className="font-medium">{contract.tenantName}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm">عرض التفاصيل</Button>
                  {contract.ejarUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={contract.ejarUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 ml-2" />
                        عرض في إيجار
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
