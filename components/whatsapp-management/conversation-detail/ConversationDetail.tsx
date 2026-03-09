"use client";

import { useConversationDetail } from "./useConversationDetail";
import {
  ConversationDetailLoadingState,
  ConversationDetailNotFoundState,
} from "./ConversationDetailStates";
import { ConversationDetailHeader } from "./ConversationDetailHeader";
import { ConversationMessageList } from "./ConversationMessageList";
import { ConversationMessageInput } from "./ConversationMessageInput";
import type { ConversationDetailProps } from "./types";

export function ConversationDetail({
  conversationId,
  onConversationUpdate,
}: ConversationDetailProps) {
  const {
    conversation,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    showTemplates,
    setShowTemplates,
    templates,
    handleSendMessage,
    handleToggleStar,
    handleStatusChange,
    handleTemplateSelect,
  } = useConversationDetail(conversationId, onConversationUpdate);

  if (isLoading) {
    return <ConversationDetailLoadingState />;
  }

  if (!conversation) {
    return <ConversationDetailNotFoundState />;
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationDetailHeader
        conversation={conversation}
        onToggleStar={handleToggleStar}
        onStatusChange={handleStatusChange}
      />
      <ConversationMessageList messages={messages} />
      <ConversationMessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        isSending={isSending}
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        templates={templates}
        onTemplateSelect={handleTemplateSelect}
        onSend={handleSendMessage}
      />
    </div>
  );
}
