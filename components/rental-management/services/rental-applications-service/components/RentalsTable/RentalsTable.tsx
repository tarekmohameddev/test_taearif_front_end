"use client";

import { useRouter } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RentalData } from "../../types/types";
import { RentalsTableRow } from "./RentalsTableRow";
import { RentalsTableSkeleton } from "./RentalsTableSkeleton";
import {
  getTenantName,
  getUnitLabel,
  getPhoneNumber,
  getEmail,
  getSafeValue,
} from "../../utils/helpers";

interface RentalsTableProps {
  loading: boolean;
  rentals: RentalData[];
  searchTerm: string;
  filterStatus: string;
  tableMaxWidth: number | null;
  onPaymentClick: (rentalId: number) => void;
  onRenewalClick: (rental: RentalData) => void;
  onStatusChangeClick: (rental: RentalData) => void;
  onWhatsAppClick: (rental: RentalData) => void;
  onEditClick: (rental: RentalData) => void;
  onDeleteClick: (rental: RentalData) => void;
  hasValidCRMWhatsAppChannel: boolean;
}

export function RentalsTable({
  loading,
  rentals,
  searchTerm,
  filterStatus,
  tableMaxWidth,
  onPaymentClick,
  onRenewalClick,
  onStatusChangeClick,
  onWhatsAppClick,
  onEditClick,
  onDeleteClick,
  hasValidCRMWhatsAppChannel,
}: RentalsTableProps) {
  const router = useRouter();

  const rentalsArray = Array.isArray(rentals) ? rentals : [];

  const filteredRentals = rentalsArray.filter((rental: RentalData) => {
    const matchesSearch =
      getTenantName(rental).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUnitLabel(rental).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPhoneNumber(rental).includes(searchTerm) ||
      getEmail(rental).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || getSafeValue(rental.status) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto"
      dir="rtl"
      style={tableMaxWidth ? { maxWidth: `${tableMaxWidth}px` } : {}}
    >
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-300">
          <tr>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              رقم العقد
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              المستأجر
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              الوحدة
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              مبلغ الإيجار
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              مدة الإيجار
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              تاريخ الانتقال
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              التاريخ
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              الحالة
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              السداد
            </th>
            <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <RentalsTableSkeleton />
          ) : (
            filteredRentals.map((rental: RentalData, index: number) => (
              <RentalsTableRow
                key={rental.id}
                rental={rental}
                index={index}
                onPaymentClick={onPaymentClick}
                onRenewalClick={onRenewalClick}
                onStatusChangeClick={onStatusChangeClick}
                onWhatsAppClick={onWhatsAppClick}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                hasValidCRMWhatsAppChannel={hasValidCRMWhatsAppChannel}
              />
            ))
          )}
        </tbody>
      </table>

      {!loading && filteredRentals.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد إيجارات
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "جرب تعديل معايير البحث"
              : "ابدأ بإضافة إيجار جديد"}
          </p>
          <Button
            onClick={() => router.push("/dashboard/rental-management/create")}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة إيجار جديد
          </Button>
        </div>
      )}
    </div>
  );
}
