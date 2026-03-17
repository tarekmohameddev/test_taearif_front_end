// Unified Customer Types for Real Estate Customer Hub
// Designed for Saudi Arabia and Gulf Region Real Estate Operations

export type CustomerSource = 
  | 'inquiry'         // From website inquiry form
  | 'manual'          // Manually added by agent
  | 'whatsapp'        // From WhatsApp conversation
  | 'import'          // Bulk import
  | 'referral'        // Customer referral
  | 'property_request' // From property request form
  | 'website'         // From website
  | 'affiliate';      // From affiliate

export type CustomerActionType = 
  | 'new_inquiry'        // New customer interested in property
  | 'callback_request'   // Customer requested callback
  | 'property_match'     // New property matches customer preferences
  | 'follow_up'          // Scheduled follow-up
  | 'document_required'  // Documents pending
  | 'payment_due'        // Payment reminder
  | 'site_visit'         // Site visit to schedule/confirm
  | 'whatsapp_incoming'  // New WhatsApp message
  | 'ai_recommended';    // AI-generated recommendation

export type CustomerActionStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed' | 'snoozed';

export type ObjectType = "inquiry" | "property_request" | "reminder" | "appointment" | "customer_reminder";

export interface CustomerAction {
  id: string;
  customerId: string | number | null; // Can be number or null per API docs
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string;
  type: CustomerActionType;
  title: string;
  description?: string | null;
  priority: Priority;
  status: CustomerActionStatus;
  source: CustomerSource | string; // Can be string (empty string when not set per API docs)
  objectType?: ObjectType; // New field: Kind of record (inquiry, property_request, reminder, appointment, customer_reminder)
  dueDate?: string | null; // ISO 8601 datetime
  snoozedUntil?: string | null; // ISO 8601 datetime
  assignedTo?: string | null; // Employee ID
  assignedToName?: string;
  createdAt: string; // ISO 8601 datetime
  completedAt?: string | null; // ISO 8601 datetime
  completedBy?: string | null | any; // mixed type per API docs
  metadata?: Record<string, any>;
  // Backend API fields - sourceId is the actual request ID used for pipeline operations
  sourceId?: number | string; // The actual request ID from source table (e.g., property_request.id, inquiry.id, reminder.id)
  sourceTable?: string; // Table name where the request originates (e.g., "users_property_requests", "api_customer_inquiry", "reminders")
  stage_id?: string | null; // Current stage ID (string slug like "qualified", "new_lead")
  stage?: {
    stage_id: string;
    stage_name_ar: string;
    stage_name_en: string;
    color: string;
    order: number;
  } | null; // Stage object with details
  // New fields from API documentation
  propertyCategory?: string | null; // Unit type: villa, apartment, building, etc. (inquiries and property requests; null for follow-ups/appointments)
  propertyType?: string | null; // Sector: Residential, Commercial, Industrial, Agricultural (only set for property requests; null for inquiries)
  city?: string | null; // City (request-level). Inquiries and property requests; null for reminders/appointments/customer reminders
  state?: string | null; // State/region (request-level). Inquiries: region_name; property requests: region; null for others
  budgetMin?: number | null; // Min budget (request-level). Single budget or range min
  budgetMax?: number | null; // Max budget (request-level). Single budget or range max; null when not applicable
  // Extended fields for property requests (from users_property_requests)
  region?: string | null; // Region/administrative area (e.g. الرياض)
  property_type?: string | null; // Backend sometimes uses snake_case for property type
  category_id?: number | null;
  city_id?: number | null;
  districts_id?: number | null;
  area_from?: number | null;
  area_to?: number | null;
  purchase_method?: string | null;
  budget_from?: number | string | null;
  budget_to?: number | string | null;
  currency?: string | null;
  /** Arabic district name for property request (e.g. "حي برزان") */
  districtAR?: string | null;
  full_name?: string | null;
  phone?: string | null;
  contact_on_whatsapp?: boolean | number | null;
  seriousness?: string | null;
  /** Whether customer wants to receive similar offers (0/1 from backend). */
  wants_similar_offers?: number | boolean | null;
  /** Purchase goal/usage, e.g. "سكن خاص" */
  purchase_goal?: string | null;
  // Appointments and Reminders (populated for property_request and inquiry)
  appointments?: Appointment[]; // For objectType === 'property_request' or 'inquiry', otherwise empty array
  reminders?: Reminder[]; // For objectType === 'property_request' or 'inquiry', otherwise empty array
  // Notes (populated for property_request and inquiry)
  notes?: Note[]; // Array of notes for this action
  /** Flag from /v2/customers-hub/requests/list: true when this action existed on last mark-viewed and was updated after that time. */
  isUpdated?: boolean;
  // Properties linked to this action (e.g. from property_request; list view uses first item for thumbnail)
  properties?: Array<{
    id: number;
    title?: string;
    address?: string;
    slug?: string;
    price?: number;
    featuredImage?: string;
    district?: string;
    city?: string;
  }>;
  // Property request specific (when objectType === 'property_request'); from API
  property_request_id?: number;
  /** Status id from property_request_statuses (e.g. 1–5). Used to show label from GET /v1/property-requests/filters. */
  status_id?: number;
  /** Priority id from API (e.g. 235–237). Used to show label/color from GET /v1/property-requests/filters priorities. */
  priority_id?: number;
  propertyIds?: number[];
  property_ids?: number[] | string;
}

// CustomerLifecycleStage is now a string type to support dynamic stages from API
// Common stage IDs: 'new_lead', 'qualified', 'negotiation', 'closing', etc.
export type CustomerLifecycleStage = string;

export type PropertyPurpose = 'buy' | 'rent' | 'invest';
export type Timeline = 'immediate' | '1-3months' | '3-6months' | '6months+';
export type ChurnRisk = 'low' | 'medium' | 'high';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Stage interface matching API response structure
export interface Stage {
  id: number;                    // Internal DB id
  stage_id: string;              // Unique slug (e.g., "new_lead")
  stage_name_ar: string;
  stage_name_en: string;
  color: string;                 // Hex color
  order: number;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Legacy interface for backward compatibility
// Maps to Stage interface from API
export interface LifecycleStageInfo {
  id: CustomerLifecycleStage;    // stage_id from API
  nameAr: string;                // stage_name_ar from API
  nameEn: string;                // stage_name_en from API
  description: string;
  color: string;
  icon?: string;                 // Optional icon (not in API)
  order: number;
}

export interface SourceDetails {
  inquiryId?: string;
  referredBy?: string;
  referrerName?: string;
  campaign?: string;
  landingPage?: string;
  utmSource?: string;
  notes?: string;
}

export interface CustomerPreferences {
  propertyType: string[];  // ['villa', 'apartment', 'land', 'commercial']
  budgetMin?: number;
  budgetMax?: number;
  preferredAreas: string[];  // City - District format
  preferredCities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;  // in square meters
  maxArea?: number;
  purpose: PropertyPurpose;
  timeline: Timeline;
  amenities?: string[];  // ['pool', 'garage', 'garden', etc.]
  floorPreference?: string;  // 'ground', 'middle', 'top'
  furnishing?: 'furnished' | 'unfurnished' | 'semi-furnished' | 'any';
  notes?: string;
}

export interface AIInsights {
  nextBestAction?: string;
  nextBestActionEn?: string;
  churnRisk?: ChurnRisk;
  churnReasons?: string[];
  propertyMatches?: string[];  // Property IDs
  predictedCloseDate?: string;
  recommendedFollowUpDate?: string;
  sentimentScore?: number;  // -100 to 100
  engagementLevel?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  conversionProbability?: number;  // 0-100
  aiNotes?: string;
}

export interface StageChange {
  id: string;
  fromStage: CustomerLifecycleStage | null;
  toStage: CustomerLifecycleStage;
  changedBy: string;  // Employee name
  changedById: string;  // Employee ID
  changedAt: string;
  reason?: string;
  notes?: string;
  autoGenerated: boolean;
}

export interface PropertyInterest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyTitleEn?: string;
  propertyImage?: string;
  propertyPrice?: number;
  propertyType?: string;
  propertyLocation?: string;
  status: 'interested' | 'viewing_scheduled' | 'viewed' | 'liked' | 'rejected' | 'offer_made';
  addedAt: string;
  viewedAt?: string;
  feedback?: string;
  rating?: number;  // 1-5
  notes?: string;
}

export interface Interaction {
  id: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'site_visit' | 'note' | 'sms';
  direction?: 'inbound' | 'outbound';
  date: string;
  duration?: number;  // in minutes
  notes: string;
  outcome?: string;
  agentName: string;
  agentId: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface Appointment {
  id: string;
  title: string;
  titleEn?: string;
  type: 'site_visit' | 'office_meeting' | 'phone_call' | 'video_call' | 'contract_signing' | 'other';
  date: string;
  time: string;
  datetime?: string;
  duration: number;  // in minutes
  location?: string;
  propertyId?: string;
  propertyTitle?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  priority: Priority;
  notes?: string;
  agentName?: string;
  agentId?: string;
  reminderSent?: boolean;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  datetime: string;
  priority: Priority;
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  type: 'follow_up' | 'document' | 'payment' | 'viewing' | 'general';
  relatedTo?: string;  // appointment ID, property ID, etc.
  createdBy: string;
  createdById: string;
  completedAt?: string;
  isOverdue?: boolean;
  daysUntilDue?: number;
}

export interface Note {
  id: number;
  note: string;
  addedBy: string | number; // Can be user ID (number) or display name (string)
  addedByName?: string; // Name of the person who added the note
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}

export interface Document {
  id: string;
  name: string;
  type: 'id_copy' | 'contract' | 'agreement' | 'receipt' | 'photo' | 'other';
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy: string;
  uploadedById: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
}

export interface Employee {
  id: string;
  name: string;
  nameEn?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  role?: string;
  avatar?: string;
  isActive?: boolean;
}

// ============================================================================
// KSA-Specific Types for Saudi Arabia Real Estate Market
// ============================================================================

// REGA/FAL Broker Licensing & Compliance
export type BrokerageLicenseStatus = 'active' | 'expired' | 'suspended' | 'pending' | 'none';
export type BrokerageContractStatus = 'draft' | 'pending_approval' | 'active' | 'completed' | 'cancelled';

export interface BrokerageLicense {
  licenseNumber?: string;
  licenseType?: 'individual' | 'establishment';
  status: BrokerageLicenseStatus;
  issuedDate?: string;
  expiryDate?: string;
  issuedBy?: string;  // e.g., "REGA/FAL"
  verifiedAt?: string;
  notes?: string;
}

export interface BrokerageContract {
  id: string;
  contractNumber?: string;
  type: 'sale' | 'rent' | 'both';
  status: BrokerageContractStatus;
  propertyId?: string;
  propertyTitle?: string;
  commissionRate?: number;  // percentage
  commissionAmount?: number;
  exclusivityPeriod?: number;  // in days
  startDate: string;
  endDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  regaContractId?: string;  // REGA platform contract ID
  documents?: string[];  // Document IDs
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// EJAR Rental Compliance
export type EjarContractStatus = 'draft' | 'pending' | 'active' | 'expired' | 'terminated' | 'renewed';
export type TenancyType = 'residential' | 'commercial' | 'industrial';

export interface EjarContract {
  id: string;
  ejarContractNumber?: string;  // Official EJAR contract number
  propertyId?: string;
  propertyTitle?: string;
  tenancyType: TenancyType;
  status: EjarContractStatus;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit?: number;
  paymentSchedule?: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  landlordId?: string;
  landlordName?: string;
  tenantName?: string;
  createdInEjar?: boolean;
  ejarCreatedAt?: string;
  ejarUrl?: string;
  autoRenewal?: boolean;
  renewalNotificationSent?: boolean;
  documents?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Wafi Off-Plan Developer Workflow
export type WafiProjectStatus = 'planning' | 'licensed' | 'construction' | 'completed' | 'handed_over';
export type EscrowMilestoneStatus = 'pending' | 'in_progress' | 'certified' | 'released' | 'overdue';

export interface WafiLicense {
  licenseNumber?: string;
  projectId?: string;
  projectName?: string;
  developerName?: string;
  status: WafiProjectStatus;
  issuedDate?: string;
  totalUnits?: number;
  soldUnits?: number;
  reservedUnits?: number;
  verifiedAt?: string;
  notes?: string;
}

export interface EscrowMilestone {
  id: string;
  projectId?: string;
  milestoneNumber: number;
  title: string;
  titleEn?: string;
  description?: string;
  targetDate: string;
  completionDate?: string;
  status: EscrowMilestoneStatus;
  percentage: number;  // % of total project
  amount?: number;
  certifiedBy?: string;  // Consulting office
  certifiedAt?: string;
  releaseRequested?: boolean;
  releaseApproved?: boolean;
  releaseDate?: string;
  documents?: string[];
  notes?: string;
  isOverdue?: boolean;
}

export interface HandoverDefect {
  id: string;
  unitId?: string;
  category: 'structural' | 'electrical' | 'plumbing' | 'finishing' | 'hvac' | 'other';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  reportedBy?: string;
  reportedAt: string;
  status: 'open' | 'in_progress' | 'resolved' | 'deferred';
  assignedTo?: string;
  targetResolutionDate?: string;
  resolvedAt?: string;
  photos?: string[];
  notes?: string;
}

// Sakani/NHC Housing Programs
export type SakaniEligibilityStatus = 'not_checked' | 'eligible' | 'not_eligible' | 'pending_verification';
export type SakaniProductType = 'ready_unit' | 'under_construction' | 'self_construction' | 'moh_land' | 'easy_installment';

export interface SakaniEligibility {
  status: SakaniEligibilityStatus;
  sakaniId?: string;  // Beneficiary ID in Sakani system
  eligibilityCheckedAt?: string;
  interestedProducts?: SakaniProductType[];
  householdIncome?: number;
  householdSize?: number;
  firstTimeOwner?: boolean;
  currentlyOwnsProperty?: boolean;
  eligibilityNotes?: string;
  approvedLoanAmount?: number;
  downPaymentSupport?: number;
  verifiedAt?: string;
}

// Real Estate Registry
export interface RegistryInfo {
  deedNumber?: string;  // صك الملكية
  registryOffice?: string;
  registeredOwner?: string;
  registrationDate?: string;
  verifiedAt?: string;
  notes?: string;
}

// Financing & Mortgage
export type MortgageStatus = 'not_applied' | 'pre_approved' | 'application_submitted' | 'approved' | 'rejected' | 'disbursed';
export type FinancingType = 'conventional' | 'islamic' | 'subsidized' | 'self_funded';

export interface MortgageInfo {
  status: MortgageStatus;
  financingType?: FinancingType;
  bankName?: string;
  applicationNumber?: string;
  preApprovedAmount?: number;
  approvedAmount?: number;
  interestRate?: number;
  loanTenure?: number;  // in years
  monthlyPayment?: number;
  downPaymentRequired?: number;
  downPaymentPaid?: number;
  applicationDate?: string;
  approvalDate?: string;
  disbursementDate?: string;
  redfSupport?: boolean;  // Real Estate Development Fund
  redfAmount?: number;
  documents?: string[];
  notes?: string;
}

export interface PaymentSchedule {
  id: string;
  type: 'down_payment' | 'installment' | 'escrow_release' | 'final_payment' | 'other';
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paidAmount?: number;
  paidDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  escrowAccount?: string;
  notes?: string;
}

// KSA Compliance Summary
export interface KSACompliance {
  brokerageLicense?: BrokerageLicense;
  brokerageContracts?: BrokerageContract[];
  ejarContracts?: EjarContract[];
  wafiLicense?: WafiLicense;
  escrowMilestones?: EscrowMilestone[];
  handoverDefects?: HandoverDefect[];
  sakaniEligibility?: SakaniEligibility;
  registryInfo?: RegistryInfo;
  mortgageInfo?: MortgageInfo;
  paymentSchedule?: PaymentSchedule[];
}

/** آخر طلب عقاري للعميل (من API قائمة العملاء) */
export interface LastPropertyRequest {
  district?: string | null;
  city?: string | null;
  propertyType?: string | null;
  listingTypeLabel?: string | null;
}

export interface UnifiedCustomer {
  // Core Identity
  id: string;
  name: string;
  nameEn?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  nationalId?: string;
  nationality?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  
  // Source Tracking
  source: CustomerSource;
  /** الترجمة العربية للمصدر من API (مثل: واتساب، يدوي، لوحة الموظف) */
  sourceAr?: string;
  sourceDetails?: SourceDetails;
  
  // Lifecycle
  stage: CustomerLifecycleStage;
  stageHistory: StageChange[];
  
  // Preferences (Real Estate Specific)
  preferences: CustomerPreferences;
  
  // AI-Powered Fields
  leadScore: number;  // 0-100
  aiInsights: AIInsights;
  
  // Priority & Classification
  priority: Priority;
  customerType?: string;  // 'individual', 'investor', 'company'
  tags: string[];
  
  // Relationships
  assignedEmployee?: Employee;
  assignedEmployeeId?: string;
  properties: PropertyInterest[];
  interactions: Interaction[];
  appointments: Appointment[];
  reminders: Reminder[];
  documents: Document[];
  
  // Financial
  totalDealValue?: number;
  expectedRevenue?: number;
  paidAmount?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
  lastContactType?: string;
  nextFollowUpDate?: string;
  
  // Additional Info
  address?: string;
  city?: string;
  district?: string;
  notes?: string;
  familySize?: number;
  occupation?: string;
  
  // Location (for map view)
  latitude?: number;
  longitude?: number;
  
  // Stats
  totalInteractions?: number;
  totalAppointments?: number;
  totalPropertyViews?: number;
  totalPropertyRequests?: number;  // Total property requests count
  responseRate?: number;  // 0-100
  avgResponseTime?: number;  // in hours

  /** آخر طلب عقاري (الحي، المدينة، نوع العقار، بيع/إيجار) */
  lastPropertyRequest?: LastPropertyRequest | null;
  
  // Pipeline-specific fields (for customers-hub pipeline)
  // These fields are set by the pipeline API to distinguish between requests and inquiries
  requestId?: number | null;  // Property request ID (set when this is a property request)
  inquiryId?: number | null;  // Inquiry ID (api_customer_inquiry.id) (set when this is an inquiry)
  
  // KSA-Specific Compliance & Workflows
  ksaCompliance?: KSACompliance;
}

// Lifecycle Stage Definitions (DEPRECATED - Use dynamic stages from API)
// Kept for backward compatibility only
export const LIFECYCLE_STAGES: LifecycleStageInfo[] = [
  {
    id: 'new_lead',
    nameAr: 'عميل جديد',
    nameEn: 'New Lead',
    description: 'Initial inquiry from any source',
    color: '#3b82f6',  // blue
    icon: 'UserPlus',
    order: 1,
  },
  {
    id: 'qualified',
    nameAr: 'مؤهل',
    nameEn: 'Qualified',
    description: 'Budget, timeline, and preferences confirmed',
    color: '#8b5cf6',  // purple
    icon: 'UserCheck',
    order: 2,
  },
  {
    id: 'property_matching',
    nameAr: 'مطابقة العقارات',
    nameEn: 'Property Matching',
    description: 'AI-assisted property recommendations',
    color: '#06b6d4',  // cyan
    icon: 'Search',
    order: 3,
  },
  {
    id: 'site_visit',
    nameAr: 'معاينة',
    nameEn: 'Site Visit',
    description: 'Property viewing scheduled or completed',
    color: '#10b981',  // green
    icon: 'MapPin',
    order: 4,
  },
  {
    id: 'negotiation',
    nameAr: 'تفاوض',
    nameEn: 'Negotiation',
    description: 'Price and terms discussion',
    color: '#f59e0b',  // amber
    icon: 'MessageSquare',
    order: 5,
  },
  {
    id: 'contract_prep',
    nameAr: 'إعداد العقد',
    nameEn: 'Contract Preparation',
    description: 'Legal documentation preparation',
    color: '#f97316',  // orange
    icon: 'FileText',
    order: 6,
  },
  {
    id: 'down_payment',
    nameAr: 'الدفعة الأولى',
    nameEn: 'Down Payment',
    description: 'Initial payment received',
    color: '#84cc16',  // lime
    icon: 'DollarSign',
    order: 7,
  },
  {
    id: 'closing',
    nameAr: 'إتمام الصفقة',
    nameEn: 'Closing',
    description: 'Final transaction completion',
    color: '#22c55e',  // green
    icon: 'CheckCircle',
    order: 8,
  },
  {
    id: 'post_sale',
    nameAr: 'ما بعد البيع',
    nameEn: 'Post-Sale',
    description: 'Handover, support, and referral nurturing',
    color: '#6366f1',  // indigo
    icon: 'Award',
    order: 9,
  },
];

// Helper Functions
// These functions now work with dynamic stages from API
// If stages array is provided, use it; otherwise fall back to LIFECYCLE_STAGES

/** قيمة المرحلة عندما يكون العميل بدون مرحلة (stage.id = null من API) */
export const NO_STAGE_ID = "no_stage";

export const getStageInfo = (
  stageId: CustomerLifecycleStage,
  stages?: Stage[]
): LifecycleStageInfo | undefined => {
  if (stageId === NO_STAGE_ID || stageId == null || stageId === "") {
    return {
      id: NO_STAGE_ID,
      nameAr: "بدون مرحلة",
      nameEn: "No stage",
      description: "",
      color: "#9ca3af",
      order: 0,
    };
  }
  // If dynamic stages are provided, use them
  if (stages && stages.length > 0) {
    const stage = stages.find(s => s.stage_id === stageId);
    if (stage) {
      return {
        id: stage.stage_id,
        nameAr: stage.stage_name_ar,
        nameEn: stage.stage_name_en,
        description: stage.description || '',
        color: stage.color,
        order: stage.order,
      };
    }
  }
  
  // Fallback to hardcoded stages
  return LIFECYCLE_STAGES.find(s => s.id === stageId);
};

export const getStageColor = (
  stageId: CustomerLifecycleStage,
  stages?: Stage[]
): string => {
  return getStageInfo(stageId, stages)?.color || '#6b7280';
};

export const getStageNameAr = (
  stageId: CustomerLifecycleStage,
  stages?: Stage[]
): string => {
  return getStageInfo(stageId, stages)?.nameAr || stageId;
};

export const getStageNameEn = (
  stageId: CustomerLifecycleStage,
  stages?: Stage[]
): string => {
  return getStageInfo(stageId, stages)?.nameEn || stageId;
};

// Helper to convert API Stage to LifecycleStageInfo
export const stageToLifecycleStageInfo = (stage: Stage): LifecycleStageInfo => {
  return {
    id: stage.stage_id,
    nameAr: stage.stage_name_ar,
    nameEn: stage.stage_name_en,
    description: stage.description || '',
    color: stage.color,
    order: stage.order,
  };
};

export const calculateLeadScore = (customer: Partial<UnifiedCustomer>): number => {
  let score = 50; // Base score
  
  // Source quality (0-15 points)
  if (customer.source === 'referral') score += 15;
  else if (customer.source === 'inquiry') score += 10;
  else if (customer.source === 'whatsapp') score += 8;
  else if (customer.source === 'manual') score += 5;
  
  // Budget alignment (0-20 points)
  if (customer.preferences?.budgetMin && customer.preferences.budgetMin > 500000) {
    score += 20;
  } else if (customer.preferences?.budgetMin && customer.preferences.budgetMin > 200000) {
    score += 15;
  } else if (customer.preferences?.budgetMin) {
    score += 10;
  }
  
  // Timeline urgency (0-15 points)
  if (customer.preferences?.timeline === 'immediate') score += 15;
  else if (customer.preferences?.timeline === '1-3months') score += 12;
  else if (customer.preferences?.timeline === '3-6months') score += 8;
  else if (customer.preferences?.timeline === '6months+') score += 5;
  
  // Engagement (0-20 points)
  const totalInteractions = customer.totalInteractions || 0;
  if (totalInteractions >= 10) score += 20;
  else if (totalInteractions >= 5) score += 15;
  else if (totalInteractions >= 2) score += 10;
  else if (totalInteractions >= 1) score += 5;
  
  // Response rate (0-15 points)
  const responseRate = customer.responseRate || 0;
  if (responseRate >= 90) score += 15;
  else if (responseRate >= 70) score += 12;
  else if (responseRate >= 50) score += 8;
  else if (responseRate >= 30) score += 5;
  
  // Stage progression (0-15 points)
  const stageOrder = getStageInfo(customer.stage as CustomerLifecycleStage)?.order || 1;
  if (stageOrder >= 7) score += 15;
  else if (stageOrder >= 5) score += 12;
  else if (stageOrder >= 3) score += 8;
  else score += 5;
  
  return Math.min(100, Math.max(0, score));
};

// Filters and Statistics Types
export interface CustomerFilters {
  search?: string;
  stage?: CustomerLifecycleStage[];
  source?: CustomerSource[];
  priority?: Priority[];
  assignedEmployee?: string[];
  /** أولوية (معرفات من filter-options - للإرسال المباشر للـ API) */
  priorityIds?: number[];
  /** نوع العقار (معرفات من filter-options - للإرسال المباشر للـ API) */
  typeIds?: number[];
  /** مدينة (معرفات من filter-options) */
  city?: number[];
  /** حي (معرفات من filter-options) */
  district?: number[];
  leadScoreMin?: number;
  leadScoreMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  propertyType?: string[];
  preferredAreas?: string[];
  tags?: string[];
  createdFrom?: string;
  createdTo?: string;
  lastContactFrom?: string;
  lastContactTo?: string;
  
  // KSA-Specific Filters
  brokerageLicenseStatus?: BrokerageLicenseStatus[];
  brokerageContractStatus?: BrokerageContractStatus[];
  ejarContractStatus?: EjarContractStatus[];
  wafiProjectStatus?: WafiProjectStatus[];
  sakaniEligibility?: SakaniEligibilityStatus[];
  mortgageStatus?: MortgageStatus[];
  hasEscrowOverdue?: boolean;
  hasHandoverDefects?: boolean;
}

export interface CustomerStatistics {
  total: number;
  byStage: Record<CustomerLifecycleStage, number>;
  bySource: Record<CustomerSource, number>;
  byPriority: Record<Priority, number>;
  avgLeadScore: number;
  totalDealValue: number;
  conversionRate: number;
  avgDaysInPipeline: number;
  activeCustomers: number;
  newThisMonth: number;
  closedThisMonth: number;
}
