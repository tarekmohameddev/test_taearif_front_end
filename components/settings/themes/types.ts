export interface Theme {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  category: string;
  is_free: boolean;
  is_enabled: boolean;
  price?: number;
  currency?: string;
  popular?: boolean;
  has_access: boolean;
  purchased_at?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ThemesResponse {
  activeTheme: string;
  themes: Theme[];
  categories: Category[];
}

export interface SetActiveThemeResponse {
  success: boolean;
  message: string;
  data?: Theme;
  requires_purchase?: boolean;
  theme_id?: string;
  price?: number;
  currency?: string;
}

export interface PurchaseResponse {
  status: "success" | "error";
  payment_url?: string;
  payment_token?: string;
  user_theme_id?: number;
  amount?: number;
  currency?: string;
  message?: string;
}
