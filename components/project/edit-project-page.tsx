"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  Upload,
  X,
  Plus,
  ImageIcon,
  MapPin,
  Video,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { uploadMultipleFiles } from "@/utils/uploadMultiple";

// دالة رفع الفيديوهات
const uploadVideos = async (files: File[]) => {
  const uploadedFiles = [];

  for (let file of files) {
    const formData = new FormData();
    formData.append("context", "project"); // إضافة النص
    formData.append("video", file); // إضافة الملف

    try {
      console.log("Uploading video:", file.name, "Size:", file.size);
      const response = await axiosInstance.post("/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Video upload response:", response.data);

      // التحقق من بنية الاستجابة الصحيحة
      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        // إضافة البيانات مباشرة من response.data.data
        uploadedFiles.push(response.data.data);
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Unexpected response structure from video upload API");
      }
    } catch (error: any) {
      console.error("Video upload error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  }

  return uploadedFiles;
};
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
      <p className="text-muted-foreground">جاري تحميل الخريطة...</p>
    </div>
  ),
});

type ProjectImage = {
  id: string;
  file: File;
  url: string;
};

export default function EditProjectPage(): JSX.Element {
  const { userData } = useAuthStore();
  const {
    projectsManagement: { projects, loading, isInitialized },
    setProjectsManagement,
  } = useStore();
  const router = useRouter();
  const { id } = useParams();
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentAmenity, setCurrentAmenity] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const plansInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [newProject, setNewProject] = useState({
    id: "",
    name: "",
    location: "",
    price: "",
    complete_status: "",
    completion_date: "",
    units: 0,
    developer: "",
    description: "",
    featured: false,
    latitude: 25.2048,
    longitude: 55.2708,
    minprice: "",
    maxprice: "",
  });

  const [thumbnailImage, setThumbnailImage] = useState<ProjectImage | null>(
    null,
  );
  const [planImages, setPlanImages] = useState<ProjectImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const addAmenity = () => {
    if (
      currentAmenity.trim() !== "" &&
      !amenities.includes(currentAmenity.trim())
    ) {
      setAmenities((prev) => [...prev, currentAmenity.trim()]);
      setCurrentAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchProjectData");
      return;
    }

    const fetchProjectData = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_Backend_URL}/projects/${id}`,
        );
        const projectData = response.data.data.project;

        if (
          projectData &&
          Array.isArray(projectData.contents) &&
          projectData.contents.length > 0
        ) {
          // تحديث بيانات المشروع
          setNewProject({
            id: projectData.id,
            name: projectData.contents[0].title,
            location: projectData.contents[0].address,
            price: `${projectData.price_range}`,
            complete_status: projectData.complete_status.toString(),
            completion_date: projectData.completion_date.split("T")[0],
            units: projectData.units,
            developer: projectData.developer,
            description: projectData.contents[0].description,
            featured: projectData.featured,
            latitude: projectData.latitude,
            longitude: projectData.longitude,
            minprice:
              projectData.min_price?.toString?.() ?? `${projectData.min_price}`,
            maxprice:
              projectData.max_price?.toString?.() ?? `${projectData.max_price}`,
          });

          // معالجة المرافق
          let amenitiesArray = [];
          if (typeof projectData.amenities === "string") {
            try {
              // محاولة تحليل JSON
              amenitiesArray = JSON.parse(projectData.amenities);
            } catch (error) {
              // إذا فشل، ربما تكون string مفصولة بفواصل
              amenitiesArray = projectData.amenities
                .split(",")
                .map((a) => a.trim());
            }
          } else if (Array.isArray(projectData.amenities)) {
            amenitiesArray = projectData.amenities;
          }

          // استخراج أسماء المرافق
          if (amenitiesArray.length > 0) {
            // إذا كانت المرافق كائنات
            if (
              typeof amenitiesArray[0] === "object" &&
              amenitiesArray[0].name
            ) {
              setAmenities(
                amenitiesArray.map((amenity) => amenity.name.trim()),
              );
            } else {
              // إذا كانت المرافق نصوص
              setAmenities(
                amenitiesArray.map((amenity) => amenity.toString().trim()),
              );
            }
          }
        }

        // معالجة الصور
        if (projectData.featured_image) {
          setThumbnailImage({
            id: "existing-thumbnail",
            url: projectData.featured_image,
            file: new File([], "thumbnail.jpg"),
          });
        }

        if (
          projectData.gallery &&
          Array.isArray(projectData.gallery)
        ) {
          setGalleryImages(
            projectData.gallery.map((img, index) => ({
              id: `existing-gallery-${index}`,
              url: img,
              file: new File([], img.split("/").pop() || "image.jpg"),
            })),
          );
        }

        if (
          projectData.floorplan_images &&
          Array.isArray(projectData.floorplan_images)
        ) {
          setPlanImages(
            projectData.floorplan_images.map((img, index) => ({
              id: `existing-plan-${index}`,
              url: img,
              file: new File([], img.split("/").pop() || "plan.jpg"),
            })),
          );
        }

        // معالجة الفيديو
        if (projectData.video_url) {
          setVideoPreview(projectData.video_url);
        }

        setOriginalData(projectData);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        toast.error("فشل في تحميل بيانات المشروع");
        router.push("/dashboard/projects");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id, router, userData?.token]);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (formErrors[id]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (value === "" || !isNaN(Number.parseFloat(value))) {
      setNewProject((prev) => ({
        ...prev,
        [id]: value === "" ? 0 : Number.parseFloat(value),
      }));
    }
  };

  const handleMapPositionChange = (lat: number, lng: number) => {
    setNewProject((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setNewProject((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewProject((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        setThumbnailImage({
          id: Date.now().toString(),
          file,
          url: event.target.result.toString(),
        });
        if (formErrors.thumbnail) {
          setFormErrors((prev) => {
            const updated = { ...prev };
            delete updated.thumbnail;
            return updated;
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePlansUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPlanImages((prev) => [
            ...prev,
            {
              id:
                Date.now().toString() +
                Math.random().toString(36).substring(2, 9),
              file,
              url: event.target.result.toString(),
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setGalleryImages((prev) => [
            ...prev,
            {
              id:
                Date.now().toString() +
                Math.random().toString(36).substring(2, 9),
              file,
              url: event.target.result.toString(),
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeThumbnail = () => {
    setThumbnailImage(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const removePlanImage = (id: string) => {
    setPlanImages((prev) => prev.filter((image) => image.id !== id));
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((image) => image.id !== id));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("video/")) {
      toast.error("يجب أن يكون الفيديو بصيغة MP4 أو MOV أو AVI فقط");
      return;
    }

    // Get video size limit from user's package
    const videoSizeLimit =
      useAuthStore.getState().userData?.membership?.package?.video_size_limit ||
      50;
    const maxSizeInBytes = videoSizeLimit * 1024 * 1024; // Convert MB to bytes

    if (file.size > maxSizeInBytes) {
      toast.error(`يجب أن يكون حجم الملف أقل من ${videoSizeLimit} ميجابايت`);
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
        return;
      }

      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    };

    video.src = URL.createObjectURL(file);
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!newProject.name) {
      errors.name = "اسم المشروع مطلوب";
    }
    if (!thumbnailImage) {
      errors.thumbnail = "صورة المشروع الرئيسية مطلوبة";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProject = async (
    status: "منشور" | "مسودة" | "Pre-construction",
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleUpdateProject");
      alert("Authentication required. Please login.");
      return;
    }

    if (!validateForm()) {
      toast.error("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      setSubmitError("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      // استخدام حقول الحد الأدنى والأعلى للسعر بدلاً من تحليل price
      const minPrice =
        parseFloat(newProject.minprice as unknown as string) || 0;
      const maxPrice =
        parseFloat(newProject.maxprice as unknown as string) || minPrice;

      const formattedDate = newProject.completion_date
        ? new Date(newProject.completion_date).toISOString().split("T")[0]
        : "";

      let featuredImagePath = "";
      if (thumbnailImage) {
        if (
          !thumbnailImage.url.startsWith(
            process.env.NEXT_PUBLIC_Backend_URLWithOutApi,
          )
        ) {
          const uploadResult = await uploadSingleFile(
            thumbnailImage.file,
            "project",
          );
          featuredImagePath = uploadResult.path;
        } else {
          featuredImagePath = thumbnailImage.url;
        }
      }

      // رفع صور المخططات الجديدة فقط
      let floorplanPaths = planImages
        .filter((img) =>
          img.url.startsWith(process.env.NEXT_PUBLIC_Backend_URLWithOutApi),
        )
        .map((img) => img.url);

      const newPlanImages = planImages.filter(
        (img) =>
          !img.url.startsWith(process.env.NEXT_PUBLIC_Backend_URLWithOutApi),
      );
      if (newPlanImages.length > 0) {
        const files = newPlanImages.map((image) => image.file);
        const uploadResults = await uploadMultipleFiles(files, "project");
        if (uploadResults && Array.isArray(uploadResults)) {
          floorplanPaths = [
            ...floorplanPaths,
            ...uploadResults.map((file) => file.path),
          ];
          toast.success("تم رفع صور المخططات بنجاح");
        }
      }

      // رفع صور المعرض الجديدة فقط
      let galleryPaths = galleryImages
        .filter((img) =>
          img.url.startsWith(process.env.NEXT_PUBLIC_Backend_URLWithOutApi),
        )
        .map((img) => img.url);

      const newGalleryImages = galleryImages.filter(
        (img) =>
          !img.url.startsWith(process.env.NEXT_PUBLIC_Backend_URLWithOutApi),
      );
      if (newGalleryImages.length > 0) {
        const files = newGalleryImages.map((image) => image.file);
        const uploadResults = await uploadMultipleFiles(files, "project");
        if (uploadResults && Array.isArray(uploadResults)) {
          galleryPaths = [
            ...galleryPaths,
            ...uploadResults.map((file) => file.path),
          ];
          toast.success("تم رفع صور المعرض بنجاح");
        }
      }

      // رفع الفيديو
      let videoPath = "";
      if (video) {
        try {
          const uploadedFiles = await uploadVideos([video]);
          videoPath = uploadedFiles[0].url;
          toast.success("تم رفع الفيديو بنجاح");
        } catch (error) {
          console.error("Failed to upload video:", error);
          toast.error("فشل في رفع الفيديو. يرجى المحاولة مرة أخرى.");
          throw error;
        }
      } else if (videoPreview && videoPreview.startsWith("https://")) {
        // إذا كان الفيديو موجود مسبقاً ولم يتم تغييره
        videoPath = videoPreview;
      }

      const publishedValue = status === "منشور" ? 1 : 0;

      const projectData = {
        featured_image: featuredImagePath,
        min_price: minPrice,
        max_price: maxPrice,
        latitude: newProject.latitude,
        longitude: newProject.longitude,
        featured: newProject.featured,
        complete_status:
          newProject.complete_status === "1"
            ? 1
            : newProject.complete_status === "2"
              ? 2
              : 0,
        units: Number(newProject.units),
        completion_date: formattedDate,
        developer: newProject.developer,
        published: publishedValue,
        contents: [
          {
            language_id: 1,
            title: newProject.name,
            address: newProject.location,
            description: newProject.description,
            meta_keyword: "luxury, apartments, Dubai",
            meta_description:
              "Luxury apartments in Dubai with sea view and top facilities.",
          },
          {
            language_id: 2,
            title: newProject.name,
            address: newProject.location,
            description: newProject.description,
            meta_keyword: "فخامة، شقق، دبي",
            meta_description:
              "شقق فاخرة في دبي بإطلالة على البحر ومرافق متميزة.",
          },
        ],
        gallery_images: galleryPaths,
        floorplan_images: floorplanPaths,
        video_url: videoPath,
        specifications: [
          { key: "Bedrooms", label: "Number of Bedrooms", value: "3" },
          { key: "Bathrooms", label: "Number of Bathrooms", value: "2" },
          { key: "Parking", label: "Parking Spaces", value: "2" },
        ],
        types: [
          {
            language_id: 1,
            title: "3 BHK Apartment",
            min_area: 1200,
            max_area: 1500,
            min_price: 50000,
            max_price: 100000,
            unit: "sqft",
          },
          {
            language_id: 2,
            title: "شقة 3 غرف",
            min_area: 1200,
            max_area: 1500,
            min_price: 50000,
            max_price: 100000,
            unit: "قدم مربع",
          },
        ],
        amenities: amenities.join(", "), // تحويل array إلى string
      };

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/projects/${id}`,
        projectData,
      );

      toast.success("تم تحديث المشروع بنجاح");
      router.push("/dashboard/projects");
    } catch (error) {
      setSubmitError("حدث خطأ أثناء حفظ المشروع. يرجى المحاولة مرة أخرى.");
      console.error("Update failed:", error);
      toast.error("حدث خطأ في السيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
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
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto" style={{ maxWidth: '1100px' }}>
              <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>

              {/* Form Card Skeleton */}
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input Fields Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>

                  {/* Amenities Skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              {/* Map Card Skeleton */}
              <Card>
                <CardHeader>
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardContent>
              </Card>

              {/* Image Upload Cards Skeleton */}
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
              </div>
            </div>
          </main>
        </div>
    );
  }

  if (!id) {
    router.push("/dashboard/projects");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto" style={{ maxWidth: '1100px' }}>
            <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/dashboard/projects")}
                  className="h-8 w-8"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">العودة</span>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                  تعديل المشروع
                </h1>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProject("مسودة")}
                    disabled={isLoading}
                  >
                    حفظ كمسودة
                  </Button>
                  <Button
                    onClick={() => handleUpdateProject("منشور")}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الحفظ..." : "تحديث المشروع"}
                  </Button>
                </div>
                {submitError && (
                  <div className="text-red-500 text-sm mt-2">{submitError}</div>
                )}
              </div>
            </div>

            {/* معلومات المشروع */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات المشروع</CardTitle>
                <CardDescription>
                  قم بتحديث التفاصيل الأساسية للمشروع العقاري
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* الصف الأول من الحقول */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">اسم المشروع</Label>
                    <Input
                      id="name"
                      placeholder="سكاي لاين ريزيدنس"
                      value={newProject.name}
                      onChange={handleInputChange}
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      placeholder="وسط المدينة"
                      value={newProject.location}
                      onChange={handleInputChange}
                      className={formErrors.location ? "border-red-500" : ""}
                    />
                    {formErrors.location && (
                      <p className="text-xs text-red-500">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* الصف الثاني من الحقول */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="minprice">اقل سعر</Label>
                    <Input
                      id="minprice"
                      placeholder="مثال: 750000"
                      value={newProject.minprice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxprice">اعلى سعر</Label>
                    <Input
                      id="maxprice"
                      placeholder="مثال: 1200000"
                      value={newProject.maxprice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* الصف الثالث من الحقول */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="units">عدد الوحدات</Label>
                    <Input
                      id="units"
                      placeholder="120"
                      type="number"
                      value={newProject.units || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="complete_status">الحالة</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("complete_status", value)
                      }
                      value={newProject.complete_status}
                    >
                      <SelectTrigger
                        id="status"
                        className={formErrors.status ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">لم ينشأ بعد</SelectItem>
                        <SelectItem value="0">قيد الإنشاء</SelectItem>
                        <SelectItem value="1">منتهي</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.status && (
                      <p className="text-xs text-red-500">
                        {formErrors.status}
                      </p>
                    )}
                  </div>
                </div>

                {/* الصف الرابع - المطور و Featured switch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="completion_date">تاريخ الإنجاز</Label>
                    <Input
                      id="completion_date"
                      placeholder="2025"
                      value={newProject.completion_date}
                      onChange={handleInputChange}
                      className={
                        formErrors.completion_date ? "border-red-500" : ""
                      }
                    />
                    {formErrors.completion_date && (
                      <p className="text-xs text-red-500">
                        {formErrors.completion_date}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="developer">المطور</Label>
                    <Input
                      id="developer"
                      placeholder="مجموعة التطوير الحضري"
                      value={newProject.developer}
                      onChange={handleInputChange}
                      className={formErrors.developer ? "border-red-500" : ""}
                    />
                    {formErrors.developer && (
                      <p className="text-xs text-red-500">
                        {formErrors.developer}
                      </p>
                    )}
                  </div>
                </div>

                {/* حقل المرافق - منفصل تماماً */}
                <div className="space-y-4">
                  {/* قسم المرافق وعرض المشروع - كلاهما 50% */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* حقل إدخال المرافق */}
                    <div className="space-y-2">
                      <Label htmlFor="amenityInput" className="text-foreground">
                        المرافق
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="amenityInput"
                          placeholder="أدخل مرفق (مثل: حمام سباحة)"
                          value={currentAmenity}
                          onChange={(e) => setCurrentAmenity(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAmenity();
                            }
                          }}
                          className="flex-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                        <Button
                          type="button"
                          onClick={addAmenity}
                          disabled={!currentAmenity.trim()}
                          className="w-full sm:w-auto"
                          variant="secondary"
                        >
                          <Plus className="h-4 w-4 ml-2 sm:ml-0 sm:mr-2" />
                          <span className="sm:hidden">إضافة مرفق</span>
                          <span className="hidden sm:inline">إضافة</span>
                        </Button>
                      </div>
                      {formErrors?.amenities && (
                        <p className="text-sm text-destructive">
                          {formErrors.amenities}
                        </p>
                      )}
                    </div>

                    {/* قسم عرض المشروع في الصفحة الرئيسية */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={newProject.featured}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="featured" className="mr-2">
                        عرض هذا المشروع في الصفحة الرئيسية (مميز)
                      </Label>
                    </div>
                  </div>

                  {/* عرض المرافق المضافة */}
                  {amenities.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-foreground">المرافق المضافة</Label>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="
                              bg-secondary/50 dark:bg-secondary/30 
                              text-secondary-foreground 
                              px-3 py-1.5 
                              rounded-full 
                              flex items-center gap-2
                              text-sm
                              transition-colors
                              hover:bg-secondary/70 dark:hover:bg-secondary/50
                              group
                            "
                          >
                            <span className="select-none">{amenity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAmenity(index)}
                              className="
                                h-auto p-0 
                                hover:bg-transparent 
                                text-muted-foreground 
                                hover:text-destructive
                                transition-colors
                                -mr-1
                              "
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {amenities.length} مرفق مضاف
                      </p>
                    </div>
                  )}
                </div>

                {/* حقل الوصف - منفصل أيضاً */}
                <div className="grid gap-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="شقق فاخرة عالية الارتفاع مع إطلالات بانورامية على المدينة"
                    rows={3}
                    value={newProject.description}
                    onChange={handleInputChange}
                    className={formErrors.description ? "border-red-500" : ""}
                  />
                  {formErrors.description && (
                    <p className="text-xs text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Location */}
            <Card>
              <CardHeader>
                <CardTitle>موقع المشروع على الخريطة</CardTitle>
                <CardDescription>
                  حدد موقع المشروع على الخريطة أو أدخل الإحداثيات يدويًا
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[400px] w-full rounded-md overflow-hidden border">
                  {mapLoaded && (
                    <MapComponent
                      latitude={newProject.latitude}
                      longitude={newProject.longitude}
                      onPositionChange={handleMapPositionChange}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">خط العرض (Latitude)</Label>
                    <Input
                      id="latitude"
                      placeholder="25.276987"
                      value={newProject.latitude.toString()}
                      onChange={handleCoordinateChange}
                      className={formErrors.coordinates ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">خط الطول (Longitude)</Label>
                    <Input
                      id="longitude"
                      placeholder="55.296249"
                      value={newProject.longitude.toString()}
                      onChange={handleCoordinateChange}
                      className={formErrors.coordinates ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {formErrors.coordinates && (
                  <p className="text-xs text-red-500">
                    {formErrors.coordinates}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <p>
                    انقر على الخريطة لتحديد موقع المشروع أو اسحب العلامة لتغيير
                    الموقع
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>صورة المشروع الرئيسية</CardTitle>
                <CardDescription>
                  قم بتحميل صورة رئيسية تمثل المشروع العقاري
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="border rounded-md p-2 flex-1 w-full">
                    <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
                      {thumbnailImage ? (
                        <>
                          <img
                            src={thumbnailImage.url || "/placeholder.svg"}
                            alt="Project thumbnail"
                            className="h-full w-full object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={removeThumbnail}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full md:w-1/3">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                    <Button
                      variant="outline"
                      className="h-12 w-full"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        <span>رفع صورة</span>
                      </div>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو
                      5 ميجابايت.
                    </p>
                    {formErrors.thumbnail && (
                      <p className="text-sm text-red-500">
                        {formErrors.thumbnail}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Plans Upload */}
            <Card>
              <CardHeader>
                <CardTitle>مخططات المشروع</CardTitle>
                <CardDescription>
                  قم بتحميل مخططات الطوابق والتصاميم الهندسية للمشروع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {planImages.map((image) => (
                      <div
                        key={image.id}
                        className="border rounded-md p-2 relative"
                      >
                        <div className="h-40 bg-muted rounded-md overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Project plan"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 h-6 w-6"
                          onClick={() => removePlanImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-center mt-2 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                    <div
                      className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => plansInputRef.current?.click()}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        إضافة مخطط
                      </p>
                    </div>
                  </div>
                  <input
                    ref={plansInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePlansUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    يمكنك رفع مخططات بصيغة JPG أو PNG. الحد الأقصى لعدد المخططات
                    هو 10.
                  </p>
                  {formErrors.planImages && (
                    <p className="text-sm text-red-500">
                      {formErrors.planImages}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Gallery Upload */}
            <Card>
              <CardHeader>
                <CardTitle>معرض صور المشروع</CardTitle>
                <CardDescription>
                  قم بتحميل صور متعددة لعرض تفاصيل المشروع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((image) => (
                      <div
                        key={image.id}
                        className="border rounded-md p-2 relative"
                      >
                        <div className="h-40 bg-muted rounded-md overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Gallery image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 h-6 w-6"
                          onClick={() => removeGalleryImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-center mt-2 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                    <div
                      className="border rounded-md p-2 h-[11rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
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
                    onChange={handleGalleryUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    يمكنك رفع صور بصيغة JPG أو PNG. الحد الأقصى لعدد الصور هو
                    20.
                  </p>
                  {formErrors.galleryImages && (
                    <p className="text-sm text-red-500">
                      {formErrors.galleryImages}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Video Upload */}
            <Card>
              <CardHeader>
                <CardTitle>فيديو المشروع</CardTitle>
                <CardDescription>
                  قم بتحميل فيديو واحد لعرض تفاصيل المشروع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="border rounded-md p-2 flex-1 w-full">
                      <div
                        className="flex items-center justify-center bg-muted rounded-md relative"
                        style={{
                          height: "500px",
                          maxWidth: "100%",
                        }}
                      >
                        {videoPreview ? (
                          <>
                            <video
                              src={videoPreview}
                              className="max-h-full max-w-full object-contain rounded-md"
                              controls
                              style={{ width: "auto", height: "auto" }}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={removeVideo}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Video className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-1/3">
                      <input
                        ref={videosInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                      <Button
                        variant="outline"
                        className="h-12 w-full"
                        onClick={() => videosInputRef.current?.click()}
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="h-5 w-5" />
                          <span>رفع فيديو</span>
                        </div>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        يمكنك رفع فيديو بصيغة MP4 أو MOV أو AVI. الحد الأقصى
                        لحجم الملف هو{" "}
                        {useAuthStore.getState().userData?.membership?.package
                          ?.video_size_limit || 50}{" "}
                        ميجابايت والحد الأقصى للطول هو 5 دقائق.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/projects")}
                >
                  إلغاء
                </Button>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateProject("مسودة")}
                      disabled={isLoading}
                    >
                      حفظ كمسودة
                    </Button>
                    <Button
                      onClick={() => handleUpdateProject("منشور")}
                      disabled={isLoading}
                    >
                      {isLoading ? "جاري الحفظ..." : "تحديث المشروع"}
                    </Button>
                  </div>
                  {submitError && (
                    <div className="text-red-500 text-sm mt-2">
                      {submitError}
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
            </div>
          </div>
        </main>
    </div>
  );
}
