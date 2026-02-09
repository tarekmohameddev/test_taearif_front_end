"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wrench,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";
import { formatDate, formatCurrency } from "../utils";

export function MaintenanceInProgressDialog() {
  const {
    maintenance,
    isMaintenanceInProgressDialogOpen,
    closeMaintenanceInProgressDialog,
  } = useRentalDashboardStore();

  // Cleanup effect to fix pointer-events issue
  useEffect(() => {
    if (!isMaintenanceInProgressDialogOpen) {
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);
    }
  }, [isMaintenanceInProgressDialogOpen]);

  // فلترة طلبات الصيانة قيد التنفيذ
  const inProgressMaintenance = maintenance.filter(
    (item: any) => item.status === "in_progress",
  );

  return (
    <Dialog
      open={isMaintenanceInProgressDialogOpen}
      onOpenChange={closeMaintenanceInProgressDialog}
    >
      <DialogContent
        className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        style={{
          pointerEvents: isMaintenanceInProgressDialogOpen ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            طلبات الصيانة قيد التنفيذ ({inProgressMaintenance.length})
          </DialogTitle>
          <DialogDescription>
            طلبات الصيانة التي يتم تنفيذها حالياً
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inProgressMaintenance.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Wrench className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد طلبات صيانة قيد التنفيذ
              </h3>
              <p className="text-gray-500">
                جميع طلبات الصيانة مفتوحة أو مكتملة
              </p>
            </div>
          ) : (
            inProgressMaintenance.map((item: any) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {item.title || "طلب صيانة"}
                        </h3>
                        <p className="text-sm text-gray-500">طلب #{item.id}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      قيد التنفيذ
                    </Badge>
                  </div>

                  {/* Property Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        طلب صيانة #{item.rental_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        تاريخ البدء: {formatDate(item.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        التكلفة المقدرة: {formatCurrency(item.estimated_cost)}
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Details */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      تفاصيل الصيانة
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الفئة:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.category === "electrical"
                            ? "كهربائي"
                            : item.category === "plumbing"
                              ? "سباكة"
                              : item.category === "hvac"
                                ? "تكييف"
                                : item.category === "general"
                                  ? "عام"
                                  : item.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الأولوية:</span>
                        <Badge
                          className={`text-xs ${
                            item.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : item.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.priority === "high"
                            ? "عالي"
                            : item.priority === "medium"
                              ? "متوسط"
                              : item.priority === "low"
                                ? "منخفض"
                                : item.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المدفوع:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.payer === "tenant"
                            ? "المستأجر"
                            : item.payer === "landlord"
                              ? "المالك"
                              : item.payer === "shared"
                                ? "مشترك"
                                : item.payer}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          نسبة الدفع:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.payer_share_percent}%
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-gray-700">
                          {item.description}
                        </p>
                      </div>
                    )}
                    {item.assigned_to_vendor_id && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            المقاول المسؤول:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            #{item.assigned_to_vendor_id}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
