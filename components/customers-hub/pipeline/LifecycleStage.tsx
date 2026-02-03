"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LifecycleStageInfo, UnifiedCustomer } from "@/types/unified-customer";
import { CustomerPipelineCard } from "./CustomerPipelineCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";

interface LifecycleStageProps {
  stage: LifecycleStageInfo;
  customers: UnifiedCustomer[];
  isSelected: boolean;
  onSelect: () => void;
}

export function LifecycleStage({
  stage,
  customers,
  isSelected,
  onSelect,
}: LifecycleStageProps) {
  const totalValue = customers.reduce((sum, c) => sum + (c.totalDealValue || 0), 0);
  const urgentCount = customers.filter((c) => c.priority === "urgent").length;

  return (
    <div
      className={`flex-shrink-0 w-[320px] transition-all ${
        isSelected ? "ring-2 ring-blue-500 rounded-lg" : ""
      }`}
    >
      <Card className="h-full flex flex-col">
        <CardHeader
          className="pb-3 cursor-pointer"
          onClick={onSelect}
          style={{
            borderTop: `4px solid ${stage.color}`,
          }}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span style={{ color: stage.color }}>{stage.nameAr}</span>
              <Badge variant="secondary" className="text-xs">
                {customers.length}
              </Badge>
            </CardTitle>
            {urgentCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                🚨 {urgentCount}
              </Badge>
            )}
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              القيمة: {(totalValue / 1000).toFixed(0)}k ريال
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
          {customers.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              لا يوجد عملاء في هذه المرحلة
            </div>
          ) : (
            customers
              .sort((a, b) => {
                // Sort by priority first (urgent first), then by name
                const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
                const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
                if (aPriority !== bPriority) return aPriority - bPriority;
                return (a.name || "").localeCompare(b.name || "");
              })
              .map((customer) => (
                <CustomerPipelineCard
                  key={customer.id}
                  customer={customer}
                  stageColor={stage.color}
                />
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
