"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { cn } from "@/lib/utils";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "إلغاء",
  onConfirm,
  variant = "default",
  icon,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div
                className={cn(
                  "p-2 rounded-full",
                  variant === "danger"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-600"
                )}
              >
                {icon}
              </div>
            )}
            <CustomDialogTitle>{title}</CustomDialogTitle>
          </div>
          <CustomDialogDescription className="text-base text-gray-600 mt-2">
            {description}
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={cn(
              "min-w-[100px]",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            )}
          >
            {confirmText}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
