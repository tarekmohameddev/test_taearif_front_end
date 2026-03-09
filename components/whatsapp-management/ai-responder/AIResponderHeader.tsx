"use client";

import { Bot, CheckCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            إعدادات الذكاء الاصطناعي
          </h2>
          <p className="text-sm text-muted-foreground">
            {numberName
              ? `تكوين الرد الآلي لـ ${numberName}`
              : "تكوين الرد الآلي"}
          </p>
        </div>

        <Button onClick={onSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            تم حفظ الإعدادات بنجاح!
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
