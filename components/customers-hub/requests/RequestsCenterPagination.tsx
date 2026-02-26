"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaginationPages } from "./utils/pagination";
import type { RequestsListFilters } from "@/lib/services/customers-hub-requests-api";

export interface RequestsCenterPaginationProps {
  pagination: { currentPage: number; totalPages: number; itemsPerPage: number };
  newFilters: RequestsListFilters;
  onFetchRequests: (params: RequestsListFilters) => Promise<void>;
}

export function RequestsCenterPagination({
  pagination,
  newFilters,
  onFetchRequests,
}: RequestsCenterPaginationProps) {
  const { currentPage, totalPages, itemsPerPage } = pagination;

  return (
    <div className="flex justify-center items-center gap-1 pt-4 pb-2">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-md border-gray-200 bg-white hover:bg-gray-50"
        onClick={() => {
          if (currentPage <= 1) return;
          onFetchRequests({
            ...newFilters,
            offset: (currentPage - 2) * itemsPerPage,
            limit: itemsPerPage,
          } as RequestsListFilters);
        }}
        disabled={currentPage <= 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {getPaginationPages(currentPage, totalPages).map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="h-9 min-w-[2.25rem] px-2 flex items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-500"
          >
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant="outline"
            size="sm"
            className={cn(
              "h-9 min-w-[2.25rem] rounded-md",
              currentPage === item
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}
            onClick={() => {
              onFetchRequests({
                ...newFilters,
                offset: (item - 1) * itemsPerPage,
                limit: itemsPerPage,
              } as RequestsListFilters);
            }}
          >
            {item}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-md border-gray-200 bg-white hover:bg-gray-50"
        onClick={() => {
          if (currentPage >= totalPages) return;
          onFetchRequests({
            ...newFilters,
            offset: currentPage * itemsPerPage,
            limit: itemsPerPage,
          } as RequestsListFilters);
        }}
        disabled={currentPage >= totalPages}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}
