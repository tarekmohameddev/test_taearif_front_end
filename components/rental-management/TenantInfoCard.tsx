import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hash, Mail, Phone, User } from "lucide-react";

import type { RentalDetailsRental } from "@/components/rental-management/rental-details-types";

interface TenantInfoCardProps {
  rental: RentalDetailsRental;
}

export function TenantInfoCard({ rental }: TenantInfoCardProps) {
  const initials = rental.tenant_full_name
    ? rental.tenant_full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "??";

  return (
    <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle
            className="flex items-center gap-2 text-right text-base sm:text-lg"
            dir="rtl"
          >
            معلومات المستأجر
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
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
                {rental.tenant_full_name || "غير محدد"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-right">
                {rental.tenant_job_title || "غير محدد"}
              </p>
              <Badge variant="outline" className="w-fit text-xs sm:text-sm">
                {rental.tenant_social_status === "married" ? "متزوج" : "أعزب"}
              </Badge>
            </div>
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-600 text-white text-lg sm:text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
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
                    رقم الهاتف
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-right">
                    {rental.tenant_phone || "غير محدد"}
                  </p>
                </div>
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              </div>
              <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                <div className="text-right" dir="rtl">
                  <p className="text-xs sm:text-sm text-gray-500 text-right">
                    البريد الإلكتروني
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-right break-all">
                    {rental.tenant_email || "غير محدد"}
                  </p>
                </div>
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                <div className="text-right" dir="rtl">
                  <p className="text-xs sm:text-sm text-gray-500 text-right">
                    رقم الهوية
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-right">
                    {rental.tenant_national_id || "غير محدد"}
                  </p>
                </div>
                <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {rental.notes && (
            <>
              <Separator />
              <div className="text-right" dir="rtl">
                <p className="text-xs sm:text-sm text-gray-500 mb-2 text-right">
                  ملاحظات
                </p>
                <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg text-right">
                  {rental.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

