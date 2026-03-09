import { useState, useEffect } from "react";
import type {
  AutomationRule,
  AutomationStats,
  MessageTemplate,
  RuleFormData,
} from "./types";
import { DEFAULT_RULE_FORM_DATA } from "./constants";
import {
  getAutomationRules,
  getAutomationStats,
  getMessageTemplates,
  updateAutomationRule,
  createAutomationRule,
  deleteAutomationRule,
} from "@/services/whatsapp-management-api";

export function useAutomationRules(selectedNumberId: number | null) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [formData, setFormData] = useState<RuleFormData>(DEFAULT_RULE_FORM_DATA);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [rulesData, templatesData, statsData] = await Promise.all([
        getAutomationRules(selectedNumberId ?? undefined),
        getMessageTemplates(),
        getAutomationStats(),
      ]);
      setRules(rulesData);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load automation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedNumberId]);

  const handleToggleActive = async (ruleId: string, isActive: boolean) => {
    try {
      await updateAutomationRule(ruleId, { isActive });
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === ruleId ? { ...rule, isActive } : rule
        )
      );
    } catch (error) {
      console.error("Failed to update rule:", error);
    }
  };

  const handleOpenDialog = (rule?: AutomationRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description,
        trigger: rule.trigger,
        delayMinutes: rule.delayMinutes,
        templateId: rule.templateId,
        isActive: rule.isActive,
      });
    } else {
      setEditingRule(null);
      setFormData(DEFAULT_RULE_FORM_DATA);
    }
    setIsDialogOpen(true);
  };

  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        await updateAutomationRule(editingRule.id, formData);
      } else {
        await createAutomationRule({
          ...formData,
          whatsappNumberId: selectedNumberId ?? undefined,
        });
      }
      await loadData();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه القاعدة؟")) return;
    try {
      await deleteAutomationRule(ruleId);
      setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    } catch (error) {
      console.error("Failed to delete rule:", error);
    }
  };

  return {
    rules,
    templates,
    stats,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingRule,
    formData,
    setFormData,
    loadData,
    handleToggleActive,
    handleOpenDialog,
    handleSaveRule,
    handleDeleteRule,
  };
}
