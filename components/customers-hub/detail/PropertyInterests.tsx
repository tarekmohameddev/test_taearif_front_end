"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { Home, DollarSign, MapPin, Eye } from "lucide-react";

interface PropertyInterestsProps {
  customer: UnifiedCustomer;
}

export function PropertyInterests({ customer }: PropertyInterestsProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      interested: { variant: "secondary", label: "مهتم" },
      viewing_scheduled: { variant: "default", label: "معاينة مجدولة" },
      viewed: { variant: "default", label: "تمت المعاينة" },
      liked: { variant: "default", label: "أعجبه" },
      rejected: { variant: "destructive", label: "رفض" },
      offer_made: { variant: "default", label: "عرض مقدم" },
    };
    const config = statusConfig[status] || statusConfig.interested;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">العقارات المهتم بها</h3>
        <Button variant="outline" size="sm">
          إضافة عقار
        </Button>
      </div>

      {customer.properties.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          لم يتم إضافة أي عقارات بعد
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {customer.properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {property.propertyImage && (
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${property.propertyImage})` }}
                />
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{property.propertyTitle}</h4>
                    {property.propertyLocation && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.propertyLocation}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(property.status)}
                </div>

                {property.propertyPrice && (
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    {(property.propertyPrice / 1000).toFixed(0)}k ريال
                  </div>
                )}

                {property.feedback && (
                  <div className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {property.feedback}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 ml-1" />
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preferences Summary */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950">
        <h4 className="font-semibold mb-3 text-sm">التفضيلات المحددة</h4>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">نوع العقار:</span>
            <div className="flex gap-1">
              {customer.preferences.propertyType.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type === "villa"
                    ? "فيلا"
                    : type === "apartment"
                    ? "شقة"
                    : type === "land"
                    ? "أرض"
                    : type === "commercial"
                    ? "تجاري"
                    : type}
                </Badge>
              ))}
            </div>
          </div>
          {customer.preferences.budgetMax && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الميزانية:</span>
              <span className="font-medium">
                {(customer.preferences.budgetMin || 0) / 1000}k -{" "}
                {customer.preferences.budgetMax / 1000}k ريال
              </span>
            </div>
          )}
          {customer.preferences.bedrooms && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">غرف النوم:</span>
              <span className="font-medium">{customer.preferences.bedrooms}</span>
            </div>
          )}
          {customer.preferences.preferredAreas.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">المناطق المفضلة:</span>
              <span className="font-medium">
                {customer.preferences.preferredAreas.slice(0, 2).join(", ")}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
