"use client";

import { MoreVertical, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "./types";
import { ConversationPropertyInterests } from "./ConversationPropertyInterests";

interface ConversationDetailHeaderProps {
  conversation: Conversation;
  onToggleStar: () => void;
  onStatusChange: (status: "active" | "pending" | "resolved") => void;
}

export function ConversationDetailHeader({
  conversation,
  onToggleStar,
  onStatusChange,
}: ConversationDetailHeaderProps) {
  return (
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
            onClick={onToggleStar}
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
              <DropdownMenuItem onClick={() => onStatusChange("active")}>
                تحديد كـ نشط
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("pending")}>
                تحديد كـ قيد الانتظار
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("resolved")}>
                تحديد كـ محلول
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {conversation.propertyInterests &&
        conversation.propertyInterests.length > 0 && (
          <ConversationPropertyInterests
            propertyInterests={conversation.propertyInterests}
          />
        )}
    </div>
  );
}
