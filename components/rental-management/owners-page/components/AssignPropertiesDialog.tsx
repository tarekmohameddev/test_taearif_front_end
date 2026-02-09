"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  AlertCircle,
  Building2,
  Link2,
  CheckCircle2,
} from "lucide-react";
import { Owner, Property } from "../types/owners.types";

interface AssignPropertiesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  availableProperties: Property[];
  loading: boolean;
  selectedPropertyIds: number[];
  onToggleProperty: (propertyId: number) => void;
  onAssign: () => void;
  assigning: boolean;
  error: string | null;
}

export function AssignPropertiesDialog({
  isOpen,
  onClose,
  owner,
  availableProperties,
  loading,
  selectedPropertyIds,
  onToggleProperty,
  onAssign,
  assigning,
  error,
}: AssignPropertiesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = availableProperties.filter(
    (property: Property) =>
      property.id?.toString().includes(searchTerm) ||
      property.price?.toString().includes(searchTerm) ||
      property.beds?.toString().includes(searchTerm),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            ربط عقارات بالمالك
          </DialogTitle>
          <DialogDescription>
            {owner && (
              <span>
                ربط عقارات بـ <strong>{owner.name}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Properties */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن عقار (رقم العقار، السعر، عدد الغرف...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected Count */}
          {selectedPropertyIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-5 w-5" />
              <span>تم اختيار {selectedPropertyIds.length} عقار</span>
            </div>
          )}

          {/* Properties List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد عقارات
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "لم يتم العثور على عقارات مطابقة للبحث"
                    : "لا توجد عقارات متاحة حالياً"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {filteredProperties.map((property: Property) => {
                  const isSelected = selectedPropertyIds.includes(property.id);
                  return (
                    <div
                      key={property.id}
                      onClick={() => onToggleProperty(property.id)}
                      className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}

                      {/* Property Image */}
                      {property.featured_image_url && (
                        <img
                          src={property.featured_image_url}
                          alt={`عقار ${property.id}`}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                      )}

                      {/* Property Info */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-gray-900">
                            عقار #{property.id}
                          </span>
                          {property.price && (
                            <span className="text-blue-600 font-bold text-sm">
                              {property.price} ريال
                            </span>
                          )}
                        </div>

                        {(property.beds || property.bath) && (
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            {property.beds && <span>{property.beds} غرف</span>}
                            {property.beds && property.bath && <span>•</span>}
                            {property.bath && <span>{property.bath} حمام</span>}
                          </div>
                        )}

                        {property.area && (
                          <div className="text-xs text-gray-500">
                            المساحة: {property.area} م²
                          </div>
                        )}

                        {property.property_status && (
                          <Badge
                            className={`text-xs ${
                              property.property_status === "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {property.property_status === "available"
                              ? "متاح"
                              : property.property_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={onClose} variant="outline" disabled={assigning}>
            إلغاء
          </Button>
          <Button
            onClick={onAssign}
            disabled={assigning || selectedPropertyIds.length === 0}
            className="gap-2"
          >
            {assigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الربط...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                ربط العقارات ({selectedPropertyIds.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
