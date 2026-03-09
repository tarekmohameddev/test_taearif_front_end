"use client";

import { Bot } from "lucide-react";

export function AIResponderLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
}

export function AIResponderNoNumberState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Bot className="h-16 w-16 text-muted-foreground/50 mx-auto" />
        <h3 className="text-lg font-semibold">اختر رقم واتساب</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          يرجى اختيار رقم واتساب من القائمة أعلاه لإدارة إعدادات الذكاء
          الاصطناعي
        </p>
      </div>
    </div>
  );
}

export function AIResponderConfigErrorState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">فشل في تحميل الإعدادات</p>
      </div>
    </div>
  );
}
