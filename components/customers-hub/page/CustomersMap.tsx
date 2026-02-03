"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStageColor, getStageNameAr, LIFECYCLE_STAGES, type CustomerLifecycleStage } from "@/types/unified-customer";
import { MapPin, Phone, Mail, Calendar, Maximize2, Minimize2, Search, Filter, X, Navigation, Layers } from "lucide-react";
import Link from "next/link";
import type { Map as LeafletMap, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Default coordinates for Saudi Arabia (Riyadh center)
const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];
const DEFAULT_ZOOM = 6;

// Map styles
const MAP_STYLES = [
  {
    id: "default",
    name: "افتراضي",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    id: "satellite",
    name: "قمر صناعي",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  {
    id: "dark",
    name: "داكن",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  },
];

// Map control component to fly to location
const FlyToLocation = dynamic(
  () =>
    Promise.resolve(({ center, zoom }: { center: [number, number]; zoom: number }) => {
      // @ts-ignore
      const { useMap } = require("react-leaflet");
      const map = useMap();

      useEffect(() => {
        map.flyTo(center, zoom, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }, [map, center, zoom]);

      return null;
    }),
  { ssr: false }
);

// Create custom marker icon based on stage
const createCustomIcon = (stage: CustomerLifecycleStage, isSelected: boolean): DivIcon => {
  if (typeof window === "undefined") return null as any;
  
  const L = require("leaflet");
  const color = getStageColor(stage);
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative;
        transform: translate(-50%, -100%);
      ">
        <div style="
          width: ${isSelected ? '40px' : '30px'};
          height: ${isSelected ? '40px' : '30px'};
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          transition: all 0.3s ease;
          animation: ${isSelected ? 'pulse 1.5s ease-in-out infinite' : 'none'};
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            color: white;
            font-size: ${isSelected ? '16px' : '12px'};
            font-weight: bold;
          ">📍</div>
        </div>
      </div>
    `,
    iconSize: [isSelected ? 40 : 30, isSelected ? 40 : 30],
    iconAnchor: [isSelected ? 20 : 15, isSelected ? 40 : 30],
  });
};

export function CustomersMap() {
  const { filteredCustomers } = useUnifiedCustomersStore();
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedStages, setSelectedStages] = useState<CustomerLifecycleStage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0]);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  // Filter customers by search and stage
  const customersWithLocation = filteredCustomers.filter((customer) => {
    if (!customer.latitude || !customer.longitude) return false;
    
    // Filter by stage
    if (selectedStages.length > 0 && !selectedStages.includes(customer.stage)) {
      return false;
    }
    
    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(search) ||
        customer.nameEn?.toLowerCase().includes(search) ||
        customer.phone.includes(search) ||
        customer.city?.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Fix for Leaflet default icon issue in Next.js
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
      
      // Add pulse animation
      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .custom-marker {
          z-index: 1000 !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Toggle stage filter
  const toggleStageFilter = (stage: CustomerLifecycleStage) => {
    setSelectedStages((prev) =>
      prev.includes(stage)
        ? prev.filter((s) => s !== stage)
        : [...prev, stage]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStages([]);
    setSearchTerm("");
  };

  // Fly to customer location
  const flyToCustomer = (lat: number, lng: number, customerId: string) => {
    setMapCenter([lat, lng]);
    setMapZoom(14);
    setSelectedCustomerId(customerId);
  };

  // Calculate statistics
  const stageStats = LIFECYCLE_STAGES.map((stage) => ({
    ...stage,
    count: customersWithLocation.filter((c) => c.stage === stage.id).length,
  }));

  if (!isClient) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="text-gray-500">جاري تحميل الخريطة...</div>
      </Card>
    );
  }

  if (filteredCustomers.filter(c => c.latitude && c.longitude).length === 0) {
    return (
      <Card className="w-full h-[600px] flex flex-col items-center justify-center gap-4">
        <MapPin className="h-16 w-16 text-gray-300" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            لا توجد بيانات موقع للعملاء
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            يرجى إضافة إحداثيات الموقع للعملاء لعرضهم على الخريطة
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4" : "relative"}`}>
      <div className={`flex gap-4 ${isFullscreen ? "h-full" : "h-[700px]"}`}>
        {/* Sidebar with Filters and Customer List */}
        <Card className="w-80 overflow-hidden flex flex-col">
          <div className="p-4 border-b space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="بحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              فلترة حسب المرحلة
              {selectedStages.length > 0 && (
                <Badge variant="secondary" className="mr-auto">
                  {selectedStages.length}
                </Badge>
              )}
            </Button>

            {/* Stage Filters */}
            {showFilters && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stageStats.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => toggleStageFilter(stage.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                      selectedStages.includes(stage.id)
                        ? "border-2"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: selectedStages.includes(stage.id)
                        ? stage.color
                        : undefined,
                      backgroundColor: selectedStages.includes(stage.id)
                        ? `${stage.color}10`
                        : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm">{stage.nameAr}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stage.count}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {/* Clear Filters */}
            {(selectedStages.length > 0 || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 ml-1" />
                مسح الفلاتر
              </Button>
            )}
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {customersWithLocation.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">لا توجد نتائج</p>
                </div>
              ) : (
                customersWithLocation.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() =>
                      flyToCustomer(customer.latitude!, customer.longitude!, customer.id)
                    }
                    className={`w-full text-right p-3 rounded-lg border transition-all ${
                      selectedCustomerId === customer.id
                        ? "border-2 border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {customer.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {customer.city} - {customer.district}
                        </p>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: getStageColor(customer.stage),
                          color: "white",
                        }}
                        className="text-xs shrink-0"
                      >
                        {getStageNameAr(customer.stage)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStageColor(customer.stage) }}
                      />
                      <span className="text-xs text-gray-600">
                        {getStageNameAr(customer.stage)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="p-4 border-t bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {customersWithLocation.length}
              </div>
              <div className="text-xs text-gray-600">عميل على الخريطة</div>
            </div>
          </div>
        </Card>

        {/* Map */}
        <Card className={`flex-1 overflow-hidden relative`}>
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            {/* Style Picker */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md"
                onClick={() => setShowStylePicker(!showStylePicker)}
              >
                <Layers className="h-4 w-4" />
              </Button>
              {showStylePicker && (
                <Card className="absolute top-12 right-0 p-2 w-32 shadow-lg">
                  {MAP_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setMapStyle(style);
                        setShowStylePicker(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded text-sm hover:bg-gray-100 ${
                        mapStyle.id === style.id ? "bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </Card>
              )}
            </div>

            {/* Reset View */}
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-md"
              onClick={() => {
                setMapCenter(DEFAULT_CENTER);
                setMapZoom(DEFAULT_ZOOM);
                setSelectedCustomerId(null);
              }}
              title="إعادة تعيين العرض"
            >
              <Navigation className="h-4 w-4" />
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-md"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Map Container */}
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            ref={mapRef}
          >
            <FlyToLocation center={mapCenter} zoom={mapZoom} />
            
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url={mapStyle.url}
            />

            {customersWithLocation.map((customer) => (
            <Marker
              key={customer.id}
              position={[customer.latitude!, customer.longitude!]}
              icon={createCustomIcon(customer.stage, selectedCustomerId === customer.id)}
              eventHandlers={{
                click: () => {
                  setSelectedCustomerId(customer.id);
                },
              }}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-2" dir="rtl">
                  {/* Customer Name */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-base">{customer.name}</h3>
                      {customer.nameEn && (
                        <p className="text-xs text-gray-500">{customer.nameEn}</p>
                      )}
                    </div>
                    <Badge
                      style={{
                        backgroundColor: getStageColor(customer.stage),
                        color: "white",
                      }}
                      className="text-xs"
                    >
                      {getStageNameAr(customer.stage)}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-3 text-sm">
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-blue-600 hover:underline"
                          dir="ltr"
                        >
                          {customer.phone}
                        </a>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {customer.email}
                        </a>
                      </div>
                    )}
                    {customer.district && customer.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700">
                          {customer.city} - {customer.district}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Property Preferences */}
                  {customer.preferences && (
                    <div className="mb-3 text-xs">
                      <div className="text-gray-600 mb-1">الاهتمامات:</div>
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences.propertyType.slice(0, 3).map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      {customer.preferences.budgetMin && (
                        <div className="mt-1 text-gray-600">
                          الميزانية:{" "}
                          {(customer.preferences.budgetMin / 1000).toFixed(0)}k -{" "}
                          {customer.preferences.budgetMax
                            ? (customer.preferences.budgetMax / 1000).toFixed(0) + "k"
                            : "مفتوح"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next Follow-up */}
                  {customer.nextFollowUpDate && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Calendar className="h-3 w-3" />
                        <span>
                          متابعة:{" "}
                          {new Date(customer.nextFollowUpDate).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
                    <Button className="w-full" size="sm">
                      عرض التفاصيل الكاملة
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
            ))}
          </MapContainer>
        </Card>
      </div>
    </div>
  );
}
