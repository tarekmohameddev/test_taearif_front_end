"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronDown, 
  ChevronRight,
  Home,
  Info,
  Briefcase,
  Phone,
  Building2,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: Array<{
    id?: string;
    text?: string;
    name?: string;
    url?: string;
    path?: string;
    icon?: string;
    submenu?: any[];
  }>;
  logo?: {
    image?: string;
    text?: string;
    url?: string;
  };
  branding?: {
    accent?: string;
    text?: string;
    background?: string;
  };
  actions?: {};
  side?: "left" | "right";
  /** Sidebar (الجوال) styling - applied only to the mobile sidebar panel */
  sidebarBackground?: {
    type?: "color" | "image";
    color?: string;
    image?: string;
    imageOpacity?: number;
  };
  showLogo?: boolean;
  showCompanyName?: boolean;
  textColors?: {
    heading?: string;
    link?: string;
    text?: string;
  };
  overlay?: {
    color?: string;
    opacity?: number;
  };
}

const SidebarMenu = ({
  isOpen,
  onClose,
  menuItems,
  logo,
  branding,
  actions,
  side = "right",
  sidebarBackground,
  showLogo = true,
  showCompanyName = true,
  textColors,
  overlay,
}: SidebarMenuProps) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const hasHeaderContent = showLogo || showCompanyName;
  const overlayBg =
    overlay?.color != null
      ? (() => {
          const o = overlay?.opacity ?? 0.4;
          if (typeof o === "number" && o < 1 && overlay.color?.startsWith?.("#")) {
            const hex = overlay.color.replace("#", "");
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${o})`;
          }
          return overlay.color;
        })()
      : overlay?.opacity != null
        ? `rgba(0,0,0,${overlay.opacity})`
        : null;
  const overlayStyle = overlayBg != null ? { backgroundColor: overlayBg } : undefined;

  const isImageBg = sidebarBackground?.type === "image" && sidebarBackground?.image;
  // imageOpacity: 0-100% (stored as number). Convert to CSS 0-1. Backward compat: values ≤1 treated as 0-1.
  const rawOpacity = sidebarBackground?.imageOpacity ?? 100;
  const imageOpacity = isImageBg
    ? (rawOpacity <= 1 ? rawOpacity : rawOpacity / 100)
    : 1;
  const panelBgColor =
    sidebarBackground?.type === "color" && sidebarBackground?.color
      ? sidebarBackground.color
      : undefined;
  const panelStyle: React.CSSProperties =
    panelBgColor != null
      ? { backgroundColor: panelBgColor }
      : isImageBg
        ? { backgroundColor: "transparent" }
        : { backgroundColor: "#ffffff" };
  const headingColor = textColors?.heading;
  const linkColor = textColors?.link;
  const textColor = textColors?.text;

  // Filter out unwanted menu items and empty items
  const filteredMenuItems = menuItems.filter((item) => {
    // Remove empty or invalid items
    if (!item || (!item?.text && !item?.name && !item?.id)) {
      return false;
    }
    const text = (item.text || item.name || "").toLowerCase();
    return !text.includes("حسابي") && 
           !text.includes("المفضلة") && 
           !text.includes("تسجيل الخروج") &&
           !text.includes("account") &&
           !text.includes("favorite") &&
           !text.includes("logout");
  });

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getIcon = (item: any) => {
    if (item.text?.includes("رئيسية") || item.name?.includes("Home")) return <Home className="w-5 h-5" />;
    if (item.text?.includes("حول") || item.name?.includes("About")) return <Info className="w-5 h-5" />;
    if (item.text?.includes("خدمات") || item.name?.includes("Services")) return <Briefcase className="w-5 h-5" />;
    if (item.text?.includes("اتصل") || item.name?.includes("Contact")) return <Phone className="w-5 h-5" />;
    if (item.text?.includes("عقارات") || item.name?.includes("Properties")) return <Building2 className="w-5 h-5" />;
    if (item.text?.includes("المواقع") || item.name?.includes("Locations")) return <MapPin className="w-5 h-5" />;
    
    return <ChevronRight className="w-4 h-4 opacity-50" />;
  };

  const MenuItem = ({ item, depth = 0, uniqueKey }: { item: any, depth: number, uniqueKey: string }) => {
    const hasSubmenu = item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0;
    const itemUrl = item.url || item.path || "#";
    const isActive = pathname === itemUrl;
    const rawItemId = item.id || item.text || item.name || uniqueKey || `item-${Date.now()}-${Math.random()}`;
    const itemId = rawItemId ? rawItemId.toString().trim() : uniqueKey || `item-${Date.now()}-${Math.random()}`;
    const finalItemId = itemId || uniqueKey || `item-${Date.now()}-${Math.random()}`;
    const isOpenSub = openSubmenus[finalItemId];

    return (
      <div className="w-full">
        {hasSubmenu ? (
          <div className="flex flex-col">
            <button
              onClick={() => toggleSubmenu(finalItemId)}
              className={cn(
                "flex items-center justify-between w-full py-3 px-4 transition-all duration-300 rounded-xl group",
                isOpenSub ? "bg-stone-50" : "hover:bg-stone-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn("p-2 rounded-lg transition-colors", isOpenSub && "bg-stone-100")}
                  style={{ color: isOpenSub ? linkColor ?? "#1c1917" : linkColor ?? "#78716c" }}
                >
                  {getIcon(item)}
                </span>
                <span
                  className="text-lg font-medium transition-colors"
                  style={{ color: isOpenSub ? linkColor ?? "#1c1917" : linkColor ?? "#44403c" }}
                >
                  {item.text || item.name}
                </span>
              </div>
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-300", isOpenSub && "rotate-180")}
                style={{ color: linkColor ?? "#a8a29e" }}
              />
            </button>
            <AnimatePresence>
              {isOpenSub && (
                <motion.div
                  key={`submenu-${finalItemId}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-r-2 border-stone-100 mr-8 mt-1 space-y-1"
                >
                  {item.submenu.flatMap((sub: any, idx: number) => {
                    // Normalize submenu structure (sometimes nested in 'items')
                    const items = sub.items && Array.isArray(sub.items) ? sub.items : [sub];
                    return items.map((subItem: any, sIdx: number) => {
                      const rawId = subItem.id || subItem.text || subItem.name || subItem.url || subItem.path || `sub-${idx}-${sIdx}`;
                      const subItemId = rawId ? rawId.toString().trim() : `sub-${idx}-${sIdx}`;
                      const finalId = subItemId || `sub-${idx}-${sIdx}-${Date.now()}-${Math.random()}`;
                      const subUniqueKey = `${uniqueKey}-sub-${idx}-${sIdx}-${finalId}`;
                      return (
                        <MenuItem key={subUniqueKey} item={subItem} depth={depth + 1} uniqueKey={subUniqueKey} />
                      );
                    });
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href={itemUrl}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 py-3 px-4 transition-all duration-300 rounded-xl group relative overflow-hidden",
              isActive ? "text-white" : "hover:bg-stone-50"
            )}
            style={
              isActive
                ? { backgroundColor: linkColor ?? "#1c1917" }
                : { color: linkColor ?? "#44403c" }
            }
          >
            <span
              className={cn("p-2 rounded-lg transition-colors", isActive && "text-white")}
              style={!isActive ? { color: linkColor ?? "#78716c" } : undefined}
            >
              {getIcon(item)}
            </span>
            <span className="text-lg font-medium">{item.text || item.name}</span>
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute left-2 w-1.5 h-6 bg-white rounded-full"
              />
            )}
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-[100]"
            style={overlayStyle ?? { backgroundColor: "rgba(41, 37, 36, 0.4)" }}
          />
        )}

        {isOpen && (
          <motion.div
            key="sidebar-menu"
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 w-full max-w-[360px] z-[101] shadow-2xl flex flex-col overflow-hidden",
              side === "right" ? "right-0" : "left-0"
            )}
            style={panelStyle}
            dir="rtl"
          >
            {isImageBg && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${sidebarBackground!.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: imageOpacity,
                }}
                aria-hidden
              />
            )}
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
            {/* Header: logo + company name or close only */}
            <div className="p-6 flex items-center justify-between border-b border-stone-100 shrink-0">
              {hasHeaderContent ? (
                <div className="flex items-center gap-3">
                  {showLogo && logo?.image ? (
                    <img src={logo.image} alt={logo.text || "Logo"} className="h-10 w-auto object-contain" />
                  ) : showLogo && !logo?.image ? (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: linkColor ?? "#1c1917" }}
                    >
                      {logo?.text?.charAt(0) || "A"}
                    </div>
                  ) : null}
                  {showCompanyName ? (
                    <span
                      className="font-bold text-xl tracking-tight"
                      style={{ color: headingColor ?? textColor ?? "#1c1917" }}
                    >
                      {logo?.text || "العقارية"}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div />
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors group"
                style={{ color: textColor ?? "#78716c" }}
              >
                <X className="w-6 h-6 group-hover:opacity-100" style={{ color: "inherit" }} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
              <div className="px-4 mb-4">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: headingColor ?? "#a8a29e" }}
                >
                  القائمة الرئيسية
                </p>
              </div>
              {filteredMenuItems.map((item, index) => {
                const rawId = item.id || item.url || item.path || item.text || item.name || `item-${index}`;
                const itemUniqueId = rawId ? rawId.toString().trim() : `item-${index}`;
                const finalId = itemUniqueId || `item-${index}-${Date.now()}-${Math.random()}`;
                const uniqueKey = `menu-${index}-${finalId}`;
                return (
                  <MenuItem key={uniqueKey} item={item} depth={0} uniqueKey={uniqueKey} />
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-stone-100 bg-stone-50/50">
              <div className="text-center">
                <p
                  className="text-[10px] font-medium"
                  style={{ color: textColor ?? "#a8a29e" }}
                >
                  © 2026 جميع الحقوق محفوظة
                </p>
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e7e5e4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d6d3d1;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};

export default SidebarMenu;
