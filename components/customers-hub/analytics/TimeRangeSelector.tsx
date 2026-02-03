"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, TrendingUp, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export type TimeRange =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "custom";

interface TimeRangeSelectorProps {
  value: TimeRange;
  customStartDate?: Date;
  customEndDate?: Date;
  onChange: (
    range: TimeRange,
    customDates?: { start: Date; end: Date }
  ) => void;
  showComparison?: boolean;
  onComparisonChange?: (enabled: boolean) => void;
}

export function TimeRangeSelector({
  value,
  customStartDate,
  customEndDate,
  onChange,
  showComparison = false,
  onComparisonChange,
}: TimeRangeSelectorProps) {
  const [showCustomCalendar, setShowCustomCalendar] = React.useState(false);
  const [tempStartDate, setTempStartDate] = React.useState<Date | undefined>(
    customStartDate
  );
  const [tempEndDate, setTempEndDate] = React.useState<Date | undefined>(
    customEndDate
  );
  const [compareEnabled, setCompareEnabled] = React.useState(false);

  const timeRangeOptions = [
    { value: "today", label: "اليوم" },
    { value: "yesterday", label: "أمس" },
    { value: "last7days", label: "آخر 7 أيام" },
    { value: "last30days", label: "آخر 30 يوم" },
    { value: "thisMonth", label: "هذا الشهر" },
    { value: "lastMonth", label: "الشهر الماضي" },
    { value: "thisQuarter", label: "هذا الربع" },
    { value: "lastQuarter", label: "الربع الماضي" },
    { value: "thisYear", label: "هذا العام" },
    { value: "lastYear", label: "العام الماضي" },
    { value: "custom", label: "نطاق مخصص" },
  ];

  const getDateRange = (range: TimeRange): { start: Date; end: Date } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case "today":
        return { start: today, end: now };
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: today };
      case "last7days":
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        return { start: last7, end: now };
      case "last30days":
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        return { start: last30, end: now };
      case "thisMonth":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now,
        };
      case "lastMonth":
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: lastMonthStart, end: lastMonthEnd };
      case "thisQuarter":
        const quarterStart = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        return { start: quarterStart, end: now };
      case "lastQuarter":
        const lastQuarterStart = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3 - 3,
          1
        );
        const lastQuarterEnd = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          0
        );
        return { start: lastQuarterStart, end: lastQuarterEnd };
      case "thisYear":
        return { start: new Date(now.getFullYear(), 0, 1), end: now };
      case "lastYear":
        return {
          start: new Date(now.getFullYear() - 1, 0, 1),
          end: new Date(now.getFullYear() - 1, 11, 31),
        };
      case "custom":
        return {
          start: customStartDate || today,
          end: customEndDate || now,
        };
      default:
        return { start: today, end: now };
    }
  };

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      onChange("custom", { start: tempStartDate, end: tempEndDate });
      setShowCustomCalendar(false);
    }
  };

  const handleToggleComparison = () => {
    const newValue = !compareEnabled;
    setCompareEnabled(newValue);
    onComparisonChange?.(newValue);
  };

  const currentRange = getDateRange(value);
  const label =
    timeRangeOptions.find((opt) => opt.value === value)?.label || "نطاق مخصص";

  return (
    <div className="flex items-center gap-3">
      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-gray-500" />
        <Select value={value} onValueChange={(v: TimeRange) => onChange(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Date Range Picker */}
      {value === "custom" && (
        <Popover open={showCustomCalendar} onOpenChange={setShowCustomCalendar}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {tempStartDate && tempEndDate ? (
                <span>
                  {format(tempStartDate, "dd/MM/yyyy", { locale: ar })} -{" "}
                  {format(tempEndDate, "dd/MM/yyyy", { locale: ar })}
                </span>
              ) : (
                "اختر النطاق"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" dir="rtl">
            <div className="flex gap-4 p-4">
              <div>
                <div className="text-sm font-medium mb-2">من</div>
                <Calendar
                  mode="single"
                  selected={tempStartDate}
                  onSelect={setTempStartDate}
                  locale={ar}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">إلى</div>
                <Calendar
                  mode="single"
                  selected={tempEndDate}
                  onSelect={setTempEndDate}
                  locale={ar}
                  disabled={(date) =>
                    tempStartDate ? date < tempStartDate : false
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomCalendar(false)}
              >
                إلغاء
              </Button>
              <Button
                size="sm"
                onClick={handleApplyCustomRange}
                disabled={!tempStartDate || !tempEndDate}
              >
                تطبيق
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Current Range Display */}
      <Badge variant="secondary" className="gap-2">
        {format(currentRange.start, "dd MMM", { locale: ar })}
        <ArrowRight className="h-3 w-3" />
        {format(currentRange.end, "dd MMM yyyy", { locale: ar })}
      </Badge>

      {/* Comparison Toggle */}
      {showComparison && (
        <Button
          variant={compareEnabled ? "default" : "outline"}
          size="sm"
          onClick={handleToggleComparison}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          {compareEnabled ? "إلغاء المقارنة" : "مقارنة بالفترة السابقة"}
        </Button>
      )}
    </div>
  );
}

// Hook to calculate comparison metrics
export function useTimeRangeComparison(
  range: TimeRange,
  customDates?: { start: Date; end: Date }
) {
  const getPreviousPeriod = (
    start: Date,
    end: Date
  ): { start: Date; end: Date } => {
    const duration = end.getTime() - start.getTime();
    const previousEnd = new Date(start.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - duration);
    return { start: previousStart, end: previousEnd };
  };

  const currentPeriod =
    range === "custom" && customDates
      ? customDates
      : (() => {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          // Simplified - use TimeRangeSelector's getDateRange logic
          return { start: today, end: now };
        })();

  const previousPeriod = getPreviousPeriod(
    currentPeriod.start,
    currentPeriod.end
  );

  return {
    currentPeriod,
    previousPeriod,
  };
}
