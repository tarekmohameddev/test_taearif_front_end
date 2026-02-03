"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UnifiedCustomer, Interaction } from "@/types/unified-customer";
import { 
  Plus, Phone, MessageSquare, Mail, Calendar, 
  Clock, User, MapPin, ThumbsUp, ThumbsDown,
  Minus, Save, X, StickyNote, FileText,
  Building, Home
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import useAuthStore from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivitiesTabProps {
  customer: UnifiedCustomer;
}

// Helper function to detect text direction
const getTextDirection = (text: string): "rtl" | "ltr" => {
  if (!text || text.length === 0) return "rtl";
  const firstChar = text.trim()[0];
  const latinRegex = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return latinRegex.test(firstChar) ? "ltr" : "rtl";
};

export function ActivitiesTab({ customer }: ActivitiesTabProps) {
  const { addInteraction } = useUnifiedCustomersStore();
  const userData = useAuthStore((state) => state.userData);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [activityType, setActivityType] = useState<Interaction["type"]>("note");
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative">("neutral");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [duration, setDuration] = useState<number>();

  const textDirection = getTextDirection(content);
  const textAlignment = textDirection === "ltr" ? "text-left" : "text-right";

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newInteraction: Interaction = {
      id: `int_${Date.now()}`,
      type: activityType,
      direction: activityType === "note" ? undefined : "outbound",
      date: new Date().toISOString(),
      duration: activityType === "call" ? duration : undefined,
      notes: content,
      agentName: userData?.user?.name || "الوكيل",
      agentId: userData?.user?.id?.toString() || "0",
      sentiment,
      followUpRequired,
    };

    addInteraction(customer.id, newInteraction);
    
    // Reset form
    setContent("");
    setSentiment("neutral");
    setFollowUpRequired(false);
    setDuration(undefined);
    setShowAddForm(false);
  };

  const getActivityIcon = (type: Interaction["type"]) => {
    const icons = {
      call: Phone,
      whatsapp: MessageSquare,
      email: Mail,
      meeting: User,
      site_visit: MapPin,
      note: StickyNote,
      sms: MessageSquare,
    };
    return icons[type] || FileText;
  };

  const getActivityColor = (type: Interaction["type"]) => {
    const colors = {
      call: "text-blue-600 bg-blue-50 dark:bg-blue-950",
      whatsapp: "text-green-600 bg-green-50 dark:bg-green-950",
      email: "text-purple-600 bg-purple-50 dark:bg-purple-950",
      meeting: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
      site_visit: "text-orange-600 bg-orange-50 dark:bg-orange-950",
      note: "text-gray-600 bg-gray-50 dark:bg-gray-900",
      sms: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  const getActivityLabel = (type: Interaction["type"]) => {
    const labels = {
      call: "مكالمة",
      whatsapp: "واتساب",
      email: "بريد",
      meeting: "اجتماع",
      site_visit: "معاينة",
      note: "ملاحظة",
      sms: "رسالة نصية",
    };
    return labels[type] || type;
  };

  const getSentimentBadge = (sentiment?: "positive" | "neutral" | "negative") => {
    if (!sentiment) return null;
    
    const config = {
      positive: { icon: ThumbsUp, label: "إيجابي", color: "text-green-600 bg-green-50" },
      neutral: { icon: Minus, label: "محايد", color: "text-gray-600 bg-gray-50" },
      negative: { icon: ThumbsDown, label: "سلبي", color: "text-red-600 bg-red-50" },
    };
    
    const { icon: Icon, label, color } = config[sentiment];
    return (
      <Badge variant="outline" className={`gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `اليوم، ${timeStr}`;
    } else if (isYesterday) {
      return `أمس، ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString("ar-SA", {
        month: "short",
        day: "numeric",
      });
      return `${dateStr}، ${timeStr}`;
    }
  };

  // Group interactions by date
  const groupedInteractions = customer.interactions.reduce((groups, interaction) => {
    const date = new Date(interaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(interaction);
    return groups;
  }, {} as Record<string, Interaction[]>);

  const sortedDates = Object.keys(groupedInteractions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">الأنشطة والتفاعلات</h3>
          <p className="text-sm text-gray-500">
            {customer.interactions.length} تفاعل • آخر تواصل: {customer.lastContactAt ? formatDateTime(customer.lastContactAt) : "لا يوجد"}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={showAddForm ? "bg-red-600 hover:bg-red-700" : ""}
        >
          {showAddForm ? (
            <>
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 ml-2" />
              إضافة نشاط
            </>
          )}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">الإجمالي</div>
                <div className="text-2xl font-bold">{customer.interactions.length}</div>
              </div>
              <FileText className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">مكالمات</div>
                <div className="text-2xl font-bold">
                  {customer.interactions.filter(i => i.type === "call").length}
                </div>
              </div>
              <Phone className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">معاينات</div>
                <div className="text-2xl font-bold">
                  {customer.interactions.filter(i => i.type === "site_visit").length}
                </div>
              </div>
              <Home className="h-8 w-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">إيجابي</div>
                <div className="text-2xl font-bold text-green-600">
                  {customer.interactions.filter(i => i.sentiment === "positive").length}
                </div>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Activity Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-500 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">نوع النشاط</label>
                <Select value={activityType} onValueChange={(value: any) => setActivityType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">ملاحظة</SelectItem>
                    <SelectItem value="call">مكالمة</SelectItem>
                    <SelectItem value="whatsapp">واتساب</SelectItem>
                    <SelectItem value="email">بريد إلكتروني</SelectItem>
                    <SelectItem value="meeting">اجتماع</SelectItem>
                    <SelectItem value="site_visit">معاينة عقار</SelectItem>
                    <SelectItem value="sms">رسالة نصية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">الانطباع</label>
                <Select value={sentiment} onValueChange={(value: any) => setSentiment(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">إيجابي 👍</SelectItem>
                    <SelectItem value="neutral">محايد ➖</SelectItem>
                    <SelectItem value="negative">سلبي 👎</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activityType === "call" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">المدة (دقائق)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="5"
                    value={duration || ""}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              )}

              <div className="space-y-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followup"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="followup" className="text-sm font-medium">
                  يتطلب متابعة
                </label>
              </div>
            </div>

            <Textarea
              placeholder="اكتب الملاحظات أو تفاصيل النشاط..."
              className={`min-h-[120px] ${textAlignment}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              dir={textDirection}
            />

            <div className="flex items-center gap-2">
              <Button onClick={handleSubmit} disabled={!content.trim()}>
                <Save className="h-4 w-4 ml-2" />
                حفظ النشاط
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {sortedDates.map((dateStr) => {
          const date = new Date(dateStr);
          const isToday = date.toDateString() === new Date().toDateString();
          const dateLabel = isToday ? "اليوم" : date.toLocaleDateString("ar-SA", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });

          return (
            <div key={dateStr} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {dateLabel}
                </div>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              <div className="space-y-3">
                {groupedInteractions[dateStr]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((interaction) => {
                    const Icon = getActivityIcon(interaction.type);
                    const colorClass = getActivityColor(interaction.type);

                    return (
                      <Card key={interaction.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className={`h-10 w-10 ${colorClass}`}>
                              <AvatarFallback className={colorClass}>
                                <Icon className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={colorClass}>
                                  {getActivityLabel(interaction.type)}
                                </Badge>
                                {interaction.direction && (
                                  <Badge variant="secondary" className="text-xs">
                                    {interaction.direction === "inbound" ? "وارد" : "صادر"}
                                  </Badge>
                                )}
                                {getSentimentBadge(interaction.sentiment)}
                                {interaction.followUpRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    متابعة مطلوبة
                                  </Badge>
                                )}
                              </div>

                              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {interaction.notes}
                              </p>

                              {interaction.outcome && (
                                <div className="mt-2 text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded">
                                  <strong>النتيجة:</strong> {interaction.outcome}
                                </div>
                              )}

                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {interaction.agentName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDateTime(interaction.date)}
                                </span>
                                {interaction.duration && (
                                  <span>{interaction.duration} دقيقة</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {customer.interactions.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              لا توجد أنشطة
            </h3>
            <p className="text-gray-500 mb-4">
              ابدأ بإضافة أول نشاط أو تفاعل مع هذا العميل
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة نشاط
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
