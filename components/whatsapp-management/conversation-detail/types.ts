export interface ConversationDetailProps {
  conversationId: string;
  onConversationUpdate?: () => void;
}

export type {
  Conversation,
  Message,
  MessageTemplate,
  PropertyInterest,
} from "../types";
