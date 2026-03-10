"use client";

import { Bot } from "lucide-react";

export function AIResponderLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black mx-auto" />
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    </div>
  );
}

export function AIResponderNoNumberState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Bot className="h-16 w-16 text-gray-300 mx-auto" />
        <h3 className="text-lg font-semibold text-black">اختر رقم واتساب</h3>
        <p className="text-sm text-gray-500 max-w-md">
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
        <p className="text-gray-500">فشل في تحميل الإعدادات</p>
      </div>
    </div>
  );
}
