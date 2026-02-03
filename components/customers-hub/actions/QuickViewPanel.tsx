"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  Building,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SourceBadge } from "./SourceBadge";
import type { UnifiedCustomer, CustomerAction } from "@/types/unified-customer";
import { getStageNameAr, getStageColor } from "@/types/unified-customer";

interface QuickViewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customer: UnifiedCustomer | null;
  action: CustomerAction | null;
}

const priorityColors = {
  urgent: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const priorityLabels = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

export function QuickViewPanel({
  isOpen,
  onClose,
  customer,
  action,
}: QuickViewPanelProps) {
  if (!customer || !action) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">معاينة سريعة</SheetTitle>
            <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                فتح الملف الكامل
              </Button>
            </Link>
          </div>
        </SheetHeader>

        {/* Customer Header */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{customer.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <SourceBadge source={customer.source} />
              <Badge
                variant="outline"
                style={{ borderColor: getStageColor(customer.stage) }}
                className="text-xs"
              >
                {getStageNameAr(customer.stage)}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", priorityColors[customer.priority])}>
                {priorityLabels[customer.priority]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
            <CardContent className="p-3 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-lg font-bold text-green-700">
                {customer.totalDealValue ? `${(customer.totalDealValue / 1000).toFixed(0)}K` : "-"}
              </div>
              <div className="text-xs text-green-600">قيمة الصفقة</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
            <CardContent className="p-3 text-center">
              <MessageSquare className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <div className="text-2xl font-bold text-purple-700">{customer.totalInteractions || 0}</div>
              <div className="text-xs text-purple-600">تفاعلات</div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-gray-500">معلومات الاتصال</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span dir="ltr">{customer.phone}</span>
            </div>
            {customer.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span dir="ltr">{customer.whatsapp}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{customer.email}</span>
              </div>
            )}
            {customer.city && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{customer.city}{customer.district ? ` - ${customer.district}` : ""}</span>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Current Action Details */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-gray-500">الإجراء الحالي</h3>
          <Card className={cn("border-r-4", priorityColors[action.priority].replace("bg-", "border-"))}>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">{action.title}</h4>
              {action.description && (
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {action.dueDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                {action.assignedToName && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{action.assignedToName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        {/* Preferences */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-gray-500">تفضيلات العميل</h3>
          <div className="space-y-2 text-sm">
            {customer.preferences.propertyType?.length > 0 && (
              <div className="flex items-start gap-2">
                <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {customer.preferences.propertyType.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {(customer.preferences.budgetMin || customer.preferences.budgetMax) && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>
                  {customer.preferences.budgetMin?.toLocaleString() || "0"} - {customer.preferences.budgetMax?.toLocaleString() || "∞"} ر.س
                </span>
              </div>
            )}
            {customer.preferences.preferredAreas?.length > 0 && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {customer.preferences.preferredAreas.slice(0, 3).map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {customer.preferences.preferredAreas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{customer.preferences.preferredAreas.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        {customer.aiInsights?.nextBestAction && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-500">توصية الذكاء الاصطناعي</h3>
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                    <p className="text-sm">{customer.aiInsights.nextBestAction}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Recent Interactions */}
        {customer.interactions?.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-500">آخر التفاعلات</h3>
              <div className="space-y-2">
                {customer.interactions.slice(0, 3).map((interaction) => (
                  <div key={interaction.id} className="flex items-start gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">{interaction.notes}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(interaction.date).toLocaleDateString("ar-SA")} - {interaction.agentName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
