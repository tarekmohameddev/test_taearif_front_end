"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCampaign, getTemplate } from "@/lib/services/email-api";
import { EmailBodyEditor } from "./EmailBodyEditor";

export function CreateCampaignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get("templateId");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(!!templateIdParam);

  useEffect(() => {
    if (!templateIdParam) return;
    const id = Number(templateIdParam);
    if (Number.isNaN(id)) return;
    setLoadingTemplate(true);
    getTemplate(id)
      .then((t) => {
        setSubject(t.subject);
        setBodyHtml(t.body_html || "");
        setBodyText(t.body_text || "");
      })
      .catch(() => toast.error("تعذر تحميل القالب"))
      .finally(() => setLoadingTemplate(false));
  }, [templateIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        template_id: templateIdParam ? Number(templateIdParam) : undefined,
      });
      toast.success("تم إنشاء الحملة");
      router.push("/dashboard/email-campaigns");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إنشاء الحملة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] p-6 space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/email-campaigns" className="hover:text-foreground flex items-center gap-1">
          <ArrowRight className="h-4 w-4" />
          حملات البريد الإلكتروني
        </Link>
        <span>/</span>
        <span>إنشاء حملة جديدة</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إنشاء حملة بريد إلكتروني جديدة</CardTitle>
          <CardDescription>
            أدخل اسم الحملة وموضوع البريد والمحتوى. يمكنك لاحقاً تحديد المستلمين وتاريخ الإرسال.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTemplate ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <EmailBodyEditor
                value={bodyHtml}
                onChange={setBodyHtml}
                label="محتوى HTML"
                required
              />
              <div className="space-y-2">
                <Label htmlFor="campaign-body-text">محتوى نصي (اختياري)</Label>
                <Textarea
                  id="campaign-body-text"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="نسخة نصية"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "إنشاء الحملة"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
