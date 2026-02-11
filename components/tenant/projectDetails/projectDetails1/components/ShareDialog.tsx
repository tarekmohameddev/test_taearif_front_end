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
import { ProjectDetailsProps } from "../types";

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mergedData: ProjectDetailsProps;
  copySuccess: boolean;
  onShareFacebook: () => void;
  onShareTwitter: () => void;
  onShareLinkedIn: () => void;
  onShareWhatsApp: () => void;
  onCopyLink: () => void;
}

export const ShareDialog = ({
  isOpen,
  onOpenChange,
  mergedData,
  copySuccess,
  onShareFacebook,
  onShareTwitter,
  onShareLinkedIn,
  onShareWhatsApp,
  onCopyLink,
}: ShareDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            {mergedData.content?.shareTitle || "مشاركة المشروع"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-sm">
            {mergedData.content?.shareDescription ||
              "شارك هذا المشروع مع أصدقائك"}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onShareFacebook}
              className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
              <span className="text-sm font-medium">فيسبوك</span>
            </button>

            <button
              onClick={onShareTwitter}
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
              onClick={onShareLinkedIn}
              className="flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
              <span className="text-sm font-medium">لينكد إن</span>
            </button>

            <button
              onClick={onShareWhatsApp}
              className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">واتساب</span>
            </button>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={onCopyLink}
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
};
