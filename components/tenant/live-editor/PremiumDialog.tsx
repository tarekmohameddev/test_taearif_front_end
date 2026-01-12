"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumDialogProps {
  open: boolean;
  onClose: () => void;
  themeName: string;
  themePrice: string;
  currency?: string;
  themeId?: string;
}

export function PremiumDialog({
  open,
  onClose,
  themeName,
  themePrice,
  currency = "SAR",
  themeId,
}: PremiumDialogProps) {
  const router = useRouter();

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
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleUpgrade = () => {
    if (themeId) {
      // Navigate to settings page with themeId (same as ThemeChangeDialog)
      router.push(`/dashboard/settings?tab=themes&themeId=${themeId}`);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Dialog Content - Simple White Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-50 w-full max-w-sm mx-4 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Content */}
            <div className="p-6 pt-8">
              {/* Lock Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  لم يتم شراء الثيم بعد
                </h2>
                <p className="text-sm text-gray-600">
                  هذا المكون يتطلب شراء الثيم <span className="font-medium text-gray-900">{themeName}</span>
                </p>
              </div>

              {/* Price */}
              {themePrice && (
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">السعر</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {themePrice}
                    </span>
                    <span className="text-base text-gray-600">{currency}</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleUpgrade}
                  className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg"
                >
                  ترقية الآن
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="w-full h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  ربما لاحقاً
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}