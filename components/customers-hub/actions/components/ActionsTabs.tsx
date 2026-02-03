import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Inbox,
  CalendarClock,
  Sparkles,
  List,
  History,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "../IncomingActionsCard";
import { DueDateGroupedView } from "./DueDateGroupedView";
import { ActionHistoryList } from "../ActionHistoryList";
import type { CustomerAction } from "@/types/unified-customer";

interface ActionsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  incomingActions: CustomerAction[];
  followUpActions: CustomerAction[];
  aiRecommendedActions: CustomerAction[];
  filteredActions: CustomerAction[];
  completedActions: CustomerAction[];
  showDueDateGroups: boolean;
  dueDateGroupedActions: Record<string, CustomerAction[]>;
  isCompactView: boolean;
  selectedActionIds: Set<string>;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectAction: (actionId: string, selected: boolean) => void;
  onComplete: (actionId: string) => void;
  onDismiss: (actionId: string) => void;
  onSnooze: (actionId: string, until: string) => void;
  onAddNote: (actionId: string, note: string) => void;
  onQuickView: (actionId: string) => void;
  onRestoreAction: (actionId: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ActionsTabs({
  activeTab,
  onTabChange,
  incomingActions,
  followUpActions,
  aiRecommendedActions,
  filteredActions,
  completedActions,
  showDueDateGroups,
  dueDateGroupedActions,
  isCompactView,
  selectedActionIds,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  onSelectAction,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  onRestoreAction,
  hasActiveFilters,
  onClearFilters,
}: ActionsTabsProps) {
  const getCurrentTabActions = () => {
    switch (activeTab) {
      case "incoming":
        return incomingActions;
      case "followup":
        return followUpActions;
      case "ai":
        return aiRecommendedActions;
      default:
        return filteredActions;
    }
  };

  const currentTabActions = getCurrentTabActions();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="incoming" className="gap-2">
            <Inbox className="h-4 w-4" />
            وارد ({incomingActions.length})
          </TabsTrigger>
          <TabsTrigger value="followup" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            متابعة ({followUpActions.length})
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            موصى به ({aiRecommendedActions.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <List className="h-4 w-4" />
            الكل ({filteredActions.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            السجل ({completedActions.length})
          </TabsTrigger>
        </TabsList>

        {/* Quick Select All */}
        {currentTabActions.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectAll();
                  } else {
                    onDeselectAll();
                  }
                }}
                className="h-5 w-5"
              />
              <label
                htmlFor="select-all"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                تحديد الكل
              </label>
            </div>
            {selectedActionIds.size > 0 && (
              <Badge variant="secondary" className="text-sm">
                {selectedActionIds.size} محدد
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Incoming Tab */}
      <TabsContent value="incoming">
        <div className={cn("space-y-3", isCompactView && "space-y-1")}>
          {incomingActions.length === 0 ? (
            <Card className="py-16">
              <CardContent className="text-center">
                <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">لا توجد إجراءات واردة</h3>
                <p className="text-gray-500">جميع العملاء الجدد تمت معالجتهم</p>
              </CardContent>
            </Card>
          ) : showDueDateGroups ? (
            <DueDateGroupedView
              groups={dueDateGroupedActions}
              onComplete={onComplete}
              onDismiss={onDismiss}
              onSnooze={onSnooze}
              onAddNote={onAddNote}
              onQuickView={onQuickView}
              selectedActionIds={selectedActionIds}
              onSelect={onSelectAction}
              isCompact={isCompactView}
              filterFn={(a) => a.type === 'new_inquiry' || a.type === 'whatsapp_incoming' || a.type === 'callback_request'}
            />
          ) : (
            incomingActions.map((action) => (
              <IncomingActionsCard
                key={action.id}
                action={action}
                onComplete={onComplete}
                onDismiss={onDismiss}
                onSnooze={onSnooze}
                onAddNote={onAddNote}
                onQuickView={onQuickView}
                isSelected={selectedActionIds.has(action.id)}
                onSelect={onSelectAction}
                showCheckbox={true}
                isCompact={isCompactView}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* Follow-up Tab */}
      <TabsContent value="followup">
        <div className={cn("space-y-3", isCompactView && "space-y-1")}>
          {followUpActions.length === 0 ? (
            <Card className="py-16">
              <CardContent className="text-center">
                <CalendarClock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">لا توجد متابعات مجدولة</h3>
                <p className="text-gray-500">جميع المتابعات مكتملة</p>
              </CardContent>
            </Card>
          ) : (
            followUpActions.map((action) => (
              <IncomingActionsCard
                key={action.id}
                action={action}
                onComplete={onComplete}
                onDismiss={onDismiss}
                onSnooze={onSnooze}
                onAddNote={onAddNote}
                onQuickView={onQuickView}
                isSelected={selectedActionIds.has(action.id)}
                onSelect={onSelectAction}
                showCheckbox={true}
                isCompact={isCompactView}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* AI Recommended Tab */}
      <TabsContent value="ai">
        <div className={cn("space-y-3", isCompactView && "space-y-1")}>
          {aiRecommendedActions.length === 0 ? (
            <Card className="py-16">
              <CardContent className="text-center">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">لا توجد توصيات من الذكاء الاصطناعي</h3>
                <p className="text-gray-500">سيتم إنشاء توصيات بناءً على بيانات العملاء</p>
              </CardContent>
            </Card>
          ) : (
            aiRecommendedActions.map((action) => (
              <IncomingActionsCard
                key={action.id}
                action={action}
                onComplete={onComplete}
                onDismiss={onDismiss}
                onSnooze={onSnooze}
                onAddNote={onAddNote}
                onQuickView={onQuickView}
                isSelected={selectedActionIds.has(action.id)}
                onSelect={onSelectAction}
                showCheckbox={true}
                isCompact={isCompactView}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* All Actions Tab */}
      <TabsContent value="all">
        <div className={cn("space-y-3", isCompactView && "space-y-1")}>
          {filteredActions.length === 0 ? (
            <Card className="py-16">
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {hasActiveFilters ? "لا توجد نتائج" : "ممتاز! لا توجد إجراءات معلقة"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "جرب تغيير معايير البحث أو الفلترة"
                    : "لقد أكملت جميع الإجراءات المطلوبة"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={onClearFilters}>
                    مسح الفلاتر
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : showDueDateGroups ? (
            <DueDateGroupedView
              groups={dueDateGroupedActions}
              onComplete={onComplete}
              onDismiss={onDismiss}
              onSnooze={onSnooze}
              onAddNote={onAddNote}
              onQuickView={onQuickView}
              selectedActionIds={selectedActionIds}
              onSelect={onSelectAction}
              isCompact={isCompactView}
            />
          ) : (
            filteredActions.map((action) => (
              <IncomingActionsCard
                key={action.id}
                action={action}
                onComplete={onComplete}
                onDismiss={onDismiss}
                onSnooze={onSnooze}
                onAddNote={onAddNote}
                onQuickView={onQuickView}
                isSelected={selectedActionIds.has(action.id)}
                onSelect={onSelectAction}
                showCheckbox={true}
                isCompact={isCompactView}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* History Tab */}
      <TabsContent value="history">
        <ActionHistoryList
          actions={completedActions}
          onRestore={onRestoreAction}
        />
      </TabsContent>
    </Tabs>
  );
}
