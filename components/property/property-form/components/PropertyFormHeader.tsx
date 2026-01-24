"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyFormHeaderProps {
  mode: "add" | "edit";
  isDraft: boolean;
  pageTitle: string;
  submitButtonText: string;
  draftButtonText: string;
  activeTab: "form" | "owner";
  setActiveTab: (tab: "form" | "owner") => void;
  canAccessArchive: boolean;
  isLoading: boolean;
  isCompletingDraft: boolean;
  submitError: string | null;
  missingFieldsAr?: string[];
  validationErrors?: string[];
  onBack: () => void;
  onSave: (publish: boolean) => void;
  onCompleteDraft: () => void;
  router: any;
}

export default function PropertyFormHeader({
  mode,
  isDraft,
  pageTitle,
  submitButtonText,
  draftButtonText,
  activeTab,
  setActiveTab,
  canAccessArchive,
  isLoading,
  isCompletingDraft,
  submitError,
  missingFieldsAr = [],
  validationErrors = [],
  onBack,
  onSave,
  onCompleteDraft,
  router,
}: PropertyFormHeaderProps) {
  return (
    <>
      {isDraft && (missingFieldsAr.length > 0 || validationErrors.length > 0) && (
        <div className="space-y-4">
          {missingFieldsAr.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    الحقول المطلوبة المفقودة:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {missingFieldsAr.map((field, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-orange-100 text-orange-800 border-orange-300"
                      >
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">
                    أخطاء التحقق:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-800">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight truncate">
          {pageTitle}
        </h1>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {canAccessArchive && (
            <>
              {activeTab === "form" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("owner")}
                  className="gap-2 w-full sm:w-auto"
                >
                  الأرشيف
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("form")}
                  className="gap-2 w-full sm:w-auto"
                >
                  تفاصيل العقار
                </Button>
              )}
            </>
          )}
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
        {submitError && (
          <div className="text-red-500 text-sm mt-2 text-right w-full">
            {submitError}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
