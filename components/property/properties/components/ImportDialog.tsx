"use client";
import { Download, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import type { ImportResult } from "../types/properties.types";

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  isImporting: boolean;
  isDownloadingTemplate: boolean;
  importResult: ImportResult | null;
  setImportResult: (result: ImportResult | null) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
  onImport: () => void;
}

export function ImportDialog({
  isOpen,
  onClose,
  importFile,
  setImportFile,
  isImporting,
  isDownloadingTemplate,
  importResult,
  setImportResult,
  onFileChange,
  onDownloadTemplate,
  onImport,
}: ImportDialogProps) {
  return (
    <CustomDialog open={isOpen} onOpenChange={onClose} maxWidth="max-w-5xl">
      <CustomDialogContent className="overflow-y-auto overflow-x-hidden">
        <CustomDialogClose onClose={onClose} />
        <CustomDialogHeader>
          <CustomDialogTitle>استيراد وحدات</CustomDialogTitle>
          <CustomDialogDescription>
            قم بتحميل القالب واملأه بالبيانات المطلوبة ثم قم برفعه
          </CustomDialogDescription>
        </CustomDialogHeader>

        {!importResult ? (
          <>
            <div className="mx-4 sm:mx-6 mt-4 mb-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-blue-900 text-base mb-2">
                        خطوات الاستيراد
                      </CardTitle>
                      <CardDescription className="text-blue-800 text-sm leading-relaxed">
                        <ol className="list-decimal list-inside space-y-2 pr-2">
                          <li>
                            <strong>قم بتحميل القالب:</strong> اضغط على زر "تحميل القالب" أدناه لتحميل ملف Excel جاهز للاستخدام
                          </li>
                          <li>
                            <strong>افتح الملف واملأه بالبيانات:</strong> بعد تحميل القالب، افتحه في برنامج Excel أو أي برنامج جداول بيانات وابدأ بإدخال معلومات الوحدات العقارية في الأعمدة المخصصة
                          </li>
                          <li>
                            <strong>تأكد من صحة البيانات:</strong> راجع جميع المعلومات المدخلة وتأكد من صحتها واكتمالها قبل المتابعة
                          </li>
                          <li>
                            <strong>احفظ الملف:</strong> بعد الانتهاء من إدخال جميع البيانات، احفظ الملف بصيغة Excel (.xlsx أو .xls)
                          </li>
                          <li>
                            <strong>ارفع الملف:</strong> استخدم زر "رفع ملف Excel" أدناه لاختيار الملف المملوء بالبيانات ورفعه إلى النظام
                          </li>
                          <li>
                            <strong>ابدأ الاستيراد:</strong> اضغط على زر "استيراد" لبدء عملية استيراد الوحدات إلى النظام
                          </li>
                        </ol>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-700 space-y-2">
                            <strong>ملاحظة مهمة:</strong> تأكد من اتباع تنسيق القالب بدقة وتعبئة جميع الحقول المطلوبة للحصول على أفضل النتائج
                            <br />
                            <strong className="text-red-700">⚠️ تحذير:</strong> ممنوع منعاً باتاً تغيير أو إضافة أعمدة (Columns) في القالب. يجب استخدام الأعمدة الموجودة فقط كما هي في القالب الأصلي.
                          </p>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-4 py-4 px-4 sm:px-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="default"
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onDownloadTemplate}
                  disabled={isDownloadingTemplate}
                >
                  <Download className="h-4 w-4" />
                  {isDownloadingTemplate ? "جاري التحميل..." : "تحميل القالب"}
                </Button>

                <div className="grid gap-2">
                  <Label htmlFor="import-file">رفع ملف Excel</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={onFileChange}
                    disabled={isImporting}
                  />
                  {importFile && (
                    <p className="text-sm text-muted-foreground">
                      الملف المختار: {importFile.name} (
                      {(importFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={isImporting}>
                إلغاء
              </Button>
              <Button onClick={onImport} disabled={!importFile || isImporting}>
                {isImporting ? "جاري الاستيراد..." : "استيراد"}
              </Button>
            </div>
          </>
        ) : (
          <div className="grid gap-4 py-4 px-4 sm:px-6">
            {importResult.status === "success" && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-green-800">نجاح الاستيراد</CardTitle>
                  </div>
                  <CardDescription className="text-green-700">
                    {importResult.message}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {(importResult.imported_count ?? 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        تم إنشاء: {importResult.imported_count}
                      </Badge>
                    )}
                    {(importResult.updated_count ?? 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-300"
                      >
                        تم تحديث: {importResult.updated_count}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {importResult.status === "partial_success" && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <CardTitle className="text-yellow-800">نجاح جزئي</CardTitle>
                  </div>
                  <CardDescription className="text-yellow-700">
                    {importResult.message}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {(importResult.imported_count ?? 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        تم إنشاء: {importResult.imported_count}
                      </Badge>
                    )}
                    {(importResult.updated_count ?? 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-300"
                      >
                        تم تحديث: {importResult.updated_count}
                      </Badge>
                    )}
                    {(importResult.failed_count ?? 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        فشل: {importResult.failed_count}
                      </Badge>
                    )}
                  </div>

                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2 text-yellow-800">
                        تفاصيل الأخطاء ({importResult.errors.length})
                      </h4>
                      <div className="rounded-md border border-yellow-200 bg-white overflow-hidden">
                        <div className="h-[300px] w-full overflow-y-auto overflow-x-auto p-4">
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">الصف</TableHead>
                                <TableHead className="w-[120px]">الحقل</TableHead>
                                <TableHead>الخطأ</TableHead>
                                <TableHead className="w-[150px]">المتوقع</TableHead>
                                <TableHead className="w-[120px]">الفعلي</TableHead>
                                <TableHead>الاقتراح</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {importResult.errors.map((error, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {error.row}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {error.field}
                                  </TableCell>
                                  <TableCell className="text-red-600">
                                    {error.error}
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {error.expected}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {error.actual || "-"}
                                  </TableCell>
                                  <TableCell className="text-sm text-blue-600">
                                    {error.suggestion}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {importResult.status === "error" && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-red-800">خطأ في الاستيراد</CardTitle>
                  </div>
                  <CardDescription className="text-red-700">
                    {importResult.message}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {importResult.details?.suggestion && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>اقتراح:</strong> {importResult.details.suggestion}
                      </p>
                    </div>
                  )}
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2 text-red-800">
                        تفاصيل الأخطاء
                      </h4>
                      <ScrollArea className="h-[200px] w-full rounded-md border border-red-200 bg-white p-4">
                        <div className="space-y-2">
                          {importResult.errors.map((error, index) => (
                            <div
                              key={index}
                              className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                            >
                              <p className="font-medium text-red-800">
                                الصف {error.row} - {error.field}: {error.error}
                              </p>
                              {error.suggestion && (
                                <p className="text-red-600 mt-1">
                                  {error.suggestion}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                إغلاق
              </Button>
              {importResult.status !== "success" && (
                <Button onClick={() => setImportResult(null)}>
                  إعادة المحاولة
                </Button>
              )}
            </div>
          </div>
        )}
      </CustomDialogContent>
    </CustomDialog>
  );
}
