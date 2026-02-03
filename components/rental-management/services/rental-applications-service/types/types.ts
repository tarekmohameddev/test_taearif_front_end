export interface Property {
  id: number;
  featured_image: string;
  price: string;
  beds: number;
  bath: number;
  area: string;
  latitude: string;
  longitude: string;
}

export interface RentalData {
  id: number;
  user_id: number;
  property_number: string;
  unit_label: string;
  tenant_full_name: string;
  tenant_phone: string;
  tenant_email: string;
  tenant_job_title: string;
  tenant_social_status: string;
  tenant_national_id: string;
  base_rent_amount: string;
  currency: string;
  deposit_amount: string;
  move_in_date: string;
  paying_plan: string;
  rental_period_months: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  property: Property;
  next_payment_due_date?: string;
  next_payment_amount?: string;
  contract_number?: string;
  unit_name?: string;
  property_name?: string;
  project_name?: string;
  property_id?: number;
  project_id?: number;
  active_contract?: {
    id: number;
    rental_id: number;
    start_date: string;
    end_date: string;
    status: string;
    contract_number: string;
    property_name?: string;
    project_name?: string;
    property_id?: number;
    project_id?: number;
    [key: string]: any;
  };
  lease_term?: {
    duration_days?: number;
    start_date?: string;
    end_date?: string;
  };
  rental_method_code?: string;
}

export interface ApiResponse {
  status: boolean;
  data: RentalData[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface RentalApplicationsServiceProps {
  openAddDialogCounter?: number;
  collectionsPeriod?: string;
  collectionsFromDate?: string;
  collectionsToDate?: string;
  paymentsDuePeriod?: string;
  paymentsDueFromDate?: string;
  paymentsDueToDate?: string;
}

export interface AddRentalFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface EditRentalFormProps {
  rental: RentalData;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface FilterOptions {
  contract_statuses: Array<{ id: string; name: string }>;
  rental_statuses: Array<{ id: string; name: string }>;
  payment_statuses: Array<{ id: string; name: string }>;
  paying_plans: Array<{ id: string; name: string }>;
  buildings: Array<{ id: number; name: string }>;
  projects: Array<{ id: number; name: string }>;
  units: Array<{ id: number; name: string }>;
}
