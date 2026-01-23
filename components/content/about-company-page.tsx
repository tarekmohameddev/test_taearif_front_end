"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance"; // تأكد من المسار الصحيح
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";

export function AboutCompanyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: "",
    status: true,
    subtitle: "",
    history: "",
    mission: "",
    vision: "",
    image_path: "",
    features: [],
  });
  const {
    homepage: { setupProgressData, fetchSetupProgressData },
  } = useStore();
  const { userData } = useAuthStore();

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleStatusChange = (value) => {
    setAboutData({
      ...aboutData,
      status: value, // تحديث status مباشرة في footerData
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الملف المحدد ليس صورة");
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  useEffect(() => {
    const fetchData = async () => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        return;
      }

      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_Backend_URL}/content/about`,
        );

        if (response.data.status === "success") {
          setAboutData(response.data.data.about);
        } else {
          throw new Error("فشل في جلب البيانات");
        }
      } catch (err) {
        setError(err.message);
        toast.error("فشل في تحميل بيانات من نحن");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userData?.token]);

  const addNewFeature = () => {
    const newId =
      aboutData?.features.length > 0
        ? Math.max(...aboutData?.features.map((f) => f.id)) + 1
        : 1;
    setAboutData({
      ...aboutData,
      features: [
        ...aboutData?.features,
        {
          id: newId,
          title: "ميزة جديدة",
          description: "وصف الميزة الجديدة",
        },
      ],
    });
  };

  const removeFeature = (id) => {
    setAboutData({
      ...aboutData,
      features: aboutData?.features.filter((feature) => feature.id !== id),
    });
  };

  const updateFeature = (id, field, value) => {
    setAboutData({
      ...aboutData,
      features: aboutData?.features.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature,
      ),
    });
  };

  const handleFieldChange = (field, value) => {
    setAboutData({
      ...aboutData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    setIsSaving(true);
    toast.loading("جاري حفظ التغييرات..."); // إشعار تحميل
    try {
      let newAboutData = { ...aboutData };

      if (selectedFile) {
        const uploadedData = await uploadSingleFile(selectedFile, "content");
        setAboutData((prevData) => ({
          ...prevData,
          image_path: uploadedData.url,
        }));
        newAboutData.image_path = uploadedData.path;
      }

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/content/about`,
        newAboutData,
      );
      const setpOB = {
        step: "homepage_about_update",
      };
      await axiosInstance.post("/steps/complete", setpOB);
      await fetchSetupProgressData();

      if (response.data.status === "success") {
        toast.dismiss(); // إزالة إشعار التحميل
        toast.success("تم الحفظ بنجاح"); // إشعار نجاح
        setSelectedFile(null);
      }
    } catch (error) {
      toast.dismiss(); // إزالة إشعار التحميل
      toast.error("فشل في الحفظ"); // إشعار خطأ
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
          <main className="flex-1 p-6">
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </main>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
          <main className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </main>
      </div>
    );
  }

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col">
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

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/content/">
                <Button variant="outline" size="icon" className="h-8 w-8 mr-2">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">من نحن</h1>
                <p className="text-muted-foreground">
                  أخبر زوارك عن شركتك ورسالتها
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-1">جاري الحفظ...</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="h-4 w-4 ml-1" />
                  حفظ التغييرات
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-col space-y-8 p-6">
            <button
              onClick={() =>
                handleStatusChange(aboutData?.status === true ? false : true)
              }
              className={`relative flex h-12 w-[120px] items-center rounded-full px-4 transition-colors duration-500 ${
                aboutData?.status === true ? "bg-black" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute text-sm font-medium ${
                  aboutData?.status === true
                    ? "left-6 text-white"
                    : "right-3 text-gray-600"
                } transition-[left,right] duration-1000 ease-in-out`}
              >
                {aboutData?.status === true ? "مفعل" : "غير مفعل"}
              </span>

              <div
                className={`absolute h-10 w-10 rounded-full bg-white shadow-md transition-transform duration-1000 ease-in-out ${
                  aboutData?.status === true
                    ? "translate-x-0"
                    : "translate-x-[-72px]"
                }`}
                style={{ right: "4px" }}
              />
            </button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>عنوان القسم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">عنوان القسم</Label>
                  <Input
                    id="about-title"
                    value={aboutData?.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="about-subtitle">العنوان الفرعي للقسم</Label>
                  <Input
                    id="about-subtitle"
                    value={aboutData?.subtitle}
                    onChange={(e) =>
                      handleFieldChange("subtitle", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات الشركة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-history">تاريخ الشركة</Label>
                  <Textarea
                    id="company-history"
                    className="min-h-[150px]"
                    value={aboutData?.history}
                    onChange={(e) =>
                      handleFieldChange("history", e.target.value)
                    }
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    اشرح كيف بدأت شركتك وكيف تطورت على مر السنين
                  </p>
                </div>
                <div>
                  <Label htmlFor="company-mission">رسالة الشركة</Label>
                  <Textarea
                    id="company-mission"
                    className="min-h-[100px]"
                    value={aboutData?.mission}
                    onChange={(e) =>
                      handleFieldChange("mission", e.target.value)
                    }
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    اشرح رسالة شركتك وما تسعى لتحقيقه
                  </p>
                </div>
                <div>
                  <Label htmlFor="company-vision">رؤية الشركة</Label>
                  <Textarea
                    id="company-vision"
                    className="min-h-[100px]"
                    value={aboutData?.vision}
                    onChange={(e) =>
                      handleFieldChange("vision", e.target.value)
                    }
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    اشرح رؤيتك المستقبلية للشركة
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>صورة الشركة</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>صورة الشركة</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    className="mt-2 flex h-40 cursor-pointer items-center justify-center rounded-md border border-dashed"
                    onClick={handleImageUploadClick}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-sm">جاري رفع الصورة...</span>
                      </div>
                    ) : (
                      <>
                        {aboutData?.image_path || selectedImage ? (
                          <img
                            src={selectedImage || aboutData?.image_path}
                            alt="صورة الشركة"
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <ImagePlus className="h-8 w-8" />
                            <span>انقر لرفع صورة</span>
                            <span className="text-xs">
                              الحجم الموصى به: 800×600 بكسل
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    اختر صورة تعبر عن شركتك، مثل صورة للفريق أو المكتب أو شعار
                    الشركة
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">مميزات الشركة</h3>
              <Button
                onClick={addNewFeature}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة ميزة
              </Button>
            </div>

            <div className="space-y-4">
              {aboutData?.features.map((feature) => (
                <Card key={feature.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label htmlFor={`feature-title-${feature.id}`}>
                            عنوان الميزة
                          </Label>
                          <Input
                            id={`feature-title-${feature.id}`}
                            value={feature.title}
                            onChange={(e) =>
                              updateFeature(feature.id, "title", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-description-${feature.id}`}>
                            وصف الميزة
                          </Label>
                          <Textarea
                            id={`feature-description-${feature.id}`}
                            value={feature.description}
                            onChange={(e) =>
                              updateFeature(
                                feature.id,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeFeature(feature.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
    </div>
  );
}
