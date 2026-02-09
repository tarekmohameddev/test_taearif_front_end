// أنواع البيانات للـ Dashboard Stats

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  onClick: () => void;
  loading?: boolean;
}

export interface RentalDashboardStatsProps {
  collectionsPeriod?: string;
  collectionsFromDate?: string;
  collectionsToDate?: string;
  paymentsDuePeriod?: string;
  paymentsDueFromDate?: string;
  paymentsDueToDate?: string;
}

export interface Rental {
  id: number;
  tenant_name: string;
  tenant_phone: string;
  property: {
    name: string;
    unit_label: string;
  };
  contract?: {
    id: number;
    end_date: string;
    status: string;
  };
  next_payment_amount: string | number;
  next_payment_due_on: string | null;
}

export interface Contract {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  days_until_expiry: number;
  rental: {
    tenant_name: string;
    tenant_phone: string;
    property: {
      name: string;
      unit_label: string;
    };
  };
}

export interface Maintenance {
  id: number;
  title?: string;
  rental_id: number;
  status: string;
  category: string;
  priority: string;
  payer: string;
  payer_share_percent: number;
  estimated_cost: string | number;
  description?: string;
  created_at: string;
  updated_at: string;
  assigned_to_vendor_id?: number;
}

export interface Payment {
  tenant_name?: string;
  tenant_phone?: string;
  property?: {
    name: string;
  };
  amount: number | string;
  due_date?: string;
  payment_details?: {
    amount: number | string;
    due_date?: string;
    payment_status?: string;
  };
  days_remaining?: number;
}
