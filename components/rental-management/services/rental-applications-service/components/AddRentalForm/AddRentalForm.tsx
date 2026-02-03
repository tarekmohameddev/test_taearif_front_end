"use client";

import { AlertCircle, Loader2, Save, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogFooter } from "@/components/ui/dialog";
import { useAddRentalForm } from "./useAddRentalForm";
import type { AddRentalFormProps } from "../../types/types";

export function AddRentalForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: AddRentalFormProps) {
  const {
    formData,
    setFormData,
    projects,
    properties,
    loading,
    errors,
    setErrors,
    openProject,
    setOpenProject,
    openProperty,
    setOpenProperty,
    validateForm,
  } = useAddRentalForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const processedFormData: any = {
      ...formData,
      property_id: formData.property_id ? parseInt(formData.property_id) : null,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      rental_period: Number(formData.rental_period) || 12,
      base_rent_amount: formData.base_rent_amount
        ? parseFloat(formData.base_rent_amount)
        : 0,
      deposit_amount: formData.deposit_amount
        ? parseFloat(formData.deposit_amount)
        : 0,
    };

    onSubmit(processedFormData);
  };

  return (
    <div className="bg-white rounded-lg">
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 ml-2" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TenantInfoSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
          <ContractDetailsSection
            formData={formData}
            setFormData={setFormData}
            projects={projects}
            properties={properties}
            errors={errors}
            setErrors={setErrors}
            openProject={openProject}
            setOpenProject={setOpenProject}
            openProperty={openProperty}
            setOpenProperty={setOpenProperty}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            ملاحظات
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="ملاحظات إضافية حول العقد..."
            rows={3}
            className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  إضافة الإيجار
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </div>
  );
}

export function TenantInfoSection({
  formData,
  setFormData,
  errors,
  setErrors,
  prefix = "",
}: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
        معلومات المستأجر
      </h4>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}tenant_full_name`}
          className="text-sm font-medium text-gray-700"
        >
          الاسم الكامل <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${prefix}tenant_full_name`}
          value={formData.tenant_full_name}
          onChange={(e) => {
            setFormData((prev: any) => ({
              ...prev,
              tenant_full_name: e.target.value,
            }));
            if (errors.tenant_full_name) {
              setErrors((prev: any) => ({ ...prev, tenant_full_name: "" }));
            }
          }}
          placeholder="أدخل الاسم الكامل"
          className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_full_name ? "border-red-500" : ""}`}
        />
        {errors.tenant_full_name && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 ml-1" />
            {errors.tenant_full_name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}tenant_phone`}
          className="text-sm font-medium text-gray-700"
        >
          رقم الهاتف <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${prefix}tenant_phone`}
          value={formData.tenant_phone}
          onChange={(e) => {
            setFormData((prev: any) => ({
              ...prev,
              tenant_phone: e.target.value,
            }));
            if (errors.tenant_phone) {
              setErrors((prev: any) => ({ ...prev, tenant_phone: "" }));
            }
          }}
          placeholder="0551234567"
          className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_phone ? "border-red-500" : ""}`}
        />
        {errors.tenant_phone && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 ml-1" />
            {errors.tenant_phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}tenant_email`}
          className="text-sm font-medium text-gray-700"
        >
          البريد الإلكتروني
        </Label>
        <Input
          id={`${prefix}tenant_email`}
          type="email"
          value={formData.tenant_email}
          onChange={(e) => {
            setFormData((prev: any) => ({
              ...prev,
              tenant_email: e.target.value,
            }));
            if (errors.tenant_email) {
              setErrors((prev: any) => ({ ...prev, tenant_email: "" }));
            }
          }}
          placeholder="example@email.com"
          className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_email ? "border-red-500" : ""}`}
        />
        {errors.tenant_email && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 ml-1" />
            {errors.tenant_email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}tenant_job_title`}
          className="text-sm font-medium text-gray-700"
        >
          المهنة
        </Label>
        <Input
          id={`${prefix}tenant_job_title`}
          value={formData.tenant_job_title}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              tenant_job_title: e.target.value,
            }))
          }
          placeholder="مهندس، طبيب، معلم..."
          className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}tenant_social_status`}
          className="text-sm font-medium text-gray-700"
        >
          الحالة الاجتماعية
        </Label>
        <Select
          value={formData.tenant_social_status}
          onValueChange={(value) =>
            setFormData((prev: any) => ({
              ...prev,
              tenant_social_status: value,
            }))
          }
        >
          <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">أعزب</SelectItem>
            <SelectItem value="married">متزوج</SelectItem>
            <SelectItem value="divorced">مطلق</SelectItem>
            <SelectItem value="widowed">أرمل</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}tenant_national_id`}
          className="text-sm font-medium text-gray-700"
        >
          رقم الهوية
        </Label>
        <Input
          id={`${prefix}tenant_national_id`}
          value={formData.tenant_national_id}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              tenant_national_id: e.target.value,
            }))
          }
          placeholder="1234567890"
          className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
    </div>
  );
}

export function ContractDetailsSection({
  formData,
  setFormData,
  projects,
  properties,
  errors,
  setErrors,
  openProject,
  setOpenProject,
  openProperty,
  setOpenProperty,
  prefix = "",
}: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
        تفاصيل العقد
      </h4>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">المشروع</Label>
        <Popover open={openProject} onOpenChange={setOpenProject}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProject}
              className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            >
              {formData.project_id
                ? projects.find(
                    (project: any) =>
                      project.id.toString() === formData.project_id,
                  )?.contents?.[0]?.title || `مشروع ${formData.project_id}`
                : "اختر مشروع..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="ابحث عن مشروع..." />
              <CommandList>
                <CommandEmpty>لم يتم العثور على مشروع.</CommandEmpty>
                <CommandGroup>
                  {Array.isArray(projects) &&
                    projects.map((project: any) => (
                      <CommandItem
                        key={project.id}
                        value={
                          project.contents?.[0]?.title ||
                          `مشروع ${project.id}`
                        }
                        onSelect={() => {
                          setFormData((prev: any) => ({
                            ...prev,
                            project_id: project.id.toString(),
                          }));
                          setOpenProject(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.project_id === project.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {project.contents?.[0]?.title || `مشروع ${project.id}`}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">العقار</Label>
        <Popover open={openProperty} onOpenChange={setOpenProperty}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProperty}
              className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            >
              {formData.property_id
                ? properties.find(
                    (property: any) =>
                      property.id.toString() === formData.property_id,
                  )?.title || `عقار ${formData.property_id}`
                : "اختر عقار..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="ابحث عن عقار..." />
              <CommandList>
                <CommandEmpty>لا يوجد عقارات متاحة</CommandEmpty>
                <CommandGroup>
                  {Array.isArray(properties) &&
                    properties.map((property: any) => (
                      <CommandItem
                        key={property.id}
                        value={property.title || `عقار ${property.id}`}
                        onSelect={() => {
                          setFormData((prev: any) => ({
                            ...prev,
                            property_id: property.id.toString(),
                          }));
                          setOpenProperty(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.property_id === property.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {property.title || `عقار ${property.id}`}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}move_in_date`}
          className="text-sm font-medium text-gray-700"
        >
          تاريخ الانتقال <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${prefix}move_in_date`}
          type="date"
          value={formData.move_in_date}
          onChange={(e) => {
            setFormData((prev: any) => ({
              ...prev,
              move_in_date: e.target.value,
            }));
            if (errors.move_in_date) {
              setErrors((prev: any) => ({ ...prev, move_in_date: "" }));
            }
          }}
          className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.move_in_date ? "border-red-500" : ""}`}
        />
        {errors.move_in_date && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 ml-1" />
            {errors.move_in_date}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}rental_period_months`}
          className="text-sm font-medium text-gray-700"
        >
          مدة الإيجار (بالشهور) <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${prefix}rental_period_months`}
          type="number"
          value={formData.rental_period}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setFormData((prev: any) => ({ ...prev, rental_period: value }));

            if (value <= 0) {
              setErrors((prev: any) => ({
                ...prev,
                rental_period: "مدة الإيجار مطلوبة ولا تقل عن شهر واحد",
              }));
            } else {
              setErrors((prev: any) => ({ ...prev, rental_period: "" }));
            }
          }}
          min="1"
          className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.rental_period ? "border-red-500" : ""}`}
        />
        {errors.rental_period && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 ml-1" />
            {errors.rental_period}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}paying_plan`}
          className="text-sm font-medium text-gray-700"
        >
          خطة الدفع
        </Label>
        <Select
          value={formData.paying_plan}
          onValueChange={(value) =>
            setFormData((prev: any) => ({ ...prev, paying_plan: value }))
          }
        >
          <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">شهري</SelectItem>
            <SelectItem value="quarterly">ربع سنوي</SelectItem>
            <SelectItem value="semi_annual">نصف سنوي</SelectItem>
            <SelectItem value="annual">سنوي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}base_rent_amount`}
          className="text-sm font-medium text-gray-700"
        >
          مبلغ الإيجار <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${prefix}base_rent_amount`}
          type="number"
          value={formData.base_rent_amount}
          onChange={(e) => {
            setFormData((prev: any) => ({
              ...prev,
              base_rent_amount: e.target.value,
            }));
            if (errors.base_rent_amount) {
              setErrors((prev: any) => ({ ...prev, base_rent_amount: "" }));
            }
          }}
          placeholder="6500"
          min="100"
          className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.base_rent_amount ? "border-red-500" : ""}`}
        />
        {errors.base_rent_amount && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 ml-1" />
            {errors.base_rent_amount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`${prefix}deposit_amount`}
          className="text-sm font-medium text-gray-700"
        >
          مبلغ الضمان
        </Label>
        <Input
          id={`${prefix}deposit_amount`}
          type="number"
          value={formData.deposit_amount}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              deposit_amount: e.target.value,
            }))
          }
          placeholder="10000"
          className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
    </div>
  );
}
