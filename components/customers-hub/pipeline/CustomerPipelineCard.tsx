"use client";

import React from "react";
import type { UnifiedCustomer } from "@/types/unified-customer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Eye, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import useUnifiedCustomersStore from "@/context/store/unified-customers";

interface CustomerPipelineCardProps {
  customer: UnifiedCustomer;
  stageColor: string;
}

export function CustomerPipelineCard({
  customer,
  stageColor,
}: CustomerPipelineCardProps) {
  const { setSelectedCustomer, setShowCustomerDetailDialog } = useUnifiedCustomersStore();

  const handleCardClick = () => {
    setSelectedCustomer(customer);
    setShowCustomerDetailDialog(true);
  };

  return (
    <Card
      className="p-3 hover:shadow-md transition-shadow cursor-pointer border-r-4"
      style={{ borderRightColor: stageColor }}
      onClick={handleCardClick}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-1">
              {customer.name}
              {customer.priority === "urgent" && <span className="text-xs">🚨</span>}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {customer.phone}
            </div>
          </div>
          
        </div>

        {/* Property Interest */}
        {customer.preferences && (
          <div className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <div className="flex items-center gap-1 flex-wrap">
              {customer.preferences.propertyType.slice(0, 2).map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type === "villa" ? "فيلا" : type === "apartment" ? "شقة" : type}
                </Badge>
              ))}
            </div>
            {customer.preferences.budgetMax && (
              <div className="mt-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>
                  {(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال
                </span>
              </div>
            )}
          </div>
        )}

        {/* AI Insight */}
        {customer.aiInsights.nextBestAction && (
          <div className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded text-blue-700 dark:text-blue-300">
            💡 {customer.aiInsights.nextBestAction.slice(0, 60)}
            {customer.aiInsights.nextBestAction.length > 60 && "..."}
          </div>
        )}

        {/* Next Follow-up */}
        {customer.nextFollowUpDate && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(customer.nextFollowUpDate).toLocaleDateString("ar-SA", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1 border-t">
          <Link
            href={`/ar/dashboard/customers-hub/${customer.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
          {customer.assignedEmployee && (
            <div className="mr-auto text-xs text-gray-500 truncate">
              {customer.assignedEmployee.name}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
