"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@googlemaps/js-api-loader";
import { MapSection } from "@/components/property/map-section";
import { LocationCard } from "@/components/property/location-card";
import {
  Upload,
  X,
  Loader2,
  ImageIcon,
  Plus,
  Minus,
  MapPin,
  Video,
  Globe,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { uploadMultipleFiles } from "@/utils/uploadMultiple";

// دالة رفع الفيديوهات
const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("context", "property");
  formData.append("video", file);

  try {
    console.log("Uploading video:", file.name, "Size:", file.size);
    const response = await axiosInstance.post("/video/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Video upload response:", response.data);

    if (
      response.data &&
      response.data.status === "success" &&
      response.data.data
    ) {
      return response.data.data;
    } else {
      console.error("Unexpected response structure:", response.data);
      throw new Error("Unexpected response structure from video upload API");
    }
  } catch (error) {
    console.error("Video upload error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import { PropertyCounter } from "@/components/property/propertyCOMP/property-counter";
import { ChevronLeft, HelpCircle, Eye, EyeOff, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import loader from "@/lib/googleMapsLoader";
import {
  PropertyFormHeader,
  BasicInfoCard,
  ThumbnailCard,
  GalleryCard,
  VideoCard,
  FloorPlansCard,
  VirtualTourCard,
  LocationCard as PropertyLocationCard,
  FAQsCard,
  OwnerDetailsCard,
  PropertyDetailsCard,
} from "./property-form/components";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted rounded-md z-[-1]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
      </div>
    </div>
  ),
});

/**
 * @typedef {Object} PropertyFormProps
 * @property {'add' | 'edit'} mode
 * @property {boolean} [isDraft] - Whether this is a draft/incomplete property
 */

/**
 * @param {PropertyFormProps} props
 */
export default function PropertyForm({ mode, isDraft = false }) {
  const {
    homepage: { setupProgressData, fetchSetupProgressData },
  } = useStore();
  const {
    propertiesManagement: { properties, loading, isInitialized },
    setPropertiesManagement,
    fetchProperties,
  } = useStore();
  const [submitError, setSubmitError] = useState(null);
  const { userData, fetchUserData, IsLoading: authLoading } = useAuthStore();
  const { checkPermission } = useUserStore();
  const router = useRouter();
  
  // Check if user can access archive/owner details tab
  const canAccessArchive = userData?.account_type === "tenant" || checkPermission("properties.owner_deed");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(
    mode === "edit" && id ? true : false
  );
  let hasReachedLimit;
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [suggestedFaqsList, setSuggestedFaqsList] = useState([]);
  const [marker, setMarker] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    building_id: "",
    water_meter_number: "",
    electricity_meter_number: "",
    deed_number: "",
    price: "",
    category: "",
    project_id: "",
    purpose: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    features: [],
    status: "draft",
    featured: true,
    latitude: 24.766316905850978,
    longitude: 46.73579692840576,
    city_id: null,
    district_id: null,
    rooms: "",
    floors: "",
    floor_number: "",
    driver_room: "",
    maid_room: "",
    dining_room: "",
    living_room: "",
    majlis: "",
    storage_room: "",
    basement: "",
    swimming_pool: "",
    kitchen: "",
    balcony: "",
    garden: "",
    annex: "",
    elevator: "",
    private_parking: "",
    facade_id: "",
    length: "",
    width: "",
    street_width_north: "",
    street_width_south: "",
    street_width_east: "",
    street_width_west: "",
    building_age: "",
    payment_method: "",
    pricePerMeter: "",
    PropertyType: "",
    advertising_license: "",
    owner_number: "",
    video_url: "",
    virtual_tour: "",
  });

  const [currentFeature, setCurrentFeature] = useState("");
  const [errors, setErrors] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [missingFieldsAr, setMissingFieldsAr] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isCompletingDraft, setIsCompletingDraft] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isFloorPlansOpen, setIsFloorPlansOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);
  const [isOwnerDetailsOpen, setIsOwnerDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // "form" or "owner"
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [images, setImages] = useState({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
  });
  const [previews, setPreviews] = useState({
    thumbnail: null,
    gallery: [],
    floorPlans: [],
    deedImage: null,
  });
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [facades, setFacades] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const thumbnailInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const floorPlansInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const deedImageInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleLocationUpdate = (lat, lng, address) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address,
    }));
  };

  const validateUrl = (value, name) => {
    try {
      new URL(value); // Validate URL format
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch {
      setErrors((prev) => ({ ...prev, [name]: "الرجاء إدخال رابط صحيح" }));
    }
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate URL format if not empty
    if (value.trim()) {
      validateUrl(value, name);
    }
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

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        const google = await loader.load();

        if (!mounted || !mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: {
            lat: parseFloat(formData.latitude) || 24.766316905850978,
            lng: parseFloat(formData.longitude) || 46.73579692840576,
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
            lat: parseFloat(formData.latitude) || 24.766316905850978,
            lng: parseFloat(formData.longitude) || 46.73579692840576,
          },
          map: mapInstance,
          draggable: true,
        });

        // Add marker drag event
        newMarker.addListener("dragend", (event) => {
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

  const updateLocation = (lat, lng, mapInstance) => {
    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      draggable: true,
      title: "Property Location",
    });

    // Add drag listener to marker
    newMarker.addListener("dragend", (event) => {
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        setPropertyData((prev) => ({
          ...prev,
          latitude: newLat,
          longitude: newLng,
        }));
        reverseGeocode(newLat, newLng);
      }
    });

    setMarker(newMarker);
    setPropertyData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    // Reverse geocode to get address
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = (lat, lng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setPropertyData((prev) => ({
          ...prev,
          address: results[0].formatted_address,
        }));
      }
    });
  };
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    const fetchSuggestedFaqs = async () => {
      try {
        const response = await axiosInstance.get("/property-faqs");
        setSuggestedFaqsList(response.data.data.suggestedFaqs || []);
      } catch (error) {}
    };
    fetchSuggestedFaqs();
  }, [userData?.token, authLoading]);
  // تحديث useEffect لجلب بيانات الوحدة للتعديل

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    if (mode === "edit" && id) {
      const fetchProperty = async () => {
        setLoadingProperty(true);
        try {
          // Use different endpoint for draft properties
          const endpoint = isDraft 
            ? `/properties/drafts/${id}` 
            : `/properties/${id}`;
          const response = await axiosInstance.get(endpoint);
          const property = isDraft 
            ? response.data.data 
            : response.data.data.property;
          
          // Set missing fields and validation errors for drafts
          if (isDraft) {
            setMissingFields(property.missing_fields || []);
            setMissingFieldsAr(property.missing_fields_ar || []);
            setValidationErrors(property.validation_errors || []);
          }
          const projectsResponse = await axiosInstance.get("/user/projects");
          const projects = projectsResponse.data.data.user_projects;
          setProjects(projects);

          const matchedProject = projects.find(
            (p) => p.id === property.project_id,
          );

          // Extract data from different structures for draft vs regular property
          let title, address, description, cityId, districtId;
          if (isDraft && property.contents && property.contents.length > 0) {
            // Draft API structure: data is in contents[0]
            const content = property.contents[0];
            title = content.title || "";
            address = content.address || "";
            description = content.description || "";
            cityId = content.city_id || property.city_id || null;
            districtId = content.state_id || property.state_id || null;
          } else {
            // Regular property API structure
            title = property.title || "";
            address = property.address || "";
            description = property.description || "";
            cityId = property.city_id || null;
            districtId = property.state_id || null;
          }

          // Extract characteristics data for draft
          let characteristics = {};
          if (isDraft && property.user_property_characteristics) {
            characteristics = property.user_property_characteristics;
          } else if (!isDraft) {
            // For regular properties, characteristics might be in property directly
            characteristics = property;
          }

          // معالجة الميزات
          let featuresArray = [];
          if (property.features) {
            if (typeof property.features === "string") {
              featuresArray = property.features
                .split(",")
                .map((feature) => feature.trim())
                .filter((feature) => feature.length > 0);
            } else if (Array.isArray(property.features)) {
              featuresArray = property.features;
            }
          }
          if (property.faqs && Array.isArray(property.faqs)) {
            setFaqs(
              property.faqs.map((faq, index) => ({
                id: index + 1,
                question: faq.question,
                answer: faq.answer,
                displayOnPage: faq.displayOnPage,
              })),
            );
          }
          // تحديد قيم transaction_type و PropertyType بناءً على البيانات المُستلمة
          let propertyType = "";
          if (property.PropertyType) {
            propertyType = property.PropertyType;
          } else if (
            property.type &&
            (property.type === "residential" || property.type === "commercial")
          ) {
            propertyType = property.type;
          }

          setFormData({
            ...formData,
            project_id: matchedProject ? matchedProject.id.toString() : "",
            title: title,
            category: property.category_id?.toString() || "",
            description: description,
            address: address,
            building_id: property.building_id || "",
            water_meter_number: property.water_meter_number || "",
            electricity_meter_number: property.electricity_meter_number || "",
            deed_number: property.deed_number || "",
            price: property.price || "",
            purpose: property.purpose || "",
            bedrooms: property.beds?.toString() || "",
            bathrooms: property.bath?.toString() || characteristics.bathrooms?.toString() || "",
            size: property.size?.toString() || characteristics.size?.toString() || property.area?.toString() || "",
            features: featuresArray,
            status: property.status === 1 ? "published" : "draft",
            featured: property.featured === 1 || property.featured === true,
            latitude: property.location?.latitude || property.latitude || 24.766316905850978,
            longitude: property.location?.longitude || property.longitude || 46.73579692840576,
            length: property.length?.toString() || characteristics.length?.toString() || "",
            width: property.width?.toString() || characteristics.width?.toString() || "",
            facade_id: property.facade_id?.toString() || characteristics.facade_id?.toString() || "",
            street_width_north: property.street_width_north?.toString() || characteristics.street_width_north?.toString() || "",
            street_width_south: property.street_width_south?.toString() || characteristics.street_width_south?.toString() || "",
            street_width_east: property.street_width_east?.toString() || characteristics.street_width_east?.toString() || "",
            street_width_west: property.street_width_west?.toString() || characteristics.street_width_west?.toString() || "",
            building_age: property.building_age?.toString() || characteristics.building_age?.toString() || "",
            rooms: property.rooms?.toString() || characteristics.rooms?.toString() || "",
            floors: property.floors?.toString() || characteristics.floors?.toString() || "",
            floor_number: property.floor_number?.toString() || characteristics.floor_number?.toString() || "",
            driver_room: property.driver_room?.toString() || characteristics.driver_room?.toString() || "",
            maid_room: property.maid_room?.toString() || characteristics.maid_room?.toString() || "",
            dining_room: property.dining_room?.toString() || characteristics.dining_room?.toString() || "",
            living_room: property.living_room?.toString() || characteristics.living_room?.toString() || "",
            majlis: property.majlis?.toString() || characteristics.majlis?.toString() || "",
            storage_room: property.storage_room?.toString() || characteristics.storage_room?.toString() || "",
            basement: property.basement?.toString() || characteristics.basement?.toString() || "",
            swimming_pool: property.swimming_pool?.toString() || characteristics.swimming_pool?.toString() || "",
            kitchen: property.kitchen?.toString() || characteristics.kitchen?.toString() || "",
            balcony: property.balcony?.toString() || characteristics.balcony?.toString() || "",
            garden: property.garden?.toString() || characteristics.garden?.toString() || "",
            annex: property.annex?.toString() || characteristics.annex?.toString() || "",
            elevator: property.elevator?.toString() || characteristics.elevator?.toString() || "",
            private_parking: property.private_parking?.toString() || characteristics.private_parking?.toString() || "",
            city_id: cityId,
            district_id: districtId,
            payment_method: property.payment_method || "",
            pricePerMeter: property.pricePerMeter || "",
            PropertyType: propertyType,
            advertising_license: property.advertising_license || "",
            owner_number: property.owner_number || "",
            faqs: property.faqs || "",
            video_url: property.video_url || "",
            virtual_tour: property.virtual_tour || "",
          });

          // تعيين الصور الموجودة مسبقاً للعرض
          let thumbnailUrl = null;
          let galleryUrls = [];
          let floorPlanUrls = [];

          if (isDraft) {
            // Draft API structure
            thumbnailUrl = property.featured_image_url || 
                          (property.featured_image && property.featured_image !== "" 
                            ? property.featured_image 
                            : null);
            galleryUrls = property.gallery_images && Array.isArray(property.gallery_images)
              ? property.gallery_images.filter((img) => img && img !== "")
              : [];
            floorPlanUrls = property.floor_planning_image && Array.isArray(property.floor_planning_image)
              ? property.floor_planning_image.filter((img) => img && img !== "")
              : [];
          } else {
            // Regular property API structure
            thumbnailUrl = property.featured_image && property.featured_image !== ""
              ? property.featured_image
              : null;
            galleryUrls = property.gallery
              ? Array.isArray(property.gallery)
                ? property.gallery.filter((img) => img && img !== "")
                : [property.gallery].filter((img) => img && img !== "")
              : [];
            floorPlanUrls = property.floor_planning_image
              ? Array.isArray(property.floor_planning_image)
                ? property.floor_planning_image.filter((img) => img && img !== "")
                : [property.floor_planning_image].filter(
                    (img) => img && img !== "",
                  )
              : [];
          }

          // تأكد من أن الـ URL صحيح
          if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
          }

          setPreviews({
            thumbnail: thumbnailUrl,
            gallery: galleryUrls,
            floorPlans: floorPlanUrls,
            deedImage: property.deed_number || null,
          });
        } catch (error) {
          toast.error(
            "حدث خطأ أثناء جلب بيانات الوحدة. يرجى المحاولة مرة أخرى.",
          );
        } finally {
          setLoadingProperty(false);
        }
      };
      fetchProperty();
    }
  }, [mode, id, userData?.token, authLoading, isDraft]);

  const handleAddFaq = () => {
    if (newQuestion.trim() === "" || newAnswer.trim() === "") {
      toast.error("يرجى إدخال السؤال والإجابة");
      return;
    }

    const newFaq = {
      id: Date.now(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      displayOnPage: true,
    };

    setFaqs([...faqs, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    toast.success("تم إضافة السؤال بنجاح");
  };

  const handleSelectSuggestedFaq = (suggestedFaq) => {
    setNewQuestion(suggestedFaq.question); // استخدام .question بدلاً من النص مباشرة
  };

  const handleRemoveFaq = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
    toast.success("تم حذف السؤال");
  };

  const handleToggleFaqDisplay = (id) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, displayOnPage: !faq.displayOnPage } : faq,
      ),
    );
  };
  // جلب البيانات الأساسية
  useEffect(() => {
    if (mode === "add" && !isInitialized && !loading) {
      fetchProperties();
    }
  }, [fetchProperties, isInitialized, loading, properties, mode]);

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/properties/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطأ أثناء جلب أنواع الوحدات.");
      }
    };
    fetchCategories();
  }, [userData?.token, authLoading]);

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    axiosInstance
      .get("/property/facades")
      .then((response) => {
        setFacades(response.data.data);
      })
      .catch((error) => {
        console.error("خطأ في جلب الواجهات:", error);
      });
  }, [userData?.token, authLoading]);

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/user/projects");
        setProjects(response.data.data.user_projects);
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب المشاريع.");
      }
    };
    if (mode === "add") {
      fetchProjects();
    }
  }, [userData?.token, authLoading, mode]);

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    const fetchBuildings = async () => {
      try {
        const response = await axiosInstance.get("/buildings");
        setBuildings(response.data.data.data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        toast.error("حدث خطأ أثناء جلب العمارات.");
      }
    };
    fetchBuildings();
  }, [userData?.token, authLoading]);

  // فحص الحد الأقصى للوحدات (للإضافة فقط)
  React.useEffect(() => {
    if (
      mode === "add" &&
      properties.length >=
        useAuthStore.getState().userData?.real_estate_limit_number
    ) {
      toast.error(
        `لا يمكنك إضافة أكثر من ${useAuthStore.getState().userData?.real_estate_limit_number} وحدات`,
      );
      hasReachedLimit =
        properties.length >=
        (useAuthStore.getState().userData?.real_estate_limit_number || 10);
      router.push("/dashboard/properties");
    }
  }, [properties, router, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };


  const handleFileChange = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "thumbnail") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى تحميل ملفات صور فقط (JPG, PNG, GIF)");
        e.target.value = ""; // Reset input
        return;
      }
      // التحقق من حجم الصورة فوراً عند اختيارها
      if (file.size >= 10 * 1024 * 1024) {
        toast.error(
          "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
        );
        e.target.value = ""; // Reset input
        return;
      }
      setImages((prev) => ({ ...prev, thumbnail: file }));
      setPreviews((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
      }));
      // Clear thumbnail error when image is uploaded
      if (errors.thumbnail) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.thumbnail;
          return newErrors;
        });
      }
    } else if (type === "deedImage") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى تحميل ملفات صور فقط (JPG, PNG, GIF)");
        e.target.value = ""; // Reset input
        return;
      }
      // التحقق من حجم الصورة فوراً عند اختيارها
      if (file.size >= 10 * 1024 * 1024) {
        toast.error(
          "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
        );
        e.target.value = ""; // Reset input
        return;
      }
      setImages((prev) => ({ ...prev, deedImage: file }));
      setPreviews((prev) => ({
        ...prev,
        deedImage: URL.createObjectURL(file),
      }));
    } else if (type === "video") {
      const file = files[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        toast.error("يجب أن يكون الفيديو بصيغة MP4 أو MOV أو AVI فقط");
        e.target.value = ""; // Reset input
        return;
      }

      // التحقق من حجم الفيديو فوراً عند اختياره - الحد الأقصى 50 ميجابايت
      const maxVideoSizeInBytes = 50 * 1024 * 1024; // 50 MB in bytes

      if (file.size >= maxVideoSizeInBytes) {
        toast.error(
          "حجم الفيديو كبير جداً. الحد الأقصى المسموح به هو 50 ميجابايت",
        );
        e.target.value = ""; // Reset input
        return;
      }

      // التحقق من طول الفيديو
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;

        if (duration > 300) {
          // 5 دقائق = 300 ثانية
          toast.error("يجب أن يكون طول الفيديو أقل من 5 دقائق");
          e.target.value = ""; // Reset input
          return;
        }

        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));
      };

      video.onerror = () => {
        toast.error("حدث خطأ أثناء تحميل الفيديو");
        e.target.value = ""; // Reset input
      };

      video.src = URL.createObjectURL(file);
    } else {
      // التحقق من حجم كل صورة فوراً عند اختيارها
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("يجب أن تكون الصور بصيغة JPG أو PNG أو GIF فقط");
          return false;
        }
        if (file.size >= 10 * 1024 * 1024) {
          toast.error(
            "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
          );
          return false;
        }
        return true;
      });

      // إعادة تعيين input إذا تم رفض أي صورة
      if (validFiles.length !== files.length) {
        e.target.value = ""; // Reset input
      }
      setImages((prev) => ({
        ...prev,
        [type]: [...prev[type], ...validFiles],
      }));
      setPreviews((prev) => ({
        ...prev,
        [type]: [
          ...prev[type],
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }

    e.target.value = "";
  };

  const years = [];
  for (let year = 2030; year >= 1925; year--) {
    years.push(year);
  }

  const removeImage = (type, index) => {
    if (type === "thumbnail") {
      setImages((prev) => ({ ...prev, thumbnail: null }));
      setPreviews((prev) => ({ ...prev, thumbnail: null }));
    } else if (type === "deedImage") {
      setImages((prev) => ({ ...prev, deedImage: null }));
      setPreviews((prev) => ({ ...prev, deedImage: null }));
    } else {
      setImages((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
      setPreviews((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  // دالة رفع صورة السند
  const uploadDeedImage = async (file) => {
    const formData = new FormData();
    formData.append("deed_image", file);

    try {
      const response = await axiosInstance.post(
        "/properties/upload-deed-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        return response.data.data;
      } else {
        throw new Error(
          "Unexpected response structure from deed image upload API",
        );
      }
    } catch (error) {
      console.error("Deed image upload error:", error);
      throw error;
    }
  };

  const handleCounterChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "اسم الوحدة مطلوب";
    if (!formData.address) newErrors.address = "عنوان الوحدة مطلوب";
    if (!formData.purpose) newErrors.purpose = "نوع القائمة مطلوب";
    if (!formData.category) newErrors.category = "فئة الوحدة مطلوبة";
    if (mode === "add" && !images.thumbnail)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
    if (mode === "edit" && !previews.thumbnail && !images.thumbnail)
      newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
    if (!formData.description)
      newErrors.description = "من فضلك اكتب وصف للوحدة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      console.log("No token available or auth loading, skipping handleSubmit");
      alert("Authentication required. Please login.");
      return;
    }

    setSubmitError(null);
    if (validateForm()) {
      setIsLoading(true);
      setUploading(true);

      try {
        let thumbnailPath = null;
        let galleryPaths = [];
        let floorPlansPaths = [];
        let videoPaths = [];

        // رفع الصور للإضافة أو إذا تم تغييرها في التعديل
        if (images.thumbnail) {
          const uploadedFile = await uploadSingleFile(
            images.thumbnail,
            "property",
          );
          thumbnailPath =
            mode === "add"
              ? uploadedFile.path.replace(
                  process.env.NEXT_PUBLIC_Backend_URLWithOutApi,
                  "",
                )
              : uploadedFile.url;
        }

        if (images.gallery.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.gallery,
            "property",
          );
          galleryPaths =
            mode === "add"
              ? uploadedFiles.map((f) =>
                  f.path.replace(
                    process.env.NEXT_PUBLIC_Backend_URLWithOutApi,
                    "",
                  ),
                )
              : uploadedFiles.map((f) => f.url);
        }

        if (images.floorPlans.length > 0) {
          const uploadedFiles = await uploadMultipleFiles(
            images.floorPlans,
            "property",
          );
          floorPlansPaths =
            mode === "add"
              ? uploadedFiles.map((f) =>
                  f.path.replace(
                    process.env.NEXT_PUBLIC_Backend_URLWithOutApi,
                    "",
                  ),
                )
              : uploadedFiles.map((f) => f.url);
        }

        // رفع الفيديو
        if (video) {
          try {
            const uploadedFile = await uploadVideo(video);
            videoPaths = [uploadedFile.url];
          } catch (error) {
            console.error("Failed to upload video:", error);
            toast.error("فشل في رفع الفيديو. يرجى المحاولة مرة أخرى.");
            throw error;
          }
        }

        // رفع صورة السند
        let deedImagePath = "";
        if (images.deedImage) {
          try {
            const uploadedDeedImage = await uploadDeedImage(images.deedImage);
            deedImagePath = uploadedDeedImage.path || uploadedDeedImage.url;
          } catch (error) {
            console.error("Failed to upload deed image:", error);
            toast.error(
              "فشل في رفع صورة السند. يرجى المحاولة مرة أخرى.",
            );
            throw error;
          }
        }

        const propertyData = {
          title: formData.title,
          address: formData.address,
          building_id: formData.building_id,
          water_meter_number: formData.water_meter_number,
          electricity_meter_number: formData.electricity_meter_number,
          deed_number: deedImagePath,
          price: Number(formData.price),
          beds: parseInt(formData.bedrooms),
          bath: parseInt(formData.bathrooms),
          size: parseInt(formData.size),
          features:
            mode === "add" ? formData.features.join(", ") : formData.features,
          status: publish ? 1 : 0,
          featured_image: thumbnailPath || previews.thumbnail,
          floor_planning_image:
            floorPlansPaths.length > 0 ? floorPlansPaths : previews.floorPlans,
          gallery: galleryPaths.length > 0 ? galleryPaths : previews.gallery,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          featured: formData.featured,
          area: parseInt(formData.size),
          project_id: formData.project_id,
          purpose: formData.purpose,
          category_id: parseInt(formData.category),
          city_id: formData.city_id,
          state_id: formData.district_id,
          rooms: parseInt(formData.rooms) || 0,
          floors: parseInt(formData.floors) || 0,
          floor_number: parseInt(formData.floor_number) || 0,
          driver_room: parseInt(formData.driver_room) || 0,
          maid_room: parseInt(formData.maid_room) || 0,
          dining_room: parseInt(formData.dining_room) || 0,
          living_room: parseInt(formData.living_room) || 0,
          majlis: parseInt(formData.majlis) || 0,
          storage_room: parseInt(formData.storage_room) || 0,
          basement: parseInt(formData.basement) || 0,
          swimming_pool: parseInt(formData.swimming_pool) || 0,
          kitchen: parseInt(formData.kitchen) || 0,
          balcony: parseInt(formData.balcony) || 0,
          garden: parseInt(formData.garden) || 0,
          annex: parseInt(formData.annex) || 0,
          elevator: parseInt(formData.elevator) || 0,
          private_parking: parseInt(formData.private_parking) || 0,
          facade_id: parseInt(formData.facade_id) || 0,
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          street_width_north: parseFloat(formData.street_width_north) || 0,
          street_width_south: parseFloat(formData.street_width_south) || 0,
          street_width_east: parseFloat(formData.street_width_east) || 0,
          street_width_west: parseFloat(formData.street_width_west) || 0,
          building_age: parseFloat(formData.building_age) || 0,
          payment_method: formData.payment_method || null,
          pricePerMeter: formData.pricePerMeter || 0,
          type: formData.PropertyType || "",
          advertising_license: formData.advertising_license || "",
          owner_number: formData.owner_number || "",
          faqs: faqs,
          video_url:
            videoPaths.length > 0 ? videoPaths[0] : formData.video_url || "",
          virtual_tour: formData.virtual_tour || "",
        };

        let response;
        if (mode === "add") {
          response = await axiosInstance.post("/properties", propertyData);
          toast.success("تم نشر الوحدة بنجاح");
          const currentState = useStore.getState();
          const createdProperty = response.data.user_property;
          createdProperty.status =
            createdProperty.status === true ? "منشور" : "مسودة";
          const updatedProperties = [
            createdProperty,
            ...currentState.propertiesManagement.properties,
          ];
          setPropertiesManagement({ properties: updatedProperties });

          // تحديث خطوات الإعداد
          const setpOB = { step: "properties" };
          await axiosInstance.post("/steps/complete", setpOB);
          await fetchSetupProgressData();
        } else {
          response = await axiosInstance.post(
            `/properties/${id}`,
            propertyData,
          );
          toast.success(
            publish ? "تم تحديث ونشر الوحدة بنجاح" : "تم حفظ التغييرات كمسودة",
          );
          const currentState = useStore.getState();
          const updatedProperty = response.data.property;
          updatedProperty.status =
            updatedProperty.status === 1 ? "منشور" : "مسودة";
          const updatedProperties =
            currentState.propertiesManagement.properties.map((prop) =>
              prop.id === updatedProperty.id ? updatedProperty : prop,
            );
          setPropertiesManagement({ properties: updatedProperties });
        }

        router.push(isDraft ? "/dashboard/properties/incomplete" : "/dashboard/properties");
      } catch (error) {
        toast.error("حدث خطأ أثناء حفظ الوحدة. يرجى المحاولة مرة أخرى.");
        setSubmitError("حدث خطأ أثناء حفظ الوحدة. يرجى المحاولة مرة أخرى.");
      } finally {
        setUploading(false);
        setIsLoading(false);
      }
    } else {
      toast.error("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      setSubmitError("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
    }
  };

  const handleCitySelect = (cityId) => {
    setFormData((prev) => ({ ...prev, city_id: cityId, district_id: null }));
  };

  // قائمة المرافق
  const facilitiesList = [
    { key: "bedrooms", label: "غرف النوم" },
    { key: "bathrooms", label: "غرف الحمام" },
    { key: "rooms", label: "الغرف" },
    { key: "floors", label: "الأدوار" },
    { key: "floor_number", label: "رقم الدور" },
    { key: "driver_room", label: "غرفة السائق" },
    { key: "maid_room", label: "غرفة الخادمات" },
    { key: "dining_room", label: "غرفة الطعام" },
    { key: "living_room", label: "الصالة" },
    { key: "majlis", label: "المجلس" },
    { key: "storage_room", label: "المخزن" },
    { key: "basement", label: "القبو" },
    { key: "swimming_pool", label: "المسبح" },
    { key: "kitchen", label: "المطبخ" },
    { key: "balcony", label: "الشرفة" },
    { key: "garden", label: "الحديقة" },
    { key: "annex", label: "الملحق" },
    { key: "elevator", label: "المصعد" },
    { key: "private_parking", label: "موقف سيارة مخصص" },
  ];

  // تحديث selectedFacilities بناءً على القيم الموجودة في formData
  useEffect(() => {
    const activeFacilities = facilitiesList
      .filter((facility) => {
        const value = formData[facility.key];
        // التحقق من أن القيمة موجودة وليست فارغة و >= 0
        if (value === "" || value === undefined || value === null) {
          return false;
        }
        const numValue = Number(value);
        return !isNaN(numValue) && numValue >= 0;
      })
      .map((facility) => facility.key);

    setSelectedFacilities(activeFacilities);
  }, [
    formData.bedrooms,
    formData.bathrooms,
    formData.rooms,
    formData.floors,
    formData.floor_number,
    formData.driver_room,
    formData.maid_room,
    formData.dining_room,
    formData.living_room,
    formData.majlis,
    formData.storage_room,
    formData.basement,
    formData.swimming_pool,
    formData.kitchen,
    formData.balcony,
    formData.garden,
    formData.annex,
    formData.elevator,
    formData.private_parking,
  ]);

  // Handle completing a draft property
  const handleCompleteDraft = async () => {
    if (authLoading || !userData?.token || !id) {
      toast.error("Authentication required. Please login.");
      return;
    }

    if (!validateForm()) {
      toast.error("يرجى إكمال جميع الحقول المطلوبة");
      return;
    }

    setIsCompletingDraft(true);
    setSubmitError(null);

    try {
      // Prepare data for completion
      // Convert "sold" to "sale" for incomplete properties
      const normalizedPurpose = formData.purpose === "sold" ? "sale" : formData.purpose;
      
      const completionData = {
        title: formData.title,
        address: formData.address,
        description: formData.description,
        city_id: formData.city_id,
        purpose: normalizedPurpose,
        type: formData.PropertyType || "",
        area: parseInt(formData.size) || 0,
        state_id: formData.district_id || null,
        category_id: parseInt(formData.category) || null,
        price: Number(formData.price) || null,
        beds: parseInt(formData.bedrooms) || null,
        bath: parseInt(formData.bathrooms) || null,
        featured_image: previews.thumbnail || null,
        gallery_images: previews.gallery || [],
      };

      const response = await axiosInstance.post(
        `/properties/drafts/${id}/complete`,
        completionData
      );

      if (response.data.status === "success") {
        toast.success("تم إكمال المسودة بنجاح");
        router.push("/dashboard/properties");
      }
    } catch (error) {
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إكمال المسودة";
      
      // Replace English error message for incomplete properties
      if (errorMessage.includes("City location is required") || 
          errorMessage.includes("Please provide city_id or city_name")) {
        errorMessage = "المدينة مطلوبة. يرجى اختيار المدينة.";
      }
      
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const newErrors = {};
        Object.keys(validationErrors).forEach((key) => {
          let errorText = Array.isArray(validationErrors[key])
            ? validationErrors[key][0]
            : validationErrors[key];
          
          // Replace English error message for city
          if (typeof errorText === 'string' && 
              (errorText.includes("City location is required") || 
               errorText.includes("Please provide city_id or city_name"))) {
            errorText = "المدينة مطلوبة. يرجى اختيار المدينة.";
          }
          
          newErrors[key] = errorText;
        });
        setErrors(newErrors);
      }
      
      // Handle conflicts/messages array
      if (error.response?.data?.conflicts) {
        const conflicts = error.response.data.conflicts;
        const translatedConflicts = conflicts.map((conflict) => {
          let conflictMessage = conflict.message;
          if (conflictMessage && 
              (conflictMessage.includes("City location is required") || 
               conflictMessage.includes("Please provide city_id or city_name"))) {
            conflictMessage = "المدينة مطلوبة. يرجى اختيار المدينة.";
          }
          return { ...conflict, message: conflictMessage };
        });
        
        // Update validationErrors with translated messages
        const translatedValidationErrors = translatedConflicts
          .map(conflict => conflict.message)
          .filter(msg => msg);
        if (translatedValidationErrors.length > 0) {
          setValidationErrors(translatedValidationErrors);
        }
      }
    } finally {
      setIsCompletingDraft(false);
    }
  };

  // Helper function to check if a field is missing
  const isFieldMissing = (fieldName) => {
    if (!isDraft || !missingFields.length) return false;
    return missingFields.some(
      (field) => field.toLowerCase() === fieldName.toLowerCase()
    );
  };

  // Helper function to check if a card has missing required fields
  const cardHasMissingFields = (cardFields) => {
    if (!isDraft || !missingFields.length) return false;
    return cardFields.some((field) => isFieldMissing(field));
  };

  // Map field names to display names
  const getFieldDisplayName = (fieldName) => {
    const fieldMap = {
      title: "اسم الوحدة",
      address: "العنوان",
      description: "الوصف",
      city_id: "المدينة",
      purpose: "نوع المعاملة",
      type: "نوع الوحدة",
      area: "المساحة",
    };
    return fieldMap[fieldName] || fieldName;
  };

  const pageTitle = mode === "add" ? "إضافة وحدة جديدة" : isDraft ? "إكمال الوحدة غير المكتملة" : "تعديل الوحدة";
  const submitButtonText = mode === "add" ? "نشر الوحدة" : "حفظ ونشر التغييرات";
  const draftButtonText =
    mode === "add" ? "حفظ كمسودة" : "حفظ التغييرات كمسودة";

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-500">يرجى تسجيل الدخول لعرض المحتوى</p>
        </div>
      </div>
    );
  }

  // عرض skeleton loader أثناء جلب البيانات في وضع التعديل
  if (loadingProperty && mode === "edit") {
    return (
      <div className="space-y-6 max-w-[1000px] mx-auto">
              {/* Header Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>

              {/* Form Cards Skeleton */}
              <div className="grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-2">
                {/* Basic Info Card Skeleton */}
                <Card>
                  <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>

                {/* Images Card Skeleton */}
                <Card>
                  <CardHeader>
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location Card Skeleton */}
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardContent>
              </Card>

              {/* Additional Cards Skeleton */}
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-4 w-52 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
            {mode === "add" && hasReachedLimit && (
              <div
                className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">تنبيه!</strong>
                <span className="block sm:inline">
                  {" "}
                  لقد وصلت إلى الحد الأقصى لعدد الوحدات المسموح به (10 وحدات).
                  لا يمكنك إضافة المزيد من الوحدات.
                </span>
              </div>
            )}

            <PropertyFormHeader
              mode={mode}
              isDraft={isDraft}
              pageTitle={pageTitle}
              submitButtonText={submitButtonText}
              draftButtonText={draftButtonText}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              canAccessArchive={canAccessArchive}
              isLoading={isLoading}
              isCompletingDraft={isCompletingDraft}
              submitError={submitError}
              missingFieldsAr={missingFieldsAr}
              validationErrors={validationErrors}
              onBack={() => router.push(isDraft ? "/dashboard/properties/incomplete" : "/dashboard/properties")}
              onSave={handleSubmit}
              onCompleteDraft={handleCompleteDraft}
              router={router}
            />

            {/* Tab Content */}
            {activeTab === "form" ? (
              <div className="grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-2">
              <BasicInfoCard
                formData={formData}
                errors={errors}
                isDraft={isDraft}
                missingFields={missingFields}
                categories={categories}
                projects={projects}
                buildings={buildings}
                onInputChange={handleInputChange}
                onSwitchChange={handleSwitchChange}
                onSelectChange={(name, value) => handleInputChange({ target: { name, value } })}
                onCitySelect={handleCitySelect}
                onDistrictSelect={(districtId) => setFormData((prev) => ({ ...prev, district_id: districtId }))}
                isFieldMissing={isFieldMissing}
                cardHasMissingFields={cardHasMissingFields}
              />

              <PropertyDetailsCard
                formData={formData}
                errors={errors}
                currentFeature={currentFeature}
                selectedFacilities={selectedFacilities}
                facilitiesList={facilitiesList}
                facades={facades}
                years={years}
                isDraft={isDraft}
                missingFields={missingFields}
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                setCurrentFeature={setCurrentFeature}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onCounterChange={handleCounterChange}
                setSelectedFacilities={setSelectedFacilities}
                isFieldMissing={isFieldMissing}
                cardHasMissingFields={cardHasMissingFields}
              />

              <ThumbnailCard
                previews={previews}
                images={images}
                errors={errors}
                isDraft={isDraft}
                missingFields={missingFields}
                uploading={uploading}
                isOpen={isThumbnailOpen}
                setIsOpen={setIsThumbnailOpen}
                thumbnailInputRef={thumbnailInputRef}
                onFileChange={handleFileChange}
                onRemoveImage={removeImage}
                cardHasMissingFields={cardHasMissingFields}
              />

              <GalleryCard
                previews={previews}
                images={images}
                errors={errors}
                uploading={uploading}
                isOpen={isGalleryOpen}
                setIsOpen={setIsGalleryOpen}
                galleryInputRef={galleryInputRef}
                onFileChange={handleFileChange}
                onRemoveImage={removeImage}
              />

              <VideoCard
                video={video}
                videoPreview={videoPreview}
                errors={errors}
                uploading={uploading}
                isOpen={isVideoOpen}
                setIsOpen={setIsVideoOpen}
                videoInputRef={videoInputRef}
                onFileChange={handleFileChange}
                onRemoveVideo={removeVideo}
              />

              <FloorPlansCard
                previews={previews}
                images={images}
                uploading={uploading}
                isOpen={isFloorPlansOpen}
                setIsOpen={setIsFloorPlansOpen}
                floorPlansInputRef={floorPlansInputRef}
                onFileChange={handleFileChange}
                onRemoveImage={removeImage}
              />

              <VirtualTourCard
                formData={formData}
                onUrlChange={handleUrlChange}
                errors={errors}
                isOpen={isVirtualTourOpen}
                setIsOpen={setIsVirtualTourOpen}
              />
              <PropertyLocationCard
                formData={formData}
                handleLocationUpdate={handleLocationUpdate}
                isDraft={isDraft}
                missingFields={missingFields}
                isLocationOpen={isLocationOpen}
                setIsLocationOpen={setIsLocationOpen}
                cardHasMissingFields={cardHasMissingFields}
              />
              <FAQsCard
                faqs={faqs}
                newQuestion={newQuestion}
                newAnswer={newAnswer}
                suggestedFaqsList={suggestedFaqsList}
                isOpen={isFaqsOpen}
                setIsOpen={setIsFaqsOpen}
                setNewQuestion={setNewQuestion}
                setNewAnswer={setNewAnswer}
                onAddFaq={handleAddFaq}
                onRemoveFaq={handleRemoveFaq}
                onToggleFaqDisplay={handleToggleFaqDisplay}
                onSelectSuggestedFaq={handleSelectSuggestedFaq}
              />

            </div>
            ) : (
              /* Tab: تفاصيل المالك */
              canAccessArchive && (
                <div className="space-y-6">
                  <OwnerDetailsCard
                    formData={formData}
                    previews={previews}
                    images={images}
                    errors={errors}
                    uploading={uploading}
                    deedImageInputRef={deedImageInputRef}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    onRemoveImage={removeImage}
                  />
                </div>
              )
            )}
    </div>
  );
}
