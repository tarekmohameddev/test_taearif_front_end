"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";
import { formatDate } from "../utils";

export function ExpiringContractsDialog() {
  const {
    expiringContractsNext30d,
    isExpiringContractsDialogOpen,
    closeExpiringContractsDialog,
  } = useRentalDashboardStore();

  // Cleanup effect to fix pointer-events issue
  useEffect(() => {
    if (!isExpiringContractsDialogOpen) {
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);
    }
  }, [isExpiringContractsDialogOpen]);

  // استخدام البيانات الصحيحة من API مع ترتيب حسب الأولوية
  const expiringContracts = [...expiringContractsNext30d].sort((a, b) => {
    // ترتيب العقود المنتهية أولاً، ثم الأقرب للانتهاء
    if (a.days_until_expiry < 0 && b.days_until_expiry >= 0) return -1;
    if (a.days_until_expiry >= 0 && b.days_until_expiry < 0) return 1;
    return a.days_until_expiry - b.days_until_expiry;
  });

  return (
    <Dialog
      open={isExpiringContractsDialogOpen}
      onOpenChange={closeExpiringContractsDialog}
    >
      <DialogContent
        className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        style={{
          pointerEvents: isExpiringContractsDialogOpen ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            العقود المنتهية الصلاحية خلال 30 يوم ({expiringContracts.length})
          </DialogTitle>
          <DialogDescription>
            العقود التي ستنتهي صلاحيتها خلال الثلاثين يوماً القادمة
            {expiringContracts.some((c) => c.days_until_expiry <= 7) && (
              <span className="block mt-2 text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                يوجد عقود عاجلة تحتاج إلى متابعة فورية
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expiringContracts.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد عقود منتهية الصلاحية
              </h3>
              <p className="text-gray-500">
                جميع العقود سارية المفعول لأكثر من 30 يوم
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-l-4 border-l-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-600">
                        عقود عاجلة (≤7 أيام)
                      </span>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {
                        expiringContracts.filter(
                          (c) => c.days_until_expiry <= 7,
                        ).length
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-600">
                        عقود متوسطة الأولوية (8-14 يوم)
                      </span>
                    </div>
                    <p className="text-lg font-bold text-yellow-600">
                      {
                        expiringContracts.filter(
                          (c) =>
                            c.days_until_expiry > 7 &&
                            c.days_until_expiry <= 14,
                        ).length
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600">
                        عقود منخفضة الأولوية (15-30 يوم)
                      </span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      {
                        expiringContracts.filter(
                          (c) =>
                            c.days_until_expiry > 14 &&
                            c.days_until_expiry <= 30,
                        ).length
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
              {/* Contract Details */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  تفاصيل العقود
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expiringContracts.map((contract: any) => {
                    const daysUntilExpiry = contract.days_until_expiry;

                    return (
                      <Card
                        key={contract.id}
                        className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
                          daysUntilExpiry <= 7
                            ? "border-l-red-500"
                            : daysUntilExpiry <= 14
                              ? "border-l-yellow-500"
                              : "border-l-orange-500"
                        }`}
                      >
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                  daysUntilExpiry <= 7
                                    ? "bg-red-50"
                                    : daysUntilExpiry <= 14
                                      ? "bg-yellow-50"
                                      : "bg-orange-50"
                                }`}
                              >
                                <AlertTriangle
                                  className={`h-6 w-6 ${
                                    daysUntilExpiry <= 7
                                      ? "text-red-600"
                                      : daysUntilExpiry <= 14
                                        ? "text-yellow-600"
                                        : "text-orange-600"
                                  }`}
                                />
                              </div>
                              <div>
                                <h3
                                  className={`font-bold text-lg ${
                                    daysUntilExpiry <= 7
                                      ? "text-red-900"
                                      : daysUntilExpiry <= 14
                                        ? "text-yellow-900"
                                        : "text-orange-900"
                                  }`}
                                >
                                  {contract.rental.tenant_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  عقد #{contract.id}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${
                                  daysUntilExpiry <= 7
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : daysUntilExpiry <= 14
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                }`}
                              >
                                {daysUntilExpiry > 0
                                  ? `${daysUntilExpiry} يوم متبقي`
                                  : daysUntilExpiry === 0
                                    ? "ينتهي اليوم"
                                    : `منتهي منذ ${Math.abs(daysUntilExpiry)} يوم`}
                              </Badge>
                              {daysUntilExpiry <= 7 && (
                                <div className="flex items-center gap-1 text-red-600">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-xs font-medium">
                                    عاجل
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Property Info */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {contract.rental.tenant_phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {contract.rental.property.name} -{" "}
                                {contract.rental.property.unit_label}
                              </span>
                            </div>
                          </div>

                          {/* Contract Details */}
                          <div
                            className={`rounded-lg p-4 ${
                              daysUntilExpiry <= 7
                                ? "bg-red-50"
                                : daysUntilExpiry <= 14
                                  ? "bg-yellow-50"
                                  : "bg-orange-50"
                            }`}
                          >
                            <h4
                              className={`font-semibold mb-3 flex items-center gap-2 ${
                                daysUntilExpiry <= 7
                                  ? "text-red-900"
                                  : daysUntilExpiry <= 14
                                    ? "text-yellow-900"
                                    : "text-orange-900"
                              }`}
                            >
                              <FileText className="h-4 w-4" />
                              تفاصيل انتهاء العقد
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  رقم العقد:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  #{contract.id}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  تاريخ البداية:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(contract.start_date)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  تاريخ الانتهاء:
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    daysUntilExpiry <= 7
                                      ? "text-red-600"
                                      : daysUntilExpiry <= 14
                                        ? "text-yellow-600"
                                        : "text-orange-600"
                                  }`}
                                >
                                  {formatDate(contract.end_date)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  الأيام المتبقية:
                                </span>
                                <span
                                  className={`text-sm font-bold ${
                                    daysUntilExpiry <= 7
                                      ? "text-red-600"
                                      : daysUntilExpiry <= 14
                                        ? "text-yellow-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {daysUntilExpiry > 0
                                    ? `${daysUntilExpiry} يوم`
                                    : daysUntilExpiry === 0
                                      ? "ينتهي اليوم"
                                      : `منتهي منذ ${Math.abs(daysUntilExpiry)} يوم`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  حالة العقد:
                                </span>
                                <Badge
                                  className={`text-xs ${
                                    contract.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : contract.status === "expired"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {contract.status === "active"
                                    ? "نشط"
                                    : contract.status === "expired"
                                      ? "منتهي"
                                      : contract.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  مدة العقد:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {(() => {
                                    const startDate = new Date(
                                      contract.start_date,
                                    );
                                    const endDate = new Date(contract.end_date);
                                    const diffTime =
                                      endDate.getTime() - startDate.getTime();
                                    const diffDays = Math.ceil(
                                      diffTime / (1000 * 60 * 60 * 24),
                                    );
                                    const months = Math.floor(diffDays / 30);
                                    const days = diffDays % 30;
                                    return months > 0
                                      ? `${months} شهر ${days > 0 ? `و ${days} يوم` : ""}`
                                      : `${diffDays} يوم`;
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`flex-1 ${
                                daysUntilExpiry <= 7
                                  ? "text-red-600 border-red-300 hover:bg-red-50"
                                  : daysUntilExpiry <= 14
                                    ? "text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                    : "text-orange-600 border-orange-300 hover:bg-orange-50"
                              }`}
                            >
                              <FileText className="h-4 w-4 ml-2" />
                              عرض العقد
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Phone className="h-4 w-4 ml-2" />
                              الاتصال
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
