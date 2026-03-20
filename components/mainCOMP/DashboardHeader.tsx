"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useAuthStore from "@/context/AuthContext";
import { getLocaleFromPathname, removeLocaleFromPathname } from "@/lib/i18n/config";
import { getPreviewSiteUrl } from "@/lib/utils/previewDomain";
import {
  staticMenuItems,
  type MainNavItem,
} from "@/components/mainCOMP/sidebarComponents/menu-items";

function isActivePath(pathWithoutLocale: string, href: string, items: MainNavItem[]) {
  if (pathWithoutLocale === href) return true;
  if (pathWithoutLocale.startsWith(href + "/")) {
    if (href === "/dashboard") return false;
    const hasBetterMatch = items.some(
      (it) =>
        it.path !== href &&
        it.path.startsWith(href + "/") &&
        pathWithoutLocale.startsWith(it.path),
    );
    return !hasBetterMatch;
  }
  return false;
}

function pageTitleForPath(pathWithoutLocale: string): string {
  const matches = staticMenuItems.filter((item) =>
    isActivePath(pathWithoutLocale, item.path, staticMenuItems),
  );
  if (matches.length > 0) {
    matches.sort((a, b) => b.path.length - a.path.length);
    return matches[0].label;
  }
  const segments = pathWithoutLocale.split("/").filter(Boolean);
  const tail = segments[segments.length - 1];
  if (tail && tail !== "dashboard") {
    return tail.replace(/-/g, " ");
  }
  return "لوحة التحكم";
}

function openTenantSite(pathname: string) {
  const userData = useAuthStore.getState().userData;
  if (!userData) {
    alert("يرجى تسجيل الدخول أولاً");
    return;
  }
  const domain = userData.domain || "";
  if (!domain.trim()) {
    alert("يرجى إعداد domain صحيح في إعدادات الحساب");
    return;
  }
  const clean = domain.trim();
  if (!clean.includes(".") && !clean.startsWith("http")) {
    alert(
      "تنسيق الـ domain غير صحيح. يجب أن يحتوي على نقطة (مثل: example.com) أو يكون URL صحيح",
    );
    return;
  }
  const localePath = `/${getLocaleFromPathname(pathname)}`;
  const url = getPreviewSiteUrl(clean, localePath);
  try {
    new URL(url);
    window.open(url, "_blank");
  } catch {
    alert("URL غير صحيح. يرجى التحقق من إعدادات الـ domain");
  }
}

export function DashboardHeader() {
  const pathname = usePathname() || "/";
  const pathWithoutLocale = removeLocaleFromPathname(pathname);

  const title = useMemo(
    () => pageTitleForPath(pathWithoutLocale),
    [pathWithoutLocale],
  );

  const onVisitSite = useCallback(() => {
    openTenantSite(pathname);
  }, [pathname]);

  return (
    <header className="w-full shrink-0 border-b border-gray-200 bg-transparent">
      <div
        className="flex w-full items-center justify-between gap-4 py-2"
        dir="rtl"
      >
        <h1 className="min-w-0 max-w-[55%] shrink truncate text-lg font-semibold text-gray-900 sm:text-[30px]">
          {title}
        </h1>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onVisitSite}
            className="rounded-full border border-[#4F9E8E] bg-white px-4 py-2 text-sm font-medium text-[#3d7d70] shadow-sm transition hover:bg-[#4F9E8E]/10"
          >
            زيارة الموقع
          </button>
          <button
            type="button"
            aria-label="الإشعارات"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Image
              src="/icons/dashboard-bell.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
