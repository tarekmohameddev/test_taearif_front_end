"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils"; // تأكد أن لديك دالة cn أو استخدم classNames العادية

// Context لإغلاق dropdown (exported for consumers that need to close from inside, e.g. budget form)
export const DropdownContext = createContext<{ closeDropdown: () => void } | null>(null);

// --- المكونات الفرعية ---

// 1. عنصر قائمة عادي
export const DropdownItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const context = useContext(DropdownContext);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // إغلاق dropdown بعد تنفيذ onClick
    if (context?.closeDropdown) {
      context.closeDropdown();
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
};

// 2. قائمة فرعية (SubMenu)
export const DropdownSubMenu = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    // إلغاء أي timeout موجود
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // تأخير صغير قبل الإغلاق للسماح بالانتقال إلى القائمة الفرعية
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  // تنظيف timeout عند unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* الزر الذي يظهر في القائمة */}
      <div className="flex w-full cursor-default items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
        <span className="flex items-center gap-2">{trigger}</span>
        {/* سهم يشير لليسار لأننا في وضع RTL */}
        <ChevronLeft 
          size={16} 
          className={cn(
            "text-gray-400 transition-transform",
            isOpen && "rotate-90"
          )} 
        />
      </div>

      {/* محتوى القائمة الفرعية:
         - absolute: ليكون عائماً
         - top-0: ليحاذي العنصر من الأعلى
         - right-full: هذه هي الخدعة! تجعله يبدأ من نهاية يمين العنصر الأب (أي يدفعه لليسار)
         - mr-2: مسافة صغيرة بين القائمتين
         - يظهر فقط عند isOpen === true
      */}
      {isOpen && (
        <div 
          className="absolute top-0 right-full mr-2 w-48 rounded-md bg-white shadow-lg z-[10001]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

// --- المكون الرئيسي ---

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  triggerClassName?: string;
  iconColor?: string;
  dropdownWidth?: string;
  maxHeight?: string;
  /** Use when dropdown is inside an elevated dialog so it appears above (e.g. 10003) */
  contentZIndex?: number;
  /** When true, trigger and popup take full width of container. Default: false */
  fullWidth?: boolean;
  /** When true, trigger is disabled and dropdown cannot open */
  disabled?: boolean;
}

export const CustomDropdown = ({ trigger, children, triggerClassName, iconColor, dropdownWidth = "w-56", maxHeight, contentZIndex = 10001, fullWidth = false, disabled = false }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  // التأكد من أن المكون تم تحميله (للـ portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // حساب موضع القائمة وعرض الزر (لـ fullWidth)
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // إغلاق عند التمرير في الصفحة فقط (وليس داخل الـ dropdown)
      const handleScroll = (event: Event) => {
        // التحقق من أن الـ scroll ليس داخل الـ dropdown نفسه
        const target = event.target as Node;
        if (
          dropdownRef.current &&
          target &&
          !dropdownRef.current.contains(target) &&
          !buttonRef.current?.contains(target)
        ) {
          setIsOpen(false);
        }
      };
      // استخدام capture phase للتقاط scroll events
      document.addEventListener("scroll", handleScroll, true);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen]);

  const dropdownContent = isOpen && mounted ? (
    <DropdownContext.Provider value={{ closeDropdown: () => setIsOpen(false) }}>
      <div
        ref={dropdownRef}
        className={cn(
          "fixed origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto",
          !fullWidth && dropdownWidth
        )}
        style={{
          zIndex: contentZIndex,
          top: `${position.top}px`,
          right: `${position.right}px`,
          width: fullWidth && position.width > 0 ? position.width : undefined,
          minWidth: fullWidth && position.width > 0 ? position.width : undefined,
          maxHeight: maxHeight || undefined,
        }}
        dir="rtl"
      >
        <div className="py-1">{children}</div>
      </div>
    </DropdownContext.Provider>
  ) : null;

  return (
    <>
      <div className={cn("relative text-right", fullWidth ? "w-full block" : "inline-block")} dir="rtl">
        {/* زر الفتح الرئيسي */}
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none",
            fullWidth && "w-full justify-between",
            disabled && "opacity-60 cursor-not-allowed",
            triggerClassName
          )}
        >
          {trigger}
          <ChevronDown 
            size={16} 
            className="text-current" 
            style={iconColor ? { color: iconColor } : undefined}
          />
        </button>
      </div>
      
      {/* استخدام Portal لإخراج القائمة من DOM hierarchy */}
      {mounted && createPortal(dropdownContent, document.body)}
    </>
  );
};