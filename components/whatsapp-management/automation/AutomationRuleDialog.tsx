"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? "تعديل قاعدة الأتمتة" : "إضافة قاعدة جديدة"}
          </DialogTitle>
          <DialogDescription>
            قم بإعداد قاعدة لإرسال رسائل آلية بناءً على سيناريوهات محددة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            <Select
              value={formData.trigger}
              onValueChange={(value) =>
                setFormData({ ...formData, trigger: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المحفز" />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={formData.templateId}
              onValueChange={(value) =>
                setFormData({ ...formData, templateId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر قالب الرسالة" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onSave} disabled={!isFormValid}>
            {editingRule ? "حفظ التغييرات" : "إضافة القاعدة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
