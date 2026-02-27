"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useAuthStore from "@/context/AuthContext";
import { EmailCreditBalance } from "./EmailCreditBalance";
import { EmailCampaignsStats } from "./EmailCampaignsStats";
import { EmailCampaignsOverview } from "./EmailCampaignsOverview";
import { EmailCampaignsList } from "./EmailCampaignsList";
import { EmailTemplatesList } from "./EmailTemplatesList";
import { EmailLogsList } from "./EmailLogsList";
import { CreateTemplateDialog } from "./dialogs";
import { useEmailCampaigns, useEmailTemplates, useEmailStats, useEmailLogs } from "./hooks";
import type { SendCampaignBody } from "@/lib/services/email-api";
import useStore from "@/context/Store";

export function EmailCampaignsPage() {
  const router = useRouter();
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);

  const goToCreateCampaign = () => router.push("/dashboard/email-campaigns/create");
  const goToCreateCampaignWithTemplate = (template: { id: string | number; subject: string; body_html: string; body_text?: string }) =>
    router.push(`/dashboard/email-campaigns/create?templateId=${template.id}`);

  const creditBalance = useStore((s) => s.creditBalance);
  const availableCredits = creditBalance.data?.available_credits ?? 0;

  const { stats, loading: statsLoading, fetchStats } = useEmailStats();
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    fetchCampaigns,
    handleDeleteCampaign,
    handleSendCampaign,
    handleEditCampaign,
    handlePauseCampaign,
    handleResumeCampaign,
  } = useEmailCampaigns();
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
    fetchTemplates,
    handleDeleteTemplate,
    handleEditTemplate,
  } = useEmailTemplates();
  const { logs, loading: logsLoading, error: logsError, fetchLogs } = useEmailLogs();

  useEffect(() => {
    if (authLoading || !userData?.token) return;
    fetchStats();
  }, [authLoading, userData?.token, fetchStats]);

  useEffect(() => {
    if (authLoading || !userData?.token) return;
    if (activeTab === "overview" || activeTab === "campaigns") {
      fetchCampaigns();
    }
  }, [authLoading, userData?.token, activeTab, fetchCampaigns]);

  useEffect(() => {
    if (authLoading || !userData?.token) return;
    if (activeTab === "overview" || activeTab === "templates") {
      fetchTemplates();
    }
  }, [authLoading, userData?.token, activeTab, fetchTemplates]);

  useEffect(() => {
    if (authLoading || !userData?.token) return;
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [authLoading, userData?.token, activeTab, fetchLogs]);

  const onSendCampaign = async (id: string, body: SendCampaignBody) => {
    await handleSendCampaign(id, body);
    fetchStats();
  };

  const onCampaignCreated = () => {
    fetchCampaigns();
    fetchStats();
  };

  const onTemplateCreated = () => {
    fetchTemplates();
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  if (!userData?.token) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            يلزم تسجيل الدخول لعرض حملات البريد الإلكتروني.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">حملات البريد الإلكتروني</h1>
        <p className="text-muted-foreground mt-1">إنشاء وإدارة حملات البريد الإلكتروني</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <EmailCreditBalance />
        </div>
        {!creditBalance.loading && availableCredits < 50 && (
          <Alert
            variant={availableCredits === 0 ? "destructive" : "default"}
            className="lg:col-span-3 flex items-center"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {availableCredits === 0
                ? "رصيدك انتهى. شراء كريديت لإرسال رسائل."
                : `رصيدك منخفض (${availableCredits} كريديت). يُنصح بشحن الرصيد قبل إطلاق حملات جديدة.`}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <EmailCampaignsStats stats={stats} loading={statsLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="campaigns">الحملات</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
          <TabsTrigger value="logs">السجل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EmailCampaignsOverview
            campaigns={campaigns}
            templates={templates}
            campaignsLoading={campaignsLoading}
            templatesLoading={templatesLoading}
            campaignsError={campaignsError}
            templatesError={templatesError}
            onNewCampaign={goToCreateCampaign}
            onNewCampaignWithTemplate={goToCreateCampaignWithTemplate}
          />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <EmailCampaignsList
            campaigns={campaigns}
            loading={campaignsLoading}
            error={campaignsError}
            availableCredits={availableCredits}
            onNewCampaign={goToCreateCampaign}
            onSendCampaign={onSendCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onEditCampaign={handleEditCampaign}
            onPauseCampaign={handlePauseCampaign}
            onResumeCampaign={handleResumeCampaign}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <EmailTemplatesList
            templates={templates}
            loading={templatesLoading}
            error={templatesError}
            onNewTemplate={() => setCreateTemplateOpen(true)}
            onNewCampaignWithTemplate={goToCreateCampaignWithTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onEditTemplate={handleEditTemplate}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <EmailLogsList logs={logs} loading={logsLoading} error={logsError} />
        </TabsContent>
      </Tabs>

      <CreateTemplateDialog
        open={createTemplateOpen}
        onOpenChange={setCreateTemplateOpen}
        onSuccess={onTemplateCreated}
      />
    </div>
  );
}
