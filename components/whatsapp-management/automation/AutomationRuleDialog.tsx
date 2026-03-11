"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/customComponents/CustomDialog";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import type { MessageTemplate, RuleFormData } from "./types";
import { TRIGGER_OPTIONS } from "./constants";

interface AutomationRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: RuleFormData;
  setFormData: (data: RuleFormData | ((prev: RuleFormData) => RuleFormData)) => void;
  templates: MessageTemplate[];
  editingRule: { id: string } | null;
  onSave: () => void;
}

export function AutomationRuleDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  templates,
  editingRule,
  onSave,
}: AutomationRuleDialogProps) {
  const isFormValid =
    !!formData.name && !!formData.trigger && !!formData.templateId;

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <CustomDialogContent className="sm:max-w-lg">
        <CustomDialogHeader>
          <CustomDialogTitle>
            {editingRule ? "تعديل قاعدة الأتمتة" : "إضافة قاعدة جديدة"}
          </CustomDialogTitle>
          <CustomDialogDescription>
            قم بإعداد قاعدة لإرسال رسائل آلية بناءً على سيناريوهات محددة
          </CustomDialogDescription>
        </CustomDialogHeader>

        <div className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6" dir="rtl">
          <div>
            <Label htmlFor="name">اسم القاعدة</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="مثال: رسالة ترحيب للعملاء الجدد"
            />
          </div>

          <div>
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="وصف مختصر للقاعدة..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="trigger">المحفز</Label>
            <CustomDropdown
              trigger={
                <span>
                  {TRIGGER_OPTIONS.find(
                    (opt) => opt.value === formData.trigger,
                  )?.label || "اختر المحفز"}
                </span>
              }
              fullWidth
            >
              {TRIGGER_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  onClick={() =>
                    setFormData({ ...formData, trigger: opt.value })
                  }
                >
                  {opt.label}
                </DropdownItem>
              ))}
            </CustomDropdown>
          </div>

          <div>
            <Label htmlFor="delay">التأخير (بالدقائق)</Label>
            <Input
              id="delay"
              type="number"
              value={formData.delayMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  delayMinutes: Number(e.target.value),
                })
              }
              placeholder="0 للإرسال الفوري"
            />
            <p className="text-xs text-muted-foreground mt-1">
              1440 دقيقة = 24 ساعة، 2880 دقيقة = 48 ساعة
            </p>
          </div>

          <div>
            <Label htmlFor="template">قالب الرسالة</Label>
            <CustomDropdown
              trigger={
                <span>
                  {templates.find(
                    (template) => template.id === formData.templateId,
                  )?.name || "اختر قالب الرسالة"}
                </span>
              }
              fullWidth
            >
              {templates.map((template) => (
                <DropdownItem
                  key={template.id}
                  onClick={() =>
                    setFormData({ ...formData, templateId: template.id })
                  }
                >
                  {template.name}
                </DropdownItem>
              ))}
            </CustomDropdown>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="active">تفعيل القاعدة فوراً</Label>
          </div>
        </div>

        <CustomDialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onSave} disabled={!isFormValid}>
            {editingRule ? "حفظ التغييرات" : "إضافة القاعدة"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
