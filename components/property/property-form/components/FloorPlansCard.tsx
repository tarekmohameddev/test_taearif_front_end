"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FloorPlansCardProps {
  previews: { floorPlans: string[] };
  images: { floorPlans: File[] };
  uploading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  floorPlansInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: any, type: string) => void;
  onRemoveImage: (type: string, index?: number) => void;
}

export default function FloorPlansCard({
  previews,
  images,
  uploading,
  isOpen,
  setIsOpen,
  floorPlansInputRef,
  onFileChange,
  onRemoveImage,
}: FloorPlansCardProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">مخططات الطوابق</CardTitle>
            </div>
            <CardDescription>
              قم بتحميل مخططات الطوابق والتصاميم الهندسية للوحدة
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {previews.floorPlans.map((preview, index) => (
                    <div key={index} className="border rounded-md p-2 relative">
                      <div className="h-40 bg-muted rounded-md overflow-hidden">
                        <img
                          src={preview}
                          alt={`Floor plan ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 h-6 w-6"
                        onClick={() => onRemoveImage("floorPlans", index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-center mt-2 truncate">
                        مخطط {index + 1}
                      </p>
                    </div>
                  ))}
                  <div
                    className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => floorPlansInputRef.current?.click()}
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">إضافة مخطط</p>
                  </div>
                </div>
                <input
                  ref={floorPlansInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFileChange(e, "floorPlans")}
                />
                <p className="text-sm text-muted-foreground">
                  يمكنك رفع مخططات بصيغة JPG أو PNG. الحد الأقصى لعدد
                  المخططات هو 5.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
