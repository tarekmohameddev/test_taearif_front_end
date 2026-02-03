"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination2";

interface RentalsPaginationProps {
  pagination: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  } | null;
  onPageChange: (page: number) => void;
}

export function RentalsPagination({
  pagination,
  onPageChange,
}: RentalsPaginationProps) {
  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page > 1) {
                  onPageChange(pagination.current_page - 1);
                }
              }}
              className={
                pagination.current_page <= 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
            (page) => {
              const shouldShow =
                page === 1 ||
                page === pagination.last_page ||
                (page >= pagination.current_page - 1 &&
                  page <= pagination.current_page + 1);

              if (!shouldShow) {
                if (page === 2 && pagination.current_page > 3) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                if (
                  page === pagination.last_page - 1 &&
                  pagination.current_page < pagination.last_page - 2
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={page === pagination.current_page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            },
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page < pagination.last_page) {
                  onPageChange(pagination.current_page + 1);
                }
              }}
              className={
                pagination.current_page >= pagination.last_page
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="mt-4 text-center text-sm text-gray-500">
        عرض {pagination.from} إلى {pagination.to} من {pagination.total} نتيجة
      </div>
    </div>
  );
}
