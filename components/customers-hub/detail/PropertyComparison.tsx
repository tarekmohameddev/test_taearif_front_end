"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnifiedCustomer, PropertyInterest } from "@/types/unified-customer";
import { 
  Home, DollarSign, MapPin, Ruler, BedDouble, Bath,
  Car, Wifi, Zap, ShoppingCart, GraduationCap, Hospital,
  Check, X, Star, TrendingUp, Calendar, ArrowRight,
  Eye, Heart, MessageSquare
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface PropertyComparisonProps {
  customer: UnifiedCustomer;
}

interface ComparisonFeature {
  id: string;
  label: string;
  icon: any;
  getValue: (property: PropertyInterest) => string | number | boolean;
  isHighlight?: boolean;
}

export function PropertyComparison({ customer }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const comparisonFeatures: ComparisonFeature[] = [
    {
      id: "price",
      label: "السعر",
      icon: DollarSign,
      getValue: (p) => p.propertyPrice ? `${(p.propertyPrice / 1000).toFixed(0)}k ريال` : "غير محدد",
      isHighlight: true,
    },
    {
      id: "location",
      label: "الموقع",
      icon: MapPin,
      getValue: (p) => p.propertyLocation || "غير محدد",
    },
    {
      id: "type",
      label: "النوع",
      icon: Home,
      getValue: (p) => p.propertyType || "غير محدد",
    },
    {
      id: "status",
      label: "الحالة",
      icon: Star,
      getValue: (p) => {
        const statusMap: Record<string, string> = {
          interested: "مهتم",
          viewing_scheduled: "معاينة مجدولة",
          viewed: "تمت المعاينة",
          liked: "أعجبه",
          rejected: "رفض",
          offer_made: "عرض مقدم",
        };
        return statusMap[p.status] || p.status;
      },
    },
    {
      id: "addedDate",
      label: "تاريخ الإضافة",
      icon: Calendar,
      getValue: (p) => new Date(p.addedAt).toLocaleDateString("ar-SA", {
        month: "short",
        day: "numeric",
      }),
    },
    {
      id: "viewedDate",
      label: "تاريخ المعاينة",
      icon: Eye,
      getValue: (p) => p.viewedAt 
        ? new Date(p.viewedAt).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })
        : "لم تتم المعاينة",
    },
  ];

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : prev.length < 4
        ? [...prev, propertyId]
        : prev
    );
  };

  const selectedPropertyData = customer.properties.filter(p => 
    selectedProperties.includes(p.id)
  );

  const getMatchScore = (property: PropertyInterest): number => {
    let score = 0;
    let total = 0;

    // Price match
    if (property.propertyPrice && customer.preferences.budgetMax) {
      total += 30;
      if (property.propertyPrice <= customer.preferences.budgetMax) {
        const priceRatio = property.propertyPrice / customer.preferences.budgetMax;
        score += 30 * (priceRatio > 0.7 ? 1 : 0.7);
      }
    }

    // Status match
    total += 30;
    if (property.status === "liked" || property.status === "offer_made") {
      score += 30;
    } else if (property.status === "viewed") {
      score += 20;
    } else if (property.status === "viewing_scheduled") {
      score += 15;
    } else if (property.status === "interested") {
      score += 10;
    }

    // Timeline match
    total += 20;
    const daysSinceAdded = Math.floor(
      (new Date().getTime() - new Date(property.addedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceAdded < 7) score += 20;
    else if (daysSinceAdded < 14) score += 15;
    else if (daysSinceAdded < 30) score += 10;
    else score += 5;

    return total > 0 ? Math.round((score / total) * 100) : 50;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 dark:bg-green-950";
    if (score >= 60) return "text-blue-600 bg-blue-50 dark:bg-blue-950";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
    return "text-red-600 bg-red-50 dark:bg-red-950";
  };

  const getBestMatch = () => {
    if (customer.properties.length === 0) return null;
    return customer.properties.reduce((best, current) => {
      return getMatchScore(current) > getMatchScore(best) ? current : best;
    });
  };

  const bestMatch = getBestMatch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">مقارنة العقارات</h3>
          <p className="text-sm text-gray-500">
            اختر حتى 4 عقارات للمقارنة
          </p>
        </div>
      </div>

      {/* Best Match Highlight */}
      {bestMatch && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">أفضل مطابقة</h4>
                    <Badge className={`${getScoreColor(getMatchScore(bestMatch))}`}>
                      {getMatchScore(bestMatch)}% مطابقة
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                    {bestMatch.propertyTitle}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    {bestMatch.propertyLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {bestMatch.propertyLocation}
                      </span>
                    )}
                    {bestMatch.propertyPrice && (
                      <span className="flex items-center gap-1 font-bold text-green-600">
                        <DollarSign className="h-3 w-3" />
                        {(bestMatch.propertyPrice / 1000).toFixed(0)}k ريال
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">اختر العقارات للمقارنة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {customer.properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد عقارات للمقارنة
            </div>
          ) : (
            customer.properties.map((property) => {
              const matchScore = getMatchScore(property);
              return (
                <div
                  key={property.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedProperties.includes(property.id)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={() => toggleProperty(property.id)}
                    disabled={
                      selectedProperties.length >= 4 &&
                      !selectedProperties.includes(property.id)
                    }
                  />
                  
                  {property.propertyImage && (
                    <div
                      className="w-16 h-16 rounded bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${property.propertyImage})` }}
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm truncate">
                      {property.propertyTitle}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      {property.propertyLocation && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.propertyLocation}
                        </span>
                      )}
                      {property.propertyPrice && (
                        <span className="text-xs font-bold text-green-600">
                          {(property.propertyPrice / 1000).toFixed(0)}k ريال
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={`${getScoreColor(matchScore)} text-xs`}>
                    {matchScore}%
                  </Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedPropertyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">جدول المقارنة</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-semibold sticky right-0 bg-white dark:bg-gray-900">
                    المعيار
                  </th>
                  {selectedPropertyData.map((property) => (
                    <th key={property.id} className="p-3 min-w-[150px]">
                      <div className="space-y-2">
                        {property.propertyImage && (
                          <div
                            className="w-full h-20 rounded bg-cover bg-center"
                            style={{ backgroundImage: `url(${property.propertyImage})` }}
                          />
                        )}
                        <div className="font-semibold text-sm line-clamp-2">
                          {property.propertyTitle}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <tr 
                      key={feature.id}
                      className={`border-b ${feature.isHighlight ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}
                    >
                      <td className="p-3 font-medium sticky right-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-600" />
                          {feature.label}
                        </div>
                      </td>
                      {selectedPropertyData.map((property) => {
                        const value = feature.getValue(property);
                        return (
                          <td key={property.id} className="p-3 text-center">
                            {typeof value === "boolean" ? (
                              value ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-600 mx-auto" />
                              )
                            ) : (
                              <span className={feature.isHighlight ? "font-bold" : ""}>
                                {value}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                
                {/* Match Score Row */}
                <tr className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 font-bold">
                  <td className="p-3 sticky right-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      نسبة المطابقة
                    </div>
                  </td>
                  {selectedPropertyData.map((property) => {
                    const score = getMatchScore(property);
                    return (
                      <td key={property.id} className="p-3 text-center">
                        <Badge className={`${getScoreColor(score)}`}>
                          {score}%
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Feedback Summary */}
      {selectedPropertyData.some(p => p.feedback) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              ملاحظات العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedPropertyData
              .filter(p => p.feedback)
              .map((property) => (
                <div key={property.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="font-semibold text-sm mb-1">{property.propertyTitle}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {property.feedback}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {selectedPropertyData.length > 0 && (
        <div className="flex items-center gap-3">
          <Button className="flex-1 gap-2">
            <MessageSquare className="h-4 w-4" />
            إرسال المقارنة للعميل
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      )}
    </div>
  );
}
