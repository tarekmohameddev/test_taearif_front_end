"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Send, Clock, Coins, Plus, Loader2, LayoutGrid, Table2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
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
import type { SendCampaignBody, ResumeCampaignBody } from "@/lib/services/email-api";
import type { EmailCampaign } from "./types";
import { getStatusColor, STATUS_LABELS } from "./constants";
import { CREDITS_PER_EMAIL } from "./EmailCreditBalance";
import { EMAIL_USER_MESSAGES } from "./constants";
import { CampaignActionButtons } from "./CampaignActionButtons";
import { canSendCampaign } from "./utils";

interface EmailCampaignsListProps {
  campaigns: EmailCampaign[];
  loading: boolean;
  error: string | null;
  availableCredits: number;
  onNewCampaign: () => void;
  onSendCampaign: (id: string, body: SendCampaignBody) => void;
  onDeleteCampaign: (id: string) => void;
  onEditCampaign: (id: string, body: { name: string; description?: string; subject: string; body_html: string; body_text?: string }) => void;
  onPauseCampaign: (id: string) => void;
  onResumeCampaign: (id: string, params: ResumeCampaignBody) => void;
}

export function EmailCampaignsList({
  campaigns,
  loading,
  error,
  availableCredits,
  onNewCampaign,
  onSendCampaign,
  onDeleteCampaign,
  onEditCampaign,
  onPauseCampaign,
  onResumeCampaign,
}: EmailCampaignsListProps) {
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendCampaignId, setSendCampaignId] = useState<string | null>(null);
  const [sendCampaignName, setSendCampaignName] = useState("");
  const [sendCustomersLoading, setSendCustomersLoading] = useState(false);
  const [sendCustomersList, setSendCustomersList] = useState<CustomerOption[]>([]);
  const [sendCustomersPage, setSendCustomersPage] = useState(1);
  const [sendCustomersHasMore, setSendCustomersHasMore] = useState(false);
  const [sendCustomersLoadMoreLoading, setSendCustomersLoadMoreLoading] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [manualEmailsRaw, setManualEmailsRaw] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCampaignId, setDeleteCampaignId] = useState<string | null>(null);
  const [deleteCampaignName, setDeleteCampaignName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<EmailCampaign | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBodyHtml, setEditBodyHtml] = useState("");
  const [editBodyText, setEditBodyText] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [pauseLoadingId, setPauseLoadingId] = useState<string | null>(null);
  const [resumeLoadingId, setResumeLoadingId] = useState<string | null>(null);
  const [pauseConfirmOpen, setPauseConfirmOpen] = useState(false);
  const [pauseConfirmCampaign, setPauseConfirmCampaign] = useState<EmailCampaign | null>(null);

  const router = useRouter();

  const openCampaignDetail = (id: string) => {
    router.push(`/dashboard/email-campaigns/${id}`);
  };

  const openSendDialog = (id: string, name: string) => {
    setSendCampaignId(id);
    setSendCampaignName(name);
    setSelectedCustomerIds([]);
    setManualEmailsRaw("");
    setSendDialogOpen(true);
  };

  useEffect(() => {
    if (!sendDialogOpen) return;
    setSendCustomersLoading(true);
    setSendCustomersPage(1);
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: 1, limit: 100 },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pagination = res.data?.pagination;
        setSendCustomersList(
          list.map((c) => ({
            id: c.id,
            name: c.name ?? "",
            phone: c.phone,
          }))
        );
        setSendCustomersHasMore(
          Boolean(pagination && pagination.currentPage < pagination.totalPages)
        );
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
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: nextPage, limit: 100 },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pagination = res.data?.pagination;
        setSendCustomersList((prev) => [
          ...prev,
          ...list.map((c) => ({
            id: c.id,
            name: c.name ?? "",
            phone: c.phone,
          })),
        ]);
        setSendCustomersPage(nextPage);
        setSendCustomersHasMore(
          Boolean(pagination && pagination.currentPage < pagination.totalPages)
        );
      })
      .catch(() => toast.error("فشل تحميل المزيد"))
      .finally(() => setSendCustomersLoadMoreLoading(false));
  };
  const openDeleteDialog = (id: string, name: string) => {
    setDeleteCampaignId(id);
    setDeleteCampaignName(name);
    setDeleteDialogOpen(true);
  };
  const openEditDialog = (campaign: EmailCampaign) => {
    setEditCampaign(campaign);
    setEditName(campaign.name);
    setEditDescription(campaign.description ?? "");
    setEditSubject(campaign.subject);
    setEditBodyHtml(campaign.bodyHtml);
    setEditBodyText(campaign.bodyText ?? "");
    setEditDialogOpen(true);
  };

  const openPauseConfirmDialog = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) {
      setPauseConfirmCampaign(campaign);
      setPauseConfirmOpen(true);
    }
  };

  const handleConfirmPause = async () => {
    if (!pauseConfirmCampaign) return;
    setPauseLoadingId(pauseConfirmCampaign.id);
    try {
      await onPauseCampaign(pauseConfirmCampaign.id);
      setPauseConfirmOpen(false);
      setPauseConfirmCampaign(null);
    } finally {
      setPauseLoadingId(null);
    }
  };

  const handleResume = async (id: string, params: ResumeCampaignBody) => {
    setResumeLoadingId(id);
    try {
      await onResumeCampaign(id, params);
    } finally {
      setResumeLoadingId(null);
    }
  };
  const handleConfirmEdit = async () => {
    if (!editCampaign || !editName.trim() || !editSubject.trim() || !editBodyHtml.trim()) return;
    setEditSubmitting(true);
    try {
      await onEditCampaign(editCampaign.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        subject: editSubject.trim(),
        body_html: editBodyHtml.trim(),
        body_text: editBodyText.trim() || undefined,
      });
      setEditDialogOpen(false);
      setEditCampaign(null);
    } finally {
      setEditSubmitting(false);
    }
  };
  const handleConfirmSend = () => {
    if (!sendCampaignId) return;
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
        ? { customer_ids: selectedCustomerIds.map((id) => Number(id)), manual_emails: normalizedManual }
        : hasCustomers
          ? { customer_ids: selectedCustomerIds.map((id) => Number(id)) }
          : { manual_emails: normalizedManual };
    onSendCampaign(sendCampaignId, body);
    setSendDialogOpen(false);
    setSendCampaignId(null);
    setSendCampaignName("");
    setSelectedCustomerIds([]);
    setManualEmailsRaw("");
  };
  const handleConfirmDelete = () => {
    if (deleteCampaignId) {
      onDeleteCampaign(deleteCampaignId);
      setDeleteDialogOpen(false);
      setDeleteCampaignId(null);
      setDeleteCampaignName("");
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>جميع الحملات</CardTitle>
            <CardDescription>إدارة وعرض جميع حملات البريد الإلكتروني</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center rounded-md bg-muted/60 p-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 hover:bg-background [&_svg]:!h-5 [&_svg]:!w-5",
                  viewMode === "cards" && "bg-background"
                )}
                onClick={() => setViewMode("cards")}
                title="عرض البطاقات"
              >
                <LayoutGrid />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 hover:bg-background [&_svg]:!h-5 [&_svg]:!w-5",
                  viewMode === "table" && "bg-background"
                )}
                onClick={() => setViewMode("table")}
                title="عرض الجدول"
              >
                <Table2 />
              </Button>
            </div>
            <Button onClick={onNewCampaign}>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء حملة جديدة
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading && (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">جاري تحميل الحملات...</span>
          </div>
        )}
        {!loading && viewMode === "cards" && (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => openCampaignDetail(campaign.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>
                          {STATUS_LABELS[campaign.status] ?? campaign.status}
                        </Badge>
                      </div>
                      {campaign.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {campaign.description}
                        </p>
                      )}
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <CampaignActionButtons
                        campaign={campaign}
                        onPause={openPauseConfirmDialog}
                        onResume={handleResume}
                        onEdit={openEditDialog}
                        onSend={openSendDialog}
                        onDelete={openDeleteDialog}
                        pauseLoading={pauseLoadingId === campaign.id}
                        resumeLoading={resumeLoadingId === campaign.id}
                      />
                    </div>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground mb-1">الموضوع: {campaign.subject}</p>
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                      <p className="text-2xl font-bold text-green-600">
                        {campaign.deliveredCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">فشل</p>
                      <p className="text-2xl font-bold text-red-600">{campaign.failedCount}</p>
                    </div>
                  </div>
                  {campaign.recipientCount > 0 && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Coins className="h-4 w-4" />
                      <span>
                        تكلفة الإرسال: {campaign.recipientCount * CREDITS_PER_EMAIL} كريديت
                        {canSendCampaign(campaign.status) &&
                          availableCredits < campaign.recipientCount * CREDITS_PER_EMAIL && (
                            <Badge variant="destructive" className="mr-2">
                              رصيد غير كافٍ
                            </Badge>
                          )}
                      </span>
                      {campaign.reservedCredits != null && campaign.reservedCredits > 0 && (
                        <span className="text-amber-600">
                          • {campaign.reservedCredits} محجوز للمتبقين
                        </span>
                      )}
                      {campaign.pausedCount != null && campaign.pausedCount > 0 && (
                        <span className="text-muted-foreground">
                          • {campaign.pausedCount} لم يُرسَل لهم بعد
                        </span>
                      )}
                    </div>
                  )}

                  {campaign.status === "in-progress" && campaign.recipientCount > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">التقدم</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((campaign.sentCount / campaign.recipientCount) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(campaign.sentCount / campaign.recipientCount) * 100}
                      />
                      {campaign.reservedCredits != null && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {EMAIL_USER_MESSAGES.inProgressSummary(
                            campaign.sentCount,
                            campaign.recipientCount,
                            campaign.sentCount,
                            campaign.reservedCredits
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {campaign.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            مجدولة:{" "}
                            {new Date(campaign.scheduledAt).toLocaleString("ar-SA")}
                          </span>
                        </div>
                      )}
                      {campaign.sentAt && (
                        <div className="flex items-center gap-1">
                          <Send className="h-4 w-4" />
                          <span>
                            أرسلت: {new Date(campaign.sentAt).toLocaleString("ar-SA")}
                          </span>
                        </div>
                      )}
                      <span>بواسطة: {campaign.createdBy}</span>
                    </div>
                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="flex gap-1">
                        {campaign.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        )}

        {!loading && viewMode === "table" && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">الموضوع</TableHead>
                  <TableHead className="text-right">المستلمين</TableHead>
                  <TableHead className="text-right">أرسلت</TableHead>
                  <TableHead className="text-right">وصلت</TableHead>
                  <TableHead className="text-right">فشل</TableHead>
                  <TableHead className="text-right">مجدولة / أرسلت</TableHead>
                  <TableHead className="text-right">بواسطة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openCampaignDetail(campaign.id)}
                  >
                    <TableCell className="font-medium text-right">{campaign.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={getStatusColor(campaign.status)}>
                        {STATUS_LABELS[campaign.status] ?? campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right max-w-[140px] truncate text-muted-foreground" title={campaign.description ?? ""}>
                      {campaign.description || "—"}
                    </TableCell>
                    <TableCell className="text-right max-w-[180px] truncate" title={campaign.subject}>
                      {campaign.subject}
                    </TableCell>
                    <TableCell className="text-right">{campaign.recipientCount}</TableCell>
                    <TableCell className="text-right">{campaign.sentCount}</TableCell>
                    <TableCell className="text-right text-green-600">{campaign.deliveredCount}</TableCell>
                    <TableCell className="text-right text-red-600">{campaign.failedCount}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {campaign.scheduledAt
                        ? new Date(campaign.scheduledAt).toLocaleString("ar-SA")
                        : campaign.sentAt
                          ? new Date(campaign.sentAt).toLocaleString("ar-SA")
                          : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">{campaign.createdBy || "—"}</TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <CampaignActionButtons
                          campaign={campaign}
                          onPause={openPauseConfirmDialog}
                          onResume={handleResume}
                          onEdit={openEditDialog}
                          onSend={openSendDialog}
                          onDelete={openDeleteDialog}
                          pauseLoading={pauseLoadingId === campaign.id}
                          resumeLoading={resumeLoadingId === campaign.id}
                          variant="compact"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>

    <CustomDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setSendDialogOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تحديد المستلمين وإرسال الحملة</CustomDialogTitle>
          <CustomDialogDescription>
            اختر العملاء الذين تريد إرسال الحملة «{sendCampaignName}» لهم. يمكنك أيضاً إضافة عناوين بريد يدوياً.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
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
            <Label htmlFor="send-manual-emails">عناوين بريد إضافية (اختياري)</Label>
            <Textarea
              id="send-manual-emails"
              value={manualEmailsRaw}
              onChange={(e) => setManualEmailsRaw(e.target.value)}
              placeholder="عناوين بريد، سطر واحد أو مفصولة بفاصلة"
              rows={2}
              className="resize-none"
            />
          </div>
        </div>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleConfirmSend}>إرسال</Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>

    <CustomDialog open={pauseConfirmOpen} onOpenChange={setPauseConfirmOpen} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setPauseConfirmOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تأكيد إيقاف الحملة مؤقتاً</CustomDialogTitle>
          <CustomDialogDescription>
            هل تريد إيقاف الحملة «{pauseConfirmCampaign?.name}» مؤقتاً؟
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="px-4 sm:px-6 pb-2 text-sm text-muted-foreground text-right">
          سيتم إيقاف الإرسال فوراً. الرسائل التي تم إرسالها ({pauseConfirmCampaign?.sentCount ?? 0}) مُحتسبة عليك،
          أما الكريديت المحجوز للمتبقين (
          {pauseConfirmCampaign?.reservedCredits ??
            (pauseConfirmCampaign ? pauseConfirmCampaign.recipientCount - pauseConfirmCampaign.sentCount : 0)}
          ) فسيُعاد إلى رصيدك. يمكنك لاحقاً «متابعة» الإرسال للمتبقين أو «إعادة من البداية».
        </div>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => setPauseConfirmOpen(false)}>
            إلغاء
          </Button>
          <Button
            onClick={handleConfirmPause}
            disabled={pauseConfirmCampaign != null && pauseLoadingId === pauseConfirmCampaign.id}
          >
            {pauseConfirmCampaign != null && pauseLoadingId === pauseConfirmCampaign.id
              ? "جاري الإيقاف..."
              : "إيقاف مؤقت"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>

    <CustomDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setDeleteDialogOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تأكيد حذف الحملة</CustomDialogTitle>
          <CustomDialogDescription>
            هل أنت متأكد من حذف الحملة «{deleteCampaignName}»؟ لا يمكن التراجع عن هذا الإجراء.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            حذف
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>

    <CustomDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} maxWidth="max-w-lg">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => setEditDialogOpen(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle>تعديل الحملة</CustomDialogTitle>
          <CustomDialogDescription>
            تعديل اسم الحملة وموضوع البريد والمحتوى. التغييرات تُحفظ فوراً بعد النقر على حفظ.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="edit-campaign-name">اسم الحملة</Label>
            <Input
              id="edit-campaign-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="اسم الحملة"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-campaign-desc">الوصف (اختياري)</Label>
            <Input
              id="edit-campaign-desc"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="وصف مختصر"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-campaign-subject">موضوع البريد</Label>
            <Input
              id="edit-campaign-subject"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              placeholder="موضوع الرسالة"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-campaign-body-html">محتوى HTML</Label>
            <Textarea
              id="edit-campaign-body-html"
              value={editBodyHtml}
              onChange={(e) => setEditBodyHtml(e.target.value)}
              placeholder="محتوى البريد..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-campaign-body-text">محتوى نصي (اختياري)</Label>
            <Textarea
              id="edit-campaign-body-text"
              value={editBodyText}
              onChange={(e) => setEditBodyText(e.target.value)}
              placeholder="نسخة نصية"
              rows={2}
            />
          </div>
        </div>
        <CustomDialogFooter>
          <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleConfirmEdit} disabled={editSubmitting}>
            {editSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
    </>
  );
}
