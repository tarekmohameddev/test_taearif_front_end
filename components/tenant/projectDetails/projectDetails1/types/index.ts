export interface Project {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  address?: string;
  metaKeyword?: string;
  metaDescription?: string;
  developer?: string;
  units?: number;
  completionDate?: string;
  completeStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  image?: string;
  images?: string[];
  floorplans?: string[];
  videoUrl?: string | null;
  amenities?: string[];
  featured?: boolean;
  published?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  specifications?: any[];
  types?: any[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for compatibility
  district?: string;
  price?: string;
  views?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: string;
  transactionType?: string;
  status?: string;
  features?: string[];
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  floors?: number;
}

export interface ProjectDetailsProps {
  // Component-specific props (match your default data structure)
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
    gap?: string;
  };
  styling?: {
    backgroundColor?: string;
    primaryColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    cardBackgroundColor?: string;
    borderColor?: string;
    badgeBackgroundColor?: string;
    badgeTextColor?: string;
  };
  content?: {
    badgeText?: string;
    similarProjectsTitle?: string;
    floorplansTitle?: string;
    locationTitle?: string;
    openInGoogleMapsText?: string;
    shareTitle?: string;
    shareDescription?: string;
  };
  displaySettings?: {
    showAddress?: boolean;
    showDeveloper?: boolean;
    showUnits?: boolean;
    showCompletionDate?: boolean;
    showCompleteStatus?: boolean;
    showMinPrice?: boolean;
    showMaxPrice?: boolean;
    showVideoUrl?: boolean;
    showLocation?: boolean;
    showCreatedAt?: boolean;
    showUpdatedAt?: boolean;
    showAmenities?: boolean;
    showSpecifications?: boolean;
    showTypes?: boolean;
    showFeatures?: boolean;
    showStatus?: boolean;
    showFloorplans?: boolean;
    showMap?: boolean;
    showSimilarProjects?: boolean;
    showShareButton?: boolean;
  };
  typography?: any;
  similarProjects?: any;
  gallery?: any;

  // Required prop for fetching project data
  projectSlug: string;

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}
