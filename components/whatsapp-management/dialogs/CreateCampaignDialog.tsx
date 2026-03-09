"use client";

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createWaCampaign, getWhatsAppApiErrorMessage } from "@/lib/services/whatsapp-api";
import type { CreateWaCampaignBody } from "../types";
import type { WhatsAppNumberDTO } from "../types";
import type { TemplateOption } from "../types";

export interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numbers: WhatsAppNumberDTO[];
  templates: TemplateOption[];
  onSuccess: () => void;
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
  numbers,
  templates,
  onSuccess,
}: CreateCampaignDialogProps) {
  const [waNumberId, setWaNumberId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<"message" | "template">("message");
  const [message, setMessage] = useState("");
  const [templateId, setTemplateId] = useState<number | "">("");
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = useCallback(() => {
    setWaNumberId("");
    setName("");
    setDescription("");
    setContentType("message");
    setMessage("");
    setTemplateId("");
    setTemplateVars({});
    setError("");
  }, []);

  useEffect(() => {
    if (open) resetForm();
  }, [open, resetForm]);

  const handleSubmit = async () => {
    if (!waNumberId || !name.trim()) {
      setError("الرقم واسم الحملة مطلوبان.");
      return;
    }
    const body: CreateWaCampaignBody = {
      wa_number_id: Number(waNumberId),
      name: name.trim(),
      description: description.trim() || undefined,
      status: "draft",
    };
    if (contentType === "message") {
      if (!message.trim()) {
        setError("محتوى الرسالة مطلوب.");
        return;
      }
      body.message = message.trim();
    } else {
      if (!templateId) {
        setError("اختر قالباً.");
        return;
      }
      body.template_id = Number(templateId);
      if (Object.keys(templateVars).length > 0) {
        body.meta = { variables: templateVars };
      }
    }
    setSubmitting(true);
    setError("");
    try {
      await createWaCampaign(body);
      toast.success("تم إنشاء الحملة");
      onOpenChange(false);
      resetForm();
      onSuccess();
    } catch (e) {
      setError(getWhatsAppApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === Number(templateId));
  const templateVarKeys = selectedTemplate?.variables ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء حملة واتساب</DialogTitle>
          <DialogDescription>
            اختر الرقم والمحتوى (رسالة أو قالب). يجب تحديد واحد فقط.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>رقم الواتساب</Label>
            <Select
              value={waNumberId === "" ? "" : String(waNumberId)}
              onValueChange={(v) => setWaNumberId(v === "" ? "" : Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الرقم" />
              </SelectTrigger>
              <SelectContent>
                {numbers.map((n) => (
                  <SelectItem key={n.id} value={String(n.id)}>
                    {n.name || n.phoneNumber} — {n.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>اسم الحملة</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: حملة العروض"
            />
          </div>
          <div>
            <Label>الوصف (اختياري)</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف قصير"
            />
          </div>
          <div>
            <Label>نوع المحتوى</Label>
            <Select
              value={contentType}
              onValueChange={(v) => setContentType(v as "message" | "template")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message">رسالة نصية</SelectItem>
                <SelectItem value="template">قالب</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {contentType === "message" && (
            <div>
              <Label>نص الرسالة</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="محتوى الرسالة..."
                rows={4}
              />
            </div>
          )}
          {contentType === "template" && (
            <>
              <div>
                <Label>القالب</Label>
                <Select
                  value={templateId === "" ? "" : String(templateId)}
                  onValueChange={(v) => {
                    setTemplateId(v === "" ? "" : Number(v));
                    setTemplateVars({});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قالباً" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {templateVarKeys.length > 0 && (
                <div className="space-y-2">
                  <Label>متغيرات القالب</Label>
                  {templateVarKeys.map((key) => (
                    <Input
                      key={key}
                      placeholder={key}
                      value={templateVars[key] ?? ""}
                      onChange={(e) =>
                        setTemplateVars((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "جاري الإنشاء..." : "إنشاء"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
