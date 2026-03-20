"use client";

import { useState } from "react";
import {
  Plus,
  BarChart3,
  Play,
  Pause,
  Edit,
  Trash2,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Eye,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Progress } from "@/components/ui/progress";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "draft" | "scheduled" | "running" | "paused" | "completed" | "failed";
  type: "broadcast" | "drip" | "triggered";
  audience: {
    total: number;
    segments: string[];
  };
  message: {
    content: string;
    mediaUrl?: string;
    mediaType?: "image" | "video" | "document";
  };
  schedule: {
    startDate: string;
    endDate?: string;
    sendTime?: string;
    timezone: string;
  };
  performance: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
  };
  createdAt: string;
  createdBy: string;
  phoneNumber: string;
  estimatedCost: number;
}

export function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "حملة العروض الشتوية",
      description: "حملة ترويجية للعروض الشتوية الخاصة",
      status: "completed",
      type: "broadcast",
      audience: {
        total: 1250,
        segments: ["عملاء مميزون", "مشتركون في النشرة"],
      },
      message: {
        content:
          "عروض شتوية مميزة! خصم يصل إلى 50% على جميع المنتجات. العرض محدود حتى نهاية الشهر.",
        mediaUrl: "/winter-sale-banner.jpg",
        mediaType: "image",
      },
      schedule: {
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        sendTime: "10:00",
        timezone: "Asia/Riyadh",
      },
      performance: {
        sent: 1250,
        delivered: 1200,
        read: 980,
        replied: 145,
        failed: 50,
      },
      createdAt: "2024-01-10",
      createdBy: "أحمد محمد",
      phoneNumber: "+966501234567",
      estimatedCost: 62.5,
    },
    {
      id: "2",
      name: "تذكير المواعيد الأسبوعي",
      description: "حملة تلقائية لتذكير العملاء بمواعيدهم",
      status: "running",
      type: "triggered",
      audience: {
        total: 450,
        segments: ["عملاء لديهم مواعيد"],
      },
      message: {
        content:
          "تذكير: لديك موعد غداً في {appointment_time}. يرجى التأكيد أو إعادة الجدولة.",
      },
      schedule: {
        startDate: "2024-01-01",
        sendTime: "18:00",
        timezone: "Asia/Riyadh",
      },
      performance: {
        sent: 2100,
        delivered: 2050,
        read: 1800,
        replied: 320,
        failed: 50,
      },
      createdAt: "2023-12-28",
      createdBy: "سارة أحمد",
      phoneNumber: "+966559876543",
      estimatedCost: 105,
    },
    {
      id: "3",
      name: "ترحيب بالعملاء الجدد",
      description: "رسالة ترحيب تلقائية للعملاء الجدد",
      status: "scheduled",
      type: "drip",
      audience: {
        total: 0,
        segments: ["عملاء جدد"],
      },
      message: {
        content:
          "مرحباً, عائلتنا! نحن سعداء لانضمامك إلينا. استمتع بخصم 20% على أول طلب.",
      },
      schedule: {
        startDate: "2024-01-25",
        sendTime: "09:00",
        timezone: "Asia/Riyadh",
      },
      performance: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        failed: 0,
      },
      createdAt: "2024-01-20",
      createdBy: "محمد علي",
      phoneNumber: "+966501234567",
      estimatedCost: 0,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "broadcast" as Campaign["type"],
    message: "",
    audience: "all",
    phoneNumber: "",
    scheduleType: "now" as "now" | "scheduled",
    startDate: "",
    startTime: "",
  });

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "running":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Campaign["status"]) => {
    switch (status) {
      case "draft":
        return "مسودة";
      case "scheduled":
        return "مجدولة";
      case "running":
        return "قيد التشغيل";
      case "paused":
        return "متوقفة";
      case "completed":
        return "مكتملة";
      case "failed":
        return "فشلت";
      default:
        return "غير معروف";
    }
  };

  const getTypeText = (type: Campaign["type"]) => {
    switch (type) {
      case "broadcast":
        return "بث جماعي";
      case "drip":
        return "حملة متدرجة";
      case "triggered":
        return "حملة تلقائية";
      default:
        return "غير معروف";
    }
  };

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      description: newCampaign.description,
      status: newCampaign.scheduleType === "now" ? "running" : "scheduled",
      type: newCampaign.type,
      audience: {
        total: newCampaign.audience === "all" ? 1500 : 750,
        segments:
          newCampaign.audience === "all" ? ["جميع العملاء"] : ["عملاء مختارون"],
      },
      message: {
        content: newCampaign.message,
      },
      schedule: {
        startDate:
          newCampaign.startDate || new Date().toISOString().split("T")[0],
        sendTime: newCampaign.startTime || "10:00",
        timezone: "Asia/Riyadh",
      },
      performance: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        failed: 0,
      },
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "المستخدم الحالي",
      phoneNumber: newCampaign.phoneNumber,
      estimatedCost: (newCampaign.audience === "all" ? 1500 : 750) * 0.05,
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({
      name: "",
      description: "",
      type: "broadcast",
      message: "",
      audience: "all",
      phoneNumber: "",
      scheduleType: "now",
      startDate: "",
      startTime: "",
    });
    setIsCreateDialogOpen(false);
  };

  const handleCampaignAction = (
    campaignId: string,
    action: "play" | "pause" | "stop" | "delete",
  ) => {
    setCampaigns(
      campaigns.map((campaign) => {
        if (campaign.id === campaignId) {
          switch (action) {
            case "play":
              return { ...campaign, status: "running" as Campaign["status"] };
            case "pause":
              return { ...campaign, status: "paused" as Campaign["status"] };
            case "stop":
              return { ...campaign, status: "completed" as Campaign["status"] };
            default:
              return campaign;
          }
        }
        return campaign;
      }),
    );

    if (action === "delete") {
      setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId));
    }
  };

  const calculateDeliveryRate = (campaign: Campaign) => {
    return campaign.performance.sent > 0
      ? (campaign.performance.delivered / campaign.performance.sent) * 100
      : 0;
  };

  const calculateReadRate = (campaign: Campaign) => {
    return campaign.performance.delivered > 0
      ? (campaign.performance.read / campaign.performance.delivered) * 100
      : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 ml-2 text-primary" />
            إدارة الحملات
          </h2>
          <p className="text-sm text-muted-foreground">
            إنشاء وإدارة حملات التسويق عبر الواتساب
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إنشاء حملة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء حملة تسويقية جديدة</DialogTitle>
              <DialogDescription>
                املأ البيانات التالية لإنشاء حملة تسويقية
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">اسم الحملة</Label>
                <Input
                  id="campaignName"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  placeholder="مثل: حملة العروض الصيفية"
                />
              </div>

              <div>
                <Label htmlFor="campaignDescription">وصف الحملة</Label>
                <Textarea
                  id="campaignDescription"
                  value={newCampaign.description}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      description: e.target.value,
                    })
                  }
                  placeholder="وصف مختصر للحملة وأهدافها"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignType">نوع الحملة</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value: Campaign["type"]) =>
                      setNewCampaign({ ...newCampaign, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broadcast">بث جماعي</SelectItem>
                      <SelectItem value="drip">حملة متدرجة</SelectItem>
                      <SelectItem value="triggered">حملة تلقائية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">الجمهور المستهدف</Label>
                  <Select
                    value={newCampaign.audience}
                    onValueChange={(value) =>
                      setNewCampaign({ ...newCampaign, audience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العملاء (1,500)</SelectItem>
                      <SelectItem value="vip">
                        العملاء المميزون (750)
                      </SelectItem>
                      <SelectItem value="new">العملاء الجدد (300)</SelectItem>
                      <SelectItem value="inactive">
                        العملاء غير النشطين (450)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">رقم الواتساب</Label>
                <Select
                  value={newCampaign.phoneNumber}
                  onValueChange={(value) =>
                    setNewCampaign({ ...newCampaign, phoneNumber: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر رقم الواتساب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+966501234567">
                      +966501234567 - الرقم الرئيسي
                    </SelectItem>
                    <SelectItem value="+966559876543">
                      +966559876543 - خدمة العملاء
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">نص الرسالة</Label>
                <Textarea
                  id="message"
                  value={newCampaign.message}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, message: e.target.value })
                  }
                  placeholder="اكتب نص الرسالة هنا..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  يمكنك استخدام متغيرات مثل {"{customer_name}"} و{" "}
                  {"{company_name}"}
                </p>
              </div>

              <div>
                <Label>توقيت الإرسال</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      id="sendNow"
                      name="scheduleType"
                      value="now"
                      checked={newCampaign.scheduleType === "now"}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          scheduleType: e.target.value as "now" | "scheduled",
                        })
                      }
                    />
                    <Label htmlFor="sendNow">إرسال فوري</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      id="sendScheduled"
                      name="scheduleType"
                      value="scheduled"
                      checked={newCampaign.scheduleType === "scheduled"}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          scheduleType: e.target.value as "now" | "scheduled",
                        })
                      }
                    />
                    <Label htmlFor="sendScheduled">جدولة الإرسال</Label>
                  </div>
                </div>

                {newCampaign.scheduleType === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label htmlFor="startDate">تاريخ البدء</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newCampaign.startDate}
                        onChange={(e) =>
                          setNewCampaign({
                            ...newCampaign,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">وقت الإرسال</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newCampaign.startTime}
                        onChange={(e) =>
                          setNewCampaign({
                            ...newCampaign,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  التكلفة المتوقعة:{" "}
                  {(
                    (newCampaign.audience === "all" ? 1500 : 750) * 0.05
                  ).toFixed(2)}{" "}
                  ر.س
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={
                    !newCampaign.name ||
                    !newCampaign.message ||
                    !newCampaign.phoneNumber
                  }
                  className="flex-1"
                >
                  إنشاء الحملة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الحملات</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">قيد التشغيل</p>
                <p className="text-2xl font-bold text-green-600">
                  {campaigns.filter((c) => c.status === "running").length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مجدولة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {campaigns.filter((c) => c.status === "scheduled").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مكتملة</p>
                <p className="text-2xl font-bold text-purple-600">
                  {campaigns.filter((c) => c.status === "completed").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusText(campaign.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getTypeText(campaign.type)}
                    </Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {campaign.status === "running" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCampaignAction(campaign.id, "pause")}
                    >
                      <Pause className="h-3 w-3" />
                    </Button>
                  )}
                  {(campaign.status === "paused" ||
                    campaign.status === "scheduled") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCampaignAction(campaign.id, "play")}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setIsDetailsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCampaignAction(campaign.id, "delete")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">
                      {campaign.audience.total.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    جمهور مستهدف
                  </span>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-semibold">
                      {campaign.performance.sent.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    رسائل مُرسلة
                  </span>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">
                      {calculateDeliveryRate(campaign).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    معدل التسليم
                  </span>
                </div>

                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <Eye className="h-4 w-4" />
                    <span className="font-semibold">
                      {calculateReadRate(campaign).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    معدل القراءة
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {campaign.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {campaign.createdBy}
                  </span>
                </div>
                <span className="font-medium">
                  التكلفة: {campaign.estimatedCost.toFixed(2)} ر.س
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl" dir="rtl">
          {selectedCampaign && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedCampaign.name}
                  <Badge className={getStatusColor(selectedCampaign.status)}>
                    {getStatusText(selectedCampaign.status)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedCampaign.description}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="performance">الأداء</TabsTrigger>
                  <TabsTrigger value="message">الرسالة</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">نوع الحملة</Label>
                      <p className="text-sm text-muted-foreground">
                        {getTypeText(selectedCampaign.type)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        رقم الواتساب
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCampaign.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">تاريخ البدء</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCampaign.schedule.startDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">وقت الإرسال</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCampaign.schedule.sendTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      الجمهور المستهدف
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {selectedCampaign.audience.total.toLocaleString()} شخص
                      </span>
                      <div className="flex gap-1">
                        {selectedCampaign.audience.segments.map(
                          (segment, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {segment}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedCampaign.performance.delivered}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            رسائل مُسلمة
                          </p>
                          <Progress
                            value={calculateDeliveryRate(selectedCampaign)}
                            className="mt-2 h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {calculateDeliveryRate(selectedCampaign).toFixed(1)}
                            % معدل التسليم
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedCampaign.performance.read}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            رسائل مقروءة
                          </p>
                          <Progress
                            value={calculateReadRate(selectedCampaign)}
                            className="mt-2 h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {calculateReadRate(selectedCampaign).toFixed(1)}%
                            معدل القراءة
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600">
                        {selectedCampaign.performance.replied}
                      </div>
                      <p className="text-xs text-muted-foreground">ردود</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-semibold text-red-600">
                        {selectedCampaign.performance.failed}
                      </div>
                      <p className="text-xs text-muted-foreground">فشل</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">
                        {selectedCampaign.estimatedCost.toFixed(2)} ر.س
                      </div>
                      <p className="text-xs text-muted-foreground">التكلفة</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="message" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">نص الرسالة</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedCampaign.message.content}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                    >
                      <Copy className="h-3 w-3 ml-1" />
                      نسخ النص
                    </Button>
                  </div>

                  {selectedCampaign.message.mediaUrl && (
                    <div>
                      <Label className="text-sm font-medium">المرفقات</Label>
                      <div className="mt-2 p-3 border rounded-lg">
                        <img
                          src={
                            selectedCampaign.message.mediaUrl ||
                            "/placeholder.svg"
                          }
                          alt="Campaign media"
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {campaigns.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              لا توجد حملات تسويقية
            </h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإنشاء حملتك التسويقية الأولى
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء حملة جديدة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
