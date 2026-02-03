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
import { AlertTriangle, User, Eye, Phone, Building2, MapPin, DollarSign, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
}: IncomingActionsCardProps) {
  const router = useRouter();
  const { addAppointment, updateCustomerStage } = useUnifiedCustomersStore();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [aptType, setAptType] = useState<Appointment["type"]>("office_meeting");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("10:00");
  const [aptNotes, setAptNotes] = useState("");
  const [isSubmittingApt, setIsSubmittingApt] = useState(false);

  const propertyFromMeta = getPropertyFromMetadata(action.metadata);
  const propertyFromPrefs = getPropertyFromPreferences(customer);
  /** Prefer specific property from metadata; fallback to request summary from customer preferences */
  const property = propertyFromMeta ?? propertyFromPrefs;
  const showPropertyBlock = property && (property.title || property.type || property.price != null || property.location);
  const aiMatching = getAIMatchingStatus(customer);

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

  // Set default date when opening schedule form
  React.useEffect(() => {
    if (showScheduleForm && !aptDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setAptDate(tomorrow.toISOString().slice(0, 10));
      setAptTime("10:00");
    }
  }, [showScheduleForm, aptDate]);

  const resetScheduleForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAptType("office_meeting");
    setAptDate(tomorrow.toISOString().slice(0, 10));
    setAptTime("10:00");
    setAptNotes("");
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptDate || !aptTime) return;
    setIsSubmittingApt(true);
    const now = new Date().toISOString();
    const datetime = new Date(`${aptDate}T${aptTime}`).toISOString();
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
    addAppointment(action.customerId, appointment);
    setIsSubmittingApt(false);
    setShowScheduleForm(false);
    resetScheduleForm();
    onComplete?.(action.id);
  };

  // Compact view for dense mode
  if (isCompact) {
    return (
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
            {customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {customer.phone}
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
            {customer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-xs flex items-center gap-1 shrink-0 rounded hover:bg-gray-100 dark:hover:bg-gray-800 px-1 -mx-1 py-0.5 transition-colors cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                    data-interactive="true"
                  >
                    {customer.stage ? (
                      <>
                        <span
                          className="size-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: getStageColor(customer.stage) }}
                          aria-hidden
                        />
                        <span style={{ color: getStageColor(customer.stage) }} className="font-medium">
                          {getStageNameAr(customer.stage)}
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                      </>
                    ) : (
                      <span className="text-gray-500 font-medium">تعيين المرحلة</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  {LIFECYCLE_STAGES.map((stage) => (
                    <DropdownMenuItem
                      key={stage.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCustomerStage(action.customerId, stage.id as CustomerLifecycleStage);
                      }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                        aria-hidden
                      />
                      {stage.nameAr}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {customer && (
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
          {showPropertyBlock && (
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
              {property?.title && (
                <span className="flex items-center gap-1 truncate max-w-[100px]">
                  <DollarSign className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                  <span className="truncate">{property.title}</span>
                </span>
              )}
              {property?.type && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                  {property.type}
                </span>
              )}
              {property?.location && (
                <span className="flex items-center gap-1 truncate max-w-[90px]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                  <span className="truncate">{property.location}</span>
                </span>
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
            data-interactive="true"
          >
            تم
          </Button>
        </div>
      </div>
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
            {customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="inline-flex items-center gap-1.5 mt-2 text-sm text-gray-600 hover:text-blue-600 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-4 w-4 shrink-0" />
                {customer.phone}
                {customer.whatsapp && customer.whatsapp !== customer.phone && (
                  <span className="text-gray-400"> / واتساب: {customer.whatsapp}</span>
                )}
              </a>
            )}
            {/* Minimal property data: icon-first, simple layout */}
            {showPropertyBlock && property && (
              <div className="mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {property.title && (
                    <span className="flex items-center gap-1.5 min-w-0">
                      <DollarSign className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">{property.title}</span>
                    </span>
                  )}
                  {property.type && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 shrink-0 text-gray-500" />
                      <span>{property.type}</span>
                    </span>
                  )}
                  {property.price != null && property.price > 0 && !property.fromPreferences && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 shrink-0 text-gray-500" />
                      {property.price.toLocaleString("ar-SA")} ر.س
                    </span>
                  )}
                  {property.location && (
                    <span className="flex items-center gap-1.5 min-w-0 max-w-[220px]">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">{property.location}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
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
              {action.assignedToName && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{action.assignedToName}</span>
                </div>
              )}
            </div>
            {customer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 px-1 -mx-1 py-0.5 transition-colors cursor-pointer text-right w-fit"
                    onClick={(e) => e.stopPropagation()}
                    data-interactive="true"
                  >
                    {customer.stage ? (
                      <>
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: getStageColor(customer.stage) }}
                          aria-hidden
                        />
                        <span style={{ color: getStageColor(customer.stage) }} className="font-medium">
                          {getStageNameAr(customer.stage)}
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                      </>
                    ) : (
                      <span className="text-gray-500 font-medium">تعيين المرحلة</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  {LIFECYCLE_STAGES.map((stage) => (
                    <DropdownMenuItem
                      key={stage.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCustomerStage(action.customerId, stage.id as CustomerLifecycleStage);
                      }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                        aria-hidden
                      />
                      {stage.nameAr}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* AI property matching indicator */}
            {customer && (
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
    </Card>
  );
}
