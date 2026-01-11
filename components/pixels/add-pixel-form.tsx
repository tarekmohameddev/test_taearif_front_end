"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PixelFormData,
  PlatformOption,
  validatePixelForm,
  getPlatformDisplayName,
  getPlatformExamples,
  getPlatformDescription,
} from "./pixel-helpers";

interface AddPixelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PixelFormData) => Promise<void>;
  availablePlatforms: PlatformOption[];
  loading?: boolean;
}

export function AddPixelForm({
  open,
  onOpenChange,
  onSubmit,
  availablePlatforms,
  loading = false,
}: AddPixelFormProps) {
  const [formData, setFormData] = useState<PixelFormData>({
    platform: availablePlatforms[0]?.value || "facebook",
    pixel_id: "",
    is_active: true,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        platform: availablePlatforms[0]?.value || "facebook",
        pixel_id: "",
        is_active: true,
      });
      setValidationErrors({});
    }
  }, [open, availablePlatforms]);

  const handleSubmit = async () => {
    const validation = validatePixelForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    await onSubmit(formData);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent>
        <CustomDialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <CustomDialogTitle>إضافة Pixel جديد</CustomDialogTitle>
              <CustomDialogDescription>
                أدخل معلومات Pixel الجديد لربطه مع موقعك
              </CustomDialogDescription>
            </div>
            <CustomDialogClose onClose={() => onOpenChange(false)} />
          </div>
        </CustomDialogHeader>

        <div className="grid gap-4 py-4 px-4 sm:px-6">
          <div className="grid gap-2">
            <Label htmlFor="platform">المنصة</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({ ...formData, platform: value, pixel_id: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المنصة" />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availablePlatforms.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                جميع المنصات تم ربطها بالفعل
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pixel_id">معرف Pixel</Label>
            <Input
              id="pixel_id"
              value={formData.pixel_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pixel_id: e.target.value,
                })
              }
              placeholder="أدخل معرف Pixel"
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
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="is_active">تفعيل Pixel</Label>
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
          <Button
            onClick={handleSubmit}
            disabled={availablePlatforms.length === 0 || loading}
          >
            {loading ? "جاري الإضافة..." : "إضافة Pixel"}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}
