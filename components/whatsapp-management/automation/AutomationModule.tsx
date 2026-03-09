"use client";

import { useAutomationRules } from "./useAutomationRules";
import { AutomationLoadingState } from "./AutomationStates";
import { AutomationStatsCards } from "./AutomationStatsCards";
import { AutomationHeader } from "./AutomationHeader";
import { AutomationRulesTable } from "./AutomationRulesTable";
import { AutomationRuleDialog } from "./AutomationRuleDialog";
import type { AutomationModuleProps } from "./types";

export function AutomationModule({
  selectedNumberId,
}: AutomationModuleProps) {
  const {
    rules,
    templates,
    stats,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingRule,
    formData,
    setFormData,
    handleOpenDialog,
    handleSaveRule,
    handleDeleteRule,
    handleToggleActive,
  } = useAutomationRules(selectedNumberId);

  if (isLoading) {
    return <AutomationLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AutomationStatsCards stats={stats} />
      <AutomationHeader onAddClick={() => handleOpenDialog()} />
      <AutomationRulesTable
        rules={rules}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRule}
        onToggleActive={handleToggleActive}
      />
      <AutomationRuleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        templates={templates}
        editingRule={editingRule}
        onSave={handleSaveRule}
      />
    </div>
  );
}
