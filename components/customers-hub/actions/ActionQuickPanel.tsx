"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";
import type { CustomerAction } from "@/types/unified-customer";

interface ActionQuickPanelProps {
  action: CustomerAction;
  onSchedule?: () => void;
}

export function ActionQuickPanel({
  action,
  onSchedule,
}: ActionQuickPanelProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Schedule */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={onSchedule}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>جدولة موعد</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
