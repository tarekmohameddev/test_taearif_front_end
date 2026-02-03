"use client";

import React, { useState } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { CustomersDashboard } from "./CustomersDashboard";
import { CustomersTable } from "./CustomersTable";
import { CustomersMap } from "./CustomersMap";
import { CustomersGrid } from "./CustomersGrid";
import { QuickActions } from "./QuickActions";
import { AdvancedFilters } from "../filters/AdvancedFilters";
import { SavedFilters } from "../filters/SavedFilters";
import { BulkActionsBar } from "../bulk/BulkActionsBar";
import { AssignmentPanel } from "../assignment";
import { ExportDialog } from "../export/ExportDialog";
import { NotificationsCenter } from "../notifications/NotificationsCenter";
import { KeyboardShortcuts, useKeyboardShortcuts } from "../keyboard/KeyboardShortcuts";
import { QuickAddFAB } from "../fab/QuickAddFAB";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, KanbanSquare, Map, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddCustomerDialog } from "../dialogs/AddCustomerDialog";
import { useRouter } from "next/navigation";
import type { CustomerFilters } from "@/types/unified-customer";

export function EnhancedCustomersHubPage() {
  const router = useRouter();
  const { viewMode, setViewMode, setShowAddCustomerDialog, customers, filters, setFilters, getPendingActionsCount } =
    useUnifiedCustomersStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get pending actions count
  const pendingActionsCount = getPendingActionsCount();

  // Get filtered customers
  const filteredCustomers = customers; // Already filtered by store

  // Keyboard shortcuts handlers
  useKeyboardShortcuts({
    onSearch: () => {
      // TODO: Implement search
      console.log("Search triggered");
    },
    onAddCustomer: () => {
      setShowAddCustomerDialog(true);
    },
    onExport: () => {
      setShowExportDialog(true);
    },
    onFilters: () => {
      setShowFilters(!showFilters);
    },
    onBulkActions: () => {
      // Bulk actions are visible when items are selected
      console.log("Bulk actions");
    },
    onViewTable: () => {
      setViewMode("table");
    },
    onViewGrid: () => {
      setViewMode("grid");
    },
    onViewMap: () => {
      setViewMode("map");
    },
    onEscape: () => {
      setSelectedIds([]);
      setShowExportDialog(false);
    },
  });

  const handleApplyFilter = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            العملاء الموحد
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            إدارة شاملة لدورة حياة العملاء في القطاع العقاري
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Requests Center Link */}
          <Link href="/ar/dashboard/customers-hub/requests" className="w-full sm:w-auto">
            <Button variant="default" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="hidden sm:inline">مركز الطلبات</span>
              <span className="sm:hidden">الطلبات</span>
              {pendingActionsCount > 0 && (
                <Badge className="bg-red-500 text-white ml-1 animate-pulse">
                  {pendingActionsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Assignment Panel */}
          <div className="hidden sm:block">
            <AssignmentPanel />
          </div>

          {/* Notifications */}
          <div className="hidden sm:block">
            <NotificationsCenter />
          </div>

          {/* Keyboard Shortcuts */}
          <div className="hidden md:block">
            <KeyboardShortcuts
              onNavigate={(route) => router.push(route)}
              onAction={(action) => {
                switch (action) {
                  case "search":
                    console.log("Search");
                    break;
                  case "add-customer":
                    setShowAddCustomerDialog(true);
                    break;
                  case "export":
                    setShowExportDialog(true);
                    break;
                  case "filters":
                    setShowFilters(!showFilters);
                    break;
                  case "view-table":
                    setViewMode("table");
                    break;
                  case "view-grid":
                    setViewMode("grid");
                    break;
                  case "view-map":
                    setViewMode("map");
                    break;
                }
              }}
            />
          </div>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="gap-2 flex-1 sm:flex-initial"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">تصدير</span>
          </Button>

          {/* Pipeline Link */}
          <Link href="/ar/dashboard/customers-hub/pipeline" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
              <KanbanSquare className="h-4 w-4" />
              <span className="hidden sm:inline">مسار المبيعات</span>
              <span className="sm:hidden">المسار</span>
            </Button>
          </Link>

          {/* AI Assistant Link */}
          <Link href="/ar/dashboard/customers-hub/ai-assistant" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
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
              <span className="hidden sm:inline">المساعد الذكي</span>
              <span className="sm:hidden">المساعد</span>
            </Button>
          </Link>

          {/* Analytics Link */}
          <Link href="/ar/dashboard/customers-hub/analytics" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
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
              <span className="hidden sm:inline">التحليلات</span>
              <span className="sm:hidden">تحليلات</span>
            </Button>
          </Link>

          <div className="w-full sm:w-auto">
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <CustomersDashboard />

      {/* Advanced Filters with Save Feature */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <AdvancedFilters />
        </div>
        <SavedFilters
          currentFilters={filters}
          onApplyFilter={handleApplyFilter}
        />
      </div>

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

          {/* Selection Info */}
          {selectedIds.length > 0 && (
            <div className="text-sm text-gray-600">
              تم تحديد {selectedIds.length} من {filteredCustomers.length} عميل
            </div>
          )}
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

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Quick Add FAB */}
      <QuickAddFAB
        onAddCustomer={() => setShowAddCustomerDialog(true)}
        onAddAppointment={() => {
          // TODO: Implement
          console.log("Add appointment");
        }}
        onAddReminder={() => {
          // TODO: Implement
          console.log("Add reminder");
        }}
        onAddNote={() => {
          // TODO: Implement
          console.log("Add note");
        }}
        onAddProperty={() => {
          // TODO: Implement
          console.log("Add property");
        }}
      />

      {/* Dialogs */}
      <AddCustomerDialog />
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        customers={filteredCustomers}
      />

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-800 rounded">?</kbd>
          <span>اضغط لعرض الاختصارات</span>
        </div>
      </div>
    </div>
  );
}
