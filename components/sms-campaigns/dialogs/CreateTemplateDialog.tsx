"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createTemplate } from "@/lib/services/sms-api";
import { TEMPLATE_CATEGORIES } from "../constants";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateTemplateDialogProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("notification");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) {
      toast.error("الاسم والمحتوى مطلوبان");
      return;
    }
    setSubmitting(true);
    try {
      await createTemplate({
        name: name.trim(),
        content: content.trim(),
        category,
        is_active: true,
      });
      toast.success("تم إنشاء القالب");
      onOpenChange(false);
      setName("");
      setContent("");
      setCategory("notification");
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل إنشاء القالب");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>قالب جديد</DialogTitle>
          <DialogDescription>
            أضف قالب رسالة يمكنك استخدامه في حملات متعددة. استخدم [اسم_المتغير] للمتغيرات.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">اسم القالب</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: ترحيب بالعميل"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-category">التصنيف</Label>
            <select
              id="template-category"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-content">محتوى القالب</Label>
            <Textarea
              id="template-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="مرحباً [name]، ..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              "إنشاء القالب"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
