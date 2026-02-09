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
  length?: string;
  width?: string;
  street_width_north?: string;
  street_width_south?: string;
  street_width_east?: string;
  street_width_west?: string;
  rooms?: number;
  annex?: number;
  size?: string;
  facade_id?: number;
  property_id?: number;
  building?: any;
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
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
  project?: {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
  } | null;
}

export interface propertyDetailProps {
  propertySlug: string;
  whatsApp?: {
    showButton?: boolean;
    buttonText?: string;
    phoneNumber?: string;
  };
  displaySettings?: {
    showWhatsAppButton?: boolean;
  };
  content?: {
    whatsAppButtonText?: string;
    whatsAppPhoneNumber?: string;
  };
}
