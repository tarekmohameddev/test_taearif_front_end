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

export interface PropertyFormState {
  formData: FormData;
  errors: ValidationErrors;
  missingFields: string[];
  missingFieldsAr: string[];
  validationErrors: string[];
  images: Images;
  previews: Previews;
  video: File | null;
  videoPreview: string | null;
  currentFeature: string;
  selectedFacilities: string[];
  faqs: FAQ[];
  newQuestion: string;
  newAnswer: string;
  suggestedFaqsList: any[];
  categories: any[];
  projects: any[];
  facades: any[];
  buildings: any[];
  isLoading: boolean;
  loadingProperty: boolean;
  uploading: boolean;
  isCompletingDraft: boolean;
  submitError: string | null;
  activeTab: "form" | "owner";
  // Card open/close states
  isDetailsOpen: boolean;
  isThumbnailOpen: boolean;
  isGalleryOpen: boolean;
  isVideoOpen: boolean;
  isFloorPlansOpen: boolean;
  isVirtualTourOpen: boolean;
  isLocationOpen: boolean;
  isFaqsOpen: boolean;
  isOwnerDetailsOpen: boolean;
  // Map states
  map: any;
  marker: any;
  searchBox: any;
  isMapLoaded: boolean;
}
