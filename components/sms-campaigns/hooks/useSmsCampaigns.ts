"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getCampaigns, deleteCampaign, sendCampaign, updateCampaign } from "@/lib/services/sms-api";
import type { UpdateCampaignBody } from "@/lib/services/sms-api";
import type { SMSCampaign } from "../types";
import { mapApiCampaignToUI } from "../types";
import useStore from "@/context/Store";

export function useSmsCampaigns() {
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCampaigns({ per_page: 100 });
      setCampaigns((res.campaigns ?? []).map(mapApiCampaignToUI));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل تحميل الحملات";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteCampaign = useCallback(
    async (id: string) => {
      try {
        await deleteCampaign(Number(id));
        toast.success("تم حذف الحملة");
        fetchCampaigns();
        useStore.getState().fetchCreditBalance?.();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "فشل الحذف");
      }
    },
    [fetchCampaigns]
  );

  const handleSendCampaign = useCallback(
    async (id: string) => {
      try {
        await sendCampaign(Number(id));
        toast.success("تم بدء إرسال الحملة");
        fetchCampaigns();
        useStore.getState().fetchCreditBalance?.();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "فشل الإرسال");
      }
    },
    [fetchCampaigns]
  );

  const handleEditCampaign = useCallback(
    async (id: string, body: UpdateCampaignBody) => {
      try {
        await updateCampaign(Number(id), body);
        toast.success("تم تحديث الحملة");
        fetchCampaigns();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "فشل التحديث");
      }
    },
    [fetchCampaigns]
  );

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    handleDeleteCampaign,
    handleSendCampaign,
    handleEditCampaign,
  };
}
