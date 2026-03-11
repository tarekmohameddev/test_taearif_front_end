/**
 * Access Control domain types.
 * Single source of truth for Employee, Role, Permission and API shapes.
 */

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  team_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

export interface Role {
  id: number;
  team_id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    role_id: number;
    model_type: string;
    team_id: number;
  };
  permissions_list?: string[];
  permissions?: Array<{
    id: number;
    name: string;
    pivot: {
      role_id: number;
      permission_id: number;
    };
  }>;
}

export interface Employee {
  id: number;
  tenant_id: number;
  account_type: string;
  active: boolean;
  last_login_at: string | null;
  google_id: string | null;
  first_name: string;
  last_name: string;
  photo: string | null;
  username: string | null;
  email: string;
  subscribed: boolean;
  subscription_amount: string;
  referral_code: string;
  referred_by: string | null;
  company_name: string | null;
  phone: string;
  message: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  country: string | null;
  rbac_version: number;
  rbac_seeded_at: string | null;
  featured: number;
  status: number;
  online_status: number;
  verification_link: string | null;
  email_verified: number;
  subdomain_status: number;
  created_at: string;
  updated_at: string;
  preview_template: number;
  template_img: string | null;
  template_serial_number: number;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  template_name: string | null;
  show_home: string | null;
  onboarding_completed: boolean;
  industry_type: string | null;
  short_description: string | null;
  logo: string | null;
  icon: string | null;
  primary_color: string;
  show_even_if_empty: boolean;
  roles: Role[];
  permissions: Permission[];
}

export interface EmployeesResponse {
  current_page: number;
  data: Employee[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface EmployeeDetailsResponse {
  status: string;
  data: Employee;
}

export interface PermissionsResponse {
  status: string;
  data: Permission[];
  grouped: {
    [key: string]: Permission[];
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export interface AvailableRolesResponse {
  status: string;
  data: Array<{
    id: number;
    name: string;
    permissions_list?: string[];
    permissions?: Array<{
      id: number;
      name: string;
      pivot: {
        role_id: number;
        permission_id: number;
      };
    }>;
  }>;
}

export interface RolesResponse {
  status: string;
  data: Role[];
}

export interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

export interface UpdateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

export interface RoleFormData {
  name: string;
  permissions: string[];
}

export interface AvailablePermissionItem {
  name: string;
  name_ar?: string;
  name_en?: string;
}

export interface RoleDetailsData {
  id: number;
  name: string;
  team_id: number;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions_list?: string[];
  permissions?: Permission[];
}
