import { useRef, useEffect } from "react";
import { usePropertyFormStore } from "@/context/store/dashboard/properties/propertyForm";

export const usePropertyFormState = (mode: "add" | "edit", id?: string) => {
  // Get state and actions from store
  const formData = usePropertyFormStore((state) => state.formData);
  const setFormData = usePropertyFormStore((state) => state.setFormData);
  const currentFeature = usePropertyFormStore((state) => state.currentFeature);
  const setCurrentFeature = usePropertyFormStore((state) => state.setCurrentFeature);
  const selectedFacilities = usePropertyFormStore((state) => state.selectedFacilities);
  const setSelectedFacilities = usePropertyFormStore((state) => state.setSelectedFacilities);

  // Validation & errors
  const errors = usePropertyFormStore((state) => state.errors);
  const setErrors = usePropertyFormStore((state) => state.setErrors);
  const missingFields = usePropertyFormStore((state) => state.missingFields);
  const setMissingFields = usePropertyFormStore((state) => state.setMissingFields);
  const missingFieldsAr = usePropertyFormStore((state) => state.missingFieldsAr);
  const setMissingFieldsAr = usePropertyFormStore((state) => state.setMissingFieldsAr);
  const validationErrors = usePropertyFormStore((state) => state.validationErrors);
  const setValidationErrors = usePropertyFormStore((state) => state.setValidationErrors);

  // Files & media
  const images = usePropertyFormStore((state) => state.images);
  const setImages = usePropertyFormStore((state) => state.setImages);
  const previews = usePropertyFormStore((state) => state.previews);
  const setPreviews = usePropertyFormStore((state) => state.setPreviews);
  const video = usePropertyFormStore((state) => state.video);
  const setVideo = usePropertyFormStore((state) => state.setVideo);
  const videoPreview = usePropertyFormStore((state) => state.videoPreview);
  const setVideoPreview = usePropertyFormStore((state) => state.setVideoPreview);

  // FAQs
  const faqs = usePropertyFormStore((state) => state.faqs);
  const setFaqs = usePropertyFormStore((state) => state.setFaqs);
  const newQuestion = usePropertyFormStore((state) => state.newQuestion);
  const setNewQuestion = usePropertyFormStore((state) => state.setNewQuestion);
  const newAnswer = usePropertyFormStore((state) => state.newAnswer);
  const setNewAnswer = usePropertyFormStore((state) => state.setNewAnswer);
  const suggestedFaqsList = usePropertyFormStore((state) => state.suggestedFaqsList);
  const setSuggestedFaqsList = usePropertyFormStore((state) => state.setSuggestedFaqsList);

  // Loading states
  const isLoading = usePropertyFormStore((state) => state.isLoading);
  const setIsLoading = usePropertyFormStore((state) => state.setLoading);
  const loadingProperty = usePropertyFormStore((state) => state.loadingProperty);
  const setLoadingProperty = usePropertyFormStore((state) => state.setLoadingProperty);
  const uploading = usePropertyFormStore((state) => state.uploading);
  const setUploading = usePropertyFormStore((state) => state.setUploading);
  const isCompletingDraft = usePropertyFormStore((state) => state.isCompletingDraft);
  const setIsCompletingDraft = usePropertyFormStore((state) => state.setIsCompletingDraft);
  const submitError = usePropertyFormStore((state) => state.submitError);
  const setSubmitError = usePropertyFormStore((state) => state.setSubmitError);

  // UI states
  const activeTab = usePropertyFormStore((state) => state.activeTab);
  const setActiveTab = usePropertyFormStore((state) => state.setActiveTab);
  const isDetailsOpen = usePropertyFormStore((state) => state.isDetailsOpen);
  const setIsDetailsOpen = usePropertyFormStore((state) => state.setIsDetailsOpen);
  const isThumbnailOpen = usePropertyFormStore((state) => state.isThumbnailOpen);
  const setIsThumbnailOpen = usePropertyFormStore((state) => state.setIsThumbnailOpen);
  const isGalleryOpen = usePropertyFormStore((state) => state.isGalleryOpen);
  const setIsGalleryOpen = usePropertyFormStore((state) => state.setIsGalleryOpen);
  const isVideoOpen = usePropertyFormStore((state) => state.isVideoOpen);
  const setIsVideoOpen = usePropertyFormStore((state) => state.setIsVideoOpen);
  const isFloorPlansOpen = usePropertyFormStore((state) => state.isFloorPlansOpen);
  const setIsFloorPlansOpen = usePropertyFormStore((state) => state.setIsFloorPlansOpen);
  const isVirtualTourOpen = usePropertyFormStore((state) => state.isVirtualTourOpen);
  const setIsVirtualTourOpen = usePropertyFormStore((state) => state.setIsVirtualTourOpen);
  const isLocationOpen = usePropertyFormStore((state) => state.isLocationOpen);
  const setIsLocationOpen = usePropertyFormStore((state) => state.setIsLocationOpen);
  const isFaqsOpen = usePropertyFormStore((state) => state.isFaqsOpen);
  const setIsFaqsOpen = usePropertyFormStore((state) => state.setIsFaqsOpen);
  const isOwnerDetailsOpen = usePropertyFormStore((state) => state.isOwnerDetailsOpen);
  const setIsOwnerDetailsOpen = usePropertyFormStore((state) => state.setIsOwnerDetailsOpen);

  // Map states
  const map = usePropertyFormStore((state) => state.map);
  const setMap = usePropertyFormStore((state) => state.setMap);
  const marker = usePropertyFormStore((state) => state.marker);
  const setMarker = usePropertyFormStore((state) => state.setMarker);
  const searchBox = usePropertyFormStore((state) => state.searchBox);
  const setSearchBox = usePropertyFormStore((state) => state.setSearchBox);
  const isMapLoaded = usePropertyFormStore((state) => state.isMapLoaded);
  const setIsMapLoaded = usePropertyFormStore((state) => state.setIsMapLoaded);

  // Data states
  const categories = usePropertyFormStore((state) => state.categories);
  const setCategories = usePropertyFormStore((state) => state.setCategories);
  const projects = usePropertyFormStore((state) => state.projects);
  const setProjects = usePropertyFormStore((state) => state.setProjects);
  const facades = usePropertyFormStore((state) => state.facades);
  const setFacades = usePropertyFormStore((state) => state.setFacades);
  const buildings = usePropertyFormStore((state) => state.buildings);
  const setBuildings = usePropertyFormStore((state) => state.setBuildings);

  // Initialize loadingProperty based on mode
  useEffect(() => {
    if (mode === "edit" && id) {
      setLoadingProperty(true);
    } else {
      setLoadingProperty(false);
    }
  }, [mode, id, setLoadingProperty]);

  // Refs (still local as they're component-specific)
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const floorPlansInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const deedImageInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  return {
    // Form data
    formData,
    setFormData,
    currentFeature,
    setCurrentFeature,
    selectedFacilities,
    setSelectedFacilities,

    // Validation & errors
    errors,
    setErrors,
    missingFields,
    setMissingFields,
    missingFieldsAr,
    setMissingFieldsAr,
    validationErrors,
    setValidationErrors,

    // Files & media
    images,
    setImages,
    previews,
    setPreviews,
    video,
    setVideo,
    videoPreview,
    setVideoPreview,

    // FAQs
    faqs,
    setFaqs,
    newQuestion,
    setNewQuestion,
    newAnswer,
    setNewAnswer,
    suggestedFaqsList,
    setSuggestedFaqsList,

    // Loading states
    isLoading,
    setIsLoading,
    loadingProperty,
    setLoadingProperty,
    uploading,
    setUploading,
    isCompletingDraft,
    setIsCompletingDraft,
    submitError,
    setSubmitError,

    // UI states
    activeTab,
    setActiveTab,
    isDetailsOpen,
    setIsDetailsOpen,
    isThumbnailOpen,
    setIsThumbnailOpen,
    isGalleryOpen,
    setIsGalleryOpen,
    isVideoOpen,
    setIsVideoOpen,
    isFloorPlansOpen,
    setIsFloorPlansOpen,
    isVirtualTourOpen,
    setIsVirtualTourOpen,
    isLocationOpen,
    setIsLocationOpen,
    isFaqsOpen,
    setIsFaqsOpen,
    isOwnerDetailsOpen,
    setIsOwnerDetailsOpen,

    // Map states
    map,
    setMap,
    marker,
    setMarker,
    searchBox,
    setSearchBox,
    isMapLoaded,
    setIsMapLoaded,

    // Data states
    categories,
    setCategories,
    projects,
    setProjects,
    facades,
    setFacades,
    buildings,
    setBuildings,

    // Refs
    thumbnailInputRef,
    galleryInputRef,
    floorPlansInputRef,
    videoInputRef,
    deedImageInputRef,
    searchInputRef,
    mapRef,
  };
};
