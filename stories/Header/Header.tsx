"use client";

import { useState } from "react";
import type { HeaderProps } from "./Header.types";
import { Text } from "../Text";
import { HamburgerIcon } from "../assets/HamburgerIcon";
import { CloseIcon } from "../assets/CloseIcon";
import { MobileMenu } from "./MobileMenu";
import {
  DEFAULT_LOGO,
  DEFAULT_NAV_LINKS,
  DEFAULT_LANGUAGE,
  DEFAULT_CTA,
} from "./data";

export const Header = ({
  logo,
  navLinks,
  languageToggle,
  cta,
  navLinkTextProps,
  languageToggleTextProps,
  ctaTextProps,
  dir = "rtl",
}: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const _logo = logo ?? DEFAULT_LOGO;
  const _links = navLinks ?? DEFAULT_NAV_LINKS;
  const _lang = languageToggle ?? DEFAULT_LANGUAGE;
  const _cta = cta ?? DEFAULT_CTA;

  return (
    <header
      dir={dir}
      className="z-50 w-full py-6 absolute left-1/2 -translate-x-1/2 bg-transparent"
    >
      <div className="app flex w-full items-center justify-between">
        {/* ── Logo ─────────────────────────────────── */}
        <a
          className="relative h-12 w-36 shrink-0 lg:h-20 lg:w-52"
          href={_logo.href}
        >
          <img
            src={_logo.src}
            alt={_logo.alt}
            className="inset-0 size-full object-contain"
          />
        </a>

        {/* ── Desktop Navigation ───────────────────── */}
        <div className="hidden items-center gap-4 xl:flex">
          <nav>
            <ul className="flex gap-8">
              {_links.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <a
                    data-active={link.isActive ? "true" : "false"}
                    className="data-[active=true]:text-[#c68957] data-[active=false]:hover:text-[#e9dbd1] text-white transition-colors"
                    href={link.href}
                  >
                    <Text as="span" {...navLinkTextProps}>
                      {link.label}
                    </Text>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Language Toggle */}
          <button
            onClick={_lang.onClick}
            className="flex w-14 items-center justify-center gap-2 whitespace-nowrap rounded-md min-h-9 p-2 px-10 text-white transition-all hover:bg-[#e9dbd1] hover:text-[#c68957]"
          >
            <Text as="span" {...languageToggleTextProps}>
              {_lang.label}
            </Text>
          </button>

          {/* CTA */}
          <a
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-[#d09260] min-h-9 p-2 px-10 text-white transition-all hover:bg-[#c68957]"
            href={_cta.href}
          >
            <Text as="span" {...ctaTextProps}>
              {_cta.label}
            </Text>
          </a>
        </div>

        {/* ── Mobile Menu Trigger ──────────────────── */}
        <div className="xl:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md size-9 transition-all hover:bg-white/10"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile Panel ─────────────────────────── */}
      {mobileOpen && (
        <MobileMenu
          links={_links}
          lang={_lang}
          cta={_cta}
          navLinkTextProps={navLinkTextProps}
          languageToggleTextProps={languageToggleTextProps}
          ctaTextProps={ctaTextProps}
        />
      )}
    </header>
  );
};
