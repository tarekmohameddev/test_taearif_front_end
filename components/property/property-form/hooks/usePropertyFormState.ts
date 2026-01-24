import { useState, useRef } from "react";
import type {
  FormData,
  Images,
  Previews,
  ValidationErrors,
  FAQ,
} from "../types/propertyForm.types";

const initialFormData: FormData = {
  title: "",
  description: "",
  address: "",
  building_id: "",
  water_meter_number: "",
  electricity_meter_number: "",
  deed_number: "",
  price: "",
  category: "",
  project_id: "",
  purpose: "",
  bedrooms: "",
  bathrooms: "",
  size: "",
  features: [],
  status: "draft",
  featured: true,
  latitude: 24.766316905850978,
  longitude: 46.73579692840576,
  city_id: null,
  district_id: null,
  rooms: "",
  floors: "",
  floor_number: "",
  driver_room: "",
  maid_room: "",
  dining_room: "",
  living_room: "",
  majlis: "",
  storage_room: "",
  basement: "",
  swimming_pool: "",
  kitchen: "",
  balcony: "",
  garden: "",
  annex: "",
  elevator: "",
  private_parking: "",
  facade_id: "",
  length: "",
  width: "",
  street_width_north: "",
  street_width_south: "",
  street_width_east: "",
  street_width_west: "",
  building_age: "",
  payment_method: "",
  pricePerMeter: "",
  PropertyType: "",
  advertising_license: "",
  owner_number: "",
  video_url: "",
  virtual_tour: "",
};

export const usePropertyFormState = (mode: "add" | "edit", id?: string) => {
  // Form data
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentFeature, setCurrentFeature] = useState<string>("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Validation & errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [missingFieldsAr, setMissingFieldsAr] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Files & media
  const [images, setImages] = useState<Images>({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
    deedImage: null,
  });
  const [previews, setPreviews] = useState<Previews>({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
    deedImage: null,
  });
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [suggestedFaqsList, setSuggestedFaqsList] = useState<any[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProperty, setLoadingProperty] = useState<boolean>(
    mode === "edit" && id ? true : false,
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const [isCompletingDraft, setIsCompletingDraft] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // UI states
  const [activeTab, setActiveTab] = useState<"form" | "owner">("form");
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [isFloorPlansOpen, setIsFloorPlansOpen] = useState<boolean>(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isFaqsOpen, setIsFaqsOpen] = useState<boolean>(false);
  const [isOwnerDetailsOpen, setIsOwnerDetailsOpen] = useState<boolean>(false);

  // Map states
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchBox, setSearchBox] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Data states
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [facades, setFacades] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);

  // Refs
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
