import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { DateRange } from "react-day-picker";
import type { ImportResult } from "../types/properties.types";
import {
  downloadTemplate,
  importProperties,
  exportProperties,
} from "../services/properties.api";

export const useImportExport = (
  currentPage: number,
  newFilters: Record<string, any>,
  fetchProperties: (page: number, filters: any) => void
) => {
  const router = useRouter();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>(undefined);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".xls") &&
        !file.name.endsWith(".csv")
      ) {
        toast.error("يرجى رفع ملف Excel صحيح (.xlsx, .xls, .csv)");
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى المسموح به هو 10MB");
        return;
      }

      setImportFile(file);
      setImportResult(null);
    }
  }, []);

  const handleDownloadTemplate = useCallback(async () => {
    setIsDownloadingTemplate(true);
    try {
      await downloadTemplate();
      toast.success("تم تحميل القالب بنجاح");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء تحميل القالب";
      toast.error(errorMessage);
    } finally {
      setIsDownloadingTemplate(false);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!importFile) {
      toast.error("يرجى اختيار ملف للاستيراد");
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importProperties(
        importFile,
        (result) => {
          setImportResult(result);
          fetchProperties(currentPage, newFilters);
          if (result.incomplete_count && result.incomplete_count > 0) {
            toast.success(
              `تم الاستيراد! ${result.imported_count || 0} وحدة مكتملة و ${result.incomplete_count} مسودة.`,
              {
                duration: 5000,
                action: {
                  label: "عرض المسودات",
                  onClick: () => router.push("/dashboard/properties/incomplete"),
                },
              }
            );
          }
        },
        (result) => {
          setImportResult(result);
        }
      );
    } catch (error) {
      console.error("Error importing properties:", error);
    } finally {
      setIsImporting(false);
    }
  }, [importFile, currentPage, newFilters, fetchProperties, router]);

  const handleExport = useCallback(async () => {
    if (!exportDateRange?.from || !exportDateRange?.to) {
      toast.error("يرجى تحديد نطاق التاريخ للتصدير");
      return;
    }

    setIsExporting(true);
    setExportDialogOpen(false);

    try {
      await exportProperties(exportDateRange, newFilters);
      toast.success("تم تصدير الوحدات بنجاح");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء تصدير الوحدات";
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, [exportDateRange, newFilters]);

  return {
    // Import states
    importDialogOpen,
    setImportDialogOpen,
    importFile,
    setImportFile,
    isImporting,
    isDownloadingTemplate,
    importResult,
    setImportResult,
    // Export states
    isExporting,
    exportDialogOpen,
    setExportDialogOpen,
    exportDateRange,
    setExportDateRange,
    // Handlers
    handleFileChange,
    handleDownloadTemplate,
    handleImport,
    handleExport,
  };
};
