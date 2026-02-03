"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { getStageNameAr, getStageColor } from "@/types/unified-customer";
import { User, Phone, Mail, MapPin, Briefcase, Users, Tag, MessageSquare } from "lucide-react";

interface CustomerProfileProps {
  customer: UnifiedCustomer;
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">الملف الشخصي</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage */}
        <div>
          <div className="text-sm text-gray-600 mb-2">المرحلة الحالية</div>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1"
            style={{
              borderColor: getStageColor(customer.stage),
              color: getStageColor(customer.stage),
            }}
          >
            {getStageNameAr(customer.stage)}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span dir="ltr" className="text-left">{customer.phone}</span>
          </div>
          {customer.whatsapp && (
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <span dir="ltr" className="text-left">{customer.whatsapp}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{customer.email}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {(customer.city || customer.district) && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {customer.city}
              {customer.district && ` - ${customer.district}`}
            </span>
          </div>
        )}

        {/* Occupation */}
        {customer.occupation && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>{customer.occupation}</span>
          </div>
        )}

        {/* Family Size */}
        {customer.familySize && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-400" />
            <span>أفراد العائلة: {customer.familySize}</span>
          </div>
        )}

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              الوسوم
            </div>
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Employee */}
        {customer.assignedEmployee && (
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-600 mb-2">الموظف المسؤول</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  {customer.assignedEmployee.name}
                </div>
                {customer.assignedEmployee.role && (
                  <div className="text-xs text-gray-500">
                    {customer.assignedEmployee.role}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold">{customer.totalInteractions || 0}</div>
            <div className="text-xs text-gray-600">تفاعل</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold">{customer.totalAppointments || 0}</div>
            <div className="text-xs text-gray-600">موعد</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
