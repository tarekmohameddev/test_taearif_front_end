"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderMenuItem = {
  id: string;
  text: string;
  url: string;
};

export type StaticHeader1ViewerData = {
  visible?: boolean;
  logo?: {
    text?: string;
    image?: string;
    url?: string;
  };
  colors?: {
    text?: string;
    link?: string;
    linkActive?: string;
    border?: string;
    accent?: string;
  };
  menu?: HeaderMenuItem[];
};

const DEFAULT_DATA: StaticHeader1ViewerData = {
  visible: true,
  logo: {
    text: "الشركة العقارية",
    url: "/",
  },
  colors: {
    text: "#1f2937",
    link: "#374151",
    linkActive: "#059669",
    border: "#e5e7eb",
    accent: "#059669",
  },
  menu: [
    { id: "home", text: "الرئيسية", url: "/" },
    { id: "for-rent", text: "للإيجار", url: "/for-rent" },
    { id: "for-sale", text: "للبيع", url: "/for-sale" },
    { id: "about-us", text: "من نحن", url: "/about-us" },
    { id: "contact-us", text: "تواصل معنا", url: "/contact-us" },
  ],
};

interface StaticHeader1ViewerProps {
  data?: StaticHeader1ViewerData;
  tenantId?: string | null;
}

export default function StaticHeader1Viewer({
  data,
  tenantId,
}: StaticHeader1ViewerProps) {
  const pathname = usePathname();
  const merged: StaticHeader1ViewerData = {
    ...DEFAULT_DATA,
    ...(data || {}),
  };
  const colors = { ...DEFAULT_DATA.colors, ...(merged.colors || {}) };
  const logo = { ...DEFAULT_DATA.logo, ...(merged.logo || {}) };
  const menu = merged.menu || DEFAULT_DATA.menu!;

  if (merged.visible === false) return null;

  const resolveHref = (url: string) => {
    if (!url) return "/";
    if (url.startsWith("http")) return url;
    // لمسارات التينانت، نستخدم slug كما هو (الـ middleware يتكفل بالـ tenant)
    return url === "/" ? "/" : url;
  };

  return (
    <header
      className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b"
      dir="rtl"
      style={{ borderColor: colors.border }}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4">
        {/* Logo */}
        <Link
          href={resolveHref(logo.url || "/")}
          className="flex items-center gap-2"
          style={{ color: colors.text }}
        >
          {logo.image && (
            <img
              src={logo.image}
              alt={logo.text || "Logo"}
              className="h-10 w-auto object-contain"
            />
          )}
          {logo.text && (
            <span className="text-lg font-semibold hidden sm:inline">
              {logo.text}
            </span>
          )}
        </Link>

        {/* Desktop navigation */}
        <nav className="mx-auto hidden items-center gap-6 md:flex">
          {menu.map((item) => {
            const href = resolveHref(item.url);
            const active = pathname === href;
            return (
              <Link
                key={item.id}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative pb-1 text-sm md:text-base font-medium transition-colors",
                  active
                    ? "text-emerald-700"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={{
                  color: active ? colors.linkActive : colors.link,
                }}
              >
                {item.text}
                {active && (
                  <span
                    className="pointer-events-none absolute inset-x-0 -bottom-[4px] mx-auto block h-[2px] w-6 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-transparent ms-auto"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              <Menu className="size-5" />
              <span className="sr-only">فتح القائمة</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72" aria-describedby={undefined}>
            <div className="mt-6 grid gap-2">
              {menu.map((item) => {
                const href = resolveHref(item.url);
                const active = pathname === href;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                      active ? "text-emerald-700" : "text-foreground",
                    )}
                    style={{
                      color: active ? colors.linkActive : colors.link,
                    }}
                  >
                    {item.text}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

