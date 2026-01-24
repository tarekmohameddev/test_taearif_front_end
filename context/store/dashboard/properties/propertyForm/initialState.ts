import type { FormData, Images, Previews, FAQ } from "./types";

export const initialFormData: FormData = {
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

export const initialImages: Images = {
  thumbnail: null,
  gallery: [],
  floorPlans: [],
  deedImage: null,
};

export const initialPreviews: Previews = {
  thumbnail: null,
  gallery: [],
  floorPlans: [],
  deedImage: null,
};

export const initialFaqs: FAQ[] = [];

export const initialState = {
  formData: initialFormData,
  currentFeature: "",
  selectedFacilities: [] as string[],
  
  // UI State
  activeTab: "form" as "form" | "owner",
  isDetailsOpen: false,
  isThumbnailOpen: false,
  isGalleryOpen: false,
  isVideoOpen: false,
  isFloorPlansOpen: false,
  isVirtualTourOpen: false,
  isLocationOpen: false,
  isFaqsOpen: false,
  isOwnerDetailsOpen: false,
  isLoading: false,
  loadingProperty: false,
  uploading: false,
  isCompletingDraft: false,
  submitError: null as string | null,
  
  // Validation
  errors: {} as Record<string, string>,
  missingFields: [] as string[],
  missingFieldsAr: [] as string[],
  validationErrors: [] as string[],
  
  // Media
  images: initialImages,
  previews: initialPreviews,
  video: null as File | null,
  videoPreview: null as string | null,
  
  // FAQs
  faqs: initialFaqs,
  newQuestion: "",
  newAnswer: "",
  suggestedFaqsList: [] as any[],
  
  // Map
  map: null,
  marker: null,
  searchBox: null,
  isMapLoaded: false,
  
  // Data
  categories: [] as any[],
  projects: [] as any[],
  facades: [] as any[],
  buildings: [] as any[],
};
