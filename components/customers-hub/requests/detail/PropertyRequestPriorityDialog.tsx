"use client";

import React from "react";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import { cn } from "@/lib/utils";
import { getPropertyRequestId } from "../request-detail-types";
import type { CustomerAction } from "@/types/unified-customer";
import type { Priority } from "@/types/unified-customer";
import { priorityOptions } from "../constants";

export interface PropertyRequestPriorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: CustomerAction;
  selectedPriority: Priority;
  onSelectedPriorityChange: (priority: Priority) => void;
  savingPriority: boolean;
  onSave: () => void | Promise<void>;
  onClose: () => void;
}

export function PropertyRequestPriorityDialog({
  open,
  onOpenChange,
  action,
  selectedPriority,
  onSelectedPriorityChange,
  savingPriority,
  onSave,
  onClose,
}: PropertyRequestPriorityDialogProps) {
  const propertyRequestId = getPropertyRequestId(action);

  if (propertyRequestId == null) return null;

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="p-3">
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Flag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تغيير أولوية طلب العقار</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر الأولوية الجديدة لطلب العقار رقم #{propertyRequestId}
              </div>
            </div>
          </CustomDialogTitle>
          <CustomDialogClose onClose={onClose} />
        </CustomDialogHeader>

        <div className="space-y-6 p-4">
          <div className="p-3 bg-muted/30 rounded-lg space-y-1">
            <div className="text-sm font-medium">{action.title}</div>
            <div className="text-xs text-muted-foreground">
              العميل: {action.customerName} — طلب عقار رقم #{propertyRequestId}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">اختر الأولوية:</Label>
            <CustomDropdown
              fullWidth
              contentZIndex={10003}
              trigger={
                <span className="flex items-center gap-2">
                  {priorityOptions.find((p) => p.value === selectedPriority)?.label ?? "اختر الأولوية"}
                </span>
              }
              triggerClassName={cn(
                "w-full justify-between",
                savingPriority && "pointer-events-none opacity-60"
              )}
            >
              {priorityOptions.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  onClick={() => onSelectedPriorityChange(opt.value)}
                >
                  {opt.label}
                </DropdownItem>
              ))}
            </CustomDropdown>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 pb-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={savingPriority}>
            إلغاء
          </Button>
          <Button
            onClick={() => onSave()}
            disabled={savingPriority}
            className="min-w-[120px]"
          >
            {savingPriority ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ"
            )}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}
