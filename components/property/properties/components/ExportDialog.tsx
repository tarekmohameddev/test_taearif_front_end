"use client";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exportDateRange: DateRange | undefined;
  setExportDateRange: (range: DateRange | undefined) => void;
  isExporting: boolean;
  onExport: () => void;
}

export function ExportDialog({
  isOpen,
  onClose,
  exportDateRange,
  setExportDateRange,
  isExporting,
  onExport,
}: ExportDialogProps) {
  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      maxWidth="max-w-2xl"
    >
      <CustomDialogContent>
        <CustomDialogClose onClose={onClose} />
        <CustomDialogHeader>
          <CustomDialogTitle>تصدير الوحدات</CustomDialogTitle>
          <CustomDialogDescription>
            حدد نطاق التاريخ للوحدات التي تريد تصديرها
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="px-4 sm:px-6 py-4">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">نطاق التاريخ</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={exportDateRange}
                  onSelect={setExportDateRange}
                  numberOfMonths={2}
                  locale={ar}
                  toDate={new Date()}
                  className="rounded-md border"
                />
              </div>
              {exportDateRange?.from && exportDateRange?.to && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    <strong>الفترة المحددة:</strong>{" "}
                    {format(exportDateRange.from, "yyyy-MM-dd", { locale: ar })} -{" "}
                    {format(exportDateRange.to, "yyyy-MM-dd", { locale: ar })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            إلغاء
          </Button>
          <Button
            onClick={onExport}
            disabled={!exportDateRange?.from || !exportDateRange?.to || isExporting}
          >
            {isExporting ? "جاري التصدير..." : "تصدير"}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}
