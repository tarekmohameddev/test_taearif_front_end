"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  Check,
  CheckCheck,
  Clock,
  X,
  Sparkles,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Conversation, Message } from "./types";
import {
  getConversation,
  getMessages,
  sendMessage,
  toggleConversationStar,
  updateConversationStatus,
  markConversationAsRead,
  getMessageTemplates,
} from "@/services/whatsapp-management-api";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface ConversationDetailProps {
  conversationId: string;
  onConversationUpdate?: () => void;
}

export function ConversationDetail({
  conversationId,
  onConversationUpdate,
}: ConversationDetailProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversationData();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

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

      // Mark as read
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const message = await sendMessage(conversationId, newMessage);
      setMessages([...messages, message]);
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

  const handleTemplateSelect = (template: any) => {
    let content = template.content;
    if (conversation) {
      content = content.replace("{customer_name}", conversation.customerName);
      content = content.replace("{company_name}", "طيارف");
    }
    setNewMessage(content);
    setShowTemplates(false);
  };

  const getMessageStatusIcon = (status: string) => {
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">لم يتم العثور على المحادثة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {conversation.customerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{conversation.customerName}</h2>
              <p className="text-sm text-muted-foreground">
                {conversation.customerPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleStar}
              className={conversation.isStarred ? "text-yellow-500" : ""}
            >
              <Star
                className={`h-4 w-4 ${conversation.isStarred ? "fill-current" : ""}`}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                  تحديد كـ نشط
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  تحديد كـ قيد الانتظار
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("resolved")}>
                  تحديد كـ محلول
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Property Interests */}
        {conversation.propertyInterests &&
          conversation.propertyInterests.length > 0 && (
            <div className="mt-3 space-y-2">
              {conversation.propertyInterests.map((property) => (
                <Card key={property.id} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {property.propertyName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.location} • {property.price.toLocaleString()} ريال
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs mt-1"
                        >
                          {property.status === "viewing_scheduled"
                            ? "موعد معاينة"
                            : property.status === "interested"
                              ? "مهتم"
                              : property.status === "offer_made"
                                ? "تم تقديم عرض"
                                : "غير مهتم"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>

      {/* Messages */}
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
                  message.sender === "customer" ? "items-start" : "items-end"
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
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
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
                  {message.sender !== "customer" &&
                    getMessageStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4 space-y-3">
        {showTemplates && (
          <Card>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">قوالب الرسائل</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="max-h-48">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-right p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                    </button>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <Textarea
            placeholder="اكتب رسالتك هنا..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[60px] max-h-32 resize-none"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="h-[60px]"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
