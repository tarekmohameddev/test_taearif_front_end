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
    return (
      <div className="min-h-[320px] bg-white rounded-xl border border-gray-200 flex items-center justify-center">
        <AIResponderLoadingState />
      </div>
    );
  }

  if (!selectedNumberId) {
    return (
      <div className="min-h-[320px] bg-white rounded-xl border border-gray-200 flex items-center justify-center">
        <AIResponderNoNumberState />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-[320px] bg-white rounded-xl border border-gray-200 flex items-center justify-center">
        <AIResponderConfigErrorState />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 sm:p-8 space-y-8">
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
    </div>
  );
}
