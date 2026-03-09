"use client";

import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessageTemplate } from "./types";

interface ConversationMessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  isSending: boolean;
  showTemplates: boolean;
  setShowTemplates: (value: boolean) => void;
  templates: MessageTemplate[];
  onTemplateSelect: (template: MessageTemplate) => void;
  onSend: () => void;
}

export function ConversationMessageInput({
  newMessage,
  setNewMessage,
  isSending,
  showTemplates,
  setShowTemplates,
  templates,
  onTemplateSelect,
  onSend,
}: ConversationMessageInputProps) {
  return (
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
                    onClick={() => onTemplateSelect(template)}
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
              onSend();
            }
          }}
          className="min-h-[60px] max-h-32 resize-none"
        />

        <Button
          onClick={onSend}
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
  );
}
