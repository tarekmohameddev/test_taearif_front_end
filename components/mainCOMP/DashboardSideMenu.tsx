"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, User } from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectUserIsLogged } from "@/context/auth/selectors";
import { cn } from "@/lib/utils";
import { getLocaleFromPathname, removeLocaleFromPathname } from "@/lib/i18n/config";
import { getPreviewSiteUrl } from "@/lib/utils/previewDomain";
import {
  staticMenuItems,
  type MainNavItem,
} from "@/components/mainCOMP/sidebarComponents/menu-items";

const USER_STORAGE_KEY = "user";

/** لون خلفية القائمة الجانبية */
const MENU_BG = "#4F9E8E";

const LOGO_SRC = "/images/taearif1column.svg";

/** زخرفة خلفية أسفل القائمة (لا تشغل مساحة في التخطيط) */
const SIDEBAR_DECORATION_SRC = "/onboardingBackground.svg";

function readStoredTenant(): { company_name: string | null; domain: string | null } {
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

function resolveItemHref(item: MainNavItem): string {
  if (item.isDirectPath) return item.path;
  if (item.path.startsWith("/dashboard")) return item.path;
  if (item.path.startsWith("/")) return `/dashboard${item.path}`;
  return `/dashboard/${item.path}`;
}

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

function openPreviewSite(pathname: string) {
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

type NavPanelProps = {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
};

function NavPanel({ pathname, onNavigate, className }: NavPanelProps) {
  const userData = useAuthStore(selectUserData);
  const isLogged = useAuthStore(selectUserIsLogged);
  const stored = readStoredTenant();
  const company = userData?.company_name || stored.company_name || "لوحة التحكم";
  const domain = userData?.domain || stored.domain || "";

  const pathWithoutLocale = removeLocaleFromPathname(pathname || "/");

  const handleAppClick = useCallback(
    (item: MainNavItem, e: React.MouseEvent) => {
      if (!item.isAPP) return;
      e.preventDefault();
      const token = useAuthStore.getState().token;
      const url = `${item.path}?token=${token}`;
      window.open(url, "_blank");
      onNavigate?.();
    },
    [onNavigate],
  );

  return (
    <div
      style={{ backgroundColor: MENU_BG }}
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden text-white",
        className,
      )}
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 justify-center px-4 py-4">
        <Link
          href="/dashboard"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F9E8E] rounded-sm"
          onClick={() => onNavigate?.()}
        >
          <Image
            src={LOGO_SRC}
            alt="تعريف"
            width={123}
            height={99}
            className="h-28 w-auto max-w-[400px] object-contain sm:h-24"
            priority
          />
        </Link>
      </div>

      <div className="shrink-0 p-3">
        <button
          type="button"
          onClick={() => openPreviewSite(pathname)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-[#3d7d70] shadow-sm transition hover:bg-white/95"
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-[#4F9E8E]" />
          معاينة الموقع
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 pt-1">
        {staticMenuItems.map((item) => {
          const active = isActivePath(pathWithoutLocale, item.path, staticMenuItems);
          const Icon = item.icon;
          const href = resolveItemHref(item);

          if (item.isAPP) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleAppClick(item, e)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition",
                  active
                    ? "bg-black/20 text-white ring-1 ring-white/35"
                    : "text-white/85 hover:bg-black/10 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-white" : "text-white/80",
                  )}
                />
                <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={href}
              onClick={() => onNavigate?.()}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition",
                active
                  ? "bg-black/20 text-white ring-1 ring-white/35"
                  : "text-white/85 hover:bg-black/10 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-white" : "text-white/80",
                )}
              />
              <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {isLogged && (
        <footer className="shrink-0 border-t border-white/20 p-3">
          <Link
            href="/dashboard/settings"
            onClick={() => onNavigate?.()}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <User className="h-5 w-5 shrink-0" />
            حسابي
          </Link>
        </footer>
      )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex w-full select-none justify-center"
      >
        <Image
          src={SIDEBAR_DECORATION_SRC}
          alt=""
          width={257}
          height={388}
          sizes="(max-width: 1023px) 100vw, 280px"
          className="h-auto w-full max-h-[min(52vh,460px)] object-contain object-bottom brightness-100 opacity-[0.8]"
        />
      </div>
    </div>
  );
}

export function DashboardSideMenu() {
  const pathname = usePathname() || "/";

  return (
    <aside className="relative hidden w-[280px] shrink-0 lg:flex lg:flex-col lg:self-stretch lg:border-l lg:border-white/25">
      <div className="sticky top-0 flex h-[100dvh] max-h-screen flex-col">
        <NavPanel pathname={pathname} />
      </div>
    </aside>
  );
}
