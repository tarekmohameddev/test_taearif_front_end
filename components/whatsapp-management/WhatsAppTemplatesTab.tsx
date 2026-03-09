"use client";

import { useEffect, useState } from "react";
import type { MessageTemplate } from "./types";
import {
  getMessageTemplates,
  getMessageTemplate,
} from "@/services/whatsapp-management-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

export function WhatsAppTemplatesTab() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplate | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState("");

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getMessageTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast({
        title: "فشل في تحميل القوالب",
        description: "حدث خطأ أثناء جلب قوالب واتساب من الخادم.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const resetForm = () => {
    setEditingTemplate(null);
    setName("");
    setCategory("");
    setContent("");
    setVariables("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEdit = async (template: MessageTemplate) => {
    try {
      const full = await getMessageTemplate(template.id);
      const t = full ?? template;
      setEditingTemplate(t);
      setName(t.name);
      setCategory(t.category);
      setContent(t.content);
      setVariables(t.variables.join(","));
      setOpenDialog(true);
    } catch (error) {
      console.error("Failed to load template:", error);
      toast({
        title: "فشل في جلب القالب",
        description: "تعذر تحميل تفاصيل هذا القالب.",
        variant: "destructive",
      });
    }
  };

  // NOTE: create/update/delete wiring إلى الباك-إند لم تُعرّف بعد في whatsapp-management-api.
  // حالياً هذه الواجهة للعرض فقط حتى تُضاف دوال CRUD كاملة.

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">قوالب واتساب</h2>
          <p className="text-sm text-muted-foreground">
            إدارة قوالب الرسائل المستخدمة في المحادثات والحملات.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>إضافة قالب جديد</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">القوالب المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">جارٍ تحميل القوالب...</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              لا توجد قوالب حالياً. يمكنك إضافة قالب جديد.
            </p>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {templates.map((t) => (
                  <Card
                    key={t.id}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-muted/40"
                    onClick={() => handleOpenEdit(t)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{t.name}</span>
                          {t.category && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {t.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line">
                          {t.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "تعديل قالب واتساب" : "إضافة قالب واتساب جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">اسم القالب</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: رسالة ترحيب"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">التصنيف</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="مثال: general, follow_up"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نص القالب</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="نص رسالة واتساب مع المتغيرات إن وجدت..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                المتغيرات (مفصولة بفاصلة)
              </label>
              <Input
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder="customer_name, company_name"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ملاحظة: هذه الواجهة تستخدم بيانات الباك‑إند مباشرة عبر
              /api/v1/whatsapp/templates. عمليات الحفظ والحذف يمكن ربطها لاحقاً بدوال
              مخصصة.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              disabled
              title="سيتم تفعيل الحفظ لاحقاً بعد تحديد عقد الباك‑إند لعمليات الإنشاء/التحديث."
            >
              حفظ (قريباً)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

