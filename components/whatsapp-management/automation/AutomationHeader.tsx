"use client";

import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutomationHeaderProps {
  onAddClick: () => void;
}

export function AutomationHeader({ onAddClick }: AutomationHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          قواعد الأتمتة
        </h2>
        <p className="text-sm text-muted-foreground">
          إدارة الرسائل الآلية بناءً على سيناريوهات محددة
        </p>
      </div>

      <Button onClick={onAddClick} className="gap-2">
        <Plus className="h-4 w-4" />
        إضافة قاعدة جديدة
      </Button>
    </div>
  );
}
