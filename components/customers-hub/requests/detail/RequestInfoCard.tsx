"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { priorityConfig, requestDetailActionTypeLabels } from "../constants";
import type { CustomerAction } from "@/types/unified-customer";

interface RequestInfoCardProps {
  action: CustomerAction;
}

export function RequestInfoCard({ action }: RequestInfoCardProps) {
  const typeLabel = requestDetailActionTypeLabels[action.type] ?? action.type;
  const borderColor = (priorityConfig[action.priority] ?? priorityConfig.medium).borderColor;

  return (
    <Card className={cn("border-r-4", borderColor)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          معلومات الطلب
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
          {action.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {action.description}
            </p>
          )}
        </div>

        <Separator />

        {/* معلومات أساسية عن الطلب */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">نوع الطلب</div>
              <div className="font-medium">{typeLabel}</div>
            </div>
          </div>

          {action.assignedToName && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                <UserPlus className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">معين إلى</div>
                <div className="font-medium">{action.assignedToName}</div>
              </div>
            </div>
          )}
        </div>

        {/* تفاصيل العقار المطلوب من نموذج اطلب عقارك */}
        <div className="pt-4 border-t space-y-3">
          <h3 className="text-sm font-semibold mb-1">تفاصيل العقار المطلوب</h3>

          {(action.propertyCategory ||
            action.category_id != null ||
            action.metadata?.propertyCategory) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">نوع العقار (رئيسي)</span>
              <span className="font-medium">
                {action.propertyCategory ??
                  action.metadata?.propertyCategory ??
                  (typeof action.category_id === "number"
                    ? action.category_id
                    : "")}
              </span>
            </div>
          )}

          {(action.propertyType ||
            action.property_type ||
            action.metadata?.propertyType) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">نوع العقار (تفصيلي)</span>
              <span className="font-medium">
                {action.propertyType ??
                  action.property_type ??
                  action.metadata?.propertyType}
              </span>
            </div>
          )}

          {(action.state || action.region || action.city) && (
            <div className="flex flex-col gap-1 text-sm">
              {action.state || action.region ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">المنطقة</span>
                  <span className="font-medium">
                    {action.state ?? action.region}
                  </span>
                </div>
              ) : null}
              {action.city ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">المدينة</span>
                  <span className="font-medium">{action.city}</span>
                </div>
              ) : null}
            </div>
          )}

          {action.districts_id && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">الحي (معرف)</span>
              <span className="font-medium">{action.districts_id}</span>
            </div>
          )}

          {action.area_from != null || action.area_to != null ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">المساحة (م²)</span>
              <span className="font-medium">
                {action.area_from != null ? action.area_from : ""}{" "}
                {action.area_from != null && action.area_to != null && " - "}{" "}
                {action.area_to != null ? action.area_to : ""}
              </span>
            </div>
          ) : null}

          {action.purchase_method && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">طريقة الشراء</span>
              <span className="font-medium">{action.purchase_method}</span>
            </div>
          )}

          {action.budget_from != null || action.budget_to != null || action.budgetMin != null || action.budgetMax != null ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">الميزانية (ريال)</span>
              <span className="font-medium">
                {action.budget_from ?? action.budgetMin ?? ""}{" "}
                {((action.budget_from ?? action.budgetMin) != null &&
                  (action.budget_to ?? action.budgetMax) != null) &&
                  " - "}{" "}
                {action.budget_to ?? action.budgetMax ?? ""}
              </span>
            </div>
          ) : null}
        </div>

        {/* بيانات التواصل كما كتبها العميل في النموذج */}
        <div className="pt-4 border-t space-y-3">
          <h3 className="text-sm font-semibold mb-1">بيانات التواصل من الطلب</h3>

          {(action.full_name || action.customerName) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">اسم العميل</span>
              <span className="font-medium">
                {action.full_name ?? action.customerName}
              </span>
            </div>
          )}

          {(action.phone || action.customerPhone) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">رقم الجوال</span>
              <span className="font-medium">
                {action.phone ?? action.customerPhone}
              </span>
            </div>
          )}

          {action.contact_on_whatsapp != null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">التواصل عبر واتساب</span>
              <span className="font-medium">
                {Number(action.contact_on_whatsapp) === 1 ? "نعم" : "لا"}
              </span>
            </div>
          )}
        </div>

        {/* معلومات إضافية بسيطة عن الطلب من الـ action */}
        <div className="pt-4 border-t space-y-3">
          <h3 className="text-sm font-semibold mb-1">تفاصيل إضافية</h3>

          {action.source && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">مصدر الطلب</span>
              <span className="font-medium">{action.source}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
