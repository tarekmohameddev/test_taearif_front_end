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
import { AlertTriangle, Phone, MapPin, DollarSign } from "lucide-react";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";
import { formatDate, formatCurrency, calculateDaysOverdue } from "../utils";

export function PaymentsOverdueDialog() {
  const {
    ongoingRentals,
    isPaymentsOverdueDialogOpen,
    closePaymentsOverdueDialog,
  } = useRentalDashboardStore();

  // Cleanup effect to fix pointer-events issue
  useEffect(() => {
    if (!isPaymentsOverdueDialogOpen) {
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);
    }
  }, [isPaymentsOverdueDialogOpen]);

  // فلترة المدفوعات المتأخرة
  const overduePayments = ongoingRentals.filter((rental: any) => {
    if (!rental.next_payment_due_on) return false;
    const dueDate = new Date(rental.next_payment_due_on);
    const today = new Date();
    return dueDate < today;
  });

  return (
    <Dialog
      open={isPaymentsOverdueDialogOpen}
      onOpenChange={closePaymentsOverdueDialog}
    >
      <DialogContent
        className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        style={{
          pointerEvents: isPaymentsOverdueDialogOpen ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            المدفوعات المتأخرة ({overduePayments.length})
          </DialogTitle>
          <DialogDescription>
            المدفوعات التي تجاوزت موعد استحقاقها
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overduePayments.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد مدفوعات متأخرة
              </h3>
              <p className="text-gray-500">جميع المدفوعات في موعدها</p>
            </div>
          ) : (
            overduePayments.map((rental: any) => {
              const diffDays = calculateDaysOverdue(rental.next_payment_due_on);

              return (
                <Card
                  key={rental.id}
                  className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500"
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {rental.tenant_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            دفعة متأخرة #{rental.id}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        متأخرة {diffDays} يوم
                      </Badge>
                    </div>

                    {/* Property Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {rental.tenant_phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {rental.property.name} - {rental.property.unit_label}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        تفاصيل الدفع المتأخر
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            المبلغ المتأخر:
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            {formatCurrency(rental.next_payment_amount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            تاريخ الاستحقاق:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(rental.next_payment_due_on)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            مدة التأخير:
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            {diffDays} يوم
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
