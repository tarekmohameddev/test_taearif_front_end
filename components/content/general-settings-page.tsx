"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Save, Upload } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/AuthContext";

interface AdditionalSettings {
  theme_color: string;
  timezone: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  social_links: {
    facebook: string;
    twitter: string;
  };
}

export function GeneralSettingsPage() {
  const router = useRouter();
  const { userData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "",
    tagline: "",
    description: "",
    primary_color: "#4F46E5",
    secondary_color: "#10B981",
    accent_color: "#EF4444",
    logo: "",
    favicon: "",
    maintenance_mode: false,
    show_breadcrumb: true,
    show_properties: false,
    additional_settings: {
      theme_color: "#FF5733",
      timezone: "Asia/Riyadh",
      social_links: {
        facebook: "",
        twitter: "",
      },
    } as AdditionalSettings,
  });

  // Add dedicated state for image previews
  const [imagePreviews, setImagePreviews] = useState({
    logo: "",
    favicon: "",
  });

  const [tempFiles, setTempFiles] = useState<{
    logo?: File;
    favicon?: File;
  }>({});

  const getPreviewUrl = useCallback((file: File | undefined) => {
    return file ? URL.createObjectURL(file) : "";
  }, []);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_Backend_URL}/content/general`,
        );
        const settings = response.data.data.settings;
        setFormData({
          ...settings,
          primary_color: settings.primary_color || "#4F46E5",
          secondary_color: settings.secondary_color || "#10B981",
          accent_color: settings.accent_color || "#EF4444",
          additional_settings: settings.additional_settings || {
            theme_color: "#FF5733",
            timezone: "Asia/Riyadh",
            social_links: {
              facebook: "",
              twitter: "",
            },
          },
        });

        // Initialize image previews with current values
        setImagePreviews({
          logo: settings.logo || "",
          favicon: settings.favicon || "",
        });
      } catch (error) {
        toast.error("تعذر تحميل الإعدادات العامة");
      }
    };
    fetchSettings();
  }, []);

  // Clean up object URLs when component unmounts or when previews change
  useEffect(() => {
    return () => {
      if (imagePreviews.logo && imagePreviews.logo.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews.logo);
      }
      if (imagePreviews.favicon && imagePreviews.favicon.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews.favicon);
      }
    };
  }, [imagePreviews]);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempFiles((prev) => ({ ...prev, [type]: file }));

    // Create preview URL and update preview state
    const previewUrl = getPreviewUrl(file);
    setImagePreviews((prev) => ({
      ...prev,
      [type]: previewUrl,
    }));

    // Also update formData to maintain existing behavior
    setFormData((prev) => ({
      ...prev,
      [type]: previewUrl,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const finalData = { ...formData };

      let logoUrl = formData.logo.replace("https://taearif.com", "");
      let faviconUrl = formData.favicon.replace("https://taearif.com", "");
      if (tempFiles.logo) {
        const result = await uploadSingleFile(tempFiles.logo, "content");
        finalData.logo = result.path.replace("https://taearif.com", "");
        setFormData((prev) => ({
          ...prev,
          logo: result.url,
        }));

        setImagePreviews((prev) => ({
          ...prev,
          logo: result.url,
        }));
      }

      if (tempFiles.favicon) {
        const result = await uploadSingleFile(tempFiles.favicon, "content");
        finalData.favicon = result.path.replace("https://taearif.com", "");
        setFormData((prev) => ({
          ...prev,
          favicon: result.url,
        }));

        setImagePreviews((prev) => ({
          ...prev,
          favicon: result.url,
        }));
      }

      await axiosInstance.put("/content/general", finalData);

      setTempFiles({});

      toast.success("تم تحديث الإعدادات العامة بنجاح");
    } catch (error) {
      toast.error("تعذر حفظ التغييرات");
    } finally {
      setIsLoading(false);
      router.push("/content");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-3">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/content/">
                <Button variant="outline" size="icon" className="h-8 w-8 mr-2">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">الإعدادات العامة</h1>
                <p className="text-muted-foreground">
                  تكوين المعلومات الأساسية لموقعك
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">جاري الحفظ...</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="h-4 w-4 ml-1" />
                  حفظ التغييرات
                </span>
              )}
            </Button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الموقع الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">اسم الموقع</Label>
                  <Input
                    id="site-name"
                    value={formData.site_name}
                    onChange={(e) =>
                      setFormData({ ...formData, site_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">شعار الموقع النصي</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    هذا الشعار سيظهر في نتائج محركات البحث وملخصات المشاركة على
                    وسائل التواصل الاجتماعي.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    سيظهر كعنوان تبويب المتصفح (Tab title).
                  </p>
                </div>
                <div>
                  <Label htmlFor="description">وصف الموقع</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    هذا الوصف سيظهر في نتائج البحث ومشاركات وسائل التواصل
                    الاجتماعي.
                  </p>
                </div>
                <div>
                  <Label>ألوان الموقع</Label>
                  <div className="flex gap-4 mt-2">
                    {["primary_color", "secondary_color", "accent_color"].map(
                      (colorKey) => (
                        <div
                          key={colorKey}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="relative w-12 h-12">
                            {/* العنصر الذي يعكس اللون ويملأ الدائرة */}
                            <div
                              className="absolute inset-0 rounded-full border-2 border-muted"
                              style={{
                                backgroundColor:
                                  formData[colorKey as keyof typeof formData] ||
                                  "#ffffff",
                              }}
                            ></div>
                            {/* حقل اختيار اللون المخفي */}
                            <input
                              type="color"
                              value={
                                formData[colorKey as keyof typeof formData] ||
                                "#ffffff"
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [colorKey]: e.target.value,
                                })
                              }
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground capitalize">
                            {colorKey.replace("_", " ")}
                          </span>
                          <input
                            type="text"
                            value={
                              formData[colorKey as keyof typeof formData] || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [colorKey]: e.target.value,
                              })
                            }
                            className="text-xs w-24 text-center border rounded p-1"
                            placeholder="Hex code"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>شعار الموقع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>شعار الموقع</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {imagePreviews.logo ? (
                      <img
                        src={imagePreviews.logo}
                        alt="Site Logo"
                        className="h-20 w-20 rounded-md object-contain border bg-muted"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                        <span className="text-sm text-muted-foreground">
                          الشعار
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={logoInputRef}
                      onChange={(e) => handleFileSelect(e, "logo")}
                    />
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 ml-1" />
                      {isLoading ? "جاري الرفع..." : "رفع شعار جديد"}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    يفضل استخدام صورة بخلفية شفافة بصيغة PNG أو SVG. الحجم
                    المثالي: 200×60 بكسل.
                  </p>
                </div>

                <div>
                  <Label>أيقونة الموقع (Favicon)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {imagePreviews.favicon ? (
                      <img
                        src={imagePreviews.favicon}
                        alt="Favicon"
                        className="h-10 w-10 rounded-md object-contain border bg-muted"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground">
                          أيقونة
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={faviconInputRef}
                      onChange={(e) => handleFileSelect(e, "favicon")}
                    />
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => faviconInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 ml-1" />
                      {isLoading ? "جاري الرفع..." : "رفع أيقونة جديدة"}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    يفضل استخدام صورة مربعة بصيغة PNG أو ICO. الحجم المثالي:
                    32×32 بكسل.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">وضع الصيانة</Label>
                    <p className="text-sm text-muted-foreground">
                      عند تفعيل هذا الخيار، سيرى الزوار صفحة صيانة بدلاً من
                      موقعك
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={formData.maintenance_mode}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, maintenance_mode: checked })
                    }
                    disabled={userData.is_expired}
                  />
                </div>

                {/* <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-breadcrumb">
                      إظهار شريط التنقل (Breadcrumb)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      إظهار شريط التنقل في الصفحات الفرعية لمساعدة الزوار على
                      التنقل
                    </p>
                  </div>
                  <Switch
                    id="show-breadcrumb"
                    checked={formData.show_breadcrumb}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, show_breadcrumb: checked })
                    }
                  />
                </div> */}

                {/* <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-breadcrumb">
                      الصفحة الرئيسية هي صفحة العقارات
                    </Label>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                  <Switch
                    id="show-properties"
                    checked={formData.show_properties}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, show_properties: checked })
                    }
                  />
                </div> */}
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}
