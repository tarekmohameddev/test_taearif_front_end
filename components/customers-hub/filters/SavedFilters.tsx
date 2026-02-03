"use client";

import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, Bookmark, Star, Trash2, Edit } from "lucide-react";
import type { CustomerFilters } from "@/types/unified-customer";
import { toast } from "sonner";

interface SavedFilter {
  id: string;
  name: string;
  filters: CustomerFilters;
  isFavorite: boolean;
  createdAt: string;
  usageCount: number;
}

interface SavedFiltersProps {
  currentFilters: CustomerFilters;
  onApplyFilter: (filters: CustomerFilters) => void;
}

const STORAGE_KEY = "customers_hub_saved_filters";

export function SavedFilters({ currentFilters, onApplyFilter }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [editingFilter, setEditingFilter] = useState<SavedFilter | null>(null);

  // Load saved filters from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedFilters(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    }
  }, []);

  // Save filters to localStorage
  const saveToStorage = (filters: SavedFilter[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    setSavedFilters(filters);
  };

  // Count active filters
  const countActiveFilters = (filters: CustomerFilters) => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim() !== "";
      return value !== undefined && value !== null;
    }).length;
  };

  const activeFiltersCount = countActiveFilters(currentFilters);
  const hasActiveFilters = activeFiltersCount > 0;

  // Save current filter
  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error("الرجاء إدخال اسم للفلتر");
      return;
    }

    if (!hasActiveFilters) {
      toast.error("لا توجد فلاتر نشطة للحفظ");
      return;
    }

    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name: filterName,
      filters: currentFilters,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    saveToStorage([...savedFilters, newFilter]);
    toast.success(`تم حفظ الفلتر "${filterName}"`);
    setFilterName("");
    setShowSaveDialog(false);
  };

  // Apply saved filter
  const handleApplyFilter = (filter: SavedFilter) => {
    onApplyFilter(filter.filters);
    
    // Increment usage count
    const updated = savedFilters.map((f) =>
      f.id === filter.id ? { ...f, usageCount: f.usageCount + 1 } : f
    );
    saveToStorage(updated);
    
    toast.success(`تم تطبيق الفلتر "${filter.name}"`);
  };

  // Toggle favorite
  const handleToggleFavorite = (filterId: string) => {
    const updated = savedFilters.map((f) =>
      f.id === filterId ? { ...f, isFavorite: !f.isFavorite } : f
    );
    saveToStorage(updated);
  };

  // Delete filter
  const handleDeleteFilter = (filterId: string) => {
    const updated = savedFilters.filter((f) => f.id !== filterId);
    saveToStorage(updated);
    toast.success("تم حذف الفلتر");
  };

  // Edit filter
  const handleEditFilter = (filter: SavedFilter) => {
    setEditingFilter(filter);
    setFilterName(filter.name);
    setShowEditDialog(true);
  };

  const handleUpdateFilter = () => {
    if (!filterName.trim() || !editingFilter) return;

    const updated = savedFilters.map((f) =>
      f.id === editingFilter.id ? { ...f, name: filterName } : f
    );
    saveToStorage(updated);
    toast.success("تم تحديث الفلتر");
    setFilterName("");
    setEditingFilter(null);
    setShowEditDialog(false);
  };

  // Sort filters: favorites first, then by usage count
  const sortedFilters = [...savedFilters].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.usageCount - a.usageCount;
  });

  return (
    <>
      <div className="flex gap-2">
        {/* Save Current Filter */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          disabled={!hasActiveFilters}
          className="gap-2"
        >
          <BookmarkPlus className="h-4 w-4" />
          حفظ الفلتر
          {hasActiveFilters && (
            <Badge variant="secondary" className="mr-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Saved Filters Dropdown */}
        {savedFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                الفلاتر المحفوظة
                <Badge variant="secondary">{savedFilters.length}</Badge>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80" dir="rtl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                الفلاتر المحفوظة
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {sortedFilters.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">
                  لم يتم حفظ أي فلتر بعد
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {sortedFilters.map((filter) => (
                    <DropdownMenuItem
                      key={filter.id}
                      className="flex items-center justify-between p-3 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleApplyFilter(filter);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{filter.name}</span>
                          {filter.isFavorite && (
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="secondary" className="text-xs">
                            {countActiveFilters(filter.filters)} فلتر
                          </Badge>
                          <span>• استخدم {filter.usageCount} مرة</span>
                        </div>
                      </div>

                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleToggleFavorite(filter.id)}
                        >
                          <Star
                            className={`h-3 w-3 ${
                              filter.isFavorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEditFilter(filter)}
                        >
                          <Edit className="h-3 w-3 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDeleteFilter(filter.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Save Filter Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حفظ الفلتر الحالي</DialogTitle>
            <DialogDescription>
              سيتم حفظ {activeFiltersCount} فلتر نشط
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">اسم الفلتر</Label>
              <Input
                id="filter-name"
                placeholder="مثال: عملاء الرياض - ميزانية عالية"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveFilter();
                  }
                }}
              />
            </div>

            {/* Preview active filters */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-xs font-medium text-gray-600 mb-2">
                الفلاتر النشطة:
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentFilters).map(([key, value]) => {
                  if (Array.isArray(value) && value.length > 0) {
                    return (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {value.length} محدد
                      </Badge>
                    );
                  }
                  if (typeof value === "string" && value.trim()) {
                    return (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {value}
                      </Badge>
                    );
                  }
                  if (typeof value === "number") {
                    return (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {value}
                      </Badge>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
              <BookmarkPlus className="h-4 w-4 ml-2" />
              حفظ الفلتر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Filter Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل الفلتر</DialogTitle>
            <DialogDescription>
              تحديث اسم الفلتر المحفوظ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-filter-name">اسم الفلتر</Label>
              <Input
                id="edit-filter-name"
                placeholder="اسم الفلتر"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateFilter();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingFilter(null);
                setFilterName("");
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleUpdateFilter} disabled={!filterName.trim()}>
              <Edit className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
