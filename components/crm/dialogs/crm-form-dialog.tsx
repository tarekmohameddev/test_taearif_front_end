"use client";

import React, { useState, useEffect } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { CustomDropdown, DropdownItem } from "@/components/customComponents/customDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, X, AlertTriangle } from "lucide-react";

interface CrmFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: "stages" | "procedures" | "priorities" | "types";
  mode: "add" | "edit";
  initialData?: any;
  isLoading?: boolean;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
}

const colorOptions = [
  { value: "#2196f3", label: "أزرق", color: "#2196f3" },
  { value: "#4caf50", label: "أخضر", color: "#4caf50" },
  { value: "#ff9800", label: "برتقالي", color: "#ff9800" },
  { value: "#f44336", label: "أحمر", color: "#f44336" },
  { value: "#9c27b0", label: "بنفسجي", color: "#9c27b0" },
  { value: "#607d8b", label: "رمادي", color: "#607d8b" },
  { value: "#795548", label: "بني", color: "#795548" },
  { value: "#e91e63", label: "وردي", color: "#e91e63" },
];

const iconOptions = [
  { value: "fa fa-check-circle", label: "✓ دائرة" },
  { value: "fa fa-user-shield", label: "👤 درع" },
  { value: "fa fa-phone", label: "📞 هاتف" },
  { value: "fa fa-envelope", label: "✉️ بريد" },
  { value: "fa fa-calendar", label: "📅 تقويم" },
  { value: "fa fa-map-marker", label: "📍 موقع" },
  { value: "fa fa-home", label: "🏠 منزل" },
  { value: "fa fa-dollar", label: "💲 دولار" },
  { value: "fa fa-flag", label: "🚩 علم" },
  { value: "fa fa-star", label: "⭐ نجمة" },
  { value: "arrow-up", label: "⬆️ سهم لأعلى" },
  { value: "arrow-down", label: "⬇️ سهم لأسفل" },
  { value: "minus", label: "➖ ناقص" },
  { value: "check", label: "✓ صح" },
  { value: "check-all", label: "✓✓ صح كلها" },
  { value: "arrows", label: "↔️ أسهم" },
];

export default function CrmFormDialog({
  isOpen,
  onClose,
  onSubmit,
  type,
  mode,
  initialData,
  isLoading = false,
  error = null,
  fieldErrors = {},
}: CrmFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    color: "#2196f3",
    icon: "fa fa-check-circle",
    order: 1,
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name:
          initialData.stage_name ||
          initialData.procedure_name ||
          initialData.name ||
          "",
        value: initialData.value || "",
        color: initialData.color || "#2196f3",
        icon: initialData.icon || "fa fa-check-circle",
        order: initialData.order || 1,
        description: initialData.description || "",
        is_active:
          initialData.is_active === 1 || initialData.is_active === true,
      });
    } else {
      setFormData({
        name: "",
        value: "",
        color: "#2196f3",
        icon: "fa fa-check-circle",
        order: 1,
        description: "",
        is_active: true,
      });
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let submitData: any = {
      color: formData.color,
      icon: formData.icon,
      order: formData.order,
      is_active: formData.is_active,
    };

    // Add type-specific fields
    switch (type) {
      case "stages":
        submitData.stage_name = formData.name;
        if (formData.description) submitData.description = formData.description;
        break;
      case "procedures":
        submitData.procedure_name = formData.name;
        if (formData.description) submitData.description = formData.description;
        break;
      case "priorities":
        submitData.name = formData.name;
        submitData.value = parseInt(formData.value) || 1;
        break;
      case "types":
        submitData.name = formData.name;
        submitData.value = formData.value || formData.name;
        break;
    }

    onSubmit(submitData);
  };

  const getTitle = () => {
    const action = mode === "add" ? "إضافة" : "تعديل";
    const typeName = {
      stages: "مرحلة",
      procedures: "إجراء",
      priorities: "أولوية",
      types: "نوع",
    }[type];
    return `${action} ${typeName}`;
  };

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      maxWidth="max-w-md"
      elevated
    >
      <CustomDialogContent className="p-4 sm:p-6" dir="rtl">
        <CustomDialogClose onClose={onClose} />
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2">
            {getTitle()}
          </CustomDialogTitle>
        </CustomDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* رسالة الخطأ العامة */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* الاسم */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {type === "stages"
                ? "اسم المرحلة"
                : type === "procedures"
                  ? "اسم الإجراء"
                  : type === "priorities"
                    ? "اسم الأولوية"
                    : "اسم النوع"}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="أدخل الاسم"
              required
              className={fieldErrors.name ? "border-red-500" : ""}
            />
            {fieldErrors.name && (
              <div className="text-red-600 text-sm flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {fieldErrors.name[0]}
              </div>
            )}
          </div>

          {/* القيمة (للأولويات والأنواع فقط) */}
          {(type === "priorities" || type === "types") && (
            <div className="space-y-2">
              <Label htmlFor="value">
                {type === "priorities" ? "القيمة الرقمية" : "القيمة"}
              </Label>
              <Input
                id="value"
                type={type === "priorities" ? "number" : "text"}
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder={type === "priorities" ? "1" : "Rent"}
                required
                className={fieldErrors.value ? "border-red-500" : ""}
              />
              {fieldErrors.value && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {fieldErrors.value[0]}
                </div>
              )}
            </div>
          )}

          {/* اللون */}
          <div className="space-y-2">
            <Label>اللون</Label>
            <CustomDropdown
              contentZIndex={10003}
              dropdownWidth="w-56"
              maxHeight="16rem"
              trigger={
                <span className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor:
                        colorOptions.find((c) => c.value === formData.color)
                          ?.color ?? formData.color,
                    }}
                  />
                  {
                    colorOptions.find((c) => c.value === formData.color)
                      ?.label ?? "اختر اللون"
                  }
                </span>
              }
            >
              {colorOptions.map((color) => (
                <DropdownItem
                  key={color.value}
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color.color }}
                    />
                    {color.label}
                  </div>
                </DropdownItem>
              ))}
            </CustomDropdown>
          </div>

          {/* الأيقونة */}
          <div className="space-y-2">
            <Label>الأيقونة</Label>
            <CustomDropdown
              contentZIndex={10003}
              dropdownWidth="w-56"
              maxHeight="16rem"
              trigger={
                <span>
                  {iconOptions.find((i) => i.value === formData.icon)?.label ??
                    "اختر الأيقونة"}
                </span>
              }
            >
              {iconOptions.map((icon) => (
                <DropdownItem
                  key={icon.value}
                  onClick={() =>
                    setFormData({ ...formData, icon: icon.value })
                  }
                >
                  {icon.label}
                </DropdownItem>
              ))}
            </CustomDropdown>
          </div>

          {/* الترتيب */}
          <div className="space-y-2">
            <Label htmlFor="order">الترتيب</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 1,
                })
              }
              min="1"
              required
            />
          </div>

          {/* الوصف (للمراحل والإجراءات فقط) */}
          {(type === "stages" || type === "procedures") && (
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="أدخل وصفاً مختصراً"
                rows={3}
                className={fieldErrors.description ? "border-red-500" : ""}
              />
              {fieldErrors.description && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {fieldErrors.description[0]}
                </div>
              )}
            </div>
          )}

          {/* الحالة النشطة */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">نشط</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              {mode === "add" ? "إضافة" : "حفظ"}
            </Button>
          </div>
        </form>
      </CustomDialogContent>
    </CustomDialog>
  );
}
