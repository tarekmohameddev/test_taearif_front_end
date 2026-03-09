"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Megaphone,
  Zap,
  Bot,
  Settings,
} from "lucide-react";
import { WhatsAppNumberSelector } from "./WhatsAppNumberSelector";
import { ConversationsModule } from "./ConversationsModule";
import { AutomationModule } from "./AutomationModule";
import { AIResponderModule } from "./AIResponderModule";
import { CampaignsManagement } from "@/components/marketing/campaigns-management";
import { WhatsAppCenterPage } from "@/components/whatsapp-center/page-component";

export function WhatsAppManagementPage() {
  const [selectedNumberId, setSelectedNumberId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("conversations");

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                إدارة الواتساب
              </h1>
              <p className="text-muted-foreground">
                إدارة المحادثات والحملات والرسائل الآلية في مكان واحد
              </p>
            </div>

            <WhatsAppNumberSelector
              selectedNumberId={selectedNumberId}
              onNumberChange={setSelectedNumberId}
              showAllOption={true}
            />
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger
                value="conversations"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs sm:text-sm">المحادثات</span>
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2"
              >
                <Megaphone className="h-4 w-4" />
                <span className="text-xs sm:text-sm">الحملات</span>
              </TabsTrigger>
              <TabsTrigger
                value="automation"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2"
              >
                <Zap className="h-4 w-4" />
                <span className="text-xs sm:text-sm">الأتمتة</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai-responder"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2"
              >
                <Bot className="h-4 w-4" />
                <span className="text-xs sm:text-sm">الذكاء الاصطناعي</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2"
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs sm:text-sm">الإعدادات</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversations" className="space-y-4">
              <ConversationsModule selectedNumberId={selectedNumberId} />
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <CampaignsManagement />
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <AutomationModule selectedNumberId={selectedNumberId} />
            </TabsContent>

            <TabsContent value="ai-responder" className="space-y-4">
              <AIResponderModule selectedNumberId={selectedNumberId} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <WhatsAppCenterPage />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
