"use client";

import React, { useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/customComponents/CustomDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, AlertCircle } from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface RequiredNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onNoteAdded: () => void;
  customerId: string;
  customerName: string;
}

export default function RequiredNoteDialog({
  open,
  onClose,
  onNoteAdded,
  customerId,
  customerName,
}: RequiredNoteDialogProps) {
  const { selectedCustomer } = useCrmStore();
  const [noteContent, setNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      toast.error("يجب كتابة ملاحظة قبل المتابعة");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add note via API
      // customerId might be request_id, so we need to get the actual customer_id
      const actualCustomerId = (selectedCustomer as any)?.customer_id 
        ? parseInt((selectedCustomer as any).customer_id.toString())
        : selectedCustomer?.id
        ? parseInt(selectedCustomer.id.toString())
        : null;
      
      // customerId passed to dialog is actually the request_id
      const requestId = (selectedCustomer as any)?.request_id 
        ? parseInt((selectedCustomer as any).request_id.toString())
        : parseInt(customerId); // If customerId is actually request_id
      
      const payload = {
        card_customer_id: actualCustomerId,
        card_request_id: requestId,
        card_content: noteContent.trim(),
        card_procedure: "note",
        card_project: null,
        card_property: null,
        card_date: new Date().toISOString(),
      };

      const response = await axiosInstance.post("/v1/crm/cards", payload);

      if (response.data.status === "success" || response.data.status === true) {
        toast.success("تم إضافة الملاحظة بنجاح");
        setNoteContent("");
        // Only call onNoteAdded after note is successfully saved
        // This will trigger the stage change API call
        onNoteAdded();
      } else {
        toast.error(response.data.message || "فشل في إضافة الملاحظة");
        // Don't call onNoteAdded if note saving failed
        // This ensures stage change API is not called
      }
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إضافة الملاحظة"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent closing dialog without note
  const handleCloseAttempt = () => {
    if (noteContent.trim()) {
      // If note is written, allow closing
      setNoteContent("");
      onClose();
    } else {
      // Show warning
      toast.error("يجب كتابة ملاحظة قبل المتابعة");
    }
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={handleCloseAttempt}
      maxWidth="max-w-md"
    >
      <CustomDialogContent className="p-5">
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            ملاحظة مطلوبة
          </CustomDialogTitle>
        </CustomDialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto">
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              يجب إضافة ملاحظة قبل نقل العميل "{customerName}" إلى مرحلة جديدة.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="required-note-content">
                محتوى الملاحظة <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="required-note-content"
                placeholder="اكتب ملاحظتك هنا..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || !noteContent.trim()}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {isSubmitting ? "جاري الحفظ..." : "حفظ الملاحظة والمتابعة"}
              </Button>
            </div>
          </form>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}

