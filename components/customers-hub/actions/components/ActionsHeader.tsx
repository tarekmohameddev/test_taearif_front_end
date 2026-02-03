import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Zap,
  Sparkles,
  Undo2,
  LayoutGrid,
  LayoutList,
  CalendarDays,
  Keyboard,
  RefreshCcw,
  FileSpreadsheet,
  Bell,
} from "lucide-react";

interface ActionsHeaderProps {
  undoStackLength: number;
  onUndo: () => void;
  isCompactView: boolean;
  onToggleCompactView: () => void;
  showDueDateGroups: boolean;
  onToggleDueDateGroups: () => void;
  onToggleKeyboardShortcuts: () => void;
  onExportCSV: () => void;
}

export function ActionsHeader({
  undoStackLength,
  onUndo,
  isCompactView,
  onToggleCompactView,
  showDueDateGroups,
  onToggleDueDateGroups,
  onToggleKeyboardShortcuts,
  onExportCSV,
}: ActionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Link href="/ar/dashboard/customers-hub/list">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            قائمة العملاء
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white">
              <Zap className="h-6 w-6" />
            </div>
            مركز الإجراءات
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            إجراءات العملاء التي تتطلب اهتمامك
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* Undo Button */}
          {undoStackLength > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onUndo}
                  className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Undo2 className="h-4 w-4" />
                  تراجع
                  <Badge variant="secondary" className="text-xs">
                    {undoStackLength}
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>التراجع عن آخر إجراء (Ctrl+Z)</TooltipContent>
            </Tooltip>
          )}

          {/* View Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isCompactView ? "default" : "outline"} 
                size="icon"
                onClick={onToggleCompactView}
              >
                {isCompactView ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isCompactView ? "العرض العادي" : "العرض المضغوط"}</TooltipContent>
          </Tooltip>

          {/* Due Date Grouping Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showDueDateGroups ? "default" : "outline"} 
                size="icon"
                onClick={onToggleDueDateGroups}
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تجميع حسب تاريخ الاستحقاق</TooltipContent>
          </Tooltip>

          {/* Keyboard Shortcuts Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onToggleKeyboardShortcuts}
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="text-sm space-y-1">
                <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+A</kbd> تحديد الكل</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Esc</kbd> إلغاء التحديد</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+Enter</kbd> إكمال المحدد</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Delete</kbd> رفض المحدد</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+Z</kbd> تراجع</p>
              </div>
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>

          {/* Export Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onExportCSV}>
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تصدير إلى Excel</TooltipContent>
          </Tooltip>

          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
}
