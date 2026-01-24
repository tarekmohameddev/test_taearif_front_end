"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface PropertyFormActionsCardProps {
  mode: "add" | "edit";
  isDraft: boolean;
  isLoading: boolean;
  isCompletingDraft: boolean;
  submitError: string | null;
  draftButtonText: string;
  submitButtonText: string;
  onBack: () => void;
  onSave: (publish: boolean) => void;
  onCompleteDraft: () => void;
}

export default function PropertyFormActionsCard({
  mode,
  isDraft,
  isLoading,
  isCompletingDraft,
  submitError,
  draftButtonText,
  submitButtonText,
  onBack,
  onSave,
  onCompleteDraft,
}: PropertyFormActionsCardProps) {
  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="pb-2 border-b">
            <h3 className="text-lg font-semibold">إجراءات الحفظ</h3>
            <p className="text-sm text-muted-foreground mt-1">
              احفظ أو انشر الوحدة أو عد للخلف
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800 flex-1">
                  {submitError || "حدث خطأ أثناء حفظ الوحدة. يرجى المحاولة مرة أخرى."}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading || isCompletingDraft}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>

            {isDraft ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => onSave(false)}
                  disabled={isLoading || isCompletingDraft}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
                <Button
                  onClick={onCompleteDraft}
                  disabled={isLoading || isCompletingDraft}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  {isCompletingDraft ? "جاري الإكمال..." : "إكمال المسودة"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => onSave(false)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "جاري الحفظ..." : draftButtonText}
                </Button>
                <Button
                  onClick={() => onSave(true)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "جاري الحفظ..." : submitButtonText}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
