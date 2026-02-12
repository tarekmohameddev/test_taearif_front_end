"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SourceBadge } from "./SourceBadge";
import { ActionQuickPanel } from "./ActionQuickPanel";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import {
  getStageNameAr,
  getStageColor,
  LIFECYCLE_STAGES,
  type CustomerLifecycleStage,
} from "@/types/unified-customer";
import type { Appointment } from "@/types/unified-customer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, User, Eye, Phone, Building2, MapPin, DollarSign, Clock, ChevronDown, UserPlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateCustomerStage as apiUpdateCustomerStage } from "@/lib/services/customers-hub-requests-api";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";

// Note: Stages now use string stage_id, no need for numeric mapping

/** Translate property type from English to Arabic */
const translatePropertyType = (propertyType: string | null | undefined): string => {
  if (!propertyType) return '';
  const translations: { [key: string]: string } = {
    Residential: "سكني",
    Industrial: "صناعي",
    Agricultural: "زراعي",
    Commercial: "تجاري",
  };
  return translations[propertyType] || propertyType;
};

type PropertyBlock = {
  title?: string;
  type?: string;
  price?: number;
  location?: string;
  /** When true, this is from customer preferences (request summary) not a specific listing */
  fromPreferences?: boolean;
};

/** Minimal property data that may be stored in action.metadata for property requests */
function getPropertyFromMetadata(metadata: Record<string, unknown> | undefined): PropertyBlock | null {
  if (!metadata || typeof metadata !== "object") return null;
  try {
    const title =
      (metadata.propertyTitle as string) ??
      (metadata.property_title as string) ??
      (metadata.title as string);
    const type =
      (metadata.propertyType as string) ??
      (metadata.property_type as string) ??
      (metadata.type as string);
    const price =
      (metadata.propertyPrice as number) ??
      (metadata.property_price as number) ??
      (metadata.price as number);
    const location =
      (metadata.propertyLocation as string) ??
      (metadata.property_location as string) ??
      (metadata.location as string) ??
      (metadata.address as string);
    if (!title && !type && price == null && !location) return null;
    return { title, type, price, location, fromPreferences: false };
  } catch {
    return null;
  }
}

/** Extract property data directly from action object (property requests) */
function getPropertyFromAction(action: CustomerAction): PropertyBlock | null {
  // Check if this is a property request
  if (action.objectType !== 'property_request') return null;
  
  const hasData = 
    action.propertyType || 
    action.city || 
    action.budgetMin != null || 
    action.budgetMax != null;
  
  if (!hasData) return null;
  
  // Format budget (display numbers as-is without conversion to millions, use English locale)
  let priceRange: string | undefined;
  if (action.budgetMin != null && action.budgetMax != null && action.budgetMin !== action.budgetMax) {
    priceRange = `${action.budgetMin.toLocaleString("en-US")}–${action.budgetMax.toLocaleString("en-US")} ر.س`;
  } else if (action.budgetMin != null) {
    priceRange = `${action.budgetMin.toLocaleString("en-US")} ر.س`;
  } else if (action.budgetMax != null) {
    priceRange = `${action.budgetMax.toLocaleString("en-US")} ر.س`;
  }
  
  // Format location (city only, no state)
  const location = action.city || undefined;
  
  return {
    title: priceRange,
    type: action.propertyType ? translatePropertyType(action.propertyType) : undefined,
    price: action.budgetMin ?? action.budgetMax ?? undefined,
    location,
    fromPreferences: false,
  };
}

/** Build minimal property/request summary from customer preferences when no metadata property */
function getPropertyFromPreferences(customer: UnifiedCustomer | undefined): PropertyBlock | null {
  if (!customer?.preferences) return null;
  const p = customer.preferences;
  const type =
    p.propertyType?.length
      ? p.propertyType.join("، ")
      : undefined;
  const price =
    p.budgetMin != null || p.budgetMax != null
      ? (p.budgetMin ?? p.budgetMax)!
      : undefined;
  const priceRange =
    p.budgetMin != null && p.budgetMax != null && p.budgetMin !== p.budgetMax
      ? `${(p.budgetMin / 1_000_000).toFixed(1)}–${(p.budgetMax / 1_000_000).toFixed(1)} م.ر`
      : p.budgetMin != null
        ? `${(p.budgetMin / 1_000_000).toFixed(1)} م.ر`
        : undefined;
  const location =
    p.preferredAreas?.length
      ? p.preferredAreas.slice(0, 2).join(" · ")
      : p.preferredCities?.length
        ? p.preferredCities.slice(0, 2).join("، ")
        : undefined;
  if (!type && !priceRange && !location) return null;
  return {
    title: priceRange ?? undefined,
    type,
    price: p.budgetMin ?? p.budgetMax,
    location,
    fromPreferences: true,
  };
}

/** Required data for AI property matching: property type/purpose + budget or location */
const AI_MATCHING_REQUIRED = {
  propertyType: "نوع العقار",
  budget: "الميزانية",
  location: "المنطقة أو المدينة",
} as const;

function getAIMatchingStatus(customer: UnifiedCustomer | undefined): {
  canMatch: boolean;
  matchCount: number;
  missingFields: string[];
} {
  const matchCount = customer?.aiInsights?.propertyMatches?.length ?? 0;
  if (!customer?.preferences) {
    return {
      canMatch: false,
      matchCount,
      missingFields: [AI_MATCHING_REQUIRED.propertyType, AI_MATCHING_REQUIRED.budget, AI_MATCHING_REQUIRED.location],
    };
  }
  const p = customer.preferences;
  const hasPropertyType = (p.propertyType?.length ?? 0) > 0;
  const hasPurpose = !!p.purpose;
  const hasBudget = p.budgetMin != null || p.budgetMax != null;
  const hasLocation =
    (p.preferredAreas?.length ?? 0) > 0 || (p.preferredCities?.length ?? 0) > 0;
  const canMatch = (hasPropertyType || hasPurpose) && (hasBudget || hasLocation);
  const missingFields: string[] = [];
  if (!hasPropertyType && !hasPurpose) missingFields.push(AI_MATCHING_REQUIRED.propertyType);
  if (!hasBudget) missingFields.push(AI_MATCHING_REQUIRED.budget);
  if (!hasLocation) missingFields.push(AI_MATCHING_REQUIRED.location);
  return {
    canMatch,
    matchCount,
    missingFields,
  };
}

interface IncomingActionsCardProps {
  action: CustomerAction;
  /** When provided, customer phone (and WhatsApp) are shown on the card for quick contact */
  customer?: UnifiedCustomer;
  /** Stages from backend API - if provided, will use these instead of fetching */
  stages?: Array<{
    stage_id: string;
    stage_name_ar: string;
    stage_name_en: string;
    color: string;
    order: number;
  }>;
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
}

const priorityColors = {
  urgent: "border-red-500 bg-red-50/50 dark:bg-red-950/30",
  high: "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30",
  medium: "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30",
  low: "border-green-500 bg-green-50/50 dark:bg-green-950/30",
};

const priorityLabels = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

const APPOINTMENT_TYPES: { value: Appointment["type"]; label: string }[] = [
  { value: "site_visit", label: "معاينة عقار" },
  { value: "office_meeting", label: "اجتماع مكتب" },
  { value: "phone_call", label: "مكالمة هاتفية" },
  { value: "video_call", label: "مكالمة فيديو" },
  { value: "contract_signing", label: "توقيع عقد" },
  { value: "other", label: "أخرى" },
];

export function IncomingActionsCard({
  action,
  customer,
  stages: propStages,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  isSelected = false,
  onSelect,
  showCheckbox = true,
  isCompact = false,
  className,
  isCompleting = false,
}: IncomingActionsCardProps) {
  const router = useRouter();
  const { addAppointment, addAppointmentForRequest, updateCustomerStage, getCustomerById } = useUnifiedCustomersStore();
  const { userData } = useAuthStore();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [aptType, setAptType] = useState<Appointment["type"]>("office_meeting");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("10:00");
  const [aptNotes, setAptNotes] = useState("");
  const [isSubmittingApt, setIsSubmittingApt] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [showAssignEmployeeDialog, setShowAssignEmployeeDialog] = useState(false);
  const [employees, setEmployees] = useState<Array<{ id: number; name?: string; first_name?: string; last_name?: string; email?: string }>>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  // Stages now use string stage_id, no mapping needed

  const resolvedCustomer =
    customer ??
    getCustomerById(
      typeof action.customerId === "string" ? action.customerId : String(action.customerId)
    );

  // Normalize customer.stage to always be a string (handle API objects)
  // Default to 'new_lead' if no stage is found
  // Use stages from Zustand store (fetched once, shared across all components)
  // Prefer propStages if provided, otherwise use store stages
  const { stages: storeStages } = useCustomersHubStagesStore();

  // Transform stages to match the expected format
  const availableStages = React.useMemo(() => {
    // Use propStages if provided AND not empty (prevents API spam)
    // Otherwise fallback to storeStages from Zustand store
    const stagesToUse = (propStages && propStages.length > 0) ? propStages : storeStages;
    if (!stagesToUse || stagesToUse.length === 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:257',message:'availableStages empty - no stages loaded',data:{actionId:action.id,propStagesLength:propStages?.length,storeStagesLength:storeStages?.length},timestamp:Date.now(),runId:'debug1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      return [];
    }
    const mapped = stagesToUse.map((stage: any) => {
      // propStages may not have 'id', only stage_id, so we need to handle both cases
      // storeStages has both id (number) and stage_id (string)
      const numericId = stage.id !== undefined ? stage.id : null;
      return {
        id: stage.stage_id, // stage_id (string) for UI matching
        numericId: numericId, // id (number) for API requests - may be null for propStages
        nameAr: stage.stage_name_ar,
        nameEn: stage.stage_name_en,
        color: stage.color,
        order: stage.order,
      };
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:272',message:'availableStages mapped',data:{actionId:action.id,availableStagesCount:mapped.length,availableStagesIds:mapped.map(s=>s.id),availableStagesSample:mapped.slice(0,3).map(s=>({id:s.id,numericId:s.numericId,nameAr:s.nameAr}))},timestamp:Date.now(),runId:'debug1',hypothesisId:'H1,H2,H3'})}).catch(()=>{});
    // #endregion
    return mapped;
  }, [propStages, storeStages]);

  // Get stage from multiple sources: action.stage_id, action.stage, or resolvedCustomer.stage
  const stageSource = React.useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:275',message:'stageSource - checking action data',data:{actionId:action.id,actionStageId:(action as any).stage_id,actionStageIdType:typeof (action as any).stage_id,actionStage:(action as any).stage,actionStageType:typeof (action as any).stage,resolvedCustomerStage:resolvedCustomer?.stage},timestamp:Date.now(),runId:'debug1',hypothesisId:'H1,H2,H3'})}).catch(()=>{});
    // #endregion
    // Priority 1: action.stage_id (string)
    if ((action as any).stage_id) {
      const result = (action as any).stage_id;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:278',message:'stageSource - using action.stage_id',data:{actionId:action.id,stageSource:result,stageSourceType:typeof result},timestamp:Date.now(),runId:'debug1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return result;
    }
    // Priority 2: action.stage object (extract stage_id)
    if ((action as any).stage && typeof (action as any).stage === 'object') {
      const stageObj = (action as any).stage;
      const result = stageObj.stage_id || stageObj.id || stageObj.name;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:282',message:'stageSource - using action.stage object',data:{actionId:action.id,stageObj,extracted:result,extractedType:typeof result,hasStageId:!!stageObj.stage_id,hasId:!!stageObj.id,hasName:!!stageObj.name},timestamp:Date.now(),runId:'debug1',hypothesisId:'H2,H3'})}).catch(()=>{});
      // #endregion
      return result;
    }
    // Priority 3: resolvedCustomer.stage
    if (resolvedCustomer?.stage) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:286',message:'stageSource - using resolvedCustomer.stage',data:{actionId:action.id,resolvedCustomerStage:resolvedCustomer.stage},timestamp:Date.now(),runId:'debug1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      return resolvedCustomer.stage;
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:288',message:'stageSource - returning null',data:{actionId:action.id},timestamp:Date.now(),runId:'debug1',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    return null;
  }, [action, resolvedCustomer?.stage]);

  // Normalize stage using availableStages from API, with fallback to LIFECYCLE_STAGES
  const normalizedStage = React.useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:293',message:'normalizedStage - start',data:{actionId:action.id,stageSource,stageSourceType:typeof stageSource,availableStagesLength:availableStages.length},timestamp:Date.now(),runId:'debug1',hypothesisId:'H1,H2,H3,H4,H5'})}).catch(()=>{});
    // #endregion
    if (!stageSource) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:293',message:'normalizedStage - stageSource is null, returning new_lead',data:{actionId:action.id},timestamp:Date.now(),runId:'debug1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      return 'new_lead' as CustomerLifecycleStage;
    }
    
    // Validate against availableStages if loaded
    if (availableStages.length > 0) {
      // If stageSource is a number, search by numericId first (action.stage_id is numeric from API)
      // If stageSource is a string, search by stage_id (string slug)
      let validStage;
      if (typeof stageSource === 'number') {
        // Search by numericId when stageSource is a number
        validStage = availableStages.find(s => s.numericId === stageSource);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:303',message:'normalizedStage - searching by numericId',data:{actionId:action.id,stageSource,found:!!validStage,validStageId:validStage?.id,validStageNameAr:validStage?.nameAr,allAvailableNumericIds:availableStages.map(s=>s.numericId)},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
        // #endregion
      } else {
        // stageSource is string or object - extract string stage_id
        const stageId = typeof stageSource === "string" 
          ? stageSource 
          : (typeof stageSource === "object" && stageSource !== null
              ? ((stageSource as any).stage_id || (stageSource as any).id?.toString() || (stageSource as any).name || String(stageSource))
              : String(stageSource));
        validStage = availableStages.find(s => s.id === stageId);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:310',message:'normalizedStage - searching by stage_id string',data:{actionId:action.id,stageId,found:!!validStage,validStageId:validStage?.id,validStageNameAr:validStage?.nameAr,allAvailableIds:availableStages.map(s=>s.id)},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H2,H3'})}).catch(()=>{});
        // #endregion
      }
      
      const result = (validStage ? validStage.id : 'new_lead') as CustomerLifecycleStage;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:315',message:'normalizedStage - result from availableStages',data:{actionId:action.id,normalizedStage:result},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H1,H2,H3,H5'})}).catch(()=>{});
      // #endregion
      return result;
    }
    
    // Fallback to LIFECYCLE_STAGES if API stages not loaded yet
    const stageId = typeof stageSource === "string" 
      ? stageSource 
      : (typeof stageSource === "object" && stageSource !== null
          ? ((stageSource as any).stage_id || (stageSource as any).id || (stageSource as any).name || String(stageSource))
          : String(stageSource));
    const validStage = LIFECYCLE_STAGES.find(s => s.id === stageId);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:323',message:'normalizedStage - fallback to LIFECYCLE_STAGES',data:{actionId:action.id,stageId,found:!!validStage,validStageId:validStage?.id,validStageNameAr:validStage?.nameAr},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    const result = (validStage ? validStage.id : 'new_lead') as CustomerLifecycleStage;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'IncomingActionsCard.tsx:325',message:'normalizedStage - final result',data:{actionId:action.id,normalizedStage:result},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H1,H2,H3,H4,H5'})}).catch(()=>{});
    // #endregion
    return result;
  }, [stageSource, availableStages]);

  // Get numeric stage ID from customer.stage if it's an object
  // Get stage_id (string) from stage object or value
  const getStageId = (stage: any): string | null => {
    if (typeof stage === 'string') {
      return stage; // Already a stage_id string
    }
    if (typeof stage === 'object' && stage !== null) {
      // Try stage_id first, then id
      return stage.stage_id || stage.id?.toString() || null;
    }
    return null;
  };

  const propertyFromAction = getPropertyFromAction(action);
  const propertyFromMeta = getPropertyFromMetadata(action.metadata);
  const propertyFromPrefs = getPropertyFromPreferences(customer);
  /** Priority: action data > metadata > customer preferences */
  const property = propertyFromAction ?? propertyFromMeta ?? propertyFromPrefs;
  const showPropertyBlock = property && (property.title || property.type || property.price != null || property.location);
  const aiMatching = getAIMatchingStatus(resolvedCustomer);

  const isOverdue =
    action.dueDate && new Date(action.dueDate) < new Date();

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card background, not on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, [role="checkbox"], input, [data-interactive]');
    if (!isInteractive) {
      // Navigate to request details page
      router.push(`/ar/dashboard/customers-hub/requests/${action.id}`);
    }
  };

  // Handle stage change with optimistic update
  const handleStageChange = async (newStage: CustomerLifecycleStage) => {
    if (isUpdatingStage) return;

    // Get current stage from resolvedCustomer if available
    const currentStage = normalizedStage || resolvedCustomer?.stage;
    
    // If already in the same stage, do nothing
    if (currentStage === newStage) return;

    // Optimistic update: Update UI immediately if customer exists
    const previousStage = currentStage;
    if (resolvedCustomer && action.customerId) {
      updateCustomerStage(String(action.customerId), newStage);
    }

    setIsUpdatingStage(true);

    try {
      // For stage updates, we need the property request ID (numeric)
      // Priority order (sourceId is the primary source from API):
      // 1. action.sourceId (from API - this is the actual request ID from source table) - REQUIRED
      // 2. metadata.requestId or metadata.propertyRequestId (fallback for old data)
      // 3. Extract number from action.id (e.g., "reminder_3" -> 3) (last resort)
      // NOTE: We do NOT use customerId anymore as it's not the request ID
      let requestId: string | number | undefined;
      
      // Priority 1: Use sourceId from API (this is the actual request ID) - REQUIRED
      if (action.sourceId !== undefined && action.sourceId !== null && action.sourceId !== "") {
        const sourceIdNum = typeof action.sourceId === "string" 
          ? parseInt(action.sourceId.toString()) 
          : Number(action.sourceId);
        if (!isNaN(sourceIdNum) && sourceIdNum > 0) {
          requestId = sourceIdNum;
        }
      }
      
      // If sourceId is not available, throw error (sourceId is required per API docs)
      if (!requestId) {
        // Fallback to metadata only if sourceId is truly missing (for backward compatibility)
        if (action.metadata) {
          const metadataId = (action.metadata.requestId as number | string) || 
                            (action.metadata.propertyRequestId as number | string) ||
                            (action.metadata.request_id as number | string);
          if (metadataId) {
            const metadataIdNum = typeof metadataId === "string" 
              ? parseInt(metadataId.toString()) 
              : Number(metadataId);
            if (!isNaN(metadataIdNum) && metadataIdNum > 0) {
              requestId = metadataIdNum;
            }
          }
        }
        
        // Last resort - try to extract number from action.id
        if (!requestId && action.id) {
          const idStr = String(action.id);
          // Try direct parseInt first
          const directParse = parseInt(idStr);
          if (!isNaN(directParse) && directParse > 0) {
            requestId = directParse;
          } else {
            // Try to extract number from string (e.g., "property_request_41" -> 41)
            const numberMatch = idStr.match(/\d+/);
            if (numberMatch) {
              const extracted = parseInt(numberMatch[0]);
              if (!isNaN(extracted) && extracted > 0) {
                requestId = extracted;
              }
            }
          }
        }
        
        // Validate that we found a valid requestId
        if (!requestId || requestId === null || requestId === undefined || requestId === "") {
          throw new Error(`Request ID (sourceId) is missing - cannot update stage. action.id: ${action.id}, action.sourceId: ${action.sourceId}, action.customerId: ${action.customerId}, metadata: ${JSON.stringify(action.metadata)}`);
        }
      }

      // Convert requestId to number if it's a string
      const requestIdNum = typeof requestId === "string" 
        ? parseInt(requestId) 
        : requestId;

      // Validate that requestIdNum is a valid number
      if (isNaN(requestIdNum) || requestIdNum === null || requestIdNum === undefined || requestIdNum <= 0) {
        throw new Error(`Invalid request ID: ${requestId} - must be a valid positive number`);
      }

      // Find the stage from availableStages to get the numeric ID
      // newStage is stage_id (string), we need to find the stage and get its numericId
      const selectedStage = availableStages.find(s => s.id === newStage);
      
      if (!selectedStage) {
        throw new Error(`Invalid stage ID: ${newStage} - stage not found in available stages`);
      }
      
      // If numericId is not available (e.g., from propStages), we need to fetch it from storeStages
      let numericId = selectedStage.numericId;
      if (!numericId && storeStages && storeStages.length > 0) {
        const storeStage = storeStages.find(s => s.stage_id === newStage);
        if (storeStage && storeStage.id) {
          numericId = storeStage.id;
        }
      }
      
      if (!numericId) {
        throw new Error(`Invalid stage ID: ${newStage} - numeric ID not found. Please ensure stages are loaded from API.`);
      }

      // Use numeric ID (stage.id) for API request
      const newStageIdNum = typeof numericId === 'number' 
        ? numericId 
        : parseInt(numericId.toString());

      // Validate that newStageIdNum is a valid number
      if (isNaN(newStageIdNum) || newStageIdNum === null || newStageIdNum === undefined) {
        throw new Error(`Invalid stage ID: ${numericId} - must be a valid number`);
      }

      // Call API to update stage (uses requestId and numeric stage.id)
      await apiUpdateCustomerStage(
        requestIdNum,  // requestId (action.id) instead of customerId
        newStageIdNum,  // numeric stage.id
        undefined // notes - optional
      );

      // Success - UI already updated, no need to do anything
      toast.success("تم تحديث المرحلة بنجاح");
    } catch (err: any) {
      // Rollback: Revert to previous stage on error if customer exists
      if (resolvedCustomer && previousStage && action.customerId) {
        updateCustomerStage(String(action.customerId), previousStage as CustomerLifecycleStage);
      }
      
      console.error("Error updating customer stage:", err);
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء تغيير المرحلة"
      );
    } finally {
      setIsUpdatingStage(false);
    }
  };

  // Set default date when opening schedule form
  React.useEffect(() => {
    if (showScheduleForm && !aptDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setAptDate(tomorrow.toISOString().slice(0, 10));
      setAptTime("10:00");
    }
  }, [showScheduleForm, aptDate]);

  // Fetch employees when opening assign dialog
  React.useEffect(() => {
    if (showAssignEmployeeDialog && userData?.token && employees.length === 0) {
      const fetchEmployees = async () => {
        setLoadingEmployees(true);
        try {
          const response = await axiosInstance.get("/v1/employees");
          if (response.data && response.data.data) {
            setEmployees(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
          toast.error("حدث خطأ أثناء تحميل الموظفين");
        } finally {
          setLoadingEmployees(false);
        }
      };
      fetchEmployees();
    }
  }, [showAssignEmployeeDialog, userData?.token, employees.length]);

  // Handle assign employee
  const handleAssignEmployee = async () => {
    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    // For property requests, we need customerId for the API endpoint
    // If customerId is null, we can't assign employee using this endpoint
    // Try to get customerId from resolvedCustomer or use sourceId as fallback
    const customerId = action.customerId 
      ? (typeof action.customerId === 'string' ? parseInt(action.customerId) : action.customerId)
      : (resolvedCustomer?.id ? (typeof resolvedCustomer.id === 'string' ? parseInt(resolvedCustomer.id) : resolvedCustomer.id) : null);

    if (!customerId && action.objectType === 'property_request') {
      toast.error("لا يمكن تعيين الموظف: معرف العميل غير متوفر");
      return;
    }

    setSavingEmployee(true);
    try {
      const employeeIdToSend = selectedEmployeeId === null || selectedEmployeeId === undefined
        ? null
        : selectedEmployeeId;

      // Use the same API endpoint as property-requests
      await axiosInstance.put(
        `/v1/property-requests/customer/${customerId}/employee`,
        {
          responsible_employee_id: employeeIdToSend,
        }
      );

      toast.success("تم تعيين الموظف المسؤول بنجاح!");
      
      // Update action locally
      if (selectedEmployeeId) {
        const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
        const employeeName = selectedEmployee 
          ? (selectedEmployee.first_name && selectedEmployee.last_name
              ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
              : selectedEmployee.name || selectedEmployee.email || `موظف #${selectedEmployee.id}`)
          : '';
        
        // Update the action locally
        (action as any).assignedTo = selectedEmployeeId.toString();
        (action as any).assignedToName = employeeName;
      } else {
        (action as any).assignedTo = null;
        (action as any).assignedToName = '';
      }

      setShowAssignEmployeeDialog(false);
      setSelectedEmployeeId(null);
      
      // Trigger a page refresh to get updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error assigning employee:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تعيين الموظف المسؤول"
      );
    } finally {
      setSavingEmployee(false);
    }
  };

  const resetScheduleForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAptType("office_meeting");
    setAptDate(tomorrow.toISOString().slice(0, 10));
    setAptTime("10:00");
    setAptNotes("");
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptDate || !aptTime) return;
    
    // Check if datetime is in the future
    const datetime = new Date(`${aptDate}T${aptTime}`).toISOString();
    const now = new Date();
    if (new Date(datetime) <= now) {
      toast.error("التاريخ والوقت يجب أن يكون في المستقبل");
      return;
    }
    
    setIsSubmittingApt(true);
    
    try {
      // Use addAppointmentForRequest for property_request, fallback to old method for others
      if (action.objectType === 'property_request' && action.id) {
        const appointmentParams = {
          type: aptType,
          datetime,
          duration: 30,
          notes: aptNotes.trim() || undefined,
          title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label,
          priority: 'medium' as const,
        };
        
        console.log('Creating appointment with params:', {
          requestId: action.id,
          params: appointmentParams,
        });
        
        await addAppointmentForRequest(action.id, appointmentParams);
        toast.success("تم جدولة الموعد بنجاح");
      } else if (action.customerId) {
        // Fallback to old method for non-property_request actions
        const now = new Date().toISOString();
        const appointment: Appointment = {
          id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label ?? "موعد",
          type: aptType,
          date: datetime,
          time: aptTime,
          datetime,
          duration: 30,
          location: undefined,
          status: "scheduled",
          priority: "medium",
          notes: aptNotes.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        addAppointment(String(action.customerId), appointment);
        toast.success("تم جدولة الموعد بنجاح");
      } else {
        toast.error("لا يمكن جدولة الموعد: بيانات غير صحيحة");
      }
      
      setIsSubmittingApt(false);
      setShowScheduleForm(false);
      resetScheduleForm();
      onComplete?.(action.id);
    } catch (err: any) {
      console.error("Error scheduling appointment:", err);
      toast.error(err.message || "حدث خطأ أثناء جدولة الموعد");
      setIsSubmittingApt(false);
    }
  };

  // Compact view for dense mode
  if (isCompact) {
    return (
      <>
      <div
        className={cn(
          "flex items-center gap-3 p-3 border-r-4 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-all cursor-pointer",
          priorityColors[action.priority],
          isOverdue && "border-red-600",
          isSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
          className
        )}
        onClick={handleCardClick}
      >
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(action.id, checked as boolean)}
            className="h-4 w-4 data-[state=checked]:bg-blue-600"
            data-interactive="true"
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/ar/dashboard/customers-hub/${action.customerId}`}
              className="font-medium text-sm hover:text-blue-600 transition-colors truncate max-w-[150px]"
              data-interactive="true"
            >
              {action.customerName}
            </Link>
            {resolvedCustomer?.phone && (
              <a
                href={`tel:${resolvedCustomer.phone}`}
                className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {resolvedCustomer.phone}
              </a>
            )}
            <SourceBadge source={action.source} className="text-xs" />
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                action.priority === "urgent" && "bg-red-100 text-red-700 border-red-200",
                action.priority === "high" && "bg-orange-100 text-orange-700 border-orange-200"
              )}
            >
              {priorityLabels[action.priority]}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                متأخر
              </Badge>
            )}
            {action.dueDate && (
              <span
                className={cn(
                  "text-xs flex items-center gap-1 shrink-0",
                  isOverdue ? "text-red-600 font-medium" : "text-gray-500"
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date(action.dueDate).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {(
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-xs flex items-center gap-1 shrink-0 rounded-md hover:opacity-80 transition-all cursor-pointer px-2 py-1"
                    style={{
                      backgroundColor: `${getStageColor(normalizedStage)}15`,
                      border: `1px solid ${getStageColor(normalizedStage)}40`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    data-interactive="true"
                  >
                    <span
                      className="size-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: getStageColor(normalizedStage) }}
                      aria-hidden
                    />
                    <span 
                      style={{ color: getStageColor(normalizedStage) }} 
                      className="font-medium"
                    >
                      {getStageNameAr(normalizedStage)}
                    </span>
                    <ChevronDown className="h-3 w-3 shrink-0" style={{ color: getStageColor(normalizedStage) }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  {availableStages.map((stage) => (
                    <DropdownMenuItem
                      key={stage.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStageChange(stage.id as CustomerLifecycleStage);
                      }}
                      className="flex items-center gap-2"
                      disabled={isUpdatingStage || normalizedStage === stage.id}
                    >
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                        aria-hidden
                      />
                      {stage.nameAr}
                      {normalizedStage === stage.id && (
                        <span className="mr-auto text-xs text-gray-500">(الحالية)</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {resolvedCustomer && (
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                {aiMatching.canMatch ? (
                  <span className="text-violet-600 dark:text-violet-400 font-medium" title="مطابقة الذكاء الاصطناعي">
                    ✨ {aiMatching.matchCount}
                  </span>
                ) : (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-amber-600 dark:text-amber-400/90 cursor-help">✨ —</span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        <p className="font-medium mb-1">حقول مطلوبة للمطابقة:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {aiMatching.missingFields.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
          {/* Property request details in compact view */}
          {((showPropertyBlock && property) || (action.objectType === 'property_request' && (action.propertyType || action.city || action.budgetMin != null))) && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {/* Budget */}
              {(action.budgetMin != null || action.budgetMax != null) && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-transparent border-0 shadow-none">
                  <DollarSign className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[120px]">
                    {action.budgetMin != null && action.budgetMax != null && action.budgetMin !== action.budgetMax
                      ? `${action.budgetMin.toLocaleString("en-US")}–${action.budgetMax.toLocaleString("en-US")} ر.س`
                      : action.budgetMin != null
                        ? `${action.budgetMin.toLocaleString("en-US")} ر.س`
                        : action.budgetMax != null
                          ? `${action.budgetMax.toLocaleString("en-US")} ر.س`
                          : ''}
                  </span>
                </Badge>
              )}
              {/* Property Type */}
              {action.propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-transparent border-0 shadow-none">
                  <Building2 className="h-3 w-3 shrink-0" />
                  {translatePropertyType(action.propertyType)}
                </Badge>
              )}
              {/* Location */}
              {action.city && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-transparent border-0 shadow-none">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[80px]">{action.city}</span>
                </Badge>
              )}
              {/* Seriousness */}
              {action.metadata?.seriousness && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-transparent border-0 shadow-none">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[100px]">الجدية: {action.metadata.seriousness}</span>
                </Badge>
              )}
              {/* Assign Employee Button or Assigned Employee Name */}
              {action.objectType === 'property_request' && (
                action.assignedToName ? (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-transparent border-0 shadow-none">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[100px]">{action.assignedToName}</span>
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAssignEmployeeDialog(true);
                    }}
                    data-interactive="true"
                  >
                    <UserPlus className="h-3 w-3 ml-1" />
                    تعيين موظف
                  </Button>
                )
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onQuickView && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(action.id);
              }}
              data-interactive="true"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            className="h-7 px-2 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.(action.id);
            }}
            disabled={isCompleting}
            data-interactive="true"
          >
            {isCompleting ? "جاري..." : "تم"}
          </Button>
        </div>
      </div>

      {/* Assign Employee Dialog */}
      <CustomDialog open={showAssignEmployeeDialog} onOpenChange={setShowAssignEmployeeDialog} maxWidth="max-w-md">
        <CustomDialogContent className="p-3">
          <CustomDialogHeader>
            <CustomDialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">تعيين الموظف المسؤول</div>
                <div className="text-sm text-muted-foreground font-normal">
                  اختر الموظف المسؤول عن طلب العقار
                </div>
              </div>
            </CustomDialogTitle>
            <CustomDialogClose
              onClose={() => {
                setShowAssignEmployeeDialog(false);
                setSelectedEmployeeId(null);
              }}
            />
          </CustomDialogHeader>

          <div className="space-y-6">
            {/* معلومات طلب العقار */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{action.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {action.objectType === 'property_request' && action.sourceId
                    ? `طلب عقار رقم #${action.sourceId}`
                    : action.title}
                </div>
              </div>
            </div>

            {/* اختيار الموظف */}
            <div className="space-y-3">
              <label className="text-sm font-medium">اختر الموظف:</label>
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2 text-sm text-muted-foreground">
                    جاري تحميل الموظفين...
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Select
                    value={
                      selectedEmployeeId
                        ? selectedEmployeeId.toString()
                        : "none"
                    }
                    onValueChange={(value) =>
                      setSelectedEmployeeId(
                        value === "none" ? null : Number(value),
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">لا يوجد موظف</SelectItem>
                      {employees.map((employee) => {
                        const employeeName =
                          employee.first_name && employee.last_name
                            ? `${employee.first_name} ${employee.last_name}`
                            : employee.name ||
                              employee.email ||
                              `موظف #${employee.id}`;

                        return (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <span>{employeeName}</span>
                              {employee.email && (
                                <span className="text-xs text-muted-foreground">
                                  ({employee.email})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignEmployeeDialog(false);
                setSelectedEmployeeId(null);
              }}
              disabled={savingEmployee}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAssignEmployee}
              disabled={savingEmployee || loadingEmployees}
              className="min-w-[100px]"
            >
              {savingEmployee ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </CustomDialogContent>
      </CustomDialog>
      </>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg border-l-4 cursor-pointer group",
        priorityColors[action.priority],
        isOverdue && "border-red-600",
        isSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Selection Checkbox */}
          {showCheckbox && (
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect?.(action.id, checked as boolean)}
                className="h-5 w-5 data-[state=checked]:bg-blue-600"
                data-interactive="true"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link
                href={`/ar/dashboard/customers-hub/${action.customerId}`}
                className="font-semibold text-lg hover:text-blue-600 transition-colors"
                data-interactive="true"
              >
                {action.customerName}
              </Link>
              {onQuickView && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(action.id);
                  }}
                  data-interactive="true"
                >
                  <Eye className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </Button>
              )}
              <SourceBadge source={action.source} />
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  action.priority === "urgent" &&
                    "bg-red-100 text-red-700 border-red-200",
                  action.priority === "high" &&
                    "bg-orange-100 text-orange-700 border-orange-200",
                  action.priority === "medium" &&
                    "bg-yellow-100 text-yellow-700 border-yellow-200",
                  action.priority === "low" &&
                    "bg-green-100 text-green-700 border-green-200"
                )}
              >
                {priorityLabels[action.priority]}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  متأخر
                </Badge>
              )}
            </div>
            {action.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {action.description}
              </p>
            )}
            {/* Customer phone for quick contact */}
            {resolvedCustomer?.phone && (
              <a
                href={`tel:${resolvedCustomer.phone}`}
                className="inline-flex items-center gap-1.5 mt-2 text-sm text-gray-600 hover:text-blue-600 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-4 w-4 shrink-0" />
                {resolvedCustomer.phone}
                {resolvedCustomer.whatsapp && resolvedCustomer.whatsapp !== resolvedCustomer.phone && (
                  <span className="text-gray-400"> / واتساب: {resolvedCustomer.whatsapp}</span>
                )}
              </a>
            )}
            {/* Property request details - show all available data */}
            {(showPropertyBlock && property) || (action.objectType === 'property_request' && (action.propertyType || action.city || action.budgetMin != null)) ? (
              <div className="mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {/* Budget */}
                  {(action.budgetMin != null || action.budgetMax != null) && (
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-transparent border-0 shadow-none">
                      <DollarSign className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {action.budgetMin != null && action.budgetMax != null && action.budgetMin !== action.budgetMax
                          ? `${action.budgetMin.toLocaleString("en-US")}–${action.budgetMax.toLocaleString("en-US")} ر.س`
                          : action.budgetMin != null
                            ? `${action.budgetMin.toLocaleString("en-US")} ر.س`
                            : action.budgetMax != null
                              ? `${action.budgetMax.toLocaleString("en-US")} ر.س`
                              : ''}
                      </span>
                    </Badge>
                  )}
                  {/* Property Type */}
                  {action.propertyType && (
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-transparent border-0 shadow-none">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{translatePropertyType(action.propertyType)}</span>
                    </Badge>
                  )}
                  {/* Location */}
                  {action.city && (
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-transparent border-0 shadow-none">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{action.city}</span>
                    </Badge>
                  )}
                  {/* Seriousness */}
                  {action.metadata?.seriousness && (
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-transparent border-0 shadow-none">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>الجدية: {action.metadata.seriousness}</span>
                    </Badge>
                  )}
                  {/* Assign Employee Button or Assigned Employee Name */}
                  {action.objectType === 'property_request' && (
                    action.assignedToName ? (
                      <Badge variant="secondary" className="flex items-center gap-1.5 bg-transparent border-0 shadow-none">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span>{action.assignedToName}</span>
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAssignEmployeeDialog(true);
                        }}
                        data-interactive="true"
                      >
                        <UserPlus className="h-3 w-3 ml-1" />
                        تعيين موظف
                      </Button>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              {action.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1.5",
                    isOverdue && "text-red-600 font-medium"
                  )}
                >
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(action.dueDate).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
            {/* Stage Dropdown - Load stages from Zustand store */}
            {availableStages.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs rounded-md hover:opacity-80 transition-all cursor-pointer text-right w-fit px-2 py-1"
                    style={{
                      backgroundColor: `${getStageColor(normalizedStage)}15`,
                      border: `1px solid ${getStageColor(normalizedStage)}40`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    data-interactive="true"
                  >
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: getStageColor(normalizedStage) }}
                      aria-hidden
                    />
                    <span 
                      style={{ color: getStageColor(normalizedStage) }} 
                      className="font-medium"
                    >
                      {getStageNameAr(normalizedStage)}
                    </span>
                    <ChevronDown className="h-3 w-3 shrink-0" style={{ color: getStageColor(normalizedStage) }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  {availableStages.map((stage) => (
                    <DropdownMenuItem
                      key={stage.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStageChange(stage.id as CustomerLifecycleStage);
                      }}
                      className="flex items-center gap-2"
                      disabled={isUpdatingStage || normalizedStage === stage.id}
                    >
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                        aria-hidden
                      />
                      {stage.nameAr}
                      {normalizedStage === stage.id && (
                        <span className="mr-auto text-xs text-gray-500">(الحالية)</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            {/* AI property matching indicator */}
            {resolvedCustomer && (
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800 mt-1">
                {aiMatching.canMatch ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
                    ✨ {aiMatching.matchCount}
                  </div>
                ) : (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400/90 cursor-help">
                          ✨ —
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        <p className="font-medium mb-1">حقول مطلوبة للمطابقة:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {aiMatching.missingFields.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>

          <ActionQuickPanel
            action={action}
            onSchedule={() => setShowScheduleForm((prev) => !prev)}
          />
        </div>

        {/* Inline جدولة موعد form (expand in card) */}
        {showScheduleForm && (
          <div
            className="border-t pt-3 mt-2"
            onClick={(e) => e.stopPropagation()}
            data-interactive="true"
          >
            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="apt-type" className="text-sm">نوع الموعد</Label>
                <Select value={aptType} onValueChange={(v) => setAptType(v as Appointment["type"])}>
                  <SelectTrigger id="apt-type" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="apt-date" className="text-sm">التاريخ</Label>
                  <Input
                    id="apt-date"
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-time" className="text-sm">الوقت</Label>
                  <Input
                    id="apt-time"
                    type="time"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apt-notes" className="text-sm">ملاحظات (اختياري)</Label>
                <Textarea
                  id="apt-notes"
                  value={aptNotes}
                  onChange={(e) => setAptNotes(e.target.value)}
                  placeholder="تفاصيل إضافية"
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setShowScheduleForm(false);
                    resetScheduleForm();
                  }}
                >
                  إلغاء
                </Button>
                <Button type="submit" size="sm" className="h-8" disabled={isSubmittingApt}>
                  {isSubmittingApt ? "جاري الحفظ..." : "جدولة الموعد"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>

      {/* Assign Employee Dialog */}
      <CustomDialog open={showAssignEmployeeDialog} onOpenChange={setShowAssignEmployeeDialog} maxWidth="max-w-md">
        <CustomDialogContent className="p-3">
          <CustomDialogHeader>
            <CustomDialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">تعيين الموظف المسؤول</div>
                <div className="text-sm text-muted-foreground font-normal">
                  اختر الموظف المسؤول عن طلب العقار
                </div>
              </div>
            </CustomDialogTitle>
            <CustomDialogClose
              onClose={() => {
                setShowAssignEmployeeDialog(false);
                setSelectedEmployeeId(null);
              }}
            />
          </CustomDialogHeader>

          <div className="space-y-6">
            {/* معلومات طلب العقار */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{action.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {action.objectType === 'property_request' && action.sourceId
                    ? `طلب عقار رقم #${action.sourceId}`
                    : action.title}
                </div>
              </div>
            </div>

            {/* اختيار الموظف */}
            <div className="space-y-3">
              <label className="text-sm font-medium">اختر الموظف:</label>
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2 text-sm text-muted-foreground">
                    جاري تحميل الموظفين...
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Select
                    value={
                      selectedEmployeeId
                        ? selectedEmployeeId.toString()
                        : "none"
                    }
                    onValueChange={(value) =>
                      setSelectedEmployeeId(
                        value === "none" ? null : Number(value),
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">لا يوجد موظف</SelectItem>
                      {employees.map((employee) => {
                        const employeeName =
                          employee.first_name && employee.last_name
                            ? `${employee.first_name} ${employee.last_name}`
                            : employee.name ||
                              employee.email ||
                              `موظف #${employee.id}`;

                        return (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <span>{employeeName}</span>
                              {employee.email && (
                                <span className="text-xs text-muted-foreground">
                                  ({employee.email})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignEmployeeDialog(false);
                setSelectedEmployeeId(null);
              }}
              disabled={savingEmployee}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAssignEmployee}
              disabled={savingEmployee || loadingEmployees}
              className="min-w-[100px]"
            >
              {savingEmployee ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </Card>
  );
}
