"use client";

import {
  Download,
  Filter,
  Grid3X3,
  List,
  Search,
  Star,
  Trash2,
  Link,
  ExternalLink,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import PaymentPopup from "@/components/popup/PopupForPayment";
import { ShoppingCart } from "lucide-react";

interface App {
  id: string | number;
  name: string;
  description: string;
  category: string;
  developer: string;
  rating: number;
  reviews: number;
  price: string;
  icon: string;
  featured: boolean;
  installed: boolean;
  isPixelApp?: boolean;
  path?: string;
  billing_type?: "free" | "paid" | "subscription";
  status?: "installed" | "pending_payment" | "uninstalled";
  installation_id?: number | null;
}

export function AppsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("apps");
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, error } = sidebarData;
  const router = useRouter();
  const hasFetchedRef = useRef(false);

  const categories = [
    "الكل",
    "نماذج",
    "تسويق",
    "اجتماعي",
    "تحليلات",
    "تجارة إلكترونية",
    "اتصالات",
    "قانوني",
    "وسائط",
    "أعمال",
  ];

  const [installedApps, setInstalledApps] = useState<App[]>([]);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<number | null>(null);
  const [currentInstallationId, setCurrentInstallationId] = useState<number | null>(null);

  // Add pixels app to the apps array
  const addPixelsApp = (fetchedApps: App[]): App[] => {
    const pixelsApp: App = {
      id: "pixels-app",
      name: "ربط Pixels",
      description:
        "ربط pixels منصة التواصل الاجتماعي مع موقعك لتتبع الزوار والتحويلات",
      category: "تسويق",
      developer: "نظام الموقع",
      rating: 5,
      reviews: 0,
      price: "مجاني",
      icon: "/placeholder.svg",
      featured: true,
      installed: false,
      isPixelApp: true,
      billing_type: "free",
      status: "uninstalled",
      installation_id: null,
    };

    return [pixelsApp, ...fetchedApps];
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // Prevent multiple fetches
    if (hasFetchedRef.current) {
      return;
    }

    const fetchApps = async () => {
      hasFetchedRef.current = true;
      try {
        setLoading(true);
        const res = await axiosInstance.get("/apps");
        const fetchedApps: App[] = res.data.data.apps.map((app: any) => ({
          ...app,
          icon: app.img || app.icon || "/placeholder.svg",
          path: app.path || undefined,
          billing_type: (app.billing_type || "free") as "free" | "paid" | "subscription",
          status: (app.status || (app.installed ? "installed" : "uninstalled")) as "installed" | "pending_payment" | "uninstalled",
          installation_id: app.installation_id || null,
        }));
        const appsWithPixels = addPixelsApp(fetchedApps);
        setApps(appsWithPixels);

        const installed = appsWithPixels.filter(
          (app) => app.installed === true,
        );
        setInstalledApps(installed);

        toast.success("تم تحميل التطبيقات بنجاح");
      } catch (err) {
        toast.error("فشل في تحميل التطبيقات");
        console.error("Failed to load apps:", err);
        hasFetchedRef.current = false; // Reset on error to allow retry
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [userData?.token, authLoading]);

  const verifyPaymentStatus = async (installationId: number): Promise<boolean> => {
    const maxAttempts = 30;
    const interval = 2000; // 2 seconds

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axiosInstance.get(
          `/api/installations/${installationId}/payment/status`
        );

        if (response.data.status === "completed") {
          return true;
        }

        if (response.data.status === "failed") {
          return false;
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (err: any) {
        console.error("Error checking payment status:", err);
        // Continue polling on error
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }

    return false; // Timeout
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentPopup(false);
    setPaymentUrl("");

    if (currentInstallationId) {
      const loadingToast = toast.loading("جاري التحقق من الدفع...");
      try {
        const verified = await verifyPaymentStatus(currentInstallationId);

        if (verified) {
          // Refresh apps list
          hasFetchedRef.current = false;
          const res = await axiosInstance.get("/apps");
          const fetchedApps: App[] = res.data.data.apps.map((app: any) => ({
            ...app,
            icon: app.img || app.icon || "/placeholder.svg",
            path: app.path || undefined,
            billing_type: (app.billing_type || "free") as "free" | "paid" | "subscription",
            status: (app.status || (app.installed ? "installed" : "uninstalled")) as "installed" | "pending_payment" | "uninstalled",
            installation_id: app.installation_id || null,
          }));
          const appsWithPixels = addPixelsApp(fetchedApps);
          setApps(appsWithPixels);

          const installed = appsWithPixels.filter(
            (app) => app.installed === true || app.status === "installed",
          );
          setInstalledApps(installed);

          fetchSideMenus("apps");
          toast.dismiss(loadingToast);
          toast.success("تم تأكيد الدفع وتثبيت التطبيق بنجاح");
        } else {
          toast.dismiss(loadingToast);
          toast.error("فشل في التحقق من الدفع. يرجى المحاولة مرة أخرى");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("حدث خطأ أثناء التحقق من الدفع");
        console.error("Error verifying payment:", error);
      }
    }

    setCurrentAppId(null);
    setCurrentInstallationId(null);
  };

  const handleInstall = async (appId: string | number) => {
    // Special handling for pixels app
    if (appId === "pixels-app") {
      router.push("/dashboard/apps/pixels");
      return;
    }

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    const app = apps.find((a) => a.id === appId);
    if (!app) {
      toast.error("التطبيق غير موجود");
      return;
    }

    // Check if payment is needed
    const needsPayment =
      parseFloat(app.price) > 0 &&
      app.billing_type !== "free" &&
      app.status !== "installed" &&
      !app.installed;

    // Always call /apps/install - it will return payment_url if payment is needed
    const loadingToast = toast.loading(
      needsPayment ? "جاري إعداد عملية الدفع..." : "جاري تثبيت التطبيق..."
    );
    try {
      const response = await axiosInstance.post("/apps/install", {
        app_id: Number(appId),
      });

      // Check if payment is required (response contains payment_url)
      if (response.data.status === "success" && response.data.data?.payment_url) {
        // Payment required - open payment popup
        setPaymentUrl(response.data.data.payment_url);
        setCurrentAppId(Number(appId));
        setCurrentInstallationId(response.data.data.installation?.id || null);
        setShowPaymentPopup(true);
        toast.dismiss(loadingToast);

        // Update app status to pending_payment
        const updatedApps: App[] = apps.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              status: "pending_payment" as const,
              installation_id: response.data.data.installation?.id || null,
            };
          }
          return app;
        });
        setApps(updatedApps);
      } else if (response.data.status === "success") {
        // Free app or already paid - installation completed
        const updatedApps: App[] = apps.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              installed: true,
              status: "installed" as const,
              installation_id: response.data.data?.installation?.id || null,
            };
          }
          return app;
        });

        setApps(updatedApps);

        const updatedInstalledApps = updatedApps.filter(
          (app) => app.installed === true || app.status === "installed",
        );
        setInstalledApps(updatedInstalledApps);

        fetchSideMenus("apps");
        toast.dismiss(loadingToast);
        toast.success("تم تثبيت التطبيق بنجاح");
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message || "فشل في تثبيت التطبيق");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.message || "فشل في تثبيت التطبيق"
      );
      console.error("فشل في تثبيت التطبيق:", error);
    }
  };

  const handleUninstall = async (appId: string | number) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    const loadingToast = toast.loading("جاري إزالة التطبيق...");
    try {
      await axiosInstance.post(`/apps/uninstall/${appId}`);

      const updatedApps = apps.map((app) => {
        if (app.id === appId) {
          return { ...app, installed: false };
        }
        return app;
      });

      setApps(updatedApps);

      const updatedInstalledApps = updatedApps.filter(
        (app) => app.installed === true,
      );
      setInstalledApps(updatedInstalledApps);
      fetchSideMenus("apps");

      toast.dismiss(loadingToast);
      toast.success("تم إزالة التطبيق بنجاح");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("فشل في إزالة التطبيق");
      console.error("فشل في إزالة تثبيت التطبيق:", error);
    }
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return <AppsPageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  التطبيقات والتكاملات
                </h1>
                <p className="text-muted-foreground">
                  تعزيز موقعك بتطبيقات وتكاملات قوية
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">عرض الشبكة</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">عرض القائمة</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      تصفية
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تصفية التطبيقات</DialogTitle>
                      <DialogDescription>
                        تضييق نطاق التطبيقات حسب معايير محددة
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">السعر</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            مجاني
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            مدفوع
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            اشتراك
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">التقييم</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            4+ نجوم
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            3+ نجوم
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            جميع التقييمات
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">الميزات</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            مميز
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            جديد
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                          >
                            شائع
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">إعادة تعيين</Button>
                      <Button>تطبيق الفلاتر</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن التطبيقات..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all">
              <TabsContent value="all" className="mt-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    التطبيقات المثبتة
                  </h2>
                  {installedApps.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <h3 className="text-lg font-medium">
                        لم يتم تثبيت أي تطبيقات حتى الآن
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        تصفح سوق التطبيقات أدناه للعثور على تطبيقات لموقعك
                      </p>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {installedApps.map((app) => (
                        <AppCard
                          key={app.id}
                          app={app}
                          onInstall={handleInstall}
                          onUninstall={handleUninstall}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {installedApps.map((app) => (
                        <AppListItem
                          key={app.id}
                          app={app}
                          onInstall={handleInstall}
                          onUninstall={handleUninstall}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">سوق التطبيقات</h2>
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredApps
                        .filter(
                          (app) =>
                            !installedApps.some(
                              (installed) => installed.id === app.id,
                            ),
                        )
                        .map((app) => (
                          <AppCard
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApps
                        .filter(
                          (app) =>
                            !installedApps.some(
                              (installed) => installed.id === app.id,
                            ),
                        )
                        .map((app) => (
                          <AppListItem
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {categories.slice(1).map((category) => (
                <TabsContent
                  key={category}
                  value={category.toLowerCase()}
                  className="mt-6"
                >
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredApps
                        .filter((app) => app.category === category)
                        .map((app) => (
                          <AppCard
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApps
                        .filter((app) => app.category === category)
                        .map((app) => (
                          <AppListItem
                            key={app.id}
                            app={app}
                            onInstall={handleInstall}
                            onUninstall={handleUninstall}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
      {showPaymentPopup && paymentUrl && (
        <PaymentPopup
          paymentUrl={paymentUrl}
          onClose={() => {
            setShowPaymentPopup(false);
            setPaymentUrl("");
            setCurrentAppId(null);
            setCurrentInstallationId(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

interface AppProps {
  app: App;
  onInstall: (id: string | number) => void;
  onUninstall: (id: string | number) => void;
}

function AppCard({ app, onInstall, onUninstall }: AppProps) {
  const router = useRouter();
  const isInstalled = app.installed || false || app.status === "installed";
  const isPixelApp = app.isPixelApp;
  const needsPayment =
    parseFloat(app.price) > 0 &&
    app.billing_type !== "free" &&
    app.status !== "installed" &&
    !app.installed;
  const isPendingPayment = app.status === "pending_payment";

  const formatPrice = (price: string) => {
    if (price === "مجاني" || price === "0.00" || parseFloat(price) === 0) {
      return "مجاني";
    }
    return `${parseFloat(price).toFixed(2)} ريال`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md border p-1 h-12 w-12 flex items-center justify-center">
              <img
                src={app.icon || "/placeholder.svg"}
                alt={app.name}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-base">{app.name}</CardTitle>
              <CardDescription className="text-xs">
                بواسطة {app.developer}
              </CardDescription>
            </div>
          </div>
          {app.featured && (
            <Badge variant="secondary" className="text-xs">
              مميز
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {app.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{app.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({app.reviews})
            </span>
          </div>
          <Badge variant={formatPrice(app.price) === "مجاني" ? "outline" : "secondary"}>
            {formatPrice(app.price)}
          </Badge>
        </div>
        {isPendingPayment && (
          <Badge variant="outline" className="mt-2 text-orange-600 border-orange-600">
            في انتظار الدفع
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {isInstalled ? (
          <>
            {app.path || isPixelApp ? (
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-1"
                onClick={() => {
                  if (isPixelApp) {
                    router.push("/dashboard/apps/pixels");
                  } else if (app.path) {
                    router.push(app.path);
                  }
                }}
              >
                <ExternalLink className="h-4 w-4" />
                فتح
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1">
                تكوين
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onUninstall(app.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="w-full gap-1"
            onClick={() => onInstall(app.id)}
          >
            {isPixelApp ? (
              <>
                <ExternalLink className="h-4 w-4" />
                فتح
              </>
            ) : isPendingPayment ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                إتمام الدفع
              </>
            ) : needsPayment ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                شراء
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                تثبيت
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AppListItem({ app, onInstall, onUninstall }: AppProps) {
  const router = useRouter();
  const isInstalled = app.installed || false || app.status === "installed";
  const isPixelApp = app.isPixelApp;
  const needsPayment =
    parseFloat(app.price) > 0 &&
    app.billing_type !== "free" &&
    app.status !== "installed" &&
    !app.installed;
  const isPendingPayment = app.status === "pending_payment";

  const formatPrice = (price: string) => {
    if (price === "مجاني" || price === "0.00" || parseFloat(price) === 0) {
      return "مجاني";
    }
    return `${parseFloat(price).toFixed(2)} ريال`;
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="p-4 sm:w-64 flex items-center gap-3">
          <div className="rounded-md border p-1 h-12 w-12 flex items-center justify-center">
            <img
              src={app.icon || "/placeholder.svg"}
              alt={app.name}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h3 className="font-medium">{app.name}</h3>
            <p className="text-xs text-muted-foreground">
              بواسطة {app.developer}
            </p>
          </div>
        </div>
        <div className="flex-1 p-4 border-t sm:border-t-0 sm:border-r">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{app.description}</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{app.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({app.reviews})
                  </span>
                </div>
                <Badge
                  variant={formatPrice(app.price) === "مجاني" ? "outline" : "secondary"}
                >
                  {formatPrice(app.price)}
                </Badge>
                {isPendingPayment && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    في انتظار الدفع
                  </Badge>
                )}
                {app.featured && (
                  <Badge variant="secondary" className="text-xs">
                    مميز
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {app.category}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              {isInstalled ? (
                <>
                  {app.path || isPixelApp ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        if (isPixelApp) {
                          router.push("/dashboard/apps/pixels");
                        } else if (app.path) {
                          router.push(app.path);
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      فتح
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      تكوين
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onUninstall(app.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={() => onInstall(app.id)}
                >
                  {isPixelApp ? (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      فتح
                    </>
                  ) : isPendingPayment ? (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      إتمام الدفع
                    </>
                  ) : needsPayment ? (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      شراء
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      تثبيت
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AppsPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="apps" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Tabs Section */}
            <div className="space-y-6">
              {/* Installed Apps Section */}
              <div className="mb-6">
                <Skeleton className="h-6 w-48 mb-4" />

                {/* Empty State for Installed Apps */}
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Skeleton className="h-6 w-64 mx-auto mb-2" />
                  <Skeleton className="h-4 w-80 mx-auto" />
                </div>
              </div>

              {/* Apps Marketplace Section */}
              <div>
                <Skeleton className="h-6 w-32 mb-4" />

                {/* Grid View Skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <AppCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function AppCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-12" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
