import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

import type {
  RentalDetailsContract,
  RentalDetailsRental,
} from "@/components/rental-management/rental-details-types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/components/rental-management/rental-details-helpers";

interface ContractDetailsCardProps {
  rental: RentalDetailsRental;
  contract: RentalDetailsContract;
}

export function ContractDetailsCard({
  rental,
  contract,
}: ContractDetailsCardProps) {
  return (
    <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle
            className="flex items-center gap-2 text-right text-base sm:text-lg"
            dir="rtl"
          >
            تفاصيل العقد
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent
          className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
          dir="rtl"
        >
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
            dir="rtl"
          >
            <Badge
              className={`${getStatusColor(contract?.status || "unknown")} border text-xs sm:text-sm`}
            >
              {getStatusIcon(contract?.status || "unknown")}
              <span className="mr-1">
                {getStatusText(contract?.status || "unknown")}
              </span>
            </Badge>
            <div className="text-right" dir="rtl">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                {contract?.contract_number || "غير محدد"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-right">
                رقم العقد
              </p>
            </div>
          </div>

          <Separator />

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            dir="rtl"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                  مبلغ الإيجار الأساسي
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
                  {formatCurrency(rental.base_rent_amount || 0, rental.currency)}
                </p>
              </div>
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                  مبلغ الضمان
                </p>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                  {formatCurrency(rental.deposit_amount || 0, rental.currency)}
                </p>
              </div>
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                  خطة الدفع
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                  {rental.paying_plan === "monthly"
                    ? "شهري"
                    : rental.paying_plan === "quarterly"
                      ? "ربع سنوي"
                      : rental.paying_plan === "semi_annual"
                        ? "نصف سنوي"
                        : rental.paying_plan === "annual"
                          ? "سنوي"
                          : rental.paying_plan || "غير محدد"}
                </p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                  مدة الإيجار
                </p>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                  {rental.rental_duration || 0} شهر
                </p>
              </div>
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                  تاريخ بداية العقد
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                  {contract?.start_date
                    ? formatDate(contract.start_date)
                    : "غير محدد"}
                </p>
              </div>
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                  تاريخ انتهاء العقد
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                  {contract?.end_date
                    ? formatDate(contract.end_date)
                    : "غير محدد"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

