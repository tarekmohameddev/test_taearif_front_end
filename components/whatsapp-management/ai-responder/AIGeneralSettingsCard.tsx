"use client";

import { Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { AIResponderConfig } from "../types";

interface AIGeneralSettingsCardProps {
  config: AIResponderConfig;
  updateConfig: (updates: Partial<AIResponderConfig>) => void;
}

export function AIGeneralSettingsCard({
  config,
  updateConfig,
}: AIGeneralSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          الإعدادات العامة
        </CardTitle>
        <CardDescription>
          تفعيل وتكوين الرد الآلي الأساسي
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">تفعيل الرد الآلي</Label>
            <p className="text-sm text-muted-foreground">
              السماح للذكاء الاصطناعي بالرد على العملاء
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => updateConfig({ enabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">ساعات العمل فقط</Label>
            <p className="text-sm text-muted-foreground">
              الرد الآلي خلال ساعات العمل فقط
            </p>
          </div>
          <Switch
            checked={config.businessHoursOnly}
            onCheckedChange={(checked) =>
              updateConfig({ businessHoursOnly: checked })
            }
          />
        </div>

        {config.businessHoursOnly && (
          <div className="space-y-4 pl-4 border-r-2 border-primary/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">بداية العمل</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={config.businessHours?.start ?? "09:00"}
                  onChange={(e) =>
                    updateConfig({
                      businessHours: {
                        ...config.businessHours!,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endTime">نهاية العمل</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={config.businessHours?.end ?? "18:00"}
                  onChange={(e) =>
                    updateConfig({
                      businessHours: {
                        ...config.businessHours!,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">التحويل لموظف</Label>
            <p className="text-sm text-muted-foreground">
              التحويل للموظف إذا لم يتمكن الذكاء من الرد
            </p>
          </div>
          <Switch
            checked={config.fallbackToHuman}
            onCheckedChange={(checked) =>
              updateConfig({ fallbackToHuman: checked })
            }
          />
        </div>

        {config.fallbackToHuman && (
          <div className="pl-4 border-r-2 border-primary/20">
            <Label htmlFor="fallbackDelay">
              وقت الانتظار قبل التحويل (دقائق)
            </Label>
            <Input
              id="fallbackDelay"
              type="number"
              value={config.fallbackDelay}
              onChange={(e) =>
                updateConfig({ fallbackDelay: Number(e.target.value) })
              }
              min={1}
              max={60}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
