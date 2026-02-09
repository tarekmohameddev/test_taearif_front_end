"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination2";
import { Loader2, AlertCircle, Users } from "lucide-react";
import { Owner } from "../types/owners.types";
import { OwnerRow } from "./OwnerRow";
import { PAGE_SIZE } from "../constants/owners.constants";

interface PaginationData {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

interface OwnersTableProps {
  owners: Owner[];
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onViewDetails: (owner: Owner) => void;
  onEdit: (owner: Owner) => void;
  onAssignProperties: (owner: Owner) => void;
  onViewProperties: (owner: Owner) => void;
  onDelete: (owner: Owner) => void;
}

export function OwnersTable({
  owners,
  loading,
  isInitialized,
  error,
  searchTerm,
  statusFilter,
  pagination,
  onPageChange,
  onRetry,
  onViewDetails,
  onEdit,
  onAssignProperties,
  onViewProperties,
  onDelete,
}: OwnersTableProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        {loading && !isInitialized ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              حدث خطأ
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={onRetry}>إعادة المحاولة</Button>
          </div>
        ) : owners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد بيانات
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "جرب تعديل معايير البحث"
                : "لا يوجد ملاك مسجلين بعد"}
            </p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    المالك
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    معلومات الاتصال
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    الموقع
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    العقارات
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    الحالة
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {owners.map((owner: Owner, index: number) => (
                  <OwnerRow
                    key={owner.id}
                    owner={owner}
                    index={index}
                    onViewDetails={onViewDetails}
                    onEdit={onEdit}
                    onAssignProperties={onAssignProperties}
                    onViewProperties={onViewProperties}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    عرض {pagination.from} إلى {pagination.to} من أصل{" "}
                    {pagination.total} مالك
                  </div>
                  <Pagination>
                    <PaginationContent>
                      {pagination.current_page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              onPageChange(pagination.current_page - 1)
                            }
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}

                      {Array.from(
                        { length: pagination.last_page },
                        (_, i) => i + 1,
                      )
                        .filter((page) => {
                          const current = pagination.current_page;
                          return (
                            page === 1 ||
                            page === pagination.last_page ||
                            (page >= current - 1 && page <= current + 1)
                          );
                        })
                        .map((page, index, array) => {
                          if (
                            index > 0 &&
                            page - array[index - 1] > 1
                          ) {
                            return (
                              <>
                                <PaginationItem key={`ellipsis-${page}`}>
                                  <span className="px-2">...</span>
                                </PaginationItem>
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => onPageChange(page)}
                                    isActive={page === pagination.current_page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </>
                            );
                          }
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => onPageChange(page)}
                                isActive={page === pagination.current_page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                      {pagination.current_page < pagination.last_page && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              onPageChange(pagination.current_page + 1)
                            }
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
