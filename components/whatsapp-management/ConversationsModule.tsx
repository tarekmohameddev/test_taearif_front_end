"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ConversationsList } from "./ConversationsList";
import { ConversationDetail } from "./ConversationDetail";

interface ConversationsModuleProps {
  selectedNumberId: number | null;
}

export function ConversationsModule({
  selectedNumberId,
}: ConversationsModuleProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleConversationUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-300px)]">
      {/* Conversations List - Left Sidebar */}
      <div className="lg:col-span-1 border rounded-lg overflow-hidden">
        <ConversationsList
          key={refreshTrigger}
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
          whatsappNumberId={selectedNumberId}
        />
      </div>

      {/* Conversation Detail - Main Content */}
      <div className="lg:col-span-2 border rounded-lg overflow-hidden">
        {selectedConversationId ? (
          <ConversationDetail
            conversationId={selectedConversationId}
            onConversationUpdate={handleConversationUpdate}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">اختر محادثة</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              اختر محادثة من القائمة على اليمين لعرض الرسائل والبدء في التواصل مع
              العملاء
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
