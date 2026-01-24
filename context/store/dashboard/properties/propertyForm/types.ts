export interface PropertyFormProps {
  mode: "add" | "edit";
  isDraft?: boolean;
}

export interface FormData {
  title: string;
  description: string;
  address: string;
  building_id: string;
  water_meter_number: string;
  electricity_meter_number: string;
  deed_number: string;
  price: string;
  category: string;
  project_id: string;
  purpose: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  features: string[];
  status: string;
  featured: boolean;
  latitude: number;
  longitude: number;
  city_id: number | null;
  district_id: number | null;
  rooms: string;
  floors: string;
  floor_number: string;
  driver_room: string;
  maid_room: string;
  dining_room: string;
  living_room: string;
  majlis: string;
  storage_room: string;
  basement: string;
  swimming_pool: string;
  kitchen: string;
  balcony: string;
  garden: string;
  annex: string;
  elevator: string;
  private_parking: string;
  facade_id: string;
  length: string;
  width: string;
  street_width_north: string;
  street_width_south: string;
  street_width_east: string;
  street_width_west: string;
  building_age: string;
  payment_method: string;
  pricePerMeter: string;
  PropertyType: string;
  advertising_license: string;
  owner_number: string;
  video_url: string;
  virtual_tour: string;
  [key: string]: any;
}

export interface Images {
  thumbnail: File | null;
  gallery: File[];
  floorPlans: File[];
  deedImage?: File | null;
  [key: string]: any;
}

export interface Previews {
  thumbnail: string | null;
  gallery: string[];
  floorPlans: string[];
  deedImage: string | null;
  [key: string]: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  displayOnPage: boolean;
}

export interface Facility {
  key: string;
  label: string;
}

// Store Actions Interfaces
export interface FormDataActions {
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  updateFormField: (field: string, value: any) => void;
  resetFormData: () => void;
}

export interface UIStateActions {
  setActiveTab: (tab: "form" | "owner") => void;
  toggleCard: (cardName: string) => void;
  setIsDetailsOpen: (open: boolean) => void;
  setIsThumbnailOpen: (open: boolean) => void;
  setIsGalleryOpen: (open: boolean) => void;
  setIsVideoOpen: (open: boolean) => void;
  setIsFloorPlansOpen: (open: boolean) => void;
  setIsVirtualTourOpen: (open: boolean) => void;
  setIsLocationOpen: (open: boolean) => void;
  setIsFaqsOpen: (open: boolean) => void;
  setIsOwnerDetailsOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLoadingProperty: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setIsCompletingDraft: (isCompleting: boolean) => void;
  setSubmitError: (error: string | null) => void;
}

export interface ValidationActions {
  setErrors: (errors: ValidationErrors) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setMissingFields: (fields: string[]) => void;
  setMissingFieldsAr: (fields: string[]) => void;
  setValidationErrors: (errors: string[]) => void;
  clearValidation: () => void;
}

export interface MediaActions {
  setImages: (images: Images | ((prev: Images) => Images)) => void;
  setPreviews: (previews: Previews | ((prev: Previews) => Previews)) => void;
  setThumbnail: (file: File | null, preview: string | null) => void;
  addGalleryImage: (file: File, preview: string) => void;
  removeGalleryImage: (index: number) => void;
  addFloorPlan: (file: File, preview: string) => void;
  removeFloorPlan: (index: number) => void;
  setDeedImage: (file: File | null, preview: string | null) => void;
  setVideo: (file: File | null) => void;
  setVideoPreview: (preview: string | null) => void;
  removeImage: (type: "thumbnail" | "gallery" | "floorPlans" | "deedImage", index?: number) => void;
}

export interface FAQsActions {
  setFaqs: (faqs: FAQ[]) => void;
  addFaq: (faq: FAQ) => void;
  removeFaq: (id: number) => void;
  updateFaq: (id: number, faq: Partial<FAQ>) => void;
  setNewQuestion: (question: string) => void;
  setNewAnswer: (answer: string) => void;
  setSuggestedFaqsList: (list: any[]) => void;
}

export interface MapStateActions {
  setMap: (map: any) => void;
  setMarker: (marker: any) => void;
  setSearchBox: (searchBox: any) => void;
  setIsMapLoaded: (loaded: boolean) => void;
  setMapLocation: (lat: number, lng: number, address: string) => void;
}

export interface PropertyFormStore extends 
  FormDataActions,
  UIStateActions,
  ValidationActions,
  MediaActions,
  FAQsActions,
  MapStateActions {
  // State
  formData: FormData;
  currentFeature: string;
  selectedFacilities: string[];
  
  // UI State
  activeTab: "form" | "owner";
  isDetailsOpen: boolean;
  isThumbnailOpen: boolean;
  isGalleryOpen: boolean;
  isVideoOpen: boolean;
  isFloorPlansOpen: boolean;
  isVirtualTourOpen: boolean;
  isLocationOpen: boolean;
  isFaqsOpen: boolean;
  isOwnerDetailsOpen: boolean;
  isLoading: boolean;
  loadingProperty: boolean;
  uploading: boolean;
  isCompletingDraft: boolean;
  submitError: string | null;
  
  // Validation
  errors: ValidationErrors;
  missingFields: string[];
  missingFieldsAr: string[];
  validationErrors: string[];
  
  // Media
  images: Images;
  previews: Previews;
  video: File | null;
  videoPreview: string | null;
  
  // FAQs
  faqs: FAQ[];
  newQuestion: string;
  newAnswer: string;
  suggestedFaqsList: any[];
  
  // Map
  map: any;
  marker: any;
  searchBox: any;
  isMapLoaded: boolean;
  
  // Data
  categories: any[];
  projects: any[];
  facades: any[];
  buildings: any[];
  
  // Actions
  setCurrentFeature: (feature: string) => void;
  setSelectedFacilities: (facilities: string[]) => void;
  setCategories: (categories: any[]) => void;
  setProjects: (projects: any[]) => void;
  setFacades: (facades: any[]) => void;
  setBuildings: (buildings: any[]) => void;
  
  // Store Management
  resetStore: () => void;
  clearStore: () => void;
}
