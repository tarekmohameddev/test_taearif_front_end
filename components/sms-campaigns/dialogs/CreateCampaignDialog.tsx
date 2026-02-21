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
import { createCampaign } from "@/lib/services/sms-api";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCampaignDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      toast.error("الاسم والرسالة مطلوبان");
      return;
    }
    setSubmitting(true);
    try {
      await createCampaign({
        name: name.trim(),
        description: description.trim() || undefined,
        message: message.trim(),
        status: "draft",
      });
      toast.success("تم إنشاء الحملة");
      onOpenChange(false);
      setName("");
      setDescription("");
      setMessage("");
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل إنشاء الحملة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء حملة جديدة</DialogTitle>
          <DialogDescription>
            أدخل اسم الحملة والرسالة. يمكنك لاحقاً تحديد المستلمين وتاريخ الإرسال.
          </DialogDescription>
        </DialogHeader>
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
            <Label htmlFor="campaign-message">نص الرسالة</Label>
            <Textarea
              id="campaign-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="محتوى الرسالة النصية..."
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
              "إنشاء الحملة"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
