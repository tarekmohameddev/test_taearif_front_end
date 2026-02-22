"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getTemplates, deleteTemplate, updateTemplate } from "@/lib/services/sms-api";
import type { UpdateTemplateBody } from "@/lib/services/sms-api";
import type { SMSTemplate } from "../types";
import { mapApiTemplateToUI } from "../types";
import { getSmsErrorAr } from "../constants";

export function useSmsTemplates() {
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTemplates({ per_page: 100 });
      setTemplates((res.templates ?? []).map(mapApiTemplateToUI));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل تحميل القوالب";
      setError(msg);
      toast.error(getSmsErrorAr(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteTemplate = useCallback(
    async (id: string) => {
      try {
        await deleteTemplate(Number(id));
        toast.success("تم حذف القالب");
        fetchTemplates();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "فشل الحذف";
        toast.error(getSmsErrorAr(msg));
      }
    },
    [fetchTemplates]
  );

  const handleEditTemplate = useCallback(
    async (id: string, body: UpdateTemplateBody) => {
      try {
        await updateTemplate(Number(id), body);
        toast.success("تم تحديث القالب");
        fetchTemplates();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "فشل التحديث";
        toast.error(getSmsErrorAr(msg));
      }
    },
    [fetchTemplates]
  );

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    handleDeleteTemplate,
    handleEditTemplate,
  };
}
