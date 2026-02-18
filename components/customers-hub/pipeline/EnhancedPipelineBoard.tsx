"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  type UnifiedCustomer 
} from "@/types/unified-customer";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import { 
  Eye, DollarSign, 
  TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";
import type { PipelineStage } from "@/lib/services/customers-hub-pipeline-api";
import type { MoveCustomerParams } from "@/lib/services/customers-hub-pipeline-api";
import type { Stage } from "@/lib/services/customers-hub-stages-api";

interface EnhancedPipelineBoardProps {
  stages?: PipelineStage[];
  apiStages?: Stage[];  // Stages from API stages (for boards display)
  onMoveCustomer?: (params: MoveCustomerParams) => Promise<boolean>;
}

export function EnhancedPipelineBoard(props?: EnhancedPipelineBoardProps) {
  // Use API stages from props (preferred) or fetch from store as fallback
  const { stages: storeStages } = useCustomersHubStagesStore();
  const apiStages = props?.apiStages || storeStages;
  
  // Use prop stages only - NO FALLBACK
  const stages = props?.stages;

  const [draggedCustomer, setDraggedCustomer] = useState<UnifiedCustomer | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<string | null>(null);
  // Cache all customers by stage - this is the source of truth for UI
  const [cachedCustomersByStage, setCachedCustomersByStage] = useState<Map<string | number, UnifiedCustomer[]>>(new Map());
  
  // Initialize cache from props when stages data changes
  useEffect(() => {
    if (stages && stages.length > 0) {
      const newCache = new Map<string | number, UnifiedCustomer[]>();
      stages.forEach(stage => {
        const stageId = stage.id || stage.stage_id;
        if (stageId && stage.customers) {
          newCache.set(stageId, [...stage.customers]);
        }
      });
      setCachedCustomersByStage(newCache);
    }
  }, [stages]);

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

  const handleDrop = (e: React.DragEvent, stageId: string | number) => {
    e.preventDefault();
    
    if (draggedCustomer && draggedCustomer.stage !== stageId) {
      const customerId = draggedCustomer.id.toString();
      const oldStageId = draggedCustomer.stage;
      const newStageId = stageId;
      
      // UPDATE CACHE IMMEDIATELY - This is the source of truth for UI
      setCachedCustomersByStage(prev => {
        const newCache = new Map(prev);
        
        // Remove customer from old stage
        const oldStageCustomers = newCache.get(oldStageId) || [];
        const updatedOldStage = oldStageCustomers.filter(c => c.id.toString() !== customerId);
        newCache.set(oldStageId, updatedOldStage);
        
        // Add customer to new stage
        const newStageCustomers = newCache.get(newStageId) || [];
        const updatedCustomer = { ...draggedCustomer, stage: newStageId };
        // Check if customer already exists (shouldn't, but safety)
        if (!newStageCustomers.find(c => c.id.toString() === customerId)) {
          newCache.set(newStageId, [...newStageCustomers, updatedCustomer]);
        }
        
        return newCache;
      });
      
      // Show success animation immediately
      setShowSuccessAnimation(newStageId.toString());
      setTimeout(() => setShowSuccessAnimation(null), 2000);
      
      // Call API in background (don't await) - only for sync with backend
      if (props?.onMoveCustomer) {
        const customerSource = (draggedCustomer as any).source;
        const requestId = (draggedCustomer as any).requestId;
        const inquiryId = (draggedCustomer as any).inquiryId;
        
        const moveParams: MoveCustomerParams = {
          newStageId: newStageId,
        };
        
        if (customerSource === "inquiry" && inquiryId !== undefined && inquiryId !== null) {
          moveParams.inquiryId = typeof inquiryId === "number" 
            ? inquiryId 
            : parseInt(inquiryId.toString());
        } else if (requestId !== undefined && requestId !== null) {
          moveParams.requestId = typeof requestId === "number" 
            ? requestId 
            : parseInt(requestId.toString());
        } else {
          moveParams.requestId = typeof draggedCustomer.id === "number" 
            ? draggedCustomer.id 
            : parseInt(draggedCustomer.id.toString());
        }
        
        // Call API in background - if it fails, rollback cache
        props.onMoveCustomer(moveParams).catch((err) => {
          console.error("Error moving customer:", err);
          // Rollback cache on error
          setCachedCustomersByStage(prev => {
            const newCache = new Map(prev);
            
            // Remove from new stage
            const newStageCustomers = newCache.get(newStageId) || [];
            const updatedNewStage = newStageCustomers.filter(c => c.id.toString() !== customerId);
            newCache.set(newStageId, updatedNewStage);
            
            // Add back to old stage
            const oldStageCustomers = newCache.get(oldStageId) || [];
            if (!oldStageCustomers.find(c => c.id.toString() === customerId)) {
              newCache.set(oldStageId, [...oldStageCustomers, { ...draggedCustomer, stage: oldStageId }]);
            }
            
            return newCache;
          });
        });
      }
    }
    
    setDraggedCustomer(null);
    setDragOverStage(null);
  };

  const getStageCustomers = (stageId: string | number) => {
    // Use displayStages which already has customers merged from pipeline stages
    // NO FALLBACK - Only use data from API
    const stageIdNum = typeof stageId === "number" ? stageId : parseInt(stageId.toString());
    const displayStage = displayStages.find(s => 
      s.id === stageIdNum ||
      s.id?.toString() === stageId.toString()
    );
    
    return displayStage?.customers || [];
  };
  
  // Get stages to display - use CACHED customers as source of truth (not backend response)
  const displayStages = useMemo(() => {
    if (!apiStages || apiStages.length === 0) return [];
    
    return apiStages
      .filter(stage => stage.is_active)
      .sort((a, b) => a.order - b.order)
      .map(apiStage => {
        const stageId = apiStage.id;
        
        // Get customers from CACHE (local state) - this is the source of truth
        // If cache is empty, fallback to props (initial load)
        let customers = cachedCustomersByStage.get(stageId) || [];
        
        // If cache is empty for this stage, try to get from props (initial load only)
        if (customers.length === 0 && stages) {
          const pipelineStage = stages.find(ps => 
            ps.id === stageId || 
            ps.stage_id === stageId ||
            ps.id?.toString() === stageId.toString()
          );
          customers = pipelineStage?.customers || [];
        }
        
        return {
          id: apiStage.id,
          idString: apiStage.id.toString(),
          nameAr: apiStage.stage_name_ar,
          nameEn: apiStage.stage_name_en,
          color: apiStage.color,
          order: apiStage.order,
          customers: customers,
          customerCount: customers.length,
        };
      });
  }, [apiStages, cachedCustomersByStage, stages]);

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

  // Show message if no stages available from API
  if (!displayStages || displayStages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            لا توجد مراحل متاحة. يرجى التأكد من إعداد المراحل في النظام.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {displayStages.map((stage) => {
            const stageCustomers = getStageCustomers(stage.id);
            const totalDealValue = stageCustomers.reduce((sum, c) => sum + (c.totalDealValue || 0), 0);
            const isDropTarget = dragOverStage === stage.idString || dragOverStage === stage.id?.toString();
            const hasAnimation = showSuccessAnimation === stage.idString || showSuccessAnimation === stage.id?.toString();
            
            return (
              <div
                key={stage.idString || stage.id}
                className={`flex-shrink-0 w-80 transition-all duration-300 ${
                  isDropTarget ? "scale-105" : ""
                } ${hasAnimation ? "animate-pulse" : ""}`}
                onDragOver={(e) => handleDragOver(e, stage.idString || stage.id.toString())}
                onDragLeave={(e) => handleDragLeave(e, stage.idString || stage.id.toString())}
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
                          {stage.nameAr || stage.name}
                        </CardTitle>
                        {stage.nameEn && (
                          <p className="text-xs text-gray-500 mt-1">
                            {stage.nameEn}
                          </p>
                        )}
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
                      stageCustomers.map((customer, index) => {
                        // Generate extremely unique key combining multiple random elements
                        const random1 = Math.random().toString(36).substring(2, 15);
                        const random2 = Math.random().toString(36).substring(2, 15);
                        const random3 = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        const timestamp = performance.now().toString(36);
                        const uniqueKey = `${stage.id}-${customer.id}-${index}-${random1}-${random2}-${random3}-${timestamp}`;
                        
                        return (
                          <Card
                            key={uniqueKey}
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
                              {customer.preferences?.propertyType && Array.isArray(customer.preferences.propertyType) && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  {customer.preferences.propertyType.slice(0, 2).map((type: string) => (
                                    <Badge key={type} variant="outline" className="text-xs px-1 py-0">
                                      {type === "villa" ? "فيلا" :
                                       type === "apartment" ? "شقة" :
                                       type === "land" ? "أرض" :
                                       type === "commercial" ? "تجاري" : type}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {customer.preferences?.propertyType && !Array.isArray(customer.preferences.propertyType) && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {customer.preferences.propertyType === "villa" ? "فيلا" :
                                     customer.preferences.propertyType === "apartment" ? "شقة" :
                                     customer.preferences.propertyType === "land" ? "أرض" :
                                     customer.preferences.propertyType === "commercial" ? "تجاري" : 
                                     String(customer.preferences.propertyType)}
                                  </Badge>
                                </div>
                              )}

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
                        );
                      })
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
