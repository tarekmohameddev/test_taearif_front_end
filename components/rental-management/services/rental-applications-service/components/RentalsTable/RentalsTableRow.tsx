"use client";

import { useRouter } from "next/navigation";
import { Phone, CreditCard, Eye, RotateCcw, Edit, Trash2, MoreVertical, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RentalData } from "../../types/types";
import {
  getTenantName,
  getUnitLabel,
  getJobTitle,
  getPhoneNumber,
  getPropertyNumber,
  getpropertyDetails,
  getCellWidthStyle,
  getFontSizeClass,
  truncateText,
  formatCurrency,
  formatDate,
  getSafeValue,
  getStatusColor,
} from "../../utils/helpers";
import { getStatusIcon, getStatusText } from "../../utils/statusHelpers";

interface RentalsTableRowProps {
  rental: RentalData;
  index: number;
  onPaymentClick: (rentalId: number) => void;
  onRenewalClick: (rental: RentalData) => void;
  onStatusChangeClick: (rental: RentalData) => void;
  onWhatsAppClick: (rental: RentalData) => void;
  onEditClick: (rental: RentalData) => void;
  onDeleteClick: (rental: RentalData) => void;
  hasValidCRMWhatsAppChannel: boolean;
}

export function RentalsTableRow({
  rental,
  index,
  onPaymentClick,
  onRenewalClick,
  onStatusChangeClick,
  onWhatsAppClick,
  onEditClick,
  onDeleteClick,
  hasValidCRMWhatsAppChannel,
}: RentalsTableRowProps) {
  const router = useRouter();

  const calculateRentalPeriod = () => {
    if (
      rental.lease_term?.duration_days &&
      rental.lease_term.duration_days > 0
    ) {
      const months = Math.round(rental.lease_term.duration_days / 30.44);
      return Math.max(1, months);
    }

    if (rental.lease_term?.start_date && rental.lease_term?.end_date) {
      const startDate = new Date(rental.lease_term.start_date);
      const endDate = new Date(rental.lease_term.end_date);
      const yearDiff = endDate.getFullYear() - startDate.getFullYear();
      const monthDiff = endDate.getMonth() - startDate.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;
      return Math.max(1, totalMonths);
    }

    if (rental.rental_period_months && rental.rental_period_months > 0) {
      return rental.rental_period_months;
    }

    return 12;
  };

  return (
    <tr
      key={rental.id}
      onClick={(e) => {
        if (
          (e.target as any).closest?.("button") ||
          (e.target as any).closest?.('[role="menuitem"]') ||
          (e.target as any).closest?.(".cursor-pointer")
        ) {
          return;
        }
        router.push(`/dashboard/rental-management/${rental.id}`);
      }}
      className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:shadow-sm cursor-pointer ${
        index % 2 === 0 ? "bg-white" : "bg-gray-25"
      }`}
    >
      <td className="px-6 py-5">
        <div className="text-sm font-semibold text-gray-900">
          {rental.contract_number || "غير محدد"}
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {getTenantName(rental)
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2) || "??"}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-gray-900 truncate">
              {getTenantName(rental)}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {getJobTitle(rental)}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <Phone className="h-3 w-3 ml-1" />
              {getPhoneNumber(rental)}
            </div>
          </div>
        </div>
      </td>

      <td
        className="px-6 py-5"
        style={getCellWidthStyle(getUnitLabel(rental))}
      >
        <div
          className={`${getFontSizeClass(getUnitLabel(rental))} font-semibold text-gray-900`}
        >
          {truncateText(getUnitLabel(rental), 40)}
        </div>
        <div className="text-sm text-gray-500">
          رقم العقار: {getPropertyNumber(rental)}
        </div>
        {rental.property && (
          <div className="text-xs text-gray-400 mt-1">
            {getpropertyDetails(rental).beds} غرف •{" "}
            {getpropertyDetails(rental).bath} حمام
          </div>
        )}
      </td>

      <td className="px-6 py-5">
        <div className="text-lg font-bold text-gray-900">
          {formatCurrency(rental.base_rent_amount, rental.currency)}
        </div>
        <div className="text-sm text-gray-500">
          الضمان: {formatCurrency(rental.deposit_amount, rental.currency)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {getSafeValue(rental.paying_plan) === "monthly"
            ? "شهري"
            : getSafeValue(rental.paying_plan) === "quarterly"
              ? "ربع سنوي"
              : getSafeValue(rental.paying_plan) === "semi_annual"
                ? "نصف سنوي"
                : getSafeValue(rental.paying_plan) === "annual"
                  ? "سنوي"
                  : getSafeValue(rental.paying_plan)}
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="text-sm font-semibold text-gray-900">
          {calculateRentalPeriod()} شهر
        </div>
        <div className="text-xs text-gray-500">
          من {formatDate(rental.move_in_date)}
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="text-sm font-semibold text-gray-900">
          {formatDate(rental.move_in_date)}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(rental.created_at).toLocaleDateString("ar-US")}
        </div>
      </td>

      <td className="px-6 py-5">
        {rental.active_contract?.start_date ||
        rental.active_contract?.end_date ? (
          <>
            <div className="text-sm font-semibold text-gray-900">
              {rental.active_contract?.start_date
                ? `من ${formatDate(rental.active_contract.start_date)}`
                : "غير محدد"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {rental.active_contract?.end_date
                ? `إلى ${formatDate(rental.active_contract.end_date)}`
                : "غير محدد"}
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">غير محدد</div>
        )}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center">
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(rental.status)}`}
          >
            {getStatusIcon(rental.status)}
            <span className="mr-1">{getStatusText(rental.status)}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onPaymentClick(rental.id);
            }}
            size="sm"
            variant="outline"
            className="h-9 px-4 border-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 shadow-sm"
          >
            <CreditCard className="h-4 w-4 ml-2" />
            السداد
          </Button>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 shadow-sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/rental-management/${rental.id}`);
                }}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 ml-2 text-gray-600" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onRenewalClick(rental)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <RotateCcw className="h-4 w-4 ml-2 text-gray-600" />
                تجديد العقد
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChangeClick(rental)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <CreditCard className="h-4 w-4 ml-2 text-gray-600" />
                تغيير حالة العقد
              </DropdownMenuItem>
              {hasValidCRMWhatsAppChannel && (
                <DropdownMenuItem
                  onClick={() => onWhatsAppClick(rental)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Activity className="h-4 w-4 ml-2 text-gray-600" />
                  ارسال رسالة واتساب
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onEditClick(rental)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 ml-2 text-gray-600" />
                تعديل الإيجار
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(rental)}
                className="cursor-pointer hover:bg-gray-100 text-gray-600"
              >
                <Trash2 className="h-4 w-4 ml-2 text-gray-600" />
                حذف الإيجار
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
