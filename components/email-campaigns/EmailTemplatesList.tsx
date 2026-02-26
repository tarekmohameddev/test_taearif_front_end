"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { EmailBodyEditor } from "./EmailBodyEditor";
import type { EmailTemplate } from "./types";

interface EmailTemplatesListProps {
  templates: EmailTemplate[];
  loading: boolean;
  error: string | null;
  onNewTemplate: () => void;
  onNewCampaignWithTemplate?: (template: { id: string; subject: string; body_html: string; body_text?: string }) => void;
  onDeleteTemplate: (id: string) => void;
  onEditTemplate: (
    id: string,
    body: { name: string; subject: string; body_html: string; body_text?: string; is_active?: boolean }
  ) => void;
}

export function EmailTemplatesList({
  templates,
  loading,
  error,
  onNewTemplate,
  onNewCampaignWithTemplate,
  onDeleteTemplate,
  onEditTemplate,
}: EmailTemplatesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [deleteTemplateName, setDeleteTemplateName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [editName, setEditName] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBodyHtml, setEditBodyHtml] = useState("");
  const [editBodyText, setEditBodyText] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteTemplateId(id);
    setDeleteTemplateName(name);
    setDeleteDialogOpen(true);
  };
  const openEditDialog = (template: EmailTemplate) => {
    setEditTemplate(template);
    setEditName(template.name);
    setEditSubject(template.subject);
    setEditBodyHtml(template.bodyHtml);
    setEditBodyText(template.bodyText ?? "");
    setEditDialogOpen(true);
  };
  const handleConfirmEdit = async () => {
    if (!editTemplate || !editName.trim() || !editSubject.trim() || !editBodyHtml.trim()) return;
    setEditSubmitting(true);
    try {
      await onEditTemplate(editTemplate.id, {
        name: editName.trim(),
        subject: editSubject.trim(),
        body_html: editBodyHtml.trim(),
        body_text: editBodyText.trim() || undefined,
        is_active: editTemplate.isActive,
      });
      setEditDialogOpen(false);
      setEditTemplate(null);
    } finally {
      setEditSubmitting(false);
    }
  };
  const handleConfirmDelete = () => {
    if (deleteTemplateId) {
      onDeleteTemplate(deleteTemplateId);
      setDeleteDialogOpen(false);
      setDeleteTemplateId(null);
      setDeleteTemplateName("");
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>قوالب البريد الإلكتروني</CardTitle>
            <CardDescription>إدارة القوالب المحفوظة للبريد الإلكتروني</CardDescription>
          </div>
          <Button onClick={onNewTemplate}>
            <Plus className="h-4 w-4 ml-2" />
            قالب جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading && (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">جاري تحميل القوالب...</span>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {!loading &&
            templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">الموضوع: {template.subject}</p>
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: template.bodyHtml }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      آخر تحديث:{" "}
                      {new Date(template.updatedAt).toLocaleDateString("ar-SA")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onNewCampaignWithTemplate?.({
                            id: template.id,
                            subject: template.subject,
                            body_html: template.bodyHtml,
                            body_text: template.bodyText ?? undefined,
                          })
                        }
                      >
                        استخدام
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(template)}>
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(template.id, template.name)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>

    <CustomDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setDeleteDialogOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تأكيد حذف القالب</CustomDialogTitle>
          <CustomDialogDescription>
            هل أنت متأكد من حذف القالب «{deleteTemplateName}»؟ لا يمكن التراجع عن هذا الإجراء.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            حذف
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>

    <CustomDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} maxWidth="max-w-2xl">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setEditDialogOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تعديل القالب</CustomDialogTitle>
          <CustomDialogDescription>
            تعديل اسم القالب والموضوع والمحتوى. التغييرات تُحفظ فوراً بعد النقر على حفظ.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="edit-template-name">اسم القالب</Label>
            <Input
              id="edit-template-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="اسم القالب"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-template-subject">موضوع البريد</Label>
            <Input
              id="edit-template-subject"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              placeholder="موضوع البريد"
            />
          </div>
          <EmailBodyEditor value={editBodyHtml} onChange={setEditBodyHtml} label="محتوى HTML" required minHeight="min-h-[240px]" />
          <div className="space-y-2">
            <Label htmlFor="edit-template-body-text">محتوى نصي (اختياري)</Label>
            <Textarea
              id="edit-template-body-text"
              value={editBodyText}
              onChange={(e) => setEditBodyText(e.target.value)}
              placeholder="نسخة نصية"
              rows={2}
            />
          </div>
        </div>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleConfirmEdit} disabled={editSubmitting}>
            {editSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
    </>
  );
}
