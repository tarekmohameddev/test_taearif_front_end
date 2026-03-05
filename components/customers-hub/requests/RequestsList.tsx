"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "../actions/IncomingActionsCard";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";

export interface RequestsListStage {
  stage_id: string;
  stage_name_ar: string;
  stage_name_en: string;
  color: string;
  order: number;
}

export interface RequestsListProps {
  actions: CustomerAction[];
  getCustomerById: (id: string) => UnifiedCustomer | undefined;
  isCompactView: boolean;
  selectedActionIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string, until: string) => void;
  onAddNote: (id: string, note: string) => void;
  onQuickView: (id: string) => void;
  stages?: RequestsListStage[];
  completingActionIds: Set<string>;
  onStageChangeSuccess?: (
    actionId: string,
    newStageId: string,
    previousStageId: string
  ) => void;
}

export function RequestsList({
  actions,
  getCustomerById,
  isCompactView,
  selectedActionIds,
  onSelect,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  stages,
  completingActionIds,
  onStageChangeSuccess,
}: RequestsListProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [maxCardHeight, setMaxCardHeight] = useState<number | null>(null);
  const measureRef = useRef<() => void>(() => {});

  const handleScheduleFormOpenChange = useCallback((open: boolean) => {
    if (open) return;
    setMaxCardHeight(null);
    setTimeout(() => measureRef.current(), 80);
  }, []);

  useEffect(() => {
    if (isCompactView || actions.length === 0) {
      setMaxCardHeight(null);
      return;
    }
    const measure = () => {
      const grid = gridRef.current;
      if (!grid?.children?.length) return;
      let max = 0;
      for (let i = 0; i < grid.children.length; i++) {
        const h = (grid.children[i] as HTMLElement).getBoundingClientRect().height;
        if (h > max) max = h;
      }
      if (max > 0) setMaxCardHeight(max);
    };
    measureRef.current = measure;
    const t = setTimeout(measure, 0);
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [actions, isCompactView]);

  if (actions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">لا توجد طلبات في هذا القسم</p>
          <p className="text-sm mt-1">ستظهر الطلبات هنا عند ورودها</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid gap-3 items-stretch",
        isCompactView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {actions.map((action) => (
        <div
          key={action.id}
          className={isCompactView ? undefined : "h-full min-h-0"}
          style={
            !isCompactView && maxCardHeight != null
              ? { minHeight: maxCardHeight }
              : undefined
          }
        >
          <IncomingActionsCard
            action={action}
            customer={getCustomerById(action.customerId)}
            stages={stages}
            onComplete={onComplete}
            onDismiss={onDismiss}
            onSnooze={onSnooze}
            onAddNote={onAddNote}
            onQuickView={onQuickView}
            isSelected={selectedActionIds.has(action.id)}
            onSelect={onSelect}
            showCheckbox={true}
            isCompact={isCompactView}
            isCompleting={completingActionIds.has(action.id)}
            className={isCompactView ? undefined : "h-full"}
            onScheduleFormOpenChange={handleScheduleFormOpenChange}
            onStageChangeSuccess={onStageChangeSuccess}
          />
        </div>
      ))}
    </div>
  );
}
