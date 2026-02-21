/**
 * Type definitions for AI-Friendly Debugger System
 * All interfaces and types used throughout the debug system
 */

// Event Types
export type EventType =
  | "LIVE_EDITOR_OPENED"
  | "EDITOR_SIDEBAR_OPENED"
  | "FIELD_UPDATED"
  | "SAVE_INITIATED"
  | "MERGE_STARTED"
  | "MERGE_COMPLETED"
  | "STORE_UPDATED"
  | "COMPONENT_UPDATED"
  | "SAVE_COMPLETED"
  | "SIDEBAR_CLOSED"
  | "COMPONENT_RENDERED"
  | "DATA_SOURCE_CHANGED";

// Component Information
export interface ComponentInfo {
  id: string;
  type: string;
  variant: string;
  name: string;
}

// Location Information
export interface LocationInfo {
  file: string;
  function: string;
  line: number;
}

// User Action Information
export interface UserActionInfo {
  action: string;
  page: string;
}

// Context Information
export interface EventContext {
  component: ComponentInfo;
  location: LocationInfo;
  user: UserActionInfo;
  editor?: {
    currentPage?: string;
    componentsCount?: number;
    globalHeaderVariant?: string;
    globalFooterVariant?: string;
  };
  sidebar?: {
    view?: string;
    initialData?: any;
  };
}

// Field Information
export interface FieldInfo {
  path: string;
  oldValue: any;
  newValue: any;
  type: string;
}

// Event Details
export interface EventDetails {
  action: string;
  field?: FieldInfo;
  source: string;
  tempData?: any;
  storeData?: any;
  existingData?: any;
  success?: boolean;
  finalData?: any;
}

// Data State
export interface DataState {
  componentData: any;
  storeState: any;
  mergedData: any;
}

// Decision Point
export interface DecisionPoint {
  point: string;
  condition: string;
  result: string;
  reason: string;
}

// Data Source
export interface DataSource {
  name: string;
  value: any;
  priority: number;
  used: boolean;
  reason: string;
}

// Merge Information
export interface MergeInfo {
  method: string;
  order: string[];
  result: any;
}

// Data Flow Information
export interface DataFlowInfo {
  sources: DataSource[];
  merge: MergeInfo;
}

// Execution Step
export interface ExecutionStep {
  step: number;
  action: string;
  location: string;
  timestamp: string;
  data: any;
}

// Execution Trace
export interface ExecutionTrace {
  steps: ExecutionStep[];
  stackTrace: string[];
}

// Related Event
export interface RelatedEvent {
  eventId: string;
  relationship: string;
  description: string;
}

// AI-Friendly Summary
export interface AISummary {
  what: string;
  where: string;
  when: string;
  why: string;
  how: string;
  impact: string;
  nextSteps: string[];
}

// Performance Metrics
export interface PerformanceMetrics {
  duration: string;
  renderCount: number;
  storeUpdates: number;
}

// Main AI-Friendly Event Interface
export interface AIFriendlyEvent {
  // Event Identification
  eventId: string;
  eventType: EventType;
  timestamp: string;
  sessionId: string;

  // Context Information
  context: EventContext;

  // Event Details
  details: EventDetails;

  // Data State (Before)
  before: DataState;

  // Data State (After)
  after: DataState;

  // Decision Points
  decisions: DecisionPoint[];

  // Data Flow
  dataFlow: DataFlowInfo;

  // Execution Trace
  trace: ExecutionTrace;

  // Related Events
  relatedEvents: RelatedEvent[];

  // AI-Friendly Summary
  summary: AISummary;

  // Performance Metrics
  performance: PerformanceMetrics;
}

// Component Trace
export interface ComponentTrace {
  componentId: string;
  componentType: string;
  variant: string;
  sessionId: string;
  timeline: AIFriendlyEvent[];
  dataFlowHistory: DataFlowStep[];
  renderHistory: RenderInfo[];
  storeSnapshots: StoreSnapshot[];
  createdAt: string;
  updatedAt: string;
}

// Render Information
export interface RenderInfo {
  timestamp: string;
  props: any;
  mergedData: any;
  duration: number;
  renderCount: number;
}

// Store Snapshot
export interface StoreSnapshot {
  timestamp: string;
  componentId: string;
  componentType: string;
  type: "before-save" | "after-save" | "before-merge" | "after-merge" | "before-update" | "after-update";
  operation: "save" | "merge" | "update" | "delete";
  storeType: "editor" | "tenant";
  before: any;
  after: any;
  diff?: any;
}

// Data Flow Step
export interface DataFlowStep {
  timestamp: string;
  componentId: string;
  componentType: string;
  operationType: "merge" | "priority-override" | "data-source-change" | "field_update";
  sources: DataSource[];
  merge?: MergeInfo;
  priorityDecisions?: DecisionPoint[];
  result: any;
  conflicts?: any[];
}

// Performance Metrics (Detailed)
export interface DetailedPerformanceMetrics {
  componentId: string;
  componentType: string;
  renderDuration: number;
  storeUpdateDuration: number;
  mergeDuration: number;
  totalDuration: number;
  renderCount: number;
  storeUpdates: number;
  timestamp: string;
}

// Parsed Question
export interface ParsedQuestion {
  componentId?: string;
  componentType?: string;
  variant?: string;
  fieldPath?: string;
  eventType?: EventType;
  date?: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

// AI Query Result
export interface AIQueryResult {
  question: string;
  parsed: ParsedQuestion;
  events: AIFriendlyEvent[];
  trace: ComponentTrace | null;
  snapshots: StoreSnapshot[];
  dataFlow: DataFlowStep[] | null;
  diagnosis: Diagnosis;
  summary: string;
}

// Diagnosis
export interface Diagnosis {
  problem: string;
  rootCause: string;
  solution: string;
  steps: string[];
}

// Event Search Filters
export interface EventSearchFilters {
  eventType?: EventType;
  componentId?: string;
  componentType?: string;
  variant?: string;
  date?: string;
  sessionId?: string;
  fieldPath?: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

// Helper Types
export type LoggingLevel = "debug" | "info" | "warn" | "error";

export interface DebugConfig {
  enabled: boolean;
  maxEvents: number;
  maxTraces: number;
  logsDir: string;
  loggingLevel: LoggingLevel;
  sessionId: string;
}
