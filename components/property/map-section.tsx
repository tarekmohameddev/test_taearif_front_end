"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

export function MapSection({ onLocationUpdate }) {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markerRef = useRef(null); // إضافة ref للعلامة

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey:
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE",
        version: "weekly",
        libraries: ["places"],
        language: "ar",
        region: "SA",
      });

      try {
        await loader.load();

        const g = window.google;
        if (!g || !mapRef.current) return;

        const mapInstance = new g.maps.Map(mapRef.current, {
          center: { lat: 24.766316905850978, lng: 46.73579692840576 },
          zoom: 13,
          mapTypeId: g.maps.MapTypeId.SATELLITE,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        setMap(mapInstance);
        setIsMapLoaded(true);

        // Add click listener to map
        mapInstance.addListener("click", (event) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateLocation(lat, lng, mapInstance);
          }
        });

        // Initialize search box
        if (searchInputRef.current) {
          const searchBoxInstance = new g.maps.places.SearchBox(
            searchInputRef.current,
          );
          setSearchBox(searchBoxInstance);

          mapInstance.addListener("bounds_changed", () => {
            searchBoxInstance.setBounds(mapInstance.getBounds());
          });

          searchBoxInstance.addListener("places_changed", () => {
            const places = searchBoxInstance.getPlaces();
            if (places && places.length > 0) {
              const place = places[0];
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                updateLocation(lat, lng, mapInstance);

                const address = place.formatted_address || "";
                onLocationUpdate(lat, lng, address);

                mapInstance.setCenter(place.geometry.location);
                mapInstance.setZoom(17);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []); // إزالة onLocationUpdate من dependencies

  const updateLocation = (lat, lng, mapInstance) => {
    // إزالة العلامة القديمة إذا كانت موجودة
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    // إنشاء علامة جديدة
    const newMarker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      draggable: true,
      title: "موقع الوحدة",
      animation: window.google.maps.Animation.DROP,
    });

    // إضافة مستمع للسحب
    newMarker.addListener("dragend", (event) => {
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        reverseGeocode(newLat, newLng);
      }
    });

    // حفظ العلامة في الـ ref والـ state
    markerRef.current = newMarker;
    setMarker(newMarker);

    // الحصول على العنوان وتحديث البيانات
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        onLocationUpdate(lat, lng, address);
      } else {
        onLocationUpdate(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          updateLocation(lat, lng, map);
          map.setCenter({ lat, lng });
          map.setZoom(17);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("غير قادر على الحصول على موقعك الحالي");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      alert("المتصفح لا يدعم تحديد الموقع الجغرافي");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>اختر موقع الوحدة</CardTitle>
        <CardDescription>
          ابحث عن عنوان أو انقر على الخريطة لتحديد الموقع بدقة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="ابحث عن عنوان..."
            className="pl-10"
          />
        </div>

        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          استخدم الموقع الحالي
        </Button>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border bg-muted"
          />
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  جاري تحميل الخريطة...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
          <p>• انقر في أي مكان على الخريطة لتحديد موقع الوحدة</p>
          <p>• استخدم مربع البحث للعثور على عنوان محدد</p>
          <p>• اسحب العلامة لضبط الموقع بدقة</p>
        </div>

        {/* Debug Info */}
        {marker && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200">
            <p>العلامة موجودة: ✅</p>
            <p>حالة الخريطة: {isMapLoaded ? "محملة" : "غير محملة"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
