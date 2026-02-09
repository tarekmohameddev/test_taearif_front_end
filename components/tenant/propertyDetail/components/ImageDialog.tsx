"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Property } from "../types/types";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: string | null;
  selectedImageIndex: number;
  property: Property | null;
  getAllImages: () => string[];
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function ImageDialog({
  isOpen,
  onClose,
  selectedImage,
  selectedImageIndex,
  property,
  getAllImages,
  handlePreviousImage,
  handleNextImage,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}: ImageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogTitle className="sr-only">عرض صورة العقار</DialogTitle>
        {selectedImage && selectedImage.trim() !== "" && property && (
          <div
            className="relative w-full h-[80vh] group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={selectedImage}
              alt={property?.title || "صورة العقار"}
              fill
              className="object-contain rounded-lg"
            />

            {getAllImages().length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="الصورة التالية"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            {getAllImages().length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {getAllImages().length}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
