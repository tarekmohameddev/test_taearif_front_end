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

const switchBlack = "data-[state=checked]:bg-black";

interface AIGeneralSettingsCardProps {
  config: AIResponderConfig;
  updateConfig: (updates: Partial<AIResponderConfig>) => void;
}

export function AIGeneralSettingsCard({
  config,
  updateConfig,
}: AIGeneralSettingsCardProps) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Settings className="h-5 w-5 text-gray-600" />
          الإعدادات العامة
        </CardTitle>
        <CardDescription className="text-gray-500">
          تفعيل وتكوين الرد الآلي الأساسي
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-base text-black">تفعيل الرد الآلي</Label>
            <p className="text-sm text-gray-500">
              السماح للذكاء الاصطناعي بالرد على العملاء
            </p>
          </div>
          <Switch
            className={switchBlack}
            checked={config.enabled}
            onCheckedChange={(checked) => updateConfig({ enabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-base text-black">ساعات العمل فقط</Label>
            <p className="text-sm text-gray-500">
              الرد الآلي خلال ساعات العمل فقط
            </p>
          </div>
          <Switch
            className={switchBlack}
            checked={config.businessHoursOnly}
            onCheckedChange={(checked) =>
              updateConfig({ businessHoursOnly: checked })
            }
          />
        </div>

        {config.businessHoursOnly && (
          <div className="space-y-4 pl-4 border-r-2 border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-gray-700">بداية العمل</Label>
                <Input
                  id="startTime"
                  type="time"
                  className="mt-1 border-gray-200 focus-visible:ring-black"
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
                <Label htmlFor="endTime" className="text-gray-700">نهاية العمل</Label>
                <Input
                  id="endTime"
                  type="time"
                  className="mt-1 border-gray-200 focus-visible:ring-black"
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

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-base text-black">التحويل لموظف</Label>
            <p className="text-sm text-gray-500">
              التحويل للموظف إذا لم يتمكن الذكاء من الرد
            </p>
          </div>
          <Switch
            className={switchBlack}
            checked={config.fallbackToHuman}
            onCheckedChange={(checked) =>
              updateConfig({ fallbackToHuman: checked })
            }
          />
        </div>

        {config.fallbackToHuman && (
          <div className="pl-4 border-r-2 border-gray-300">
            <Label htmlFor="fallbackDelay" className="text-gray-700">
              وقت الانتظار قبل التحويل (دقائق)
            </Label>
            <Input
              id="fallbackDelay"
              type="number"
              className="mt-1 border-gray-200 focus-visible:ring-black"
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
