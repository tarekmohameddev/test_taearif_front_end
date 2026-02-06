"use client";

import React, { useState, useEffect, useRef } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, KanbanSquare, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { StageAnalytics } from "./StageAnalytics";
import { EnhancedPipelineBoard } from "./EnhancedPipelineBoard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { PipelineStage, PipelineAnalytics } from "@/lib/services/customers-hub-pipeline-api";
import type { PipelineBoardParams } from "@/lib/services/customers-hub-pipeline-api";
import type { MoveCustomerParams } from "@/lib/services/customers-hub-pipeline-api";

interface PipelinePageProps {
  stages?: PipelineStage[];
  analytics?: PipelineAnalytics | null;
  filterOptions?: any;
  totalCustomers?: number;
  loading?: boolean;
  error?: string | null;
  onFetchPipelineBoard?: (params: PipelineBoardParams) => Promise<void>;
  onMoveCustomer?: (params: MoveCustomerParams) => Promise<boolean>;
}

export function PipelinePage(props?: PipelinePageProps) {
  const store = useUnifiedCustomersStore();
  const { customers: storeCustomers, setViewMode, setCustomers: setStoreCustomers } = store;
  
  // Use prop stages if provided, otherwise use store customers
  const stages = props?.stages;
  const analytics = props?.analytics;
  const apiTotalCustomers = props?.totalCustomers;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;
  
  // Calculate total customers: use API value if available, otherwise calculate from stages or store
  const totalCustomers = apiTotalCustomers !== undefined
    ? apiTotalCustomers
    : stages && stages.length > 0
    ? stages.reduce((sum, stage) => sum + (stage.customerCount || 0), 0)
    : storeCustomers.length || 0;

  // Track last stages IDs to avoid infinite loop
  const lastStagesRef = useRef<string>("");
  
  // Update store if prop stages are provided
  useEffect(() => {
    if (stages && stages.length > 0) {
      // Create a unique key from stages to detect changes
      const stagesKey = JSON.stringify(stages.map(s => `${s.id}-${s.customerCount}`));
      
      // Only update if stages actually changed
      if (stagesKey !== lastStagesRef.current) {
        // Extract all customers from stages and update store
        const allCustomers = stages.flatMap(stage => stage.customers);
        if (allCustomers.length > 0) {
          setStoreCustomers(allCustomers);
          lastStagesRef.current = stagesKey;
        }
      }
    }
  }, [stages, setStoreCustomers]);

  const [pipelineView, setPipelineView] = useState<"enhanced" | "classic">("enhanced");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Show loading state
  if (apiLoading && (!stages || stages.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="text-gray-600 dark:text-gray-400">جاري تحميل مسار المبيعات...</p>
      </div>
    );
  }

  // Show error state
  if (apiError && (!stages || stages.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{apiError}</p>
            <Button onClick={() => props?.onFetchPipelineBoard?.({
              action: "board",
              includeAnalytics: true,
            })}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/ar/dashboard/customers-hub">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <KanbanSquare className="h-8 w-8" />
                مسار المبيعات
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                إدارة دورة حياة العملاء في القطاع العقاري
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{totalCustomers}</span> عميل إجمالاً
          </div>
          
          <Select value={pipelineView} onValueChange={(v: any) => setPipelineView(v)}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enhanced">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">جديد</Badge>
                  محسّن (سحب وإفلات)
                </div>
              </SelectItem>
              <SelectItem value="classic">كلاسيكي</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="gap-2"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                خروج من وضع ملء الشاشة
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                ملء الشاشة
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analytics */}
      <StageAnalytics analytics={analytics} />

      {/* Pipeline Board */}
      {pipelineView === "enhanced" ? (
        <EnhancedPipelineBoard 
          stages={stages}
          onMoveCustomer={props?.onMoveCustomer}
        />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            العرض الكلاسيكي قيد التطوير. يرجى استخدام العرض المحسّن.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
