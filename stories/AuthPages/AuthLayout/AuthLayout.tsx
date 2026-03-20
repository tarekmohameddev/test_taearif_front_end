"use client";

import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import {
  AUTH_KEYS,
  AUTH_FEATURE_FALLBACKS_AR,
  AUTH_FEATURE_KEYS,
  AUTH_LAYOUT_ASSET_URLS,
  AUTH_LAYOUT_SOCIAL_URLS,
  FALLBACKS_AR,
} from "./data";
import type { AuthLayoutProps } from "./AuthLayout.types";

export default function AuthLayout({ children }: AuthLayoutProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);

  const brandName = t(AUTH_KEYS.brand_name);
  const title = t(AUTH_KEYS.title);
  const subtitle = t(AUTH_KEYS.subtitle);
  const copyright = t(AUTH_KEYS.copyright);

  const features = AUTH_FEATURE_KEYS.map((key) => t(key));

  const resolvedBrand =
    brandName === AUTH_KEYS.brand_name ? FALLBACKS_AR.brand_name : brandName;
  const resolvedTitle = title === AUTH_KEYS.title ? FALLBACKS_AR.title : title;
  const resolvedSubtitle =
    subtitle === AUTH_KEYS.subtitle ? FALLBACKS_AR.subtitle : subtitle;
  const resolvedCopyright =
    copyright === AUTH_KEYS.copyright ? FALLBACKS_AR.copyright : copyright;

  const resolvedFeatures = features.map((f, i) =>
    f === AUTH_FEATURE_KEYS[i] ? AUTH_FEATURE_FALLBACKS_AR[i] : f,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div
        dir={dir}
        className="relative hidden md:flex flex-col p-10 pt-28 items-center justify-center h-full bg-[#49A093]"
      >
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-bottom opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url('${AUTH_LAYOUT_ASSET_URLS.buildingBg}')`,
          }}
          aria-hidden
        />
        <div className="relative flex flex-col flex-1 justify-between w-full">
          <div className="flex flex-col items-center text-start space-y-6">
            <header className="flex flex-col items-center gap-2">
              <img
                src={AUTH_LAYOUT_ASSET_URLS.logo}
                alt={resolvedBrand}
                className="h-28 w-auto object-contain"
              />
            </header>

            <h1 className="text-[#FFFFFF] font-bold text-2xl md:text-3xl leading-tight text-start">
              {resolvedTitle}
            </h1>

            <p className="text-[#EFEFEF] text-sm md:text-base text-start">
              {resolvedSubtitle}
            </p>

            <ul className="space-y-3 w-full list-none pe-0 text-start">
              {resolvedFeatures.map((text) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-[#FFFFFF] text-sm md:text-base"
                >
                  <span
                    className="shrink-0 w-2 h-2 rounded-full bg-[#B5FCCF]"
                    aria-hidden
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <footer className="text-[#FFFFFF] text-xs md:text-sm mt-8">
            {resolvedCopyright}
          </footer>
        </div>
      </div>
      <div
        dir={dir}
        className="relative flex flex-col items-center justify-center min-h-full bg-[#F7F7F7] p-6"
      >
        {children}

        {/* Social icons at bottom-start */}
        <div className="absolute bottom-6 end-6 flex items-center gap-3">
          <a
            href="#"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#49A093] hover:bg-[#49A093]/10 transition-colors"
            aria-label="Instagram"
          >
            <img
              src={AUTH_LAYOUT_SOCIAL_URLS.instagram}
              alt="Instagram"
              className="w-4 h-4"
            />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#49A093] hover:bg-[#49A093]/10 transition-colors"
            aria-label="Facebook"
          >
            <img
              src={AUTH_LAYOUT_SOCIAL_URLS.facebook}
              alt="Facebook"
              className="w-4 h-4"
            />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#49A093] hover:bg-[#49A093]/10 transition-colors"
            aria-label="LinkedIn"
          >
            <img
              src={AUTH_LAYOUT_SOCIAL_URLS.linkedin}
              alt="LinkedIn"
              className="w-4 h-4"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
