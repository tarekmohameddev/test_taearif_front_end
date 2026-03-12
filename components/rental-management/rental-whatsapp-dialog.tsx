"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Building2,
} from "lucide-react";
import useMarketingStore from "@/context/marketingStore";
import axiosInstance from "@/lib/axiosInstance";

interface RentalWhatsAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rental?: {
    id: number;
    tenant_full_name: string;
    tenant_phone: string;
    tenant_email: string;
    property_name: string;
    base_rent_amount: number;
  };
}

interface WhatsAppChannel {
  id: number;
  name: string;
  number: string;
  is_verified: boolean;
  is_connected: boolean;
}

export function RentalWhatsAppDialog({
  isOpen,
  onClose,
  rental,
}: RentalWhatsAppDialogProps) {
  const { marketingChannels, fetchMarketingChannels } = useMarketingStore();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Cleanup effect to fix pointer-events issue
  useEffect(() => {
    if (!isOpen) {
      // Fix pointer-events issue by removing the style attribute
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);
    }
  }, [isOpen]);

  // جلب قنوات التسويق عند فتح الـ dialog
  useEffect(() => {
    if (isOpen) {
      fetchMarketingChannels();
    }
  }, [isOpen, fetchMarketingChannels]);

  // تصفية قنوات الواتساب الصالحة فقط
  const validWhatsAppChannels = marketingChannels.channels.filter(
    (channel: any) =>
      channel.type === "whatsapp" &&
      channel.is_verified === true &&
      channel.is_connected === true,
  );

  const handleSend = async () => {
    if (!selectedChannel || !message.trim()) {
      setErrorMessage("يرجى اختيار قناة واتساب وكتابة محتوى الرسالة");
      setSendStatus("error");
      return;
    }

    setIsSending(true);
    setSendStatus("idle");
    setErrorMessage("");

    try {
      // إرسال API request باستخدام axiosInstance
      const response = await axiosInstance.post(
        "/v1/marketing/channels/send-whatsapp-to-customer",
        {
          customer_id: null, // لا يوجد customer_id في rental management
          message: message.trim(),
          channel_id: parseInt(selectedChannel),
          rental_id: rental?.id || null,
        },
      );

      setSendStatus("success");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      setSendStatus("error");
      setErrorMessage("حدث خطأ أثناء إرسال الرسالة");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = useCallback(() => {
    console.log("handleClose called");
    setSelectedChannel("");
    setMessage("");
    setSendStatus("idle");
    setErrorMessage("");
    onClose();
  }, [onClose]);

  const isFormValid = selectedChannel && message.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl"
        dir="rtl"
        style={{
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <DialogHeader className="space-y-3 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  إرسال رسالة واتساب للمستأجر
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  إرسال رسالة واتساب للمستأجر
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Rental Info Card */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Tenant Info */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {rental?.tenant_full_name || "المستأجر"}
                    </div>
                    <div className="text-xs text-gray-500">
                      رقم الهاتف: {rental?.tenant_phone || "غير محدد"}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-white text-gray-700 border-gray-300"
                  >
                    المستأجر
                  </Badge>
                </div>

                {/* Property Info */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {rental?.property_name || "العقار"}
                    </div>
                    <div className="text-xs text-gray-500">
                      المبلغ:{" "}
                      {rental?.base_rent_amount
                        ? `${rental.base_rent_amount} ريال`
                        : "غير محدد"}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-white text-gray-700 border-gray-300"
                  >
                    العقار
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Selection */}
          <div className="space-y-3">
            <Label
              htmlFor="channel"
              className="text-sm font-semibold text-gray-900"
            >
              اختيار قناة الواتساب *
            </Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-full bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                <SelectValue placeholder="اختر قناة الواتساب للإرسال" />
              </SelectTrigger>
              <SelectContent>
                {validWhatsAppChannels.length > 0 ? (
                  validWhatsAppChannels.map((channel: WhatsAppChannel) => (
                    <SelectItem key={channel.id} value={channel.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{channel.name}</span>
                        <span className="text-gray-500 text-xs">
                          ({channel.number})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-channels" disabled>
                    لا توجد قنوات واتساب متاحة
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {validWhatsAppChannels.length === 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  لا توجد قنوات واتساب متاحة. يرجى إضافة قناة واتساب أولاً.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <Label
              htmlFor="message"
              className="text-sm font-semibold text-gray-900"
            >
              محتوى الرسالة *
            </Label>
            <Textarea
              id="message"
              placeholder="اكتب محتوى الرسالة هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500 resize-none"
              dir="rtl"
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>عدد الأحرف: {message.length}</span>
              <span>الحد الأقصى: 1000 حرف</span>
            </div>
          </div>

          {/* Error Message */}
          {sendStatus === "error" && errorMessage && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {sendStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                تم إرسال الرسالة بنجاح!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            disabled={isSending}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              !isFormValid || isSending || validWhatsAppChannels.length === 0
            }
            className="flex-1 bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 ml-2" />
                إرسال الرسالة
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
