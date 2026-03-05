"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { StageDistribution } from "@/lib/services/customers-hub-requests-api";

/** Returns true if the color is dark (use white text), false if light (use black text). */
function isColorDark(hex: string): boolean {
  if (!hex || typeof hex !== "string") return true;
  const h = hex.replace(/^#/, "").trim();
  if (h.length !== 6 && h.length !== 3) return true;
  const r =
    h.length === 6
      ? parseInt(h.slice(0, 2), 16)
      : parseInt(h[0] + h[0], 16);
  const g =
    h.length === 6
      ? parseInt(h.slice(2, 4), 16)
      : parseInt(h[1] + h[1], 16);
  const b =
    h.length === 6
      ? parseInt(h.slice(4, 6), 16)
      : parseInt(h[2] + h[2], 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return true;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance <= 0.5;
}

export interface StageDistributionCardProps {
  apiStages?: StageDistribution[] | null;
  apiLoading?: boolean;
  /** When a stage is clicked, filter the list below by this stage. Toggle: click again to clear. */
  onStageClick?: (stageId: string) => void;
  /** Whether the given stage_id is currently selected (filter active). */
  isStageSelected?: (stageId: string) => boolean;
}

export function StageDistributionCard({
  apiStages,
  apiLoading,
  onStageClick,
  isStageSelected,
}: StageDistributionCardProps) {
  return (
    <Card className="md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>توزيع طلبات العملاء حسب المرحلة</CardTitle>
      </CardHeader>
      <CardContent>
        {apiLoading ? (
          <div className="text-center py-8 text-gray-500">
            جاري تحميل البيانات...
          </div>
        ) : (() => {
          const hasStages =
            apiStages && Array.isArray(apiStages) && apiStages.length > 0;
          if (!hasStages) {
            return (
              <div className="text-center py-8 text-gray-500">
                لا توجد مراحل متاحة من الباك إند
              </div>
            );
          }
          const sortedStages = [...apiStages!].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );
          return (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
              {sortedStages.map((stage) => {
                const count = stage.requestCount || 0;
                const percentage = stage.percentage || 0;
                const selected = isStageSelected?.(stage.stage_id) ?? false;
                const textColor = selected
                  ? isColorDark(stage.color)
                    ? "#fff"
                    : "#000"
                  : undefined;
                return (
                  <div
                    key={stage.stage_id}
                    role={onStageClick ? "button" : undefined}
                    tabIndex={onStageClick ? 0 : undefined}
                    onClick={() => onStageClick?.(stage.stage_id)}
                    onKeyDown={(e) => {
                      if (onStageClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onStageClick(stage.stage_id);
                      }
                    }}
                    className={cn(
                      "flex flex-col gap-2 p-3 border rounded-lg transition-all cursor-pointer",
                      selected ? "shadow-md" : "hover:shadow-md"
                    )}
                    style={{
                      borderColor: stage.color,
                      ...(selected
                        ? { backgroundColor: stage.color, color: textColor }
                        : {}),
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="text-xs font-medium"
                        style={selected ? { color: textColor } : { color: stage.color }}
                      >
                        {stage.stage_name_ar}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={
                          selected
                            ? {
                                backgroundColor: textColor === "#fff" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)",
                                color: textColor,
                              }
                            : undefined
                        }
                      >
                        {count}
                      </Badge>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-1"
                      style={
                        {
                          "--progress-background":
                            selected ? textColor : stage.color,
                        } as React.CSSProperties
                      }
                    />
                    <div
                      className={cn("text-xs", !selected && "text-gray-500")}
                      style={selected ? { color: textColor, opacity: 0.9 } : undefined}
                    >
                      {percentage.toFixed(1)}% من إجمالي الطلبات
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
