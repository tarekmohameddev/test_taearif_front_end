"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createTemplate } from "@/lib/services/email-api";
import { EmailBodyEditor } from "../EmailBodyEditor";

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
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !subject.trim() || !bodyHtml.trim()) {
      toast.error("الاسم والموضوع ومحتوى HTML مطلوبان");
      return;
    }
    setSubmitting(true);
    try {
      await createTemplate({
        name: name.trim(),
        subject: subject.trim(),
        body_html: bodyHtml.trim(),
        body_text: bodyText.trim() || undefined,
        is_active: true,
      });
      toast.success("تم إنشاء القالب");
      onOpenChange(false);
      setName("");
      setSubject("");
      setBodyHtml("");
      setBodyText("");
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل إنشاء القالب");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-2xl">
      <CustomDialogContent className="dir-rtl">
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>قالب بريد إلكتروني جديد</CustomDialogTitle>
          <CustomDialogDescription>
            أضف قالب بريد يمكنك استخدامه في حملات متعددة. استخدم &#123;&#123;name&#125;&#125; للمتغيرات.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
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
            <Label htmlFor="template-subject">موضوع البريد</Label>
            <Input
              id="template-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: مرحباً بك"
            />
          </div>
          <EmailBodyEditor value={bodyHtml} onChange={setBodyHtml} label="محتوى HTML" required minHeight="min-h-[240px]" />
          <div className="space-y-2">
            <Label htmlFor="template-body-text">محتوى نصي (اختياري)</Label>
            <Textarea
              id="template-body-text"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="نسخة نصية للبريد"
              rows={2}
            />
          </div>
        </div>
        <CustomDialogFooter>
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
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
