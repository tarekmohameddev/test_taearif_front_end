"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, CheckCircle, XCircle } from "lucide-react";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";
import { formatDate, formatCurrency } from "../utils";

export function OngoingRentalsDialog() {
  const {
    ongoingRentals,
    isOngoingRentalsDialogOpen,
    closeOngoingRentalsDialog,
  } = useRentalDashboardStore();

  // Cleanup effect to fix pointer-events issue
  useEffect(() => {
    if (!isOngoingRentalsDialogOpen) {
      // Fix pointer-events issue by removing the style attribute
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);
    }
  }, [isOngoingRentalsDialogOpen]);

  return (
    <Dialog
      open={isOngoingRentalsDialogOpen}
      onOpenChange={closeOngoingRentalsDialog}
    >
      <DialogContent
        className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        style={{
          pointerEvents: isOngoingRentalsDialogOpen ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            الإيجارات الجارية ({ongoingRentals.length})
          </DialogTitle>
          <DialogDescription>
            قائمة بجميع الإيجارات النشطة حالياً مع تفاصيل كل طلب
          </DialogDescription>
        </DialogHeader>

        {ongoingRentals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد إيجارات جارية
            </h3>
            <p className="text-gray-500">
              لم يتم العثور على أي إيجارات نشطة حالياً
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    المستأجر
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    العقار
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    رقم العقد
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    تاريخ الانتهاء
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    المبلغ المستحق
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    موعد الدفع
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                {ongoingRentals.map((rental: any) => (
                  <tr
                    key={rental.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {rental.tenant_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {rental.tenant_phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {rental.property.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {rental.property.unit_label}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">
                        {rental.contract?.id || "غير محدد"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">
                        {formatDate(rental.contract?.end_date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(rental.next_payment_amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">
                        {formatDate(rental.next_payment_due_on)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={`${
                          rental.contract?.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {rental.contract?.status === "active" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            نشط
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            غير نشط
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
