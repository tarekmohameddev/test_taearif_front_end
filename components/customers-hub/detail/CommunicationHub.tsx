"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { 
  MessageSquare, Phone, Mail, Send, Clock, 
  CheckCheck, Check, X, Zap, Sparkles,
  Copy, ThumbsUp, Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommunicationHubProps {
  customer: UnifiedCustomer;
}

interface MessageTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  variables: string[];
}

export function CommunicationHub({ customer }: CommunicationHubProps) {
  const [selectedChannel, setSelectedChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // WhatsApp Message Templates for Real Estate
  const messageTemplates: MessageTemplate[] = [
    {
      id: "greeting",
      title: "تحية وترحيب",
      category: "general",
      content: `مرحباً {customerName}،\n\nنشكرك على اهتمامك بخدماتنا العقارية. نحن هنا لمساعدتك في إيجاد العقار المثالي.\n\nفريق {companyName}`,
      variables: ["customerName", "companyName"],
    },
    {
      id: "property_match",
      title: "عقارات مطابقة",
      category: "properties",
      content: `السلام عليكم {customerName}،\n\nوجدنا {propertyCount} عقار يطابق تفضيلاتك:\n\n📍 الموقع: {location}\n💰 السعر: {price} ريال\n🏠 النوع: {propertyType}\n📏 المساحة: {area} م²\n\nهل ترغب في معاينة هذه العقارات؟`,
      variables: ["customerName", "propertyCount", "location", "price", "propertyType", "area"],
    },
    {
      id: "appointment_reminder",
      title: "تذكير بالموعد",
      category: "appointments",
      content: `مرحباً {customerName}،\n\n🗓️ تذكير بموعدك:\n📅 التاريخ: {date}\n⏰ الوقت: {time}\n📍 المكان: {location}\n\nنتطلع لرؤيتك!`,
      variables: ["customerName", "date", "time", "location"],
    },
    {
      id: "viewing_feedback",
      title: "طلب التقييم بعد المعاينة",
      category: "feedback",
      content: `مرحباً {customerName}،\n\nنشكرك على معاينة العقار. نود معرفة رأيك:\n\n⭐ ما تقييمك للعقار من 5؟\n💭 ما هي ملاحظاتك؟\n\nرأيك مهم لنا!`,
      variables: ["customerName"],
    },
    {
      id: "payment_reminder",
      title: "تذكير بالدفعة",
      category: "financial",
      content: `السلام عليكم {customerName}،\n\n💳 تذكير بالدفعة المستحقة:\n\n💰 المبلغ: {amount} ريال\n📅 تاريخ الاستحقاق: {dueDate}\n📋 رقم العقد: {contractNumber}\n\nللاستفسار، نحن في خدمتك.`,
      variables: ["customerName", "amount", "dueDate", "contractNumber"],
    },
    {
      id: "contract_ready",
      title: "العقد جاهز",
      category: "contracts",
      content: `مبروك {customerName}! 🎉\n\n✅ العقد جاهز للتوقيع\n📄 يرجى مراجعة العقد المرفق\n✍️ يمكنك التوقيع إلكترونياً\n\nنهنئك على خطوتك الجديدة!`,
      variables: ["customerName"],
    },
    {
      id: "price_negotiation",
      title: "رد على المفاوضة",
      category: "negotiation",
      content: `مرحباً {customerName}،\n\nشكراً لعرضك. بعد التواصل مع المالك:\n\n🏠 العقار: {propertyName}\n💰 سعرك المقترح: {offerPrice} ريال\n💰 رد المالك: {counterOffer} ريال\n\nهل توافق على السعر الجديد؟`,
      variables: ["customerName", "propertyName", "offerPrice", "counterOffer"],
    },
    {
      id: "follow_up",
      title: "متابعة دورية",
      category: "follow_up",
      content: `السلام عليكم {customerName}،\n\nكيف حالك؟ نود متابعة بحثك عن العقار المناسب.\n\n✨ لدينا عروض جديدة قد تهمك\n📞 هل ترغب في حجز موعد؟\n\nنحن هنا لخدمتك.`,
      variables: ["customerName"],
    },
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      let processedContent = template.content;
      
      // Replace variables with actual data
      processedContent = processedContent.replace("{customerName}", customer.name);
      processedContent = processedContent.replace("{companyName}", "طيارف");
      processedContent = processedContent.replace("{location}", customer.preferences.preferredAreas[0] || "الرياض");
      processedContent = processedContent.replace("{propertyType}", 
        customer.preferences.propertyType[0] === "villa" ? "فيلا" :
        customer.preferences.propertyType[0] === "apartment" ? "شقة" : "عقار"
      );
      
      setMessage(processedContent);
    }
  };

  const handleSendMessage = () => {
    // This would integrate with actual WhatsApp/SMS/Email API
    console.log("Sending message via", selectedChannel, ":", message);
  };

  const getChannelIcon = (channel: string) => {
    if (channel === "whatsapp") return <MessageSquare className="h-4 w-4 text-green-600" />;
    if (channel === "sms") return <Phone className="h-4 w-4 text-blue-600" />;
    return <Mail className="h-4 w-4 text-purple-600" />;
  };

  const recentCommunications = customer.interactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant={selectedChannel === "whatsapp" ? "default" : "outline"}
          className="gap-2"
          onClick={() => setSelectedChannel("whatsapp")}
        >
          <MessageSquare className="h-4 w-4" />
          واتساب
        </Button>
        <Button 
          variant={selectedChannel === "sms" ? "default" : "outline"}
          className="gap-2"
          onClick={() => setSelectedChannel("sms")}
        >
          <Phone className="h-4 w-4" />
          رسالة نصية
        </Button>
        <Button 
          variant={selectedChannel === "email" ? "default" : "outline"}
          className="gap-2"
          onClick={() => setSelectedChannel("email")}
        >
          <Mail className="h-4 w-4" />
          بريد إلكتروني
        </Button>
      </div>

      {/* Message Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {getChannelIcon(selectedChannel)}
            إرسال رسالة عبر {selectedChannel === "whatsapp" ? "واتساب" : selectedChannel === "sms" ? "SMS" : "البريد"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              قوالب جاهزة
            </label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="اختر قالب جاهز..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(
                  messageTemplates.reduce((acc, template) => {
                    if (!acc[template.category]) acc[template.category] = [];
                    acc[template.category].push(template);
                    return acc;
                  }, {} as Record<string, MessageTemplate[]>)
                ).map(([category, templates]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                      {category === "general" ? "عام" :
                       category === "properties" ? "العقارات" :
                       category === "appointments" ? "المواعيد" :
                       category === "financial" ? "المالية" :
                       category === "feedback" ? "التقييم" :
                       category === "contracts" ? "العقود" :
                       category === "negotiation" ? "المفاوضة" :
                       "متابعة"}
                    </div>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">الرسالة</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={8}
              className="resize-none font-arabic"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{message.length} حرف</span>
              {selectedChannel === "whatsapp" && message.length > 1000 && (
                <span className="text-yellow-600">قد تحتاج إلى تقسيم الرسالة</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              className="flex-1 gap-2"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
              إرسال الآن
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              جدولة
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigator.clipboard.writeText(message)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Suggestions */}
          <Card className="bg-purple-50 dark:bg-purple-950">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">اقتراحات ذكية:</div>
                  <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {customer.aiInsights.nextBestAction && (
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>{customer.aiInsights.nextBestAction}</span>
                      </div>
                    )}
                    {customer.preferences.timeline === "immediate" && (
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>العميل لديه جدول زمني عاجل - يفضل الاتصال الفوري</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Recent Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">آخر التواصلات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentCommunications.length > 0 ? (
            recentCommunications.map((interaction) => (
              <div 
                key={interaction.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded"
              >
                {interaction.type === "whatsapp" && <MessageSquare className="h-4 w-4 text-green-600 mt-0.5" />}
                {interaction.type === "call" && <Phone className="h-4 w-4 text-blue-600 mt-0.5" />}
                {interaction.type === "email" && <Mail className="h-4 w-4 text-purple-600 mt-0.5" />}
                {interaction.type === "sms" && <Phone className="h-4 w-4 text-orange-600 mt-0.5" />}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {interaction.type === "whatsapp" ? "واتساب" :
                       interaction.type === "call" ? "مكالمة" :
                       interaction.type === "email" ? "بريد" :
                       interaction.type === "sms" ? "رسالة نصية" : interaction.type}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {interaction.direction === "outbound" ? "صادر" : "وارد"}
                    </Badge>
                    {interaction.sentiment && (
                      <Badge 
                        variant={
                          interaction.sentiment === "positive" ? "default" :
                          interaction.sentiment === "negative" ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {interaction.sentiment === "positive" ? "إيجابي" :
                         interaction.sentiment === "negative" ? "سلبي" : "محايد"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {interaction.notes}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(interaction.date).toLocaleString("ar-SA", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {interaction.duration && (
                      <span>{interaction.duration} دقيقة</span>
                    )}
                    <span>• {interaction.agentName}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              لا توجد تواصلات سابقة
            </div>
          )}
        </CardContent>
      </Card>

      {/* Communication Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">إجمالي التواصلات</div>
                <div className="text-2xl font-bold">{customer.totalInteractions || 0}</div>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">معدل الاستجابة</div>
                <div className="text-2xl font-bold">{customer.responseRate || 0}%</div>
              </div>
              <CheckCheck className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">متوسط وقت الرد</div>
                <div className="text-2xl font-bold">
                  {customer.avgResponseTime ? `${customer.avgResponseTime}س` : "N/A"}
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
