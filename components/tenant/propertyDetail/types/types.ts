// ═══════════════════════════════════════════════════════════
// PROPERTY INTERFACE
// ═══════════════════════════════════════════════════════════
export interface Property {
  id: string;
  slug?: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms?: number;
  area?: string;
  type: string;
  transactionType: string;
  transactionType_en?: string;
  image: string;
  status?: string;
  description?: string;
  features?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  images?: string[];
  payment_method?: string;
  payment_method_en?: string;
  pricePerMeter?: string;
  building_age?: number;
  floors?: number;
  floor_number?: number;
  kitchen?: number;
  living_room?: number;
  majlis?: number;
  dining_room?: number;
  maid_room?: number;
  driver_room?: number;
  storage_room?: number;
  basement?: number;
  swimming_pool?: number;
  balcony?: number;
  garden?: number;
  elevator?: number;
  private_parking?: number;
  annex?: number;
  rooms?: number;
  length?: string;
  width?: string;
  street_width_north?: string;
  street_width_south?: string;
  street_width_east?: string;
  street_width_west?: string;
  facade_id?: number;
  facade_name?: string;
  building?: string | null;
  size?: string;
  floor_planning_image?: string[];
  video_url?: string;
  virtual_tour?: string;
  video_image?: string;
  faqs?: Array<{
    id: number;
    question: string;
    answer: string;
    displayOnPage: boolean;
  }>;
  project?: {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
  } | null;
}

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
export interface propertyDetail2Props {
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
    submitButtonText?: string;
  };
  displaySettings?: {
    showDescription?: boolean;
    showSpecs?: boolean;
    showContactForm?: boolean;
    showVideoUrl?: boolean;
    showMap?: boolean;
  };
  whatsApp?: {
    showButton?: boolean;
    buttonText?: string;
    phoneNumber?: string;
  };
  hero?: {
    height?: string;
    overlayOpacity?: number;
    background?: {
      type?: "colorOnly" | "imageAndColor" | "imageOnly";
      image?: string;
      color?: { useDefaultColor?: boolean; globalColorType?: string } | string;
      overlay?: {
        color?: { useDefaultColor?: boolean; globalColorType?: string } | string;
        opacity?: number;
      };
    };
  };
  gallery?: {
    showThumbnails?: boolean;
    thumbnailGridColumns?: number;
    thumbnailHeight?: string;
  };

  // Required prop for fetching property data
  propertySlug: string;

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}
