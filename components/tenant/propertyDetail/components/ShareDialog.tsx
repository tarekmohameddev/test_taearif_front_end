"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FacebookIcon,
  LinkedinIcon,
  MessageCircleIcon,
  CopyIcon,
} from "lucide-react";
import Image from "next/image";
import { Property } from "../types/types";
import {
  shareToFacebook,
  shareToTwitter,
  shareToLinkedIn,
  shareToWhatsApp,
  copyToClipboard,
} from "../utils/sharing";
import { useState } from "react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  primaryColor: string;
  primaryColorHover: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  property,
  primaryColor,
  primaryColorHover,
}: ShareDialogProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            مشاركة العقار
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-sm">
            شارك هذا العقار مع أصدقائك
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => shareToFacebook(property)}
              className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
              <span className="text-sm font-medium">فيسبوك</span>
            </button>

            <button
              onClick={() => shareToTwitter(property)}
              className="flex items-center justify-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Image
                src="/images/icons/x-twitter.png"
                alt="X (Twitter)"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span className="text-sm font-medium">تويتر</span>
            </button>

            <button
              onClick={() => shareToLinkedIn(property)}
              className="flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
              <span className="text-sm font-medium">لينكد إن</span>
            </button>

            <button
              onClick={() => shareToWhatsApp(property)}
              className="flex items-center justify-center gap-2 p-3 text-white rounded-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              <MessageCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">واتساب</span>
            </button>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <CopyIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {copySuccess ? "تم النسخ!" : "نسخ الرابط"}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
