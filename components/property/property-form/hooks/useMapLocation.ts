import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import loader from "@/lib/googleMapsLoader";
import type { FormData } from "../types/propertyForm.types";

export const useMapLocation = (
  formData: FormData,
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void,
) => {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchBox, setSearchBox] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleLocationUpdate = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address,
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation || !map || !marker) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        marker.setPosition({ lat, lng });
        map.setCenter({ lat, lng });
        map.setZoom(17);

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("غير قادر على الحصول على موقعك الحالي");
      },
    );
  };

  const reverseGeocode = (lat: number, lng: number, geocoder: any) => {
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status === "OK" && results && results[0]) {
        setFormData((prev) => ({
          ...prev,
          address: results[0].formatted_address,
        }));
      }
    });
  };

  const updateLocation = (lat: number, lng: number, mapInstance: any, geocoder: any) => {
    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new (window as any).google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      draggable: true,
      title: "Property Location",
    });

    // Add drag listener to marker
    newMarker.addListener("dragend", (event: any) => {
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        setFormData((prev) => ({
          ...prev,
          latitude: newLat,
          longitude: newLng,
        }));
        reverseGeocode(newLat, newLng, geocoder);
      }
    });

    setMarker(newMarker);
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    // Reverse geocode to get address
    reverseGeocode(lat, lng, geocoder);
  };

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        const google = await loader.load();

        if (!mounted || !mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: {
            lat: parseFloat(String(formData.latitude)) || 24.766316905850978,
            lng: parseFloat(String(formData.longitude)) || 46.73579692840576,
          },
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Create marker
        const newMarker = new google.maps.Marker({
          position: {
            lat: parseFloat(String(formData.latitude)) || 24.766316905850978,
            lng: parseFloat(String(formData.longitude)) || 46.73579692840576,
          },
          map: mapInstance,
          draggable: true,
        });

        // Add marker drag event
        newMarker.addListener("dragend", (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        });

        // Initialize search box if search input exists
        if (searchInputRef.current) {
          const searchBoxInstance = new google.maps.places.SearchBox(
            searchInputRef.current,
          );
          setSearchBox(searchBoxInstance);

          searchBoxInstance.addListener("places_changed", () => {
            const places = searchBoxInstance.getPlaces();
            if (places && places.length > 0) {
              const place = places[0];
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                newMarker.setPosition({ lat, lng });
                mapInstance.setCenter({ lat, lng });
                mapInstance.setZoom(17);

                setFormData((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                  address: place.formatted_address || "",
                }));
              }
            }
          });
        }

        setMap(mapInstance);
        setMarker(newMarker);
        setIsMapLoaded(true);
      } catch (error) {
        console.error("Error loading map:", error);
        toast.error("حدث خطأ أثناء تحميل الخريطة");
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [formData.latitude, formData.longitude]);

  return {
    map,
    marker,
    searchBox,
    isMapLoaded,
    searchInputRef,
    mapRef,
    handleLocationUpdate,
    getCurrentLocation,
    updateLocation,
    reverseGeocode,
  };
};
