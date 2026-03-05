"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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
  className,
}: StageDropdownProps) {
  const color = getStageColor(displayStage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            compact
              ? "text-xs flex items-center gap-1 shrink-0 rounded-md hover:opacity-80 transition-all cursor-pointer px-2 py-1"
              : "flex items-center gap-1.5 text-xs rounded-md hover:opacity-80 transition-all cursor-pointer text-right w-fit px-2 py-1"
          }
          style={{
            backgroundColor: `${color}15`,
            border: `1px solid ${color}40`,
          }}
          onClick={(e) => e.stopPropagation()}
          data-interactive="true"
        >
          <span
            className={compact ? "size-1.5 rounded-full shrink-0" : "size-2 rounded-full shrink-0"}
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span style={{ color }} className="font-medium">
            {getStageNameAr(displayStage)}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0" style={{ color }} />
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
