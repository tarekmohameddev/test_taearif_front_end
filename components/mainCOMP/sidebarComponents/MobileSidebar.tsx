"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/context/AuthContext";
import useStore from "@/context/Store";
import { staticMenuItems, type MainNavItem } from "./menu-items";

interface MobileSidebarProps {
  children: React.ReactNode; // Menu trigger button
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function MobileSidebar({
  children,
  activeTab,
  setActiveTab,
}: MobileSidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const { userData } = useAuthStore();
  const { sidebarData } = useStore();
  const { mainNavItems, error } = sidebarData;

  // تحديد العنصر النشط بناءً على المسار الحالي
  const currentPath = pathname || "/";
  const isContentSection = currentPath.startsWith("/content");
  const isLiveEditorSection = currentPath.startsWith("/live-editor");
  const currentTab =
    isContentSection
      ? "content"
      : isLiveEditorSection
        ? "live-editor"
        : mainNavItems.find(
            (item: MainNavItem) =>
              item.path === currentPath ||
              (item.path !== "/" && currentPath.startsWith(item.path)),
          )?.id || activeTab || "dashboard";

  // Use static menu items if mainNavItems is empty or not loaded
  const menuItemsToUse =
    mainNavItems && mainNavItems.length > 0 ? mainNavItems : staticMenuItems;

  // دالة للتعامل مع النقر على العنصر
  const handleItemClick = (item: MainNavItem, e: any) => {
    if (item.isAPP) {
      e.preventDefault();
      const token = useAuthStore.getState().token;
      const url = `${item.path}?token=${token}`;
      window.open(url, "_blank");
    }
  };

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
                    (item.path !== "/" && currentPath.startsWith(item.path));
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
  );
}
