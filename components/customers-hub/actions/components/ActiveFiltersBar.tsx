import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SourceBadge } from "../SourceBadge";
import { priorityLabels, actionTypeLabels } from "../types";
import type { CustomerSource, CustomerActionType, Priority } from "@/types/unified-customer";

interface ActiveFiltersBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSources: CustomerSource[];
  onSourcesChange: (sources: CustomerSource[]) => void;
  selectedPriorities: Priority[];
  onPrioritiesChange: (priorities: Priority[]) => void;
  selectedTypes: CustomerActionType[];
  onTypesChange: (types: CustomerActionType[]) => void;
  selectedAssignees: string[];
  onAssigneesChange: (assignees: string[]) => void;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'no_date';
  onDueDateFilterChange: (filter: 'all' | 'overdue' | 'today' | 'week' | 'no_date') => void;
  hasNotesFilter: boolean | null;
  onHasNotesFilterChange: (filter: boolean | null) => void;
  uniqueAssignees: Array<{ id: string; name: string }>;
  activeFilterCount: number;
  onClearFilters: () => void;
}

export function ActiveFiltersBar({
  searchQuery,
  onSearchChange,
  selectedSources,
  onSourcesChange,
  selectedPriorities,
  onPrioritiesChange,
  selectedTypes,
  onTypesChange,
  selectedAssignees,
  onAssigneesChange,
  dueDateFilter,
  onDueDateFilterChange,
  hasNotesFilter,
  onHasNotesFilterChange,
  uniqueAssignees,
  activeFilterCount,
  onClearFilters,
}: ActiveFiltersBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500">
        الفلاتر النشطة ({activeFilterCount}):
      </span>
      {searchQuery && (
        <Badge variant="secondary" className="gap-1">
          بحث: {searchQuery}
          <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
        </Badge>
      )}
      {selectedSources.map((source) => (
        <Badge key={source} variant="secondary" className="gap-1">
          <SourceBadge source={source} className="text-xs" />
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              onSourcesChange(selectedSources.filter((s) => s !== source))
            }
          />
        </Badge>
      ))}
      {selectedPriorities.map((priority) => (
        <Badge key={priority} variant="secondary" className="gap-1">
          {priorityLabels[priority]}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              onPrioritiesChange(selectedPriorities.filter((p) => p !== priority))
            }
          />
        </Badge>
      ))}
      {selectedTypes.map((type) => (
        <Badge key={type} variant="secondary" className="gap-1">
          {actionTypeLabels[type]}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              onTypesChange(selectedTypes.filter((t) => t !== type))
            }
          />
        </Badge>
      ))}
      {selectedAssignees.map((assigneeId) => {
        const assignee = uniqueAssignees.find((a) => a.id === assigneeId);
        return (
          <Badge key={assigneeId} variant="secondary" className="gap-1">
            موظف: {assignee?.name || assigneeId}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() =>
                onAssigneesChange(selectedAssignees.filter((a) => a !== assigneeId))
              }
            />
          </Badge>
        );
      })}
      {dueDateFilter !== 'all' && (
        <Badge variant="secondary" className="gap-1">
          الموعد: {
            dueDateFilter === 'overdue' ? 'متأخر' :
            dueDateFilter === 'today' ? 'اليوم' :
            dueDateFilter === 'week' ? 'هذا الأسبوع' :
            'بدون تاريخ'
          }
          <X className="h-3 w-3 cursor-pointer" onClick={() => onDueDateFilterChange('all')} />
        </Badge>
      )}
      {hasNotesFilter !== null && (
        <Badge variant="secondary" className="gap-1">
          {hasNotesFilter ? 'مع ملاحظات' : 'بدون ملاحظات'}
          <X className="h-3 w-3 cursor-pointer" onClick={() => onHasNotesFilterChange(null)} />
        </Badge>
      )}
      <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-red-500 hover:text-red-600">
        مسح الكل
      </Button>
    </div>
  );
}
