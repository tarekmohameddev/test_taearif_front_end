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
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
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
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import { PropertyCounter } from "@/components/property/propertyCOMP/property-counter";
import { ChevronLeft, HelpCircle, Eye, EyeOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import loader from "@/lib/googleMapsLoader";

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
 */

/**
 * @param {PropertyFormProps} props
 */
export default function PropertyForm({ mode }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isFloorPlansOpen, setIsFloorPlansOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);
  const [isOwnerDetailsOpen, setIsOwnerDetailsOpen] = useState(false);
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
        try {
          const response = await axiosInstance.get(`/properties/${id}`);
          const property = response.data.data.property;
          const projectsResponse = await axiosInstance.get("/user/projects");
          const projects = projectsResponse.data.data.user_projects;
          setProjects(projects);

          const matchedProject = projects.find(
            (p) => p.id === property.project_id,
          );

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
          // let transactionType = "";
          // if (property.type) {
          //   transactionType = property.type;
          // } else if (property.purpose) {
          //   transactionType = property.purpose;
          // }

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
            title: property.title || "",
            category: property.category_id?.toString() || "",
            description: property.description || "",
            address: property.address || "",
            building_id: property.building_id || "",
            water_meter_number: property.water_meter_number || "",
            electricity_meter_number: property.electricity_meter_number || "",
            deed_number: property.deed_number || "",
            price: property.price || "",
            purpose: property.purpose || "",
            bedrooms: property.beds?.toString() || "",
            bathrooms: property.bath?.toString() || "",
            size: property.size?.toString() || "",
            features: featuresArray,
            status: property.status === 1 ? "published" : "draft",
            featured: property.featured || false,
            latitude: property.latitude || 24.766316905850978,
            longitude: property.longitude || 46.73579692840576,
            length: property.length?.toString() || "",
            width: property.width?.toString() || "",
            facade_id: property.facade_id?.toString() || "",
            street_width_north: property.street_width_north?.toString() || "",
            street_width_south: property.street_width_south?.toString() || "",
            street_width_east: property.street_width_east?.toString() || "",
            street_width_west: property.street_width_west?.toString() || "",
            building_age: property.building_age?.toString() || "",
            rooms: property.rooms?.toString() || "",
            floors: property.floors?.toString() || "",
            floor_number: property.floor_number?.toString() || "",
            driver_room: property.driver_room?.toString() || "",
            maid_room: property.maid_room?.toString() || "",
            dining_room: property.dining_room?.toString() || "",
            living_room: property.living_room?.toString() || "",
            majlis: property.majlis?.toString() || "",
            storage_room: property.storage_room?.toString() || "",
            basement: property.basement?.toString() || "",
            swimming_pool: property.swimming_pool?.toString() || "",
            kitchen: property.kitchen?.toString() || "",
            balcony: property.balcony?.toString() || "",
            garden: property.garden?.toString() || "",
            annex: property.annex?.toString() || "",
            elevator: property.elevator?.toString() || "",
            private_parking: property.private_parking?.toString() || "",
            city_id: property.city_id,
            district_id: property.state_id,
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
          const thumbnailUrl =
            property.featured_image && property.featured_image !== ""
              ? property.featured_image
              : null;
          const galleryUrls = property.gallery
            ? Array.isArray(property.gallery)
              ? property.gallery.filter((img) => img && img !== "")
              : [property.gallery].filter((img) => img && img !== "")
            : [];
          const floorPlanUrls = property.floor_planning_image
            ? Array.isArray(property.floor_planning_image)
              ? property.floor_planning_image.filter((img) => img && img !== "")
              : [property.floor_planning_image].filter(
                  (img) => img && img !== "",
                )
            : [];

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
        }
      };
      fetchProperty();
    }
  }, [mode, id, userData?.token, authLoading]);

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

  const triggerFileInput = (type) => {
    if (type === "thumbnail" && thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
    } else if (type === "gallery" && galleryInputRef.current) {
      galleryInputRef.current.click();
    } else if (type === "floorPlans" && floorPlansInputRef.current) {
      floorPlansInputRef.current.click();
    } else if (type === "video" && videoInputRef.current) {
      videoInputRef.current.click();
    } else if (type === "deedImage" && deedImageInputRef.current) {
      deedImageInputRef.current.click();
    }
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

        router.push("/dashboard/properties");
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

  const pageTitle = mode === "add" ? "إضافة وحدة جديدة" : "تعديل الوحدة";
  const submitButtonText = mode === "add" ? "نشر الوحدة" : "حفظ ونشر التغييرات";
  const draftButtonText =
    mode === "add" ? "حفظ كمسودة" : "حفظ التغييرات كمسودة";

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/dashboard/properties")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight truncate">
                  {pageTitle}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-2 min-w-0">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? "جاري الحفظ..." : draftButtonText}
                  </Button>
                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? "جاري الحفظ..." : submitButtonText}
                  </Button>
                </div>
                {submitError && (
                  <div className="text-red-500 text-sm mt-2 text-right w-full">
                    {submitError}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">معلومات الوحدة الأساسية</CardTitle>
                  <CardDescription>
                    أدخل المعلومات الأساسية للوحدة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      اسم الوحدة <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="شقة حديثة مع إطلالة على المدينة"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      وصف الوحدة <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="شقة جميلة مع تشطيبات حديثة وإطلالات رائعة على المدينة"
                      rows={10}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        العنوان <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 شارع الرئيسي"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="building_id">العمارة</Label>
                      <Select
                        name="building_id"
                        value={formData.building_id}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "building_id", value },
                          })
                        }
                      >
                        <SelectTrigger
                          id="building_id"
                          className={errors.building_id ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر العمارة" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map((building) => (
                            <SelectItem
                              key={building.id}
                              value={building.id.toString()}
                            >
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.building_id && (
                        <p className="text-sm text-red-500">
                          {errors.building_id}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">المبلغ</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="750000"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_method">طريقة الدفع</Label>
                      <Select
                        name="payment_method"
                        value={formData.payment_method}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "payment_method", value },
                          })
                        }
                      >
                        <SelectTrigger
                          id="payment_method"
                          className={
                            errors.payment_method ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="اختر طريقة الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">شهري</SelectItem>
                          <SelectItem value="quarterly">ربع سنوي</SelectItem>
                          <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                          <SelectItem value="annual">سنوي</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.payment_method && (
                        <p className="text-sm text-red-500"></p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerMeter">سعر المتر</Label>
                      <Input
                        id="pricePerMeter"
                        name="pricePerMeter"
                        type="number"
                        placeholder="750000"
                        value={formData.pricePerMeter}
                        onChange={handleInputChange}
                        className={errors.pricePerMeter ? "border-red-500" : ""}
                      />
                      {errors.pricePerMeter && (
                        <p className="text-sm text-red-500">
                          {errors.pricePerMeter}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">
                        نوع القائمة <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="purpose"
                        value={formData.purpose}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "purpose", value },
                          })
                        }
                      >
                        <SelectTrigger
                          id="purpose"
                          className={errors.purpose ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">للبيع</SelectItem>
                          <SelectItem value="rent">للإيجار</SelectItem>
                          <SelectItem value="sold">مباعة</SelectItem>
                          <SelectItem value="rented">مؤجرة</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.purpose && (
                        <p className="text-sm text-red-500">{errors.purpose}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        فئة الوحدة <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="category"
                        value={formData.category}
                        onValueChange={(value) => {
                          setFormData((prev) => ({ ...prev, category: value }));
                          if (errors.category) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.category;
                              return newErrors;
                            });
                          }
                        }}
                      >
                        <SelectTrigger
                          id="category"
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">المشروع</Label>
                      <Select
                        name="project"
                        value={formData.project_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            project_id: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="project"
                          className={errors.project_id ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر المشروع" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id.toString()}
                            >
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.project && (
                        <p className="text-sm text-red-500">{errors.project}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 z-9999">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="city" className="mb-1">
                          اختر المدينة
                        </Label>
                        <CitySelector
                          selectedCityId={formData.city_id}
                          onCitySelect={handleCitySelect}
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="neighborhood" className="mb-1">
                          اختر الحي
                        </Label>
                        <DistrictSelector
                          selectedCityId={formData.city_id}
                          selectedDistrictId={formData.district_id}
                          onDistrictSelect={(districtId) =>
                            setFormData((prev) => ({
                              ...prev,
                              district_id: districtId,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="PropertyType">نوع الوحدة</Label>
                      <Select
                        name="PropertyType"
                        value={formData.PropertyType}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "PropertyType", value },
                          })
                        }
                      >
                        <SelectTrigger
                          id="PropertyType"
                          className={errors.PropertyType ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">سكني</SelectItem>
                          <SelectItem value="commercial">تجاري</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.PropertyType && (
                        <p className="text-sm text-red-500">
                          {errors.PropertyType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advertising_license">ترخيص اعلاني</Label>
                      <Input
                        id="advertising_license"
                        name="advertising_license"
                        value={formData.advertising_license}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم الترخيص الاعلاني"
                        className={errors.advertising_license ? "border-red-500" : ""}
                        dir="rtl"
                      />
                      {errors.advertising_license && (
                        <p className="text-sm text-red-500">
                          {errors.advertising_license}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">تفاصيل الوحدة</CardTitle>
                      <CardDescription>أدخل مواصفات وميزات الوحدة</CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isDetailsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="featureInput">الميزات</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="featureInput"
                        placeholder="أدخل ميزة"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                              currentFeature.trim() !== "" &&
                              !formData.features.includes(currentFeature.trim())
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                features: [
                                  ...prev.features,
                                  currentFeature.trim(),
                                ],
                              }));
                              setCurrentFeature("");
                            }
                          }
                        }}
                        className={errors.features ? "border-red-500" : ""}
                      />
                      <Button
                        onClick={() => {
                          if (
                            currentFeature.trim() !== "" &&
                            !formData.features.includes(currentFeature.trim())
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              features: [
                                ...prev.features,
                                currentFeature.trim(),
                              ],
                            }));
                            setCurrentFeature("");
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.features && (
                      <p className="text-sm text-red-500">{errors.features}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label className="text-foreground">الميزات المضافة</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-200
                            px-2 sm:px-3 
                            py-1 sm:py-1.5
                            text-sm sm:text-base
                            rounded-full 
                            flex items-center gap-1 sm:gap-2
                            transition-all duration-200
                            hover:bg-gray-300 dark:hover:bg-gray-600
                            group
                          "
                        >
                          <span className="max-w-[100px] sm:max-w-none truncate">
                            {feature}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                features: prev.features.filter(
                                  (_, i) => i !== index,
                                ),
                              }));
                            }}
                            className="
                              h-auto w-auto p-0.5 sm:p-1
                              hover:bg-transparent
                              text-gray-500 dark:text-gray-400
                              hover:text-red-600 dark:hover:text-red-400
                              transition-colors duration-200
                            "
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {formData.features.length > 0 && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {formData.features.length} ميزة مضافة
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-4 gap-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("featured", checked)
                      }
                    />
                    <Label htmlFor="featured" className="mr-2">
                      عرض هذه الوحدة في الصفحة الرئيسية
                    </Label>
                  </div>

                  {/* الخصائص - Property Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-right">
                      الخصائص
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size">المساحة</Label>
                        <Input
                          id="size"
                          name="size"
                          value={formData.size}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          قدم مربع
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">طول القطعة</Label>
                        <Input
                          id="length"
                          name="length"
                          value={formData.length}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="width">عرض القطعة</Label>
                        <Input
                          id="width"
                          name="width"
                          value={formData.width}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facade_id">الواجهة</Label>
                        <Select
                          value={formData.facade_id?.toString() || ""}
                          onValueChange={(value) =>
                            handleSelectChange("facade_id", value)
                          }
                        >
                          <SelectTrigger id="facade_id" dir="rtl">
                            <SelectValue placeholder="اختر الواجهة" />
                          </SelectTrigger>
                          <SelectContent>
                            {facades.map((facade) => (
                              <SelectItem
                                key={facade.id}
                                value={facade.id.toString()}
                              >
                                {facade.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street_width_north">
                          عرض الشارع الشمالي
                        </Label>
                        <Input
                          id="street_width_north"
                          name="street_width_north"
                          value={formData.street_width_north}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street_width_south">
                          عرض الشارع الجنوبي
                        </Label>
                        <Input
                          id="street_width_south"
                          name="street_width_south"
                          value={formData.street_width_south}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street_width_east">
                          عرض الشارع الشرقي
                        </Label>
                        <Input
                          id="street_width_east"
                          name="street_width_east"
                          value={formData.street_width_east}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street_width_west">
                          عرض الشارع الغربي
                        </Label>
                        <Input
                          id="street_width_west"
                          name="street_width_west"
                          value={formData.street_width_west}
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          onChange={(e) => {
                            const numbersAndDecimal =
                              e.currentTarget.value.replace(/[^0-9.]/g, "");
                            // منع أكثر من نقطة عشرية واحدة
                            const parts = numbersAndDecimal.split(".");
                            const validValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numbersAndDecimal;

                            handleInputChange({
                              target: {
                                name: e.currentTarget.name,
                                value: validValue,
                              },
                            });
                          }}
                          dir="rtl"
                        />
                        <span className="text-sm text-gray-500 block text-right">
                          متر
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="building_age">سنة البناء</Label>
                        <Select
                          value={formData.building_age}
                          onValueChange={(value) =>
                            handleSelectChange("building_age", value)
                          }
                        >
                          <SelectTrigger id="building_age" dir="rtl">
                            <SelectValue placeholder="اختر سنة البناء" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* أرقام العدادات */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="water_meter_number">
                          رقم عداد المياه
                        </Label>
                        <Input
                          id="water_meter_number"
                          name="water_meter_number"
                          placeholder="123456789"
                          value={formData.water_meter_number}
                          onChange={handleInputChange}
                          className={
                            errors.water_meter_number ? "border-red-500" : ""
                          }
                          dir="rtl"
                        />
                        {errors.water_meter_number && (
                          <p className="text-sm text-red-500">
                            {errors.water_meter_number}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="electricity_meter_number">
                          رقم عداد الكهرباء
                        </Label>
                        <Input
                          id="electricity_meter_number"
                          name="electricity_meter_number"
                          placeholder="987654321"
                          value={formData.electricity_meter_number}
                          onChange={handleInputChange}
                          className={
                            errors.electricity_meter_number
                              ? "border-red-500"
                              : ""
                          }
                          dir="rtl"
                        />
                        {errors.electricity_meter_number && (
                          <p className="text-sm text-red-500">
                            {errors.electricity_meter_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* مرافق الوحدة - Property Features */}
                  <div className="space-y-4 whitespace-nowraps">
                    <h3 className="text-lg font-semibold text-right">
                      مرافق الوحدة
                    </h3>

                    {/* قائمة المرافق المضافة */}
                    {selectedFacilities.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium text-right">
                          المرافق المضافة:
                        </h4>
                        <div
                          className={`grid gap-3 ${
                            selectedFacilities.length === 1
                              ? "grid-cols-1"
                              : selectedFacilities.length === 2
                              ? "grid-cols-2"
                              : "grid-cols-3"
                          }`}
                        >
                          {selectedFacilities.map((facilityKey) => {
                            const facility = facilitiesList.find(
                              (f) => f.key === facilityKey
                            );
                            if (!facility) return null;
                            const currentValue =
                              Number(formData[facilityKey]) || 0;

                            return (
                              <div
                                key={facilityKey}
                                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">
                                    {facility.label}
                                  </span>
                                  <Badge variant="secondary" className="text-lg">
                                    {currentValue}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      if (currentValue === 0) {
                                        // إذا كانت القيمة 0، إلغاء تفعيل المرفق
                                        setSelectedFacilities((prev) =>
                                          prev.filter((key) => key !== facilityKey)
                                        );
                                        handleCounterChange(facilityKey, "");
                                      } else {
                                        // تقليل القيمة بمقدار 1
                                        const newValue = Math.max(0, currentValue - 1);
                                        handleCounterChange(facilityKey, newValue);
                                      }
                                    }}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      handleCounterChange(
                                        facilityKey,
                                        currentValue + 1
                                      );
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Badges المرافق */}
                    <div className="flex flex-wrap gap-2">
                      {facilitiesList.map((facility) => {
                        const currentValue =
                          Number(formData[facility.key]) || 0;
                        const isSelected = selectedFacilities.includes(facility.key);

                        return (
                          <Badge
                            key={facility.key}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer text-sm py-2 px-4 hover:bg-primary/80 transition-colors"
                            onClick={() => {
                              if (!isSelected) {
                                // تفعيل المرفق بقيمة 0
                                setSelectedFacilities((prev) => [
                                  ...prev,
                                  facility.key,
                                ]);
                                handleCounterChange(facility.key, 0);
                              } else {
                                // إلغاء تفعيل المرفق
                                setSelectedFacilities((prev) =>
                                  prev.filter((key) => key !== facility.key)
                                );
                                handleCounterChange(facility.key, 0);
                              }
                            }}
                          >
                            {facility.label}
                            {currentValue > 0 && (
                              <span className="mr-1">({currentValue})</span>
                            )}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                        </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card
                className={errors.thumbnail ? "border-red-500 border-2" : ""}
              >
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsThumbnailOpen(!isThumbnailOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">صورة الوحدة الرئيسية</CardTitle>
                      <CardDescription>
                        قم بتحميل صورة رئيسية تمثل الوحدة{" "}
                        <span className="text-red-500">*</span>
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isThumbnailOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isThumbnailOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="border rounded-md p-2 flex-1 w-full">
                      <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                        {previews.thumbnail ? (
                          <>
                            <img
                              src={previews.thumbnail}
                              alt="Property thumbnail"
                              className="h-full w-full object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => removeImage("thumbnail")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-1/3">
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                      />
                      <Button
                        variant="outline"
                        className="h-12 w-full"
                        onClick={() => triggerFileInput("thumbnail")}
                        disabled={uploading}
                      >
                        <div className="flex items-center gap-2">
                          {uploading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Upload className="h-5 w-5" />
                          )}
                          <span>رفع صورة</span>
                        </div>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف
                        هو 10 ميجابايت.
                      </p>
                      {errors.thumbnail && (
                        <p className="text-xs text-red-500">
                          {errors.thumbnail}
                        </p>
                      )}
                      </div>
                    </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="xl:col-span-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">معرض صور الوحدة</CardTitle>
                      <CardDescription>
                        قم بتحميل صور متعددة لعرض تفاصيل الوحدة
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isGalleryOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isGalleryOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {previews.gallery.map((preview, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-2 relative"
                        >
                          <div className="h-40 bg-muted rounded-md overflow-hidden">
                            <img
                              src={preview}
                              alt={`Gallery image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 h-6 w-6"
                            onClick={() => removeImage("gallery", index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-center mt-2 truncate">
                            صورة {index + 1}
                          </p>
                        </div>
                      ))}
                      <div
                        className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => triggerFileInput("gallery")}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {uploading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          إضافة صورة
                        </p>
                      </div>
                    </div>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "gallery")}
                    />
                    {errors.gallery && (
                      <p className="text-red-500 text-sm">{errors.gallery}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع صور بصيغة JPG أو PNG. الحد الأقصى لعدد الصور هو
                      10.
                    </p>
                          </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="xl:col-span-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsVideoOpen(!isVideoOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">فيديو الوحدة</CardTitle>
                      <CardDescription>
                        قم بتحميل فيديو واحد لعرض تفاصيل الوحدة
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isVideoOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isVideoOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="border rounded-md p-2 flex-1 w-full">
                        {videoPreview ? (
                          <>
                            <div
                              className="bg-muted rounded-md overflow-hidden flex items-center justify-center relative"
                              style={{
                                height: "500px",
                                maxWidth: "100%",
                              }}
                            >
                              <video
                                src={videoPreview}
                                className="max-h-full max-w-full object-contain rounded-md"
                                controls
                                style={{ width: "auto", height: "auto" }}
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                                onClick={removeVideo}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div
                            className="flex items-center justify-center bg-muted rounded-md relative"
                            style={{
                              height: "500px",
                              maxWidth: "100%",
                            }}
                          >
                            <div className="text-center">
                              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground mb-4">
                                لا يوجد فيديو
                              </p>
                              <Button
                                variant="outline"
                                onClick={() => triggerFileInput("video")}
                                disabled={uploading}
                              >
                                <div className="flex items-center gap-2">
                                  <Upload className="h-5 w-5" />
                                  <span>رفع فيديو</span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        )}
                            </div>
                          </div>
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "video")}
                          />
                          {errors.video && (
                            <p className="text-red-500 text-sm">{errors.video}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            يمكنك رفع فيديو بصيغة MP4 أو MOV أو AVI. الحد الأقصى لحجم
                            الملف هو 50 ميجابايت والحد الأقصى للطول هو 5 دقائق.
                          </p>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="xl:col-span-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsFloorPlansOpen(!isFloorPlansOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">مخططات الطوابق</CardTitle>
                      <CardDescription>
                        قم بتحميل مخططات الطوابق والتصاميم الهندسية للوحدة
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isFloorPlansOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isFloorPlansOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {previews.floorPlans.map((preview, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-2 relative"
                        >
                          <div className="h-40 bg-muted rounded-md overflow-hidden">
                            <img
                              src={preview}
                              alt={`Floor plan ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 h-6 w-6"
                            onClick={() => removeImage("floorPlans", index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-center mt-2 truncate">
                            مخطط {index + 1}
                          </p>
                        </div>
                      ))}
                      <div
                        className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => triggerFileInput("floorPlans")}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {uploading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          إضافة مخطط
                        </p>
                      </div>
                    </div>
                    <input
                      ref={floorPlansInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "floorPlans")}
                    />
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع مخططات بصيغة JPG أو PNG. الحد الأقصى لعدد
                      المخططات هو 5.
                    </p>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="xl:col-span-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsVirtualTourOpen(!isVirtualTourOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle> الجولات الافتراضية</CardTitle>
                      <CardDescription>
                        أضف رابط الجولة الافتراضية للوحدة
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isVirtualTourOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isVirtualTourOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="virtualTourUrl">
                          رابط الجولة الافتراضية (اختياري)
                        </Label>
                      </div>
                      <Input
                        id="virtual_tour"
                        name="virtual_tour"
                        type="url"
                        placeholder="https://my.matterport.com/show/..."
                        value={formData.virtual_tour}
                        onChange={handleUrlChange}
                        className={errors.virtual_tour ? "border-red-500" : ""}
                      />
                      {errors.virtual_tour && (
                        <p className="text-sm text-red-500">
                          {errors.virtual_tour}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        أضف رابط جولة افتراضية من Matterport أو منصات الجولات
                        الافتراضية الأخرى
                      </p>
                    </div>
                  </div>

                  {/* Preview sections for URLs */}
                  {(formData.virtual_tour || formData.video_url) && (
                    <div className="mt-6 p-4 bg-muted/30 rounded-md">
                      <h4 className="text-sm font-medium mb-3">
                        معاينة الروابط:
                      </h4>
                      <div className="space-y-2">
                        {formData.video_url && (
                          <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4 text-blue-500" />
                            <span className="text-muted-foreground">
                              فيديو:
                            </span>
                            <a
                              href={formData.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline truncate max-w-[200px] sm:max-w-xs"
                            >
                              {formData.video_url}
                            </a>
                          </div>
                        )}
                        {formData.virtual_tour && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">
                              جولة افتراضية:
                            </span>
                            <a
                              href={formData.virtual_tour}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:underline truncate max-w-[200px] sm:max-w-xs"
                            >
                              {formData.virtual_tour}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
              <Card className="xl:col-span-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        موقع الوحدة
                      </CardTitle>
                      <CardDescription>
                        اختر موقع الوحدة على الخريطة وعرض تفاصيل الموقع
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isLocationOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isLocationOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="space-y-6 pt-6">
                        {/* Map Section Content */}
                        <MapSection onLocationUpdate={handleLocationUpdate} hideHeader={true} />
                        {/* Location Details */}
                        <LocationCard propertyData={formData} hideHeader={true} />
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
              <Card className="xl:col-span-2">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsFaqsOpen(!isFaqsOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">الأسئلة الشائعة الخاصة بالوحدة</CardTitle>
                      <CardDescription>
                        أضف أسئلة وأجوبة شائعة حول هذه الوحدة لمساعدة المشترين
                        المحتملين.
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: isFaqsOpen ? 180 : 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {isFaqsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.50, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="space-y-6">
                        {/* Add New FAQ Form */}
                        <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="text-lg font-medium">إضافة سؤال جديد</h3>
                    <div className="space-y-2">
                      <Label htmlFor="newQuestion">السؤال</Label>
                      <Input
                        id="newQuestion"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="مثال: هل مسموح بالحيوانات الأليفة؟"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newAnswer">الإجابة</Label>
                      <Textarea
                        id="newAnswer"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="مثال: نعم، مسموح بالحيوانات الأليفة الصغيرة."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddFaq} className="w-full lg:w-auto">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة سؤال
                    </Button>
                  </div>

                  {/* Suggested FAQs */}
                  {suggestedFaqsList?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">أسئلة مقترحة:</h4>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {suggestedFaqsList.map((sq, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectSuggestedFaq(sq)}
                          >
                            <HelpCircle className="ml-2 h-4 w-4" />
                            {sq.question} {/* عرض sq.question بدلاً من sq */}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* List of Added FAQs */}
                  {faqs.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        الأسئلة المضافة ({faqs.length})
                      </h3>
                      <div className="space-y-3">
                        {faqs.map((faq) => (
                          <div
                            key={faq.id}
                            className="p-4 border rounded-md bg-muted/30"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-primary break-words">
                                  {faq.question}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 break-words">
                                  {faq.answer}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 rtl:mr-auto ltr:ml-auto flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleFaqDisplay(faq.id)}
                                  title={
                                    faq.displayOnPage
                                      ? "إخفاء من صفحة الوحدة"
                                      : "عرض في صفحة الوحدة"
                                  }
                                >
                                  {faq.displayOnPage ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveFaq(faq.id)}
                                  className="text-red-500 hover:text-red-600"
                                  title="حذف السؤال"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {faq.displayOnPage ? (
                              <Badge variant="default" className="mt-2">
                                معروض في الصفحة
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="mt-2">
                                مخفي من الصفحة
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {faqs.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      لم تتم إضافة أي أسئلة شائعة بعد.
                    </p>
                  )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {userData?.account_type === "tenant" && (
                <Card className="xl:col-span-2">
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setIsOwnerDetailsOpen(!isOwnerDetailsOpen)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">تفاصيل المالك</CardTitle>
                        <CardDescription>أدخل معلومات مالك العقار وصورة السند</CardDescription>
                      </div>
                      <motion.div
                        animate={{ rotate: isOwnerDetailsOpen ? 180 : 0 }}
                        transition={{ duration: 0.50, ease: "easeInOut" }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </CardHeader>
                  <AnimatePresence initial={false}>
                    {isOwnerDetailsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.50, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <CardContent className="space-y-6">
                          {/* رقم مالك العقار */}
                          <div className="space-y-2">
                            <Label htmlFor="owner_number">رقم مالك العقار</Label>
                            <Input
                              id="owner_number"
                              name="owner_number"
                              type="number"
                              inputMode="numeric"
                              value={formData.owner_number}
                              onChange={handleInputChange}
                              placeholder="أدخل رقم مالك العقار"
                              className={errors.owner_number ? "border-red-500" : ""}
                              dir="rtl"
                            />
                            {errors.owner_number && (
                              <p className="text-sm text-red-500">
                                {errors.owner_number}
                              </p>
                            )}
                          </div>

                          {/* صورة السند */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-right">
                              صورة السند (الصك)
                            </h3>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="border rounded-md p-2 flex-1 w-full">
                                <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                                  {previews.deedImage ? (
                                    <>
                                      <img
                                        src={previews.deedImage}
                                        alt="Deed image"
                                        className="h-full w-full object-cover rounded-md"
                                      />
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={() => removeImage("deedImage")}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-4 w-full md:w-1/3">
                                <input
                                  ref={deedImageInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, "deedImage")}
                                />
                                <Button
                                  variant="outline"
                                  className="h-12 w-full"
                                  onClick={() => triggerFileInput("deedImage")}
                                  disabled={uploading}
                                >
                                  <div className="flex items-center gap-2">
                                    {uploading ? (
                                      <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                      <Upload className="h-5 w-5" />
                                    )}
                                    <span>رفع صورة السند</span>
                                  </div>
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                  يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم
                                  الملف هو 10 ميجابايت.
                                </p>
                                {errors.deedImage && (
                                  <p className="text-xs text-red-500">
                                    {errors.deedImage}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              <Card className="xl:col-span-2">
                <CardFooter className="flex flex-col items-end border-t p-6 space-y-4">
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard/properties")}
                        className="w-full sm:w-auto"
                      >
                        إلغاء
                      </Button>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            onClick={() => handleSubmit(false)}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                          >
                            {isLoading ? "جاري الحفظ..." : draftButtonText}
                          </Button>
                          <Button
                            onClick={() => handleSubmit(true)}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                          >
                            {isLoading ? "جاري الحفظ..." : submitButtonText}
                          </Button>
                        </div>
                        {submitError && (
                          <div className="text-red-500 text-sm mt-2">
                            {submitError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
