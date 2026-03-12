import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";

import type { RentalPaymentItem } from "@/components/rental-management/rental-details-types";
import {
  formatCurrency,
  formatDate,
  getPaymentStatusColor,
  getPaymentStatusText,
} from "@/components/rental-management/rental-details-helpers";

interface PaymentsListProps {
  payments: RentalPaymentItem[];
  currency: string;
  reversingPaymentId: number | null;
  onReverse: (paymentId: number) => void;
  onOpenPaymentCollection: () => void;
}

export function PaymentsList({
  payments,
  currency,
  reversingPaymentId,
  onReverse,
  onOpenPaymentCollection,
}: PaymentsListProps) {
  return (
    <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
      <div className="flex justify-center mb-4">
        <Button
          onClick={onOpenPaymentCollection}
          className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-800 hover:border-gray-900"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">دفع المستحقات</span>
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle
            className="flex items-center gap-2 text-right text-base sm:text-lg"
            dir="rtl"
          >
            جدول المدفوعات
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-right p-3 sm:p-6" dir="rtl">
          <div className="space-y-3" dir="rtl">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-4"
                dir="rtl"
              >
                <div className="flex items-center gap-3 sm:gap-4" dir="rtl">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {payment.sequence_no}
                  </div>
                  <div className="text-right" dir="rtl">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                      الدفعة رقم {payment.sequence_no}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 text-right">
                      مستحق في: {formatDate(payment.due_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4" dir="rtl">
                  <div className="text-right" dir="rtl">
                    <p className="text-sm sm:text-base font-bold text-gray-900 text-right">
                      {formatCurrency(payment.amount, currency)}
                    </p>
                    {payment.paid_amount > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-green-600 text-right">
                          مدفوع: {formatCurrency(payment.paid_amount, currency)}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge
                    className={`${getPaymentStatusColor(payment)} border text-xs sm:text-sm`}
                  >
                    {getPaymentStatusText(payment)}
                  </Badge>
                  {payment.can_reverse === true && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReverse(payment.id)}
                      disabled={reversingPaymentId === payment.id}
                      className="text-xs sm:text-sm h-6 sm:h-7 px-2 sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 "
                      dir="rtl"
                    >
                      {reversingPaymentId === payment.id ? (
                        <>
                          <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                          جاري...
                        </>
                      ) : (
                        "تراجع"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

