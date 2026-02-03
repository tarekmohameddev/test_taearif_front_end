"use client";

import React, { useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";
import type { UnifiedCustomer } from "@/types/unified-customer";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: UnifiedCustomer[];
}

const EXPORT_FIELDS = [
  { id: "name", label: "الاسم", checked: true },
  { id: "phone", label: "الهاتف", checked: true },
  { id: "email", label: "البريد الإلكتروني", checked: true },
  { id: "stage", label: "المرحلة", checked: true },
  { id: "priority", label: "الأولوية", checked: false },
  { id: "source", label: "المصدر", checked: false },
  { id: "propertyType", label: "نوع العقار", checked: true },
  { id: "budget", label: "الميزانية", checked: true },
  { id: "preferredAreas", label: "المناطق المفضلة", checked: false },
  { id: "timeline", label: "الإطار الزمني", checked: false },
  { id: "totalDealValue", label: "قيمة الصفقة", checked: true },
  { id: "lastContactAt", label: "آخر تواصل", checked: false },
  { id: "nextFollowUpDate", label: "موعد المتابعة", checked: false },
  { id: "assignedEmployee", label: "الموظف المعين", checked: false },
  { id: "createdAt", label: "تاريخ الإنشاء", checked: false },
  { id: "tags", label: "الوسوم", checked: false },
  { id: "interactions", label: "عدد التفاعلات", checked: false },
  { id: "appointments", label: "عدد المواعيد", checked: false },
  { id: "properties", label: "عدد العقارات المهتم بها", checked: false },
];

export function ExportDialog({ open, onOpenChange, customers }: ExportDialogProps) {
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("excel");
  const [selectedFields, setSelectedFields] = useState(
    EXPORT_FIELDS.filter((f) => f.checked).map((f) => f.id)
  );

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAll = () => {
    setSelectedFields(EXPORT_FIELDS.map((f) => f.id));
  };

  const selectNone = () => {
    setSelectedFields([]);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error("الرجاء اختيار حقل واحد على الأقل");
      return;
    }

    // Prepare data
    const exportData = customers.map((customer) => {
      const row: Record<string, any> = {};

      selectedFields.forEach((fieldId) => {
        switch (fieldId) {
          case "name":
            row["الاسم"] = customer.name;
            break;
          case "phone":
            row["الهاتف"] = customer.phone;
            break;
          case "email":
            row["البريد الإلكتروني"] = customer.email || "-";
            break;
          case "stage":
            row["المرحلة"] = customer.stage;
            break;
          case "priority":
            row["الأولوية"] = customer.priority;
            break;
          case "source":
            row["المصدر"] = customer.source;
            break;
          case "propertyType":
            row["نوع العقار"] = customer.preferences.propertyType.join(", ");
            break;
          case "budget":
            row["الميزانية"] = `${customer.preferences.budgetMin || 0} - ${customer.preferences.budgetMax || 0}`;
            break;
          case "preferredAreas":
            row["المناطق المفضلة"] = customer.preferences.preferredAreas.join(", ");
            break;
          case "timeline":
            row["الإطار الزمني"] = customer.preferences.timeline;
            break;
          case "totalDealValue":
            row["قيمة الصفقة"] = customer.totalDealValue || 0;
            break;
          case "lastContactAt":
            row["آخر تواصل"] = customer.lastContactAt
              ? new Date(customer.lastContactAt).toLocaleDateString("ar-SA")
              : "-";
            break;
          case "nextFollowUpDate":
            row["موعد المتابعة"] = customer.nextFollowUpDate
              ? new Date(customer.nextFollowUpDate).toLocaleDateString("ar-SA")
              : "-";
            break;
          case "assignedEmployee":
            row["الموظف المعين"] = customer.assignedEmployee?.name || "-";
            break;
          case "createdAt":
            row["تاريخ الإنشاء"] = new Date(customer.createdAt).toLocaleDateString("ar-SA");
            break;
          case "tags":
            row["الوسوم"] = customer.tags.join(", ");
            break;
          case "interactions":
            row["عدد التفاعلات"] = customer.totalInteractions || 0;
            break;
          case "appointments":
            row["عدد المواعيد"] = customer.totalAppointments || 0;
            break;
          case "properties":
            row["عدد العقارات المهتم بها"] = customer.properties.length;
            break;
        }
      });

      return row;
    });

    // Export based on format
    if (format === "csv") {
      exportToCSV(exportData);
    } else if (format === "excel") {
      exportToExcel(exportData);
    } else if (format === "pdf") {
      exportToPDF(exportData);
    }

    toast.success(`تم تصدير ${customers.length} عميل بنجاح`);
    onOpenChange(false);
  };

  const exportToCSV = (data: Record<string, any>[]) => {
    if (data.length === 0) return;

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]?.toString() || "";
            // Escape commas and quotes
            return value.includes(",") || value.includes('"')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    // Add BOM for proper Arabic encoding
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    downloadFile(blob, `customers_${new Date().getTime()}.csv`);
  };

  const exportToExcel = (data: Record<string, any>[]) => {
    // For now, export as CSV (can be enhanced with a library like xlsx)
    // TODO: Integrate with xlsx library for proper Excel format
    exportToCSV(data);
    toast.info("ملاحظة: التصدير كملف CSV (يمكن فتحه في Excel)");
  };

  const exportToPDF = (data: Record<string, any>[]) => {
    // TODO: Integrate with jsPDF library
    console.log("Exporting to PDF:", data);
    toast.info("التصدير كـ PDF سيتوفر قريباً");
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-2xl">
      <CustomDialogContent className="dir-rtl">
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تصدير العملاء ({customers.length})
          </CustomDialogTitle>
          <CustomDialogDescription>
            اختر تنسيق التصدير والحقول المطلوبة
          </CustomDialogDescription>
        </CustomDialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>تنسيق الملف</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    CSV (.csv)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    PDF (.pdf)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>الحقول المطلوبة</Label>
              <div className="flex gap-2">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={selectAll}
                >
                  تحديد الكل
                </Button>
                <span className="text-gray-400">|</span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={selectNone}
                >
                  إلغاء الكل
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 border rounded-lg">
              {EXPORT_FIELDS.map((field) => (
                <div key={field.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500">
              تم اختيار {selectedFields.length} من {EXPORT_FIELDS.length} حقل
            </div>
          </div>
        </div>

        <CustomDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleExport} disabled={selectedFields.length === 0}>
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
