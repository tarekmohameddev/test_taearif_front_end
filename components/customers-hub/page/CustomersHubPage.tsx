"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { CustomersDashboard } from "./CustomersDashboard";
import { CustomersTable } from "./CustomersTable";
import { CustomersMap } from "./CustomersMap";
import { CustomersGrid } from "./CustomersGrid";
import { QuickActions } from "./QuickActions";
import { AdvancedFilters } from "../filters/AdvancedFilters";
import { AssignmentPanel } from "../assignment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, KanbanSquare, Map } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddCustomerDialog } from "../dialogs/AddCustomerDialog";

export function CustomersHubPage() {
  const { viewMode, setViewMode } = useUnifiedCustomersStore();

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            العملاء الموحد
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            إدارة شاملة لدورة حياة العملاء في القطاع العقاري
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <AssignmentPanel />
          
          <Link href="/ar/dashboard/customers-hub/pipeline">
            <Button variant="outline" className="gap-2">
              <KanbanSquare className="h-4 w-4" />
              مسار المبيعات
            </Button>
          </Link>
          
          <Link href="/ar/dashboard/customers-hub/ai-assistant">
            <Button variant="outline" className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              المساعد الذكي
            </Button>
          </Link>

          <Link href="/ar/dashboard/customers-hub/analytics">
            <Button variant="outline" className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              التحليلات
            </Button>
          </Link>
          
          <QuickActions />
        </div>
      </div>

      {/* Dashboard Statistics */}
      <CustomersDashboard />

      {/* Advanced Filters */}
      <AdvancedFilters />

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table" className="gap-2">
              <List className="h-4 w-4" />
              جدول
            </TabsTrigger>
            <TabsTrigger value="grid" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              شبكة
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              خريطة
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="mt-4">
          <CustomersTable />
        </TabsContent>

        <TabsContent value="grid" className="mt-4">
          <CustomersGrid />
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <CustomersMap />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddCustomerDialog />
    </div>
  );
}
