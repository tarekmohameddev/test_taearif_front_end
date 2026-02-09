export interface Project {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  address?: string;
  developer?: string;
  units?: number;
  completionDate?: string;
  completeStatus?: number | string; // Can be number (0/1) or string
  minPrice?: string;
  maxPrice?: string;
  price?: string;
  image?: string;
  images?: string[];
  floorplans?: string[];
  videoUrl?: string | null;
  amenities?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  specifications?: any[];
  types?: any[];
  district?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  features?: string[];
  properties?: Array<{
    id: number;
    project_id?: number;
    title: string;
    slug: string;
    address?: string;
    description?: string;
    price: string;
    pricePerMeter?: string;
    purpose?: string;
    type?: string;
    beds?: number;
    bath?: number;
    area?: string;
    size?: string;
    featured_image: string;
    gallery?: string[];
    location?: {
      latitude: string;
      longitude: string;
    };
    status?: boolean;
    featured?: boolean;
    property_status?: string;
    features?: string[];
    faqs?: any[];
    category_id?: number;
    payment_method?: string | null;
    video_url?: string | null;
    virtual_tour?: string | null;
    created_at?: string;
    updated_at?: string;
  }>;
}

export interface ProjectDetails2Props {
  // Component-specific props
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
    formBackgroundColor?: string;
    formTextColor?: string;
    formButtonBackgroundColor?: string;
    formButtonTextColor?: string;
  };
  content?: {
    descriptionTitle?: string;
    specsTitle?: string;
    contactFormTitle?: string;
    contactFormDescription?: string;
    videoTourText?: string;
    submitButtonText?: string;
  };
  displaySettings?: {
    showDescription?: boolean;
    showSpecs?: boolean;
    showContactForm?: boolean;
    showVideoUrl?: boolean;
    showMap?: boolean;
  };
  hero?: {
    height?: string;
    overlayOpacity?: number;
  };
  gallery?: {
    showThumbnails?: boolean;
    thumbnailGridColumns?: number;
    thumbnailHeight?: string;
  };

  // Required prop for fetching project data
  projectSlug: string;

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}
