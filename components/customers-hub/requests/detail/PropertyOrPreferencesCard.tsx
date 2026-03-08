"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, MapPin } from "lucide-react";

export interface PropertyInfoSummary {
  title?: string;
  type?: string;
  price?: number;
  location?: string;
}

export interface CustomerPreferencesSummary {
  type?: string;
  budget?: string;
  location?: string;
  bedrooms?: number;
}

interface PropertyOrPreferencesCardProps {
  propertyInfo: PropertyInfoSummary | null;
  customerPreferences: CustomerPreferencesSummary | null;
}

export function PropertyOrPreferencesCard({
  propertyInfo,
  customerPreferences,
}: PropertyOrPreferencesCardProps) {
  if (!propertyInfo && !customerPreferences) {
    return null;
  }

  const isProperty = !!propertyInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {isProperty ? "معلومات العقار" : "تفضيلات العميل"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isProperty ? (
            <>
              {propertyInfo.title && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{propertyInfo.title}</span>
                </div>
              )}
              {propertyInfo.type && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{propertyInfo.type}</span>
                </div>
              )}
              {propertyInfo.price != null && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{propertyInfo.price.toLocaleString("ar-SA")} ر.س</span>
                </div>
              )}
              {propertyInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{propertyInfo.location}</span>
                </div>
              )}
            </>
          ) : (
            customerPreferences && (
              <>
                {customerPreferences.type && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">نوع العقار</div>
                      <div className="font-medium">{customerPreferences.type}</div>
                    </div>
                  </div>
                )}
                {customerPreferences.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">الميزانية</div>
                      <div className="font-medium">{customerPreferences.budget}</div>
                    </div>
                  </div>
                )}
                {customerPreferences.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">المناطق المفضلة</div>
                      <div className="font-medium">{customerPreferences.location}</div>
                    </div>
                  </div>
                )}
                {customerPreferences.bedrooms != null && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">غرف النوم</div>
                      <div className="font-medium">{customerPreferences.bedrooms}+</div>
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
