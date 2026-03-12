"use client";

import { useState, useEffect } from "react";
import useMarketingStore from "@/context/marketingStore";
import {
  Plus,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit,
  MessageSquare,
  Users,
  Calendar,
  Activity,
  Settings,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WhatsappIcon } from "@/components/icons";

interface WhatsAppNumber {
  id: number;
  user_id: number;
  name: string;
  description: string;
  type: string;
  number: string;
  business_id: string;
  phone_id: string;
  access_token: string;
  is_verified: boolean;
  is_connected: boolean;
  sent_messages_count: number;
  received_messages_count: number;
  additional_settings: {
    webhook_url: string;
    template_namespace: string;
  };
  crm_integration_enabled: boolean;
  appointment_system_integration_enabled: boolean;
  customers_page_integration_enabled: boolean;
  rental_page_integration_enabled: boolean;
  integration_settings: any;
  created_at: string;
  updated_at: string;
}

export function WhatsAppNumbersManagement() {
  const {
    marketingChannels,
    fetchMarketingChannels,
    createMarketingChannel,
    deleteMarketingChannel,
    updateChannelStatus,
    updateChannelSystemIntegrations,
  } = useMarketingStore();
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNumber, setNewNumber] = useState({
    name: "",
    description: "",
    number: "",
    business_id: "",
    phone_id: "",
    access_token: "",
    webhook_url: "",
    template_namespace: "",
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Status Dialog States
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<WhatsAppNumber | null>(
    null,
  );
  const [tempStatus, setTempStatus] = useState({
    is_connected: false,
    is_verified: false,
  });
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Edit Dialog States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<WhatsAppNumber | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState({
    crm_integration_enabled: false,
    appointment_system_integration_enabled: false,
    customers_page_integration_enabled: false,
    rental_page_integration_enabled: false,
    integration_settings: {
      webhook_url: "",
      sync_frequency: "realtime",
      custom_fields: {
        customer_id: "",
        appointment_id: "",
      },
    },
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchMarketingChannels();
  }, []); // إزالة fetchMarketingChannels من dependency array

  // تحديث الأرقام عند تغيير البيانات في الـ store
  useEffect(() => {
    setNumbers(marketingChannels.channels);
  }, [marketingChannels.channels]);

  const handleAddNumber = async () => {
    setIsConnecting(true);

    try {
      const channelData = {
        name: newNumber.name,
        description: newNumber.description,
        type: "whatsapp",
        number: newNumber.number,
        business_id: newNumber.business_id,
        phone_id: newNumber.phone_id,
        access_token: newNumber.access_token,
        additional_settings: {
          webhook_url: newNumber.webhook_url,
          template_namespace: newNumber.template_namespace,
        },
      };

      const result = await createMarketingChannel(channelData);

      if (result.success) {
        setNewNumber({
          name: "",
          description: "",
          number: "",
          business_id: "",
          phone_id: "",
          access_token: "",
          webhook_url: "",
          template_namespace: "",
        });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRemoveNumber = async (id: number) => {
    try {
      const result = await deleteMarketingChannel(id);
      if (result.success) {
        // القناة ستُحذف تلقائياً من القائمة في الـ store
        console.log("تم حذف القناة بنجاح");
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const handleStatusChange = async (
    channelId: number,
    field: "is_connected" | "is_verified",
    value: boolean,
  ) => {
    try {
      const result = await updateChannelStatus(channelId, { [field]: value });
      if (result.success) {
        // تحديث الحالة المحلية
        setNumbers((prevNumbers) =>
          prevNumbers.map((num) =>
            num.id === channelId ? { ...num, [field]: value } : num,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating channel status:", error);
    }
  };

  const openStatusDialog = (channel: WhatsAppNumber) => {
    setSelectedChannel(channel);
    setTempStatus({
      is_connected: channel.is_connected,
      is_verified: channel.is_verified,
    });
    setIsStatusDialogOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedChannel || isSavingStatus) return;

    setIsSavingStatus(true);
    try {
      const result = await updateChannelStatus(selectedChannel.id, tempStatus);
      if (result.success) {
        // تحديث الحالة المحلية
        setNumbers((prevNumbers) =>
          prevNumbers.map((num) =>
            num.id === selectedChannel.id ? { ...num, ...tempStatus } : num,
          ),
        );
        // إغلاق الـ popup
        setIsStatusDialogOpen(false);
        setSelectedChannel(null);
        setTempStatus({
          is_connected: false,
          is_verified: false,
        });
      }
    } catch (error) {
      console.error("Error updating channel status:", error);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleCancelStatus = () => {
    setIsStatusDialogOpen(false);
    setSelectedChannel(null);
    setTempStatus({
      is_connected: false,
      is_verified: false,
    });
  };

  const openEditDialog = (channel: WhatsAppNumber) => {
    setEditingChannel(channel);
    setEditFormData({
      crm_integration_enabled: channel.crm_integration_enabled || false,
      appointment_system_integration_enabled:
        channel.appointment_system_integration_enabled || false,
      customers_page_integration_enabled:
        channel.customers_page_integration_enabled || false,
      rental_page_integration_enabled:
        channel.rental_page_integration_enabled || false,
      integration_settings: {
        webhook_url: channel.integration_settings?.webhook_url || "",
        sync_frequency:
          channel.integration_settings?.sync_frequency || "realtime",
        custom_fields: {
          customer_id:
            channel.integration_settings?.custom_fields?.customer_id || "",
          appointment_id:
            channel.integration_settings?.custom_fields?.appointment_id || "",
        },
      },
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingChannel || isSavingEdit) return;

    setIsSavingEdit(true);
    try {
      const result = await updateChannelSystemIntegrations(
        editingChannel.id,
        editFormData,
      );
      if (result.success) {
        // تحديث الحالة المحلية
        setNumbers((prevNumbers) =>
          prevNumbers.map((num) =>
            num.id === editingChannel.id
              ? {
                  ...num,
                  crm_integration_enabled: editFormData.crm_integration_enabled,
                  appointment_system_integration_enabled:
                    editFormData.appointment_system_integration_enabled,
                  customers_page_integration_enabled:
                    editFormData.customers_page_integration_enabled,
                  rental_page_integration_enabled:
                    editFormData.rental_page_integration_enabled,
                  integration_settings: editFormData.integration_settings,
                }
              : num,
          ),
        );
        // إغلاق الـ dialog
        setIsEditDialogOpen(false);
        setEditingChannel(null);
        setEditFormData({
          crm_integration_enabled: false,
          appointment_system_integration_enabled: false,
          customers_page_integration_enabled: false,
          rental_page_integration_enabled: false,
          integration_settings: {
            webhook_url: "",
            sync_frequency: "realtime",
            custom_fields: {
              customer_id: "",
              appointment_id: "",
            },
          },
        });
      }
    } catch (error) {
      console.error("Error updating channel integrations:", error);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingChannel(null);
    setEditFormData({
      crm_integration_enabled: false,
      appointment_system_integration_enabled: false,
      customers_page_integration_enabled: false,
      rental_page_integration_enabled: false,
      integration_settings: {
        webhook_url: "",
        sync_frequency: "realtime",
        custom_fields: {
          customer_id: "",
          appointment_id: "",
        },
      },
    });
  };

  const getStatusColor = (isConnected: boolean, isVerified: boolean) => {
    if (isConnected && isVerified) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (isConnected && !isVerified) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusIcon = (isConnected: boolean, isVerified: boolean) => {
    if (isConnected && isVerified) {
      return <CheckCircle className="h-4 w-4" />;
    } else if (isConnected && !isVerified) {
      return <AlertCircle className="h-4 w-4" />;
    } else {
      return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (isConnected: boolean, isVerified: boolean) => {
    if (isConnected && isVerified) {
      return "متصل ومُحقق";
    } else if (isConnected && !isVerified) {
      return "متصل غير مُحقق";
    } else {
      return "غير متصل";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <WhatsappIcon className="h-5 w-5 ml-2 text-green-600" />
            أرقام الواتساب
          </h2>
          <p className="text-sm text-muted-foreground">
            إدارة أرقام الواتساب المتصلة مع Meta Cloud API
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة رقم جديد
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto"
            dir="rtl"
          >
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg sm:text-xl">
                إضافة قناة واتساب جديدة
              </DialogTitle>
              <DialogDescription className="text-sm">
                أدخل تفاصيل قناة الواتساب الجديدة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      اسم القناة
                    </Label>
                    <Input
                      id="name"
                      placeholder="مثل: الرقم الرئيسي للشركة"
                      value={newNumber.name}
                      onChange={(e) =>
                        setNewNumber({ ...newNumber, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="number" className="text-sm font-medium">
                      رقم الواتساب
                    </Label>
                    <Input
                      id="number"
                      placeholder="+966501234567"
                      value={newNumber.number}
                      onChange={(e) =>
                        setNewNumber({ ...newNumber, number: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    وصف القناة
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="وصف مختصر لاستخدام هذه القناة"
                    value={newNumber.description}
                    onChange={(e) =>
                      setNewNumber({
                        ...newNumber,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>

              {/* Meta API Configuration Section */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  إعدادات Meta API
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="business_id"
                      className="text-sm font-medium"
                    >
                      معرف الحساب التجاري
                    </Label>
                    <Input
                      id="business_id"
                      placeholder="BA123456789"
                      value={newNumber.business_id}
                      onChange={(e) =>
                        setNewNumber({
                          ...newNumber,
                          business_id: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_id" className="text-sm font-medium">
                      معرف رقم الهاتف
                    </Label>
                    <Input
                      id="phone_id"
                      placeholder="PN987654321"
                      value={newNumber.phone_id}
                      onChange={(e) =>
                        setNewNumber({ ...newNumber, phone_id: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="access_token" className="text-sm font-medium">
                    رمز الوصول
                  </Label>
                  <Input
                    id="access_token"
                    placeholder="test_access_token_123"
                    value={newNumber.access_token}
                    onChange={(e) =>
                      setNewNumber({
                        ...newNumber,
                        access_token: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Advanced Settings Section */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  الإعدادات المتقدمة
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="webhook_url"
                      className="text-sm font-medium"
                    >
                      رابط الويب هوك
                    </Label>
                    <Input
                      id="webhook_url"
                      placeholder="https://example.com/webhook"
                      value={newNumber.webhook_url}
                      onChange={(e) =>
                        setNewNumber({
                          ...newNumber,
                          webhook_url: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="template_namespace"
                      className="text-sm font-medium"
                    >
                      مساحة قوالب الرسائل
                    </Label>
                    <Input
                      id="template_namespace"
                      placeholder="test_templates"
                      value={newNumber.template_namespace}
                      onChange={(e) =>
                        setNewNumber({
                          ...newNumber,
                          template_namespace: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  تأكد من صحة جميع البيانات قبل إنشاء القناة. ستتم إضافة القناة
                  الجديدة إلى قائمة قنوات الواتساب.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                onClick={handleAddNumber}
                disabled={
                  !newNumber.name ||
                  !newNumber.number ||
                  !newNumber.business_id ||
                  !newNumber.phone_id ||
                  !newNumber.access_token ||
                  isConnecting
                }
                className="w-full sm:w-auto sm:flex-1 order-2 sm:order-1"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء قناة جديدة
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State - Skeleton */}
      {marketingChannels.loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skeleton Card 1 */}
          <Card className="relative animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-center space-y-1">
                  <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>

          {/* Skeleton Card 2 */}
          <Card className="relative animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-center space-y-1">
                  <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {marketingChannels.error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>خطأ:</strong> {marketingChannels.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Numbers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {numbers.map((number) => (
          <Card key={number.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <WhatsappIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{number.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {number.number}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={getStatusColor(
                      number.is_connected,
                      number.is_verified,
                    )}
                  >
                    {getStatusIcon(number.is_connected, number.is_verified)}
                    <span className="mr-1">
                      {getStatusText(number.is_connected, number.is_verified)}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status Details */}
              <div className="space-y-4">
                {/* Status Management */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      إدارة الحالة
                    </p>
                    <p className="text-xs text-gray-500">
                      تغيير حالة الاتصال والتحقق
                    </p>
                  </div>
                  <Button
                    onClick={() => openStatusDialog(number)}
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    تغيير الحالة
                  </Button>
                </div>

                {/* Date Info */}
                <div className="text-sm">
                  <span className="text-muted-foreground">تاريخ الإضافة:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {new Date(number.created_at).toLocaleDateString("ar-US")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-semibold">
                      {number.sent_messages_count}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    رسائل مُرسلة
                  </span>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">
                      {number.received_messages_count}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    رسائل مُستقبلة
                  </span>
                </div>
              </div>

              {/* Meta API Details */}
              {number.business_id && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Business Account ID: {number.business_id}</div>
                  {number.phone_id && (
                    <div>Phone Number ID: {number.phone_id}</div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => openEditDialog(number)}
                >
                  <Edit className="h-3 w-3 ml-1" />
                  الاعدادات
                </Button>
                {/* <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Activity className="h-3 w-3 ml-1" />
                  الإحصائيات
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveNumber(number.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!marketingChannels.loading && numbers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <WhatsappIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أرقام واتساب</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة رقم واتساب الأول لبدء إرسال الرسائل
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة رقم واتساب
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>ملاحظة:</strong> يتطلب ربط أرقام الواتساب حساب Meta Business
          وموافقة على شروط استخدام WhatsApp Business API. تأكد من أن رقمك مُحقق
          ومُعتمد من Meta قبل البدء في إرسال الرسائل.
        </AlertDescription>
      </Alert>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent
          className="max-w-md bg-white border-0 shadow-2xl"
          dir="rtl"
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              تغيير حالة الرقم
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {selectedChannel?.name} - {selectedChannel?.number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Connection Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    حالة الاتصال
                  </h4>
                  <p className="text-xs text-gray-500">
                    تحديد ما إذا كان الرقم متصل أم لا
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tempStatus.is_connected}
                    onChange={(e) =>
                      setTempStatus((prev) => ({
                        ...prev,
                        is_connected: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {tempStatus.is_connected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>متصل</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>غير متصل</span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Verification Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    حالة التحقق
                  </h4>
                  <p className="text-xs text-gray-500">
                    تحديد ما إذا كان الرقم مُحقق أم لا
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tempStatus.is_verified}
                    onChange={(e) =>
                      setTempStatus((prev) => ({
                        ...prev,
                        is_verified: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {tempStatus.is_verified ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>مُحقق</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>غير مُحقق</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              onClick={handleCancelStatus}
              variant="outline"
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveStatus}
              disabled={isSavingStatus}
              className="flex-1 bg-black text-white hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSavingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Integration Settings Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="max-w-2xl bg-white border-0 shadow-2xl"
          dir="rtl"
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              تعديل إعدادات التكامل
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {editingChannel?.name} - {editingChannel?.number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* CRM Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    تكامل CRM
                  </h4>
                  <p className="text-xs text-gray-500">
                    تفعيل تكامل نظام إدارة العملاء
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editFormData.crm_integration_enabled}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        crm_integration_enabled: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>

            {/* Appointment System Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    تكامل نظام المواعيد
                  </h4>
                  <p className="text-xs text-gray-500">
                    تفعيل تكامل نظام إدارة المواعيد
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={
                      editFormData.appointment_system_integration_enabled
                    }
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        appointment_system_integration_enabled:
                          e.target.checked,
                      }))
                    }
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>

            {/* Customer Management Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    التكامل مع إدارة العملاء
                  </h4>
                  <p className="text-xs text-gray-500">
                    تفعيل تكامل نظام إدارة العملاء والخدمات
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editFormData.customers_page_integration_enabled}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        customers_page_integration_enabled: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>

            {/* Rental Page Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    التكامل مع صفحة الإيجار
                  </h4>
                  <p className="text-xs text-gray-500">
                    تفعيل تكامل نظام إدارة العقارات للإيجار
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editFormData.rental_page_integration_enabled}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        rental_page_integration_enabled: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
              className="flex-1 bg-black text-white hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSavingEdit ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
