"use client";

import { Bot, CheckCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIResponderHeaderProps {
  numberName: string;
  isSaving: boolean;
  onSave: () => void;
  saveSuccess: boolean;
}

export function AIResponderHeader({
  numberName,
  isSaving,
  onSave,
  saveSuccess,
}: AIResponderHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            <Bot className="h-5 w-5 text-black" />
            إعدادات الذكاء الاصطناعي
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {numberName
              ? `تكوين الرد الآلي لـ ${numberName}`
              : "تكوين الرد الآلي"}
          </p>
        </div>

        <Button
          onClick={onSave}
          disabled={isSaving}
          className="gap-2 bg-black hover:bg-gray-800 text-white border-0"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700">
          <CheckCircle className="h-4 w-4 text-black shrink-0" />
          <span>تم حفظ الإعدادات بنجاح!</span>
        </div>
      )}
    </>
  );
}
