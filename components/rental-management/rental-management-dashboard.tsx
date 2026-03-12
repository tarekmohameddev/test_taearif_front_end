"use client";

import { useState } from "react";
import { RentalApplicationsService } from "@/components/rental-management/services/rental-applications-service";
import { RentalAgreementsService } from "@/components/rental-management/services/rental-agreements-service";
import { RentalPaymentsService } from "@/components/rental-management/services/rental-payments-service";
import { RentalDashboardStats } from "@/components/rental-management/dashboard-stats";
// import { RentalMaintenanceService } from "@/components/rental-management/services/rental-maintenance-service"
// import { RentalOverviewService } from "@/components/rental-management/services/rental-overview-service"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CreditCard, Wrench, Users, Home } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

export function RentalManagementDashboard() {
  const [openAddDialogCounter, setOpenAddDialogCounter] = useState(0);
  const userData = useAuthStore(selectUserData);

  // Filters state
  const [collectionsPeriod, setCollectionsPeriod] =
    useState<string>("this_month");
  const [collectionsFromDate, setCollectionsFromDate] = useState<string>("");
  const [collectionsToDate, setCollectionsToDate] = useState<string>("");
  const [paymentsDuePeriod, setPaymentsDuePeriod] =
    useState<string>("this_month");
  const [paymentsDueFromDate, setPaymentsDueFromDate] = useState<string>("");
  const [paymentsDueToDate, setPaymentsDueToDate] = useState<string>("");

  console.log("🏗️ Dashboard State:", {
    openAddDialogCounter,
  });

  // كود الصيانة مخفي ولكن موجود
  // const services = [
  //   {
  //     id: "overview",
  //     name: "نظرة عامة",
  //     nameEn: "Overview",
  //     icon: Home,
  //     description: "لوحة المعلومات الرئيسية للإيجارات",
  //   },
  //   {
  //     id: "applications",
  //     name: "طلبات الإيجار",
  //     nameEn: "Rental Requests",
  //     icon: Users,
  //     description: "إدارة طلبات الإيجار الجديدة",
  //   },
  //   {
  //     id: "agreements",
  //     name: "طلبات الإيجار",
  //     nameEn: "Rental Agreements",
  //     icon: FileText,
  //     description: "إدارة طلبات الإيجار النشطة",
  //   },
  //   {
  //     id: "payments",
  //     name: "المدفوعات",
  //     nameEn: "Payments",
  //     icon: CreditCard,
  //     description: "تتبع مدفوعات الإيجار",
  //   },
  //   {
  //     id: "maintenance",
  //     name: "الصيانة",
  //     nameEn: "Maintenance",
  //     icon: Wrench,
  //     description: "طلبات الصيانة والخدمات",
  //   },
  // ]

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* العنوان */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  نظام إدارة الإيجارات
                </h1>
                <p className="text-muted-foreground">
                  نظام شامل لإدارة الإيجارات العقارية في المملكة العربية
                  السعودية
                </p>
              </div>

              {/* Filters */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {/* Collections Period Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="collections-period">فترة التحصيل</Label>
                    <Select
                      value={collectionsPeriod}
                      onValueChange={setCollectionsPeriod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فترة التحصيل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this_week">هذا الأسبوع</SelectItem>
                        <SelectItem value="this_month">هذا الشهر</SelectItem>
                        <SelectItem value="this_year">هذا العام</SelectItem>
                        <SelectItem value="custom">مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Collections From Date (when custom) */}
                  {collectionsPeriod === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="collections-from-date">
                        من تاريخ التحصيل
                      </Label>
                      <Input
                        id="collections-from-date"
                        type="date"
                        value={collectionsFromDate}
                        onChange={(e) => setCollectionsFromDate(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Collections To Date (when custom) */}
                  {collectionsPeriod === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="collections-to-date">
                        إلى تاريخ التحصيل
                      </Label>
                      <Input
                        id="collections-to-date"
                        type="date"
                        value={collectionsToDate}
                        onChange={(e) => setCollectionsToDate(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Payments Due Period Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="payments-due-period">
                      فترة المدفوعات المستحقة
                    </Label>
                    <Select
                      value={paymentsDuePeriod}
                      onValueChange={setPaymentsDuePeriod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فترة المدفوعات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this_week">هذا الأسبوع</SelectItem>
                        <SelectItem value="this_month">هذا الشهر</SelectItem>
                        <SelectItem value="this_year">هذا العام</SelectItem>
                        <SelectItem value="custom">مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payments Due From Date (when custom) */}
                  {paymentsDuePeriod === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="payments-due-from-date">
                        من تاريخ المدفوعات
                      </Label>
                      <Input
                        id="payments-due-from-date"
                        type="date"
                        value={paymentsDueFromDate}
                        onChange={(e) => setPaymentsDueFromDate(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Payments Due To Date (when custom) */}
                  {paymentsDuePeriod === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="payments-due-to-date">
                        إلى تاريخ المدفوعات
                      </Label>
                      <Input
                        id="payments-due-to-date"
                        type="date"
                        value={paymentsDueToDate}
                        onChange={(e) => setPaymentsDueToDate(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* إحصائيات لوحة المعلومات */}
            <div className="space-y-6">
              <RentalDashboardStats
                collectionsPeriod={collectionsPeriod}
                collectionsFromDate={collectionsFromDate}
                collectionsToDate={collectionsToDate}
                paymentsDuePeriod={paymentsDuePeriod}
                paymentsDueFromDate={paymentsDueFromDate}
                paymentsDueToDate={paymentsDueToDate}
              />
            </div>

            {/* طلبات الإيجار */}
            <div className="space-y-6">
              <RentalApplicationsService
                openAddDialogCounter={openAddDialogCounter}
                collectionsPeriod={collectionsPeriod}
                collectionsFromDate={collectionsFromDate}
                collectionsToDate={collectionsToDate}
                paymentsDuePeriod={paymentsDuePeriod}
                paymentsDueFromDate={paymentsDueFromDate}
                paymentsDueToDate={paymentsDueToDate}
              />
            </div>

            {/* كود الصيانة مخفي ولكن موجود */}
            {/* 
            <div className="space-y-6">
              <RentalMaintenanceService openCreateDialogCounter={openCreateMaintenanceCounter} />
            </div>
            */}
          </div>
        </main>
    </div>
  );
}
