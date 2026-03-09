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
          c.wa_number_id ?? c.whatsapp_number_id ?? numberId,
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

    const conv: Conversation = {
      id: String(c.id),
      customerId: "",
      customerName: nameFallback,
      customerPhone: phoneFallback,
      customerAvatar: undefined,
      whatsappNumberId: c.wa_number_id ?? c.whatsapp_number_id,
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

      return {
        id: String(m.id),
        conversationId: String(m.conversation_id ?? conversationId),
        content: m.content ?? "",
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

    const mapped: Message = {
      id: String(apiMessage.id),
      conversationId: String(apiMessage.conversation_id ?? conversationId),
      content: apiMessage.content ?? "",
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
  await delay();
  return mockMessageTemplates;
}

export async function getMessageTemplate(
  id: string
): Promise<MessageTemplate | null> {
  await delay();
  return mockMessageTemplates.find((t) => t.id === id) || null;
}

// ==================== Automation Rules API ====================

export async function getAutomationRules(
  numberId?: number
): Promise<AutomationRule[]> {
  await delay();
  let rules = [...mockAutomationRules];

  if (numberId) {
    rules = rules.filter(
      (rule) => !rule.whatsappNumberId || rule.whatsappNumberId === numberId
    );
  }

  return rules;
}

export async function getAutomationRule(
  id: string
): Promise<AutomationRule | null> {
  await delay();
  return mockAutomationRules.find((r) => r.id === id) || null;
}

export async function createAutomationRule(
  rule: Omit<AutomationRule, "id" | "createdAt" | "triggeredCount">
): Promise<AutomationRule> {
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

export async function updateAutomationRule(
  id: string,
  updates: Partial<AutomationRule>
): Promise<AutomationRule | null> {
  await delay();

  const ruleIndex = mockAutomationRules.findIndex((r) => r.id === id);
  if (ruleIndex === -1) return null;

  mockAutomationRules[ruleIndex] = {
    ...mockAutomationRules[ruleIndex],
    ...updates,
  };

  return mockAutomationRules[ruleIndex];
}

export async function deleteAutomationRule(id: string): Promise<boolean> {
  await delay();
  const index = mockAutomationRules.findIndex((r) => r.id === id);
  if (index === -1) return false;

  mockAutomationRules.splice(index, 1);
  return true;
}

export async function getAutomationStats(): Promise<AutomationStats> {
  await delay();
  return mockAutomationStats;
}

// ==================== AI Responder API ====================

export async function getAIConfig(
  numberId: number
): Promise<AIResponderConfig | null> {
  await delay();
  return (
    mockAIResponderConfigs.find((c) => c.whatsappNumberId === numberId) || null
  );
}

export async function updateAIConfig(
  numberId: number,
  config: Partial<AIResponderConfig>
): Promise<AIResponderConfig | null> {
  await delay();

  const configIndex = mockAIResponderConfigs.findIndex(
    (c) => c.whatsappNumberId === numberId
  );

  if (configIndex === -1) {
    // Create new config
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

export async function getAIStats(numberId?: number): Promise<AIStats> {
  await delay();
  // In a real implementation, this would filter by numberId
  return mockAIStats;
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
