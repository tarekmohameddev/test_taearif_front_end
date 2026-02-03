"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MoreVertical,
  ChevronRight,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { getStageNameAr } from "@/types/unified-customer";

interface SwipeActionsProps {
  children: React.ReactNode;
  onEmail?: () => void;
  onFavorite?: () => void;
  disabled?: boolean;
}

export function SwipeActions({
  children,
  onEmail,
  onFavorite,
  disabled = false,
}: SwipeActionsProps) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_OFFSET = 240; // Width of all action buttons

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow left swipe (for RTL, this reveals actions on the right)
    if (diff < 0) {
      setOffset(Math.max(diff, -MAX_OFFSET));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || disabled) return;
    setIsDragging(false);

    // Snap to position based on swipe distance
    if (offset < -60) {
      // Swipe threshold
      setOffset(-MAX_OFFSET);
    } else {
      setOffset(0);
    }
  };

  const handleAction = (action: (() => void) | undefined) => {
    if (action) {
      action();
    }
    setOffset(0); // Reset after action
  };

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Action Buttons (hidden behind) */}
      <div className="absolute inset-y-0 left-0 flex items-center gap-1 px-2">
        {onEmail && (
          <Button
            size="sm"
            className="h-full rounded-none bg-purple-600 hover:bg-purple-700"
            onClick={() => handleAction(onEmail)}
          >
            <Mail className="h-5 w-5" />
          </Button>
        )}
        {onFavorite && (
          <Button
            size="sm"
            className="h-full rounded-none bg-yellow-600 hover:bg-yellow-700"
            onClick={() => handleAction(onFavorite)}
          >
            <Star className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`transition-transform ${isDragging ? "" : "duration-300"}`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

interface MobileCustomerCardProps {
  customer: UnifiedCustomer;
  onClick?: () => void;
  onEmail?: () => void;
}

export function MobileCustomerCard({
  customer,
  onClick,
  onEmail,
}: MobileCustomerCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "🚨";
      case "high":
        return "🔥";
      case "medium":
        return "⭐";
      case "low":
        return "📌";
      default:
        return "";
    }
  };

  return (
    <SwipeActions onEmail={onEmail}>
      <div
        className="bg-white dark:bg-gray-900 border rounded-lg p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          >
            {customer.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{customer.phone}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getStageNameAr(customer.stage)}
              </Badge>
              {customer.priority !== "low" && (
                <Badge variant="secondary" className="text-xs">
                  {getPriorityEmoji(customer.priority)}
                </Badge>
              )}
            </div>

            {/* Quick Info */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {customer.preferences.propertyType.length > 0 && (
                <span className="truncate">
                  🏠 {customer.preferences.propertyType.join(", ")}
                </span>
              )}
              {customer.totalDealValue && (
                <span className="flex-shrink-0">
                  💰 {(customer.totalDealValue / 1000).toFixed(0)}K
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Swipe Hint */}
        <div className="mt-2 text-xs text-gray-400 text-center md:hidden">
          ← اسحب للإجراءات السريعة
        </div>
      </div>
    </SwipeActions>
  );
}

interface MobileBottomSheetProps {
  customer: UnifiedCustomer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileBottomSheet({
  customer,
  open,
  onOpenChange,
}: MobileBottomSheetProps) {
  const quickActions = [
    {
      icon: Phone,
      label: "اتصال",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => (window.location.href = `tel:${customer.phone}`),
    },
    {
      icon: MessageSquare,
      label: "واتساب",
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () =>
        (window.location.href = `https://wa.me/${customer.phone.replace(/\D/g, "")}`),
    },
    {
      icon: Mail,
      label: "بريد",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: () =>
        customer.email && (window.location.href = `mailto:${customer.email}`),
    },
    {
      icon: Calendar,
      label: "موعد",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: () => console.log("Schedule appointment"),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[60vh]" dir="rtl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.phone}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{getStageNameAr(customer.stage)}</Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center gap-2 p-3 rounded-lg active:scale-95 transition-transform"
              >
                <div className={`p-3 rounded-full ${action.bgColor}`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">قيمة الصفقة</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">
                {customer.totalDealValue
                  ? `${(customer.totalDealValue / 1000).toFixed(0)}K ريال`
                  : "-"}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">العقارات المفضلة</div>
              <div className="text-sm font-medium">
                {customer.preferences.propertyType.join(", ")}
              </div>
              {customer.preferences.preferredAreas.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  📍 {customer.preferences.preferredAreas.slice(0, 2).join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* View Full Profile */}
          <Button
            className="w-full"
            onClick={() => {
              window.location.href = `/ar/dashboard/customers-hub/${customer.id}`;
            }}
          >
            عرض الملف الكامل
            <ChevronRight className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Touch-friendly improvements hook
export function useMobileOptimizations() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add touch-friendly CSS
  useEffect(() => {
    if (isMobile) {
      // Disable text selection during swipe
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      
      // Prevent pull-to-refresh on mobile
      document.body.style.overscrollBehavior = "none";
      
      return () => {
        document.body.style.userSelect = "auto";
        document.body.style.webkitUserSelect = "auto";
        document.body.style.overscrollBehavior = "auto";
      };
    }
  }, [isMobile]);

  return { isMobile };
}
