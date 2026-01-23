"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Upload,
  X,
  Loader2,
  ImageIcon,
  Building,
  Building2,
  FileText,
  Droplets,
  Save,
  ArrowLeft,
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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export default function BuildingForm({ mode = "add" }) {
  const router = useRouter();
  const params = useParams();
  const buildingId = params?.id;

  // States
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    deed_number: "",
    water_meter_number: "",
    image: "",
    deed_image: "",
  });
  const [images, setImages] = useState({
    image: null,
    deed_image: null,
  });
  const [previews, setPreviews] = useState({
    image: null,
    deed_image: null,
  });

  // File refs
  const imageInputRef = useRef(null);
  const deedImageInputRef = useRef(null);

  // Load building data for edit mode
  useEffect(() => {
    if (mode === "edit" && buildingId) {
      loadBuildingData();
    }
  }, [mode, buildingId]);

  const loadBuildingData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/buildings/${buildingId}`);

      if (response.data.status === "success") {
        const building = response.data.data;
        setFormData({
          name: building.name || "",
          deed_number: building.deed_number || "",
          water_meter_number: building.water_meter_number || "",
        });

        // تعيين الصور الموجودة مسبقاً للعرض
        if (building.image_url) {
          setPreviews((prev) => ({ ...prev, image: building.image_url }));
        }
        if (building.deed_image_url) {
          setPreviews((prev) => ({
            ...prev,
            deed_image: building.deed_image_url,
          }));
        }
      }
    } catch (error) {
      console.error("Error loading building data:", error);
      toast.error("فشل في تحميل بيانات العمارة");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة صالح");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
        return;
      }

      // Save file to state
      setImages((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  // Remove image
  const removeImage = (type) => {
    setImages((prev) => ({ ...prev, [type]: null }));
    setPreviews((prev) => ({ ...prev, [type]: null }));
    if (type === "image" && imageInputRef.current) {
      imageInputRef.current.value = "";
    } else if (type === "deed_image" && deedImageInputRef.current) {
      deedImageInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم العمارة");
      return;
    }

    try {
      setLoading(true);

      let imagePath = null;
      let deedImagePath = null;

      // Upload images if they exist
      if (images.image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", images.image);

        const response = await axiosInstance.post(
          "/buildings/upload-image",
          uploadFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.data.status === "success") {
          imagePath = response.data.data.path;
          console.log("Image uploaded successfully:", response.data.data.path);
        }
      }

      if (images.deed_image) {
        const uploadFormData = new FormData();
        uploadFormData.append("deed_image", images.deed_image);

        const response = await axiosInstance.post(
          "/buildings/upload-deed-image",
          uploadFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.data.status === "success") {
          deedImagePath = response.data.data.path;
          console.log(
            "Deed image uploaded successfully:",
            response.data.data.path,
          );
        }
      }

      // Prepare submit data
      const submitData = {
        name: formData.name.trim(),
        deed_number: formData.deed_number.trim() || null,
        water_meter_number: formData.water_meter_number.trim() || null,
        image: imagePath,
        deed_image: deedImagePath,
      };

      console.log("Submit Data:", submitData);

      let response;
      if (mode === "edit") {
        response = await axiosInstance.put(
          `/buildings/${buildingId}`,
          submitData,
        );
      } else {
        response = await axiosInstance.post("/buildings", submitData);
      }

      if (response.data.status === "success") {
        toast.success(
          mode === "edit" ? "تم تحديث العمارة بنجاح" : "تم إضافة العمارة بنجاح",
        );
        router.push("/dashboard/buildings");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        mode === "edit" ? "فشل في تحديث العمارة" : "فشل في إضافة العمارة",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && mode === "edit") {
    return (
      <div className="flex min-h-screen bg-white">
          <div className="p-6 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
              <span className="text-black">جاري تحميل بيانات العمارة...</span>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
        <div className="p-6 bg-white">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/buildings")}
                className="text-black hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-black">
                  {mode === "edit" ? "تعديل العمارة" : "إضافة عمارة جديدة"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {mode === "edit"
                    ? "تعديل بيانات العمارة"
                    : "إضافة عمارة جديدة إلى النظام"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Basic Information */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-black flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    المعلومات الأساسية
                  </CardTitle>
                  <CardDescription>
                    أدخل المعلومات الأساسية للعمارة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Building Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black font-medium">
                      اسم العمارة *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="مثال: برج النور"
                      className="border-gray-300 focus:border-black focus:ring-black"
                      required
                    />
                  </div>

                  {/* Deed Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="deed_number"
                      className="text-black font-medium"
                    >
                      رقم الصك
                    </Label>
                    <Input
                      id="deed_number"
                      name="deed_number"
                      value={formData.deed_number}
                      onChange={handleInputChange}
                      placeholder="مثال: 12345-67890"
                      className="border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>

                  {/* Water Meter Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="water_meter_number"
                      className="text-black font-medium"
                    >
                      رقم عداد المياه
                    </Label>
                    <Input
                      id="water_meter_number"
                      name="water_meter_number"
                      value={formData.water_meter_number}
                      onChange={handleInputChange}
                      placeholder="مثال: WM-2024-001"
                      className="border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </CardContent>
              </Card>
              {/* Images */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-black flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    الصور
                  </CardTitle>
                  <CardDescription>رفع صور العمارة والصك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Building Image */}
                  <div className="space-y-4">
                    <Label className="text-black font-medium">
                      صورة العمارة
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {previews.image ? (
                        <div className="space-y-4">
                          <img
                            src={previews.image}
                            alt="صورة العمارة"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="flex gap-2 justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => imageInputRef.current?.click()}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              تغيير الصورة
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage("image")}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-gray-600 mb-2">
                              اضغط لرفع صورة العمارة
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => imageInputRef.current?.click()}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              رفع صورة
                            </Button>
                          </div>
                        </div>
                      )}
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "image")}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Deed Image */}
                  <div className="space-y-4">
                    <Label className="text-black font-medium">صورة الصك</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {previews.deed_image ? (
                        <div className="space-y-4">
                          <img
                            src={previews.deed_image}
                            alt="صورة الصك"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="flex gap-2 justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => deedImageInputRef.current?.click()}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              تغيير الصورة
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage("deed_image")}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-gray-600 mb-2">
                              اضغط لرفع صورة الصك
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => deedImageInputRef.current?.click()}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              رفع صورة
                            </Button>
                          </div>
                        </div>
                      )}
                      <input
                        ref={deedImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "deed_image")}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white px-8 py-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading
                  ? "جاري الحفظ..."
                  : mode === "edit"
                    ? "تحديث العمارة"
                    : "إضافة العمارة"}
              </Button>
            </div>
          </form>
        </div>
    </div>
  );
}
