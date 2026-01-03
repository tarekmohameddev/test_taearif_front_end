"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditorT } from "@/context/editorI18nStore";

export default function SaveConfirmationDialog({
  open,
  onClose,
  onConfirm,
  isThemeConfirmation = false,
}: {
  open: boolean;
  isThemeConfirmation: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const t = useEditorT();

  // Reset loading state when dialog closes
  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  // Reset loading state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await Promise.resolve(onConfirm());

      // Add a timeout as fallback in case dialog doesn't close
      setTimeout(() => {
        setLoading(false);
      }, 5000); // 5 seconds timeout
    } catch (error) {
      console.error("Save operation failed:", error);
      // Reset loading state on error
      setLoading(false);
    }
    // Note: We don't reset loading here because the dialog should close on success
    // If the dialog doesn't close, the parent component should handle the loading state
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isThemeConfirmation
              ? t("dialog.apply_theme_title")
              : t("dialog.confirm_save_title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isThemeConfirmation ? (
              <>
                {t("dialog.theme_warning_part1")}{" "}
                <strong className="text-red-600">
                  {t("dialog.theme_warning_part2")}
                </strong>{" "}
                {t("dialog.theme_warning_part3")}
                <br />
                {t("dialog.cannot_undo")}
              </>
            ) : (
              t("dialog.save_changes_description")
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            aria-busy={loading}
            className={isThemeConfirmation ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {loading
              ? t("common.loading")
              : isThemeConfirmation
                ? t("dialog.apply_theme_button")
                : t("dialog.confirm_save_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
