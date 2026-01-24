"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImageIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GalleryCardProps {
  previews: { gallery: string[] };
  images: { gallery: File[] };
  errors: any;
  uploading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  galleryInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: any, type: string) => void;
  onRemoveImage: (type: string, index?: number) => void;
}

export default function GalleryCard({
  previews,
  images,
  errors,
  uploading,
  isOpen,
  setIsOpen,
  galleryInputRef,
  onFileChange,
  onRemoveImage,
}: GalleryCardProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">معرض صور الوحدة</CardTitle>
            </div>
            <CardDescription>
              قم بتحميل صور متعددة لعرض تفاصيل الوحدة
            </CardDescription>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {previews.gallery.map((preview, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-1 relative w-16 h-16 flex-shrink-0"
                    >
                      <div className="w-full h-full bg-muted rounded-md overflow-hidden">
                        <img
                          src={preview}
                          alt={`Gallery image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full"
                        onClick={() => onRemoveImage("gallery", index)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                  <div
                    className="border rounded-md p-1 w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                      {uploading ? (
                        <Loader2 className="h-2 w-2 animate-spin" />
                      ) : (
                        <ImageIcon className="h-2 w-2 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">إضافة</p>
                  </div>
                </div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFileChange(e, "gallery")}
                />
                {errors.gallery && (
                  <p className="text-red-500 text-sm">{errors.gallery}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  يمكنك رفع صور بصيغة JPG أو PNG. الحد الأقصى لعدد الصور هو
                  10.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
