import React from "react";
import { Button } from "@/components/ui/button";
import type { Priority } from "@/types/unified-customer";

interface AdvancedFiltersPanelProps {
  hasNotesFilter: boolean | null;
  onHasNotesFilterChange: (filter: boolean | null) => void;
  onDueDateFilterChange: (filter: 'all' | 'overdue' | 'today' | 'week' | 'no_date') => void;
  onPrioritiesChange: (priorities: Priority[]) => void;
  onAssigneesChange: (assignees: string[]) => void;
}

export function AdvancedFiltersPanel({
  hasNotesFilter,
  onHasNotesFilterChange,
  onDueDateFilterChange,
  onPrioritiesChange,
  onAssigneesChange,
}: AdvancedFiltersPanelProps) {
  return (
    <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Has Notes Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          الملاحظات
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant={hasNotesFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => onHasNotesFilterChange(null)}
            className="h-9"
          >
            الكل
          </Button>
          <Button
            variant={hasNotesFilter === true ? "default" : "outline"}
            size="sm"
            onClick={() => onHasNotesFilterChange(true)}
            className="h-9"
          >
            مع ملاحظات
          </Button>
          <Button
            variant={hasNotesFilter === false ? "default" : "outline"}
            size="sm"
            onClick={() => onHasNotesFilterChange(false)}
            className="h-9"
          >
            بدون ملاحظات
          </Button>
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          فلاتر سريعة
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDueDateFilterChange('overdue');
              onPrioritiesChange(['urgent', 'high']);
            }}
            className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            عاجل ومتأخر
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onAssigneesChange([]);
              onDueDateFilterChange('today');
            }}
            className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            مهام اليوم
          </Button>
        </div>
      </div>
    </div>
  );
}
