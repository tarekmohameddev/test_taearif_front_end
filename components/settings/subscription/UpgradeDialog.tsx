"use client";

import { Sparkles, RefreshCw, CreditCardIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check } from "lucide-react";
import type { SubscriptionPlan } from "@/components/settings/types";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: SubscriptionPlan | null;
  selectedMonths: number[];
  onMonthsChange: (value: number[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
  isYearlyPlan: (plan: SubscriptionPlan) => boolean;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  selectedPlan,
  selectedMonths,
  onMonthsChange,
  onConfirm,
  onCancel,
  isProcessing,
  isYearlyPlan,
}: UpgradeDialogProps) {
  const isYearly = selectedPlan ? isYearlyPlan(selectedPlan) : false;
  const maxMonths = isYearly ? 5 : 24;
  const periodLabel = isYearly
    ? selectedMonths[0] === 1
      ? "سنة"
      : "سنة"
    : selectedMonths[0] === 1
      ? "شهر"
      : "شهر";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-2xl h-[90vh] max-h-[800px] p-0 overflow-hidden overflow-x-hidden flex flex-col"
        dir="rtl"
      >
        <div className="relative flex flex-col h-full" dir="rtl">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-black to-gray-800" />
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-300 rounded-full opacity-20 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-400 rounded-full opacity-20 animate-pulse delay-1000" />

          <div
            className="relative p-4 md:p-8 flex-1 overflow-y-auto overflow-x-hidden"
            dir="rtl"
          >
            <DialogHeader
              className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8"
              dir="rtl"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gray-200 rounded-full opacity-30 scale-150 animate-pulse" />
                <div className="relative w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 text-right mb-2">
                ترقية خطة الاشتراك
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 text-right">
                اختر مدة الاشتراك المناسبة لك واستمتع بجميع الميزات المتقدمة
              </DialogDescription>
            </DialogHeader>

            {selectedPlan && (
              <div
                className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8"
                dir="rtl"
              >
                <div
                  className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-300 shadow-xl"
                  dir="rtl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                      {selectedPlan.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {isYearlyPlan(selectedPlan) ? "سنة /" : "شهر /"}
                      </span>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                        {selectedPlan.price}
                      </span>
                      <img
                        src="/Saudi_Riyal_Symbol.svg"
                        alt="ريال سعودي"
                        className="w-6 h-6 filter brightness-0 contrast-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {selectedPlan.features &&
                      typeof selectedPlan.features === "object" &&
                      (Object.values(selectedPlan.features)
                        .flat() as string[])
                        .slice(0, 4)
                        .map((feature, index) => (
                          <div
                            key={`${feature}-${index}`}
                            className="flex items-center gap-2"
                          >
                            <span className="text-xs sm:text-sm text-gray-700">
                              {feature}
                            </span>
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                              <Check className="w-3 h-3 text-gray-700" />
                            </div>
                          </div>
                        ))}
                  </div>
                </div>

                <div
                  className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-300 shadow-xl"
                  dir="rtl"
                >
                  <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2">
                      {isYearlyPlan(selectedPlan)
                        ? "مدة الاشتراك السنوي"
                        : "مدة الاشتراك الشهري"}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {isYearlyPlan(selectedPlan)
                        ? "اختر عدد السنوات التي تريد الاشتراك بها"
                        : "اختر عدد الشهور التي تريد الاشتراك بها"}
                    </p>
                  </div>
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                    <div className="px-4">
                      <Slider
                        value={selectedMonths}
                        onValueChange={onMonthsChange}
                        max={maxMonths}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs sm:text-sm text-gray-500">
                        {isYearly ? "سنة 5" : "شهر 24"}
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                          {selectedMonths[0]}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {periodLabel}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {isYearly ? "سنة 1" : "شهر 1"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-gray-800 rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 text-white shadow-2xl"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold">
                      المبلغ الإجمالي
                    </h4>
                    <div className="text-left">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                        {(
                          parseFloat(String(selectedPlan.price)) *
                          selectedMonths[0]
                        ).toFixed(2)}
                      </div>
                      <div className="text-gray-300 text-xs sm:text-sm">
                        ريال سعودي
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-xs sm:text-sm">
                      {selectedMonths[0] === 1
                        ? "دفعة واحدة"
                        : `${selectedMonths[0]} دفعة`}
                    </span>
                    <span>
                      {isYearlyPlan(selectedPlan)
                        ? `سنة ${selectedMonths[0]} × ${selectedPlan.price}`
                        : `شهر ${selectedMonths[0]} × ${selectedPlan.price}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter
              className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 flex flex-col md:flex-row gap-3 sm:gap-4 flex-shrink-0"
              dir="rtl"
            >
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 py-2 md:py-3 text-sm sm:text-base md:text-lg font-semibold"
                disabled={isProcessing}
              >
                إلغاء
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isProcessing}
                className="flex-1 py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span>جاري المعالجة...</span>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>تأكيد الدفع</span>
                    <CreditCardIcon className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
