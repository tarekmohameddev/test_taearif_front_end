"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/customComponents/CustomSelect";
import { Switch } from "@/components/ui/switch";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  Pixel,
  PixelFormData,
  PlatformOption,
  validatePixelForm,
  getPlatformDisplayName,
  getPlatformExamples,
  getPlatformDescription,
} from "./pixel-helpers";

interface EditPixelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixel: Pixel | null;
  onSubmit: (id: number, data: PixelFormData) => Promise<void>;
  availablePlatforms: PlatformOption[];
  loading?: boolean;
}

export function EditPixelForm({
  open,
  onOpenChange,
  pixel,
  onSubmit,
  availablePlatforms,
  loading = false,
}: EditPixelFormProps) {
  const [formData, setFormData] = useState<PixelFormData>({
    platform: "facebook",
    pixel_id: "",
    is_active: true,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Populate form when pixel changes
  useEffect(() => {
    if (pixel) {
      setFormData({
        platform: pixel.platform,
        pixel_id: pixel.pixel_id,
        is_active: pixel.is_active,
      });
      setValidationErrors({});
    }
  }, [pixel]);

  const handleSubmit = async () => {
    if (!pixel) return;

    const validation = validatePixelForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    await onSubmit(pixel.id, formData);
  };

  if (!pixel) return null;

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent>
        <CustomDialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <CustomDialogTitle>تعديل Pixel</CustomDialogTitle>
              <CustomDialogDescription>
                تعديل معلومات Pixel المحدد
              </CustomDialogDescription>
            </div>
            <CustomDialogClose onClose={() => onOpenChange(false)} />
          </div>
        </CustomDialogHeader>

        <div className="grid gap-4 py-4 px-4 sm:px-6">
          <div className="grid gap-2">
            <Label htmlFor="edit-platform">المنصة</Label>
            <CustomSelect
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({ ...formData, platform: value })
              }
              options={availablePlatforms.map((p) => ({
                label: p.label,
                value: p.value,
              }))}
              placeholder="اختر المنصة"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-pixel_id">معرف Pixel</Label>
            <Input
              id="edit-pixel_id"
              value={formData.pixel_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pixel_id: e.target.value,
                })
              }
              placeholder={`مثال: ${getPlatformExamples(formData.platform)}`}
              className={
                validationErrors.pixel_id ? "border-destructive" : ""
              }
            />
            {validationErrors.pixel_id && (
              <p className="text-sm text-destructive mt-1">
                {validationErrors.pixel_id}
              </p>
            )}
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <div className="font-medium mb-2">
                📋 متطلبات {getPlatformDisplayName(formData.platform)}:
              </div>
              <p className="mb-2">
                {getPlatformDescription(formData.platform)}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium">مثال:</span>
                <code className="bg-background px-2 py-1 rounded text-xs font-mono">
                  {getPlatformExamples(formData.platform)}
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="edit-is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="edit-is_active">تفعيل Pixel</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 px-4 sm:px-6 pb-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}
