"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ExternalLink,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Clock,
  Filter,
  CreditCardIcon,
  Check,
  Star,
  Download,
  PaintBucket,
  Sparkles,
  Zap,
  Calendar,
  CalendarDays,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCenter } from "@/components/help-center";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import axiosInstance from "@/lib/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/context/AuthContext";
import PaymentPopup from "@/components/popup/Popup";
import { ThemeSection } from "@/components/settings/themes/ThemeSection";

const domainsHelp = {
  title: "إدارة النطاقات",
  description: "تعرف على كيفية ربط وإدارة النطاقات المخصصة لموقعك.",
  links: [
    { title: "كيفية ربط نطاق مخصص", href: "#", type: "article" },
    { title: "فهم إعدادات DNS", href: "#", type: "video" },
    { title: "استكشاف مشكلات النطاق وإصلاحها", href: "#", type: "article" },
  ],
};

export function SettingsPage() {
  const { clickedOnSubButton, userData, IsLoading: authLoading } = useAuthStore();
  const searchParams = useSearchParams();
  
  // Initialize activeTab from URL params or clickedOnSubButton
  const tabFromUrl = searchParams.get("tab");
  const initialTab = tabFromUrl || `${clickedOnSubButton}`;
  const themeIdFromUrl = searchParams.get("themeId");
  
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [setupProgress, setSetupProgress] = useState(40);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [domains, setDomains] = useState<any[]>([]);
  const [dnsInstructions, setDnsInstructions] = useState<any>([]);
  const [verifyingDomains, setVerifyingDomains] = useState<any>({});
  const [deleteDomainId, setDeleteDomainId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasFormatError, setHasFormatError] = useState(false);
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [subscriptionPlans, setSubscriptionPlans] = useState<any>({});
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [allFeatures, setAllFeatures] = useState<string[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "yearly", // Default to yearly
  );
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedMonths, setSelectedMonths] = useState([1]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const fetchSubscriptionPlans = async () => {
      try {
        const response = await axiosInstance.get("/settings/payment");
        setSubscriptionPlans(response.data.plans);

        // جمع جميع الميزات الفريدة من جميع الخطط
        const featuresSet = new Set();
        const allPlans = [
          ...(response.data.plans.plans_monthly || []),
          ...(response.data.plans.plans_yearly || []),
        ];
        allPlans.forEach((plan: any) => {
          if (plan.features && typeof plan.features === "object") {
            Object.values(plan.features)
              .flat()
              .forEach((feature: any) => featuresSet.add(feature));
          }
        });
        setAllFeatures(Array.from(featuresSet) as string[]);
      } catch (error: any) {
        console.error("Error fetching subscription plans:", error);
        toast.error("فشل في تحميل خطط الاشتراك");
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchSubscriptionPlans();
  }, [userData?.token, authLoading]);

  const handleUpgradeClick = (plan: any) => {
    setSelectedPlan(plan);
    // إذا كانت الخطة سنوية، ابدأ من 1 سنة، وإلا ابدأ من 1 شهر
    setSelectedMonths([1]);
    setIsUpgradeDialogOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    setIsProcessingPayment(true);
    try {
      const periods = selectedMonths[0];
      const periodPrice = parseFloat(selectedPlan.price);
      // إذا كانت الخطة سنوية، احسب المبلغ بناءً على السنوات
      const totalAmount = isYearlyPlan(selectedPlan)
        ? periodPrice * periods
        : periodPrice * periods;

      const response = await axiosInstance.post("/make-payment", {
        package_id: selectedPlan.id,
        price: totalAmount,
        period: periods,
        total_amount: totalAmount,
      });

      if (response.data.status === "success") {
        setPaymentUrl(response.data.payment_url);
        setIsUpgradeDialogOpen(false);
        setIsPopupOpen(true);
      } else {
        toast.error("فشل في الحصول على رابط الدفع");
      }
    } catch (error: any) {
      console.error("خطأ:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // حساب التوفير في الخطط السنوية
  const calculateSavings = (monthlyPrice: any, yearlyPrice: any) => {
    const monthlyTotal = parseFloat(monthlyPrice) * 12;
    const yearlyTotal = parseFloat(yearlyPrice);
    const savings = monthlyTotal - yearlyTotal;
    const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, savingsPercentage };
  };

  // الحصول على الخطط الحالية حسب الفترة المختارة
  const getCurrentPlans = () => {
    if (billingPeriod === "monthly") {
      return subscriptionPlans.plans_monthly || [];
    } else {
      return subscriptionPlans.plans_yearly || [];
    }
  };

  // تحديد ما إذا كانت الخطة سنوية أم شهرية
  const isYearlyPlan = (plan: any) => {
    return billingPeriod === "yearly" || plan.billing === "سنويًا";
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const fetchData = async () => {
      try {
        setIsLoadingDomains(true);
        const response = await axiosInstance.get("/settings/domain");
        setDomains(response.data.domains);
        setDnsInstructions(response.data.dnsInstructions);
      } catch (error: any) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingDomains(false);
      }
    };
    fetchData();
  }, [userData?.token, authLoading]);


  const handleAddDomain = async () => {
    if (
      newDomain.startsWith("www.") ||
      newDomain.startsWith("http:") ||
      newDomain.startsWith("https:")
    ) {
      toast.error("لا يجب كتابة www أو http:// في بداية النطاق");
      setErrorMessage("تنسيق النطاق غير صالح - أزل www أو http://");
      setHasFormatError(true);
      return;
    }

    if (!newDomain) {
      toast.error("اسم النطاق مطلوب");
      setErrorMessage("اسم النطاق مطلوب");
      return;
    }

    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      toast.error("تنسيق النطاق غير صالح");
      setErrorMessage("تنسيق النطاق غير صالح");
      setHasFormatError(true);
      return;
    }

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const loadingToast = toast.loading("جاري إضافة النطاق...");
    try {
      const response = await axiosInstance.post("/settings/domain", {
        custom_name: newDomain,
      });
      const addedDomain = response.data.data;
      addedDomain.status = "pending";
      setDomains([...domains, addedDomain] as any[]);
      setNewDomain("");
      setIsAddDomainOpen(false);
      setSetupProgress(Math.min(setupProgress + 20, 100));
      toast.dismiss(loadingToast);
      toast.success("تمت إضافة النطاق بنجاح");
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error adding domain:", error);
      toast.dismiss(loadingToast);
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء إضافة النطاق";
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const handleVerifyDomain = async (domainId: any) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    setVerifyingDomains((prev: any) => ({ ...prev, [domainId]: true }));
    const loadingToast = toast.loading("جاري التحقق من النطاق...");
    try {
      const response = await axiosInstance.post("/settings/domain/verify", {
        id: domainId,
      });
      const verifiedDomain = response.data.data;
      setDomains(
        domains.map((domain: any) =>
          domain.id === domainId ? verifiedDomain : domain,
        ) as any[],
      );
      setSetupProgress(Math.min(setupProgress + 20, 100));
      toast.dismiss(loadingToast);
      toast.success("تم التحقق من النطاق بنجاح");
    } catch (error: any) {
      console.error("Error verifying domain:", error);
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ أثناء التحقق من النطاق");
    } finally {
      setVerifyingDomains((prev: any) => ({ ...prev, [domainId]: false }));
    }
  };

  const handleSetPrimaryDomain = async (domainId: any) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const loadingToast = toast.loading("جاري تحديث النطاق الرئيسي...");
    try {
      await axiosInstance.post("/settings/domain/set-primary", {
        id: domainId,
      });
      setDomains(
        domains.map((domain: any) => ({
          ...domain,
          primary: domain.id === domainId,
        })) as any[],
      );
      toast.dismiss(loadingToast);
      toast.success("تم تحديث النطاق الرئيسي بنجاح");
    } catch (error: any) {
      console.error("Error setting primary domain:", error);
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ أثناء تحديث النطاق الرئيسي");
    }
  };

  const handleDeleteDomain = async () => {
    if (!deleteDomainId) return;

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const loadingToast = toast.loading("جاري حذف النطاق...");
    try {
      await axiosInstance.delete(`/settings/domain/${deleteDomainId}`);
      setDomains(
        domains.filter((domain: any) => domain.id !== deleteDomainId) as any[],
      );
      toast.dismiss(loadingToast);
      toast.success("تم حذف النطاق بنجاح");
    } catch (error: any) {
      console.error("Error deleting domain:", error);
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ أثناء حذف النطاق");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDomainId(null);
    }
  };


  const filteredDomains = (domains || []).filter((domain: any) => {
    if (statusFilter !== "all") {
      if (statusFilter === "active" && domain.status !== "active") return false;
      if (statusFilter === "pending" && domain.status !== "pending")
        return false;
    }
    if (searchQuery && !domain.custom_name.includes(searchQuery)) return false;
    return true;
  });

  // تغيير شكل الfeatures عشان تكون بالشكل ده :
  // https://cdn.discordapp.com/attachments/738090102152233011/1362727790184497162/image.png?ex=680372a7&is=68022127&hm=5cc3027b47e87b03fc533b91ec48e0c2ab0a4fbcab0ad265ddc0167af04484df&
  // const renderFeatures = (plan) => {
  //   const availableFeatures = allFeatures.filter(feature => plan.features.includes(feature));
  //   const limitations = allFeatures.filter(feature => !plan.features.includes(feature));

  //   const allItems = [
  //     ...availableFeatures.map(feature => ({ feature, available: true })),
  //     ...limitations.map(feature => ({ feature, available: false }))
  //   ];

  //   const featureElements = allItems.map(({ feature, available }) => (
  //     <li key={feature} className="flex items-center gap-2">
  //       {available ? (
  //         <Check className="h-4 w-4 text-green-600" />
  //       ) : (
  //         <AlertCircle className="h-4 w-4 text-gray-400" />
  //       )}
  //       <span className={`text-sm ${available ? '' : 'text-gray-400'}`}>{feature}</span>
  //     </li>
  //   ));

  //   if (allItems.length > 13) {
  //     const firstColumn = featureElements.slice(0, 13);
  //     const secondColumn = featureElements.slice(13);
  //     return (
  //       <div className="flex gap-4">
  //         <ul className="space-y-2 flex-1">{firstColumn}</ul>
  //         <ul className="space-y-2 flex-1">{secondColumn}</ul>
  //       </div>
  //     );
  //   } else {
  //     return <ul className="space-y-2">{featureElements}</ul>;
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">الإعدادات</h1>
                <p className="text-muted-foreground">
                  إدارة إعدادات حسابك وتفضيلات موقعك
                </p>
              </div>
            </div>

            <Tabs
              defaultValue="domains"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger
                  value="domains"
                  className="flex gap-1 items-center"
                >
                  <Globe className="h-4 w-4" />
                  <span>النطاقات</span>
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="flex gap-1 items-center"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  <span>الاشتراك</span>
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex gap-1 items-center">
                  <Palette className="h-4 w-4" />
                  <span>الثيمات</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="domains" className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">إدارة النطاقات</h2>
                    <p className="text-muted-foreground ">
                      ربط وإدارة النطاقات المخصصة لموقعك
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* <div className="relative">
                      <Input
                        placeholder="بحث في النطاقات..."
                        className="w-[200px] pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <SearchIcon className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div> */}

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="تصفية حسب الحالة" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع النطاقات</SelectItem>
                        <SelectItem value="active">النطاقات النشطة</SelectItem>
                        <SelectItem value="pending">
                          النطاقات المعلقة
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={isAddDomainOpen}
                      onOpenChange={setIsAddDomainOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 ml-1" />
                          إضافة نطاق
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>إضافة نطاق مخصص</DialogTitle>
                          <DialogDescription>
                            ربط نطاقك الخاص بموقعك. ستحتاج إلى تحديث إعدادات DNS
                            الخاصة بك.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="domain-name">اسم النطاق</Label>
                            <Input
                              id="domain-name"
                              placeholder="example.com"
                              value={newDomain}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNewDomain(value);
                                setHasFormatError(false);
                                setErrorMessage("");
                                if (
                                  value.startsWith("www.") ||
                                  value.startsWith("http://") ||
                                  value.startsWith("https://")
                                ) {
                                  setHasFormatError(true);
                                  setErrorMessage("لا تستخدم www أو http://");
                                }
                              }}
                            />
                            <p
                              className={`text-sm ${hasFormatError ? "text-destructive" : "text-muted-foreground"}`}
                            >
                              أدخل نطاقك بدون www أو http://
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddDomainOpen(false)}
                          >
                            إلغاء
                          </Button>
                          <Button onClick={handleAddDomain}>إضافة نطاق</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {isLoadingDomains ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i}>
                        <CardHeader className="flex flex-row items-start justify-between p-6">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <Skeleton className="h-8 w-20" />
                        </CardHeader>
                        <CardContent className="px-6 pb-2">
                          <div className="flex justify-between mb-4">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-2 flex gap-2">
                          <Skeleton className="h-9 w-32" />
                          <Skeleton className="h-9 w-20" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : !filteredDomains || filteredDomains.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      لا توجد نطاقات مطابقة
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      لم يتم العثور على نطاقات تطابق معايير التصفية الحالية
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatusFilter("all");
                        setSearchQuery("");
                      }}
                    >
                      عرض جميع النطاقات
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredDomains.map((domain: any) => (
                      <Card
                        key={domain.id}
                        className={`${domain.status === "pending" ? "border-dashed opacity-80" : ""}`}
                      >
                        <CardHeader className="flex flex-row items-start justify-between p-6">
                          <div className="flex flex-col gap-1">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                              {domain.custom_name}
                              {domain.primary && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-700 border-gray-300 ml-2"
                                >
                                  رئيسي
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {domain.status === "active"
                                ? "نطاق نشط"
                                : "في انتظار التحقق"}
                            </CardDescription>
                          </div>
                          <div>
                            {domain.status === "active" ? (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-700 border-gray-300"
                              >
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  نشط
                                </span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-700 border-gray-300"
                              >
                                <span className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  معلق
                                </span>
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-2">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">SSL:</span>
                              {domain.ssl ? (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-700 border-gray-300"
                                >
                                  <span className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    مفعل
                                  </span>
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-700 border-gray-300"
                                >
                                  غير مفعل
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>تمت الإضافة: {domain.addedDate}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-6 pt-2 flex justify-between">
                          {domain.status === "pending" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleVerifyDomain(domain.id)}
                              disabled={verifyingDomains[domain.id]}
                            >
                              {verifyingDomains[domain.id] ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 ml-1 animate-spin" />
                                  جاري التحقق...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                                  التحقق من النطاق
                                </>
                              )}
                            </Button>
                          ) : !domain.primary ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetPrimaryDomain(domain.id)}
                            >
                              تعيين كنطاق رئيسي
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              النطاق الرئيسي
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeleteDomainId(domain.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={domain.primary}
                          >
                            <Trash2 className="h-3.5 w-3.5 ml-1" />
                            حذف
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      إعدادات Nameservers
                    </CardTitle>
                    <CardDescription>
                      تكوين Nameservers الخاصة بنطاقك لتوجيهها إلى Vercel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="single"
                      defaultValue="item-1"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          كيفية إعداد Nameservers الخاصة بك
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              {dnsInstructions?.description ||
                                "لربط نطاقك، ستحتاج إلى تحديث Nameservers الخاصة بك لدى مسجل النطاق لتوجيهها إلى Vercel."}
                            </p>
                            <div className="rounded-lg border overflow-hidden">
                              <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                                <div className="col-span-2">الرقم</div>
                                <div className="col-span-10">Nameserver</div>
                              </div>
                              <div className="grid grid-cols-12 gap-4 p-3 border-t">
                                <div className="col-span-2 font-medium">1</div>
                                <div className="col-span-10 font-mono text-sm">
                                  ns1.vercel-dns.com
                                </div>
                              </div>
                              <div className="grid grid-cols-12 gap-4 p-3 border-t">
                                <div className="col-span-2 font-medium">2</div>
                                <div className="col-span-10 font-mono text-sm">
                                  ns2.vercel-dns.com
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center p-3 rounded-lg bg-gray-100 text-gray-800">
                              <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                              <p className="text-sm">
                                {dnsInstructions?.note ||
                                  `قد تستغرق تغييرات Nameservers ما يصل إلى 48 ساعة للانتشار عالميًا. هذا يعني أن نطاقك قد لا يعمل مباشرة بعد إجراء هذه التغييرات.`}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="subscription"
                className="space-y-4 pt-4"
                dir="rtl"
              >
                <div className="flex flex-col items-center gap-6 mb-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">إدارة الاشتراك</h2>
                    <p className="text-muted-foreground">
                      عرض وتحديث خطة الاشتراك الخاصة بك
                    </p>
                  </div>

                  {/* Toggle مذهل للتبديل بين الخطط الشهرية والسنوية - مخفي مؤقتاً */}
                  <div className="flex flex-col items-center gap-3 hidden">
                    <div className="relative">
                      <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-300 shadow-lg">
                        <button
                          onClick={() => setBillingPeriod("monthly")}
                          className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out ${
                            billingPeriod === "monthly"
                              ? "text-white shadow-lg"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          {billingPeriod === "monthly" && (
                            <div className="absolute inset-0 bg-gray-800 rounded-xl shadow-lg animate-pulse"></div>
                          )}
                          <div className="relative flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>شهريًا</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setBillingPeriod("yearly")}
                          className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out ${
                            billingPeriod === "yearly"
                              ? "text-white shadow-lg"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          {billingPeriod === "yearly" && (
                            <div className="absolute inset-0 bg-gray-800 rounded-xl shadow-lg animate-pulse"></div>
                          )}
                          <div className="relative flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>سنويًا</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {billingPeriod === "yearly" &&
                      subscriptionPlans.plans_monthly &&
                      subscriptionPlans.plans_yearly && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 px-3 py-2 rounded-lg border border-gray-300">
                          <Sparkles className="h-4 w-4" />
                          <span>
                            وفر{" "}
                            {calculateSavings(
                              subscriptionPlans.plans_monthly[0]?.price || "0",
                              subscriptionPlans.plans_yearly[0]?.price || "0",
                            ).savings.toFixed(0)}{" "}
                            ريال سنويًا
                          </span>
                        </div>
                      )}
                  </div>

                  {/* عرض رسالة التوفير للخطط السنوية */}
                  {billingPeriod === "yearly" &&
                    subscriptionPlans.plans_monthly &&
                    subscriptionPlans.plans_yearly && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 px-3 py-2 rounded-lg border border-gray-300">
                          <Sparkles className="h-4 w-4" />
                          <span>
                            وفر{" "}
                            {calculateSavings(
                              subscriptionPlans.plans_monthly[0]?.price || "0",
                              subscriptionPlans.plans_yearly[0]?.price || "0",
                            ).savings.toFixed(0)}{" "}
                            ريال سنويًا
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {isLoadingPlans ? (
                    [1, 2, 3, 4].map((i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full mt-2" />
                          <Skeleton className="h-4 w-full mt-2" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    ))
                  ) : !getCurrentPlans() || getCurrentPlans().length === 0 ? (
                    <div className="col-span-3 flex flex-col items-center justify-center p-8 text-center">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        لا توجد خطط اشتراك متاحة
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        لم يتم العثور على خطط الاشتراك أو حدث خطأ في التحميل
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="h-4 w-4 ml-1" />
                        إعادة المحاولة
                      </Button>
                    </div>
                  ) : (
                    getCurrentPlans().map((plan: any) => {
                      const isCurrentPlan = plan.cta !== "الترقية";
                      const features =
                        plan.features && typeof plan.features === "object"
                          ? Object.values(plan.features).flat()
                          : [];

                      return (
                        <Card
                          key={plan.id}
                          className={`relative flex flex-col transition-all duration-300 hover:shadow-lg ${
                            isCurrentPlan
                              ? "border-primary border-2 shadow-lg"
                              : ""
                          } ${
                            billingPeriod === "yearly"
                              ? "ring-2 ring-green-100"
                              : ""
                          }`}
                        >
                          {billingPeriod === "yearly" && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span>الأكثر توفيرًا</span>
                                </div>
                              </div>
                            </div>
                          )}

                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                              <span>{plan.name}</span>
                              {billingPeriod === "yearly" && (
                                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                                  <Percent className="h-3 w-3 ml-1" />
                                  توفير
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-end gap-1 mt-2">
                              <div className="flex items-center gap-1">
                                <img
                                  src="/Saudi_Riyal_Symbol.svg"
                                  alt="ريال سعودي"
                                  className="w-5 h-5 filter brightness-0 contrast-100"
                                />
                                <span className="text-2xl font-bold text-foreground">
                                  {plan.price}
                                </span>
                              </div>
                              <span className="text-muted-foreground">
                                / {plan.billing}
                              </span>
                            </CardDescription>

                            {billingPeriod === "yearly" &&
                              subscriptionPlans.plans_monthly && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  <span className="line-through">
                                    {subscriptionPlans.plans_monthly[0]?.price}{" "}
                                    شهريًا
                                  </span>
                                  <span className="text-gray-700 font-medium mr-2">
                                    وفر{" "}
                                    {
                                      calculateSavings(
                                        subscriptionPlans.plans_monthly[0]
                                          ?.price || "0",
                                        plan.price,
                                      ).savingsPercentage
                                    }
                                    %
                                  </span>
                                </div>
                              )}
                          </CardHeader>

                          <CardContent className="pb-4 flex-1">
                            <ul className="space-y-2">
                              {features.map((feature: any, index: any) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-gray-700" />
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-700">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>

                          <CardFooter className="mt-auto">
                            {isCurrentPlan ? (
                              <Button
                                variant="outline"
                                className="w-full"
                                disabled
                              >
                                <Check className="h-4 w-4 ml-1" />
                                {plan.cta || "الخطة الحالية"}
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                className="w-full transition-all duration-300 bg-gray-800 hover:bg-gray-700 text-white"
                                onClick={() => handleUpgradeClick(plan)}
                              >
                                {billingPeriod === "yearly" ? (
                                  <>
                                    <Sparkles className="h-4 w-4 ml-1" />
                                    {plan.cta || "الترقية السنوية"}
                                  </>
                                ) : (
                                  plan.cta || "الترقية"
                                )}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="themes" className="space-y-4 pt-4">
                <ThemeSection initialThemeId={themeIdFromUrl || undefined} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا النطاق؟ لا يمكن التراجع عن هذا
              الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteDomain}>
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isPopupOpen && (
        <PaymentPopup
          paymentUrl={paymentUrl}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      {/* Dialog مذهل للترقية */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent
          className="w-[95vw] max-w-2xl h-[90vh] max-h-[800px] p-0 overflow-hidden overflow-x-hidden flex flex-col"
          dir="rtl"
        >
          <div className="relative flex flex-col h-full" dir="rtl">
            {/* خلفية أبيض وأسود مذهلة */}
            <div className="absolute inset-0 bg-white"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-black to-gray-800"></div>

            {/* تأثيرات بصرية */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-400 rounded-full opacity-20 animate-pulse delay-1000"></div>

            <div
              className="relative p-4 md:p-8 flex-1 overflow-y-auto overflow-x-hidden"
              dir="rtl"
            >
              <DialogHeader
                className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                dir="rtl"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gray-200 rounded-full opacity-30 scale-150 animate-pulse"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>

                <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 text-right mb-2">
                  ترقية خطة الاشتراك
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 text-right">
                  اختر مدة الاشتراك المناسبة لك واستمتع بجميع الميزات المتقدمة
                </DialogDescription>
              </DialogHeader>

              {selectedPlan && (
                <div
                  className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8"
                  dir="rtl"
                >
                  {/* معلومات الخطة */}
                  <div
                    className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-300 shadow-xl"
                    dir="rtl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                        {selectedPlan.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          {isYearlyPlan(selectedPlan) ? "سنة /" : "شهر /"}
                        </span>
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                          {selectedPlan.price}
                        </span>
                        <img
                          src="/Saudi_Riyal_Symbol.svg"
                          alt="ريال سعودي"
                          className="w-6 h-6 filter brightness-0 contrast-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      {selectedPlan.features &&
                        typeof selectedPlan.features === "object" &&
                        Object.values(selectedPlan.features)
                          .flat()
                          .slice(0, 4)
                          .map((feature: any, index: any) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs sm:text-sm text-gray-700">
                                {feature}
                              </span>
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                <Check className="w-3 h-3 text-gray-700" />
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* شريط تحديد المدة */}
                  <div
                    className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-300 shadow-xl"
                    dir="rtl"
                  >
                    <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2">
                        {isYearlyPlan(selectedPlan)
                          ? "مدة الاشتراك السنوي"
                          : "مدة الاشتراك الشهري"}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {isYearlyPlan(selectedPlan)
                          ? "اختر عدد السنوات التي تريد الاشتراك بها"
                          : "اختر عدد الشهور التي تريد الاشتراك بها"}
                      </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                      <div className="px-4">
                        <Slider
                          value={selectedMonths}
                          onValueChange={setSelectedMonths}
                          max={isYearlyPlan(selectedPlan) ? 5 : 24}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs sm:text-sm text-gray-500">
                          {isYearlyPlan(selectedPlan) ? "سنة 5" : "شهر 24"}
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            {selectedMonths[0]}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {isYearlyPlan(selectedPlan)
                              ? selectedMonths[0] === 1
                                ? "سنة"
                                : "سنة"
                              : selectedMonths[0] === 1
                                ? "شهر"
                                : "شهر"}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {isYearlyPlan(selectedPlan) ? "سنة 1" : "شهر 1"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ملخص السعر */}
                  <div
                    className="bg-gray-800 rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 text-white shadow-2xl"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold">
                        المبلغ الإجمالي
                      </h4>
                      <div className="text-left">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                          {(
                            parseFloat(selectedPlan.price) * selectedMonths[0]
                          ).toFixed(2)}
                        </div>
                        <div className="text-gray-300 text-xs sm:text-sm">
                          ريال سعودي
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-xs sm:text-sm">
                        {selectedMonths[0] === 1
                          ? "دفعة واحدة"
                          : `${selectedMonths[0]} دفعة`}
                      </span>
                      <span>
                        {isYearlyPlan(selectedPlan)
                          ? `سنة ${selectedMonths[0]} × ${selectedPlan.price}`
                          : `شهر ${selectedMonths[0]} × ${selectedPlan.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter
                className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 flex flex-col md:flex-row gap-3 sm:gap-4 flex-shrink-0"
                dir="rtl"
              >
                <Button
                  variant="outline"
                  onClick={() => setIsUpgradeDialogOpen(false)}
                  className="flex-1 py-2 md:py-3 text-sm sm:text-base md:text-lg font-semibold"
                  disabled={isProcessingPayment}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleConfirmUpgrade}
                  disabled={isProcessingPayment}
                  className="flex-1 py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <span>جاري المعالجة...</span>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>تأكيد الدفع</span>
                      <CreditCardIcon className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
