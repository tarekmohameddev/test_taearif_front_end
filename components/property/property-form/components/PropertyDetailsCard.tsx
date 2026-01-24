"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ChevronDown } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsCardProps {
  formData: any;
  errors: any;
  currentFeature: string;
  selectedFacilities: string[];
  facilitiesList: any[];
  facades: any[];
  years: number[];
  isDraft: boolean;
  missingFields: string[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setCurrentFeature: (feature: string) => void;
  onInputChange: (e: any) => void;
  onSelectChange: (name: string, value: string) => void;
  onCounterChange: (name: string, value: number | string) => void;
  setSelectedFacilities: React.Dispatch<React.SetStateAction<string[]>>;
  isFieldMissing: (field: string) => boolean;
  cardHasMissingFields: (fields: string[]) => boolean;
}

export default function PropertyDetailsCard({
  formData,
  errors,
  currentFeature,
  selectedFacilities,
  facilitiesList,
  facades,
  years,
  isDraft,
  missingFields,
  isOpen,
  setIsOpen,
  setCurrentFeature,
  onInputChange,
  onSelectChange,
  onCounterChange,
  setSelectedFacilities,
  isFieldMissing,
  cardHasMissingFields,
}: PropertyDetailsCardProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">تفاصيل الوحدة</CardTitle>
              {isDraft &&
                cardHasMissingFields(["type", "area", "size"]) && (
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300"
                  >
                    حقول مطلوبة
                  </Badge>
                )}
            </div>
            <CardDescription>أدخل مواصفات وميزات الوحدة</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="featureInput">الميزات</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="featureInput"
                    placeholder="أدخل ميزة"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          currentFeature.trim() !== "" &&
                          !formData.features.includes(currentFeature.trim())
                        ) {
                          onInputChange({
                            target: {
                              name: "features",
                              value: [...formData.features, currentFeature.trim()],
                            },
                          });
                          setCurrentFeature("");
                        }
                      }
                    }}
                    className={errors.features ? "border-red-500" : ""}
                  />
                  <Button
                    onClick={() => {
                      if (
                        currentFeature.trim() !== "" &&
                        !formData.features.includes(currentFeature.trim())
                      ) {
                        onInputChange({
                          target: {
                            name: "features",
                            value: [...formData.features, currentFeature.trim()],
                          },
                        });
                        setCurrentFeature("");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.features && (
                  <p className="text-sm text-red-500">{errors.features}</p>
                )}
              </div>

              <div className="mt-4">
                <Label className="text-foreground">الميزات المضافة</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-200
                            px-2 sm:px-3 
                            py-1 sm:py-1.5
                            text-sm sm:text-base
                            rounded-full 
                            flex items-center gap-1 sm:gap-2
                            transition-all duration-200
                            hover:bg-gray-300 dark:hover:bg-gray-600
                            group
                          "
                    >
                      <span className="max-w-[100px] sm:max-w-none truncate">
                        {feature}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onInputChange({
                            target: {
                              name: "features",
                              value: formData.features.filter(
                                (_: string, i: number) => i !== index,
                              ),
                            },
                          });
                        }}
                        className="
                              h-auto w-auto p-0.5 sm:p-1
                              hover:bg-transparent
                              text-gray-500 dark:text-gray-400
                              hover:text-red-600 dark:hover:text-red-400
                              transition-colors duration-200
                            "
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {formData.features.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {formData.features.length} ميزة مضافة
                  </p>
                )}
              </div>

              {/* الخصائص - Property Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-right">الخصائص</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">
                      المساحة <span className="text-red-500">*</span>
                      {isDraft &&
                        (isFieldMissing("area") || isFieldMissing("size")) && (
                          <Badge
                            variant="outline"
                            className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
                          >
                            مطلوب
                          </Badge>
                        )}
                    </Label>
                    <Input
                      id="size"
                      name="size"
                      value={formData.size}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      className={
                        errors.size
                          ? "border-red-500"
                          : isDraft &&
                              (isFieldMissing("area") || isFieldMissing("size"))
                            ? "border-orange-400 bg-orange-50"
                            : ""
                      }
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      قدم مربع
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">طول القطعة</Label>
                    <Input
                      id="length"
                      name="length"
                      value={formData.length}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      متر
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">عرض القطعة</Label>
                    <Input
                      id="width"
                      name="width"
                      value={formData.width}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      متر
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facade_id">الواجهة</Label>
                    <Select
                      value={formData.facade_id?.toString() || ""}
                      onValueChange={(value) => onSelectChange("facade_id", value)}
                    >
                      <SelectTrigger id="facade_id" dir="rtl">
                        <SelectValue placeholder="اختر الواجهة" />
                      </SelectTrigger>
                      <SelectContent>
                        {facades.map((facade) => (
                          <SelectItem
                            key={facade.id}
                            value={facade.id.toString()}
                          >
                            {facade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street_width_north">عرض الشارع الشمالي</Label>
                    <Input
                      id="street_width_north"
                      name="street_width_north"
                      value={formData.street_width_north}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      متر
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street_width_south">عرض الشارع الجنوبي</Label>
                    <Input
                      id="street_width_south"
                      name="street_width_south"
                      value={formData.street_width_south}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      متر
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street_width_east">عرض الشارع الشرقي</Label>
                    <Input
                      id="street_width_east"
                      name="street_width_east"
                      value={formData.street_width_east}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      متر
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street_width_west">عرض الشارع الغربي</Label>
                    <Input
                      id="street_width_west"
                      name="street_width_west"
                      value={formData.street_width_west}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const numbersAndDecimal =
                          e.currentTarget.value.replace(/[^0-9.]/g, "");
                        // منع أكثر من نقطة عشرية واحدة
                        const parts = numbersAndDecimal.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numbersAndDecimal;

                        onInputChange({
                          target: {
                            name: e.currentTarget.name,
                            value: validValue,
                          },
                        });
                      }}
                      dir="rtl"
                    />
                    <span className="text-sm text-gray-500 block text-right">
                      متر
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="building_age">سنة البناء</Label>
                    <Select
                      value={formData.building_age}
                      onValueChange={(value) => onSelectChange("building_age", value)}
                    >
                      <SelectTrigger id="building_age" dir="rtl">
                        <SelectValue placeholder="اختر سنة البناء" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
              </div>
              {/* مرافق الوحدة - Property Features */}
              <div className="space-y-4 whitespace-nowraps">
                <h3 className="text-lg font-semibold text-right">مرافق الوحدة</h3>

                {/* قائمة المرافق المضافة */}
                {selectedFacilities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-md font-medium text-right">
                      المرافق المضافة:
                    </h4>
                    <div
                      className={`grid gap-3 ${
                        selectedFacilities.length === 1
                          ? "grid-cols-1"
                          : selectedFacilities.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-3"
                      }`}
                    >
                      {selectedFacilities.map((facilityKey) => {
                        const facility = facilitiesList.find(
                          (f) => f.key === facilityKey,
                        );
                        if (!facility) return null;
                        const currentValue =
                          Number(formData[facilityKey]) || 0;

                        return (
                          <div
                            key={facilityKey}
                            className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{facility.label}</span>
                              <Badge variant="secondary" className="text-lg">
                                {currentValue}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  if (currentValue === 0) {
                                    // إذا كانت القيمة 0، إلغاء تفعيل المرفق
                                    setSelectedFacilities((prev: string[]) =>
                                      prev.filter((key: string) => key !== facilityKey),
                                    );
                                    onCounterChange(facilityKey, "");
                                  } else {
                                    // تقليل القيمة بمقدار 1
                                    const newValue = Math.max(0, currentValue - 1);
                                    onCounterChange(facilityKey, newValue);
                                  }
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  onCounterChange(
                                    facilityKey,
                                    currentValue + 1,
                                  );
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Badges المرافق */}
                <div className="flex flex-wrap gap-2">
                  {facilitiesList.map((facility) => {
                    const currentValue = Number(formData[facility.key]) || 0;
                    const isSelected = selectedFacilities.includes(facility.key);

                    return (
                      <Badge
                        key={facility.key}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer text-sm py-2 px-4 hover:bg-primary/80 transition-colors"
                        onClick={() => {
                          if (!isSelected) {
                            // تفعيل المرفق بقيمة 0
                            setSelectedFacilities((prev: string[]) => [
                              ...prev,
                              facility.key,
                            ]);
                            onCounterChange(facility.key, 0);
                          } else {
                            // إلغاء تفعيل المرفق
                            setSelectedFacilities((prev: string[]) =>
                              prev.filter((key: string) => key !== facility.key),
                            );
                            onCounterChange(facility.key, 0);
                          }
                        }}
                      >
                        {facility.label}
                        {currentValue > 0 && (
                          <span className="mr-1">({currentValue})</span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
