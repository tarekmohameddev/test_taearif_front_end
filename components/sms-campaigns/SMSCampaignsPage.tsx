"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useAuthStore from "@/context/AuthContext";
import { SMSCreditBalance } from "./SMSCreditBalance";
import { SmsCampaignsStats } from "./SmsCampaignsStats";
import { SmsCampaignsOverview } from "./SmsCampaignsOverview";
import { SmsCampaignsList } from "./SmsCampaignsList";
import { SmsTemplatesList } from "./SmsTemplatesList";
import { SmsLogsList } from "./SmsLogsList";
import { CreateCampaignDialog, CreateTemplateDialog } from "./dialogs";
import { useSmsCampaigns, useSmsTemplates, useSmsStats, useSmsLogs } from "./hooks";
import useStore from "@/context/Store";

export function SMSCampaignsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);

  const creditBalance = useStore((s) => s.creditBalance);
  const availableCredits = creditBalance.data?.available_credits ?? 0;

  const { stats, loading: statsLoading, fetchStats } = useSmsStats();
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    fetchCampaigns,
    handleDeleteCampaign,
    handleSendCampaign,
  } = useSmsCampaigns();
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
    fetchTemplates,
    handleDeleteTemplate,
  } = useSmsTemplates();
  const { logs, loading: logsLoading, error: logsError, fetchLogs } = useSmsLogs();

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

  const onSendCampaign = async (id: string) => {
    await handleSendCampaign(id);
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
            يلزم تسجيل الدخول لعرض حملات الرسائل النصية.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">حملات الرسائل النصية</h1>
        <p className="text-muted-foreground mt-1">إنشاء وإدارة حملات الرسائل النصية</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <SMSCreditBalance />
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

      <SmsCampaignsStats stats={stats} loading={statsLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="campaigns">الحملات</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
          <TabsTrigger value="logs">السجل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SmsCampaignsOverview
            campaigns={campaigns}
            templates={templates}
            campaignsLoading={campaignsLoading}
            templatesLoading={templatesLoading}
            campaignsError={campaignsError}
            templatesError={templatesError}
            onNewCampaign={() => setCreateCampaignOpen(true)}
          />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <SmsCampaignsList
            campaigns={campaigns}
            loading={campaignsLoading}
            error={campaignsError}
            availableCredits={availableCredits}
            onNewCampaign={() => setCreateCampaignOpen(true)}
            onSendCampaign={onSendCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <SmsTemplatesList
            templates={templates}
            loading={templatesLoading}
            error={templatesError}
            onNewTemplate={() => setCreateTemplateOpen(true)}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <SmsLogsList logs={logs} loading={logsLoading} error={logsError} />
        </TabsContent>
      </Tabs>

      <CreateCampaignDialog
        open={createCampaignOpen}
        onOpenChange={setCreateCampaignOpen}
        onSuccess={onCampaignCreated}
      />
      <CreateTemplateDialog
        open={createTemplateOpen}
        onOpenChange={setCreateTemplateOpen}
        onSuccess={onTemplateCreated}
      />
    </div>
  );
}
