"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StageOption } from "../types/incomingCardTypes";
import type { CustomerLifecycleStage } from "@/types/unified-customer";

interface StageDropdownProps {
  availableStages: StageOption[];
  displayStage: CustomerLifecycleStage;
  isUpdatingStage: boolean;
  onStageChange: (stageId: CustomerLifecycleStage) => void;
  getStageColor: (stageId: string) => string;
  getStageNameAr: (stageId: string) => string;
  /** When true, use smaller trigger (compact view) */
  compact?: boolean;
  /** When true, use Stitch-style trigger: rounded-lg, px-3 py-1.5, border, expand_more */
  stitchStyle?: boolean;
  className?: string;
}

export function StageDropdown({
  availableStages,
  displayStage,
  isUpdatingStage,
  onStageChange,
  getStageColor,
  getStageNameAr,
  compact = false,
  stitchStyle = false,
  className,
}: StageDropdownProps) {
  const color = getStageColor(displayStage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            stitchStyle
              ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border w-full justify-between hover:opacity-90 transition-all cursor-pointer min-w-0"
              : compact
                ? "text-xs flex items-center gap-1 shrink-0 rounded-md hover:opacity-80 transition-all cursor-pointer px-2 py-1"
                : "flex items-center gap-1.5 text-xs rounded-md hover:opacity-80 transition-all cursor-pointer text-right w-fit px-2 py-1",
            className
          )}
          style={{
            backgroundColor: stitchStyle ? `${color}15` : `${color}15`,
            border: stitchStyle ? `1px solid ${color}40` : `1px solid ${color}40`,
            color: stitchStyle ? color : color,
          }}
          onClick={(e) => e.stopPropagation()}
          data-interactive="true"
        >
          <span className="flex items-center gap-2 min-w-0">
            <span
              className={stitchStyle ? "size-2 rounded-full shrink-0" : compact ? "size-1.5 rounded-full shrink-0" : "size-2 rounded-full shrink-0"}
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <span className="truncate font-semibold" style={{ color }}>
              {getStageNameAr(displayStage)}
            </span>
          </span>
          <ChevronDown className={cn("h-3 w-3 shrink-0 ml-auto", stitchStyle && "h-4 w-4")} style={{ color }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {availableStages.map((stage) => (
          <DropdownMenuItem
            key={stage.id}
            onClick={(e) => {
              e.stopPropagation();
              onStageChange(stage.id as CustomerLifecycleStage);
            }}
            className="flex items-center gap-2"
            disabled={isUpdatingStage || displayStage === stage.id}
          >
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
              aria-hidden
            />
            {stage.nameAr}
            {displayStage === stage.id && (
              <span className="mr-auto text-xs text-gray-500">(الحالية)</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
