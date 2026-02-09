export interface Property {
  id: number;
  featured_image?: string;
  featured_image_url?: string;
  price?: string;
  beds?: number;
  bath?: number;
  area?: string;
  property_status?: string;
  featured?: boolean;
  category?: {
    name: string;
  };
  purpose?: string;
  contents?: Array<{
    title?: string;
    address?: string;
  }>;
  features?: string;
  pivot?: {
    assigned_at?: string;
  };
}

export interface Owner {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  id_number: string;
  address: string;
  city: string;
  email_verified_at: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  properties: Property[];
}

export interface EditFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  is_active: boolean;
}

export interface PasswordData {
  password: string;
  confirmPassword: string;
}

export interface CreateFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  id_number: string;
  address: string;
  city: string;
  is_active: boolean;
}
