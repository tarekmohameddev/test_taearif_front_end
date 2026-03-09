"use client";

import React from "react";
import { Tag, Loader2 } from "lucide-react";
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
import type { StatusOption } from "../hooks/useStatusDialog";

export interface PropertyRequestStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: CustomerAction;
  statusOptions: StatusOption[];
  selectedStatusId: number | null;
  onSelectedStatusIdChange: (id: number) => void;
  loadingStatuses: boolean;
  savingStatus: boolean;
  onSave: () => void | Promise<void>;
  onClose: () => void;
}

export function PropertyRequestStatusDialog({
  open,
  onOpenChange,
  action,
  statusOptions,
  selectedStatusId,
  onSelectedStatusIdChange,
  loadingStatuses,
  savingStatus,
  onSave,
  onClose,
}: PropertyRequestStatusDialogProps) {
  const propertyRequestId = getPropertyRequestId(action);

  if (propertyRequestId == null) return null;

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="p-3">
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تغيير حالة طلب العقار</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر الحالة الجديدة لطلب العقار رقم #{propertyRequestId}
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
            <Label className="text-sm font-medium">اختر الحالة:</Label>
            {loadingStatuses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="mr-2 text-sm text-muted-foreground">
                  جاري تحميل الحالات...
                </span>
              </div>
            ) : (
              <CustomDropdown
                fullWidth
                contentZIndex={10003}
                trigger={
                  <span className="flex items-center gap-2">
                    {selectedStatusId != null
                      ? statusOptions.find((s) => s.id === selectedStatusId)?.name_ar ?? "اختر الحالة"
                      : "اختر الحالة"}
                  </span>
                }
                triggerClassName={cn(
                  "w-full justify-between",
                  savingStatus && "pointer-events-none opacity-60"
                )}
              >
                {statusOptions.map((status) => (
                  <DropdownItem
                    key={status.id}
                    onClick={() => onSelectedStatusIdChange(status.id)}
                  >
                    {status.name_ar}
                  </DropdownItem>
                ))}
              </CustomDropdown>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 pb-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={savingStatus}>
            إلغاء
          </Button>
          <Button
            onClick={() => onSave()}
            disabled={
              savingStatus ||
              loadingStatuses ||
              !selectedStatusId ||
              statusOptions.length === 0
            }
            className="min-w-[120px]"
          >
            {savingStatus ? (
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
