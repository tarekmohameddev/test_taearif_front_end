import type { FooterProps } from "./Footer.types";
import { LocationIcon } from "../assets/LocationIcon";
import { EmailIcon } from "../assets/EmailIcon";
import {
  DEFAULT_LOGO,
  DEFAULT_ADDRESS,
  DEFAULT_EMAIL,
  DEFAULT_LINKS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_COPYRIGHT,
} from "./data";

export const Footer = ({
  logo,
  address,
  email,
  links,
  linksHeading = "الروابط",
  socialLinks,
  socialHeading = "تابعنا",
  copyright,
  dir = "rtl",
}: FooterProps) => {
  const _logo = logo ?? DEFAULT_LOGO;
  const _address = address ?? DEFAULT_ADDRESS;
  const _email = email ?? DEFAULT_EMAIL;
  const _links = links ?? DEFAULT_LINKS;
  const _socials = socialLinks ?? DEFAULT_SOCIAL_LINKS;
  const _copyright = copyright ?? DEFAULT_COPYRIGHT;

  return (
    <footer
      dir={dir}
      className="app pt-14 flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:justify-between"
    >
      {/* Logo */}
      <a href={_logo.href} className="h-32 w-xs max-w-full">
        <img
          src={_logo.src}
          alt={_logo.alt}
          className="size-full object-contain z-50"
        />
      </a>

      {/* Contact Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <LocationIcon />
          <div className="leading-5 [&>span]:block">
            <span className="font-bold">{_address.label}</span>
            <span>{_address.value}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EmailIcon />
          <span>{_email}</span>
        </div>
      </div>

      {/* Links */}
      <div>
        <span className="font-bold">{linksHeading}</span>
        <ul className="mt-6 flex flex-col gap-3">
          {_links.map((link, i) => (
            <li key={`${link.href}-${i}`}>
              <a
                href={link.href}
                className="transition-colors hover:text-[#c68957]"
              >
                {link.label}{" "}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Social */}
      <div>
        <span className="font-bold">{socialHeading}</span>
        <ul className="mt-6 flex gap-8">
          {_socials.map((social, i) => (
            <li key={`${social.platform}-${i}`}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.platform} url`}
                className="transition-colors hover:text-[#c68957]"
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Copyright */}
      <div className="basis-full border-t border-black p-4 text-center">
        <span>{_copyright}</span>
      </div>
    </footer>
  );
};
