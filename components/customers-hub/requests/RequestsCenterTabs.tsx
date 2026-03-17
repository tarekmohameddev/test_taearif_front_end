"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Inbox, CalendarClock, ListTodo, CheckCircle2 } from "lucide-react";
import { TableRequestsList } from "./TableRequestsList";
import { RequestsList } from "./RequestsList";
import { ActionHistoryList } from "../actions/ActionHistoryList";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { RequestsListStage } from "./RequestsList";

export interface RequestsCenterTabsProps {
  activeTab: string;
  setActiveTab: (v: string) => void;
  stats: { pending: number; inbox: number; followups: number; completed: number };
  viewMode: "compact" | "grid" | "table";
  inboxRequests: CustomerAction[];
  followupRequests: CustomerAction[];
  filteredActions: CustomerAction[];
  completedActions: CustomerAction[];
  getCustomerForCard: (id: string) => UnifiedCustomer | undefined;
  selectedActionIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string, until: string) => void;
  onAddNote: (id: string, note: string) => void;
  onQuickView: (id: string) => void;
  onPriorityClick?: (action: CustomerAction) => void;
  onCompleteForTable: (id: string) => Promise<void>;
  onDismissForTable: (id: string) => Promise<void>;
  onSnoozeForTable: (id: string, until: string) => Promise<void>;
  onAddNoteForTable: (id: string, note: string) => Promise<void>;
  onRestore: (id: string) => void;
  stagesForCards?: RequestsListStage[] | undefined;
  completingActionIds: Set<string>;
  onStageChangeSuccess?: (
    actionId: string,
    newStageId: string,
    previousStageId: string
  ) => void;
}

export function RequestsCenterTabs({
  activeTab,
  setActiveTab,
  stats,
  viewMode,
  inboxRequests,
  followupRequests,
  filteredActions,
  completedActions,
  getCustomerForCard,
  selectedActionIds,
  onSelect,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  onPriorityClick,
  onCompleteForTable,
  onDismissForTable,
  onSnoozeForTable,
  onAddNoteForTable,
  onRestore,
  stagesForCards,
  completingActionIds,
  onStageChangeSuccess,
}: RequestsCenterTabsProps) {
  const tableProps = {
    getCustomerById: getCustomerForCard,
    selectedActionIds,
    onSelect,
    onComplete: onCompleteForTable,
    onDismiss: onDismissForTable,
    onSnooze: onSnoozeForTable,
    onAddNote: onAddNoteForTable,
    onQuickView,
    onPriorityClick,
    stages: stagesForCards,
    completingActionIds,
    onStageChangeSuccess,
  };
  const listProps = {
    getCustomerById: getCustomerForCard,
    isCompactView: viewMode === "compact",
    selectedActionIds,
    onSelect,
    onComplete,
    onDismiss,
    onSnooze,
    onAddNote,
    onQuickView,
    stages: stagesForCards,
    completingActionIds,
    onStageChangeSuccess,
  };

  return (
    <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v)}>

      <TabsContent value="inbox" className="mt-6">
        {viewMode === "table" ? (
          <TableRequestsList actions={inboxRequests} {...tableProps} />
        ) : (
          <RequestsList actions={inboxRequests} {...listProps} />
        )}
      </TabsContent>
      <TabsContent value="followups" className="mt-6">
        {viewMode === "table" ? (
          <TableRequestsList actions={followupRequests} {...tableProps} />
        ) : (
          <RequestsList actions={followupRequests} {...listProps} />
        )}
      </TabsContent>
      <TabsContent value="all" className="mt-6">
        {viewMode === "table" ? (
          <TableRequestsList actions={filteredActions} {...tableProps} />
        ) : (
          <RequestsList actions={filteredActions} {...listProps} />
        )}
      </TabsContent>
      <TabsContent value="completed" className="mt-6">
        <ActionHistoryList actions={completedActions} onRestore={onRestore} />
      </TabsContent>
    </Tabs>
  );
}
