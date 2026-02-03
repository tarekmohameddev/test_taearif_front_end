"use client";

import React, { useState, useEffect } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LIFECYCLE_STAGES, 
  getStageNameAr, 
  getStageColor,
  type UnifiedCustomer 
} from "@/types/unified-customer";
import { 
  Eye, DollarSign, 
  TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";

export function EnhancedPipelineBoard() {
  const { customers, updateCustomerStage } = useUnifiedCustomersStore();
  const [draggedCustomer, setDraggedCustomer] = useState<UnifiedCustomer | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, customer: UnifiedCustomer) => {
    setDraggedCustomer(customer);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", customer.id);
    
    // Add visual feedback
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedCustomer(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedCustomer && draggedCustomer.stage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    
    if (draggedCustomer && draggedCustomer.stage !== stageId) {
      // Update customer stage
      updateCustomerStage(draggedCustomer.id, stageId as any);
      
      // Show success animation
      setShowSuccessAnimation(stageId);
      setTimeout(() => setShowSuccessAnimation(null), 2000);
    }
    
    setDraggedCustomer(null);
    setDragOverStage(null);
  };

  const getStageCustomers = (stageId: string) => {
    return customers.filter(c => c.stage === stageId);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "غير محدد";
    return `${(amount / 1000).toFixed(0)}k ريال`;
  };

  return (
    <div className="space-y-4">
      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {LIFECYCLE_STAGES.map((stage) => {
            const stageCustomers = getStageCustomers(stage.id);
            const totalDealValue = stageCustomers.reduce((sum, c) => sum + (c.totalDealValue || 0), 0);
            const isDropTarget = dragOverStage === stage.id;
            const hasAnimation = showSuccessAnimation === stage.id;
            
            return (
              <div
                key={stage.id}
                className={`flex-shrink-0 w-80 transition-all duration-300 ${
                  isDropTarget ? "scale-105" : ""
                } ${hasAnimation ? "animate-pulse" : ""}`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={(e) => handleDragLeave(e, stage.id)}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <Card 
                  className={`h-full ${
                    isDropTarget ? "border-2 border-blue-500 shadow-lg" : ""
                  }`}
                  style={{ 
                    borderTopColor: stage.color,
                    borderTopWidth: "4px"
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.nameAr}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {stage.nameEn}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className="text-lg font-bold"
                      >
                        {stageCustomers.length}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <DollarSign className="h-3 w-3" />
                        <span>القيمة: {formatCurrency(totalDealValue)}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                    {stageCustomers.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        لا يوجد عملاء في هذه المرحلة
                      </div>
                    ) : (
                      stageCustomers.map((customer) => (
                        <Card
                          key={customer.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, customer)}
                          onDragEnd={handleDragEnd}
                          className="cursor-move hover:shadow-md transition-all duration-200 active:scale-95"
                        >
                          <CardContent className="p-3">
                            <div className="space-y-3">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 flex-1">
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarFallback style={{ backgroundColor: stage.color + "20" }}>
                                      {getInitials(customer.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">
                                      {customer.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 truncate">
                                      {customer.phone}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Deal Value */}
                              {customer.totalDealValue && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <DollarSign className="h-3 w-3 text-green-600" />
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(customer.totalDealValue)}
                                  </span>
                                </div>
                              )}

                              {/* Property Preferences */}
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                {customer.preferences.propertyType.slice(0, 2).map((type) => (
                                  <Badge key={type} variant="outline" className="text-xs px-1 py-0">
                                    {type === "villa" ? "فيلا" :
                                     type === "apartment" ? "شقة" :
                                     type === "land" ? "أرض" :
                                     type === "commercial" ? "تجاري" : type}
                                  </Badge>
                                ))}
                              </div>

                              {/* Priority */}
                              {customer.priority === "urgent" && (
                                <Badge variant="destructive" className="text-xs">
                                  🚨 عاجل
                                </Badge>
                              )}
                              {customer.priority === "high" && (
                                <Badge variant="default" className="text-xs">
                                  🔥 عالي
                                </Badge>
                              )}

                              {/* Actions */}
                              <div className="flex items-center gap-1 pt-2 border-t">
                                <Link href={`/ar/dashboard/customers-hub/${customer.id}`} className="flex-1">
                                  <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                                    <Eye className="h-3 w-3 ml-1" />
                                    عرض
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">💡 كيفية الاستخدام:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
            <div>• اسحب البطاقات بين الأعمدة لتغيير المرحلة</div>
            <div>• انقر على "عرض" لفتح صفحة التفاصيل</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
