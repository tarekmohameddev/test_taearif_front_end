import type { CustomerAction, Priority } from "@/types/unified-customer";
import type {
  StageDistribution,
  RequestsListParams,
  RequestsListFilters,
} from "@/lib/services/customers-hub-requests-api";

export interface RequestsCenterPageProps {
  actions?: CustomerAction[];
  stats?: any;
  stages?: StageDistribution[];
  filterOptions?: any;
  loading?: boolean;
  error?: string | null;
  pagination?: any;
  onFetchRequests?: (
    params: RequestsListFilters | RequestsListParams
  ) => Promise<void>;
  onCompleteAction?: (actionId: string, notes?: string) => Promise<boolean>;
  onDismissAction?: (actionId: string, reason?: string) => Promise<boolean>;
  onSnoozeAction?: (
    actionId: string,
    snoozeUntil: string,
    reason?: string
  ) => Promise<boolean>;
  onAssignAction?: (actionId: string, employeeId: number) => Promise<boolean>;
  onCompleteMultipleActions?: (
    actionIds: string[],
    notes?: string
  ) => Promise<boolean>;
  onDismissMultipleActions?: (
    actionIds: string[],
    reason?: string
  ) => Promise<boolean>;
  onSnoozeMultipleActions?: (
    actionIds: string[],
    snoozeUntil: string,
    reason?: string
  ) => Promise<boolean>;
  onAssignMultipleActions?: (
    actionIds: string[],
    employeeId: number
  ) => Promise<boolean>;
  onChangeMultipleActionsPriority?: (
    actionIds: string[],
    priority: Priority
  ) => Promise<boolean>;
  /** Called when a request's stage is changed (e.g. from card). Use to update local stage distribution without refetch. */
  onStageChangeApplied?: (
    actionId: string,
    fromStageId: string,
    toStageId: string
  ) => void;
}
