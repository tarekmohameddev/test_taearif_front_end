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
  CreditCard,
  TrendingUp,
  Calendar,
  Phone,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useRentalDashboardStore } from "@/context/store/rentalDashboard";
import { formatDate, formatCurrency, calculateDaysRemaining } from "../utils";

export function PaymentsDueDialog() {
  const {
    rentalAmounts,
    ongoingRentals,
    isPaymentsDueDialogOpen,
    closePaymentsDueDialog,
  } = useRentalDashboardStore();

  // Cleanup effect to fix pointer-events issue
  useEffect(() => {
    if (!isPaymentsDueDialogOpen) {
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);
    }
  }, [isPaymentsDueDialogOpen]);

  // فلترة المدفوعات المستحقة خلال 7 أيام
  const paymentsDue = ongoingRentals.filter((rental: any) => {
    if (!rental.next_payment_due_on) return false;
    const diffDays = calculateDaysRemaining(rental.next_payment_due_on);
    return diffDays <= 7 && diffDays >= 0;
  });

  return (
    <Dialog
      open={isPaymentsDueDialogOpen}
      onOpenChange={closePaymentsDueDialog}
    >
      <DialogContent
        className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto"
        dir="rtl"
        style={{
          pointerEvents: isPaymentsDueDialogOpen ? "auto" : "none",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            المدفوعات المستحقة خلال 7 أيام ({paymentsDue.length})
          </DialogTitle>
          <DialogDescription>
            المدفوعات التي تستحق خلال الأسبوع القادم
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">
                    المجموع هذا الشهر
                  </span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(rentalAmounts.total_to_collect_this_month)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    المجموع الشهر القادم
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(rentalAmounts.total_to_collect_next_month)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">
                    المجموع المحصل
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(rentalAmounts.total_collected)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentsDue.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <CreditCard className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد مدفوعات مستحقة
                </h3>
                <p className="text-gray-500">
                  جميع المدفوعات مستحقة لأكثر من 7 أيام
                </p>
              </div>
            ) : (
              paymentsDue.map((rental: any) => {
                const diffDays = calculateDaysRemaining(
                  rental.next_payment_due_on,
                );

                return (
                  <Card
                    key={rental.id}
                    className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {rental.tenant_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              دفعة #{rental.id}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {diffDays} يوم متبقي
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
                            {rental.property.name} -{" "}
                            {rental.property.unit_label}
                          </span>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          تفاصيل الدفع
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              المبلغ المستحق:
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {formatCurrency(rental.next_payment_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              موعد الاستحقاق:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(rental.next_payment_due_on)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              الأيام المتبقية:
                            </span>
                            <span className="text-sm font-bold text-blue-600">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
