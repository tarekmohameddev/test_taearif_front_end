"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapSection } from "@/components/property/map-section";
import { LocationCard as LocationCardComponent } from "@/components/property/location-card";
import { usePropertyFormStore } from "@/context/store/dashboard/properties/propertyForm";

interface LocationCardProps {
  formData: { latitude: number; longitude: number; address: string };
  isDraft: boolean;
  missingFields: string[];
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
  cardHasMissingFields: (fields: string[]) => boolean;
}

export default function LocationCard({
  formData,
  isDraft,
  missingFields,
  onLocationUpdate,
  cardHasMissingFields,
}: LocationCardProps) {
  const isOpen = usePropertyFormStore((state) => state.isLocationOpen);
  const setIsOpen = usePropertyFormStore((state) => state.setIsLocationOpen);
  const fullFormData = usePropertyFormStore((state) => state.formData);
  
  // Create PropertyData object for LocationCardComponent
  const propertyData = {
    title: fullFormData.title || "",
    description: fullFormData.description || "",
    price: fullFormData.price || "",
    propertyType: fullFormData.PropertyType || "",
    bedrooms: fullFormData.bedrooms || "",
    bathrooms: fullFormData.bathrooms || "",
    address: fullFormData.address || "",
    latitude: fullFormData.latitude || null,
    longitude: fullFormData.longitude || null,
  };

  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                موقع الوحدة
              </CardTitle>
              {isDraft && cardHasMissingFields(["city_id"]) && (
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-800 border-orange-300"
                >
                  حقول مطلوبة
                </Badge>
              )}
            </div>
            <CardDescription>
              اختر موقع الوحدة على الخريطة وعرض تفاصيل الموقع
            </CardDescription>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="space-y-6 pt-6">
              {/* Map Section Content */}
              <MapSection onLocationUpdate={onLocationUpdate} hideHeader={true} />
              {/* Location Details */}
              <LocationCardComponent propertyData={propertyData} hideHeader={true} />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
