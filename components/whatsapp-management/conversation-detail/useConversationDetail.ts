import { useState, useEffect } from "react";
import type { Conversation, Message, MessageTemplate } from "./types";
import { COMPANY_NAME } from "./constants";
import {
  getConversation,
  getMessages,
  sendMessage,
  toggleConversationStar,
  updateConversationStatus,
  markConversationAsRead,
  getMessageTemplates,
} from "@/services/whatsapp-management-api";
import { toast } from "@/hooks/use-toast";

export function useConversationDetail(
  conversationId: string,
  activeWaNumberId?: number | null,
  onConversationUpdate?: () => void
) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);

  const loadConversationData = async () => {
    try {
      setIsLoading(true);
      const [convData, messagesData, templatesData] = await Promise.all([
        getConversation(conversationId),
        getMessages(conversationId),
        getMessageTemplates(),
      ]);

      setConversation(convData);
      setMessages(messagesData);
      setTemplates(templatesData);

      if (convData && convData.unreadCount > 0) {
        await markConversationAsRead(conversationId);
        onConversationUpdate?.();
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversationData();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !conversation) return;

    const effectiveWaNumberId =
      conversation.whatsappNumberId ?? activeWaNumberId ?? undefined;

    if (effectiveWaNumberId == null) {
      toast({
        title: "لا يمكن إرسال الرسالة",
        description:
          "لا توجد محادثة مرتبطة برقم واتساب. يرجى اختيار رقم من الأعلى أو تهيئة الرقم في الباك‑إند.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      const message = await sendMessage(
        conversationId,
        newMessage,
        effectiveWaNumberId
      );
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      onConversationUpdate?.();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleStar = async () => {
    if (!conversation) return;
    try {
      await toggleConversationStar(conversationId);
      setConversation({
        ...conversation,
        isStarred: !conversation.isStarred,
      });
      onConversationUpdate?.();
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  const handleStatusChange = async (
    status: "active" | "pending" | "resolved"
  ) => {
    if (!conversation) return;
    try {
      await updateConversationStatus(conversationId, status);
      setConversation({ ...conversation, status });
      onConversationUpdate?.();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    let content = template.content;
    if (conversation) {
      content = content.replace("{customer_name}", conversation.customerName);
      content = content.replace("{company_name}", COMPANY_NAME);
    }
    setNewMessage(content);
    setShowTemplates(false);
  };

  return {
    conversation,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    showTemplates,
    setShowTemplates,
    templates,
    loadConversationData,
    handleSendMessage,
    handleToggleStar,
    handleStatusChange,
    handleTemplateSelect,
  };
}
