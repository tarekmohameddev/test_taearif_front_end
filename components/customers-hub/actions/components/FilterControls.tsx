import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  ChevronDown,
  AlertTriangle,
  Timer,
  List,
  UserPlus,
} from "lucide-react";
import { SourceBadge } from "../SourceBadge";
import { priorityLabels, actionTypeLabels } from "../types";
import type { CustomerSource, CustomerActionType, Priority } from "@/types/unified-customer";

interface FilterControlsProps {
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
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  uniqueAssignees: Array<{ id: string; name: string }>;
}

export function FilterControls({
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
  showAdvancedFilters,
  onToggleAdvancedFilters,
  uniqueAssignees,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="البحث في الإجراءات..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>
      <div className="flex items-center gap-2">
        {/* Source Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              المصدر
              {selectedSources.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedSources.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>مصدر العميل</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['whatsapp', 'inquiry', 'manual', 'referral', 'import'] as CustomerSource[]).map((source) => (
              <DropdownMenuCheckboxItem
                key={source}
                checked={selectedSources.includes(source)}
                onCheckedChange={(checked) => {
                  onSourcesChange(
                    checked ? [...selectedSources, source] : selectedSources.filter((s) => s !== source)
                  );
                }}
              >
                <SourceBadge source={source} className="text-xs" />
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              الأولوية
              {selectedPriorities.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedPriorities.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['urgent', 'high', 'medium', 'low'] as Priority[]).map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={selectedPriorities.includes(priority)}
                onCheckedChange={(checked) => {
                  onPrioritiesChange(
                    checked ? [...selectedPriorities, priority] : selectedPriorities.filter((p) => p !== priority)
                  );
                }}
              >
                {priorityLabels[priority]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <List className="h-4 w-4" />
              النوع
              {selectedTypes.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedTypes.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>نوع الإجراء</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(actionTypeLabels) as CustomerActionType[]).map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => {
                  onTypesChange(
                    checked ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type)
                  );
                }}
              >
                {actionTypeLabels[type]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assignee Filter */}
        {uniqueAssignees.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                الموظف
                {selectedAssignees.length > 0 && (
                  <Badge variant="secondary" className="mr-1">
                    {selectedAssignees.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>الموظف المعين</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueAssignees.map((assignee) => (
                <DropdownMenuCheckboxItem
                  key={assignee.id}
                  checked={selectedAssignees.includes(assignee.id)}
                  onCheckedChange={(checked) => {
                    onAssigneesChange(
                      checked ? [...selectedAssignees, assignee.id] : selectedAssignees.filter((a) => a !== assignee.id)
                    );
                  }}
                >
                  {assignee.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Due Date Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Timer className="h-4 w-4" />
              الموعد
              {dueDateFilter !== 'all' && (
                <Badge variant="secondary" className="mr-1">1</Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>تصفية حسب الموعد</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDueDateFilterChange('all')}>
              <span className={dueDateFilter === 'all' ? "font-bold" : ""}>الكل</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDueDateFilterChange('overdue')}>
              <span className={`text-red-600 ${dueDateFilter === 'overdue' ? "font-bold" : ""}`}>
                المتأخرة فقط
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDueDateFilterChange('today')}>
              <span className={`text-orange-600 ${dueDateFilter === 'today' ? "font-bold" : ""}`}>
                اليوم فقط
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDueDateFilterChange('week')}>
              <span className={`text-blue-600 ${dueDateFilter === 'week' ? "font-bold" : ""}`}>
                هذا الأسبوع
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDueDateFilterChange('no_date')}>
              <span className={`text-gray-500 ${dueDateFilter === 'no_date' ? "font-bold" : ""}`}>
                بدون تاريخ
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showAdvancedFilters ? "default" : "outline"}
          size="icon"
          onClick={onToggleAdvancedFilters}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {hasNotesFilter !== null && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full" />
          )}
        </Button>
      </div>
    </div>
  );
}
