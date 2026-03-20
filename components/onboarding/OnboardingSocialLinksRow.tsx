"use client";

import { type ReactNode } from "react";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const SOCIAL_ICON_COLOR = "#4F9E8E";

export type OnboardingSocialLinks = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
};

function SocialIconButton({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  const inner = (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white shadow-sm">
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex shrink-0 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F9E8E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F9E8E]"
      >
        {inner}
      </a>
    );
  }

  return (
    <span className="inline-flex shrink-0" aria-label={label}>
      {inner}
    </span>
  );
}

export function OnboardingSocialLinksRow({ links }: { links: OnboardingSocialLinks }) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3"
      role="group"
      aria-label="وسائل التواصل الاجتماعي"
    >
      <SocialIconButton href={links.instagram} label="إنستغرام">
        <FaInstagram
          className="h-[22px] w-[22px]"
          style={{ color: SOCIAL_ICON_COLOR }}
          aria-hidden
        />
      </SocialIconButton>
      <SocialIconButton href={links.facebook} label="فيسبوك">
        <FaFacebook
          className="h-[22px] w-[22px]"
          style={{ color: SOCIAL_ICON_COLOR }}
          aria-hidden
        />
      </SocialIconButton>
      <SocialIconButton href={links.linkedin} label="لينكد إن">
        <FaLinkedinIn
          className="h-[22px] w-[22px]"
          style={{ color: SOCIAL_ICON_COLOR }}
          aria-hidden
        />
      </SocialIconButton>
    </div>
  );
}
