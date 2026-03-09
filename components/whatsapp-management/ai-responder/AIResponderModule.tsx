"use client";

import { useAIResponderConfig } from "./useAIResponderConfig";
import {
  AIResponderLoadingState,
  AIResponderNoNumberState,
  AIResponderConfigErrorState,
} from "./AIResponderStates";
import { AIResponderStatsCards } from "./AIResponderStatsCards";
import { AIResponderHeader } from "./AIResponderHeader";
import { AIGeneralSettingsCard } from "./AIGeneralSettingsCard";
import { AIResponseStyleCard } from "./AIResponseStyleCard";
import { AIScenariosCard } from "./AIScenariosCard";
import type { AIResponderModuleProps } from "./types";

export function AIResponderModule({
  selectedNumberId,
}: AIResponderModuleProps) {
  const {
    config,
    stats,
    numberName,
    isLoading,
    isSaving,
    saveSuccess,
    handleSave,
    updateConfig,
    updateScenario,
  } = useAIResponderConfig(selectedNumberId);

  if (isLoading) {
    return <AIResponderLoadingState />;
  }

  if (!selectedNumberId) {
    return <AIResponderNoNumberState />;
  }

  if (!config) {
    return <AIResponderConfigErrorState />;
  }

  return (
    <div className="space-y-6">
      {stats && <AIResponderStatsCards stats={stats} />}

      <AIResponderHeader
        numberName={numberName}
        isSaving={isSaving}
        onSave={handleSave}
        saveSuccess={saveSuccess}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AIGeneralSettingsCard config={config} updateConfig={updateConfig} />
        <AIResponseStyleCard config={config} updateConfig={updateConfig} />
      </div>

      <AIScenariosCard config={config} updateScenario={updateScenario} />
    </div>
  );
}
