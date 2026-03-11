"use client";

import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AIResponderConfig } from "../types";
import { TONE_OPTIONS, LANGUAGE_OPTIONS } from "./constants";

interface AIResponseStyleCardProps {
  config: AIResponderConfig;
  updateConfig: (updates: Partial<AIResponderConfig>) => void;
}

export function AIResponseStyleCard({
  config,
  updateConfig,
}: AIResponseStyleCardProps) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Sparkles className="h-5 w-5 text-gray-600" />
          أسلوب الردود
        </CardTitle>
        <CardDescription className="text-gray-500">
          تخصيص نبرة ولغة الذكاء الاصطناعي
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="tone" className="text-gray-700">نبرة الردود</Label>
          <Select
            value={config.tone}
            onValueChange={(value: AIResponderConfig["tone"]) =>
              updateConfig({ tone: value })
            }
          >
            <SelectTrigger className="mt-1 border-gray-200 focus:ring-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            تحدد كيفية تفاعل الذكاء الاصطناعي مع العملاء
          </p>
        </div>

        <div>
          <Label htmlFor="language" className="text-gray-700">اللغة</Label>
          <Select
            value={config.language}
            onValueChange={(value: AIResponderConfig["language"]) =>
              updateConfig({ language: value })
            }
          >
            <SelectTrigger className="mt-1 border-gray-200 focus:ring-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="customInstructions" className="text-gray-700">تعليمات إضافية</Label>
          <Textarea
            id="customInstructions"
            className="mt-1 border-gray-200 focus-visible:ring-black resize-none"
            value={config.customInstructions ?? ""}
            onChange={(e) =>
              updateConfig({ customInstructions: e.target.value })
            }
            placeholder="أضف تعليمات أو سياسات خاصة للذكاء الاصطناعي..."
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            توجيهات إضافية لضبط سلوك الذكاء الاصطناعي
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
