"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AIResponderConfig } from "../types";
import { SCENARIO_OPTIONS } from "./constants";

const switchBlack = "data-[state=checked]:bg-black";

interface AIScenariosCardProps {
  config: AIResponderConfig;
  updateScenario: (
    scenario: keyof AIResponderConfig["scenarios"],
    value: boolean
  ) => void;
}

export function AIScenariosCard({
  config,
  updateScenario,
}: AIScenariosCardProps) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-black">سيناريوهات الرد</CardTitle>
        <CardDescription className="text-gray-500">
          حدد المواقف التي يمكن للذكاء الاصطناعي التعامل معها
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIO_OPTIONS.map(({ key, title, description }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
            >
              <div className="space-y-0.5 min-w-0">
                <Label className="text-base text-black">{title}</Label>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
              <Switch
                className={`${switchBlack} shrink-0`}
                checked={config.scenarios[key]}
                onCheckedChange={(checked) => updateScenario(key, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
