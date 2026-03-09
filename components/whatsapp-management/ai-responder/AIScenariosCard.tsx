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
    <Card>
      <CardHeader>
        <CardTitle>سيناريوهات الرد</CardTitle>
        <CardDescription>
          حدد المواقف التي يمكن للذكاء الاصطناعي التعامل معها
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {SCENARIO_OPTIONS.map(({ key, title, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-0.5">
                <Label className="text-base">{title}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch
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
