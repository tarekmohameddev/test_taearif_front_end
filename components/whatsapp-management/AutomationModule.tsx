"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AutomationRule, MessageTemplate } from "./types";
import {
  getAutomationRules,
  getAutomationStats,
  getMessageTemplates,
  updateAutomationRule,
  createAutomationRule,
  deleteAutomationRule,
} from "@/services/whatsapp-management-api";

interface AutomationModuleProps {
  selectedNumberId: number | null;
}

export function AutomationModule({ selectedNumberId }: AutomationModuleProps) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    trigger: "",
    delayMinutes: 0,
    templateId: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, [selectedNumberId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [rulesData, templatesData, statsData] = await Promise.all([
        getAutomationRules(selectedNumberId || undefined),
        getMessageTemplates(),
        getAutomationStats(),
      ]);
      setRules(rulesData);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load automation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTriggerText = (trigger: string) => {
    const triggers: Record<string, string> = {
      new_inquiry: "استفسار جديد",
      no_response_24h: "لا يوجد رد - 24 ساعة",
      no_response_48h: "لا يوجد رد - 48 ساعة",
      no_response_72h: "لا يوجد رد - 72 ساعة",
      follow_up: "متابعة دورية",
      appointment_reminder: "تذكير بالموعد",
      property_match: "عقار مطابق",
      price_change: "تغيير في السعر",
    };
    return triggers[trigger] || trigger;
  };

  const handleToggleActive = async (ruleId: string, isActive: boolean) => {
    try {
      await updateAutomationRule(ruleId, { isActive });
      setRules(
        rules.map((rule) =>
          rule.id === ruleId ? { ...rule, isActive } : rule
        )
      );
    } catch (error) {
      console.error("Failed to update rule:", error);
    }
  };

  const handleOpenDialog = (rule?: AutomationRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description,
        trigger: rule.trigger,
        delayMinutes: rule.delayMinutes,
        templateId: rule.templateId,
        isActive: rule.isActive,
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: "",
        description: "",
        trigger: "",
        delayMinutes: 0,
        templateId: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        await updateAutomationRule(editingRule.id, formData);
      } else {
        await createAutomationRule({
          ...formData,
          whatsappNumberId: selectedNumberId || undefined,
        });
      }
      await loadData();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه القاعدة؟")) return;
    try {
      await deleteAutomationRule(ruleId);
      setRules(rules.filter((rule) => rule.id !== ruleId));
    } catch (error) {
      console.error("Failed to delete rule:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي القواعد</p>
                <p className="text-2xl font-bold">{stats?.totalRules || 0}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">القواعد النشطة</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.activeRules || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">رسائل اليوم</p>
                <p className="text-2xl font-bold">
                  {stats?.messagesSent24h || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">معدل النجاح</p>
                <p className="text-2xl font-bold">
                  {stats?.successRate || 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            قواعد الأتمتة
          </h2>
          <p className="text-sm text-muted-foreground">
            إدارة الرسائل الآلية بناءً على سيناريوهات محددة
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة قاعدة جديدة
        </Button>
      </div>

      {/* Rules Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">القاعدة</TableHead>
                <TableHead className="text-right">المحفز</TableHead>
                <TableHead className="text-right">التأخير</TableHead>
                <TableHead className="text-right">عدد المرات</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        لا توجد قواعد أتمتة
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTriggerText(rule.trigger)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rule.delayMinutes === 0
                        ? "فوري"
                        : rule.delayMinutes >= 1440
                          ? `${rule.delayMinutes / 1440} يوم`
                          : rule.delayMinutes >= 60
                            ? `${rule.delayMinutes / 60} ساعة`
                            : `${rule.delayMinutes} دقيقة`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{rule.triggeredCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) =>
                          handleToggleActive(rule.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <SelectItem value="new_inquiry">استفسار جديد</SelectItem>
                  <SelectItem value="no_response_24h">
                    لا يوجد رد - 24 ساعة
                  </SelectItem>
                  <SelectItem value="no_response_48h">
                    لا يوجد رد - 48 ساعة
                  </SelectItem>
                  <SelectItem value="no_response_72h">
                    لا يوجد رد - 72 ساعة
                  </SelectItem>
                  <SelectItem value="follow_up">متابعة دورية</SelectItem>
                  <SelectItem value="appointment_reminder">
                    تذكير بالموعد
                  </SelectItem>
                  <SelectItem value="property_match">عقار مطابق</SelectItem>
                  <SelectItem value="price_change">تغيير في السعر</SelectItem>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSaveRule}
              disabled={
                !formData.name || !formData.trigger || !formData.templateId
              }
            >
              {editingRule ? "حفظ التغييرات" : "إضافة القاعدة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
