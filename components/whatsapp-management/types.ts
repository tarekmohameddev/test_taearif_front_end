export interface PropertyInterest {
  id: string;
  propertyName: string;
  propertyType: string;
  location: string;
  price: number;
  status: "interested" | "viewing_scheduled" | "offer_made" | "not_interested";
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "document" | "audio";
  url: string;
  name: string;
  size?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: "customer" | "agent" | "system" | "ai";
  senderName?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read" | "failed";
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  whatsappNumberId: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "pending" | "resolved";
  isStarred: boolean;
  propertyInterests?: PropertyInterest[];
  assignedAgent?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger:
    | "new_inquiry"
    | "no_response_24h"
    | "no_response_48h"
    | "no_response_72h"
    | "follow_up"
    | "appointment_reminder"
    | "property_match"
    | "price_change";
  delayMinutes: number;
  templateId: string;
  template?: MessageTemplate;
  isActive: boolean;
  whatsappNumberId?: number; // null = all numbers
  createdAt: string;
  lastTriggered?: string;
  triggeredCount: number;
}

export interface AIResponderConfig {
  id: string;
  whatsappNumberId: number;
  enabled: boolean;
  businessHoursOnly: boolean;
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  scenarios: {
    initialGreeting: boolean;
    faqResponses: boolean;
    propertyInquiryResponse: boolean;
    appointmentBooking: boolean;
    generalQuestions: boolean;
  };
  tone: "formal" | "friendly" | "professional";
  language: "ar" | "en" | "both";
  customInstructions?: string;
  fallbackToHuman: boolean;
  fallbackDelay: number; // minutes
}

export interface WhatsAppNumber {
  id: number;
  phoneNumber: string;
  name: string | null;
  status: string;
  employee?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ConversationFilters {
  status?: "all" | "active" | "pending" | "resolved";
  starred?: boolean;
  unread?: boolean;
  search?: string;
}

export interface AutomationStats {
  totalRules: number;
  activeRules: number;
  messagesSent24h: number;
  successRate: number;
}

export interface AIStats {
  totalResponses24h: number;
  avgResponseTime: number;
  satisfactionRate: number;
  handoffRate: number;
}
