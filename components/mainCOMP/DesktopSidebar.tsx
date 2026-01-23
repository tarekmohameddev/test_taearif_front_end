"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuthStore from "@/context/AuthContext";
import { staticMenuItems } from "./menu-items";

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

interface DesktopSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function DesktopSidebar({
  activeTab,
  setActiveTab,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    activeTab || "dashboard",
  );
  const { isShortScreen, isVeryShortScreen } = useScreenHeight();

  const { userData } = useAuthStore();

  // تحديد العنصر النشط بناءً على المسار الحالي
  const currentPath = pathname || "/";

  // تحديث العنصر النشط عند تغيير المسار
  useEffect(() => {
    const computed =
      activeTab ||
      (currentPath.startsWith("/dashboard") ? "dashboard" : "dashboard");
    setInternalActiveTab(computed);
    if (typeof setActiveTab === "function") {
      setActiveTab(computed);
    }
  }, [currentPath, activeTab, setActiveTab]);

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
          <div className="space-y-1">
            {/* Static menu items */}
            {staticMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <StaticLink
                  key={item.id}
                  href={item.path}
                  title={item.label}
                  description={item.description}
                  icon={
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "hidden min-[1200px]:flex flex-col border-l bg-background transition-all duration-300 z-40 sticky top-16 h-[calc(100vh-4rem)]",
        isCollapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <SidebarContent />
    </div>
  );
}
