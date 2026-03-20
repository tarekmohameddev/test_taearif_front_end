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
  const normalized =
    pathWithoutLocale.replace(/\/+$/, "") || "/";
  if (normalized === "/dashboard") {
    return "الرئيسية";
  }

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
    <header className="flex w-full shrink-0 flex-col bg-transparent px-0 sm:px-8">
      <div
        className="flex w-full items-center justify-center py-2 lg:hidden"
        aria-hidden
      >
        <Image
          src="/logo.svg"
          alt=""
          width={280}
          height={120}
          className="h-10 w-auto max-w-[min(100%,280px)] object-contain object-center "
        />
      </div>

      <div
        className="flex w-full items-center justify-between gap-4 py-2"
        dir="rtl"
      >
        <h1 className="min-w-0 max-w-[55%] shrink truncate py-2 text-lg font-semibold text-gray-900 sm:text-[30px]">
          {title}
        </h1>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onVisitSite}
            className="rounded-full border border-black bg-black px-10 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-900"
          >
            زيارة الموقع
          </button>
          <button
            type="button"
            aria-label="الإشعارات"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Image
              src="/icons/dashboard-bell.svg"
              alt=""
              width={20}
              height={20}
              className="h-8 w-8 object-contain"
            />
          </button>
        </div>
      </div>
      <div
        className="h-px w-full shrink-0 bg-gray-200 mt-2"
        role="separator"
        aria-hidden
      />
    </header>
  );
}
