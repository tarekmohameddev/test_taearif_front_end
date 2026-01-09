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
  Edit,
  Plus,
  AlertTriangle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";

interface Pixel {
  id: number;
  platform: string;
  pixel_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
}

export function AppsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("apps");
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [pixelsLoading, setPixelsLoading] = useState(false);
  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, error } = sidebarData;

  // Pixel management states
  const [isPixelDialogOpen, setIsPixelDialogOpen] = useState(false);
  const [isAddPixelDialogOpen, setIsAddPixelDialogOpen] = useState(false);
  const [isEditPixelDialogOpen, setIsEditPixelDialogOpen] = useState(false);
  const [isDeletePixelDialogOpen, setIsDeletePixelDialogOpen] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);
  const [pixelFormData, setPixelFormData] = useState({
    platform: "facebook",
    pixel_id: "",
    is_active: true,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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

  // Helper functions for platform management
  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "Facebook";
      case "snapchat":
        return "Snapchat";
      case "tiktok":
        return "TikTok";
      default:
        return platform;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "F";
      case "snapchat":
        return "S";
      case "tiktok":
        return "T";
      default:
        return platform.charAt(0).toUpperCase();
    }
  };

  const getPlatformExamples = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "123456789012345";
      case "snapchat":
        return "SC-4455667788";
      case "tiktok":
        return "ABC123DEF456GHI789JKL";
      default:
        return "";
    }
  };

  const getPlatformDescription = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "Facebook Pixel: معرف مكون من 15 رقم بالضبط. يمكنك العثور عليه في Facebook Events Manager.";
      case "snapchat":
        return "Snapchat Pixel: معرف مخصص من Snapchat. انسخه من إعدادات Snapchat Ads Manager.";
      case "tiktok":
        return "TikTok Pixel: معرف مكون من 20-25 حرف وأرقام كبيرة. يمكنك العثور عليه في TikTok Events Manager.";
      default:
        return "";
    }
  };

  // Validation function
  const validatePixelForm = (data: any): boolean => {
    try {
      // Simple validation based on platform
      if (!data.platform || !data.pixel_id) {
        setValidationErrors({ pixel_id: "جميع الحقول مطلوبة" });
        return false;
      }

      if (data.platform === "facebook") {
        if (!/^[0-9]{15}$/.test(data.pixel_id)) {
          setValidationErrors({
            pixel_id:
              "Facebook Pixel يجب أن يكون 15 رقم بالضبط (مثال: 123456789012345)",
          });
          return false;
        }
      } else if (data.platform === "tiktok") {
        if (!/^[A-Z0-9]{20,25}$/.test(data.pixel_id)) {
          setValidationErrors({
            pixel_id:
              "TikTok Pixel يجب أن يكون 20-25 حرف وأرقام كبيرة (مثال: ABC123DEF456GHI789JKL)",
          });
          return false;
        }
      } else if (data.platform === "snapchat") {
        if (data.pixel_id.trim().length < 3) {
          setValidationErrors({
            pixel_id: "Snapchat Pixel يجب أن يكون 3 أحرف على الأقل",
          });
          return false;
        }
      }

      setValidationErrors({});
      return true;
    } catch (error) {
      setValidationErrors({ pixel_id: "خطأ في التحقق من صحة البيانات" });
      return false;
    }
  };

  const resetPixelForm = () => {
    setPixelFormData({ platform: "facebook", pixel_id: "", is_active: true });
    setValidationErrors({});
  };

  // Helper function to get available platforms (excluding already added ones)
  const getAvailablePlatforms = (includePlatform?: string) => {
    const allPlatforms = [
      { value: "facebook", label: "Facebook" },
      { value: "tiktok", label: "TikTok" },
      { value: "snapchat", label: "Snapchat" },
    ];

    const usedPlatforms = new Set(pixels.map((pixel) => pixel.platform));
    if (includePlatform) usedPlatforms.delete(includePlatform);
    return allPlatforms.filter(
      (platform) => !usedPlatforms.has(platform.value),
    );
  };

  // Add pixels app to the apps array
  const addPixelsApp = (fetchedApps: App[]) => {
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
    };

    return [pixelsApp, ...fetchedApps];
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/apps");
        const fetchedApps = res.data.data.apps.map((app: any) => ({
          ...app,
          icon: app.img || app.icon || "/placeholder.svg",
          path: app.path || undefined,
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
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [userData?.token, authLoading]);

  const fetchPixels = async () => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    setPixelsLoading(true);
    try {
      const res = await axiosInstance.get("/pixels");
      setPixels(res.data.data);
    } catch (err) {
      console.error("Failed to load pixels:", err);
    } finally {
      setPixelsLoading(false);
    }
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }
    fetchPixels();
  }, [userData?.token, authLoading]);

  const handleInstall = async (appId: string | number) => {
    // Special handling for pixels app
    if (appId === "pixels-app") {
      setIsPixelDialogOpen(true);
      return;
    }

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    const loadingToast = toast.loading("جاري تثبيت التطبيق...");
    try {
      await axiosInstance.post("/apps/install", {
        app_id: Number(appId),
      });

      const updatedApps = apps.map((app) => {
        if (app.id === appId) {
          return { ...app, installed: true };
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
      toast.success("تم تثبيت التطبيق بنجاح");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("فشل في تثبيت التطبيق");
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

  // Pixel management functions
  const handleAddPixel = async () => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    if (!validatePixelForm(pixelFormData)) {
      toast.error("يوجد أخطاء في إدخال البيانات. يرجى التأكد من صحة البيانات.");
      return;
    }

    try {
      await axiosInstance.post("/pixels", pixelFormData);
      toast.success("تم إضافة Pixel بنجاح");
      setIsAddPixelDialogOpen(false);
      resetPixelForm();
      fetchPixels();
    } catch (error) {
      toast.error("فشل في إضافة Pixel");
      console.error("Failed to add pixel:", error);
    }
  };

  const handleEditPixel = async () => {
    if (!selectedPixel) return;

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    if (!validatePixelForm(pixelFormData)) {
      toast.error("يوجد أخطاء في إدخال البيانات. يرجى التأكد من صحة البيانات.");
      return;
    }

    try {
      await axiosInstance.put(`/pixels/${selectedPixel.id}`, pixelFormData);
      toast.success("تم تعديل Pixel بنجاح");
      setIsEditPixelDialogOpen(false);
      setSelectedPixel(null);
      resetPixelForm();
      fetchPixels();
    } catch (error) {
      toast.error("فشل في تعديل Pixel");
      console.error("Failed to edit pixel:", error);
    }
  };

  const handleDeletePixel = async () => {
    if (!selectedPixel) return;

    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    try {
      await axiosInstance.delete(`/pixels/${selectedPixel.id}`);
      toast.success("تم حذف Pixel بنجاح");
      setIsDeletePixelDialogOpen(false);
      setSelectedPixel(null);
      fetchPixels();
    } catch (error) {
      toast.error("فشل في حذف Pixel");
      console.error("Failed to delete pixel:", error);
    }
  };

  const openEditDialog = (pixel: Pixel) => {
    setSelectedPixel(pixel);
    setPixelFormData({
      platform: pixel.platform,
      pixel_id: pixel.pixel_id,
      is_active: pixel.is_active,
    });
    setIsEditPixelDialogOpen(true);
  };

  const openDeleteDialog = (pixel: Pixel) => {
    setSelectedPixel(pixel);
    setIsDeletePixelDialogOpen(true);
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()),
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

      {/* Pixels Management Dialog */}
      <Dialog open={isPixelDialogOpen} onOpenChange={setIsPixelDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              إدارة Pixels
            </DialogTitle>
            <DialogDescription>
              ربط وإدارة pixels منصات التواصل الاجتماعي مع موقعك
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pixels المربوطة</h3>
              <Button
                onClick={() => setIsAddPixelDialogOpen(true)}
                className="gap-2"
                disabled={getAvailablePlatforms().length === 0}
                title={
                  getAvailablePlatforms().length === 0
                    ? "تم ربط جميع ال Pixels المتاحة"
                    : undefined
                }
              >
                <Plus className="h-4 w-4" />
                إضافة Pixel جديد
              </Button>
            </div>

            {pixelsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pixels.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">لا توجد pixels مربوطة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pixels.map((pixel) => (
                  <div
                    key={pixel.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {pixel.platform.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {pixel.platform}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pixel.pixel_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={pixel.is_active ? "default" : "secondary"}
                      >
                        {pixel.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(pixel)}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(pixel)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Pixel Dialog */}
      <Dialog
        open={isAddPixelDialogOpen}
        onOpenChange={setIsAddPixelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة Pixel جديد</DialogTitle>
            <DialogDescription>
              أدخل معلومات Pixel الجديد لربطه مع موقعك
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">المنصة</Label>
              <Select
                value={pixelFormData.platform}
                onValueChange={(value) =>
                  setPixelFormData({ ...pixelFormData, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصة" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailablePlatforms().map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getAvailablePlatforms().length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  جميع المنصات تم ربطها بالفعل
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pixel_id">معرف Pixel</Label>
              <Input
                id="pixel_id"
                value={pixelFormData.pixel_id}
                onChange={(e) =>
                  setPixelFormData({
                    ...pixelFormData,
                    pixel_id: e.target.value,
                  })
                }
                placeholder="أدخل معرف Pixel"
              />
              {validationErrors.pixel_id && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.pixel_id}
                </p>
              )}
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <div className="font-medium mb-2">
                  📋 متطلبات {getPlatformDisplayName(pixelFormData.platform)}:
                </div>
                <p className="mb-2">
                  {getPlatformDescription(pixelFormData.platform)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">مثال:</span>
                  <code className="bg-background px-2 py-1 rounded text-xs font-mono">
                    {getPlatformExamples(pixelFormData.platform)}
                  </code>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_active"
                checked={pixelFormData.is_active}
                onCheckedChange={(checked) =>
                  setPixelFormData({ ...pixelFormData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">تفعيل Pixel</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddPixelDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAddPixel}
              disabled={getAvailablePlatforms().length === 0}
            >
              إضافة Pixel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pixel Dialog */}
      <Dialog
        open={isEditPixelDialogOpen}
        onOpenChange={setIsEditPixelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل Pixel</DialogTitle>
            <DialogDescription>تعديل معلومات Pixel المحدد</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-platform">المنصة</Label>
              <Select
                value={pixelFormData.platform}
                onValueChange={(value) =>
                  setPixelFormData({ ...pixelFormData, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصة" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailablePlatforms(selectedPixel?.platform).map(
                    (platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-pixel_id">معرف Pixel</Label>
              <Input
                id="edit-pixel_id"
                value={pixelFormData.pixel_id}
                onChange={(e) =>
                  setPixelFormData({
                    ...pixelFormData,
                    pixel_id: e.target.value,
                  })
                }
                placeholder={`مثال: ${getPlatformExamples(pixelFormData.platform)}`}
                className={
                  validationErrors.pixel_id ? "border-destructive" : ""
                }
              />
              {validationErrors.pixel_id && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.pixel_id}
                </p>
              )}
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <div className="font-medium mb-2">
                  📋 متطلبات {getPlatformDisplayName(pixelFormData.platform)}:
                </div>
                <p className="mb-2">
                  {getPlatformDescription(pixelFormData.platform)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">مثال:</span>
                  <code className="bg-background px-2 py-1 rounded text-xs font-mono">
                    {getPlatformExamples(pixelFormData.platform)}
                  </code>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="edit-is_active"
                checked={pixelFormData.is_active}
                onCheckedChange={(checked) =>
                  setPixelFormData({ ...pixelFormData, is_active: checked })
                }
              />
              <Label htmlFor="edit-is_active">تفعيل Pixel</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPixelDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditPixel}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Pixel Confirmation Dialog */}
      <AlertDialog
        open={isDeletePixelDialogOpen}
        onOpenChange={setIsDeletePixelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              <div className="space-y-3">
                <p className="font-semibold text-lg">
                  هل أنت متأكد من حذف هذا Pixel؟
                </p>
                <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  <p className="text-sm">
                    <span className="font-medium">المنصة:</span>{" "}
                    {selectedPixel?.platform}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">معرف Pixel:</span>{" "}
                    {selectedPixel?.pixel_id}
                  </p>
                </div>
                <p className="text-destructive font-medium">
                  ⚠️ هذا الإجراء لا يمكن التراجع عنه. سيتم حذف Pixel نهائياً من
                  النظام.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePixel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              نعم، احذف Pixel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
  const isInstalled = app.installed || false;
  const isPixelApp = app.isPixelApp;

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
          <Badge variant={app.price === "مجاني" ? "outline" : "secondary"}>
            {app.price}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {isInstalled ? (
          <>
            {app.path ? (
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-1"
                onClick={() => router.push(app.path!)}
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
                <Link className="h-4 w-4" />
                ربط
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
  const isInstalled = app.installed || false;
  const isPixelApp = app.isPixelApp;

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
                  variant={app.price === "مجاني" ? "outline" : "secondary"}
                >
                  {app.price}
                </Badge>
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
                  {app.path ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={() => router.push(app.path!)}
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
                      <Link className="h-4 w-4" />
                      ربط
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
