/// <reference types="react" />
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
  canAccessArchive?: boolean;
  activeTab?: "form" | "owner";
  setActiveTab?: (tab: "form" | "owner") => void;
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
  canAccessArchive = false,
  activeTab = "form",
  setActiveTab,
}: PropertyFormActionsCardProps) {
  return (
    <Card className="border border-primary/20 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
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
            {canAccessArchive && setActiveTab && (
              <>
                {activeTab === "form" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("owner")}
                    disabled={isLoading || isCompletingDraft}
                    className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400"
                  >
                    الأرشيف
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("form")}
                    disabled={isLoading || isCompletingDraft}
                    className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400"
                  >
                    تفاصيل العقار
                  </Button>
                )}
              </>
            )}

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
