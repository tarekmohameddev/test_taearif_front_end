"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Megaphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getWhatsAppNumbers, getWaTemplates, pauseWaCampaign, deleteWaCampaign, getWhatsAppApiErrorMessage } from "@/lib/services/whatsapp-api";
import { useWaCampaigns } from "./hooks";
import { WaCampaignsTable } from "./WaCampaignsTable";
import {
  CreateCampaignDialog,
  SendCampaignDialog,
  PauseConfirmDialog,
  ResumeCampaignDialog,
  DeleteConfirmDialog,
} from "./dialogs";
import type { ApiWaCampaign, TemplateOption, WhatsAppNumberDTO } from "./types";

export function WhatsAppCampaignsTab() {
  const {
    campaigns,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    fetchCampaigns,
  } = useWaCampaigns();

  const [numbers, setNumbers] = useState<WhatsAppNumberDTO[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendCampaign, setSendCampaign] = useState<ApiWaCampaign | null>(null);
  const [pauseConfirmOpen, setPauseConfirmOpen] = useState(false);
  const [pauseCampaign, setPauseCampaign] = useState<ApiWaCampaign | null>(null);
  const [pauseLoadingId, setPauseLoadingId] = useState<number | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeCampaign, setResumeCampaign] = useState<ApiWaCampaign | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCampaign, setDeleteCampaign] = useState<ApiWaCampaign | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    getWhatsAppNumbers()
      .then(setNumbers)
      .catch(() => setNumbers([]));
  }, []);

  useEffect(() => {
    getWaTemplates({ per_page: 100 })
      .then((list) =>
        setTemplates(
          list.map((t) => ({
            id: t.id,
            name: t.name,
            variables: t.variables,
          }))
        )
      )
      .catch(() => setTemplates([]));
  }, []);

  const handleCreateSuccess = () => {
    fetchCampaigns();
  };

  const handleSendSuccess = () => {
    fetchCampaigns();
  };

  const openSend = (campaign: ApiWaCampaign) => {
    setSendCampaign(campaign);
    setSendOpen(true);
  };

  const openPause = (campaign: ApiWaCampaign) => {
    setPauseCampaign(campaign);
    setPauseConfirmOpen(true);
  };

  const handlePauseConfirm = async () => {
    if (!pauseCampaign) return;
    setPauseLoadingId(pauseCampaign.id);
    try {
      await pauseWaCampaign(pauseCampaign.id);
      toast.success("تم إيقاف الحملة مؤقتاً");
      setPauseConfirmOpen(false);
      setPauseCampaign(null);
      fetchCampaigns();
    } catch (e) {
      toast.error(getWhatsAppApiErrorMessage(e));
    } finally {
      setPauseLoadingId(null);
    }
  };

  const openResume = (campaign: ApiWaCampaign) => {
    setResumeCampaign(campaign);
    setResumeOpen(true);
  };

  const handleResumeSuccess = () => {
    fetchCampaigns();
  };

  const openDelete = (campaign: ApiWaCampaign) => {
    setDeleteCampaign(campaign);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCampaign) return;
    setDeleteLoading(true);
    try {
      await deleteWaCampaign(deleteCampaign.id);
      toast.success("تم حذف الحملة");
      setDeleteOpen(false);
      setDeleteCampaign(null);
      fetchCampaigns();
    } catch (e) {
      toast.error(getWhatsAppApiErrorMessage(e));
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetCreateAndOpen = () => {
    setCreateOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            حملات الواتساب
          </h2>
          <p className="text-sm text-muted-foreground">
            إنشاء وإرسال حملات واتساب مع اختيار المستلمين (عملاء أو أرقام يدوية)
          </p>
        </div>
        <Button onClick={resetCreateAndOpen} className="gap-2">
          <Plus className="h-4 w-4" />
          إنشاء حملة
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <WaCampaignsTable
        campaigns={campaigns}
        numbers={numbers}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
        onSend={openSend}
        onPause={openPause}
        onResume={openResume}
        onDelete={openDelete}
        pauseLoadingId={pauseLoadingId}
      />

      <CreateCampaignDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        numbers={numbers}
        templates={templates}
        onSuccess={handleCreateSuccess}
      />

      <SendCampaignDialog
        open={sendOpen}
        onOpenChange={setSendOpen}
        campaign={sendCampaign}
        onSuccess={handleSendSuccess}
      />

      <PauseConfirmDialog
        open={pauseConfirmOpen}
        onOpenChange={setPauseConfirmOpen}
        campaign={pauseCampaign}
        loading={pauseLoadingId !== null}
        onConfirm={handlePauseConfirm}
      />

      <ResumeCampaignDialog
        open={resumeOpen}
        onOpenChange={setResumeOpen}
        campaign={resumeCampaign}
        onSuccess={handleResumeSuccess}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        campaign={deleteCampaign}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
