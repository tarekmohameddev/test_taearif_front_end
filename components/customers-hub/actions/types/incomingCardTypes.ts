import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";

/** Minimal property block for card display (from action, metadata, or preferences) */
export interface PropertyBlock {
  title?: string;
  type?: string;
  price?: number;
  location?: string;
  /** When true, from customer preferences (request summary) not a specific listing */
  fromPreferences?: boolean;
}

/** Stage shape from API (list/stores) */
export interface ApiStageShape {
  id?: number;
  stage_id: string;
  stage_name_ar: string;
  stage_name_en: string;
  color: string;
  order: number;
}

/** Normalized stage option for UI (dropdown, display) */
export interface StageOption {
  id: string;
  numericId: number | null;
  nameAr: string;
  nameEn: string;
  color: string;
  order: number;
}

/** Props for IncomingActionsCard */
export interface IncomingActionsCardProps {
  action: CustomerAction;
  /** When provided, customer phone (and WhatsApp) are shown for quick contact */
  customer?: UnifiedCustomer;
  /** Stages from backend; if provided, used instead of store */
  stages?: ApiStageShape[];
  onComplete?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
  onSnooze?: (actionId: string, until: string) => void;
  onAddNote?: (actionId: string, note: string) => void;
  onQuickView?: (actionId: string) => void;
  isSelected?: boolean;
  onSelect?: (actionId: string, selected: boolean) => void;
  showCheckbox?: boolean;
  isCompact?: boolean;
  className?: string;
  /** Whether the action is currently being completed */
  isCompleting?: boolean;
  /** Called when inline schedule form opens/closes (for grid height) */
  onScheduleFormOpenChange?: (open: boolean) => void;
}

/** Result of getAIMatchingStatus for display */
export interface AIMatchingStatus {
  canMatch: boolean;
  matchCount: number;
  missingFields: string[];
}

/** Employee option for assign dialog (from /v1/employees) */
export interface EmployeeOption {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}
