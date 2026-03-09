export interface ConversationDetailProps {
  conversationId: string;
  activeWaNumberId?: number | null;
  onConversationUpdate?: () => void;
}

export type {
  Conversation,
  Message,
  MessageTemplate,
  PropertyInterest,
} from "../types";
