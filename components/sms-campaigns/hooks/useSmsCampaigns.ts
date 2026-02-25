"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getCampaigns,
  deleteCampaign,
  sendCampaign,
  updateCampaign,
  pauseCampaign,
  resumeCampaign,
} from "@/lib/services/sms-api";
import type { UpdateCampaignBody, SendCampaignBody, ResumeCampaignBody } from "@/lib/services/sms-api";
import type { SMSCampaign } from "../types";
import { mapApiCampaignToUI } from "../types";
import { SMS_USER_MESSAGES, getSmsCreditNoteAr } from "../constants";
import { getSmsUserFacingMessage } from "../utils";
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
      const msg = getSmsUserFacingMessage(e);
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
        toast.error(getSmsUserFacingMessage(e));
      }
    },
    [fetchCampaigns]
  );

  const handleSendCampaign = useCallback(
    async (id: string, body: SendCampaignBody) => {
      try {
        await sendCampaign(Number(id), body);
        toast.success("تم بدء إرسال الحملة");
        fetchCampaigns();
        useStore.getState().fetchCreditBalance?.();
      } catch (e: unknown) {
        toast.error(getSmsUserFacingMessage(e));
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
        toast.error(getSmsUserFacingMessage(e));
      }
    },
    [fetchCampaigns]
  );

  const handlePauseCampaign = useCallback(
    async (id: string) => {
      try {
        const data = await pauseCampaign(Number(id));
        const note = data.credit_info?.note;
        toast.success(getSmsCreditNoteAr(note) ?? note ?? SMS_USER_MESSAGES.afterPause(
          data.sent_count,
          data.credit_info?.released ?? 0,
          data.credit_info?.balance_after_release ?? 0
        ));
        fetchCampaigns();
        useStore.getState().fetchCreditBalance?.();
      } catch (e: unknown) {
        toast.error(getSmsUserFacingMessage(e));
      }
    },
    [fetchCampaigns]
  );

  const handleResumeCampaign = useCallback(
    async (id: string, params: ResumeCampaignBody) => {
      const idempotencyKey = crypto.randomUUID();
      try {
        const data = await resumeCampaign(Number(id), params, idempotencyKey);
        const note = data.credit_info?.note;
        const message = getSmsCreditNoteAr(note) ?? note
          ?? (data.mode === "continue"
            ? SMS_USER_MESSAGES.afterResumeContinue(data.recipient_count)
            : SMS_USER_MESSAGES.afterResumeRestart(data.recipient_count));
        toast.success(message);
        fetchCampaigns();
        useStore.getState().fetchCreditBalance?.();
      } catch (e: unknown) {
        toast.error(getSmsUserFacingMessage(e));
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
    handlePauseCampaign,
    handleResumeCampaign,
  };
}
