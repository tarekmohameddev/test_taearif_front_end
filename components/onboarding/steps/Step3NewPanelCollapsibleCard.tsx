"use client";

import React, { useState } from "react";
import { usePropertyFormState } from "@/components/property/property-form/hooks/usePropertyFormState";
import { usePropertyHandlers } from "@/components/property/property-form/hooks/usePropertyHandlers";
import { validateUrl as validateUrlUtil } from "@/components/property/property-form/utils/validation";
import BasicInfoCard from "@/components/property/property-form/components/BasicInfoCard";
import { usePropertyData } from "@/components/property/property-form/hooks/usePropertyData";
import useAuthStore from "@/context/AuthContext";

export default function Step3NewPanelCollapsibleCard() {
  const [commonTimesOpen, setCommonTimesOpen] = useState(false);

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    missingFields,
    setMissingFields,
    missingFieldsAr,
    setMissingFieldsAr,
    setValidationErrors,
    setLoadingProperty,
    categories,
    projects,
    buildings,
    setCategories,
    setProjects,
    setFacades,
    setBuildings,
    setPreviews,
    setFaqs,
  } = usePropertyFormState("add");

  const authLoading = useAuthStore((s) => s.IsLoading);
  const userToken = useAuthStore((s) => s.userData?.token);

  // Ensure dropdown data (categories/projects/buildings/facades) loads exactly like property add form.
  usePropertyData(
    "add",
    undefined,
    false,
    authLoading,
    userToken,
    setCategories,
    setProjects,
    setFacades,
    setBuildings,
    setFormData,
    setPreviews,
    setFaqs,
    setMissingFields,
    setMissingFieldsAr,
    setValidationErrors,
    setLoadingProperty,
  );

  const validateUrl = (value: string, name: string) => {
    if (!value.trim()) return;
    if (!validateUrlUtil(value)) {
      setErrors((prev: any) => ({ ...prev, [name]: "رابط غير صالح" }));
    }
  };

  const { handleInputChange, handleSwitchChange, handleSelectChange, handleCitySelect } =
    usePropertyHandlers(formData as any, setFormData as any, errors as any, setErrors as any, validateUrl);

  return (
    <>
      <style jsx global>{`
        .step3-scroll-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 158, 142, 0.7) transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        .step3-scroll-thin::-webkit-scrollbar-thumb {
          background-color: rgba(79, 158, 142, 0.75);
          border-radius: 9999px;
        }
        .step3-scroll-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      {/* One collapsible card */}
      <div
        className={[
          "bg-white/95 border border-white/60 py-1",
          commonTimesOpen ? "rounded-3xl" : "rounded-full",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setCommonTimesOpen((v) => !v)}
          aria-expanded={commonTimesOpen}
          className="w-full rounded-full px-5 text-right text-[14px] text-black  transition-colors "
        >
          تفاصيل إنشاء عقار جديد
        </button>

        {commonTimesOpen && (
          <div className="mt-3 p-5 space-y-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
            <BasicInfoCard
              formData={formData as any}
              errors={errors as any}
              isDraft={false}
              missingFields={missingFields as any}
              categories={categories as any}
              projects={projects as any}
              buildings={buildings as any}
              hideOnboardingIntro
              onInputChange={handleInputChange as any}
              onSwitchChange={handleSwitchChange}
              onSelectChange={handleSelectChange}
              onCitySelect={handleCitySelect}
              onDistrictSelect={(districtId) =>
                setFormData((prev: any) => ({ ...prev, district_id: districtId }))
              }
              isFieldMissing={(field) => (missingFields as any)?.includes?.(field) ?? false}
              cardHasMissingFields={(fields) =>
                Array.isArray(missingFields) &&
                fields.some((f) => (missingFields as any).includes(f))
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

