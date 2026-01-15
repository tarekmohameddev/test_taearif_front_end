"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronDown, Building2, Home, Building, Settings, LayoutTemplate, Users, UserCog, FileText, Download, Code, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/context/AuthContext";
import useStore from "@/context/Store";

// Hook لمراقبة ارتفاع الشاشة
const useScreenHeight = () => {
  const [isShortScreen, setIsShortScreen] = useState(false);
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsShortScreen(window.innerHeight < 720);
      setIsVeryShortScreen(window.innerHeight < 1000);
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return { isShortScreen, isVeryShortScreen };
};

interface EnhancedSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function EnhancedSidebar({
  activeTab,
  setActiveTab,
}: EnhancedSidebarProps) {
  const pathname = usePathname();
  const [isNewUser, setIsNewUser] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPropertyManagementOpen, setIsPropertyManagementOpen] = useState(false);
  const [isSiteManagementOpen, setIsSiteManagementOpen] = useState(false);
  const [isCustomerManagementOpen, setIsCustomerManagementOpen] = useState(false);
  const [isAppsManagementOpen, setIsAppsManagementOpen] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    activeTab || "dashboard",
  );
  const { isShortScreen, isVeryShortScreen } = useScreenHeight();

  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, loading, error } = sidebarData;

  const { userData, IsLoading: authLoading } = useAuthStore();

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // التحقق من وجود التوكن قبل إجراء الطلب
    fetchSideMenus();
  }, [fetchSideMenus, userData?.token, authLoading]);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (hasVisitedBefore) {
      setIsNewUser(false);
    } else {
      setTimeout(
        () => {
          localStorage.setItem("hasVisitedBefore", "true");
          setIsNewUser(false);
        },
        3 * 24 * 60 * 60 * 1000,
      );
    }
  }, []);

  // تحديد العنصر النشط بناءً على المسار الحالي
  const currentPath = pathname || "/";
  const isContentSection = currentPath.startsWith("/content");
  const isLiveEditorSection = currentPath.startsWith("/live-editor");
  const currentTab = isContentSection
    ? "content"
    : isLiveEditorSection
      ? "live-editor"
      : mainNavItems.find(
          (item: any) =>
            item.path === currentPath ||
            (item.path !== "/" && currentPath.startsWith(item.path)),
        )?.id || "dashboard";

  // تحديث العنصر النشط عند تغيير المسار
  useEffect(() => {
    if (currentTab) {
      setInternalActiveTab(currentTab);
      if (typeof setActiveTab === "function") {
        setActiveTab(currentTab);
      }
    }
  }, [currentPath, currentTab, setActiveTab]);

  // فتح قسم إدارة العقارات تلقائياً إذا كان المسار الحالي يطابق أحد العناصر الفرعية
  useEffect(() => {
    const propertyManagementPaths = [
      "/dashboard/units",
      "/dashboard/projects",
      "/dashboard/buildings",
    ];
    if (
      propertyManagementPaths.some(
        (path) =>
          currentPath === path || currentPath.startsWith(path + "/"),
      )
    ) {
      setIsPropertyManagementOpen(true);
    }
  }, [currentPath]);

  // فتح قسم إدارة الموقع تلقائياً إذا كان المسار الحالي يطابق أحد العناصر الفرعية
  useEffect(() => {
    const siteManagementPaths = [
      "/dashboard/settings",
      "/dashboard/site-settings",
      "/dashboard/design",
      "/dashboard/design-editor",
    ];
    if (
      siteManagementPaths.some(
        (path) =>
          currentPath === path || currentPath.startsWith(path + "/"),
      )
    ) {
      setIsSiteManagementOpen(true);
    }
  }, [currentPath]);

  // فتح قسم إدارة العملاء تلقائياً إذا كان المسار الحالي يطابق أحد العناصر الفرعية
  useEffect(() => {
    const customerManagementPaths = [
      "/dashboard/crm",
      "/dashboard/customers",
      "/dashboard/property-requests",
    ];
    if (
      customerManagementPaths.some(
        (path) =>
          currentPath === path || currentPath.startsWith(path + "/"),
      )
    ) {
      setIsCustomerManagementOpen(true);
    }
  }, [currentPath]);

  // فتح قسم التطبيقات تلقائياً إذا كان المسار الحالي يطابق أحد العناصر الفرعية
  useEffect(() => {
    const appsManagementPaths = [
      "/dashboard/apps",
      "/dashboard/whatsapp-center",
      "/dashboard/whatsapp-ai",
    ];
    if (
      appsManagementPaths.some(
        (path) =>
          currentPath === path || currentPath.startsWith(path + "/"),
      )
    ) {
      setIsAppsManagementOpen(true);
    }
  }, [currentPath]);

  // دالة للحصول على الرابط مع إضافة token إذا لزم الأمر
  const getItemUrl = (item: any) => {
    if (item.isAPP) {
      const token = useAuthStore.getState().token;
      return `${item.path}?token=${token}`;
    }
    return item.path;
  };

  // دالة للتعامل مع النقر على العنصر
  const handleItemClick = (item: any, e: any) => {
    if (item.isAPP) {
      e.preventDefault(); // منع التنقل الافتراضي
      const url = getItemUrl(item);
      window.open(url, "_blank"); // فتح في تبويب جديد
    }
    // إذا كان isAPP = false، سيتم استخدام Link العادي (نفس الصفحة)
  };

  const NavItem = ({
    item,
    isActive,
  }: {
    item: (typeof mainNavItems)[0];
    isActive: boolean;
  }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 h-auto py-2 px-3 w-full",
              isCollapsed && "justify-center px-2",
              isActive &&
                "bg-primary/10 text-primary border-r-2 border-primary",
            )}
            asChild={!item.isAPP} // استخدام asChild فقط إذا لم يكن APP
          >
            {item.isAPP ? (
              // إذا كان APP، استخدام button عادي مع onClick
              <div
                onClick={(e) => handleItemClick(item, e)}
                className="cursor-pointer flex items-center w-full"
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                {!isCollapsed && (
                  <div className="flex flex-col items-start ml-3">
                    <span className="text-sm font-medium">{item.label}</span>
                    {!isShortScreen && (
                      <span className="text-xs text-muted-foreground hidden md:inline-block">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // إذا لم يكن APP، استخدام Link العادي
              <Link
                href={(() => {
                  // التحقق من المسارات المباشرة (بدون dashboard)
                  if (item.isDirectPath) {
                    return item.path;
                  }

                  // التحقق من وجود dashboard في بداية المسار
                  if (item.path.startsWith("/dashboard")) {
                    // إذا كان موجود، إزالته
                    return item.path;
                  } else if (item.path.startsWith("/")) {
                    // إذا كان يبدأ بـ /، إضافة dashboard قبل /
                    return `/dashboard${item.path}`;
                  } else {
                    // إذا لم يكن يبدأ بـ /، إضافة dashboard/ والـ slug
                    return `/dashboard/${item.path}`;
                  }
                })()}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.label}</span>
                    {!isShortScreen && (
                      <span className="text-xs text-muted-foreground hidden md:inline-block">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )}
          </Button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="left">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
              {item.isAPP && (
                <p className="text-xs text-blue-500">يفتح في تبويب جديد</p>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  const SidebarContent = () => {
    const userData = useAuthStore.getState().userData;

    return (
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <div className="flex h-14 items-center border-b px-4 md:h-[60px] flex-shrink-0">
          <div className="flex flex-col w-full">
            <span className="text-lg font-semibold truncate">
              {userData?.company_name}
            </span>
            {userData?.domain && userData.domain.trim() !== "" && (
              <span className="text-xs text-gray-500 truncate">
                {userData.domain}
              </span>
            )}
          </div>
        </div>

        <div className="px-3 flex-shrink-0">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-foreground transition-all duration-200"
                  onClick={() => {
                    const userData = useAuthStore.getState().userData;
                    console.log("🔗 Full userData:", userData);
                    console.log("🔗 Domain from userData:", userData?.domain);

                    // التحقق من وجود userData
                    if (!userData) {
                      console.warn("userData is null or undefined");
                      alert("يرجى تسجيل الدخول أولاً");
                      return;
                    }

                    const domain = userData?.domain || "";

                    // التحقق من صحة الـ domain
                    if (!domain || domain.trim() === "") {
                      alert("يرجى إعداد domain صحيح في إعدادات الحساب");
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
                      alert("URL غير صحيح. يرجى التحقق من إعدادات الـ domain");
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  {!isCollapsed && <span>معاينة الموقع</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>فتح الموقع في نافذة جديدة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className={cn(
            "flex-1 py-2 px-1 overflow-y-auto overflow-x-hidden min-h-0",
            isVeryShortScreen && "hide-scrollbar",
          )}
        >
          {error && (
            <div className="px-3 py-2">
              <span className="text-sm text-red-500">{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-1">
              {/* العناصر الثلاثة الأولى */}
              {mainNavItems.slice(0, 3).map((item: any) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={
                    activeTab
                      ? currentTab === item.id && activeTab === item.id
                      : internalActiveTab === item.id
                  }
                />
              ))}

              {/* إدارة العقارات - Collapsible Section with Framer Motion (الرابط الرابع) */}
              <div>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setIsPropertyManagementOpen(!isPropertyManagementOpen)}
                        className={cn(
                          "justify-start gap-3 h-auto py-2 px-3 w-full",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">إدارة العقارات</span>
                            <motion.div
                              animate={{
                                rotate: isPropertyManagementOpen ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="left">
                        <p className="font-medium">إدارة العقارات</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {!isCollapsed && (
                  <AnimatePresence>
                    {isPropertyManagementOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pr-8 pl-4 pt-1">
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                          >
                            <Link href="/dashboard/units">
                              <Button
                                variant={
                                  currentPath === "/dashboard/units" ||
                                  currentPath.startsWith("/dashboard/units")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/units" ||
                                    currentPath.startsWith("/dashboard/units")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Home className="h-4 w-4" />
                                <span className="text-sm font-medium">الوحدات</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.2 }}
                          >
                            <Link href="/dashboard/projects">
                              <Button
                                variant={
                                  currentPath === "/dashboard/projects" ||
                                  currentPath.startsWith("/dashboard/projects")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/projects" ||
                                    currentPath.startsWith("/dashboard/projects")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Building2 className="h-4 w-4" />
                                <span className="text-sm font-medium">المشاريع</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                          >
                            <Link href="/dashboard/buildings">
                              <Button
                                variant={
                                  currentPath === "/dashboard/buildings" ||
                                  currentPath.startsWith("/dashboard/buildings")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/buildings" ||
                                    currentPath.startsWith("/dashboard/buildings")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Building className="h-4 w-4" />
                                <span className="text-sm font-medium">العمارات</span>
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* إدارة الموقع - Collapsible Section with Framer Motion */}
              <div>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setIsSiteManagementOpen(!isSiteManagementOpen)}
                        className={cn(
                          "justify-start gap-3 h-auto py-2 px-3 w-full",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">إدارة الموقع</span>
                            <motion.div
                              animate={{
                                rotate: isSiteManagementOpen ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="left">
                        <p className="font-medium">إدارة الموقع</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {!isCollapsed && (
                  <AnimatePresence>
                    {isSiteManagementOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pr-8 pl-4 pt-1">
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                          >
                            <Link href="/dashboard/site-settings">
                              <Button
                                variant={
                                  currentPath === "/dashboard/site-settings" ||
                                  currentPath.startsWith("/dashboard/site-settings")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/site-settings" ||
                                    currentPath.startsWith("/dashboard/site-settings")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Settings className="h-4 w-4" />
                                <span className="text-sm font-medium">إعدادات الموقع</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.2 }}
                          >
                            <Link href="/dashboard/design-editor">
                              <Button
                                variant={
                                  currentPath === "/dashboard/design-editor" ||
                                  currentPath.startsWith("/dashboard/design-editor")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/design-editor" ||
                                    currentPath.startsWith("/dashboard/design-editor")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <LayoutTemplate className="h-4 w-4" />
                                <span className="text-sm font-medium">تعديل تصميم الموقع</span>
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* إدارة العملاء - Collapsible Section with Framer Motion */}
              <div>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setIsCustomerManagementOpen(!isCustomerManagementOpen)}
                        className={cn(
                          "justify-start gap-3 h-auto py-2 px-3 w-full",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <Users className="h-5 w-5 text-muted-foreground" />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">إدارة العملاء</span>
                            <motion.div
                              animate={{
                                rotate: isCustomerManagementOpen ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="left">
                        <p className="font-medium">إدارة العملاء</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {!isCollapsed && (
                  <AnimatePresence>
                    {isCustomerManagementOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pr-8 pl-4 pt-1">
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                          >
                            <Link href="/dashboard/crm">
                              <Button
                                variant={
                                  currentPath === "/dashboard/crm" ||
                                  currentPath.startsWith("/dashboard/crm")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/crm" ||
                                    currentPath.startsWith("/dashboard/crm")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <UserCog className="h-4 w-4" />
                                <span className="text-sm font-medium">CRM</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.2 }}
                          >
                            <Link href="/dashboard/customers">
                              <Button
                                variant={
                                  currentPath === "/dashboard/customers" ||
                                  currentPath.startsWith("/dashboard/customers")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/customers" ||
                                    currentPath.startsWith("/dashboard/customers")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-medium">إدارة العملاء</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                          >
                            <Link href="/dashboard/property-requests">
                              <Button
                                variant={
                                  currentPath === "/dashboard/property-requests" ||
                                  currentPath.startsWith("/dashboard/property-requests")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/property-requests" ||
                                    currentPath.startsWith("/dashboard/property-requests")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="text-sm font-medium">طلبات العملاء</span>
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* التطبيقات - Collapsible Section with Framer Motion */}
              <div>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setIsAppsManagementOpen(!isAppsManagementOpen)}
                        className={cn(
                          "justify-start gap-3 h-auto py-2 px-3 w-full",
                          isCollapsed && "justify-center px-2",
                        )}
                      >
                        <Download className="h-5 w-5 text-muted-foreground" />
                        {!isCollapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">التطبيقات</span>
                            <motion.div
                              animate={{
                                rotate: isAppsManagementOpen ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="left">
                        <p className="font-medium">التطبيقات</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {!isCollapsed && (
                  <AnimatePresence>
                    {isAppsManagementOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pr-8 pl-4 pt-1">
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                          >
                            <Link href="/dashboard/apps">
                              <Button
                                variant={
                                  currentPath === "/dashboard/apps" ||
                                  currentPath.startsWith("/dashboard/apps")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/apps" ||
                                    currentPath.startsWith("/dashboard/apps")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Download className="h-4 w-4" />
                                <span className="text-sm font-medium">صفحة التطبيقات</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.2 }}
                          >
                            <Link href="/dashboard/apps/pixels">
                              <Button
                                variant={
                                  currentPath === "/dashboard/apps/pixels" ||
                                  currentPath.startsWith("/dashboard/apps/pixels")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/apps/pixels" ||
                                    currentPath.startsWith("/dashboard/apps/pixels")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <Code className="h-4 w-4" />
                                <span className="text-sm font-medium">صفحة الـ Pixels</span>
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.2 }}
                          >
                            <Link href="/dashboard/whatsapp-center">
                              <Button
                                variant={
                                  currentPath === "/dashboard/whatsapp-center" ||
                                  currentPath.startsWith("/dashboard/whatsapp-center")
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={cn(
                                  "justify-start gap-3 h-auto py-2 px-3 w-full",
                                  (currentPath === "/dashboard/whatsapp-center" ||
                                    currentPath.startsWith("/dashboard/whatsapp-center")) &&
                                    "bg-primary/10 text-primary border-r-2 border-primary",
                                )}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-sm font-medium">صفحة الواتساب</span>
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* باقي العناصر (من الرابع فما فوق) */}
              {mainNavItems.slice(3).map((item: any) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={
                    activeTab
                      ? currentTab === item.id && activeTab === item.id
                      : internalActiveTab === item.id
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={cn(
          "hidden min-[1200px]:flex flex-col border-l bg-background transition-all duration-300 z-40 sticky top-16 h-[calc(100vh-4rem)]",
          isCollapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
