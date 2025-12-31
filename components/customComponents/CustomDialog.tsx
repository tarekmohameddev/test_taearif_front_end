"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

// Helper function to convert Tailwind max-w classes to CSS values
function getMaxWidthValue(maxWidth: string): string {
  const maxWidthMap: { [key: string]: string } = {
    "max-w-xs": "20rem",
    "max-w-sm": "24rem",
    "max-w-md": "28rem",
    "max-w-lg": "32rem",
    "max-w-xl": "36rem",
    "max-w-2xl": "42rem",
    "max-w-3xl": "48rem",
    "max-w-4xl": "56rem",
    "max-w-5xl": "64rem",
    "max-w-6xl": "72rem",
    "max-w-7xl": "80rem",
  };
  return maxWidthMap[maxWidth] || "56rem"; // default to max-w-4xl
}

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

interface CustomDialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogContentProps {
  children: ReactNode;
  className?: string;
}

interface CustomDialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function CustomDialog({
  open,
  onOpenChange,
  children,
  className = "",
  maxWidth = "max-w-4xl",
}: CustomDialogProps) {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
        style={{
          opacity: open ? 1 : 0,
        }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content */}
      <div
        className={`
          relative z-50 w-full mx-2 sm:mx-4 md:mx-auto 
          ${maxWidth}
          max-h-[95vh] sm:max-h-[90vh]
          bg-white rounded-lg sm:rounded-lg shadow-2xl
          transform transition-all duration-200
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: `min(${getMaxWidthValue(maxWidth)}, calc(100vw - 1rem))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function CustomDialogTrigger({
  children,
  asChild = false,
}: CustomDialogTriggerProps) {
  // This is just a wrapper, the actual trigger should be handled by parent
  return <>{children}</>;
}

export function CustomDialogContent({
  children,
  className = "",
}: CustomDialogContentProps) {
  return (
    <div
      className={`overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] ${className}`}
    >
      {children}
    </div>
  );
}

export function CustomDialogHeader({
  children,
  className = "",
}: CustomDialogHeaderProps) {
  return (
    <div
      className={`border-b border-gray-200 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 flex-shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

export function CustomDialogTitle({
  children,
  className = "",
}: CustomDialogTitleProps) {
  return (
    <h2
      className={`text-lg sm:text-xl md:text-2xl font-bold text-black ${className}`}
    >
      {children}
    </h2>
  );
}

export function CustomDialogDescription({
  children,
  className = "",
}: CustomDialogDescriptionProps) {
  return (
    <p className={`text-gray-600 text-sm sm:text-base ${className}`}>
      {children}
    </p>
  );
}

// Close button component
export function CustomDialogClose({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClose}
      className={`
        absolute left-2 top-2 sm:left-4 sm:top-4 
        p-1.5 sm:p-2 rounded-sm opacity-70 
        hover:opacity-100 transition-opacity
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
        touch-manipulation
        ${className}
      `}
      aria-label="إغلاق"
    >
      <X className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}
