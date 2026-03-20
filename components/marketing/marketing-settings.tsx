"use client";

import { useState } from "react";
import {
  Settings,
  MessageSquare,
  Clock,
  Users,
  Shield,
  Bell,
  Globe,
  Zap,
  Save,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface MessageSettings {
  autoReply: boolean;
  autoReplyMessage: string;
  businessHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  rateLimiting: {
    enabled: boolean;
    maxMessagesPerHour: number;
    maxMessagesPerDay: number;
  };
  templates: {
    welcomeMessage: string;
    thankYouMessage: string;
    orderConfirmation: string;
    appointmentReminder: string;
  };
}

interface NotificationSettings {
  newMessage: boolean;
  campaignComplete: boolean;
  lowCredits: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface SystemIntegrations {
  crm: boolean;
  ecommerce: boolean;
  appointments: boolean;
  analytics: boolean;
  webhooks: {
    enabled: boolean;
    url: string;
    events: string[];
  };
}

export function MarketingSettingsComponent() {
  const [messageSettings, setMessageSettings] = useState<MessageSettings>({
    autoReply: true,
    autoReplyMessage: "شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.",
    businessHours: {
      enabled: true,
      start: "09:00",
      end: "18:00",
      timezone: "Asia/Riyadh",
    },
    rateLimiting: {
      enabled: true,
      maxMessagesPerHour: 100,
      maxMessagesPerDay: 1000,
    },
    templates: {
      welcomeMessage: "مرحباً, {company_name}! نحن سعداء لخدمتك.",
      thankYouMessage: "شكراً لك على اختيارك {company_name}. نقدر ثقتك بنا.",
      orderConfirmation:
        "تم تأكيد طلبك رقم {order_id}. سيتم التوصيل خلال {delivery_time}.",
      appointmentReminder:
        "تذكير: لديك موعد غداً في {appointment_time} مع {staff_name}.",
    },
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      newMessage: true,
      campaignComplete: true,
      lowCredits: true,
      systemUpdates: false,
      emailNotifications: true,
      smsNotifications: false,
    });

  const [systemIntegrations, setSystemIntegrations] =
    useState<SystemIntegrations>({
      crm: true,
      ecommerce: false,
      appointments: true,
      analytics: true,
      webhooks: {
        enabled: false,
        url: "",
        events: [],
      },
    });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success");
      setIsSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1000);
  };

  const availableEvents = [
    { id: "message_received", label: "رسالة واردة" },
    { id: "message_sent", label: "رسالة مُرسلة" },
    { id: "campaign_started", label: "بدء حملة" },
    { id: "campaign_completed", label: "انتهاء حملة" },
    { id: "number_connected", label: "ربط رقم جديد" },
    { id: "credits_low", label: "انخفاض الرصيد" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="h-5 w-5 ml-2 text-primary" />
            إعدادات التسويق
          </h2>
          <p className="text-sm text-muted-foreground">
            تكوين إعدادات الرسائل والإشعارات والتكاملات
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      {/* Save Status Alert */}
      {saveStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            تم حفظ الإعدادات بنجاح!
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">الرسائل</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">التكاملات</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">الأمان</span>
          </TabsTrigger>
        </TabsList>

        {/* Messages Settings */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 ml-2" />
                إعدادات الرسائل التلقائية
              </CardTitle>
              <CardDescription>
                تكوين الردود التلقائية وساعات العمل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Reply */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">الرد التلقائي</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال رد تلقائي عند استلام رسالة جديدة
                  </p>
                </div>
                <Switch
                  checked={messageSettings.autoReply}
                  onCheckedChange={(checked) =>
                    setMessageSettings((prev) => ({
                      ...prev,
                      autoReply: checked,
                    }))
                  }
                />
              </div>

              {messageSettings.autoReply && (
                <div className="space-y-2">
                  <Label htmlFor="autoReplyMessage">نص الرد التلقائي</Label>
                  <Textarea
                    id="autoReplyMessage"
                    value={messageSettings.autoReplyMessage}
                    onChange={(e) =>
                      setMessageSettings((prev) => ({
                        ...prev,
                        autoReplyMessage: e.target.value,
                      }))
                    }
                    placeholder="أدخل نص الرد التلقائي..."
                    rows={3}
                  />
                </div>
              )}

              {/* Business Hours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">ساعات العمل</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد ساعات العمل لإرسال الرسائل
                    </p>
                  </div>
                  <Switch
                    checked={messageSettings.businessHours.enabled}
                    onCheckedChange={(checked) =>
                      setMessageSettings((prev) => ({
                        ...prev,
                        businessHours: {
                          ...prev.businessHours,
                          enabled: checked,
                        },
                      }))
                    }
                  />
                </div>

                {messageSettings.businessHours.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startTime">بداية العمل</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={messageSettings.businessHours.start}
                        onChange={(e) =>
                          setMessageSettings((prev) => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              start: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">نهاية العمل</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={messageSettings.businessHours.end}
                        onChange={(e) =>
                          setMessageSettings((prev) => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              end: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">المنطقة الزمنية</Label>
                      <Select
                        value={messageSettings.businessHours.timezone}
                        onValueChange={(value) =>
                          setMessageSettings((prev) => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              timezone: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Riyadh">
                            الرياض (GMT+3)
                          </SelectItem>
                          <SelectItem value="Asia/Dubai">
                            دبي (GMT+4)
                          </SelectItem>
                          <SelectItem value="Asia/Kuwait">
                            الكويت (GMT+3)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Rate Limiting */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">تحديد معدل الإرسال</Label>
                    <p className="text-sm text-muted-foreground">
                      تحديد عدد الرسائل المسموح إرسالها
                    </p>
                  </div>
                  <Switch
                    checked={messageSettings.rateLimiting.enabled}
                    onCheckedChange={(checked) =>
                      setMessageSettings((prev) => ({
                        ...prev,
                        rateLimiting: {
                          ...prev.rateLimiting,
                          enabled: checked,
                        },
                      }))
                    }
                  />
                </div>

                {messageSettings.rateLimiting.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyLimit">الحد الأقصى في الساعة</Label>
                      <Input
                        id="hourlyLimit"
                        type="number"
                        value={messageSettings.rateLimiting.maxMessagesPerHour}
                        onChange={(e) =>
                          setMessageSettings((prev) => ({
                            ...prev,
                            rateLimiting: {
                              ...prev.rateLimiting,
                              maxMessagesPerHour: Number.parseInt(
                                e.target.value,
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dailyLimit">الحد الأقصى في اليوم</Label>
                      <Input
                        id="dailyLimit"
                        type="number"
                        value={messageSettings.rateLimiting.maxMessagesPerDay}
                        onChange={(e) =>
                          setMessageSettings((prev) => ({
                            ...prev,
                            rateLimiting: {
                              ...prev.rateLimiting,
                              maxMessagesPerDay: Number.parseInt(
                                e.target.value,
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle>قوالب الرسائل</CardTitle>
              <CardDescription>
                قوالب جاهزة للرسائل المختلفة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="welcomeTemplate">رسالة الترحيب</Label>
                <Textarea
                  id="welcomeTemplate"
                  value={messageSettings.templates.welcomeMessage}
                  onChange={(e) =>
                    setMessageSettings((prev) => ({
                      ...prev,
                      templates: {
                        ...prev.templates,
                        welcomeMessage: e.target.value,
                      },
                    }))
                  }
                  placeholder="رسالة ترحيب للعملاء الجدد..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  يمكنك استخدام {"{company_name}"} للإشارة إلى اسم الشركة
                </p>
              </div>

              <div>
                <Label htmlFor="thankYouTemplate">رسالة الشكر</Label>
                <Textarea
                  id="thankYouTemplate"
                  value={messageSettings.templates.thankYouMessage}
                  onChange={(e) =>
                    setMessageSettings((prev) => ({
                      ...prev,
                      templates: {
                        ...prev.templates,
                        thankYouMessage: e.target.value,
                      },
                    }))
                  }
                  placeholder="رسالة شكر للعملاء..."
                />
              </div>

              <div>
                <Label htmlFor="orderTemplate">تأكيد الطلب</Label>
                <Textarea
                  id="orderTemplate"
                  value={messageSettings.templates.orderConfirmation}
                  onChange={(e) =>
                    setMessageSettings((prev) => ({
                      ...prev,
                      templates: {
                        ...prev.templates,
                        orderConfirmation: e.target.value,
                      },
                    }))
                  }
                  placeholder="رسالة تأكيد الطلب..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  متغيرات متاحة: {"{order_id}"}, {"{delivery_time}"}
                </p>
              </div>

              <div>
                <Label htmlFor="appointmentTemplate">تذكير الموعد</Label>
                <Textarea
                  id="appointmentTemplate"
                  value={messageSettings.templates.appointmentReminder}
                  onChange={(e) =>
                    setMessageSettings((prev) => ({
                      ...prev,
                      templates: {
                        ...prev.templates,
                        appointmentReminder: e.target.value,
                      },
                    }))
                  }
                  placeholder="رسالة تذكير بالموعد..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  متغيرات متاحة: {"{appointment_time}"}, {"{staff_name}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 ml-2" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                تحديد أنواع الإشعارات التي تريد استلامها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* App Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">إشعارات التطبيق</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>رسائل جديدة</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعار عند استلام رسالة جديدة
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newMessage}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        newMessage: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>اكتمال الحملات</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعار عند انتهاء حملة تسويقية
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.campaignComplete}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        campaignComplete: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>انخفاض الرصيد</Label>
                    <p className="text-sm text-muted-foreground">
                      تحذير عند انخفاض رصيد الرسائل
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowCredits}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        lowCredits: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تحديثات النظام</Label>
                    <p className="text-sm text-muted-foreground">
                      إشعارات حول تحديثات وميزات جديدة
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        systemUpdates: checked,
                      }))
                    }
                  />
                </div>
              </div>

              {/* External Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">الإشعارات الخارجية</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">
                      إرسال إشعارات عبر البريد الإلكتروني
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الرسائل النصية</Label>
                    <p className="text-sm text-muted-foreground">
                      إرسال إشعارات عبر SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smsNotifications: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 ml-2" />
                تكاملات النظام
              </CardTitle>
              <CardDescription>
                ربط التسويق مع أجزاء أخرى من النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-base">نظام CRM</Label>
                      <p className="text-sm text-muted-foreground">
                        ربط مع إدارة العملاء
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={systemIntegrations.crm}
                    onCheckedChange={(checked) =>
                      setSystemIntegrations((prev) => ({
                        ...prev,
                        crm: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-base">نظام المواعيد</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تذكيرات المواعيد
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={systemIntegrations.appointments}
                    onCheckedChange={(checked) =>
                      setSystemIntegrations((prev) => ({
                        ...prev,
                        appointments: checked,
                      }))
                    }
                  />
                </div>

                {systemIntegrations.webhooks.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhookUrl">رابط Webhook</Label>
                      <Input
                        id="webhookUrl"
                        type="url"
                        placeholder="https://example.com/webhook"
                        value={systemIntegrations.webhooks.url}
                        onChange={(e) =>
                          setSystemIntegrations((prev) => ({
                            ...prev,
                            webhooks: { ...prev.webhooks, url: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label>الأحداث المُفعلة</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {availableEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center space-x-2 space-x-reverse"
                          >
                            <input
                              type="checkbox"
                              id={event.id}
                              checked={systemIntegrations.webhooks.events.includes(
                                event.id,
                              )}
                              onChange={(e) => {
                                const events = e.target.checked
                                  ? [
                                      ...systemIntegrations.webhooks.events,
                                      event.id,
                                    ]
                                  : systemIntegrations.webhooks.events.filter(
                                      (id) => id !== event.id,
                                    );
                                setSystemIntegrations((prev) => ({
                                  ...prev,
                                  webhooks: { ...prev.webhooks, events },
                                }));
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={event.id} className="text-sm">
                              {event.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 ml-2" />
                إعدادات الأمان
              </CardTitle>
              <CardDescription>تكوين إعدادات الأمان والخصوصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>ملاحظة:</strong> إعدادات الأمان تتطلب صلاحيات إدارية
                  عالية. تأكد من فهم تأثير كل إعداد قبل التغيير.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">تشفير البيانات</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    جميع الرسائل والبيانات الحساسة مُشفرة تلقائياً
                  </p>
                  <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">مراجعة الأنشطة</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    تسجيل جميع العمليات المهمة للمراجعة
                  </p>
                  <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">التحقق الثنائي</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    طبقة حماية إضافية للعمليات الحساسة
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    قيد التطوير
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
