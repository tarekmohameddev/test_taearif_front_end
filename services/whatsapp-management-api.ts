import type {
  Conversation,
  Message,
  MessageTemplate,
  AutomationRule,
  AIResponderConfig,
  WhatsAppNumber,
  ConversationFilters,
  AutomationStats,
  AIStats,
  Attachment,
} from "@/components/whatsapp-management/types";
import {
  mockConversations,
  mockMessages,
  mockMessageTemplates,
  mockAutomationRules,
  mockAIResponderConfigs,
  mockWhatsAppNumbers,
  mockAutomationStats,
  mockAIStats,
} from "@/components/whatsapp-management/mock-data";
import { getWhatsAppNumbers as getWhatsAppNumbersApi } from "@/lib/services/whatsapp-api";
import {
  listConversations,
  getConversationApi,
  listMessages,
  postMessage,
  markConversationReadApi,
  toggleConversationStarApi,
  updateConversationStatusApi,
} from "@/lib/services/whatsapp-conversations-api";
import {
  listAutomationRules,
  getAutomationRuleApi,
  createAutomationRuleApi,
  updateAutomationRuleApi,
  deleteAutomationRuleApi,
  getAutomationStatsApi,
  toggleAutomationRuleApi,
  type ApiAutomationRule,
  type ApiAutomationStats,
} from "@/lib/services/whatsapp-automation-api";
import {
  listWhatsAppTemplates,
  getWhatsAppTemplateApi,
  createWhatsAppTemplateApi,
  updateWhatsAppTemplateApi,
  deleteWhatsAppTemplateApi,
  type ApiWhatsAppTemplate,
} from "@/lib/services/whatsapp-templates-api";
import {
  getAIConfigApi,
  putAIConfigApi,
  patchAIConfigToggleApi,
  getAIStatsApi,
  type ApiAIConfig,
  type ApiAIStats,
} from "@/lib/services/whatsapp-ai-api";

// Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Conversations API ====================

export async function getConversations(
  numberId?: number,
  filters?: ConversationFilters
): Promise<Conversation[]> {
  try {
    const res = await listConversations({
      per_page: 50,
      page: 1,
      status:
        filters?.status && filters.status !== "all" ? filters.status : undefined,
      search: filters?.search || undefined,
      wa_number_id: numberId,
    });

    // Map backend conversations to UI Conversation type
    const mapped: Conversation[] = res.conversations.map((c) => {
      const anyConv = c as any;
      const innerConv = anyConv.conversation ?? {};

      const lastMessageContent =
        (typeof anyConv.last_message_preview === "string"
          ? anyConv.last_message_preview
          : c.last_message) ?? "";

      const lastTime =
        anyConv.last_message_time ??
        innerConv.last_message_at ??
        c.updated_at ??
        c.created_at ??
        new Date().toISOString();

      const nameFallback =
        c.customer_name ??
        innerConv.external_party_identifier ??
        c.customer_phone ??
        "عميل واتساب";

      const phoneFallback =
        c.customer_phone ?? innerConv.external_party_identifier ?? "";

      return {
        id: String(c.id),
        customerId: "", // can be wired when backend exposes it
        customerName: nameFallback,
        customerPhone: phoneFallback,
        customerAvatar: undefined,
        whatsappNumberId:
          c.wa_number_id ?? c.whatsapp_number_id ?? numberId ?? 0,
        lastMessage: lastMessageContent,
        lastMessageTime: lastTime,
        unreadCount: c.unread_count ?? 0,
        status:
          (c.status as Conversation["status"]) ?? "active",
        isStarred: Boolean(c.is_starred),
        propertyInterests: [],
        assignedAgent: c.assigned_agent
          ? {
              id: String(c.assigned_agent.id ?? ""),
              name: c.assigned_agent.name ?? "",
              avatar: c.assigned_agent.avatar_url ?? undefined,
            }
          : undefined,
      };
    });

    // Apply frontend-only filters (unread/starred) if needed
    let filtered = [...mapped];
    if (filters?.starred) {
      filtered = filtered.filter((conv) => conv.isStarred);
    }
    if (filters?.unread) {
      filtered = filtered.filter((conv) => conv.unreadCount > 0);
    }

    // Sort by last message time (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );

    return filtered;
  } catch {
    // Fallback to mock data in case backend is unavailable
    await delay();

    let conversations = [...mockConversations];

    if (numberId) {
      conversations = conversations.filter(
        (conv) => conv.whatsappNumberId === numberId
      );
    }

    if (filters?.status && filters.status !== "all") {
      conversations = conversations.filter(
        (conv) => conv.status === filters.status
      );
    }

    if (filters?.starred) {
      conversations = conversations.filter((conv) => conv.isStarred);
    }

    if (filters?.unread) {
      conversations = conversations.filter((conv) => conv.unreadCount > 0);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      conversations = conversations.filter(
        (conv) =>
          conv.customerName.toLowerCase().includes(searchLower) ||
          conv.customerPhone.includes(searchLower) ||
          conv.lastMessage.toLowerCase().includes(searchLower)
      );
    }

    conversations.sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );

    return conversations;
  }
}

export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    const c = await getConversationApi(id);
    const lastMessageContent =
      c.last_message_preview?.content ??
      c.last_message ??
      "";
    const lastTime =
      c.last_message_preview?.created_at ??
      c.last_message_at ??
      c.updated_at ??
      c.created_at ??
      new Date().toISOString();

    const nameFallback =
      c.customer_name ??
      c.external_party_identifier ??
      c.customer_phone ??
      "عميل واتساب";

    const phoneFallback =
      c.customer_phone ?? c.external_party_identifier ?? "";

    const waId =
      (c as any).wa_number_id ??
      (c as any).whatsapp_number_id ??
      undefined;

    const conv: Conversation = {
      id: String(c.id),
      customerId: "",
      customerName: nameFallback,
      customerPhone: phoneFallback,
      customerAvatar: undefined,
      whatsappNumberId: (waId ?? 0) as number,
      lastMessage: lastMessageContent,
      lastMessageTime: lastTime,
      unreadCount: c.unread_count ?? 0,
      status: (c.status as Conversation["status"]) ?? "active",
      isStarred: Boolean(c.is_starred),
      propertyInterests: [],
      assignedAgent: c.assigned_agent
        ? {
            id: String(c.assigned_agent.id ?? ""),
            name: c.assigned_agent.name ?? "",
            avatar: c.assigned_agent.avatar_url ?? undefined,
          }
        : undefined,
    };

    return conv;
  } catch {
    await delay();
    return mockConversations.find((conv) => conv.id === id) || null;
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const apiMessages = await listMessages(conversationId);
    const mapped: Message[] = apiMessages.map((m) => {
      const direction = m.direction ?? "outbound";
      const senderType = m.sender_type ?? (direction === "inbound" ? "customer" : "agent");

      const sender: Message["sender"] =
        senderType === "customer"
          ? "customer"
          : senderType === "system"
            ? "system"
            : senderType === "ai"
              ? "ai"
              : "agent";

      const ts = m.created_at ?? m.sent_at ?? new Date().toISOString();

      const msgContent =
        m.content ??
        (m as { body?: string }).body ??
        (m as { text?: string }).text ??
        "";
      return {
        id: String(m.id),
        conversationId: String(m.conversation_id ?? conversationId),
        content: msgContent,
        sender,
        senderName: m.sender_name ?? undefined,
        timestamp: ts,
        status: (m.status as Message["status"]) ?? "sent",
        attachments: m.attachments
          ? m.attachments.map((a, index) => ({
              id: String(a.id ?? `${m.id}-${index}`),
              type:
                (a.type as Attachment["type"]) ??
                "document",
              url: a.url ?? "",
              name: a.name ?? "",
              size: a.size ?? undefined,
            }))
          : undefined,
      };
    });

    mapped.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    return mapped;
  } catch {
    await delay();
    return mockMessages[conversationId] || [];
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  waNumberId?: number,
  attachments?: File[]
): Promise<Message> {
  try {
    const apiMessage = await postMessage(conversationId, {
      content,
      wa_number_id: waNumberId,
    });

    const direction = apiMessage.direction ?? "outbound";
    const senderType =
      apiMessage.sender_type ?? (direction === "inbound" ? "customer" : "agent");

    const sender: Message["sender"] =
      senderType === "customer"
        ? "customer"
        : senderType === "system"
          ? "system"
          : senderType === "ai"
            ? "ai"
            : "agent";

    const ts =
      apiMessage.created_at ?? apiMessage.sent_at ?? new Date().toISOString();

    const apiContent =
      apiMessage.content ??
      (apiMessage as { body?: string }).body ??
      (apiMessage as { text?: string }).text ??
      content;
    const mapped: Message = {
      id: String(apiMessage.id),
      conversationId: String(apiMessage.conversation_id ?? conversationId),
      content: apiContent,
      sender,
      senderName: apiMessage.sender_name ?? undefined,
      timestamp: ts,
      status: (apiMessage.status as Message["status"]) ?? "sent",
      attachments: apiMessage.attachments
        ? apiMessage.attachments.map((a, index) => ({
            id: String(a.id ?? `${apiMessage.id}-${index}`),
            type:
              (a.type as Attachment["type"]) ??
              "document",
            url: a.url ?? "",
            name: a.name ?? "",
            size: a.size ?? undefined,
          }))
        : undefined,
    };

    return mapped;
  } catch {
    // Fallback to local mock behavior if backend send fails
    await delay(300);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      content,
      sender: "agent",
      senderName: "أحمد محمد",
      timestamp: new Date().toISOString(),
      status: "sent",
      attachments: attachments
        ? attachments.map((file, index) => ({
            id: `att-${Date.now()}-${index}`,
            type: file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
                ? "video"
                : file.type.startsWith("audio/")
                  ? "audio"
                  : "document",
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
          }))
        : undefined,
    };

    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = content;
      conversation.lastMessageTime = newMessage.timestamp;
    }

    return newMessage;
  }
}

export async function markConversationAsRead(
  conversationId: string
): Promise<void> {
  try {
    await markConversationReadApi(conversationId);
  } catch {
    await delay(200);
    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }
  }
}

export async function toggleConversationStar(
  conversationId: string
): Promise<void> {
  try {
    await toggleConversationStarApi(conversationId);
  } catch {
    await delay(200);
    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.isStarred = !conversation.isStarred;
    }
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: "active" | "pending" | "resolved"
): Promise<void> {
  try {
    await updateConversationStatusApi(conversationId, status);
  } catch {
    await delay(200);
    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.status = status;
    }
  }
}

// ==================== Templates API ====================

export async function getMessageTemplates(): Promise<MessageTemplate[]> {
  try {
    const apiTemplates = await listWhatsAppTemplates();

    const mapped: MessageTemplate[] = apiTemplates.map(
      (t: ApiWhatsAppTemplate) => {
        const rawId = t.id ?? (t as { template_id?: number | string }).template_id;
        const id =
          rawId != null && rawId !== ""
            ? String(rawId)
            : "";
        return {
          id,
          name: t.name ?? "",
          content: t.content ?? "",
          category: t.category ?? "general",
          variables: Array.isArray(t.variables)
            ? t.variables.filter((v): v is string => typeof v === "string")
            : [],
        };
      }
    );

    return mapped;
  } catch {
    await delay();
    return mockMessageTemplates;
  }
}

export async function getMessageTemplate(
  id: string
): Promise<MessageTemplate | null> {
  try {
    const t = await getWhatsAppTemplateApi(id);
    const rawId =
      (t as ApiWhatsAppTemplate).id ??
      (t as { template_id?: number | string }).template_id ??
      id;
    const mapped: MessageTemplate = {
      id: rawId != null && rawId !== "" ? String(rawId) : id,
      name: t.name ?? "",
      content: t.content ?? "",
      category: t.category ?? "general",
      variables: Array.isArray(t.variables)
        ? t.variables.filter((v): v is string => typeof v === "string")
        : [],
    };
    return mapped;
  } catch {
    await delay();
    return mockMessageTemplates.find((t) => t.id === id) || null;
  }
}

export async function createMessageTemplate(
  template: Omit<MessageTemplate, "id">
): Promise<MessageTemplate> {
  try {
    const body: Record<string, unknown> = {
      name: template.name,
      content: template.content,
      category: template.category,
      variables: template.variables,
    };

    const created = await createWhatsAppTemplateApi(body);
    const createdRawId =
      (created as ApiWhatsAppTemplate).id ??
      (created as { template_id?: number | string }).template_id;
    const mapped: MessageTemplate = {
      id:
        createdRawId != null && createdRawId !== ""
          ? String(createdRawId)
          : `template-${Date.now()}`,
      name: created.name ?? template.name,
      content: created.content ?? template.content,
      category: created.category ?? template.category,
      variables: Array.isArray(created.variables)
        ? created.variables.filter((v): v is string => typeof v === "string")
        : template.variables,
    };

    return mapped;
  } catch {
    await delay();
    const fallback: MessageTemplate = {
      id: `template-${Date.now()}`,
      ...template,
    };
    mockMessageTemplates.push(fallback);
    return fallback;
  }
}

function isInvalidTemplateId(id: string | number | undefined | null): boolean {
  if (id == null) return true;
  const s = String(id);
  return s === "" || s === "undefined" || s.trim() === "";
}

export async function updateMessageTemplate(
  id: string,
  updates: Partial<MessageTemplate>
): Promise<MessageTemplate | null> {
  const idStr = id != null ? String(id) : "";
  if (isInvalidTemplateId(idStr)) {
    return null;
  }
  try {
    const body: Record<string, unknown> = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.content !== undefined) body.content = updates.content;
    if (updates.category !== undefined) body.category = updates.category;
    if (updates.variables !== undefined) body.variables = updates.variables;

    const updated = await updateWhatsAppTemplateApi(idStr, body);
    const updatedRawId =
      (updated as ApiWhatsAppTemplate).id ??
      (updated as { template_id?: number | string }).template_id;
    const mapped: MessageTemplate = {
      id:
        updatedRawId != null && updatedRawId !== ""
          ? String(updatedRawId)
          : idStr,
      name: updated.name ?? updates.name ?? "",
      content: updated.content ?? updates.content ?? "",
      category: updated.category ?? updates.category ?? "general",
      variables: Array.isArray(updated.variables)
        ? updated.variables.filter((v): v is string => typeof v === "string")
        : updates.variables ?? [],
    };

    return mapped;
  } catch {
    await delay();
    const index = mockMessageTemplates.findIndex((t) => t.id === id);
    if (index === -1) return null;
    mockMessageTemplates[index] = {
      ...mockMessageTemplates[index],
      ...updates,
    };
    return mockMessageTemplates[index];
  }
}

export async function deleteMessageTemplate(id: string): Promise<boolean> {
  if (isInvalidTemplateId(id)) {
    return false;
  }
  try {
    await deleteWhatsAppTemplateApi(id);
    return true;
  } catch {
    await delay();
    const index = mockMessageTemplates.findIndex((t) => t.id === id);
    if (index === -1) return false;
    mockMessageTemplates.splice(index, 1);
    return true;
  }
}

// ==================== Automation Rules API ====================

export async function getAutomationRules(
  numberId?: number
): Promise<AutomationRule[]> {
  try {
    const apiRules = await listAutomationRules({
      wa_number_id: numberId,
    });

    const mapped: AutomationRule[] = apiRules.map((r: ApiAutomationRule) => {
      const trigger = (r.trigger as AutomationRule["trigger"]) ?? "new_inquiry";
      const delayMinutes = r.delay_minutes ?? 0;
      const templateId =
        (typeof r.template_id === "number"
          ? String(r.template_id)
          : (r.template_id as string | null)) ?? "";

      const whatsappNumberId =
        (r.wa_number_id ??
          (r.whatsapp_number_id as number | null | undefined)) ??
        undefined;

      return {
        id: String(r.id),
        name: r.name ?? "",
        description: (r as { description?: string | null })?.description ?? "",
        trigger,
        delayMinutes,
        templateId,
        isActive: Boolean(r.is_active ?? true),
        whatsappNumberId,
        createdAt: r.created_at ?? new Date().toISOString(),
        lastTriggered:
          (r as { last_triggered_at?: string | null })?.last_triggered_at ??
          undefined,
        triggeredCount: r.triggered_count ?? 0,
      };
    });

    if (numberId) {
      return mapped.filter(
        (rule) =>
          !rule.whatsappNumberId || rule.whatsappNumberId === numberId
      );
    }

    return mapped;
  } catch {
    await delay();
    let rules = [...mockAutomationRules];

    if (numberId) {
      rules = rules.filter(
        (rule) => !rule.whatsappNumberId || rule.whatsappNumberId === numberId
      );
    }

    return rules;
  }
}

export async function getAutomationRule(
  id: string
): Promise<AutomationRule | null> {
  try {
    const r = await getAutomationRuleApi(id);
    const trigger = (r.trigger as AutomationRule["trigger"]) ?? "new_inquiry";
    const delayMinutes = r.delay_minutes ?? 0;
    const templateId =
      (typeof r.template_id === "number"
        ? String(r.template_id)
        : (r.template_id as string | null)) ?? "";

    const whatsappNumberId =
      (r.wa_number_id ??
        (r.whatsapp_number_id as number | null | undefined)) ??
      undefined;

    const mapped: AutomationRule = {
      id: String(r.id),
      name: r.name ?? "",
      description: (r as { description?: string | null })?.description ?? "",
      trigger,
      delayMinutes,
      templateId,
      isActive: Boolean(r.is_active ?? true),
      whatsappNumberId,
      createdAt: r.created_at ?? new Date().toISOString(),
      lastTriggered:
        (r as { last_triggered_at?: string | null })?.last_triggered_at ??
        undefined,
      triggeredCount: r.triggered_count ?? 0,
    };

    return mapped;
  } catch {
    await delay();
    return mockAutomationRules.find((r) => r.id === id) || null;
  }
}

export async function createAutomationRule(
  rule: Omit<AutomationRule, "id" | "createdAt" | "triggeredCount">
): Promise<AutomationRule> {
  try {
    const body: Record<string, unknown> = {
      name: rule.name,
      description: rule.description,
      trigger: rule.trigger,
      delay_minutes: rule.delayMinutes,
      template_id: rule.templateId,
      is_active: rule.isActive,
    };

    if (rule.whatsappNumberId != null) {
      body.wa_number_id = rule.whatsappNumberId;
    }

    const created = await createAutomationRuleApi(body);
    const trigger =
      (created.trigger as AutomationRule["trigger"]) ?? rule.trigger;

    const whatsappNumberId =
      (created.wa_number_id ??
        (created.whatsapp_number_id as number | null | undefined)) ??
      rule.whatsappNumberId;

    const mapped: AutomationRule = {
      id: String(created.id),
      name: created.name ?? rule.name,
      description:
        (created as { description?: string | null })?.description ??
        rule.description,
      trigger,
      delayMinutes: created.delay_minutes ?? rule.delayMinutes,
      templateId:
        (typeof created.template_id === "number"
          ? String(created.template_id)
          : (created.template_id as string | null)) ?? rule.templateId,
      isActive: Boolean(created.is_active ?? rule.isActive),
      whatsappNumberId,
      createdAt: created.created_at ?? new Date().toISOString(),
      lastTriggered:
        (created as { last_triggered_at?: string | null })?.last_triggered_at ??
        undefined,
      triggeredCount: created.triggered_count ?? 0,
    };

    return mapped;
  } catch {
    await delay();

    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      triggeredCount: 0,
    };

    mockAutomationRules.push(newRule);
    return newRule;
  }
}

export async function updateAutomationRule(
  id: string,
  updates: Partial<AutomationRule>
): Promise<AutomationRule | null> {
  try {
    const body: Record<string, unknown> = {};

    if (updates.name !== undefined) body.name = updates.name;
    if (updates.description !== undefined)
      body.description = updates.description;
    if (updates.trigger !== undefined) body.trigger = updates.trigger;
    if (updates.delayMinutes !== undefined)
      body.delay_minutes = updates.delayMinutes;
    if (updates.templateId !== undefined)
      body.template_id = updates.templateId;
    if (updates.isActive !== undefined) body.is_active = updates.isActive;
    if (updates.whatsappNumberId !== undefined)
      body.wa_number_id = updates.whatsappNumberId;

    const updated = await updateAutomationRuleApi(id, body);

    const trigger =
      (updated.trigger as AutomationRule["trigger"]) ??
      updates.trigger ??
      "new_inquiry";

    const delayMinutes =
      updated.delay_minutes ?? updates.delayMinutes ?? 0;

    const templateId =
      (typeof updated.template_id === "number"
        ? String(updated.template_id)
        : (updated.template_id as string | null)) ??
      updates.templateId ??
      "";

    const whatsappNumberId =
      (updated.wa_number_id ??
        (updated.whatsapp_number_id as number | null | undefined)) ??
      updates.whatsappNumberId;

    const mapped: AutomationRule = {
      id: String(updated.id),
      name: updated.name ?? "",
      description:
        (updated as { description?: string | null })?.description ?? "",
      trigger,
      delayMinutes,
      templateId,
      isActive: Boolean(
        updated.is_active ??
          (updates.isActive !== undefined ? updates.isActive : true)
      ),
      whatsappNumberId,
      createdAt: updated.created_at ?? new Date().toISOString(),
      lastTriggered:
        (updated as { last_triggered_at?: string | null })?.last_triggered_at ??
        undefined,
      triggeredCount: updated.triggered_count ?? 0,
    };

    return mapped;
  } catch {
    await delay();

    const ruleIndex = mockAutomationRules.findIndex((r) => r.id === id);
    if (ruleIndex === -1) return null;

    mockAutomationRules[ruleIndex] = {
      ...mockAutomationRules[ruleIndex],
      ...updates,
    };

    return mockAutomationRules[ruleIndex];
  }
}

export async function deleteAutomationRule(id: string): Promise<boolean> {
  try {
    await deleteAutomationRuleApi(id);
    return true;
  } catch {
    await delay();
    const index = mockAutomationRules.findIndex((r) => r.id === id);
    if (index === -1) return false;

    mockAutomationRules.splice(index, 1);
    return true;
  }
}

export async function getAutomationStats(): Promise<AutomationStats> {
  try {
    const apiStats: ApiAutomationStats = await getAutomationStatsApi();

    const mapped: AutomationStats = {
      totalRules: apiStats.total_rules ?? 0,
      activeRules: apiStats.active_rules ?? 0,
      messagesSent24h: apiStats.messages_sent_24h ?? 0,
      successRate: apiStats.success_rate ?? 0,
    };

    return mapped;
  } catch {
    await delay();
    return mockAutomationStats;
  }
}

// ==================== AI Responder API ====================
// GET/PUT /api/v1/whatsapp/ai/config/{numberId}, PATCH toggle, GET /api/v1/whatsapp/ai/stats

function mapApiAIConfigToUI(api: ApiAIConfig | null, numberId: number): AIResponderConfig | null {
  if (!api) return null;
  const sid = api.wa_number_id ?? api.whatsapp_number_id ?? numberId;
  const s = api.scenarios ?? {};
  const start = api.business_hours_start ?? api.business_hours?.start ?? "09:00";
  const end = api.business_hours_end ?? api.business_hours?.end ?? "18:00";
  const tz = api.timezone ?? api.business_hours?.timezone ?? "";
  const hasBusinessHours = api.business_hours_only === true || start || end || tz;
  return {
    id: String(api.id ?? ""),
    whatsappNumberId: Number(sid),
    enabled: Boolean(api.enabled),
    businessHoursOnly: Boolean(api.business_hours_only),
    businessHours: hasBusinessHours
      ? { start, end, timezone: tz }
      : undefined,
    scenarios: {
      initialGreeting: Boolean(s.initial_greeting),
      faqResponses: Boolean(s.faq_responses),
      propertyInquiryResponse: Boolean(s.property_inquiry_response),
      appointmentBooking: Boolean(s.appointment_booking),
      generalQuestions: Boolean(s.general_questions),
    },
    tone: (api.tone as AIResponderConfig["tone"]) ?? "friendly",
    language: (api.language as AIResponderConfig["language"]) ?? "ar",
    customInstructions: api.custom_instructions ?? undefined,
    fallbackToHuman: Boolean(api.fallback_to_human ?? true),
    fallbackDelay: Number(api.fallback_delay ?? 5),
  };
}

function mapUIConfigToApiBody(config: Partial<AIResponderConfig>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (config.enabled !== undefined) body.enabled = config.enabled;
  if (config.businessHoursOnly !== undefined) body.business_hours_only = config.businessHoursOnly;
  if (config.businessHours !== undefined) {
    body.business_hours_start = config.businessHours.start ?? null;
    body.business_hours_end = config.businessHours.end ?? null;
    body.timezone = config.businessHours.timezone ?? null;
  }
  if (config.scenarios !== undefined) {
    body.scenarios = {
      initial_greeting: config.scenarios.initialGreeting,
      faq_responses: config.scenarios.faqResponses,
      property_inquiry_response: config.scenarios.propertyInquiryResponse,
      appointment_booking: config.scenarios.appointmentBooking,
      general_questions: config.scenarios.generalQuestions,
    };
  }
  if (config.tone !== undefined) body.tone = config.tone;
  if (config.language !== undefined) body.language = config.language;
  if (config.customInstructions !== undefined) body.custom_instructions = config.customInstructions;
  if (config.fallbackToHuman !== undefined) body.fallback_to_human = config.fallbackToHuman;
  if (config.fallbackDelay !== undefined) body.fallback_delay = config.fallbackDelay;
  return body;
}

function mapApiAIStatsToUI(api: ApiAIStats | null): AIStats {
  if (!api) return mockAIStats;
  return {
    totalResponses24h: Number(api.total_responses_24h ?? 0),
    avgResponseTime: Number(api.avg_response_time ?? 0),
    satisfactionRate: Number(api.satisfaction_rate ?? 0),
    handoffRate: Number(api.handoff_rate ?? 0),
  };
}

export async function getAIConfig(
  numberId: number
): Promise<AIResponderConfig | null> {
  try {
    const api = await getAIConfigApi(numberId);
    return mapApiAIConfigToUI(api, numberId);
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    await delay();
    return (
      mockAIResponderConfigs.find((c) => c.whatsappNumberId === numberId) ||
      null
    );
  }
}

export async function updateAIConfig(
  numberId: number,
  config: Partial<AIResponderConfig>
): Promise<AIResponderConfig | null> {
  try {
    const body = mapUIConfigToApiBody(config);
    const api = await putAIConfigApi(numberId, body as Parameters<typeof putAIConfigApi>[1]);
    return mapApiAIConfigToUI(api, numberId);
  } catch {
    await delay();
    const configIndex = mockAIResponderConfigs.findIndex(
      (c) => c.whatsappNumberId === numberId
    );
    if (configIndex === -1) {
      const newConfig: AIResponderConfig = {
        id: `ai-config-${Date.now()}`,
        whatsappNumberId: numberId,
        enabled: false,
        businessHoursOnly: false,
        scenarios: {
          initialGreeting: false,
          faqResponses: false,
          propertyInquiryResponse: false,
          appointmentBooking: false,
          generalQuestions: false,
        },
        tone: "friendly",
        language: "ar",
        fallbackToHuman: true,
        fallbackDelay: 5,
        ...config,
      };
      mockAIResponderConfigs.push(newConfig);
      return newConfig;
    }
    mockAIResponderConfigs[configIndex] = {
      ...mockAIResponderConfigs[configIndex],
      ...config,
    };
    return mockAIResponderConfigs[configIndex];
  }
}

/** PATCH /api/v1/whatsapp/ai/config/{numberId}/toggle — toggle AI on/off. */
export async function toggleAIConfig(
  numberId: number
): Promise<AIResponderConfig | null> {
  try {
    const api = await patchAIConfigToggleApi(numberId);
    return mapApiAIConfigToUI(api, numberId);
  } catch {
    return null;
  }
}

export async function getAIStats(_numberId?: number): Promise<AIStats> {
  try {
    const api = await getAIStatsApi();
    return mapApiAIStatsToUI(api);
  } catch {
    await delay();
    return mockAIStats;
  }
}

// ==================== WhatsApp Numbers API ====================
// Uses GET /api/v1/whatsapp/numbers when available; fallback to mock (wa-campaign-send-workflow-AI.md).

export async function getWhatsAppNumbers(): Promise<WhatsAppNumber[]> {
  try {
    const list = await getWhatsAppNumbersApi();
    return list as WhatsAppNumber[];
  } catch {
    await delay();
    return mockWhatsAppNumbers;
  }
}

export async function getWhatsAppNumber(
  id: number
): Promise<WhatsAppNumber | null> {
  try {
    const list = await getWhatsAppNumbers();
    return list.find((n) => n.id === id) ?? null;
  } catch {
    await delay();
    return mockWhatsAppNumbers.find((n) => n.id === id) || null;
  }
}
