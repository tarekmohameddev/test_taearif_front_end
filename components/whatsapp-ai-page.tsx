"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Check,
  Phone,
  MessageCircle,
  Settings,
  Shield,
  Zap,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function WhatsappAiPage() {
  // Set default to 'support' and 'official'
  const [activeTab, setActiveTab] = useState("whatsapp-ai");
  const [linkingMethod, setLinkingMethod] = useState<
    "support" | "automatic" | ""
  >("support");
  const [apiMethod, setApiMethod] = useState<"official" | "unofficial" | "">(
    "official",
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | ""
  >("");
  const [isPending, setIsPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(
    "طلب الربط قيد الانتظار",
  );

  useEffect(() => {
    // Check for pending request on mount
    axiosInstance
      .get("/whatsapp")
      .then((res) => {
        const data = res.data;
        if (data && data.status === "pending") {
          setIsPending(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSupportRequest = async () => {
    if (!phoneNumber) {
      setSubmissionStatus("error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/whatsapp/link", {
        phoneNumber,
        linkingMethod,
        apiMethod,
        supportMessage,
      });
      const data = res.data;
      if (data && data.success) {
        setIsPending(true);
        setPendingMessage("تم تسجيل الطلب وجاري العمل عليه");
        setSubmissionStatus("");
        setIsSubmitting(false);
        setPhoneNumber("");
        setSupportMessage("");
      } else {
        setSubmissionStatus("error");
        setIsSubmitting(false);
      }
    } catch {
      setSubmissionStatus("error");
      setIsSubmitting(false);
    }
  };

  const handleAutomaticLinking = async () => {
    if (!phoneNumber || !apiMethod) {
      setSubmissionStatus("error");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSubmissionStatus("success");
      setIsSubmitting(false);
      // Reset form
      setPhoneNumber("");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-3 md:p-4 lg:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                ربط رقم الواتساب
              </h1>
              <p className="text-muted-foreground">
                اربط رقم الواتساب الخاص بك للحصول على الدعم أو للربط التلقائي مع
                النظام
              </p>
            </div>

            {submissionStatus === "success" && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {linkingMethod === "support"
                    ? "تم إرسال طلب الدعم بنجاح. سيتواصل معك أحد ممثلي خدمة العملاء قريباً."
                    : "تم ربط رقم الواتساب بنجاح. يمكنك الآن استخدام الخدمات المتاحة."}
                </AlertDescription>
              </Alert>
            )}

            {submissionStatus === "error" && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="link-phone">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link-phone">ربط الرقم</TabsTrigger>
                <TabsTrigger value="features">المميزات</TabsTrigger>
                <TabsTrigger value="help">المساعدة</TabsTrigger>
              </TabsList>

              <TabsContent value="link-phone" className="space-y-6 mt-6">
                {/* Enhanced Progress Indicator - Mobile Responsive */}
                {isPending ? (
                  <div className="min-h-screen  flex items-center justify-center p-4">
                    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 backdrop-blur-xl">
                      <CardContent className="p-8 text-center">
                        {/* الأيقونة المتحركة */}
                        <div className="relative mb-6">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <Clock className="w-8 h-8 text-white" />
                          </div>
                          {/* الدوائر المتحركة */}
                          <div className="absolute inset-0 w-20 h-20 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping"></div>
                            <div className="absolute inset-2 rounded-full border-2 border-orange-300 animate-pulse"></div>
                          </div>
                        </div>

                        {/* النص الرئيسي */}
                        <h2
                          className="text-2xl font-bold text-gray-800 mb-3"
                          dir="rtl"
                        >
                          طلب الربط قيد الانتظار
                        </h2>

                        {/* النص الفرعي */}
                        <p
                          className="text-gray-600 mb-4 leading-relaxed"
                          dir="rtl"
                        >
                          تم إرسال طلبك بنجاح وهو الآن في انتظار المراجعة
                          والموافقة
                        </p>

                        {/* معلومات المدة الزمنية */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-center mb-2">
                            <AlertCircle className="w-5 h-5 text-amber-600 ml-2" />
                            <span
                              className="text-amber-800 font-semibold"
                              dir="rtl"
                            >
                              المدة المتوقعة
                            </span>
                          </div>
                          <p className="text-amber-700 text-sm" dir="rtl">
                            سيتم الرد على طلبك خلال 24 ساعة من تاريخ الإرسال
                          </p>
                        </div>

                        {/* معلومات إضافية */}
                        <div className="text-right mb-6" dir="rtl">
                          <h3 className="font-semibold text-gray-700 mb-2">
                            ما يحدث الآن:
                          </h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• تم استلام طلبك</li>
                            <li>• جاري مراجعة البيانات</li>
                            <li>• في انتظار الموافقة النهائية</li>
                          </ul>
                        </div>

                        {/* مؤشر الحالة */}
                        <div
                          className="flex justify-center items-center space-x-2 mb-4"
                          dir="rtl"
                        >
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-500 mr-3">
                            مرحلة المراجعة
                          </span>
                        </div>

                        {/* رسالة إضافية */}
                        <p
                          className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg"
                          dir="rtl"
                        >
                          💡 ستصلك رسالة تأكيد عبر البريد الإلكتروني فور
                          الموافقة على الطلب
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center text-lg md:text-xl">
                          <div className="bg-primary/10 rounded-full p-2 mb-2 sm:mb-0 sm:ml-3 w-fit">
                            <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </div>
                          اختر طريقة الربط المناسبة لك
                        </CardTitle>
                        <CardDescription>
                          حدد الطريقة التي تفضلها لربط رقم الواتساب مع النظام
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* اختيار طريقة الربط - Mobile Responsive */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                          {/* Support Request Card */}
                          <div
                            className={`relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                              linkingMethod === "support"
                                ? "ring-2 ring-primary shadow-lg bg-gradient-to-br from-blue-50 to-primary/10"
                                : "hover:shadow-md hover:bg-gray-50/80"
                            }`}
                            // Only allow selecting 'support'
                            onClick={() => setLinkingMethod("support")}
                          >
                            <Card className="border-0 shadow-none bg-transparent">
                              <CardContent className="p-4 md:p-6">
                                <div className="flex items-start space-x-3 md:space-x-4 space-x-reverse">
                                  <div
                                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all duration-200 ${
                                      linkingMethod === "support"
                                        ? "border-primary bg-primary"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {linkingMethod === "support" && (
                                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                                      <div
                                        className={`p-2 rounded-lg mb-2 sm:mb-0 sm:ml-3 transition-all duration-200 w-fit ${
                                          linkingMethod === "support"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        <Users className="h-5 w-5 md:h-6 md:w-6" />
                                      </div>
                                      <div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                          طلب دعم شخصي
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-500">
                                          الحل الأمثل للمساعدة المخصصة
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
                                      احصل على مساعدة مخصصة من فريق الخبراء
                                      المتخصصين في إعداد وربط أرقام الواتساب مع
                                      ضمان الإعداد الصحيح
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                                      >
                                        <Users className="h-3 w-3 ml-1" />
                                        دعم شخصي
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-orange-100 text-orange-700 border-orange-200 text-xs"
                                      >
                                        <Clock className="h-3 w-3 ml-1" />
                                        24-48 ساعة
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-700 border-green-200 text-xs"
                                      >
                                        <Shield className="h-3 w-3 ml-1" />
                                        إعداد آمن
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          {/* Hide Automatic Linking Card */}
                        </div>

                        {/* API Method Selection */}
                        {linkingMethod && (
                          <div className="space-y-4 pt-6 border-t animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                              <div className="bg-primary/10 rounded-full p-2 mb-2 sm:mb-0 sm:ml-3 w-fit">
                                <Settings className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-base md:text-lg font-semibold">
                                  اختر طريقة التكامل
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                  حدد نوع API المفضل للتكامل مع واتساب
                                </p>
                              </div>
                            </div>

                            {/* اختيار نوع التكامل - Mobile Responsive */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                              {/* Official API Card */}
                              <div
                                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                  apiMethod === "official"
                                    ? "ring-2 ring-green-500 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50"
                                    : "hover:shadow-md hover:bg-gray-50/80"
                                }`}
                                // Only allow selecting 'official'
                                onClick={() => setApiMethod("official")}
                              >
                                <Card className="border-0 shadow-none bg-transparent">
                                  <CardContent className="p-4 md:p-6">
                                    <div className="flex items-start space-x-3 md:space-x-4 space-x-reverse">
                                      <div
                                        className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all duration-200 ${
                                          apiMethod === "official"
                                            ? "border-green-500 bg-green-500"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {apiMethod === "official" && (
                                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                          <div className="flex items-center mb-2 sm:mb-0">
                                            <div
                                              className={`p-2 rounded-lg ml-3 transition-all duration-200 ${
                                                apiMethod === "official"
                                                  ? "bg-green-100 text-green-600"
                                                  : "bg-gray-100 text-gray-600"
                                              }`}
                                            >
                                              <Shield className="h-5 w-5 md:h-6 md:w-6" />
                                            </div>
                                            <div>
                                              <h3 className="text-base md:text-lg font-bold text-gray-900">
                                                واتساب API الرسمي
                                              </h3>
                                              <p className="text-xs md:text-sm text-gray-500">
                                                معتمد من واتساب
                                              </p>
                                            </div>
                                          </div>
                                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs w-fit">
                                            موصى به
                                          </Badge>
                                        </div>
                                        <p className="text-sm md:text-base text-gray-600 mb-3 leading-relaxed">
                                          الحل الرسمي المعتمد من واتساب مع أعلى
                                          مستويات الأمان والاستقرار
                                        </p>
                                        <div className="flex items-center text-xs md:text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                          <Check className="h-3 w-3 md:h-4 md:w-4 ml-2 flex-shrink-0" />
                                          <span>
                                            أمان عالي • استقرار • دعم رسمي •
                                            ضمان الجودة
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                              {/* Hide Unofficial API Card */}
                            </div>
                          </div>
                        )}

                        {/* Form Fields */}
                        {linkingMethod && apiMethod && (
                          <div className="space-y-6 pt-6 border-t animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center mb-4">
                              <div className="bg-primary/10 rounded-full p-2 ml-3">
                                <MessageCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">
                                  أدخل بيانات الاتصال
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  املأ البيانات المطلوبة لإكمال عملية الربط
                                </p>
                              </div>
                            </div>

                            {linkingMethod === "support" && (
                              <div className="space-y-4">
                                <div>
                                  <Label
                                    htmlFor="phone-support"
                                    className="text-base font-medium"
                                  >
                                    رقم الواتساب *
                                  </Label>
                                  <div className="flex mt-2">
                                    <Input
                                      id="phone-support"
                                      placeholder="5XXXXXXXX"
                                      value={phoneNumber}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(
                                          /\D/g,
                                          "",
                                        );
                                        if (value.length <= 9) {
                                          setPhoneNumber(value);
                                          if (submissionStatus === "error")
                                            setSubmissionStatus("");
                                        }
                                      }}
                                      className={`flex-1 ${phoneNumber.length === 9 ? "border-green-500" : ""}`}
                                      maxLength={9}
                                    />
                                    <div className="flex items-center px-3 border border-r-0 rounded-r-md bg-muted text-sm font-medium">
                                      +966
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-muted-foreground">
                                      أدخل رقم الواتساب بدون الرمز الدولي
                                    </p>
                                    {phoneNumber && (
                                      <span className="text-xs text-muted-foreground">
                                        {phoneNumber.length}/9
                                      </span>
                                    )}
                                  </div>
                                  {phoneNumber.length === 9 && (
                                    <div className="flex items-center mt-1 text-sm text-green-600">
                                      <Check className="h-4 w-4 ml-1" />
                                      رقم صحيح
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <Label
                                    htmlFor="support-message"
                                    className="text-base font-medium"
                                  >
                                    رسالة إضافية (اختياري)
                                  </Label>
                                  <Textarea
                                    id="support-message"
                                    placeholder="أخبرنا عن احتياجاتك أو أي متطلبات خاصة..."
                                    rows={4}
                                    value={supportMessage}
                                    onChange={(e) =>
                                      setSupportMessage(e.target.value)
                                    }
                                    className="mt-2"
                                  />
                                  <p className="text-sm text-muted-foreground mt-1">
                                    ساعدنا في فهم احتياجاتك بشكل أفضل
                                  </p>
                                </div>
                              </div>
                            )}

                            {linkingMethod === "automatic" && (
                              <div className="space-y-4">
                                <div>
                                  <Label
                                    htmlFor="phone-auto"
                                    className="text-base font-medium"
                                  >
                                    رقم الواتساب *
                                  </Label>
                                  <div className="flex mt-2">
                                    <Input
                                      id="phone-auto"
                                      placeholder="5XXXXXXXX"
                                      value={phoneNumber}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(
                                          /\D/g,
                                          "",
                                        );
                                        if (value.length <= 9) {
                                          setPhoneNumber(value);
                                          if (submissionStatus === "error")
                                            setSubmissionStatus("");
                                        }
                                      }}
                                      className={`flex-1 ${phoneNumber.length === 9 ? "border-green-500" : ""}`}
                                      maxLength={9}
                                    />
                                    <div className="flex items-center px-3 border border-r-0 rounded-r-md bg-muted text-sm font-medium">
                                      +966
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-muted-foreground">
                                      أدخل رقم الواتساب بدون الرمز الدولي
                                    </p>
                                    {phoneNumber && (
                                      <span className="text-xs text-muted-foreground">
                                        {phoneNumber.length}/9
                                      </span>
                                    )}
                                  </div>
                                  {phoneNumber.length === 9 && (
                                    <div className="flex items-center mt-1 text-sm text-green-600">
                                      <Check className="h-4 w-4 ml-1" />
                                      رقم صحيح
                                    </div>
                                  )}
                                </div>

                                <Alert className="bg-blue-50 border-blue-200">
                                  <MessageCircle className="h-4 w-4 text-blue-600" />
                                  <AlertDescription className="text-blue-800">
                                    <strong>خطوات الربط التلقائي:</strong>
                                    <div className="mt-2 space-y-1">
                                      <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ml-2">
                                          1
                                        </div>
                                        أدخل رقم الواتساب واختر طريقة التكامل
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ml-2">
                                          2
                                        </div>
                                        اضغط على "ربط الرقم" وانتظر رسالة التحقق
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ml-2">
                                          3
                                        </div>
                                        ستصلك رسالة تحتوي على رمز التحقق
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ml-2">
                                          4
                                        </div>
                                        أدخل الرمز لإكمال عملية الربط
                                      </div>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}

                            {/* Summary Section */}
                            {phoneNumber &&
                              (linkingMethod === "support"
                                ? customerName
                                : true) && (
                                <div className="bg-gray-50 rounded-lg p-4 animate-in slide-in-from-bottom-4 duration-300">
                                  <h4 className="font-semibold mb-3 flex items-center">
                                    <Check className="h-5 w-5 text-green-600 ml-2" />
                                    ملخص الطلب
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        طريقة الربط:
                                      </span>
                                      <span className="font-medium">
                                        {linkingMethod === "support"
                                          ? "طلب دعم شخصي"
                                          : "الربط التلقائي"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        نوع التكامل:
                                      </span>
                                      <span className="font-medium">
                                        {apiMethod === "official"
                                          ? "API الرسمي"
                                          : "API غير رسمي"}
                                      </span>
                                    </div>
                                    {linkingMethod === "support" && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          الاسم:
                                        </span>
                                        <span className="font-medium">
                                          {customerName}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        رقم الواتساب:
                                      </span>
                                      <span className="font-medium">
                                        +966 {phoneNumber}
                                      </span>
                                    </div>
                                    {linkingMethod === "support" &&
                                      supportMessage && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            رسالة إضافية:
                                          </span>
                                          <span className="font-medium">
                                            تم إضافة رسالة
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-gray-50">
                        {linkingMethod === "support" && phoneNumber && (
                          <Button
                            onClick={handleSupportRequest}
                            disabled={isSubmitting}
                            className="w-full h-12 text-base"
                            size="lg"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                                جاري إرسال الطلب...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                إرسال طلب الدعم
                                <ArrowRight className="h-5 w-5 mr-2" />
                              </div>
                            )}
                          </Button>
                        )}
                        {linkingMethod === "automatic" &&
                          phoneNumber &&
                          apiMethod && (
                            <Button
                              onClick={handleAutomaticLinking}
                              disabled={isSubmitting}
                              className="w-full h-12 text-base"
                              size="lg"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                                  جاري الربط...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  ربط الرقم تلقائياً
                                  <ArrowRight className="h-5 w-5 mr-2" />
                                </div>
                              )}
                            </Button>
                          )}
                        {(!linkingMethod ||
                          !phoneNumber ||
                          (linkingMethod === "support" && !customerName) ||
                          !apiMethod) && (
                          <Button
                            disabled
                            className="w-full h-12 text-base"
                            size="lg"
                          >
                            يرجى إكمال جميع الخطوات المطلوبة
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Phone className="h-5 w-5 ml-2 text-primary" />
                        طلب الدعم
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          دعم شخصي من خبراء متخصصين
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          إعداد مخصص حسب احتياجاتك
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          متابعة مستمرة بعد الإعداد
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          حل المشاكل التقنية
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 ml-2 text-primary" />
                        الربط التلقائي
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          ربط فوري بدون انتظار
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          واجهة سهلة الاستخدام
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          تشفير آمن للبيانات
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          متاح 24/7
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 ml-2 text-green-600" />
                        API الرسمي
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          معتمد من واتساب
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          أمان وخصوصية عالية
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          استقرار في الأداء
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                          دعم تقني مستمر
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="help" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>الأسئلة الشائعة</CardTitle>
                    <CardDescription>
                      إجابات على الأسئلة الأكثر شيوعاً حول ربط واتساب
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">
                          هل API الرسمي أفضل من غير الرسمي؟
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          API الرسمي أكثر أماناً واستقراراً ومعتمد من واتساب،
                          بينما API غير الرسمي يوفر مرونة أكبر وتكلفة أقل.
                        </p>
                      </div>
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">
                          كم يستغرق ربط الرقم؟
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          الربط التلقائي يتم فوراً، بينما طلب الدعم قد يستغرق
                          24-48 ساعة حسب حجم الطلبات.
                        </p>
                      </div>
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">
                          هل يمكنني تغيير طريقة التكامل لاحقاً؟
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          نعم، يمكنك تغيير طريقة التكامل في أي وقت من خلال
                          إعدادات الحساب أو بطلب دعم جديد.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">هل بياناتي آمنة؟</h3>
                        <p className="text-sm text-muted-foreground">
                          نعم، نحن نستخدم أحدث تقنيات التشفير لحماية بياناتك ولا
                          نشارك معلوماتك مع أطراف ثالثة.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>تحتاج مساعدة إضافية؟</CardTitle>
                    <CardDescription>
                      تواصل مع فريق الدعم للحصول على مساعدة مخصصة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto p-4 bg-transparent"
                      >
                        <div className="text-center">
                          <MessageCircle className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">دردشة مباشرة</div>
                          <div className="text-xs text-muted-foreground">
                            متاح 24/7
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto p-4 bg-transparent"
                      >
                        <div className="text-center">
                          <Phone className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">اتصال هاتفي</div>
                          <div className="text-xs text-muted-foreground">
                            9 صباحاً - 6 مساءً
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
    </div>
  );
}
