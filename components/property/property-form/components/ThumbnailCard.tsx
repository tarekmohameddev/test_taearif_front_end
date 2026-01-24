"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImageIcon, Upload, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ThumbnailCardProps {
  previews: { thumbnail: string | null };
  images: { thumbnail: File | null };
  errors: any;
  isDraft: boolean;
  missingFields: string[];
  uploading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  thumbnailInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: any, type: string) => void;
  onRemoveImage: (type: string, index?: number) => void;
  cardHasMissingFields: (fields: string[]) => boolean;
}

export default function ThumbnailCard({
  previews,
  images,
  errors,
  isDraft,
  missingFields,
  uploading,
  isOpen,
  setIsOpen,
  thumbnailInputRef,
  onFileChange,
  onRemoveImage,
  cardHasMissingFields,
}: ThumbnailCardProps) {
  return (
    <Card className={errors.thumbnail ? "border-red-500 border-2" : ""}>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">صورة الوحدة الرئيسية</CardTitle>
              {isDraft &&
                cardHasMissingFields(["featured_image"]) && (
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300"
                  >
                    حقول مطلوبة
                  </Badge>
                )}
            </div>
            <CardDescription>
              قم بتحميل صورة رئيسية تمثل الوحدة{" "}
              <span className="text-red-500">*</span>
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
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="border rounded-md p-2 flex-1 w-full">
                  <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                    {previews.thumbnail ? (
                      <>
                        <img
                          src={previews.thumbnail}
                          alt="Property thumbnail"
                          className="h-full w-full object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => onRemoveImage("thumbnail")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full md:w-1/3">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileChange(e, "thumbnail")}
                  />
                  <Button
                    variant="outline"
                    className="h-12 w-full"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <div className="flex items-center gap-2">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                      <span>رفع صورة</span>
                    </div>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف
                    هو 10 ميجابايت.
                  </p>
                  {errors.thumbnail && (
                    <p className="text-xs text-red-500">{errors.thumbnail}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
