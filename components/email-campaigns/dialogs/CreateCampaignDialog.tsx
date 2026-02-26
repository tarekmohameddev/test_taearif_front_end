"use client";

import { useState, useEffect } from "react";
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
import { createCampaign } from "@/lib/services/email-api";
import { useEmailCampaignsDialogStore } from "@/context/store/dashboard/emailCampaignsDialog";

interface CreateCampaignDialogProps {
  onSuccess: () => void;
}

export function CreateCampaignDialog({ onSuccess }: CreateCampaignDialogProps) {
  const {
    createCampaignDialogOpen: open,
    setCreateCampaignDialogOpen: onOpenChange,
    selectedTemplateForCampaign,
    clearSelectedTemplate,
  } = useEmailCampaignsDialogStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && selectedTemplateForCampaign) {
      setSubject(selectedTemplateForCampaign.subject);
      setBodyHtml(selectedTemplateForCampaign.body_html);
      setBodyText(selectedTemplateForCampaign.body_text ?? "");
    }
    if (!open) {
      setName("");
      setDescription("");
      setSubject("");
      setBodyHtml("");
      setBodyText("");
      clearSelectedTemplate();
    }
  }, [open, selectedTemplateForCampaign, clearSelectedTemplate]);

  const handleSubmit = async () => {
    if (!name.trim() || !subject.trim() || !bodyHtml.trim()) {
      toast.error("الاسم والموضوع ومحتوى HTML مطلوبان");
      return;
    }
    setSubmitting(true);
    try {
      await createCampaign({
        name: name.trim(),
        description: description.trim() || undefined,
        subject: subject.trim(),
        body_html: bodyHtml.trim(),
        body_text: bodyText.trim() || undefined,
        status: "draft",
        template_id: selectedTemplateForCampaign?.id ?? undefined,
      });
      toast.success("تم إنشاء الحملة");
      onOpenChange(false);
      setName("");
      setDescription("");
      setSubject("");
      setBodyHtml("");
      setBodyText("");
      clearSelectedTemplate();
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل إنشاء الحملة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <CustomDialogContent className="px-4 sm:px-6" dir="rtl">
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>إنشاء حملة بريد إلكتروني جديدة</CustomDialogTitle>
          <CustomDialogDescription>
            أدخل اسم الحملة وموضوع البريد والمحتوى. يمكنك لاحقاً تحديد المستلمين وتاريخ الإرسال.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">اسم الحملة</Label>
            <Input
              id="campaign-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عرض نهاية الأسبوع"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-desc">الوصف (اختياري)</Label>
            <Input
              id="campaign-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-subject">موضوع البريد</Label>
            <Input
              id="campaign-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="موضوع الرسالة"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-body-html">محتوى HTML</Label>
            <Textarea
              id="campaign-body-html"
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              placeholder="<p>محتوى البريد...</p>"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-body-text">محتوى نصي (اختياري)</Label>
            <Textarea
              id="campaign-body-text"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="نسخة نصية"
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
              "إنشاء الحملة"
            )}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
