"use client";

import React, { useEffect, useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ["Ctrl", "K"], description: "فتح البحث السريع", category: "التنقل" },
  { keys: ["Ctrl", "H"], description: "العودة للصفحة الرئيسية", category: "التنقل" },
  { keys: ["Ctrl", "P"], description: "عرض Pipeline", category: "التنقل" },
  { keys: ["Ctrl", "A"], description: "عرض التحليلات", category: "التنقل" },
  { keys: ["Ctrl", "I"], description: "المساعد الذكي", category: "التنقل" },
  
  // Views
  { keys: ["1"], description: "عرض جدول", category: "العرض" },
  { keys: ["2"], description: "عرض شبكة", category: "العرض" },
  { keys: ["3"], description: "عرض خريطة", category: "العرض" },
  
  // Actions
  { keys: ["Ctrl", "N"], description: "إضافة عميل جديد", category: "الإجراءات" },
  { keys: ["Ctrl", "E"], description: "تصدير البيانات", category: "الإجراءات" },
  { keys: ["Ctrl", "F"], description: "فتح الفلاتر المتقدمة", category: "الإجراءات" },
  { keys: ["Ctrl", "B"], description: "الإجراءات الجماعية", category: "الإجراءات" },
  
  // Selection
  { keys: ["Ctrl", "Click"], description: "تحديد متعدد", category: "التحديد" },
  { keys: ["Shift", "Click"], description: "تحديد نطاق", category: "التحديد" },
  { keys: ["Ctrl", "A"], description: "تحديد الكل", category: "التحديد" },
  { keys: ["Escape"], description: "إلغاء التحديد", category: "التحديد" },
  
  // General
  { keys: ["?"], description: "عرض اختصارات لوحة المفاتيح", category: "عام" },
  { keys: ["Ctrl", "S"], description: "حفظ", category: "عام" },
  { keys: ["Escape"], description: "إغلاق النوافذ المنبثقة", category: "عام" },
];

interface KeyboardShortcutsProps {
  onNavigate?: (route: string) => void;
  onAction?: (action: string) => void;
}

export function KeyboardShortcuts({ onNavigate, onAction }: KeyboardShortcutsProps) {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowDialog(true);
        return;
      }

      // Ctrl/Cmd combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "k":
            e.preventDefault();
            onAction?.("search");
            break;
          case "h":
            e.preventDefault();
            onNavigate?.("/ar/dashboard/customers-hub");
            break;
          case "p":
            e.preventDefault();
            onNavigate?.("/ar/dashboard/customers-hub/pipeline");
            break;
          case "a":
            if (e.shiftKey) {
              e.preventDefault();
              onNavigate?.("/ar/dashboard/customers-hub/analytics");
            }
            break;
          case "i":
            e.preventDefault();
            onNavigate?.("/ar/dashboard/customers-hub/ai-assistant");
            break;
          case "n":
            e.preventDefault();
            onAction?.("add-customer");
            break;
          case "e":
            e.preventDefault();
            onAction?.("export");
            break;
          case "f":
            e.preventDefault();
            onAction?.("filters");
            break;
          case "b":
            e.preventDefault();
            onAction?.("bulk-actions");
            break;
          case "s":
            e.preventDefault();
            onAction?.("save");
            break;
        }
      }

      // Number keys for view switching
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key) {
          case "1":
            onAction?.("view-table");
            break;
          case "2":
            onAction?.("view-grid");
            break;
          case "3":
            onAction?.("view-map");
            break;
        }
      }

      // Escape key
      if (e.key === "Escape") {
        onAction?.("escape");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate, onAction]);

  const groupedShortcuts = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="gap-2"
      >
        <Keyboard className="h-4 w-4" />
        اختصارات
      </Button>

      {/* Shortcuts Dialog */}
      <CustomDialog open={showDialog} onOpenChange={setShowDialog} maxWidth="max-w-2xl">
        <CustomDialogContent className="dir-rtl">
          <CustomDialogClose onClose={() => setShowDialog(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              اختصارات لوحة المفاتيح
            </CustomDialogTitle>
            <CustomDialogDescription>
              استخدم هذه الاختصارات للتنقل بشكل أسرع
            </CustomDialogDescription>
          </CustomDialogHeader>

          <div className="space-y-6 py-4 max-h-[500px] overflow-y-auto">
            {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <React.Fragment key={i}>
                            <Badge
                              variant="secondary"
                              className="px-2 py-1 text-xs font-mono"
                            >
                              {key}
                            </Badge>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4 border-t px-4 sm:px-6">
            <Command className="h-3 w-3" />
            <span>اضغط ? لعرض هذه النافذة في أي وقت</span>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </>
  );
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts(handlers: {
  onSearch?: () => void;
  onAddCustomer?: () => void;
  onExport?: () => void;
  onFilters?: () => void;
  onBulkActions?: () => void;
  onViewTable?: () => void;
  onViewGrid?: () => void;
  onViewMap?: () => void;
  onEscape?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "k":
            e.preventDefault();
            handlers.onSearch?.();
            break;
          case "n":
            e.preventDefault();
            handlers.onAddCustomer?.();
            break;
          case "e":
            e.preventDefault();
            handlers.onExport?.();
            break;
          case "f":
            e.preventDefault();
            handlers.onFilters?.();
            break;
          case "b":
            e.preventDefault();
            handlers.onBulkActions?.();
            break;
        }
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key) {
          case "1":
            handlers.onViewTable?.();
            break;
          case "2":
            handlers.onViewGrid?.();
            break;
          case "3":
            handlers.onViewMap?.();
            break;
        }
      }

      if (e.key === "Escape") {
        handlers.onEscape?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
