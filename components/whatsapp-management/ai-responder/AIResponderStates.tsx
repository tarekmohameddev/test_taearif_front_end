"use client";

import { Bot } from "lucide-react";
import { WhatsAppNumberSelector } from "../WhatsAppNumberSelector";

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

interface AIResponderNoNumberStateProps {
  selectedNumberId: number | null;
  onNumberChange?: (numberId: number | null) => void;
}

export function AIResponderNoNumberState({
  selectedNumberId,
  onNumberChange,
}: AIResponderNoNumberStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-6 max-w-md">
        <Bot className="h-16 w-16 text-gray-300 mx-auto" />
        <h3 className="text-lg font-semibold text-black">اختر رقم واتساب</h3>
        <p className="text-sm text-gray-500">
          يرجى اختيار رقم واتساب من القائمة أعلاه لإدارة إعدادات الذكاء
          الاصطناعي
        </p>
        {onNumberChange && (
          <div className="flex justify-center pt-2">
            <WhatsAppNumberSelector
              selectedNumberId={selectedNumberId}
              onNumberChange={onNumberChange}
              showAllOption={true}
            />
          </div>
        )}
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
