"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Video, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VideoCardProps {
  video: File | null;
  videoPreview: string | null;
  errors: any;
  uploading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  videoInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: any, type: string) => void;
  onRemoveVideo: () => void;
}

export default function VideoCard({
  video,
  videoPreview,
  errors,
  uploading,
  isOpen,
  setIsOpen,
  videoInputRef,
  onFileChange,
  onRemoveVideo,
}: VideoCardProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">فيديو الوحدة</CardTitle>
            </div>
            <CardDescription>
              قم بتحميل فيديو واحد لعرض تفاصيل الوحدة
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
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="border rounded-md p-2 flex-1 w-full">
                    {videoPreview ? (
                      <>
                        <div
                          className="bg-muted rounded-md overflow-hidden flex items-center justify-center relative"
                          style={{
                            height: "500px",
                            maxWidth: "100%",
                          }}
                        >
                          <video
                            src={videoPreview}
                            className="max-h-full max-w-full object-contain rounded-md"
                            controls
                            style={{ width: "auto", height: "auto" }}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                            onClick={onRemoveVideo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex items-center justify-center bg-muted rounded-md relative"
                        style={{
                          height: "500px",
                          maxWidth: "100%",
                        }}
                      >
                        <div className="text-center">
                          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            لا يوجد فيديو
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={uploading}
                          >
                            <div className="flex items-center gap-2">
                              <Upload className="h-5 w-5" />
                              <span>رفع فيديو</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => onFileChange(e, "video")}
                />
                {errors.video && (
                  <p className="text-red-500 text-sm">{errors.video}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  يمكنك رفع فيديو بصيغة MP4 أو MOV أو AVI. الحد الأقصى لحجم
                  الملف هو 50 ميجابايت والحد الأقصى للطول هو 5 دقائق.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
