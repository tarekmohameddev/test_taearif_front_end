"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RentalData } from "../types/types";
import { formatCurrency, formatDate, getStatusColor } from "../utils/helpers";
import { getStatusIcon, getStatusText } from "../utils/statusHelpers";

interface RentalDetailsDialogProps {
  selectedRental: RentalData | null;
  onClose: () => void;
}

export function RentalDetailsDialog({
  selectedRental,
  onClose,
}: RentalDetailsDialogProps) {
  if (!selectedRental) return null;

  return (
    <Dialog open={!!selectedRental} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto text-right"
        dir="rtl"
        style={{
          pointerEvents: !!selectedRental ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-right" dir="rtl">
            تفاصيل طلب الإيجار
          </DialogTitle>
          <DialogDescription className="text-right" dir="rtl">
            {selectedRental.tenant_full_name} - {selectedRental.unit_label}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="tenant" className="w-full">
          <TabsList className="grid w-full grid-cols-3" dir="rtl">
            <TabsTrigger value="tenant">المستأجر</TabsTrigger>
            <TabsTrigger value="property">العقار</TabsTrigger>
            <TabsTrigger value="contract">العقد</TabsTrigger>
          </TabsList>

          <TabsContent value="tenant" className="space-y-6" dir="rtl">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  المعلومات الشخصية
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      الاسم الكامل
                    </Label>
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedRental.tenant_full_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      رقم الهوية
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.tenant_national_id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      الحالة الاجتماعية
                    </Label>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedRental.tenant_social_status}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      رقم الهاتف
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.tenant_phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.tenant_email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  المعلومات المهنية
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      المهنة
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.tenant_job_title}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      مبلغ الإيجار
                    </Label>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        selectedRental.base_rent_amount,
                        selectedRental.currency,
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      مبلغ الضمان
                    </Label>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatCurrency(
                        selectedRental.deposit_amount,
                        selectedRental.currency,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="property" className="space-y-6" dir="rtl">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  تفاصيل العقار
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      العمارة
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.property?.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      عدد الغرف
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.property?.beds} غرف
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      عدد الحمامات
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.property?.bath} حمام
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      المساحة
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.property?.area} متر مربع
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <h4 className="font-semibold text-lg text-gray-900">الموقع</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      خط الطول
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.property?.latitude}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      خط العرض
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.property?.longitude}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contract" className="space-y-6" dir="rtl">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">
                  تفاصيل العقد
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      رقم العقد
                    </Label>
                    <p className="text-sm text-gray-900">{selectedRental.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      الحالة
                    </Label>
                    <Badge className={getStatusColor(selectedRental.status)}>
                      {getStatusIcon(selectedRental.status)}
                      <span className="mr-1">
                        {getStatusText(selectedRental.status)}
                      </span>
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      مدة الإيجار
                    </Label>
                    <p className="text-sm text-gray-900">
                      {selectedRental.rental_period_months} شهر
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      خطة الدفع
                    </Label>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedRental.paying_plan}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">التواريخ</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      تاريخ الانتقال
                    </Label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedRental.move_in_date)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      تاريخ الإنشاء
                    </Label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedRental.created_at)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      آخر تحديث
                    </Label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedRental.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedRental.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">ملاحظات</h4>
                <p className="text-sm text-gray-800">{selectedRental.notes}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
