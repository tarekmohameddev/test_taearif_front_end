"use client";

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/customComponents/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
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
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <CustomDialogContent className="sm:max-w-lg">
        <CustomDialogHeader>
          <CustomDialogTitle>إنشاء حملة واتساب</CustomDialogTitle>
          <CustomDialogDescription>
            اختر الرقم والمحتوى (رسالة أو قالب). يجب تحديد واحد فقط.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6" dir="rtl">
          <div>
            <Label>رقم الواتساب</Label>
            <CustomDropdown
              trigger={
                <span>
                  {waNumberId === ""
                    ? "اختر الرقم"
                    : `${
                        numbers.find((n) => n.id === Number(waNumberId))?.name ||
                        numbers.find((n) => n.id === Number(waNumberId))
                          ?.phoneNumber
                      } — ${
                        numbers.find((n) => n.id === Number(waNumberId))
                          ?.phoneNumber
                      }`}
                </span>
              }
              fullWidth
            >
              {numbers.map((n) => (
                <DropdownItem
                  key={n.id}
                  onClick={() => setWaNumberId(n.id)}
                >
                  {n.name || n.phoneNumber} — {n.phoneNumber}
                </DropdownItem>
              ))}
            </CustomDropdown>
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
            <CustomDropdown
              trigger={
                <span>
                  {contentType === "message" ? "رسالة نصية" : "قالب"}
                </span>
              }
              fullWidth
            >
              <DropdownItem onClick={() => setContentType("message")}>
                رسالة نصية
              </DropdownItem>
              <DropdownItem onClick={() => setContentType("template")}>
                قالب
              </DropdownItem>
            </CustomDropdown>
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
                <CustomDropdown
                  trigger={
                    <span>
                      {templateId === ""
                        ? "اختر قالباً"
                        : templates.find((t) => t.id === Number(templateId))
                            ?.name}
                    </span>
                  }
                  fullWidth
                >
                  {templates.map((t) => (
                    <DropdownItem
                      key={t.id}
                      onClick={() => {
                        setTemplateId(t.id);
                        setTemplateVars({});
                      }}
                    >
                      {t.name}
                    </DropdownItem>
                  ))}
                </CustomDropdown>
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
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "جاري الإنشاء..." : "إنشاء"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
