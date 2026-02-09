"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Bath, Bed, Ruler, MapPin, Eye, Heart, Share2, Search, Loader2, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Property {
  id: string | number;
  title: string;
  address: string;
  price: number;
  thumbnail?: string;
  featured_image?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  listingType?: string;
  transaction_type?: string;
  status?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  latitude?: number;
  longitude?: number;
}

interface PropertiesMapViewProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onToggleFavorite?: (propertyId: string | number) => void;
  onShare?: (property: Property) => void;
  favorites?: (string | number)[];
}

export function PropertiesMapView({
  properties,
  onPropertyClick,
  onToggleFavorite,
  onShare,
  favorites = [],
}: PropertiesMapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const markerClusterRef = useRef<any>(null);
  const router = useRouter();
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | number | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [boundsSet, setBoundsSet] = useState(false);

  // Filter properties with valid coordinates
  const propertiesWithCoords = useMemo(() => {
    const validProperties = properties.filter((property) => {
      const lat = property.location?.latitude || property.latitude;
      const lng = property.location?.longitude || property.longitude;
      const isValid = lat && lng && !isNaN(lat) && !isNaN(lng);
      
      if (!isValid) {
        console.log(`Property ${property.id} filtered out - invalid coords:`, { 
          lat, 
          lng, 
          location: property.location 
        });
      }
      
      return isValid;
    });
    
    console.log(`Map View: ${validProperties.length} properties with valid coordinates out of ${properties.length} total`);
    return validProperties;
  }, [properties]);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current || mapRef.current) {
      return;
    }

    try {
      // Fix Leaflet icon issues
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      L.Marker.prototype.options.icon = DefaultIcon;

      // Initialize map - centered on Riyadh by default
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([24.7136, 46.6753], 12);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapRef.current = map;
      setMapInitialized(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
        setMapInitialized(false);
      }
    };
  }, []);

  // Create custom icon for property markers
  const createCustomIcon = useCallback((property: Property, isHovered: boolean = false) => {
    const price = new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price || 0);

    // Format price more compactly
    let displayPrice = price;
    
    // Remove currency symbol for cleaner display
    displayPrice = displayPrice.replace(/\s*ر\.س\.?\s*/g, ' ');
    
    // Further shorten large numbers
    if (property.price >= 1000000) {
      displayPrice = (property.price / 1000000).toFixed(1) + 'M';
    } else if (property.price >= 1000) {
      displayPrice = (property.price / 1000).toFixed(0) + 'K';
    }

    const iconHtml = `
      <div class="property-marker-wrapper" style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div class="property-marker ${isHovered ? 'hovered' : ''}" style="
          background: ${isHovered ? '#1a1a1a' : 'white'};
          color: ${isHovered ? 'white' : '#1a1a1a'};
          padding: 7px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
          border: 2px solid ${isHovered ? '#1a1a1a' : '#d1d5db'};
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: ${isHovered ? 'scale(1.15)' : 'scale(1)'};
          display: inline-block;
          line-height: 1.2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        ">
          ${displayPrice}
        </div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: "custom-marker-icon",
      iconSize: undefined,
      iconAnchor: undefined,
    });
  }, []);

  // Create markers only when properties change
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (propertiesWithCoords.length === 0) {
      setBoundsSet(false);
      return;
    }

    const bounds = L.latLngBounds([]);

    console.log(`Creating ${propertiesWithCoords.length} markers on map...`);

    // Add markers for each property
    propertiesWithCoords.forEach((property, index) => {
      const lat = property.location?.latitude || property.latitude;
      const lng = property.location?.longitude || property.longitude;

      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.warn(`Property ${property.id} has invalid coordinates:`, { lat, lng });
        return;
      }

      console.log(`Marker ${index + 1}: Property ${property.id} at [${lat}, ${lng}] - ${property.title}`);

      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(property, false),
      });

      // Store property reference with marker
      (marker as any).propertyId = property.id;

      marker.on("click", () => {
        setSelectedProperty(property);
      });

      marker.on("mouseover", () => {
        setHoveredProperty(property.id);
      });

      marker.on("mouseout", () => {
        setHoveredProperty(null);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
      bounds.extend([lat, lng]);
    });

    // Fit map to bounds only once on initial load
    if (bounds.isValid() && !boundsSet) {
      mapRef.current.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 13
      });
      setBoundsSet(true);
    }
  }, [propertiesWithCoords, mapInitialized, createCustomIcon, boundsSet]);

  // Update marker icons when hover state changes (without recreating markers)
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    markersRef.current.forEach((marker) => {
      const propertyId = (marker as any).propertyId;
      const property = propertiesWithCoords.find(p => p.id === propertyId);
      
      if (property) {
        const isHovered = hoveredProperty === property.id;
        marker.setIcon(createCustomIcon(property, isHovered));
      }
    });
  }, [hoveredProperty, propertiesWithCoords, mapInitialized, createCustomIcon]);

  const handleCardClick = (property: Property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    } else {
      router.push(`/dashboard/properties/${property.id}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=sa`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = Number.parseFloat(lat);
        const longitude = Number.parseFloat(lon);

        mapRef.current.setView([latitude, longitude], 14);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] gap-0 relative">
      {/* Properties List Sidebar */}
      <div 
        className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-full lg:w-[450px] flex-shrink-0 border-l
          transition-transform duration-300 ease-in-out
          absolute lg:relative inset-y-0 right-0 bg-background z-20 lg:z-0
        `}
      >
        <div className="p-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowSidebar(false)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <h3 className="font-semibold text-lg">الوحدات على الخريطة</h3>
            </div>
            <Badge variant="secondary" className="text-sm">
              {propertiesWithCoords.length} وحدة
            </Badge>
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-4 space-y-4">
            {propertiesWithCoords.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد وحدات بإحداثيات</h3>
                <p className="text-sm text-muted-foreground">
                  تحتاج الوحدات إلى إحداثيات صحيحة لعرضها على الخريطة
                </p>
              </div>
            ) : (
              propertiesWithCoords.map((property) => {
                const isFavorite = favorites.includes(property.id);
                const thumbnail = property.thumbnail || property.featured_image;
                const isHovered = hoveredProperty === property.id;
                const isSelected = selectedProperty?.id === property.id;

                return (
                  <Card
                    key={property.id}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      isHovered || isSelected ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                    onMouseEnter={() => setHoveredProperty(property.id)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    onClick={() => handleCardClick(property)}
                  >
                    <div className="flex gap-3 p-3">
                      {/* Property Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Home className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-1 left-1">
                          <Badge
                            variant={
                              property.listingType === "للبيع" ||
                              property.transaction_type === "sale"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs shadow-sm"
                          >
                            {property.listingType ||
                              (property.transaction_type === "sale" ? "للبيع" : "للإيجار")}
                          </Badge>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {property.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{property.address}</span>
                        </p>

                        {/* Property Features */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          {property.bedrooms && (
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-3 w-3" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          {property.size && (
                            <div className="flex items-center gap-1">
                              <Ruler className="h-3 w-3" />
                              <span>{property.size} م²</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-primary">
                            {formatPrice(property.price)}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {onToggleFavorite && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(property.id);
                                }}
                              >
                                <Heart
                                  className={`h-3.5 w-3.5 ${
                                    isFavorite ? "fill-red-500 text-red-500" : ""
                                  }`}
                                />
                              </Button>
                            )}
                            {onShare && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShare(property);
                                }}
                              >
                                <Share2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/properties/${property.id}`);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Toggle Sidebar Button (Mobile) */}
        {!showSidebar && (
          <Button
            className="absolute top-4 right-4 z-[999] shadow-lg lg:hidden"
            onClick={() => setShowSidebar(true)}
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        {/* Search Box */}
        <div className="absolute top-4 left-4 right-20 lg:right-4 z-[1000] max-w-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="ابحث عن موقع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white shadow-lg border-0"
                dir="rtl"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isSearching}
              className="shadow-lg"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
        
        {/* Show List Button (Mobile) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[999] lg:hidden">
          <Button
            className="shadow-xl bg-background text-foreground hover:bg-background/90 border"
            onClick={() => setShowSidebar(true)}
          >
            <MapPin className="h-4 w-4 ml-2" />
            عرض القائمة ({propertiesWithCoords.length})
          </Button>
        </div>

        {!mapInitialized && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
            </div>
          </div>
        )}

        {/* Property Details Popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 lg:top-20 left-4 right-4 z-[1000] max-w-sm mx-auto">
            <Card className="shadow-xl animate-in slide-in-from-bottom-4 duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge
                    variant={
                      selectedProperty.listingType === "للبيع" ||
                      selectedProperty.transaction_type === "sale"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedProperty.listingType ||
                      (selectedProperty.transaction_type === "sale" ? "للبيع" : "للإيجار")}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setSelectedProperty(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {(selectedProperty.thumbnail || selectedProperty.featured_image) ? (
                      <img
                        src={selectedProperty.thumbnail || selectedProperty.featured_image}
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedProperty.address}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(selectedProperty.price)}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full mt-3"
                  size="sm"
                  onClick={() => handleCardClick(selectedProperty)}
                >
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-marker-icon {
          background: transparent !important;
          border: none !important;
          overflow: visible !important;
        }
        
        .property-marker {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          user-select: none;
          overflow: visible !important;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        
        .property-marker:hover {
          transform: scale(1.15) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
          z-index: 1000 !important;
        }

        .property-marker.hovered {
          z-index: 1001 !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35) !important;
        }

        /* Ensure Leaflet doesn't clip the markers */
        .leaflet-marker-icon {
          overflow: visible !important;
        }

        /* Hide leaflet attribution on mobile */
        @media (max-width: 768px) {
          .leaflet-control-attribution {
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
}
