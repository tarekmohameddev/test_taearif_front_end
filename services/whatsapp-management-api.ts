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

// Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Conversations API ====================

export async function getConversations(
  numberId?: number,
  filters?: ConversationFilters
): Promise<Conversation[]> {
  await delay();

  let conversations = [...mockConversations];

  // Filter by WhatsApp number
  if (numberId) {
    conversations = conversations.filter(
      (conv) => conv.whatsappNumberId === numberId
    );
  }

  // Apply filters
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

  // Sort by last message time (newest first)
  conversations.sort(
    (a, b) =>
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
  );

  return conversations;
}

export async function getConversation(id: string): Promise<Conversation | null> {
  await delay();
  return mockConversations.find((conv) => conv.id === id) || null;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay();
  return mockMessages[conversationId] || [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachments?: File[]
): Promise<Message> {
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

  // Update mock data (in a real app, this would be handled by the backend)
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  mockMessages[conversationId].push(newMessage);

  // Update conversation's last message
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.lastMessage = content;
    conversation.lastMessageTime = newMessage.timestamp;
  }

  return newMessage;
}

export async function markConversationAsRead(
  conversationId: string
): Promise<void> {
  await delay(200);
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.unreadCount = 0;
  }
}

export async function toggleConversationStar(
  conversationId: string
): Promise<void> {
  await delay(200);
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.isStarred = !conversation.isStarred;
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: "active" | "pending" | "resolved"
): Promise<void> {
  await delay(200);
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.status = status;
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

export async function getWhatsAppNumbers(): Promise<WhatsAppNumber[]> {
  await delay();
  return mockWhatsAppNumbers;
}

export async function getWhatsAppNumber(
  id: number
): Promise<WhatsAppNumber | null> {
  await delay();
  return mockWhatsAppNumbers.find((n) => n.id === id) || null;
}
