"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, LayoutGrid, LayoutList, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineFiltersRow } from "./InlineFiltersRow";
import type { InlineFiltersRowProps } from "./InlineFiltersRow";

export interface RequestsCenterFiltersBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  applySearch: () => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (v: boolean | ((prev: boolean) => boolean)) => void;
  viewMode: "compact" | "grid" | "table";
  setViewMode: (v: "compact" | "grid" | "table") => void;
  /** When provided, المصدر / الأولوية / الموظف are shown next to the search button */
  inlineFilters?: InlineFiltersRowProps;
}

export function RequestsCenterFiltersBar({
  searchQuery,
  setSearchQuery,
  applySearch,
  hasActiveFilters,
  clearFilters,
  showAdvancedFilters,
  setShowAdvancedFilters,
  viewMode,
  setViewMode,
  inlineFilters,
}: RequestsCenterFiltersBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 min-w-0 flex flex-wrap items-center gap-2 order-2 md:order-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث عن اسم العميل، رقم الهاتف، أو المرجع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applySearch();
                }
              }}
              className="pr-10 rounded-xl"
            />
          </div>
          <Button onClick={applySearch} size="sm" className="gap-2 rounded-xl shrink-0">
            <Search className="h-4 w-4" />
            بحث
          </Button>
          {inlineFilters && (
            <InlineFiltersRow
              selectedSources={inlineFilters.selectedSources}
              setSelectedSources={inlineFilters.setSelectedSources}
              dueDateFilter={inlineFilters.dueDateFilter}
              setDueDateFilter={inlineFilters.setDueDateFilter}
              selectedAssignees={inlineFilters.selectedAssignees}
              setSelectedAssignees={inlineFilters.setSelectedAssignees}
              uniqueAssignees={inlineFilters.uniqueAssignees}
            />
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap order-1 md:order-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 rounded-xl"
            >
              مسح الفلاتر
            </Button>
          )}
          <Button
            type="button"
            variant="default"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => setShowAdvancedFilters(true)}
          >
            <Filter className="h-4 w-4" />
            تصفية متقدمة
          </Button>
          <div className="flex items-center rounded-md bg-muted/60 p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 hover:bg-white [&_svg]:!h-5 [&_svg]:!w-5",
                viewMode === "compact" && "bg-white"
              )}
              onClick={() => setViewMode("compact")}
            >
              <LayoutList />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 hover:bg-white [&_svg]:!h-5 [&_svg]:!w-5",
                viewMode === "grid" && "bg-white"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 hover:bg-white [&_svg]:!h-5 [&_svg]:!w-5",
                viewMode === "table" && "bg-white"
              )}
              onClick={() => setViewMode("table")}
            >
              <Table2 />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
