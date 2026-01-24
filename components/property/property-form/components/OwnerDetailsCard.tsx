"use client";

import React from "react";
import { X, Loader2, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OwnerDetailsCardProps {
  formData: { 
    owner_number: string;
    water_meter_number: string;
    electricity_meter_number: string;
  };
  previews: { deedImage: string | null };
  images: { deedImage: File | null };
  errors: any;
  uploading: boolean;
  deedImageInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (e: any) => void;
  onFileChange: (e: any, type: string) => void;
  onRemoveImage: (type: string) => void;
}

export default function OwnerDetailsCard({
  formData,
  previews,
  images,
  errors,
  uploading,
  deedImageInputRef,
  onInputChange,
  onFileChange,
  onRemoveImage,
}: OwnerDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">تفاصيل المالك</CardTitle>
        <CardDescription>
          أدخل معلومات مالك العقار وصورة السند
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* رقم مالك العقار */}
        <div className="space-y-2">
          <Label htmlFor="owner_number">رقم مالك العقار</Label>
          <Input
            id="owner_number"
            name="owner_number"
            type="number"
            inputMode="numeric"
            value={formData.owner_number}
            onChange={onInputChange}
            placeholder="أدخل رقم مالك العقار"
            className={errors.owner_number ? "border-red-500" : ""}
            dir="rtl"
          />
          {errors.owner_number && (
            <p className="text-sm text-red-500">{errors.owner_number}</p>
          )}
        </div>

        {/* أرقام العدادات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="water_meter_number">رقم عداد المياه</Label>
            <Input
              id="water_meter_number"
              name="water_meter_number"
              placeholder="123456789"
              value={formData.water_meter_number}
              onChange={onInputChange}
              className={
                errors.water_meter_number ? "border-red-500" : ""
              }
              dir="rtl"
            />
            {errors.water_meter_number && (
              <p className="text-sm text-red-500">
                {errors.water_meter_number}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricity_meter_number">
              رقم عداد الكهرباء
            </Label>
            <Input
              id="electricity_meter_number"
              name="electricity_meter_number"
              placeholder="987654321"
              value={formData.electricity_meter_number}
              onChange={onInputChange}
              className={
                errors.electricity_meter_number
                  ? "border-red-500"
                  : ""
              }
              dir="rtl"
            />
            {errors.electricity_meter_number && (
              <p className="text-sm text-red-500">
                {errors.electricity_meter_number}
              </p>
            )}
          </div>
        </div>

        {/* صورة السند */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-right">صورة السند (الصك)</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="border rounded-md p-2 flex-1 w-full">
              <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                {previews.deedImage ? (
                  <>
                    <img
                      src={previews.deedImage}
                      alt="Deed image"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => onRemoveImage("deedImage")}
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
                ref={deedImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(e, "deedImage")}
              />
              <Button
                variant="outline"
                className="h-12 w-full"
                onClick={() => deedImageInputRef.current?.click()}
                disabled={uploading}
              >
                <div className="flex items-center gap-2">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  <span>رفع صورة السند</span>
                </div>
              </Button>
              <p className="text-sm text-muted-foreground">
                يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو 10
                ميجابايت.
              </p>
              {errors.deedImage && (
                <p className="text-xs text-red-500">{errors.deedImage}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
