"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Building2,
  Building,
  Settings,
  LayoutTemplate,
  Users,
  UserCog,
  FileText,
  Download,
  Code,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import useAuthStore from "@/context/AuthContext";

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
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    activeTab || "dashboard",
  );
  const { isShortScreen, isVeryShortScreen } = useScreenHeight();
  
  // Track previous path to prevent unnecessary re-renders
  const previousPathRef = useRef(pathname);

  const { userData, IsLoading: authLoading } = useAuthStore();

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

  // تحديث العنصر النشط عند تغيير المسار
  useEffect(() => {
    // Static sidebar: just keep internal tab in sync with provided activeTab or current path
    const computed =
      activeTab ||
      (currentPath.startsWith("/dashboard") ? "dashboard" : "dashboard");
    setInternalActiveTab(computed);
    if (typeof setActiveTab === "function") {
      setActiveTab(computed);
    }
  }, [currentPath, activeTab, setActiveTab]);

  // Static sidebar: no auto-open logic at all (dropdowns are independent & manual)
  useEffect(() => {
    previousPathRef.current = currentPath;
  }, [currentPath]);

  const isActivePath = (href: string) =>
    currentPath === href || currentPath.startsWith(href + "/");

  const StaticLink = ({
    href,
    title,
    description,
    icon,
  }: {
    href: string;
    title: string;
    description?: string;
    icon: React.ReactNode;
  }) => {
    const isActive = isActivePath(href);
    return (
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
              asChild
            >
              <Link href={href}>
                {icon}
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{title}</span>
                    {!!description && !isShortScreen && (
                      <span className="text-xs text-muted-foreground hidden md:inline-block">
                        {description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="left">
              <div>
                <p className="font-medium">{title}</p>
                {!!description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

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

        <div
          className={cn(
            "flex-1 py-2 px-1 overflow-y-auto overflow-x-hidden min-h-0",
            isVeryShortScreen && "hide-scrollbar",
          )}
        >
          <div className="space-y-1">
            {/* Static top items */}
            <StaticLink
              href="/dashboard"
              title="لوحة التحكم"
              description="لوحة التحكم"
              icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            />
            <StaticLink
              href="/dashboard"
              title="نظره عامه عن الموقع"
              description="نظره عامه عن الموقع"
              icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            />
            <StaticLink
              href="/dashboard/settings"
              title="اعدادات الموقع"
              description="اعدادات الموقع"
              icon={<Settings className="h-5 w-5 text-muted-foreground" />}
            />

            {/* إدارة عملائك - Dropdown */}
            <div>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setIsCustomerManagementOpen(!isCustomerManagementOpen)
                      }
                      className={cn(
                        "justify-start gap-3 h-auto py-2 px-3 w-full",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <Users className="h-5 w-5 text-muted-foreground" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium">
                            ادارة عملائك
                          </span>
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
                      <p className="font-medium">ادارة عملائك</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {!isCollapsed && (
                <motion.div
                  initial={false}
                  animate={{
                    height: isCustomerManagementOpen ? "auto" : 0,
                    opacity: isCustomerManagementOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pr-8 pl-4 pt-1">
                    <StaticLink
                      href="/dashboard/crm"
                      title="CRM"
                      icon={<UserCog className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/dashboard/customers"
                      title="العملاء"
                      icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/dashboard/property-requests"
                      title="طلبات العملاء"
                      icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* إدارة العقارات - Dropdown */}
            <div>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setIsPropertyManagementOpen(!isPropertyManagementOpen)
                      }
                      className={cn(
                        "justify-start gap-3 h-auto py-2 px-3 w-full",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium">
                            إدارة العقارات
                          </span>
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
                <motion.div
                  initial={false}
                  animate={{
                    height: isPropertyManagementOpen ? "auto" : 0,
                    opacity: isPropertyManagementOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pr-8 pl-4 pt-1">
                    <StaticLink
                      href="/dashboard/properties"
                      title="نظره عامه عن العقارات"
                      icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/dashboard/projects"
                      title="المشاريع"
                      icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/dashboard/buildings"
                      title="العمارات"
                      icon={<Building className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* إدارة الموقع - Dropdown */}
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
                <motion.div
                  initial={false}
                  animate={{
                    height: isSiteManagementOpen ? "auto" : 0,
                    opacity: isSiteManagementOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pr-8 pl-4 pt-1">
                    <StaticLink
                      href="/dashboard/settings"
                      title="إعدادات الموقع"
                      icon={<Settings className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/dashboard/content"
                      title="محرر الموقع"
                      icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/dashboard/templates"
                      title="القوالب"
                      icon={<LayoutTemplate className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StaticLink
                      href="/live-editor"
                      title="المحرر المباشر"
                      icon={<LayoutTemplate className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Static bottom items requested */}
            <StaticLink
              href="/dashboard/matching"
              title="مركز توافق الطلبات الذكائي"
              description="احصل على توافق ذكي مع الطلبات"
              icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />}
            />
            <StaticLink
              href="/dashboard/apps"
              title="التطبيقات"
              description="التطبيقات"
              icon={<Code className="h-5 w-5 text-muted-foreground" />}
            />
            <StaticLink
              href="/dashboard/access-control"
              title="ادارة الموظفين"
              description="ادارة الموظفين"
              icon={<Users className="h-5 w-5 text-muted-foreground" />}
            />
            <StaticLink
              href="/dashboard/rental-management"
              title="ادارة الايجارات"
              description="ادارة ايجارتك"
              icon={<Download className="h-5 w-5 text-muted-foreground" />}
            />
          </div>
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
