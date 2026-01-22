"use client"; // Ensure this is a Client Component

import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Star,
  HelpCircle,
  User,
  Globe,
  ExternalLink,
  Menu,
  Building2,
  Home,
  FileText,
  BarChart3,
  LayoutTemplate,
  SettingsIcon,
  MessageSquare,
  Package,
  Settings,
  Users,
  LogOut,
  UserCog,
  Briefcase,
  Download,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import useAuthStore from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/context/Store";
import axiosInstance from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import {
  getPlanCookie,
  setPlanCookie,
  hasValidPlanCookie,
  hasFetchedPlanInSession,
  markPlanFetchedInSession,
  type PlanData,
} from "@/lib/planCookie";

// نوع عنصر القائمة الجانبية (يمكنك تعديله حسب تعريفك الفعلي)
type MainNavItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isAPP?: boolean;
  isDirectPath?: boolean;
};

interface DashboardHeaderProps {
  children?: ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  const { userData, fetchUserData, clickedONSubButton } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, loading, error } = sidebarData;
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  // استخدام useRef لمنع إعادة الجلب عند التنقل
  const hasFetchedPlanRef = useRef(false);
  const isFetchingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    // إزالة fetchUserData من هنا لأنه يتم استدعاؤه في layout.tsx
    // fetchUserData();
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (userData?.token) {
      fetchSideMenus();
    }
  }, [fetchSideMenus, userData?.token]);

  // جلب بيانات الخطة مرة واحدة وحفظها في كوكي
  useEffect(() => {
    const currentToken = userData?.token || null;

    // إذا لم يتغير الـ token، لا تفعل شيئاً (منع إعادة الجلب عند التنقل)
    if (
      currentToken === lastTokenRef.current &&
      lastTokenRef.current !== null
    ) {
      // التحقق من الكوكي فقط إذا لم يتم الجلب من قبل
      if (!hasFetchedPlanRef.current && hasValidPlanCookie()) {
        const cachedPlan = getPlanCookie();
        if (cachedPlan) {
          setCurrentPlan(cachedPlan);
          hasFetchedPlanRef.current = true;
        }
      }
      return;
    }

    // تحديث آخر token
    lastTokenRef.current = currentToken;

    // التحقق من وجود بيانات في الكوكي أولاً - هذا يمنع أي طلب API
    if (hasValidPlanCookie()) {
      const cachedPlan = getPlanCookie();
      if (cachedPlan) {
        setCurrentPlan(cachedPlan);
        hasFetchedPlanRef.current = true;
        markPlanFetchedInSession(); // تسجيل أن البيانات موجودة
        return; // لا حاجة لجلب البيانات من API
      }
    }

    // إذا تم الجلب من قبل في هذه الجلسة (sessionStorage)، لا تعيد الجلب
    if (
      hasFetchedPlanInSession() ||
      hasFetchedPlanRef.current ||
      isFetchingRef.current
    ) {
      return;
    }

    // التحقق من وجود token و account_type قبل الجلب
    if (!currentToken || userData?.account_type !== "tenant") {
      return;
    }

    const fetchPlanData = async () => {
      // تعيين flag لمنع إعادة الجلب
      isFetchingRef.current = true;
      hasFetchedPlanRef.current = true;
      markPlanFetchedInSession(); // تسجيل في sessionStorage

      try {
        setIsLoadingPlan(true);
        const response = await axiosInstance.get("/user");
        const subscriptionDATA = response.data.data;

        const planData: PlanData = {
          package_title: subscriptionDATA.membership.package.title || null,
          is_free_plan: subscriptionDATA.membership.is_free_plan || false,
          days_remaining: subscriptionDATA.membership.days_remaining || null,
          is_expired: subscriptionDATA.membership.is_expired || false,
          package_features: subscriptionDATA.membership.package.features || [],
          project_limit_number:
            subscriptionDATA.membership.package.project_limit_number || null,
          real_estate_limit_number:
            subscriptionDATA.membership.package.real_estate_limit_number ||
            null,
          fetched_at: Date.now(),
        };

        // حفظ البيانات في الكوكي
        setPlanCookie(planData);
        setCurrentPlan(planData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
        // في حالة الخطأ، إعادة تعيين flags للسماح بالمحاولة مرة أخرى
        hasFetchedPlanRef.current = false;
        // لا نحذف sessionStorage flag في حالة الخطأ - نتركه لمنع محاولات متعددة
      } finally {
        setIsLoadingPlan(false);
        isFetchingRef.current = false;
      }
    };

    fetchPlanData();
    // استخدام userData?.token فقط كـ dependency للتحقق من جاهزية البيانات
    // لكن sessionStorage و useRef يمنعان إعادة الجلب عند التنقل
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.token]); // يعمل فقط عند تغيير token (تسجيل دخول/خروج)

  const clickedONButton = async () => {
    clickedONSubButton();
    router.push("/dashboard/settings");
  };

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
    } catch (error) {
      console.error(error);
    }
  };

  // تحديد العنصر النشط بناءً على المسار الحالي
  const currentPath = pathname || "/";
  const isContentSection = currentPath.startsWith("/content");
  const isLiveEditorSection = currentPath.startsWith("/live-editor");
  const currentTab = isContentSection
    ? "content"
    : isLiveEditorSection
      ? "live-editor"
      : mainNavItems.find(
          (item: MainNavItem) =>
            item.path === currentPath ||
            (item.path !== "/" && currentPath.startsWith(item.path)),
        )?.id || "dashboard";

  // دالة للتعامل مع النقر على العنصر
  const handleItemClick = (item: MainNavItem, e: any) => {
    if (item.isAPP) {
      e.preventDefault();
      const token = useAuthStore.getState().token;
      const url = `${item.path}?token=${token}`;
      window.open(url, "_blank");
    }
  };

  // Static menu items (same as desktop sidebar)
  const staticMenuItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      description: "نظره عامه عن الموقع",
      icon: FileText,
      path: "/dashboard",
    },
    {
      id: "settings",
      label: "اعدادات الموقع",
      description: "تكوين اعدادات الموقع",
      icon: Settings,
      path: "/dashboard/settings",
    },
    {
      id: "customers",
      label: "ادارة العملاء",
      description: "ادارة عملائك",
      icon: Users,
      path: "/dashboard/customers",
    },
    {
      id: "crm",
      label: "CRM",
      description: "تكوين اعدادات ادارة علاقات العملاء",
      icon: UserCog,
      path: "/dashboard/crm",
    },
    {
      id: "projects",
      label: "المشاريع",
      description: "ادارة المشاريع",
      icon: Building2,
      path: "/dashboard/projects",
    },
    {
      id: "properties",
      label: "العقارات",
      description: "ادارة العقارات",
      icon: Home,
      path: "/dashboard/properties",
    },
    {
      id: "property-requests",
      label: "طلبات العملاء",
      description: "ادارة طلبات العملاء العقارية",
      icon: FileText,
      path: "/dashboard/property-requests",
    },
    {
      id: "job-applications",
      label: "المتقدمين للوظائف",
      description: "ادارة المتقدمين للوظائف",
      icon: Briefcase,
      path: "/dashboard/job-applications",
    },
    {
      id: "matching",
      label: "مركز توافق الطلبات الذكائي",
      description: "احصل على توافق ذكي مع الطلبات",
      icon: MessageSquare,
      path: "/dashboard/matching",
    },
    {
      id: "live-editor",
      label: "تعديل تصميم الموقع",
      description: "ادارة محتوى الموقع",
      icon: LayoutTemplate,
      path: "/live-editor",
      isDirectPath: true,
    },
    {
      id: "access-control",
      label: "ادارة الموظفين",
      description: "ادارة الموظفين",
      icon: Users,
      path: "/dashboard/access-control",
    },
    {
      id: "rental-management",
      label: "ادارة الايجارات",
      description: "ادارة ايجارتك",
      icon: Download,
      path: "/dashboard/rental-management",
    },
    {
      id: "apps",
      label: "التطبيقات",
      description: "ادارة التطبيقات",
      icon: Grid,
      path: "/apps",
    },
  ];

  // Use static menu items if mainNavItems is empty or not loaded
  const menuItemsToUse = mainNavItems && mainNavItems.length > 0 ? mainNavItems : staticMenuItems;

  const hey = true;
  return (
    <header className="sticky top-0 z-30 bg-background flex flex-col gap-6">
      {/* الـ navbar الأول مع المحتوى الحالي */}
      <div className="h-16 items-center justify-between px-4 md:px-6 md:border-b flex">
        <div className="flex items-center gap-4">
          {/* زر قائمة الجوال - يظهر للشاشات الأصغر من 1200 بكسل */}
          <div className="max-[1199px]:block min-[1200px]:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">فتح قائمة التنقل</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 z-50">
                <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                <div className="flex h-full flex-col gap-2 overflow-hidden">
                  <div className="flex h-14 items-center border-b px-4 md:h-[60px] flex-shrink-0">
                    <div className="flex flex-col w-full">
                      <span className="text-lg font-semibold truncate">
                        {userData?.company_name || "لوحة التحكم"}
                      </span>
                      {userData?.domain && userData.domain.trim() !== "" && (
                        <span className="text-xs text-gray-500 truncate">
                          {userData.domain}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-3">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-foreground transition-all duration-200"
                            onClick={() => {
                              const userData = useAuthStore.getState().userData;

                              // التحقق من وجود userData
                              if (!userData) {
                                console.warn("userData is null or undefined");
                                alert("يرجى تسجيل الدخول أولاً");
                                return;
                              }

                              const domain = userData?.domain || "";

                              // التحقق من صحة الـ domain
                              if (!domain || domain.trim() === "") {
                                alert(
                                  "يرجى إعداد domain صحيح في إعدادات الحساب",
                                );
                                return;
                              }

                              // تنظيف الـ domain من المسافات
                              const cleanDomain = domain.trim();

                              // التحقق من أن الـ domain يحتوي على نقطة أو يكون URL صحيح
                              if (
                                !cleanDomain.includes(".") &&
                                !cleanDomain.startsWith("http")
                              ) {
                                alert(
                                  "تنسيق الـ domain غير صحيح. يجب أن يحتوي على نقطة (مثل: example.com) أو يكون URL صحيح",
                                );
                                return;
                              }

                              const url = cleanDomain.startsWith("http")
                                ? cleanDomain
                                : `https://${cleanDomain}`;

                              // التحقق من صحة الـ URL قبل فتحه
                              try {
                                new URL(url);
                                console.log("Opening URL:", url);
                                window.open(url, "_blank");
                              } catch (error) {
                                console.error("Invalid URL:", url, error);
                                alert(
                                  "URL غير صحيح. يرجى التحقق من إعدادات الـ domain",
                                );
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4 text-primary" />
                            <span>معاينة الموقع</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>فتح الموقع في نافذة جديدة</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex-1 overflow-auto py-2 px-1 min-h-0">
                    {error && (
                      <div className="px-3 py-2">
                        <span className="text-sm text-red-500">{error}</span>
                      </div>
                    )}
                    <nav className="space-y-1">
                      {menuItemsToUse &&
                        menuItemsToUse.map((item: MainNavItem) => {
                          const isActive =
                            currentTab === item.id ||
                            (item.path !== "/" &&
                              currentPath.startsWith(item.path));
                          const IconComponent = item.icon;
                          return (
                            <Button
                              key={item.id}
                              variant={isActive ? "secondary" : "ghost"}
                              className={cn(
                                "justify-start gap-3 h-auto py-2 px-3 w-full",
                                isActive &&
                                  "bg-primary/10 text-primary border-r-2 border-primary",
                              )}
                              asChild={!item.isAPP}
                            >
                              {item.isAPP ? (
                                <div
                                  onClick={(e) => handleItemClick(item, e)}
                                  className="cursor-pointer flex items-center w-full"
                                >
                                  <IconComponent
                                    className={cn(
                                      "h-5 w-5",
                                      isActive
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                    )}
                                  />
                                  <div className="flex flex-col items-start ml-3">
                                    <span className="text-sm font-medium">
                                      {item.label}
                                    </span>
                                    {item.description && (
                                      <span className="text-xs text-muted-foreground">
                                        {item.description}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={(() => {
                                    if (item.isDirectPath) {
                                      return item.path;
                                    }
                                    if (item.path.startsWith("/dashboard")) {
                                      return item.path;
                                    } else if (item.path.startsWith("/")) {
                                      return `/dashboard${item.path}`;
                                    } else {
                                      return `/dashboard/${item.path}`;
                                    }
                                  })()}
                                >
                                  <IconComponent
                                    className={cn(
                                      "h-5 w-5",
                                      isActive
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                    )}
                                  />
                                  <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                      {item.label}
                                    </span>
                                    {item.description && (
                                      <span className="text-xs text-muted-foreground">
                                        {item.description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              )}
                            </Button>
                          );
                        })}
                    </nav>
                  </div>
                  {useAuthStore.getState().UserIslogged && (
                    <div className="mt-auto border-t p-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo.png"
              alt="Logo"
              width={141}
              height={100}
              className=""
            />
          </Link>

          {/* <div className="hidden md:flex items-center gap-1 mr-6">
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://taearif.com/about">عن تعاريف</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>محتوى دقيق، واضح، جذاب</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://taearif.com/blog">المدونة</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>مقالات ملهمة، تقنية، مبتكرة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}

          {children}
        </div>

        {/* أزرار تسجيل الدخول والمستخدم */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#20b358] text-white border-[#25D366] hover:border-[#20b358] gap-2"
                  onClick={() =>
                    window.open(
                      "https://wa.me/966592960339?text=مرحباً، أحتاج مساعدة في استخدام منشئ المواقع",
                      "_blank",
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="0"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.3764 4.62392C17.2857 2.53331 14.4161 1.3877 11.3454 1.38477C5.07033 1.38477 0 6.45511 0 12.7301C0 14.8325 0.60459 16.8815 1.7518 18.6578L0 24.6147L6.10273 22.9052C7.80914 23.9446 9.75548 24.5001 11.7401 24.5001H11.7446C18.0182 24.5001 23.0871 19.4298 23.0901 13.1533C23.0931 10.0855 21.4671 7.21452 19.3764 4.62392ZM11.3454 22.5677H11.3424C9.62807 22.5677 7.94711 22.0328 6.48728 21.0245L6.15428 20.8232L2.66426 21.8345L3.69089 18.4422L3.47085 18.0947C2.36551 16.5763 1.78977 14.6841 1.78977 12.7301C1.78977 7.46621 6.08129 3.31714 11.3484 3.31714C13.9039 3.31714 16.2996 4.26513 18.0496 5.98456C19.7997 7.70399 20.7463 10.0997 20.7448 12.6533C20.7418 17.9201 16.6095 22.5677 11.3454 22.5677ZM16.4639 15.3405C16.1864 15.2019 14.8059 14.5245 14.5493 14.4266C14.2928 14.3302 14.1033 14.2817 13.9153 14.5592C13.7258 14.8367 13.1892 15.4663 13.0221 15.6543C12.8565 15.8423 12.6894 15.8678 12.4119 15.7292C10.6033 14.8252 9.39222 14.1152 8.17669 12.0678C7.85614 11.5329 8.39979 11.5738 8.90461 10.5655C9.00254 10.3775 8.95401 10.2144 8.88004 10.0758C8.80607 9.93711 8.27633 8.55663 8.03939 8.00151C7.80914 7.46035 7.5759 7.54278 7.40037 7.53384C7.23329 7.52491 7.04378 7.52491 6.85576 7.52491C6.66625 7.52491 6.36114 7.59888 6.10273 7.87639C5.84581 8.1539 5.11987 8.83126 5.11987 10.2117C5.11987 11.5922 6.12213 12.9279 6.26859 13.1159C6.41654 13.3039 8.26226 16.1735 11.1171 17.3977C12.9257 18.1228 13.6501 18.1742 14.5748 18.0371C15.1429 17.9507 16.2722 17.3553 16.5092 16.7033C16.7461 16.0513 16.7461 15.4961 16.6721 15.3659C16.5996 15.2273 16.4101 15.1513 16.1341 15.0127L16.4639 15.3405Z"
                    />
                  </svg>
                  <span className="hidden md:inline">احصل على مساعدة</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>تواصل معنا عبر واتساب للحصول على المساعدة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {!useAuthStore.getState().UserIslogged && (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/signup">إنشاء حساب</Link>
              </Button>
            </>
          )}

          {useAuthStore.getState().UserIslogged && (
            <>
              {/* زر الخطة الحالية - يستخدم بيانات الكوكي أو userData */}
              {/* إظهار الزر إذا كان هناك بيانات خطة (من الكوكي أو userData) */}
              {((currentPlan &&
                (currentPlan.package_title ||
                  currentPlan.is_free_plan !== undefined)) ||
                (userData?.package_title !== undefined &&
                  userData?.package_title !== null) ||
                (userData?.is_free_plan !== undefined &&
                  userData?.is_free_plan !== null)) && (
                <>
                  {/* استخدام currentPlan إذا كان موجوداً */}
                  {currentPlan &&
                  (currentPlan.package_title ||
                    currentPlan.is_free_plan !== undefined) ? (
                    <Button
                      variant={
                        currentPlan.is_free_plan ? "outline" : "secondary"
                      }
                      size="sm"
                      className={
                        currentPlan.is_free_plan
                          ? "hidden md:flex gap-1"
                          : "bg-amber-100 text-amber-800 hidden md:flex"
                      }
                      onClick={clickedONButton}
                    >
                      <Link href="/dashboard/settings">
                        {currentPlan.is_free_plan
                          ? `الباقة المجانية`
                          : currentPlan.package_title || "الخطة الحالية"}
                        {!currentPlan.is_free_plan &&
                          currentPlan.days_remaining && (
                            <span className="mr-2 text-xs opacity-75">
                              ({currentPlan.days_remaining} يوم متبقي)
                            </span>
                          )}
                      </Link>
                      {currentPlan.is_free_plan ? (
                        ""
                      ) : (
                        <Star className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  ) : (
                    /* استخدام userData كـ fallback */
                    <Button
                      variant={userData?.is_free_plan ? "outline" : "secondary"}
                      size="sm"
                      className={
                        userData?.is_free_plan
                          ? "hidden md:flex gap-1"
                          : "bg-amber-100 text-amber-800 hidden md:flex"
                      }
                      onClick={clickedONButton}
                    >
                      <Link href="/dashboard/settings">
                        {userData?.is_free_plan
                          ? `الباقة المجانية`
                          : userData?.package_title || "الخطة الحالية"}
                        {!userData?.is_free_plan &&
                          userData?.days_remaining && (
                            <span className="mr-2 text-xs opacity-75">
                              ({userData?.days_remaining} يوم متبقي)
                            </span>
                          )}
                      </Link>
                      {userData?.is_free_plan ? (
                        ""
                      ) : (
                        <Star className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  )}
                </>
              )}

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground relative"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 flex items-center justify-center">
                        2
                      </Badge>
                      <span className="sr-only">الإشعارات</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>عرض الإشعارات</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <HelpCircle className="h-5 w-5" />
                      <span className="sr-only">المساعدة</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الحصول على المساعدة والدعم</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}

              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full border border-muted-foreground/20"
                        >
                          <User className="h-5 w-5" />
                          <span className="sr-only">قائمة المستخدم</span>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>إعدادات الحساب</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {useAuthStore.getState().userData?.initial}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {useAuthStore.getState().userData?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {useAuthStore.getState().userData?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <User className="ml-2 h-4 w-4" />
                      <span>حسابي</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings?tab=billing">
                      <span>الفواتير والاشتراك</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* الـ navbar الثاني */}
      <div className="flex h-5 items-center justify-center border-b px-4 md:px-6 md:hidden ">
        {useAuthStore.getState().UserIslogged && (
          <>
            {/* زر الخطة الحالية للجوال - يستخدم بيانات الكوكي أو userData */}
            {/* إظهار الزر إذا كان هناك بيانات خطة (من الكوكي أو userData) */}
            {((currentPlan &&
              (currentPlan.package_title ||
                currentPlan.is_free_plan !== undefined)) ||
              (userData?.package_title !== undefined &&
                userData?.package_title !== null) ||
              (userData?.is_free_plan !== undefined &&
                userData?.is_free_plan !== null)) && (
              <>
                {/* استخدام currentPlan إذا كان موجوداً */}
                {currentPlan &&
                (currentPlan.package_title ||
                  currentPlan.is_free_plan !== undefined) ? (
                  <Button
                    variant={currentPlan.is_free_plan ? "outline" : "secondary"}
                    size="sm"
                    className={
                      currentPlan.is_free_plan
                        ? "mb-10"
                        : "bg-amber-100 text-amber-800 mb-10"
                    }
                    onClick={clickedONButton}
                  >
                    <Link href="/dashboard/settings">
                      {currentPlan.is_free_plan
                        ? `الباقة المجانية `
                        : currentPlan.package_title || "الخطة الحالية"}
                      {!currentPlan.is_free_plan &&
                        currentPlan.days_remaining && (
                          <span className="mr-2 text-xs opacity-75">
                            ({currentPlan.days_remaining} يوم متبقي)
                          </span>
                        )}
                    </Link>
                    {!currentPlan.is_free_plan && (
                      <Star className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ) : (
                  /* استخدام userData كـ fallback */
                  <Button
                    variant={userData?.is_free_plan ? "outline" : "secondary"}
                    size="sm"
                    className={
                      userData?.is_free_plan
                        ? "mb-10"
                        : "bg-amber-100 text-amber-800 mb-10"
                    }
                    onClick={clickedONButton}
                  >
                    <Link href="/dashboard/settings">
                      {userData?.is_free_plan
                        ? `الباقة المجانية `
                        : userData?.package_title || "الخطة الحالية"}
                      {!userData?.is_free_plan && userData?.days_remaining && (
                        <span className="mr-2 text-xs opacity-75">
                          ({userData?.days_remaining} يوم متبقي)
                        </span>
                      )}
                    </Link>
                    {!userData?.is_free_plan && (
                      <Star className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
