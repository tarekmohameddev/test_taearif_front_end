"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AIMatchingStatus } from "../types/incomingCardTypes";

interface AIMatchingBadgeProps {
  aiMatching: AIMatchingStatus;
  /** When true, show inline (e.g. compact row). When false, show in block with border (full card) */
  compact?: boolean;
}

export function AIMatchingBadge({ aiMatching, compact = true }: AIMatchingBadgeProps) {
  if (aiMatching.canMatch) {
    return (
      <span
        className="text-violet-600 dark:text-violet-400 font-medium"
        title="مطابقة الذكاء الاصطناعي"
      >
        ✨ {aiMatching.matchCount}
      </span>
    );
  }
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {compact ? (
            <span className="text-amber-600 dark:text-amber-400/90 cursor-help">✨ —</span>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400/90 cursor-help">
              ✨ —
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          <p className="font-medium mb-1">حقول مطلوبة للمطابقة:</p>
          <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
            {aiMatching.missingFields.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
