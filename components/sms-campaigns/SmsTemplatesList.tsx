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
import { useSmsCampaignsDialogStore } from "@/context/store/dashboard/smsCampaignsDialog";
import type { SMSTemplate } from "./types";
import { getCategoryColor, CATEGORY_LABELS, TEMPLATE_CATEGORIES } from "./constants";

interface SmsTemplatesListProps {
  templates: SMSTemplate[];
  loading: boolean;
  error: string | null;
  onNewTemplate: () => void;
  onDeleteTemplate: (id: string) => void;
  onEditTemplate: (
    id: string,
    body: { name: string; content: string; category: string; is_active?: boolean }
  ) => void;
}

export function SmsTemplatesList({
  templates,
  loading,
  error,
  onNewTemplate,
  onDeleteTemplate,
  onEditTemplate,
}: SmsTemplatesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [deleteTemplateName, setDeleteTemplateName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<SMSTemplate | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const openCreateCampaignWithTemplate = useSmsCampaignsDialogStore(
    (s) => s.openCreateCampaignWithTemplate
  );

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteTemplateId(id);
    setDeleteTemplateName(name);
    setDeleteDialogOpen(true);
  };
  const openEditDialog = (template: SMSTemplate) => {
    setEditTemplate(template);
    setEditName(template.name);
    setEditContent(template.content);
    setEditCategory(template.category);
    setEditDialogOpen(true);
  };
  const handleConfirmEdit = async () => {
    if (!editTemplate || !editName.trim() || !editContent.trim()) return;
    setEditSubmitting(true);
    try {
      await onEditTemplate(editTemplate.id, {
        name: editName.trim(),
        content: editContent.trim(),
        category: editCategory,
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
            <CardTitle>قوالب الرسائل</CardTitle>
            <CardDescription>إدارة القوالب المحفوظة للرسائل</CardDescription>
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
                        <Badge variant="outline" className={getCategoryColor(template.category)}>
                          {CATEGORY_LABELS[template.category] ?? template.category}
                        </Badge>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                  </div>

                  {template.variables.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">المتغيرات:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {`[${variable}]`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

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
                          openCreateCampaignWithTemplate({
                            id: template.id,
                            content: template.content,
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

    <CustomDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} maxWidth="max-w-lg">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setEditDialogOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تعديل القالب</CustomDialogTitle>
          <CustomDialogDescription>
            تعديل اسم القالب والمحتوى والتصنيف. التغييرات تُحفظ فوراً بعد النقر على حفظ.
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
            <Label htmlFor="edit-template-category">التصنيف</Label>
            <select
              id="edit-template-category"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-template-content">محتوى القالب</Label>
            <Textarea
              id="edit-template-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="محتوى القالب..."
              rows={4}
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
