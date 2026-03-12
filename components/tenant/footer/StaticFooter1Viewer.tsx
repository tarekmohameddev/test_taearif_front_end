"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

type QuickLink = { text: string; url: string };
type LegalLink = { text: string; url: string };

export type StaticFooter1ViewerData = {
  visible?: boolean;
  companyName?: string;
  companyTagline?: string;
  companyDescription?: string;
  companyLogo?: string;
  quickLinks?: QuickLink[];
  address?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  copyright?: string;
  legalLinks?: LegalLink[];
  backgroundImage?: string;
};

const DEFAULT_DATA: StaticFooter1ViewerData = {
  visible: true,
  companyName: "اسم الشركة",
  companyTagline: "للخدمات العقارية",
  companyDescription:
    "نقدم لك أفضل الحلول العقارية بخبرة واحترافية لتلبية كافة احتياجاتك في البيع والإيجار مع ضمان تجربة مريحة وموثوقة",
  quickLinks: [
    { text: "الرئيسية", url: "/" },
    { text: "البيع", url: "/for-sale" },
    { text: "الإيجار", url: "/for-rent" },
    { text: "من نحن", url: "/about-us" },
    { text: "تواصل معنا", url: "/contact-us" },
  ],
  address: "المملكة العربية السعودية",
  phone1: "0000",
  phone2: "0000",
  email: "info@example.com",
  copyright:
    "© 2024 الشركة العقارية للخدمات العقارية. جميع الحقوق محفوظة.",
  legalLinks: [
    { text: "سياسة الخصوصية", url: "/privacy" },
    { text: "الشروط والأحكام", url: "/terms" },
  ],
  backgroundImage:
    "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
};

interface StaticFooter1ViewerProps {
  data?: StaticFooter1ViewerData;
}

export default function StaticFooter1Viewer({
  data,
}: StaticFooter1ViewerProps) {
  const merged: StaticFooter1ViewerData = {
    ...DEFAULT_DATA,
    ...(data || {}),
  };

  if (merged.visible === false) return null;

  const quickLinks = merged.quickLinks || DEFAULT_DATA.quickLinks!;
  const legalLinks = merged.legalLinks || DEFAULT_DATA.legalLinks!;

  return (
    <footer className="relative w-full" dir="rtl">
      {/* خلفية بصورة بسيطة */}
      {merged.backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={merged.backgroundImage}
            alt={merged.companyName || "Footer Background"}
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      <div className="relative z-10 px-4 py-12 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* عن المكتب */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {merged.companyLogo ? (
                <Image
                  src={merged.companyLogo}
                  alt={merged.companyName || "Logo"}
                  width={72}
                  height={72}
                  className="rounded-full object-contain"
                />
              ) : (
                <div className="grid size-10 place-items-center rounded-full border border-emerald-500">
                  <MapPin className="size-5" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">
                  {merged.companyName}
                </h3>
                {merged.companyTagline && (
                  <p className="text-sm text-white/80">
                    {merged.companyTagline}
                  </p>
                )}
              </div>
            </div>
            {merged.companyDescription && (
              <p className="text-sm leading-7 text-white/90">
                {merged.companyDescription}
              </p>
            )}
          </div>

          {/* روابط مهمة */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">روابط مهمة</h4>
            <nav className="space-y-3">
              {quickLinks
                .filter((link) => link.url)
                .map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    className="block text-white/90 transition-colors hover:text-white"
                  >
                    {link.text}
                  </Link>
                ))}
            </nav>
          </div>

          {/* معلومات التواصل */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">معلومات التواصل</h4>
            <div className="space-y-3">
              {merged.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5" />
                  <span className="text-sm text-white/90">
                    {merged.address}
                  </span>
                </div>
              )}
              {(merged.phone1 || merged.phone2) && (
                <div className="flex items-center gap-3">
                  <Phone className="size-5" />
                  <div className="space-y-1">
                    {merged.phone1 && (
                      <a
                        href={`tel:${merged.phone1}`}
                        className="block text-sm text-white/90"
                      >
                        {merged.phone1}
                      </a>
                    )}
                    {merged.phone2 && (
                      <a
                        href={`tel:${merged.phone2}`}
                        className="block text-sm text-white/90"
                      >
                        {merged.phone2}
                      </a>
                    )}
                  </div>
                </div>
              )}
              {merged.email && (
                <div className="flex items-center gap-3">
                  <Mail className="size-5" />
                  <a
                    href={`mailto:${merged.email}`}
                    className="text-sm text-white/90"
                  >
                    {merged.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* خط الفصل وحقوق الطبع */}
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-white/70 md:flex-row md:text-right">
            {merged.copyright && (
              <p className="text-xs md:text-sm">{merged.copyright}</p>
            )}
            {legalLinks.length > 0 && (
              <div className="flex gap-4">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    className="text-xs hover:text-white"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

