"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCampaign,
  sendCampaign,
  pauseCampaign,
  resumeCampaign,
  updateCampaign,
  deleteCampaign,
} from "@/lib/services/email-api";
import type { SendCampaignBody, ResumeCampaignBody } from "@/lib/services/email-api";
import { mapApiCampaignToUI } from "./types";
import type { EmailCampaign } from "./types";
import { getStatusColor, STATUS_LABELS, EMAIL_USER_MESSAGES, getEmailCreditNoteAr } from "./constants";
import { CampaignActionButtons } from "./CampaignActionButtons";
import { canSendCampaign } from "./utils";
import { getEmailUserFacingMessage } from "./utils";
import { ArrowRight, Send, Clock, Coins, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CREDITS_PER_EMAIL } from "./EmailCreditBalance";
import useStore from "@/context/Store";
import toast from "react-hot-toast";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomersCheckboxesDropdown, type CustomerOption } from "@/components/customComponents/CustomersCheckboxesDropdown";
import { getCustomersList } from "@/lib/services/customers-hub-list-api";

interface EmailCampaignDetailProps {
  campaignId: string;
}

export function EmailCampaignDetail({ campaignId }: EmailCampaignDetailProps) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBodyHtml, setEditBodyHtml] = useState("");
  const [editBodyText, setEditBodyText] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendCustomersLoading, setSendCustomersLoading] = useState(false);
  const [sendCustomersList, setSendCustomersList] = useState<CustomerOption[]>([]);
  const [sendCustomersPage, setSendCustomersPage] = useState(1);
  const [sendCustomersHasMore, setSendCustomersHasMore] = useState(false);
  const [sendCustomersLoadMoreLoading, setSendCustomersLoadMoreLoading] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [manualEmailsRaw, setManualEmailsRaw] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pauseConfirmOpen, setPauseConfirmOpen] = useState(false);

  const creditBalance = useStore((s) => s.creditBalance);
  const availableCredits = creditBalance.data?.available_credits ?? 0;

  const fetchCampaign = async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaign(Number(campaignId));
      setCampaign(mapApiCampaignToUI(data));
    } catch (e: unknown) {
      const msg = getEmailUserFacingMessage(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  useEffect(() => {
    if (!sendDialogOpen) return;
    setSendCustomersLoading(true);
    setSendCustomersPage(1);
    getCustomersList({ action: "list", filters: {}, pagination: { page: 1, limit: 100 } })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pagination = res.data?.pagination;
        setSendCustomersList(list.map((c) => ({ id: c.id, name: c.name ?? "", phone: c.phone })));
        setSendCustomersHasMore(Boolean(pagination && pagination.currentPage < pagination.totalPages));
      })
      .catch(() => {
        toast.error("فشل تحميل قائمة العملاء");
        setSendCustomersList([]);
        setSendCustomersHasMore(false);
      })
      .finally(() => setSendCustomersLoading(false));
  }, [sendDialogOpen]);

  const loadMoreSendCustomers = () => {
    const nextPage = sendCustomersPage + 1;
    setSendCustomersLoadMoreLoading(true);
    getCustomersList({ action: "list", filters: {}, pagination: { page: nextPage, limit: 100 } })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pagination = res.data?.pagination;
        setSendCustomersList((prev) => [...prev, ...list.map((c) => ({ id: c.id, name: c.name ?? "", phone: c.phone }))]);
        setSendCustomersPage(nextPage);
        setSendCustomersHasMore(Boolean(pagination && pagination.currentPage < pagination.totalPages));
      })
      .catch(() => toast.error("فشل تحميل المزيد"))
      .finally(() => setSendCustomersLoadMoreLoading(false));
  };

  const handleSendCampaign = async (id: string, body: SendCampaignBody) => {
    try {
      await sendCampaign(Number(id), body);
      toast.success("تم بدء إرسال الحملة");
      fetchCampaign();
      useStore.getState().fetchCreditBalance?.();
      setSendDialogOpen(false);
    } catch (e: unknown) {
      toast.error(getEmailUserFacingMessage(e));
    }
  };

  const handleConfirmSend = () => {
    if (!campaign) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedManual = manualEmailsRaw
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && emailRegex.test(s));
    const hasCustomers = selectedCustomerIds.length > 0;
    const hasManual = normalizedManual.length > 0;
    if (!hasCustomers && !hasManual) {
      toast.error("اختر عملاء على الأقل أو أدخل عناوين بريد إلكتروني يدوياً.");
      return;
    }
    const body: SendCampaignBody =
      hasCustomers && hasManual
        ? { customer_ids: selectedCustomerIds.map(Number), manual_emails: normalizedManual }
        : hasCustomers
          ? { customer_ids: selectedCustomerIds.map(Number) }
          : { manual_emails: normalizedManual };
    handleSendCampaign(campaign.id, body);
  };

  const handlePause = async (id: string) => {
    setPauseLoading(true);
    try {
      const data = await pauseCampaign(Number(id));
      const note = data.credit_info?.note;
      toast.success(getEmailCreditNoteAr(note) ?? note ?? EMAIL_USER_MESSAGES.afterPause(data.sent_count, data.credit_info?.released ?? 0, data.credit_info?.balance_after_release ?? 0));
      setPauseConfirmOpen(false);
      fetchCampaign();
      useStore.getState().fetchCreditBalance?.();
    } catch (e: unknown) {
      toast.error(getEmailUserFacingMessage(e));
    } finally {
      setPauseLoading(false);
    }
  };

  const handleResume = async (id: string, params: ResumeCampaignBody) => {
    setResumeLoading(true);
    try {
      await resumeCampaign(Number(id), params, crypto.randomUUID());
      toast.success("تم استئناف الحملة");
      fetchCampaign();
      useStore.getState().fetchCreditBalance?.();
    } catch (e: unknown) {
      toast.error(getEmailUserFacingMessage(e));
    } finally {
      setResumeLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!campaign || !editName.trim() || !editSubject.trim() || !editBodyHtml.trim()) return;
    setEditSubmitting(true);
    try {
      await updateCampaign(Number(campaign.id), {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        subject: editSubject.trim(),
        body_html: editBodyHtml.trim(),
        body_text: editBodyText.trim() || undefined,
      });
      toast.success("تم تحديث الحملة");
      setEditDialogOpen(false);
      fetchCampaign();
    } catch (e: unknown) {
      toast.error(getEmailUserFacingMessage(e));
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!campaign) return;
    try {
      await deleteCampaign(Number(campaign.id));
      toast.success("تم حذف الحملة");
      router.push("/dashboard/email-campaigns");
    } catch (e: unknown) {
      toast.error(getEmailUserFacingMessage(e));
    }
  };

  const openEditDialog = () => {
    if (campaign) {
      setEditName(campaign.name);
      setEditDescription(campaign.description ?? "");
      setEditSubject(campaign.subject);
      setEditBodyHtml(campaign.bodyHtml);
      setEditBodyText(campaign.bodyText ?? "");
      setEditDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1000px] p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">جاري تحميل الحملة...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mx-auto max-w-[1000px] p-6">
        <Alert variant="destructive">
          <AlertDescription>{error ?? "الحملة غير موجودة"}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/dashboard/email-campaigns">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للحملات
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/email-campaigns" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة لقائمة الحملات
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={getStatusColor(campaign.status)}>
                  {STATUS_LABELS[campaign.status] ?? campaign.status}
                </Badge>
                {campaign.createdBy && (
                  <span className="text-sm text-muted-foreground">بواسطة: {campaign.createdBy}</span>
                )}
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <CampaignActionButtons
                campaign={campaign}
                onPause={() => setPauseConfirmOpen(true)}
                onResume={handleResume}
                onEdit={openEditDialog}
                onSend={(id, name) => {
                  setSendDialogOpen(true);
                }}
                onDelete={() => setDeleteDialogOpen(true)}
                pauseLoading={pauseLoading}
                resumeLoading={resumeLoading}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {campaign.description && (
            <p className="text-muted-foreground">{campaign.description}</p>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">موضوع البريد</h4>
            <p className="text-lg">{campaign.subject}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">محتوى البريد (HTML)</h4>
            <div className="bg-muted p-4 rounded-lg border">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }} />
            </div>
          </div>

          {campaign.bodyText && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">محتوى نصي</h4>
              <div className="bg-muted p-4 rounded-lg border whitespace-pre-wrap text-sm">{campaign.bodyText}</div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المستلمين</p>
              <p className="text-2xl font-bold">{campaign.recipientCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تم الإرسال</p>
              <p className="text-2xl font-bold">{campaign.sentCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تم التوصيل</p>
              <p className="text-2xl font-bold text-green-600">{campaign.deliveredCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">فشل</p>
              <p className="text-2xl font-bold text-red-600">{campaign.failedCount}</p>
            </div>
          </div>

          {campaign.recipientCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4" />
              <span>
                تكلفة الإرسال: {campaign.recipientCount * CREDITS_PER_EMAIL} كريديت
                {canSendCampaign(campaign.status) && availableCredits < campaign.recipientCount * CREDITS_PER_EMAIL && (
                  <Badge variant="destructive" className="mr-2">رصيد غير كافٍ</Badge>
                )}
              </span>
              {campaign.reservedCredits != null && campaign.reservedCredits > 0 && (
                <span className="text-amber-600">• {campaign.reservedCredits} محجوز للمتبقين</span>
              )}
              {campaign.pausedCount != null && campaign.pausedCount > 0 && (
                <span>• {campaign.pausedCount} لم يُرسَل لهم بعد</span>
              )}
            </div>
          )}

          {campaign.status === "in-progress" && campaign.recipientCount > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">التقدم</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((campaign.sentCount / campaign.recipientCount) * 100)}%
                </span>
              </div>
              <Progress value={(campaign.sentCount / campaign.recipientCount) * 100} />
              {campaign.reservedCredits != null && (
                <p className="text-xs text-muted-foreground mt-1">
                  {EMAIL_USER_MESSAGES.inProgressSummary(campaign.sentCount, campaign.recipientCount, campaign.sentCount, campaign.reservedCredits)}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {campaign.scheduledAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>مجدولة: {new Date(campaign.scheduledAt).toLocaleString("ar-SA")}</span>
              </div>
            )}
            {campaign.sentAt && (
              <div className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                <span>أرسلت: {new Date(campaign.sentAt).toLocaleString("ar-SA")}</span>
              </div>
            )}
            <span>أنشئت: {new Date(campaign.createdAt).toLocaleString("ar-SA")}</span>
          </div>

          {campaign.tags && campaign.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {campaign.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send dialog */}
      <CustomDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen} maxWidth="max-w-md">
        <CustomDialogContent>
          <CustomDialogClose onClose={() => setSendDialogOpen(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>تحديد المستلمين وإرسال الحملة</CustomDialogTitle>
            <CustomDialogDescription>
              اختر العملاء أو أدخل عناوين بريد لإرسال الحملة «{campaign.name}» لهم.
            </CustomDialogDescription>
          </CustomDialogHeader>
          <div className="px-4 sm:px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label>العملاء</Label>
              <CustomersCheckboxesDropdown
                customers={sendCustomersList}
                selectedCustomerIds={selectedCustomerIds}
                onSelectionChange={setSelectedCustomerIds}
                isLoading={sendCustomersLoading}
                placeholder="اختر العملاء..."
                hasMore={sendCustomersHasMore}
                onLoadMore={loadMoreSendCustomers}
                loadMoreLoading={sendCustomersLoadMoreLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>عناوين بريد إضافية (اختياري)</Label>
              <Textarea
                value={manualEmailsRaw}
                onChange={(e) => setManualEmailsRaw(e.target.value)}
                placeholder="عناوين بريد، مفصولة بفاصلة أو سطر جديد"
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleConfirmSend}>إرسال</Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Edit dialog */}
      <CustomDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} maxWidth="max-w-lg">
        <CustomDialogContent>
          <CustomDialogClose onClose={() => setEditDialogOpen(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>تعديل الحملة</CustomDialogTitle>
            <CustomDialogDescription>تعديل الاسم والموضوع والمحتوى.</CustomDialogDescription>
          </CustomDialogHeader>
          <div className="px-4 sm:px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label>اسم الحملة</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="اسم الحملة" />
            </div>
            <div className="space-y-2">
              <Label>الوصف (اختياري)</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="وصف مختصر" />
            </div>
            <div className="space-y-2">
              <Label>موضوع البريد</Label>
              <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} placeholder="موضوع الرسالة" />
            </div>
            <div className="space-y-2">
              <Label>محتوى HTML</Label>
              <Textarea value={editBodyHtml} onChange={(e) => setEditBodyHtml(e.target.value)} placeholder="محتوى البريد..." rows={6} />
            </div>
            <div className="space-y-2">
              <Label>محتوى نصي (اختياري)</Label>
              <Textarea value={editBodyText} onChange={(e) => setEditBodyText(e.target.value)} placeholder="نسخة نصية" rows={2} />
            </div>
          </div>
          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleEdit} disabled={editSubmitting}>{editSubmitting ? "جاري الحفظ..." : "حفظ"}</Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Pause confirm */}
      <CustomDialog open={pauseConfirmOpen} onOpenChange={setPauseConfirmOpen} maxWidth="max-w-md">
        <CustomDialogContent>
          <CustomDialogClose onClose={() => setPauseConfirmOpen(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>تأكيد إيقاف الحملة مؤقتاً</CustomDialogTitle>
            <CustomDialogDescription>هل تريد إيقاف الحملة «{campaign.name}» مؤقتاً؟</CustomDialogDescription>
          </CustomDialogHeader>
          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setPauseConfirmOpen(false)}>إلغاء</Button>
            <Button onClick={() => handlePause(campaign.id)} disabled={pauseLoading}>{pauseLoading ? "جاري الإيقاف..." : "إيقاف مؤقت"}</Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Delete confirm */}
      <CustomDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} maxWidth="max-w-md">
        <CustomDialogContent>
          <CustomDialogClose onClose={() => setDeleteDialogOpen(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>تأكيد حذف الحملة</CustomDialogTitle>
            <CustomDialogDescription>هل أنت متأكد من حذف الحملة «{campaign.name}»؟ لا يمكن التراجع.</CustomDialogDescription>
          </CustomDialogHeader>
          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  );
}
