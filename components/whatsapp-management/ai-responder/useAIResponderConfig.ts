import { useState, useEffect } from "react";
import type { AIResponderConfig, AIStats } from "../types";
import { getDefaultAIConfig } from "./constants";
import {
  getAIConfig,
  updateAIConfig,
  getAIStats,
  getWhatsAppNumber,
} from "@/services/whatsapp-management-api";

export function useAIResponderConfig(selectedNumberId: number | null) {
  const [config, setConfig] = useState<AIResponderConfig | null>(null);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [numberName, setNumberName] = useState<string>("");

  const loadData = async () => {
    if (!selectedNumberId) return;

    try {
      setIsLoading(true);
      const [configData, statsData, numberData] = await Promise.all([
        getAIConfig(selectedNumberId),
        getAIStats(selectedNumberId),
        getWhatsAppNumber(selectedNumberId),
      ]);

      setConfig(configData ?? getDefaultAIConfig(selectedNumberId));
      setStats(statsData);
      setNumberName(numberData?.name ?? numberData?.phoneNumber ?? "");
    } catch (error) {
      console.error("Failed to load AI config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedNumberId) {
      loadData();
    } else {
      setIsLoading(false);
      setConfig(null);
    }
  }, [selectedNumberId]);

  const handleSave = async () => {
    if (!selectedNumberId || !config) return;

    try {
      setIsSaving(true);
      await updateAIConfig(selectedNumberId, config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save AI config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (updates: Partial<AIResponderConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
    }
  };

  const updateScenario = (
    scenario: keyof AIResponderConfig["scenarios"],
    value: boolean
  ) => {
    if (config) {
      setConfig({
        ...config,
        scenarios: {
          ...config.scenarios,
          [scenario]: value,
        },
      });
    }
  };

  return {
    config,
    stats,
    numberName,
    isLoading,
    isSaving,
    saveSuccess,
    loadData,
    handleSave,
    updateConfig,
    updateScenario,
  };
}
