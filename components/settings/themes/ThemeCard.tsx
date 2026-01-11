"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Sparkles, Loader2 } from "lucide-react";
import type { Theme } from "./types";

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  isFree: boolean;
  onSwitch: (themeId: string) => void;
  isSwitching: boolean;
}

export function ThemeCard({
  theme,
  isActive,
  isFree,
  onSwitch,
  isSwitching,
}: ThemeCardProps) {
  const canSwitch = isFree || theme.has_access;
  const isLocked = !isFree && !theme.has_access;

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isActive ? "border-primary border-2 shadow-lg" : ""
      } ${isLocked ? "opacity-75" : ""}`}
    >
      {/* Theme Image */}
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={theme.thumbnail || "/placeholder.svg"}
          alt={theme.name}
          className="w-full h-full object-cover"
        />
        {/* Active Badge */}
        {isActive && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-green-600 text-white">
              <Check className="h-3 w-3 ml-1" />
              نشط
            </Badge>
          </div>
        )}
        {/* Owned Badge */}
        {theme.has_access && !isActive && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              مملوك
            </Badge>
          </div>
        )}
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Lock className="h-12 w-12 text-white" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{theme.name}</CardTitle>
          {theme.popular && (
            <Badge variant="secondary" className="text-xs">
              شائع
            </Badge>
          )}
        </div>
        {theme.description && (
          <CardDescription className="text-sm mt-1">
            {theme.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          {isFree ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              مجاني
            </Badge>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-gray-900">
                {theme.price}
              </span>
              <span className="text-sm text-gray-600">
                {theme.currency || "SAR"}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        {isActive ? (
          <Button variant="outline" className="w-full" disabled>
            <Check className="h-4 w-4 ml-1" />
            الثيم النشطة
          </Button>
        ) : isLocked ? (
          <Button
            variant="default"
            className="w-full"
            onClick={() => onSwitch(theme.id)}
            disabled={isSwitching}
          >
            {isSwitching ? (
              <>
                <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 ml-1" />
                شراء الثيم
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={() => onSwitch(theme.id)}
            disabled={isSwitching}
          >
            {isSwitching ? (
              <>
                <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                جاري التبديل...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 ml-1" />
                تفعيل الثيم
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
