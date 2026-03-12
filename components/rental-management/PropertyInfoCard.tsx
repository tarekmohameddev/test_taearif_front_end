import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Hash, Home, MapPin } from "lucide-react";

import type { RentalDetails } from "@/components/rental-management/rental-details-types";
import {
  getPropertyNumber,
  getUnitName,
} from "@/components/rental-management/rental-details-helpers";

interface PropertyInfoCardProps {
  details: RentalDetails;
}

export function PropertyInfoCard({ details }: PropertyInfoCardProps) {
  return (
    <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle
            className="flex items-center gap-2 text-right text-base sm:text-lg"
            dir="rtl"
          >
            معلومات العقار
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent
          className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
          dir="rtl"
        >
          <div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            dir="rtl"
          >
            <div className="space-y-1 text-right" dir="rtl">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                {getUnitName(details)}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-right">
                الوحدة: {getUnitName(details)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 text-right">
                رقم العقار: {getPropertyNumber(details)}
              </p>
            </div>
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>

          <Separator />

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
            dir="rtl"
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                <div className="text-right" dir="rtl">
                  <p className="text-xs sm:text-sm text-gray-500 text-right">
                    رقم العقار
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-right">
                    {getPropertyNumber(details)}
                  </p>
                </div>
                <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              </div>
              <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                <div className="text-right" dir="rtl">
                  <p className="text-xs sm:text-sm text-gray-500 text-right">
                    الوحدة
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-right">
                    {getUnitName(details)}
                  </p>
                </div>
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {details.property.project?.name && (
                <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                  <div className="text-right" dir="rtl">
                    <p className="text-xs sm:text-sm text-gray-500 text-right">
                      المشروع
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-right">
                      {details.property.project.name}
                    </p>
                  </div>
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

