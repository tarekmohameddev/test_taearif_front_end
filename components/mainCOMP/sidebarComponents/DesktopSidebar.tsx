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
import { getLocaleFromPathname, removeLocaleFromPathname } from "@/lib/i18n/config";
import { getPreviewSiteUrl } from "@/lib/utils/previewDomain";

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

const USER_STORAGE_KEY = "user";

function getStoredUserFromStorage(): {
  company_name: string | null;
  domain: string | null;
} {
  if (typeof window === "undefined") return { company_name: null, domain: null };
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return { company_name: null, domain: null };
    const parsed = JSON.parse(raw);
    return {
      company_name: parsed?.company_name ?? null,
      domain: parsed?.domain ?? null,
    };
  } catch {
    return { company_name: null, domain: null };
  }
}

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

  const userData = useAuthStore((s) => s.userData);

  // state من API: تُملأ عند وصول بيانات المستخدم من الـ API
  const [apiUserDisplay, setApiUserDisplay] = useState<{
    company_name: string | null;
    domain: string | null;
  }>({ company_name: null, domain: null });

  // انتظار بيانات الـ user من الـ API ثم تعيينها في الـ state
  useEffect(() => {
    if (!userData) return;
    setApiUserDisplay({
      company_name: userData.company_name ?? null,
      domain: userData.domain ?? null,
    });
  }, [userData?.company_name, userData?.domain]);

  // تحديد العنصر النشط بناءً على المسار الحالي
  const currentPath = pathname || "/";
  const currentPathWithoutLocale = removeLocaleFromPathname(currentPath);

  // تحديث العنصر النشط عند تغيير المسار
  useEffect(() => {
    const computed =
      activeTab ||
      (currentPathWithoutLocale.startsWith("/dashboard") ? "dashboard" : "dashboard");
    setInternalActiveTab(computed);
    if (typeof setActiveTab === "function") {
      setActiveTab(computed);
    }
  }, [currentPathWithoutLocale, activeTab, setActiveTab]);

  const isActivePath = (href: string) => {
    // إذا كان المسار يطابق تماماً
    if (currentPathWithoutLocale === href) {
      return true;
    }
    
    // إذا كان المسار يبدأ بـ href + "/"
    if (currentPathWithoutLocale.startsWith(href + "/")) {
      // إذا كان href = "/dashboard"، يجب أن يكون المسار /dashboard بالضبط فقط
      if (href === "/dashboard") {
        return false;
      }
      
      // للروابط الأخرى، التحقق من عدم وجود رابط آخر في القائمة يطابق بشكل أفضل
      const hasBetterMatch = staticMenuItems.some(
        (item) =>
          item.path !== href &&
          item.path.startsWith(href + "/") &&
          currentPathWithoutLocale.startsWith(item.path)
      );
      
      return !hasBetterMatch;
    }
    
    return false;
  };

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
                  "bg-gray-100 text-primary border-r-2 border-primary",
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
    const stored = getStoredUserFromStorage();
    const displayCompanyName =
      apiUserDisplay.company_name || stored.company_name || "";
    const displayDomain =
      apiUserDisplay.domain || stored.domain || "";

    return (
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <div className="flex h-14 items-center border-b px-4 md:h-[60px] flex-shrink-0">
          <div className="flex flex-col w-full">
            <span className="text-lg font-semibold truncate">
              {displayCompanyName}
            </span>
            {displayDomain.trim() !== "" && (
              <span className="text-xs text-gray-500 truncate">
                {displayDomain}
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
                    const domain = displayDomain;

                    if (!domain || domain.trim() === "") {
                      alert("يرجى إعداد domain صحيح في إعدادات الحساب");
                      return;
                    }

                    const cleanDomain = domain.trim();

                    if (
                      !cleanDomain.includes(".") &&
                      !cleanDomain.startsWith("http")
                    ) {
                      alert(
                        "تنسيق الـ domain غير صحيح. يجب أن يحتوي على نقطة (مثل: example.com) أو يكون URL صحيح",
                      );
                      return;
                    }

                    const localePath = `/${getLocaleFromPathname(pathname)}`;
                    const url = getPreviewSiteUrl(cleanDomain, localePath);

                    try {
                      new URL(url);
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
