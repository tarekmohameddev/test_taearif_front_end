"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import { usePropertyFormStore } from "@/context/store/dashboard/properties/propertyForm";
import {
  PropertyFormHeader,
  BasicInfoCard,
  ThumbnailCard,
  GalleryCard,
  VideoCard,
  FloorPlansCard,
  VirtualTourCard,
  LocationCard as PropertyLocationCard,
  FAQsCard,
  OwnerDetailsCard,
  PropertyDetailsCard,
  PropertyFormActionsCard,
} from "./components";
import { usePropertyFormState } from "./hooks/usePropertyFormState";
import { usePropertyData } from "./hooks/usePropertyData";
import { usePropertyValidation } from "./hooks/usePropertyValidation";
import { useFileUpload } from "./hooks/useFileUpload";
import { useMapLocation } from "./hooks/useMapLocation";
import { useFAQs } from "./hooks/useFAQs";
import { usePropertySubmit } from "./hooks/usePropertySubmit";
import { usePropertyHandlers } from "./hooks/usePropertyHandlers";
import { useSelectedFacilities } from "./hooks/useSelectedFacilities";
import { facilitiesList, generateYears } from "./utils/constants";

const MapComponent = React.lazy(() => import("@/components/map-component"));

export default function PropertyForm({ mode, isDraft = false }) {
  // Cleanup store when component unmounts
  useEffect(() => {
    return () => {
      // تنظيف الـ store عند الخروج من الصفحة
      usePropertyFormStore.getState().clearStore();
    };
  }, []);
  const {
    propertiesManagement: { properties, loading, isInitialized },
    fetchProperties,
  } = useStore();
  const { userData, IsLoading: authLoading } = useAuthStore();
  const { checkPermission } = useUserStore();
  const router = useRouter();
  const { id } = useParams();

  // Check if user can access archive/owner details tab
  const canAccessArchive =
    userData?.account_type === "tenant" ||
    checkPermission("properties.owner_deed");

  // State management
  const state = usePropertyFormState(mode, id);

  // Data fetching
  usePropertyData(
    mode,
    id,
    isDraft,
    authLoading,
    userData?.token,
    state.setCategories,
    state.setProjects,
    state.setFacades,
    state.setBuildings,
    state.setFormData,
    state.setPreviews,
    state.setFaqs,
    state.setMissingFields,
    state.setMissingFieldsAr,
    state.setValidationErrors,
    state.setLoadingProperty,
  );

  // FAQs
  const faqsHook = useFAQs();
  useEffect(() => {
    if (!authLoading && userData?.token) {
      faqsHook.loadSuggestedFaqs().then((suggested) => {
        state.setSuggestedFaqsList(suggested);
      });
    }
  }, [authLoading, userData?.token]);

  // Validation
  const validation = usePropertyValidation(
    state.formData,
    state.images,
    state.previews,
    mode,
    isDraft,
    state.missingFields,
    state.setErrors,
  );

  // File upload
  const fileUpload = useFileUpload(
    state.images,
    state.setImages,
    state.previews,
    state.setPreviews,
    state.setVideo,
    state.setVideoPreview,
    state.errors,
    state.setErrors,
  );

  // Map location
  const mapLocation = useMapLocation(state.formData, state.setFormData);

  // Handlers
  const handlers = usePropertyHandlers(
    state.formData,
    state.setFormData,
    state.errors,
    state.setErrors,
    validation.validateUrl,
  );

  // Selected facilities
  useSelectedFacilities(state.formData, state.setSelectedFacilities);

  // Submit
  const submit = usePropertySubmit(
    mode,
    id,
    isDraft,
    state.formData,
    state.images,
    state.previews,
    state.video,
    state.videoPreview,
    faqsHook.faqs,
    authLoading,
    userData?.token,
    state.setErrors,
    state.setValidationErrors,
  );

  // Check property limit
  let hasReachedLimit = false;
  useEffect(() => {
    if (
      mode === "add" &&
      properties.length >=
        useAuthStore.getState().userData?.real_estate_limit_number
    ) {
      hasReachedLimit = true;
    }
  }, [properties, mode]);

  // Fetch properties for add mode
  useEffect(() => {
    if (mode === "add" && !isInitialized && !loading) {
      fetchProperties();
    }
  }, [fetchProperties, isInitialized, loading, properties, mode]);

  const years = generateYears();

  const pageTitle =
    mode === "add"
      ? "إضافة وحدة جديدة"
      : isDraft
        ? "إكمال الوحدة غير المكتملة"
        : "تعديل الوحدة";
  const submitButtonText =
    mode === "add" ? "نشر الوحدة" : "حفظ ونشر التغييرات";
  const draftButtonText =
    mode === "add" ? "حفظ كمسودة" : "حفظ التغييرات كمسودة";

  // Check if user is authenticated
  if (!userData?.token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-500">
            يرجى تسجيل الدخول لعرض المحتوى
          </p>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (state.loadingProperty && mode === "edit") {
    return (
      <div className="space-y-6 max-w-[1000px] mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Form Cards Skeleton */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-2">
          {/* Basic Info Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Images Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </CardContent>
        </Card>

        {/* Additional Cards Skeleton */}
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-52 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      {mode === "add" && hasReachedLimit && (
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">تنبيه!</strong>
          <span className="block sm:inline">
            {" "}
            لقد وصلت إلى الحد الأقصى لعدد الوحدات المسموح به (10 وحدات).
            لا يمكنك إضافة المزيد من الوحدات.
          </span>
        </div>
      )}

      <PropertyFormHeader
        mode={mode}
        isDraft={isDraft}
        pageTitle={pageTitle}
        submitButtonText={submitButtonText}
        draftButtonText={draftButtonText}
        activeTab={state.activeTab}
        setActiveTab={state.setActiveTab}
        canAccessArchive={canAccessArchive}
        isLoading={submit.isLoading}
        isCompletingDraft={submit.isCompletingDraft}
        submitError={submit.submitError}
        missingFieldsAr={state.missingFieldsAr}
        validationErrors={state.validationErrors}
        onBack={() =>
          router.push(
            isDraft ? "/dashboard/properties/incomplete" : "/dashboard/properties",
          )
        }
        onSave={submit.handleSubmit}
        onCompleteDraft={submit.handleCompleteDraft}
        router={router}
      />

      {/* Tab Content */}
      {state.activeTab === "form" ? (
        <div className="space-y-6">
          <div className="grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-2">
          <BasicInfoCard
            formData={state.formData}
            errors={state.errors}
            isDraft={isDraft}
            missingFields={state.missingFields}
            categories={state.categories}
            projects={state.projects}
            buildings={state.buildings}
            onInputChange={handlers.handleInputChange}
            onSwitchChange={handlers.handleSwitchChange}
            onSelectChange={(name, value) =>
              handlers.handleInputChange({
                target: { name, value },
              })
            }
            onCitySelect={handlers.handleCitySelect}
            onDistrictSelect={(districtId) =>
              state.setFormData((prev) => ({ ...prev, district_id: districtId }))
            }
            isFieldMissing={validation.isFieldMissing}
            cardHasMissingFields={validation.cardHasMissingFields}
          />

          <PropertyDetailsCard
            formData={state.formData}
            errors={state.errors}
            currentFeature={state.currentFeature}
            selectedFacilities={state.selectedFacilities}
            facilitiesList={facilitiesList}
            facades={state.facades}
            years={years}
            isDraft={isDraft}
            missingFields={state.missingFields}
            isOpen={state.isDetailsOpen}
            setIsOpen={state.setIsDetailsOpen}
            setCurrentFeature={state.setCurrentFeature}
            onInputChange={handlers.handleInputChange}
            onSelectChange={handlers.handleSelectChange}
            onCounterChange={handlers.handleCounterChange}
            setSelectedFacilities={state.setSelectedFacilities}
            isFieldMissing={validation.isFieldMissing}
            cardHasMissingFields={validation.cardHasMissingFields}
          />

          <ThumbnailCard
            previews={state.previews}
            images={state.images}
            errors={state.errors}
            isDraft={isDraft}
            missingFields={state.missingFields}
            uploading={fileUpload.uploading}
            isOpen={state.isThumbnailOpen}
            setIsOpen={state.setIsThumbnailOpen}
            thumbnailInputRef={state.thumbnailInputRef}
            onFileChange={fileUpload.handleFileChange}
            onRemoveImage={fileUpload.removeImage}
            cardHasMissingFields={validation.cardHasMissingFields}
          />

          <GalleryCard
            previews={state.previews}
            images={state.images}
            errors={state.errors}
            uploading={fileUpload.uploading}
            isOpen={state.isGalleryOpen}
            setIsOpen={state.setIsGalleryOpen}
            galleryInputRef={state.galleryInputRef}
            onFileChange={fileUpload.handleFileChange}
            onRemoveImage={fileUpload.removeImage}
          />

          <VideoCard
            video={state.video}
            videoPreview={state.videoPreview}
            errors={state.errors}
            uploading={fileUpload.uploading}
            isOpen={state.isVideoOpen}
            setIsOpen={state.setIsVideoOpen}
            videoInputRef={state.videoInputRef}
            onFileChange={fileUpload.handleFileChange}
            onRemoveVideo={fileUpload.removeVideo}
          />

          <FloorPlansCard
            previews={state.previews}
            images={state.images}
            uploading={fileUpload.uploading}
            isOpen={state.isFloorPlansOpen}
            setIsOpen={state.setIsFloorPlansOpen}
            floorPlansInputRef={state.floorPlansInputRef}
            onFileChange={fileUpload.handleFileChange}
            onRemoveImage={fileUpload.removeImage}
          />

          <VirtualTourCard
            formData={state.formData}
            onUrlChange={handlers.handleUrlChange}
            errors={state.errors}
            isOpen={state.isVirtualTourOpen}
            setIsOpen={state.setIsVirtualTourOpen}
          />

          <PropertyLocationCard
            formData={state.formData}
            onLocationUpdate={mapLocation.handleLocationUpdate}
            isDraft={isDraft}
            missingFields={state.missingFields}
            cardHasMissingFields={validation.cardHasMissingFields}
          />

          <FAQsCard
            faqs={faqsHook.faqs}
            newQuestion={faqsHook.newQuestion}
            newAnswer={faqsHook.newAnswer}
            suggestedFaqsList={state.suggestedFaqsList}
            isOpen={state.isFaqsOpen}
            setIsOpen={state.setIsFaqsOpen}
            setNewQuestion={faqsHook.setNewQuestion}
            setNewAnswer={faqsHook.setNewAnswer}
            onAddFaq={faqsHook.handleAddFaq}
            onRemoveFaq={faqsHook.handleRemoveFaq}
            onToggleFaqDisplay={faqsHook.handleToggleFaqDisplay}
            onSelectSuggestedFaq={faqsHook.handleSelectSuggestedFaq}
          />
          
          </div>

          {/* Actions Card - في النهاية خارج الـ grid */}
          <PropertyFormActionsCard
          mode={mode}
          isDraft={isDraft}
          isLoading={submit.isLoading}
          isCompletingDraft={submit.isCompletingDraft}
          submitError={submit.submitError}
          draftButtonText={draftButtonText}
          submitButtonText={submitButtonText}
          onBack={() =>
            router.push(
              isDraft ? "/dashboard/properties/incomplete" : "/dashboard/properties",
            )
          }
          onSave={submit.handleSubmit}
          onCompleteDraft={submit.handleCompleteDraft}
        />
        </div>
      ) : (
        /* Tab: تفاصيل المالك */
        canAccessArchive && (
          <div className="space-y-6">
            <OwnerDetailsCard
              formData={state.formData}
              previews={state.previews} 
              images={state.images}
              errors={state.errors}
              uploading={fileUpload.uploading}
              deedImageInputRef={state.deedImageInputRef}
              onInputChange={handlers.handleInputChange}
              onFileChange={fileUpload.handleFileChange}
              onRemoveImage={fileUpload.removeImage}
            />

            {/* Actions Card - في النهاية */}
            <PropertyFormActionsCard
              mode={mode}
              isDraft={isDraft}
              isLoading={submit.isLoading}
              isCompletingDraft={submit.isCompletingDraft}
              submitError={submit.submitError}
              draftButtonText={draftButtonText}
              submitButtonText={submitButtonText}
              onBack={() =>
                router.push(
                  isDraft ? "/dashboard/properties/incomplete" : "/dashboard/properties",
                )
              }
              onSave={submit.handleSubmit}
              onCompleteDraft={submit.handleCompleteDraft}
            />
          </div>
        )
      )}
    </div>
  );
}
