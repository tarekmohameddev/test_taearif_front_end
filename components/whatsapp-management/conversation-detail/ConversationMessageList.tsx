"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCheck, Clock, X, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "./types";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

function MessageStatusIcon({ status }: { status: Message["status"] }) {
  switch (status) {
    case "sent":
      return <Check className="h-3 w-3" />;
    case "delivered":
      return <CheckCheck className="h-3 w-3" />;
    case "read":
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    case "failed":
      return <X className="h-3 w-3 text-red-500" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
}

interface ConversationMessageListProps {
  messages: Message[];
}

export function ConversationMessageList({
  messages,
}: ConversationMessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollAreaRef.current) return;
    const scrollContainer = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "customer"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] space-y-1 ${
                message.sender === "customer"
                  ? "items-start"
                  : "items-end"
              }`}
            >
              {message.sender !== "customer" && message.senderName && (
                <p className="text-xs text-muted-foreground px-1">
                  {message.senderName}
                </p>
              )}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.sender === "customer"
                    ? "bg-muted"
                    : message.sender === "ai"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : "bg-primary text-primary-foreground"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center gap-1 mb-1 text-xs text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-3 w-3" />
                    <span>رد تلقائي</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <div
                className={`flex items-center gap-1 text-xs text-muted-foreground px-1 ${
                  message.sender === "customer"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <span>
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                    locale: ar,
                  })}
                </span>
                {message.sender !== "customer" && (
                  <MessageStatusIcon status={message.status} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
