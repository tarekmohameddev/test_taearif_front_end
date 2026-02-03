import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Keyboard, X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              اختصارات لوحة المفاتيح
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span>تحديد الكل</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Ctrl + A</kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>إلغاء التحديد</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Esc</kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>إكمال المحدد</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Ctrl + Enter</kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>رفض المحدد</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Delete</kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>تراجع</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Ctrl + Z</kbd>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>إظهار/إخفاء هذه النافذة</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">?</kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
