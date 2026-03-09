"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Star,
  Circle,
  MessageCircle,
  Clock,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation, ConversationFilters } from "./types";
import { getConversations } from "@/services/whatsapp-management-api";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface ConversationsListProps {
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  whatsappNumberId: number | null;
}

export function ConversationsList({
  selectedConversationId,
  onConversationSelect,
  whatsappNumberId,
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ConversationFilters>({
    status: "all",
    search: "",
  });

  useEffect(() => {
    loadConversations();
  }, [whatsappNumberId, filters]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await getConversations(
        whatsappNumberId || undefined,
        filters
      );
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "resolved":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "قيد الانتظار";
      case "resolved":
        return "محلول";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col h-full border-l">
      {/* Header with search and filters */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في المحادثات..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="pr-9"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: "all" })}
              >
                جميع المحادثات
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: "active" })}
              >
                النشطة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: "pending" })}
              >
                قيد الانتظار
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: "resolved" })}
              >
                المحلولة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, unread: !filters.unread })}
              >
                {filters.unread ? "إلغاء تصفية غير المقروءة" : "غير المقروءة فقط"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, starred: !filters.starred })}
              >
                {filters.starred ? "إلغاء تصفية المميزة" : "المميزة فقط"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>{conversations.length} محادثة</span>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg animate-pulse"
              >
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-2">لا توجد محادثات</h3>
            <p className="text-sm text-muted-foreground">
              {filters.search
                ? "لم يتم العثور على محادثات مطابقة"
                : "ستظهر المحادثات الجديدة هنا"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-right ${
                  selectedConversationId === conversation.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conversation.customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -left-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-semibold truncate">
                        {conversation.customerName}
                      </span>
                      {conversation.isStarred && (
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {conversation.lastMessage}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Circle
                        className={`h-2 w-2 ${getStatusColor(conversation.status)}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(conversation.status)}
                      </span>
                    </div>

                    {conversation.propertyInterests &&
                      conversation.propertyInterests.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {conversation.propertyInterests.length} عقار
                        </Badge>
                      )}

                    {conversation.assignedAgent && (
                      <Badge variant="outline" className="text-xs">
                        {conversation.assignedAgent.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
