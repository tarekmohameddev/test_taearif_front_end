"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, MapPin, Sparkles } from "lucide-react";
import type { PropertyInterest } from "@/types/unified-customer";

interface AIMatchingCardProps {
  canMatch: boolean;
  matchCount: number;
  matchedProperties: PropertyInterest[];
}

const PROPERTY_STATUS_LABELS: Record<string, string> = {
  interested: "مهتم",
  viewing_scheduled: "معاينة مجدولة",
  viewed: "تمت المعاينة",
  liked: "معجب",
  rejected: "مرفوض",
  offer_made: "عرض مقدم",
};

export function AIMatchingCard({
  canMatch,
  matchCount,
  matchedProperties,
}: AIMatchingCardProps) {
  return (
    <Card className="border-violet-200 dark:border-violet-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          مطابقة الذكاء الاصطناعي
          {matchCount > 0 && (
            <Badge variant="secondary" className="text-violet-600 dark:text-violet-400">
              {matchCount} عقار
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!canMatch ? (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 py-2">
            <Sparkles className="h-4 w-4 opacity-70" />
            <span>أكمِل تفضيلات العميل لتفعيل المطابقة بالذكاء الاصطناعي</span>
          </div>
        ) : matchedProperties.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              عقارات مطابقة لتفضيلات العميل حسب الذكاء الاصطناعي:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-md transition-shadow border-violet-100 dark:border-violet-900/30"
                >
                  {property.propertyImage && (
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${property.propertyImage})`,
                      }}
                    />
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-base">{property.propertyTitle}</h4>
                      {property.propertyLocation && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {property.propertyLocation}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {property.propertyType && (
                        <Badge variant="outline" className="text-xs">
                          {property.propertyType}
                        </Badge>
                      )}
                      {property.status && (
                        <Badge
                          variant={
                            property.status === "viewing_scheduled" || property.status === "liked"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {PROPERTY_STATUS_LABELS[property.status] ?? property.status}
                        </Badge>
                      )}
                    </div>
                    {property.propertyPrice != null && (
                      <div className="flex items-center gap-1.5 text-base font-bold text-green-600 dark:text-green-400">
                        <DollarSign className="h-4 w-4" />
                        {(property.propertyPrice / 1000).toFixed(0)}k ر.س
                      </div>
                    )}
                    {property.addedAt && (
                      <p className="text-xs text-gray-500">
                        أضيف:{" "}
                        {new Date(property.addedAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      عرض التفاصيل
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 py-2">
            <Sparkles className="h-4 w-4" />
            <span>
              {matchCount} عقار مطابق — أضف العقارات للعميل لعرض التفاصيل هنا
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
