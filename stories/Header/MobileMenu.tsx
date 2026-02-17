import type { MobileMenuProps } from "./Header.types";

/* ------------------------------------------------------------------ */
/*  Mobile Menu — slide-down panel for small screens                   */
/* ------------------------------------------------------------------ */

export const MobileMenu = ({ links, lang, cta }: MobileMenuProps) => (
  <nav className="xl:hidden mt-4 mx-4 rounded-md bg-white/95 backdrop-blur-sm border border-[#e4e4e4] shadow-lg">
    {/* Links */}
    <ul className="flex flex-col px-6 py-4 gap-1">
      {links.map((link, i) => (
        <li key={`m-${link.href}-${i}`}>
          <a
            className={`block py-2 font-bold transition-colors ${
              link.isActive
                ? "text-[#c68957]"
                : "text-[#090909] hover:text-[#c68957]"
            }`}
            href={link.href}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    {/* Bottom bar */}
    <div className="flex items-center gap-4 border-t border-[#e4e4e4] px-6 py-4">
      <button
        onClick={lang.onClick}
        className="text-lg font-bold uppercase text-[#090909] transition-colors hover:text-[#c68957]"
      >
        {lang.label}
      </button>

      <a
        className="inline-flex items-center justify-center rounded-sm bg-[#d09260] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#c68957]"
        href={cta.href}
      >
        {cta.label}
      </a>
    </div>
  </nav>
);
