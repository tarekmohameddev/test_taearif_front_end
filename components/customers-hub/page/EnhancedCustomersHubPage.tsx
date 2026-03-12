"use client";

import React, { useState, useEffect } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { CustomersDashboard } from "./CustomersDashboard";
import { CustomersTable } from "./CustomersTable";
import { CustomersMap } from "./CustomersMap";
import { CustomersGrid } from "./CustomersGrid";
import { QuickActions } from "./QuickActions";
import { FiltersBar } from "../filters/FiltersBar";
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
import type { CustomerFilters, UnifiedCustomer } from "@/types/unified-customer";
import type { CustomersListParams } from "@/lib/services/customers-hub-list-api";

interface EnhancedCustomersHubPageProps {
  customers?: UnifiedCustomer[];
  stats?: any;
  filterOptions?: any;
  loading?: boolean;
  error?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onFetchCustomers?: (params: CustomersListParams) => Promise<void>;
}

export function EnhancedCustomersHubPage(props?: EnhancedCustomersHubPageProps) {
  const router = useRouter();
  const viewMode = useUnifiedCustomersStore((state) => state.viewMode);
  const setViewMode = useUnifiedCustomersStore((state) => state.setViewMode);
  const setShowAddCustomerDialog = useUnifiedCustomersStore(
    (state) => state.setShowAddCustomerDialog,
  );
  const storeCustomers = useUnifiedCustomersStore((state) => state.customers);
  const filters = useUnifiedCustomersStore((state) => state.filters);
  const setFilters = useUnifiedCustomersStore((state) => state.setFilters);
  const getPendingActionsCount = useUnifiedCustomersStore(
    (state) => state.getPendingActionsCount,
  );
  const setStoreCustomers = useUnifiedCustomersStore(
    (state) => state.setCustomers,
  );

  // Use prop customers if provided, otherwise use store customers
  const customers = props?.customers ?? storeCustomers;
  const apiStats = props?.stats;
  const apiFilterOptions = props?.filterOptions;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;
  const apiPagination = props?.pagination;

  // Update store if prop customers are provided
  React.useEffect(() => {
    if (props?.customers && props.customers.length > 0) {
      setStoreCustomers(props.customers);
    }
  }, [props?.customers, setStoreCustomers]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get pending actions count
  const pendingActionsCount = getPendingActionsCount();

  // Keyboard shortcuts handlers - MUST be called before any early returns
  useKeyboardShortcuts({
    onSearch: () => {
      // TODO: Implement search
      console.log("Search triggered");
    },
    onAddCustomer: () => {
      router.push("/ar/dashboard/customers-hub/add");
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

  // Get filtered customers - use prop customers if available
  const filteredCustomers = customers; // Already filtered by store or from API

  const handleApplyFilter = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
  };

  /** بناء params الطلب للـ API من الفلاتر الحالية (مرحلة، موظف، أولويات، مصدر، نوع العقار تُرسل مباشرة) */
  const buildListParams = (effective: CustomerFilters): CustomersListParams => ({
    action: "list",
    includeStats: true,
    filters: {
      search: effective.search || undefined,
      stage: (effective.stage?.length ? effective.stage : undefined) as string[] | undefined,
      priority: (effective.priorityIds?.length ? effective.priorityIds : undefined) ?? (effective.priority?.length
        ? effective.priority.map((p) => (typeof p === "number" ? p : (apiFilterOptions?.priorities?.find((pr) => pr.name === p)?.id ?? 0))).filter((id) => id > 0)
        : undefined),
      type: (effective.typeIds?.length ? effective.typeIds : undefined) ?? (effective.propertyType?.length
        ? effective.propertyType.map((t) => (typeof t === "number" ? t : (apiFilterOptions?.types?.find((ty) => ty.name === t)?.id ?? 0))).filter((id) => id > 0)
        : undefined),
      city: effective.city?.length ? effective.city : undefined,
      district: effective.district?.length ? effective.district : undefined,
      assignedTo: effective.assignedEmployee?.length
        ? effective.assignedEmployee.map((id) => parseInt(String(id), 10)).filter((n) => !isNaN(n))
        : undefined,
      source: effective.source?.length ? effective.source : undefined,
    },
    pagination: apiPagination
      ? { page: apiPagination.currentPage, limit: apiPagination.itemsPerPage }
      : { page: 1, limit: 50 },
    sorting: { field: "created_at", order: "desc" },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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

          {/* Notifications - Hidden */}
          {/* <div className="hidden sm:block">
            <NotificationsCenter />
          </div> */}

          {/* Keyboard Shortcuts - Hidden */}
          {/* <div className="hidden md:block">
            <KeyboardShortcuts
              onNavigate={(route) => router.push(route)}
              onAction={(action) => {
                switch (action) {
                  case "search":
                    console.log("Search");
                    break;
                  case "add-customer":
                    router.push("/ar/dashboard/customers-hub/add");
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
          </div> */}

          {/* Export - Hidden */}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="gap-2 flex-1 sm:flex-initial"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">تصدير</span>
          </Button> */}

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
      <CustomersDashboard stats={apiStats} />

      {/* Filters Bar — الفلاتر تُرسل مباشرة في params الـ API عند كل تغيير */}
      <FiltersBar 
        filterOptions={apiFilterOptions}
        onSearch={(query) => {
          setFilters({ search: query || undefined });
          const effective = { ...filters, search: query || undefined };
          if (props?.onFetchCustomers) {
            props.onFetchCustomers(buildListParams(effective));
          }
        }}
        onApplyFilters={(override?: Partial<CustomerFilters>) => {
          if (override) setFilters(override);
          const effective = { ...filters, ...override };
          if (props?.onFetchCustomers) {
            props.onFetchCustomers(buildListParams(effective));
          }
        }}
      />

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
        onAddCustomer={() => router.push("/ar/dashboard/customers-hub/add")}
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
      </div>
    </div>
  );
}
