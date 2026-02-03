"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UnifiedCustomer } from "@/types/unified-customer";
import { 
  FileCheck, 
  Home, 
  Building2, 
  Landmark, 
  Wallet,
  Shield,
  AlertCircle
} from "lucide-react";
import { BrokerageLicenseCard } from "./ksa/BrokerageLicenseCard";
import { BrokerageContractsCard } from "./ksa/BrokerageContractsCard";
import { EjarContractsCard } from "./ksa/EjarContractsCard";
import { WafiProjectCard } from "./ksa/WafiProjectCard";
import { SakaniEligibilityCard } from "./ksa/SakaniEligibilityCard";
import { MortgageInfoCard } from "./ksa/MortgageInfoCard";

interface KSAComplianceTabProps {
  customer: UnifiedCustomer;
}

export function KSAComplianceTab({ customer }: KSAComplianceTabProps) {
  const ksaData = customer.ksaCompliance;
  
  // Check for compliance issues
  const hasLicenseIssue = ksaData?.brokerageLicense?.status === 'expired' || 
                          ksaData?.brokerageLicense?.status === 'suspended';
  const hasEscrowOverdue = ksaData?.escrowMilestones?.some(m => m.isOverdue);
  const hasActiveDefects = ksaData?.handoverDefects?.some(d => d.status !== 'resolved');
  
  const complianceIssues = [
    hasLicenseIssue && "رخصة السمسرة منتهية أو معلقة",
    hasEscrowOverdue && "مراحل ضمان متأخرة",
    hasActiveDefects && "عيوب تسليم نشطة"
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Compliance Alert */}
      {complianceIssues.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-300">
                تنبيهات الامتثال
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {complianceIssues.map((issue, idx) => (
                <li key={idx} className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                  {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* KSA Compliance Modules */}
      <Tabs defaultValue="brokerage" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="brokerage" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">السمسرة</span>
          </TabsTrigger>
          <TabsTrigger value="ejar" className="gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">إيجار</span>
          </TabsTrigger>
          <TabsTrigger value="wafi" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">وافي</span>
          </TabsTrigger>
          <TabsTrigger value="sakani" className="gap-2">
            <FileCheck className="h-4 w-4" />
            <span className="hidden sm:inline">سكني</span>
          </TabsTrigger>
          <TabsTrigger value="mortgage" className="gap-2">
            <Landmark className="h-4 w-4" />
            <span className="hidden sm:inline">التمويل</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">المدفوعات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brokerage" className="space-y-4 mt-4">
          <BrokerageLicenseCard customer={customer} />
          <BrokerageContractsCard customer={customer} />
        </TabsContent>

        <TabsContent value="ejar" className="mt-4">
          <EjarContractsCard customer={customer} />
        </TabsContent>

        <TabsContent value="wafi" className="mt-4">
          <WafiProjectCard customer={customer} />
        </TabsContent>

        <TabsContent value="sakani" className="mt-4">
          <SakaniEligibilityCard customer={customer} />
        </TabsContent>

        <TabsContent value="mortgage" className="mt-4">
          <MortgageInfoCard customer={customer} />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>جدول المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              {ksaData?.paymentSchedule && ksaData.paymentSchedule.length > 0 ? (
                <div className="space-y-3">
                  {ksaData.paymentSchedule.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{payment.description}</span>
                          <Badge
                            variant={
                              payment.status === 'paid' ? 'default' :
                              payment.status === 'overdue' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {payment.status === 'paid' ? 'مدفوع' :
                             payment.status === 'overdue' ? 'متأخر' :
                             payment.status === 'pending' ? 'معلق' : 'ملغي'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          تاريخ الاستحقاق: {new Date(payment.dueDate).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">
                          {payment.amount.toLocaleString()} ريال
                        </div>
                        {payment.paidAmount && (
                          <div className="text-sm text-green-600">
                            مدفوع: {payment.paidAmount.toLocaleString()} ريال
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  لا يوجد جدول مدفوعات
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
