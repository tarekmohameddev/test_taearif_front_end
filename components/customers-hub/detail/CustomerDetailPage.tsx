"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageSquare, Mail, Edit } from "lucide-react";
import Link from "next/link";
import { CustomerProfile } from "./CustomerProfile";
import { CustomerTimeline } from "./CustomerTimeline";
import { PropertyInterests } from "./PropertyInterests";
import { PropertyComparison } from "./PropertyComparison";
import { AIInsightsCard } from "./AIInsightsCard";
import { AppointmentsTab } from "./AppointmentsTab";
import { DocumentsTab } from "./DocumentsTab";
import { FinancialTab } from "./FinancialTab";
import { CommunicationHub } from "./CommunicationHub";
import { RemindersTab } from "./RemindersTab";
import { ActivitiesTab } from "./ActivitiesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomerDetailPageProps {
  customerId: string;
}

export function CustomerDetailPage({ customerId }: CustomerDetailPageProps) {
  const { getCustomerById } = useUnifiedCustomersStore();
  const customer = getCustomerById(customerId);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <div className="text-2xl font-bold text-gray-400">العميل غير موجود</div>
        <Link href="/ar/dashboard/customers-hub">
          <Button>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للقائمة
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/ar/dashboard/customers-hub">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              عرض شامل - 360 درجة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            اتصال
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            واتساب
          </Button>
          {customer.email && (
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              بريد
            </Button>
          )}
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile & AI Insights */}
        <div className="space-y-6">
          <CustomerProfile customer={customer} />
          <AIInsightsCard customer={customer} />
        </div>

        {/* Right Column - Tabs with Timeline, Properties, etc. */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline">
            <TabsList className="grid w-full grid-cols-9 text-[10px] md:text-xs">
              <TabsTrigger value="timeline">الجدول</TabsTrigger>
              <TabsTrigger value="activities">الأنشطة</TabsTrigger>
              <TabsTrigger value="properties">العقارات</TabsTrigger>
              <TabsTrigger value="comparison">مقارنة</TabsTrigger>
              <TabsTrigger value="appointments">المواعيد</TabsTrigger>
              <TabsTrigger value="reminders">التذكيرات</TabsTrigger>
              <TabsTrigger value="documents">المستندات</TabsTrigger>
              <TabsTrigger value="financial">المالية</TabsTrigger>
              <TabsTrigger value="communication">التواصل</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <CustomerTimeline customer={customer} />
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              <ActivitiesTab customer={customer} />
            </TabsContent>

            <TabsContent value="properties" className="mt-6">
              <PropertyInterests customer={customer} />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <PropertyComparison customer={customer} />
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <AppointmentsTab customer={customer} />
            </TabsContent>

            <TabsContent value="reminders" className="mt-6">
              <RemindersTab customer={customer} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <DocumentsTab customer={customer} />
            </TabsContent>

            <TabsContent value="financial" className="mt-6">
              <FinancialTab customer={customer} />
            </TabsContent>

            <TabsContent value="communication" className="mt-6">
              <CommunicationHub customer={customer} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
