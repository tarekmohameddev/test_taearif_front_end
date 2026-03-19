"use client";

import React, { useMemo, useState } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  PropertyDetailsCard,
} from "@/components/property/property-form/components";
import { LocationCard as UnitLocationCard } from "@/components/property/location-card";
import { usePropertyFormState } from "@/components/property/property-form/hooks/usePropertyFormState";
import { usePropertyValidation } from "@/components/property/property-form/hooks/usePropertyValidation";
import { usePropertyHandlers } from "@/components/property/property-form/hooks/usePropertyHandlers";
import { usePropertyData } from "@/components/property/property-form/hooks/usePropertyData";
import { useSelectedFacilities } from "@/components/property/property-form/hooks/useSelectedFacilities";
import {
  facilitiesList,
  generateYears,
} from "@/components/property/property-form/utils/constants";

type PropertyMode = "add" | "edit";

export default function Step3PropertyEditorPanel() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const mode: PropertyMode = "add";
  const isDraft = true;

  const authLoading = useAuthStore((s) => s.IsLoading);
  const userToken = useAuthStore((s) => s.userData?.token);

  const years = useMemo(() => generateYears(), []);

  // Property form state (Zustand)
  const {
    formData,
    setFormData,
    currentFeature,
    setCurrentFeature,
    selectedFacilities,
    setSelectedFacilities,
    errors,
    setErrors,
    missingFields,
    setMissingFields,
    missingFieldsAr,
    setMissingFieldsAr,
    images,
    previews,
    setPreviews,
    setFaqs,
    setValidationErrors,
    setLoadingProperty,
    isLoading,
    isCompletingDraft,
    submitError,
    facades,
    setFacades,
    categories,
    setCategories,
    projects,
    setProjects,
    buildings,
    setBuildings,
  } = usePropertyFormState(mode);

  // Keep selectedFacilities in sync with numeric facility fields
  useSelectedFacilities(formData, setSelectedFacilities);

  const { isFieldMissing, cardHasMissingFields, validateUrl } =
    usePropertyValidation(
      formData,
      images,
      previews,
      mode,
      isDraft,
      missingFields,
      setErrors,
    );

  const { handleInputChange, handleSelectChange, handleCounterChange } =
    usePropertyHandlers(formData, setFormData, errors, setErrors, validateUrl);

  // Fetch dropdown data (facades/projects/categories/buildings) for selects.
  usePropertyData(
    mode,
    undefined,
    isDraft,
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

  const propertyDataForLocation = {
    title: formData.title || "",
    description: formData.description || "",
    price: formData.price || "",
    propertyType: formData.PropertyType || "",
    bedrooms: formData.bedrooms || "",
    bathrooms: formData.bathrooms || "",
    address: formData.address || "",
    latitude: formData.latitude ?? null,
    longitude: formData.longitude ?? null,
  };

  return (
    <div className="w-full">
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

      <div
        className={[
          "bg-white/95 border border-white/60 py-1 mt-4",
          editorOpen ? "rounded-3xl" : "rounded-full",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => {
            setEditorOpen((v) => !v);
            // When opening, keep the details card expanded.
            setDetailsOpen(true);
          }}
          aria-expanded={editorOpen}
          className="w-full rounded-full px-5 text-right text-[14px] text-black transition-colors"
        >
          إضافة وتعديل عقار
        </button>

        {editorOpen && (
          <div className="mt-3 p-5 space-y-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
            <PropertyDetailsCard
              formData={formData}
              errors={errors}
              currentFeature={currentFeature}
              selectedFacilities={selectedFacilities}
              facilitiesList={facilitiesList}
              facades={facades}
              years={years}
              isDraft={isDraft}
              missingFields={missingFields}
              isOpen={detailsOpen}
              setIsOpen={setDetailsOpen}
              setCurrentFeature={setCurrentFeature}
              onInputChange={handleInputChange as any}
              onSelectChange={handleSelectChange}
              onCounterChange={handleCounterChange}
              setSelectedFacilities={setSelectedFacilities}
              isFieldMissing={isFieldMissing}
              cardHasMissingFields={cardHasMissingFields}
              variant="plain"
              onboardingRoundedVariant="xl"
            />

            <div className="space-y-2">
              <div className="text-[18px] font-bold text-black text-right">
                موقع الوحدة
              </div>
              <UnitLocationCard
                propertyData={propertyDataForLocation}
                hideHeader={true}
                isDetailsPage={false}
                onboardingRoundedVariant="xl"
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

