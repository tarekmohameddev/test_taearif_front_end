"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Loader2,
  Send,
  Pause,
  Play,
  Trash2,
  Megaphone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomersCheckboxesDropdown, type CustomerOption } from "@/components/customComponents/CustomersCheckboxesDropdown";
import { getCustomersList } from "@/lib/services/customers-hub-list-api";
import {
  getWhatsAppNumbers,
  getWaCampaigns,
  createWaCampaign,
  deleteWaCampaign,
  sendWaCampaign,
  pauseWaCampaign,
  resumeWaCampaign,
  getWaTemplates,
  getWhatsAppApiErrorMessage,
  getWhatsAppApiErrorCode,
  type ApiWaCampaign,
  type WhatsAppNumberDTO,
  type CreateWaCampaignBody,
  type SendWaCampaignBody,
  type ResumeWaCampaignBody,
} from "@/lib/services/whatsapp-api";

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  scheduled: "مجدولة",
  in_progress: "قيد التشغيل",
  paused: "متوقفة",
  sent: "تم الإرسال",
  failed: "فشلت",
  cancelled: "ملغاة",
};

function canSend(status: string) {
  return status === "draft" || status === "scheduled";
}
function canPause(status: string) {
  return status === "in_progress" || status === "scheduled";
}
function canResume(status: string) {
  return status === "paused";
}
function canEdit(status: string) {
  return status === "draft" || status === "scheduled" || status === "paused";
}
function canDelete(status: string) {
  return status === "draft" || status === "scheduled";
}

function parseManualPhones(raw: string): string[] {
  return raw
    .split(/[\n,،]+/)
    .map((s) => s.replace(/\D/g, "").trim())
    .filter((s) => s.length >= 8 && s.length <= 16);
}

export function WhatsAppCampaignsTab() {
  const [campaigns, setCampaigns] = useState<ApiWaCampaign[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
  });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<WhatsAppNumberDTO[]>([]);
  const [templates, setTemplates] = useState<{ id: number; name: string; variables?: string[] }[]>([]);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWaCampaigns({
        page: pagination.current_page,
        per_page: pagination.per_page,
        status: statusFilter || undefined,
      });
      setCampaigns(res.campaigns);
      setPagination(res.pagination);
    } catch (e) {
      setError(getWhatsAppApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.per_page, statusFilter]);

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

  // --- Create dialog ---
  const [createOpen, setCreateOpen] = useState(false);
  const [createWaNumberId, setCreateWaNumberId] = useState<number | "">("");
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [contentType, setContentType] = useState<"message" | "template">("message");
  const [createMessage, setCreateMessage] = useState("");
  const [createTemplateId, setCreateTemplateId] = useState<number | "">("");
  const [createTemplateVars, setCreateTemplateVars] = useState<Record<string, string>>({});
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  const resetCreate = () => {
    setCreateWaNumberId("");
    setCreateName("");
    setCreateDescription("");
    setContentType("message");
    setCreateMessage("");
    setCreateTemplateId("");
    setCreateTemplateVars({});
    setCreateError("");
  };

  const handleCreate = async () => {
    if (!createWaNumberId || !createName.trim()) {
      setCreateError("الرقم واسم الحملة مطلوبان.");
      return;
    }
    const body: CreateWaCampaignBody = {
      wa_number_id: Number(createWaNumberId),
      name: createName.trim(),
      description: createDescription.trim() || undefined,
      status: "draft",
    };
    if (contentType === "message") {
      if (!createMessage.trim()) {
        setCreateError("محتوى الرسالة مطلوب.");
        return;
      }
      body.message = createMessage.trim();
    } else {
      if (!createTemplateId) {
        setCreateError("اختر قالباً.");
        return;
      }
      body.template_id = Number(createTemplateId);
      if (Object.keys(createTemplateVars).length > 0) {
        body.meta = { variables: createTemplateVars };
      }
    }
    setCreateSubmitting(true);
    setCreateError("");
    try {
      await createWaCampaign(body);
      toast.success("تم إنشاء الحملة");
      setCreateOpen(false);
      resetCreate();
      fetchCampaigns();
    } catch (e) {
      setCreateError(getWhatsAppApiErrorMessage(e));
    } finally {
      setCreateSubmitting(false);
    }
  };

  // --- Send dialog ---
  const [sendOpen, setSendOpen] = useState(false);
  const [sendCampaign, setSendCampaign] = useState<ApiWaCampaign | null>(null);
  const [sendCustomersList, setSendCustomersList] = useState<CustomerOption[]>([]);
  const [sendCustomersLoading, setSendCustomersLoading] = useState(false);
  const [sendCustomersPage, setSendCustomersPage] = useState(1);
  const [sendCustomersHasMore, setSendCustomersHasMore] = useState(false);
  const [sendCustomersLoadMoreLoading, setSendCustomersLoadMoreLoading] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [manualPhonesRaw, setManualPhonesRaw] = useState("");
  const [sendSubmitting, setSendSubmitting] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (!sendOpen) return;
    setSendCustomersLoading(true);
    setSendCustomersPage(1);
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: 1, limit: 100 },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pag = res.data?.pagination;
        setSendCustomersList(
          list.map((c) => ({
            id: c.id,
            name: c.name ?? "",
            phone: c.phone,
          }))
        );
        setSendCustomersHasMore(
          Boolean(pag && pag.currentPage < pag.totalPages)
        );
      })
      .catch(() => {
        toast.error("فشل تحميل قائمة العملاء");
        setSendCustomersList([]);
        setSendCustomersHasMore(false);
      })
      .finally(() => setSendCustomersLoading(false));
  }, [sendOpen]);

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
        const pag = res.data?.pagination;
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
          Boolean(pag && pag.currentPage < pag.totalPages)
        );
      })
      .catch(() => toast.error("فشل تحميل المزيد"))
      .finally(() => setSendCustomersLoadMoreLoading(false));
  };

  const handleSendSubmit = async () => {
    if (!sendCampaign) return;
    const manualPhones = parseManualPhones(manualPhonesRaw);
    if (selectedCustomerIds.length === 0 && manualPhones.length === 0) {
      setSendError("اختر عملاءً أو أدخل أرقاماً يدوياً.");
      return;
    }
    const body: SendWaCampaignBody = {};
    if (selectedCustomerIds.length > 0) body.customer_ids = selectedCustomerIds;
    if (manualPhones.length > 0) body.manual_phones = manualPhones;
    setSendSubmitting(true);
    setSendError("");
    const idempotencyKey = crypto.randomUUID();
    try {
      const data = await sendWaCampaign(sendCampaign.id, body, idempotencyKey);
      toast.success(
        `تم بدء الإرسال إلى ${data.recipient_count} مستلم. المرجع: ${data.dispatch_reference ?? "-"}`
      );
      setSendOpen(false);
      setSendCampaign(null);
      setSelectedCustomerIds([]);
      setManualPhonesRaw("");
      fetchCampaigns();
    } catch (e) {
      const code = getWhatsAppApiErrorCode(e);
      const msg = getWhatsAppApiErrorMessage(e);
      setSendError(code ? `[${code}] ${msg}` : msg);
      if (code === "INSUFFICIENT_CREDITS") {
        toast.error("رصيد غير كافٍ. يرجى شراء كريديت.");
      }
    } finally {
      setSendSubmitting(false);
    }
  };

  // --- Pause ---
  const [pauseLoadingId, setPauseLoadingId] = useState<number | null>(null);
  const [pauseConfirmOpen, setPauseConfirmOpen] = useState(false);
  const [pauseCampaign, setPauseCampaign] = useState<ApiWaCampaign | null>(null);

  const handlePause = async () => {
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

  // --- Resume ---
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeCampaign, setResumeCampaign] = useState<ApiWaCampaign | null>(null);
  const [resumeMode, setResumeMode] = useState<"continue" | "restart">("continue");
  const [resumeCustomersList, setResumeCustomersList] = useState<CustomerOption[]>([]);
  const [resumeCustomersPage, setResumeCustomersPage] = useState(1);
  const [resumeCustomersHasMore, setResumeCustomersHasMore] = useState(false);
  const [resumeCustomersLoadMoreLoading, setResumeCustomersLoadMoreLoading] = useState(false);
  const [resumeCustomerIds, setResumeCustomerIds] = useState<number[]>([]);
  const [resumeManualPhonesRaw, setResumeManualPhonesRaw] = useState("");
  const [resumeSubmitting, setResumeSubmitting] = useState(false);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    if (!resumeOpen || resumeMode !== "restart") return;
    setResumeCustomersPage(1);
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: 1, limit: 100 },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pag = res.data?.pagination;
        setResumeCustomersList(
          list.map((c) => ({ id: c.id, name: c.name ?? "", phone: c.phone }))
        );
        setResumeCustomersHasMore(Boolean(pag && pag.currentPage < pag.totalPages));
      })
      .catch(() => {
        setResumeCustomersList([]);
        setResumeCustomersHasMore(false);
      });
  }, [resumeOpen, resumeMode]);

  const loadMoreResumeCustomers = () => {
    const nextPage = resumeCustomersPage + 1;
    setResumeCustomersLoadMoreLoading(true);
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: nextPage, limit: 100 },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pag = res.data?.pagination;
        setResumeCustomersList((prev) => [
          ...prev,
          ...list.map((c) => ({ id: c.id, name: c.name ?? "", phone: c.phone })),
        ]);
        setResumeCustomersPage(nextPage);
        setResumeCustomersHasMore(Boolean(pag && pag.currentPage < pag.totalPages));
      })
      .catch(() => toast.error("فشل تحميل المزيد"))
      .finally(() => setResumeCustomersLoadMoreLoading(false));
  };

  const handleResumeSubmit = async () => {
    if (!resumeCampaign) return;
    const body: ResumeWaCampaignBody = { mode: resumeMode };
    if (resumeMode === "restart") {
      const manualPhones = parseManualPhones(resumeManualPhonesRaw);
      if (resumeCustomerIds.length === 0 && manualPhones.length === 0) {
        setResumeError("في وضع إعادة التشغيل، اختر عملاءً أو أرقاماً يدوية.");
        return;
      }
      if (resumeCustomerIds.length > 0) body.customer_ids = resumeCustomerIds;
      if (manualPhones.length > 0) body.manual_phones = manualPhones;
    }
    setResumeSubmitting(true);
    setResumeError("");
    const idempotencyKey = crypto.randomUUID();
    try {
      await resumeWaCampaign(resumeCampaign.id, body, idempotencyKey);
      toast.success("تم استئناف الحملة");
      setResumeOpen(false);
      setResumeCampaign(null);
      setResumeMode("continue");
      fetchCampaigns();
    } catch (e) {
      setResumeError(getWhatsAppApiErrorMessage(e));
    } finally {
      setResumeSubmitting(false);
    }
  };

  // --- Delete ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCampaign, setDeleteCampaign] = useState<ApiWaCampaign | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
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

  const selectedTemplate = templates.find((t) => t.id === Number(createTemplateId));
  const templateVarKeys = selectedTemplate?.variables ?? [];

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
        <Button onClick={() => { resetCreate(); setCreateOpen(true); }} className="gap-2">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>قائمة الحملات</CardTitle>
          <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : campaigns.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">لا توجد حملات.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الرقم</TableHead>
                  <TableHead>المستلمون / المرسل</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{STATUS_LABELS[c.status] ?? c.status}</Badge>
                    </TableCell>
                    <TableCell>{numbers.find((n) => n.id === c.wa_number_id)?.phoneNumber ?? c.wa_number_id}</TableCell>
                    <TableCell>
                      {c.recipient_count != null && `${c.recipient_count} / ${c.sent_count ?? 0}`}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex items-center gap-1 flex-wrap">
                        {canSend(c.status) && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSendCampaign(c);
                              setSendError("");
                              setSendOpen(true);
                            }}
                          >
                            إرسال
                          </Button>
                        )}
                        {canPause(c.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setPauseCampaign(c); setPauseConfirmOpen(true); }}
                            disabled={pauseLoadingId === c.id}
                          >
                            {pauseLoadingId === c.id ? "جاري..." : "إيقاف مؤقت"}
                          </Button>
                        )}
                        {canResume(c.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setResumeCampaign(c);
                              setResumeMode("continue");
                              setResumeError("");
                              setResumeOpen(true);
                            }}
                          >
                            استئناف
                          </Button>
                        )}
                        {canDelete(c.status) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setDeleteCampaign(c); setDeleteOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create campaign dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء حملة واتساب</DialogTitle>
            <DialogDescription>
              اختر الرقم والمحتوى (رسالة أو قالب). يجب تحديد واحد فقط.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>رقم الواتساب</Label>
              <Select
                value={createWaNumberId === "" ? "" : String(createWaNumberId)}
                onValueChange={(v) => setCreateWaNumberId(v === "" ? "" : Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="اختر الرقم" /></SelectTrigger>
                <SelectContent>
                  {numbers.map((n) => (
                    <SelectItem key={n.id} value={String(n.id)}>
                      {n.name || n.phoneNumber} — {n.phoneNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>اسم الحملة</Label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="مثال: حملة العروض"
              />
            </div>
            <div>
              <Label>الوصف (اختياري)</Label>
              <Input
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="وصف قصير"
              />
            </div>
            <div>
              <Label>نوع المحتوى</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as "message" | "template")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">رسالة نصية</SelectItem>
                  <SelectItem value="template">قالب</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {contentType === "message" && (
              <div>
                <Label>نص الرسالة</Label>
                <Textarea
                  value={createMessage}
                  onChange={(e) => setCreateMessage(e.target.value)}
                  placeholder="محتوى الرسالة..."
                  rows={4}
                />
              </div>
            )}
            {contentType === "template" && (
              <>
                <div>
                  <Label>القالب</Label>
                  <Select
                    value={createTemplateId === "" ? "" : String(createTemplateId)}
                    onValueChange={(v) => {
                      setCreateTemplateId(v === "" ? "" : Number(v));
                      setCreateTemplateVars({});
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="اختر قالباً" /></SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {templateVarKeys.length > 0 && (
                  <div className="space-y-2">
                    <Label>متغيرات القالب</Label>
                    {templateVarKeys.map((key) => (
                      <Input
                        key={key}
                        placeholder={key}
                        value={createTemplateVars[key] ?? ""}
                        onChange={(e) =>
                          setCreateTemplateVars((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>إلغاء</Button>
            <Button onClick={handleCreate} disabled={createSubmitting}>
              {createSubmitting ? "جاري الإنشاء..." : "إنشاء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send campaign dialog */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>إرسال الحملة: {sendCampaign?.name}</DialogTitle>
            <DialogDescription>
              اختر العملاء و/أو أدخل أرقاماً يدوية (8–16 رقم). مطلوب واحد على الأقل.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>العملاء</Label>
              <CustomersCheckboxesDropdown
                customers={sendCustomersList}
                selectedCustomerIds={selectedCustomerIds}
                onSelectionChange={setSelectedCustomerIds}
                isLoading={sendCustomersLoading}
                hasMore={sendCustomersHasMore}
                onLoadMore={loadMoreSendCustomers}
                loadMoreLoading={sendCustomersLoadMoreLoading}
              />
            </div>
            <div>
              <Label>أرقام يدوية (سطر أو فاصلة بين كل رقم)</Label>
              <Textarea
                value={manualPhonesRaw}
                onChange={(e) => setManualPhonesRaw(e.target.value)}
                placeholder="+966501234567 أو 966501234567"
                rows={3}
              />
            </div>
            {sendError && (
              <Alert variant="destructive">
                <AlertDescription>{sendError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>إلغاء</Button>
            <Button onClick={handleSendSubmit} disabled={sendSubmitting}>
              {sendSubmitting ? "جاري الإرسال..." : "إرسال"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause confirm */}
      <Dialog open={pauseConfirmOpen} onOpenChange={setPauseConfirmOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إيقاف مؤقت</DialogTitle>
            <DialogDescription>
              هل تريد إيقاف الحملة «{pauseCampaign?.name}» مؤقتاً؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseConfirmOpen(false)}>إلغاء</Button>
            <Button onClick={handlePause} disabled={pauseLoadingId !== null}>
              {pauseLoadingId ? "جاري..." : "إيقاف مؤقت"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume dialog */}
      <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>استئناف الحملة: {resumeCampaign?.name}</DialogTitle>
            <DialogDescription>
              متابعة من حيث توقفت، أو إعادة تشغيل بقائمة مستلمين جديدة.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>وضع الاستئناف</Label>
              <Select value={resumeMode} onValueChange={(v) => setResumeMode(v as "continue" | "restart")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="continue">متابعة</SelectItem>
                  <SelectItem value="restart">إعادة تشغيل (قائمة جديدة)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {resumeMode === "restart" && (
              <>
                <div>
                  <Label>العملاء</Label>
                  <CustomersCheckboxesDropdown
                    customers={resumeCustomersList}
                    selectedCustomerIds={resumeCustomerIds}
                    onSelectionChange={setResumeCustomerIds}
                    hasMore={resumeCustomersHasMore}
                    onLoadMore={loadMoreResumeCustomers}
                    loadMoreLoading={resumeCustomersLoadMoreLoading}
                  />
                </div>
                <div>
                  <Label>أرقام يدوية</Label>
                  <Textarea
                    value={resumeManualPhonesRaw}
                    onChange={(e) => setResumeManualPhonesRaw(e.target.value)}
                    placeholder="أرقام إضافية"
                    rows={2}
                  />
                </div>
              </>
            )}
            {resumeError && (
              <Alert variant="destructive">
                <AlertDescription>{resumeError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResumeOpen(false)}>إلغاء</Button>
            <Button onClick={handleResumeSubmit} disabled={resumeSubmitting}>
              {resumeSubmitting ? "جاري..." : "استئناف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف الحملة</DialogTitle>
            <DialogDescription>
              هل تريد حذف الحملة «{deleteCampaign?.name}»؟ لا يمكن التراجع.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "جاري..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
