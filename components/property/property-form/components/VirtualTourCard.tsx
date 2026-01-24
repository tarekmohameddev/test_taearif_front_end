"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Video, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VirtualTourCardProps {
  formData: { virtual_tour: string; video_url: string };
  errors: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUrlChange: (e: any) => void;
}

export default function VirtualTourCard({
  formData,
  errors,
  isOpen,
  setIsOpen,
  onUrlChange,
}: VirtualTourCardProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl"> الجولات الافتراضية</CardTitle>
            </div>
            <CardDescription>
              أضف رابط الجولة الافتراضية للوحدة
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="virtualTourUrl">
                      رابط الجولة الافتراضية (اختياري)
                    </Label>
                  </div>
                  <Input
                    id="virtual_tour"
                    name="virtual_tour"
                    type="url"
                    placeholder="https://my.matterport.com/show/..."
                    value={formData.virtual_tour}
                    onChange={onUrlChange}
                    className={errors.virtual_tour ? "border-red-500" : ""}
                  />
                  {errors.virtual_tour && (
                    <p className="text-sm text-red-500">
                      {errors.virtual_tour}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    أضف رابط جولة افتراضية من Matterport أو منصات الجولات
                    الافتراضية الأخرى
                  </p>
                </div>
              </div>

              {/* Preview sections for URLs */}
              {(formData.virtual_tour || formData.video_url) && (
                <div className="mt-6 p-4 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium mb-3">معاينة الروابط:</h4>
                  <div className="space-y-2">
                    {formData.video_url && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span className="text-muted-foreground">فيديو:</span>
                        <a
                          href={formData.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate max-w-[200px] sm:max-w-xs"
                        >
                          {formData.video_url}
                        </a>
                      </div>
                    )}
                    {formData.virtual_tour && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">
                          جولة افتراضية:
                        </span>
                        <a
                          href={formData.virtual_tour}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline truncate max-w-[200px] sm:max-w-xs"
                        >
                          {formData.virtual_tour}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
