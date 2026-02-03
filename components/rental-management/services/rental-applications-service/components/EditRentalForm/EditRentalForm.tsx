"use client";

import { AlertCircle, Loader2, Edit, Check, ChevronsUpDown } from "lucide-react";
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
import { useEditRentalForm } from "./useEditRentalForm";
import type { EditRentalFormProps } from "../../types/types";
import { TenantInfoSection, ContractDetailsSection } from "../AddRentalForm/AddRentalForm";

export function EditRentalForm({
  rental,
  onSubmit,
  onCancel,
  isSubmitting,
}: EditRentalFormProps) {
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
  } = useEditRentalForm(rental);

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
            prefix="edit_"
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
            prefix="edit_"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit_notes" className="text-sm font-medium text-gray-700">
            ملاحظات
          </Label>
          <Textarea
            id="edit_notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, notes: e.target.value }))
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
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Edit className="ml-2 h-4 w-4" />
                  تحديث الإيجار
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </div>
  );
}
