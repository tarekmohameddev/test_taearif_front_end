export interface Customer {
  id: number;
  user_id: number;
  name: string;
  email: string | null;
  note: string | null;
  customer_type: string | null;
  priority: number;
  stage_id: number | null;
  procedure_id: number | null;
  city_id: number | null;
  district_id: number | null;
  phone_number: string;
  created_at: string;
  updated_at: string;
  // Optional fields for backward compatibility
  customer_id?: string;
  nameEn?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  district?: string;
  assignedAgent?: string;
  lastContact?: string;
  urgency?: string;
  pipelineStage?: string;
  dealValue?: number;
  probability?: number;
  avatar?: string;
  reminders?: Reminder[];
  interactions?: Interaction[];
  appointments?: Appointment[];
  notes?: string;
  joinDate?: string;
  nationality?: string;
  familySize?: number;
  leadSource?: string;
  satisfaction?: number;
  communicationPreference?: string;
  expectedCloseDate?: string;
  status?: string;
  totalValue?: number;
  property_basic?: {
    id?: number | null;
    title?: string | null;
    address?: string | null;
    price?: string | number | null;
    pricePerMeter?: string | number | null;
    purpose?: string | null;
    type?: string | null;
    beds?: number | null;
    bath?: number | null;
    area?: string | number | null;
    featured_image?: string | null;
  };
  responsible_employee?: {
    id: number;
    name: string;
    email: string;
    whatsapp_number: string;
  } | null;
  property_specifications?: {
    basic_information?: {
      address?: string | null;
      building?: string | null;
      price?: number | null;
      payment_method?: string | null;
      price_per_sqm?: number | null;
      listing_type?: string | null;
      property_category?: string | null;
      project?: string | null;
      city?: string | null;
      district?: string | number | null;
      area?: number | null;
      property_type?: string | null;
    };
    details?: {
      features?: any[];
    };
    attributes?: {
      area_sqft?: number | null;
      year_built?: number | null;
    };
    facilities?: {
      bedrooms?: number | null;
      bathrooms?: number | null;
      rooms?: number | null;
      floors?: number | null;
      floor_number?: number | null;
      drivers_room?: number | null;
      maids_room?: number | null;
      dining_room?: number | null;
      living_room?: boolean | null;
      majlis?: number | null;
      storage_room?: boolean | null;
      basement?: number | null;
      swimming_pool?: number | null;
      kitchen?: number | null;
      balcony?: boolean | null;
      garden?: number | null;
      annex?: boolean | null;
      elevator?: number | null;
      parking_space?: number | null;
    };
  };
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  icon: any;
  count: number;
  value: number;
  description?: string;
  iconName?: string;
  order?: number;
}

export interface Reminder {
  id: number | string;
  title: string;
  datetime: string;
  priority: number | string;
  priority_label?: string;
  priority_label_ar?: string;
  status?: "pending" | "completed" | "overdue" | "cancelled";
  status_label?: string;
  status_label_ar?: string;
  customer?: {
    id: number;
    name: string;
  };
  reminder_type?: {
    id: number;
    name: string;
    name_ar?: string;
    color: string;
    icon: string;
  };
  is_overdue?: boolean;
  days_until_due?: number;
  description?: string;
  notes?: string;
}

export interface Interaction {
  id: number;
  type: string;
  date: string;
  duration: string;
  notes: string;
  agent: string;
}

export interface Appointment {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  priority: string;
  notes: string;
  customer: Customer;
  property?: Property;
  datetime?: string;
  priority_label?: string;
  datetime_formatted?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
}
