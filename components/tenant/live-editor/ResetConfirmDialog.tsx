"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useEditorT } from "@/context/editorI18nStore";

interface ResetConfirmDialogProps {
  componentType: string;
  componentName: string;
  onConfirmReset: () => void;
  className?: string;
}

export function ResetConfirmDialog({
  componentType,
  componentName,
  onConfirmReset,
  className = "",
}: ResetConfirmDialogProps) {
  const t = useEditorT();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirmReset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:from-red-100 hover:to-orange-100 hover:border-red-300 transition-all duration-200 text-red-700 hover:text-red-800 ${className}`}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-medium">{t("reset_dialog.reset")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-700">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            {t("reset_dialog.reset_component_warning")}
          </DialogTitle>
          <div className="text-gray-700 leading-relaxed pt-2">
            <div className="space-y-3">
              <div className="font-semibold text-red-600">
                ⚠️ {t("reset_dialog.cannot_undo")}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm">
                  {t("reset_dialog.reset_description")}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <strong>{t("reset_dialog.will_remove")}</strong>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                  <li>{t("reset_dialog.custom_text")}</li>
                  <li>{t("reset_dialog.color_styling")}</li>
                  <li>{t("reset_dialog.layout_settings")}</li>
                  <li>{t("reset_dialog.theme_selections")}</li>
                  <li>{t("reset_dialog.other_configurations")}</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>{t("reset_dialog.restore_default")}</strong>
                </div>
              </div>

              <div className="text-sm font-medium text-gray-800">
                {t("reset_dialog.are_you_sure")}
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 hover:bg-gray-50"
          >
            {t("theme_selector.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("reset_dialog.yes_reset")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
