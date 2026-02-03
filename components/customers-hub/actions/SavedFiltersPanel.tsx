"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bookmark,
  BookmarkPlus,
  ChevronDown,
  X,
  Trash2,
  Check,
} from "lucide-react";
import type { CustomerSource, Priority, CustomerActionType } from "@/types/unified-customer";

export type DueDateFilterType = 'all' | 'overdue' | 'today' | 'week' | 'no_date';

export interface SavedFilter {
  id: string;
  name: string;
  sources: CustomerSource[];
  priorities: Priority[];
  types: CustomerActionType[];
  searchQuery: string;
  assignees: string[];
  dueDateFilter: DueDateFilterType;
  hasNotesFilter: boolean | null;
  createdAt: string;
}

interface SavedFiltersPanelProps {
  currentFilters: {
    sources: CustomerSource[];
    priorities: Priority[];
    types: CustomerActionType[];
    searchQuery: string;
    assignees: string[];
    dueDateFilter: DueDateFilterType;
    hasNotesFilter: boolean | null;
  };
  onApplyFilter: (filter: SavedFilter) => void;
  className?: string;
}

const STORAGE_KEY = "actions-saved-filters";

export function SavedFiltersPanel({
  currentFilters,
  onApplyFilter,
  className,
}: SavedFiltersPanelProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  // Load saved filters from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedFilters(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved filters", e);
      }
    }
  }, []);

  // Save filters to localStorage
  const saveFilters = (filters: SavedFilter[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    setSavedFilters(filters);
  };

  const handleSaveCurrentFilter = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name: filterName.trim(),
      sources: currentFilters.sources,
      priorities: currentFilters.priorities,
      types: currentFilters.types,
      searchQuery: currentFilters.searchQuery,
      assignees: currentFilters.assignees,
      dueDateFilter: currentFilters.dueDateFilter,
      hasNotesFilter: currentFilters.hasNotesFilter,
      createdAt: new Date().toISOString(),
    };

    saveFilters([...savedFilters, newFilter]);
    setFilterName("");
    setShowSaveDialog(false);
  };

  const handleDeleteFilter = (filterId: string) => {
    saveFilters(savedFilters.filter((f) => f.id !== filterId));
    if (activeFilterId === filterId) {
      setActiveFilterId(null);
    }
  };

  const handleApplyFilter = (filter: SavedFilter) => {
    setActiveFilterId(filter.id);
    onApplyFilter(filter);
  };

  const hasActiveFilters = 
    currentFilters.sources.length > 0 ||
    currentFilters.priorities.length > 0 ||
    currentFilters.types.length > 0 ||
    currentFilters.searchQuery ||
    currentFilters.assignees.length > 0 ||
    currentFilters.dueDateFilter !== 'all' ||
    currentFilters.hasNotesFilter !== null;

  const dueDateLabels: Record<DueDateFilterType, string> = {
    all: 'الكل',
    overdue: 'متأخر',
    today: 'اليوم',
    week: 'الأسبوع',
    no_date: 'بدون تاريخ',
  };

  const getFilterSummary = (filter: SavedFilter) => {
    const parts: string[] = [];
    if (filter.sources.length) parts.push(`${filter.sources.length} مصدر`);
    if (filter.priorities.length) parts.push(`${filter.priorities.length} أولوية`);
    if (filter.types.length) parts.push(`${filter.types.length} نوع`);
    if (filter.searchQuery) parts.push(`بحث`);
    if (filter.assignees?.length) parts.push(`${filter.assignees.length} موظف`);
    if (filter.dueDateFilter && filter.dueDateFilter !== 'all') parts.push(dueDateLabels[filter.dueDateFilter]);
    if (filter.hasNotesFilter !== null) parts.push(filter.hasNotesFilter ? 'مع ملاحظات' : 'بدون ملاحظات');
    return parts.join(" • ") || "بدون فلاتر";
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {/* Saved Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              الفلاتر المحفوظة
              {savedFilters.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {savedFilters.length}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>الفلاتر المحفوظة</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {savedFilters.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                لا توجد فلاتر محفوظة
              </div>
            ) : (
              savedFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.id}
                  className="flex items-start justify-between gap-2 p-3"
                  onClick={(e) => {
                    e.preventDefault();
                    handleApplyFilter(filter);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {activeFilterId === filter.id && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-medium">{filter.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {getFilterSummary(filter)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFilter(filter.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save Current Filter Button */}
        {hasActiveFilters && (
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <BookmarkPlus className="h-4 w-4" />
                حفظ الفلتر الحالي
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>حفظ الفلتر الحالي</DialogTitle>
                <DialogDescription>
                  أدخل اسمًا للفلتر لحفظه واستخدامه لاحقًا
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="اسم الفلتر"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveCurrentFilter();
                    }
                  }}
                />
                <div className="mt-3 text-sm text-gray-500">
                  <p>الفلاتر الحالية:</p>
                  <p className="mt-1">{getFilterSummary({
                    id: "",
                    name: "",
                    ...currentFilters,
                    createdAt: "",
                  })}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveCurrentFilter} disabled={!filterName.trim()}>
                  حفظ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
