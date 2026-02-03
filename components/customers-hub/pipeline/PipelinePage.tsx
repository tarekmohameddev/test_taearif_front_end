"use client";

import React, { useState } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, KanbanSquare, Maximize2, Minimize2 } from "lucide-react";
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

export function PipelinePage() {
  const { customers, setViewMode } = useUnifiedCustomersStore();
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

  return (
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
            <span className="font-semibold">{customers.length}</span> عميل إجمالاً
          </div>
          
          <Select value={pipelineView} onValueChange={(v: any) => setPipelineView(v)}>
            <SelectTrigger className="w-40">
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
      <StageAnalytics />

      {/* Pipeline Board */}
      {pipelineView === "enhanced" ? (
        <EnhancedPipelineBoard />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            العرض الكلاسيكي قيد التطوير. يرجى استخدام العرض المحسّن.
          </p>
        </div>
      )}
    </div>
  );
}
