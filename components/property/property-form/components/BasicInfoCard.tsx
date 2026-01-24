"use client";

import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";

interface BasicInfoCardProps {
  formData: any;
  errors: any;
  isDraft: boolean;
  missingFields: string[];
  categories: any[];
  projects: any[];
  buildings: any[];
  onInputChange: (e: any) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSelectChange: (name: string, value: string) => void;
  onCitySelect: (cityId: number) => void;
  onDistrictSelect: (districtId: number) => void;
  isFieldMissing: (field: string) => boolean;
  cardHasMissingFields: (fields: string[]) => boolean;
}

export default function BasicInfoCard({
  formData,
  errors,
  isDraft,
  missingFields,
  categories,
  projects,
  buildings,
  onInputChange,
  onSwitchChange,
  onSelectChange,
  onCitySelect,
  onDistrictSelect,
  isFieldMissing,
  cardHasMissingFields,
}: BasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">معلومات الوحدة الأساسية</CardTitle>
              {isDraft &&
                cardHasMissingFields([
                  "title",
                  "description",
                  "address",
                  "purpose",
                  "category",
                  "city_id",
                ]) && (
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300"
                  >
                    حقول مطلوبة
                  </Badge>
                )}
            </div>
            <CardDescription>أدخل المعلومات الأساسية للوحدة</CardDescription>
          </div>
          <div className="flex items-center space-x-2 gap-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => onSwitchChange("featured", checked)}
            />
            <Label htmlFor="featured" className="mr-2">
              عرض هذه الوحدة في الصفحة الرئيسية (مميزة)
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            اسم الوحدة <span className="text-red-500">*</span>
            {isDraft && isFieldMissing("title") && (
              <Badge
                variant="outline"
                className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
              >
                مطلوب
              </Badge>
            )}
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="شقة حديثة مع إطلالة على المدينة"
            value={formData.title}
            onChange={onInputChange}
            className={
              errors.title
                ? "border-red-500"
                : isDraft && isFieldMissing("title")
                  ? "border-orange-400 bg-orange-50"
                  : ""
            }
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            وصف الوحدة <span className="text-red-500">*</span>
            {isDraft && isFieldMissing("description") && (
              <Badge
                variant="outline"
                className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
              >
                مطلوب
              </Badge>
            )}
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="شقة جميلة مع تشطيبات حديثة وإطلالات رائعة على المدينة"
            rows={25}
            value={formData.description}
            onChange={onInputChange}
            className={
              errors.description
                ? "border-red-500"
                : isDraft && isFieldMissing("description")
                  ? "border-orange-400 bg-orange-50"
                  : ""
            }
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              العنوان <span className="text-red-500">*</span>
              {isDraft && isFieldMissing("address") && (
                <Badge
                  variant="outline"
                  className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
                >
                  مطلوب
                </Badge>
              )}
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="123 شارع الرئيسي"
              value={formData.address}
              onChange={onInputChange}
              className={
                errors.address
                  ? "border-red-500"
                  : isDraft && isFieldMissing("address")
                    ? "border-orange-400 bg-orange-50"
                    : ""
              }
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="building_id">العمارة</Label>
            <Select
              name="building_id"
              value={formData.building_id}
              onValueChange={(value) =>
                onInputChange({
                  target: { name: "building_id", value },
                })
              }
            >
              <SelectTrigger
                id="building_id"
                className={errors.building_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="اختر العمارة" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.building_id && (
              <p className="text-sm text-red-500">{errors.building_id}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">المبلغ</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="750000"
              value={formData.price}
              onChange={onInputChange}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">طريقة الدفع</Label>
            <Select
              name="payment_method"
              value={formData.payment_method}
              onValueChange={(value) =>
                onInputChange({
                  target: { name: "payment_method", value },
                })
              }
            >
              <SelectTrigger
                id="payment_method"
                className={errors.payment_method ? "border-red-500" : ""}
              >
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="quarterly">ربع سنوي</SelectItem>
                <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                <SelectItem value="annual">سنوي</SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <p className="text-sm text-red-500"></p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricePerMeter">سعر المتر</Label>
            <Input
              id="pricePerMeter"
              name="pricePerMeter"
              type="number"
              placeholder="750000"
              value={formData.pricePerMeter}
              onChange={onInputChange}
              className={errors.pricePerMeter ? "border-red-500" : ""}
            />
            {errors.pricePerMeter && (
              <p className="text-sm text-red-500">{errors.pricePerMeter}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">
              نوع القائمة <span className="text-red-500">*</span>
              {isDraft && isFieldMissing("purpose") && (
                <Badge
                  variant="outline"
                  className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
                >
                  مطلوب
                </Badge>
              )}
            </Label>
            <Select
              name="purpose"
              value={formData.purpose}
              onValueChange={(value) =>
                onInputChange({
                  target: { name: "purpose", value },
                })
              }
            >
              <SelectTrigger
                id="purpose"
                className={
                  errors.purpose
                    ? "border-red-500"
                    : isDraft && isFieldMissing("purpose")
                      ? "border-orange-400 bg-orange-50"
                      : ""
                }
              >
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">للبيع</SelectItem>
                <SelectItem value="rent">للإيجار</SelectItem>
                <SelectItem value="sold">مباعة</SelectItem>
                <SelectItem value="rented">مؤجرة</SelectItem>
              </SelectContent>
            </Select>
            {errors.purpose && (
              <p className="text-sm text-red-500">{errors.purpose}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              فئة الوحدة <span className="text-red-500">*</span>
            </Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) => onSelectChange("category", value)}
            >
              <SelectTrigger
                id="category"
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">المشروع</Label>
            <Select
              name="project"
              value={formData.project_id}
              onValueChange={(value) => onSelectChange("project_id", value)}
            >
              <SelectTrigger
                id="project"
                className={errors.project_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="اختر المشروع" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project && (
              <p className="text-sm text-red-500">{errors.project}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 z-9999">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="city" className="mb-1">
                اختر المدينة <span className="text-red-500">*</span>
                {isDraft && isFieldMissing("city_id") && (
                  <Badge
                    variant="outline"
                    className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
                  >
                    مطلوب
                  </Badge>
                )}
              </Label>
              <div
                className={
                  isDraft && isFieldMissing("city_id")
                    ? "border-2 border-orange-400 rounded-md"
                    : ""
                }
              >
                <CitySelector
                  selectedCityId={formData.city_id}
                  onCitySelect={onCitySelect}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="neighborhood" className="mb-1">
                اختر الحي
              </Label>
              <DistrictSelector
                selectedCityId={formData.city_id}
                selectedDistrictId={formData.district_id}
                onDistrictSelect={onDistrictSelect}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="PropertyType">
              نوع الوحدة <span className="text-red-500">*</span>
              {isDraft && isFieldMissing("type") && (
                <Badge
                  variant="outline"
                  className="mr-2 bg-orange-100 text-orange-800 border-orange-300 text-xs"
                >
                  مطلوب
                </Badge>
              )}
            </Label>
            <Select
              name="PropertyType"
              value={formData.PropertyType}
              onValueChange={(value) =>
                onInputChange({
                  target: { name: "PropertyType", value },
                })
              }
            >
              <SelectTrigger
                id="PropertyType"
                className={
                  errors.PropertyType
                    ? "border-red-500"
                    : isDraft && isFieldMissing("type")
                      ? "border-orange-400 bg-orange-50"
                      : ""
                }
              >
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">سكني</SelectItem>
                <SelectItem value="commercial">تجاري</SelectItem>
              </SelectContent>
            </Select>
            {errors.PropertyType && (
              <p className="text-sm text-red-500">{errors.PropertyType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="advertising_license">ترخيص اعلاني</Label>
            <Input
              id="advertising_license"
              name="advertising_license"
              value={formData.advertising_license}
              onChange={onInputChange}
              placeholder="أدخل رقم الترخيص الاعلاني"
              className={errors.advertising_license ? "border-red-500" : ""}
              dir="rtl"
            />
            {errors.advertising_license && (
              <p className="text-sm text-red-500">
                {errors.advertising_license}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
