export interface Tenant {
  id: string;
  name: string;
  domain: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  themeConfig: {
    fontFamily: string;
    borderRadius: string;
    buttonStyle: "rounded" | "square" | "pill";
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  legalInfo: {
    companyName: string;
    registrationNumber: string;
    vatId: string;
    jurisdiction: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  category: string;
  collections: string[];
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tenantId: string;
  specifications: Record<string, string>;
  shippingInfo: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingRestrictions: string[];
  };
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  _id: string;
  username: string;
  websiteName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  componentSettings?: Record<string, Record<string, any>>;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  tenantId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
  productCount: number;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: {
    minWeight: number;
    maxWeight: number;
    price: number;
  }[];
  estimatedDelivery: {
    min: number;
    max: number;
  };
}

export interface ReturnPolicy {
  eligibilityPeriod: number;
  conditions: string[];
  excludedCategories: string[];
  refundMethods: ("original_payment" | "store_credit" | "exchange")[];
  restockingFee: number;
}

export interface ComponentData {
  texts?: { [key: string]: string };
  images?: { [key: string]: string };
  colors?: { [key: string]: string };
  settings?: { [key: string]: any };
  // Allow component-specific arbitrary props (e.g., backgroundImages, services for hero3)
  [key: string]: any;
}

// Base component without layout to avoid infinite recursion
export interface BaseComponentInstance {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: ComponentData;
}

// Grid layout interface for smart positioning
export interface GridLayout {
  row: number; // رقم الصف الذي يوجد به المكون
  col: number; // رقم العمود (0 أو 1)
  span: number; // عدد الأعمدة التي يشغلها (1 أو 2)
}

// Component instance with layout support
export interface ComponentInstance {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: ComponentData;
  layout?: GridLayout; // استخدام التخطيط الشبكي الجديد
  // Legacy layout support (for backward compatibility)
  legacyLayout?: {
    type: "single" | "columns";
    columns?: {
      left: BaseComponentInstance;
      right?: BaseComponentInstance;
      leftWidth: number; // Percentage (e.g., 50 for 50%)
      rightWidth: number; // Percentage (e.g., 50 for 50%)
    };
  };
  // New properties for smart layout
  columnPosition?: "left" | "right" | "full"; // Which column this component is in
  parentRowId?: string; // ID of the parent row if this is a column component
}
