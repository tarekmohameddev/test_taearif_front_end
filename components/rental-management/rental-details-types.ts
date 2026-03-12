export interface RentalDetailsRental {
  rental_duration: number;
  id: number;
  tenant_full_name: string;
  tenant_phone: string;
  tenant_email: string;
  tenant_job_title: string;
  tenant_social_status: string;
  tenant_national_id: string;
  base_rent_amount: number;
  deposit_amount: number;
  currency: string;
  move_in_date: string;
  paying_plan: string;
  rental_period_months: number;
  status: string;
  notes: string;
  unit_name?: string;
  unit_label?: string;
  property_name?: string;
  project_name?: string;
  building_name?: string;
  property_number?: string;
  property_id?: number;
  project_id?: number;
  building_id?: number;
}

export interface RentalDetailsPropertyBuilding {
  id: number | null;
  name: string | null;
}

export interface RentalDetailsPropertyProject {
  id: number | null;
  name: string | null;
}

export interface RentalDetailsProperty {
  id: number | null;
  name: string | null;
  unit_label?: string;
  property_number?: string;
  building?: RentalDetailsPropertyBuilding | null;
  project?: RentalDetailsPropertyProject | null;
}

export interface RentalDetailsContract {
  id: number;
  contract_number: string;
  start_date: string;
  end_date: string;
  status: string;
  property_name?: string;
  project_name?: string;
  property_id?: number;
  project_id?: number;
}

export interface RentalPaymentItem {
  id: number;
  sequence_no: number;
  due_date: string;
  amount: number;
  paid_amount: number;
  status: string;
  payment_type: string;
  payment_status: string;
  reference: string | null;
  paid_at: string | null;
  payment_id: number | null;
  can_reverse: boolean;
}

export interface RentalDetailsPaymentDetails {
  items: RentalPaymentItem[];
}

export interface RentalDetails {
  rental: RentalDetailsRental;
  property: RentalDetailsProperty;
  contract: RentalDetailsContract;
  payment_details: RentalDetailsPaymentDetails;
}

