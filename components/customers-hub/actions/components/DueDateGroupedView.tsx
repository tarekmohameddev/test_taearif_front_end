import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CalendarDays, CalendarClock, Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "../IncomingActionsCard";
import type { CustomerAction } from "@/types/unified-customer";

interface DueDateGroupedViewProps {
  groups: Record<string, CustomerAction[]>;
  onComplete: (actionId: string) => void;
  onDismiss: (actionId: string) => void;
  onSnooze: (actionId: string, until: string) => void;
  onAddNote: (actionId: string, note: string) => void;
  onQuickView: (actionId: string) => void;
  selectedActionIds: Set<string>;
  onSelect: (actionId: string, selected: boolean) => void;
  isCompact: boolean;
  filterFn?: (action: CustomerAction) => boolean;
}

const dueDateGroupLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  overdue: { label: "متأخر", color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" /> },
  today: { label: "اليوم", color: "text-orange-600", icon: <Clock className="h-4 w-4" /> },
  tomorrow: { label: "غداً", color: "text-yellow-600", icon: <CalendarDays className="h-4 w-4" /> },
  thisWeek: { label: "هذا الأسبوع", color: "text-blue-600", icon: <CalendarClock className="h-4 w-4" /> },
  later: { label: "لاحقاً", color: "text-gray-600", icon: <Calendar className="h-4 w-4" /> },
  noDueDate: { label: "بدون تاريخ", color: "text-gray-400", icon: <List className="h-4 w-4" /> },
};

export function DueDateGroupedView({
  groups,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  selectedActionIds,
  onSelect,
  isCompact,
  filterFn,
}: DueDateGroupedViewProps) {
  const groupOrder = ['overdue', 'today', 'tomorrow', 'thisWeek', 'later', 'noDueDate'];
  
  return (
    <div className="space-y-6">
      {groupOrder.map((groupKey) => {
        let actions = groups[groupKey] || [];
        if (filterFn) {
          actions = actions.filter(filterFn);
        }
        
        if (actions.length === 0) return null;
        
        const groupInfo = dueDateGroupLabels[groupKey];
        
        return (
          <div key={groupKey}>
            <div className={cn("flex items-center gap-2 mb-3", groupInfo.color)}>
              {groupInfo.icon}
              <h3 className="font-medium">{groupInfo.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {actions.length}
              </Badge>
            </div>
            <div className={cn("space-y-3", isCompact && "space-y-1")}>
              {actions.map((action) => (
                <IncomingActionsCard
                  key={action.id}
                  action={action}
                  onComplete={onComplete}
                  onDismiss={onDismiss}
                  onSnooze={onSnooze}
                  onAddNote={onAddNote}
                  onQuickView={onQuickView}
                  isSelected={selectedActionIds.has(action.id)}
                  onSelect={onSelect}
                  showCheckbox={true}
                  isCompact={isCompact}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
