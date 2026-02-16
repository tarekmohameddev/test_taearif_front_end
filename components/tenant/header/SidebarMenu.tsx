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
  Globe,
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
  actions?: {
    logout?: {
      enabled?: boolean;
      text?: string;
      onLogout?: () => void;
    };
    language?: {
      enabled?: boolean;
      current?: string;
      onToggle?: () => void;
    };
  };
  side?: "left" | "right";
}

const SidebarMenu = ({
  isOpen,
  onClose,
  menuItems,
  logo,
  branding,
  actions,
  side = "right"
}: SidebarMenuProps) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

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

  const MenuItem = ({ item, depth = 0 }: { item: any, depth: number }) => {
    const hasSubmenu = item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0;
    const itemUrl = item.url || item.path || "#";
    const isActive = pathname === itemUrl;
    const itemId = item.id || item.text || item.name;
    const isOpenSub = openSubmenus[itemId];

    return (
      <div className="w-full">
        {hasSubmenu ? (
          <div className="flex flex-col">
            <button
              onClick={() => toggleSubmenu(itemId)}
              className={cn(
                "flex items-center justify-between w-full py-3 px-4 transition-all duration-300 rounded-xl group",
                isOpenSub ? "bg-stone-50" : "hover:bg-stone-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "p-2 rounded-lg transition-colors",
                  isOpenSub ? "text-stone-900 bg-stone-100" : "text-stone-500 group-hover:text-stone-900"
                )}>
                  {getIcon(item)}
                </span>
                <span className={cn(
                  "text-lg font-medium transition-colors",
                  isOpenSub ? "text-stone-900" : "text-stone-700 group-hover:text-stone-900"
                )}>
                  {item.text || item.name}
                </span>
              </div>
              <ChevronDown 
                className={cn(
                  "w-4 h-4 transition-transform duration-300 text-stone-400",
                  isOpenSub && "rotate-180"
                )} 
              />
            </button>
            <AnimatePresence>
              {isOpenSub && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-r-2 border-stone-100 mr-8 mt-1 space-y-1"
                >
                  {item.submenu.map((sub: any, idx: number) => {
                    // Normalize submenu structure (sometimes nested in 'items')
                    const items = sub.items && Array.isArray(sub.items) ? sub.items : [sub];
                    return items.map((subItem: any, sIdx: number) => (
                      <MenuItem key={`${itemId}-sub-${idx}-${sIdx}`} item={subItem} depth={depth + 1} />
                    ));
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
              isActive ? "bg-stone-900 text-white" : "hover:bg-stone-50 text-stone-700 hover:text-stone-900"
            )}
          >
            <span className={cn(
              "p-2 rounded-lg transition-colors",
              isActive ? "text-white" : "text-stone-500 group-hover:text-stone-900"
            )}>
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 w-full max-w-[360px] bg-white z-[101] shadow-2xl flex flex-col",
              side === "right" ? "right-0" : "left-0"
            )}
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-stone-100">
              <div className="flex items-center gap-3">
                {logo?.image ? (
                  <img src={logo.image} alt={logo.text || "Logo"} className="h-10 w-auto object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center text-white font-bold">
                    {logo?.text?.charAt(0) || "A"}
                  </div>
                )}
                <span className="font-bold text-xl text-stone-900 tracking-tight">
                  {logo?.text || "العقارية"}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-stone-400 group-hover:text-stone-900" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
              <div className="px-4 mb-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">القائمة الرئيسية</p>
              </div>
              {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} depth={0} />
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-stone-100 bg-stone-50/50">
              <div className="space-y-3">
                {actions?.language?.enabled && (
                  <button 
                    onClick={actions.language.onToggle}
                    className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-stone-400" />
                      <span className="font-medium text-stone-700">تغيير اللغة</span>
                    </div>
                    <span className="text-sm font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
                      {actions.language.current === "ar" ? "English" : "عربي"}
                    </span>
                  </button>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className="text-[10px] text-stone-400 font-medium">© 2026 جميع الحقوق محفوظة</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
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
        }
      `}</style>
    </AnimatePresence>
  );
};

export default SidebarMenu;
