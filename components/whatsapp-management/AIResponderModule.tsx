"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  Save,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AIResponderConfig } from "./types";
import {
  getAIConfig,
  updateAIConfig,
  getAIStats,
  getWhatsAppNumber,
} from "@/services/whatsapp-management-api";

interface AIResponderModuleProps {
  selectedNumberId: number | null;
}

export function AIResponderModule({
  selectedNumberId,
}: AIResponderModuleProps) {
  const [config, setConfig] = useState<AIResponderConfig | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [numberName, setNumberName] = useState<string>("");

  useEffect(() => {
    if (selectedNumberId) {
      loadData();
    } else {
      setIsLoading(false);
      setConfig(null);
    }
  }, [selectedNumberId]);

  const loadData = async () => {
    if (!selectedNumberId) return;

    try {
      setIsLoading(true);
      const [configData, statsData, numberData] = await Promise.all([
        getAIConfig(selectedNumberId),
        getAIStats(selectedNumberId),
        getWhatsAppNumber(selectedNumberId),
      ]);

      setConfig(
        configData || {
          id: "",
          whatsappNumberId: selectedNumberId,
          enabled: false,
          businessHoursOnly: false,
          scenarios: {
            initialGreeting: false,
            faqResponses: false,
            propertyInquiryResponse: false,
            appointmentBooking: false,
            generalQuestions: false,
          },
          tone: "friendly",
          language: "ar",
          fallbackToHuman: true,
          fallbackDelay: 5,
        }
      );
      setStats(statsData);
      setNumberName(numberData?.name || numberData?.phoneNumber || "");
    } catch (error) {
      console.error("Failed to load AI config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedNumberId || !config) return;

    try {
      setIsSaving(true);
      await updateAIConfig(selectedNumberId, config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save AI config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (updates: Partial<AIResponderConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
    }
  };

  const updateScenario = (
    scenario: keyof AIResponderConfig["scenarios"],
    value: boolean
  ) => {
    if (config) {
      setConfig({
        ...config,
        scenarios: {
          ...config.scenarios,
          [scenario]: value,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!selectedNumberId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Bot className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <h3 className="text-lg font-semibold">اختر رقم واتساب</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            يرجى اختيار رقم واتساب من القائمة أعلاه لإدارة إعدادات الذكاء
            الاصطناعي
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">فشل في تحميل الإعدادات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ردود اليوم</p>
                  <p className="text-2xl font-bold">
                    {stats.totalResponses24h}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">وقت الرد</p>
                  <p className="text-2xl font-bold">
                    {stats.avgResponseTime}ث
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">رضا العملاء</p>
                  <p className="text-2xl font-bold">
                    {stats.satisfactionRate}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">تحويل لموظف</p>
                  <p className="text-2xl font-bold">{stats.handoffRate}%</p>
                </div>
                <Users className="h-8 w-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            إعدادات الذكاء الاصطناعي
          </h2>
          <p className="text-sm text-muted-foreground">
            {numberName ? `تكوين الرد الآلي لـ ${numberName}` : "تكوين الرد الآلي"}
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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

      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            تم حفظ الإعدادات بنجاح!
          </AlertDescription>
        </Alert>
      )}

      {/* Main Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
            <CardDescription>
              تفعيل وتكوين الرد الآلي الأساسي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">تفعيل الرد الآلي</Label>
                <p className="text-sm text-muted-foreground">
                  السماح للذكاء الاصطناعي بالرد على العملاء
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(checked) =>
                  updateConfig({ enabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">ساعات العمل فقط</Label>
                <p className="text-sm text-muted-foreground">
                  الرد الآلي خلال ساعات العمل فقط
                </p>
              </div>
              <Switch
                checked={config.businessHoursOnly}
                onCheckedChange={(checked) =>
                  updateConfig({ businessHoursOnly: checked })
                }
              />
            </div>

            {config.businessHoursOnly && (
              <div className="space-y-4 pl-4 border-r-2 border-primary/20">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">بداية العمل</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={config.businessHours?.start || "09:00"}
                      onChange={(e) =>
                        updateConfig({
                          businessHours: {
                            ...config.businessHours!,
                            start: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">نهاية العمل</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={config.businessHours?.end || "18:00"}
                      onChange={(e) =>
                        updateConfig({
                          businessHours: {
                            ...config.businessHours!,
                            end: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">التحويل لموظف</Label>
                <p className="text-sm text-muted-foreground">
                  التحويل للموظف إذا لم يتمكن الذكاء من الرد
                </p>
              </div>
              <Switch
                checked={config.fallbackToHuman}
                onCheckedChange={(checked) =>
                  updateConfig({ fallbackToHuman: checked })
                }
              />
            </div>

            {config.fallbackToHuman && (
              <div className="pl-4 border-r-2 border-primary/20">
                <Label htmlFor="fallbackDelay">
                  وقت الانتظار قبل التحويل (دقائق)
                </Label>
                <Input
                  id="fallbackDelay"
                  type="number"
                  value={config.fallbackDelay}
                  onChange={(e) =>
                    updateConfig({ fallbackDelay: Number(e.target.value) })
                  }
                  min={1}
                  max={60}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              أسلوب الردود
            </CardTitle>
            <CardDescription>
              تخصيص نبرة ولغة الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="tone">نبرة الردود</Label>
              <Select
                value={config.tone}
                onValueChange={(value: any) => updateConfig({ tone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">رسمية</SelectItem>
                  <SelectItem value="friendly">ودية</SelectItem>
                  <SelectItem value="professional">مهنية</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                تحدد كيفية تفاعل الذكاء الاصطناعي مع العملاء
              </p>
            </div>

            <div>
              <Label htmlFor="language">اللغة</Label>
              <Select
                value={config.language}
                onValueChange={(value: any) =>
                  updateConfig({ language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية فقط</SelectItem>
                  <SelectItem value="en">الإنجليزية فقط</SelectItem>
                  <SelectItem value="both">كلا اللغتين</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customInstructions">تعليمات إضافية</Label>
              <Textarea
                id="customInstructions"
                value={config.customInstructions || ""}
                onChange={(e) =>
                  updateConfig({ customInstructions: e.target.value })
                }
                placeholder="أضف تعليمات أو سياسات خاصة للذكاء الاصطناعي..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                توجيهات إضافية لضبط سلوك الذكاء الاصطناعي
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>سيناريوهات الرد</CardTitle>
          <CardDescription>
            حدد المواقف التي يمكن للذكاء الاصطناعي التعامل معها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">الترحيب الأولي</Label>
                <p className="text-sm text-muted-foreground">
                  رسالة ترحيب للعملاء الجدد
                </p>
              </div>
              <Switch
                checked={config.scenarios.initialGreeting}
                onCheckedChange={(checked) =>
                  updateScenario("initialGreeting", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">الأسئلة الشائعة</Label>
                <p className="text-sm text-muted-foreground">
                  الرد على الأسئلة المتكررة
                </p>
              </div>
              <Switch
                checked={config.scenarios.faqResponses}
                onCheckedChange={(checked) =>
                  updateScenario("faqResponses", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">استفسارات العقارات</Label>
                <p className="text-sm text-muted-foreground">
                  معلومات عن العقارات المتاحة
                </p>
              </div>
              <Switch
                checked={config.scenarios.propertyInquiryResponse}
                onCheckedChange={(checked) =>
                  updateScenario("propertyInquiryResponse", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">حجز المواعيد</Label>
                <p className="text-sm text-muted-foreground">
                  المساعدة في حجز مواعيد المعاينة
                </p>
              </div>
              <Switch
                checked={config.scenarios.appointmentBooking}
                onCheckedChange={(checked) =>
                  updateScenario("appointmentBooking", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">أسئلة عامة</Label>
                <p className="text-sm text-muted-foreground">
                  الرد على الاستفسارات العامة
                </p>
              </div>
              <Switch
                checked={config.scenarios.generalQuestions}
                onCheckedChange={(checked) =>
                  updateScenario("generalQuestions", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
