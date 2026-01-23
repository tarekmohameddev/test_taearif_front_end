"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import useStore from "@/context/Store";

interface BannerSettings {
  banner_type: string;
  static: {
    image: string;
    title: string;
    subtitle: string;
    caption: string;
    showButton: boolean;
    buttonText: string;
    buttonUrl: string;
  };
  slider: {
    slides: Array<{
      id: string;
      image: string;
      title: string;
      subtitle: string;
      caption: string;
      showButton: boolean;
      buttonText: string;
      buttonUrl: string;
    }>;
    autoplay: boolean;
    autoplaySpeed: number;
    showArrows: boolean;
    showDots: boolean;
    animation?: string;
    overlayColor?: string;
    textColor?: string;
  };
}

export function BannerSectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bannerType, setBannerType] = useState("static");
  const [bannerData, setBannerData] = useState<BannerSettings | null>(null);
  const {
    homepage: { setupProgressData, fetchSetupProgressData },
  } = useStore();
  const staticFileInputRef = useRef(null);
  const [staticBannerImage, setStaticBannerImage] = useState<string | null>(
    null,
  );
  const [staticBannerFile, setStaticBannerFile] = useState<File | null>(null);
  const [sliders, setSliders] = useState<
    Array<{
      id: string;
      title: string;
      subtitle: string;
      caption: string;
      hasButton: boolean;
      buttonText: string;
      buttonLink: string;
      image: string | null;
      file: File | null;
    }>
  >([]);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axiosInstance.get("/content/banner");
        const data = response.data.data.settings;
        setBannerData(data);
        setBannerType(data.banner_type);
        setStaticBannerImage(data.static?.image || null);

        if (data.slider?.slides) {
          const formattedSlides = data.slider.slides.map((slide) => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            caption: slide.caption || "",
            hasButton: slide.showButton,
            buttonText: slide.buttonText,
            buttonLink: slide.buttonUrl,
            image: slide.image,
            file: null,
          }));
          setSliders(formattedSlides);
        }
      } catch (error) {
        toast.error("فشل في جلب بيانات البانر");
      }
    };

    fetchBannerData();
  }, []);

  const handleStatusChange = (value) => {
    setBannerData({
      ...bannerData,
      status: value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let staticImageUrl = bannerData?.static?.image || "";
      let staticImagePath = staticImageUrl;

      if (bannerType === "static" && staticBannerFile) {
        const uploadResult = await uploadSingleFile(
          staticBannerFile,
          "content",
        );
        staticImageUrl = uploadResult.url;
        staticImagePath = uploadResult.path;
        setStaticBannerImage(uploadResult.url);
      } else if (bannerType === "static" && staticBannerImage === null) {
        staticImagePath = "";
      }
      const updatedSlides = await Promise.all(
        sliders.map(async (slide) => {
          if (slide.file) {
            const uploadResult = await uploadSingleFile(slide.file, "content");
            return {
              ...slide,
              image: uploadResult.url,
              imagePath: uploadResult.path,
            };
          } else if (slide.image === null) {
            return { ...slide, image: "", imagePath: "" };
          }
          return { ...slide, imagePath: slide.image };
        }),
      );

      setSliders(
        updatedSlides.map((slide) => ({
          ...slide,
          file: null,
        })),
      );

      const formData = {
        banner_type: bannerType,
        status: bannerData?.status,
        static: {
          enabled: bannerType === "static",
          image: staticImagePath.replace("https://taearif.com", ""),
          title: bannerData?.static?.title || "",
          subtitle: bannerData?.static?.subtitle || "",
          caption: bannerData?.static?.caption || "",
          showButton: bannerData?.static?.showButton || false,
          buttonText: bannerData?.static?.buttonText || "",
          buttonUrl: bannerData?.static?.buttonUrl || "",
          buttonStyle: bannerData?.static?.buttonStyle || "primary",
          textAlignment: bannerData?.static?.textAlignment || "center",
          overlayColor:
            bannerData?.static?.overlayColor || "rgba(0, 0, 0, 0.5)",
          textColor: bannerData?.static?.textColor || "#ffffff",
        },
        slider: {
          enabled: bannerType === "slider",
          slides: updatedSlides.map((slide) => ({
            id: slide.id,
            image: (slide.imagePath || slide.image).replace(
              "https://taearif.com",
              "",
            ),
            title: slide.title,
            subtitle: slide.subtitle,
            caption: slide.caption || "",
            showButton: slide.hasButton,
            buttonText: slide.buttonText,
            buttonUrl: slide.buttonLink,
            buttonStyle: "primary",
            textAlignment: "center",
            enabled: true,
          })),
          autoplay: bannerData?.slider?.autoplay || false,
          autoplaySpeed: bannerData?.slider?.autoplaySpeed || 5000,
          showArrows: bannerData?.slider?.showArrows || false,
          showDots: bannerData?.slider?.showDots || false,
          animation: bannerData?.slider?.animation || "fade",
          overlayColor:
            bannerData?.slider?.overlayColor || "rgba(0, 0, 0, 0.6)",
          textColor: bannerData?.slider?.textColor || "#ffffff",
        },
        common: {
          height: "large",
          showSearchBox: true,
          searchBoxPosition: "center",
          responsive: true,
          fullWidth: true,
        },
      };
      const setpOB = {
        step: "banner",
      };
      await axiosInstance.post("/steps/complete", setpOB);
      await axiosInstance.post("/content/banner", formData);
      await fetchSetupProgressData();
      toast.success("تم تحديث إعدادات البانر بنجاح");
    } catch (error) {
      toast.error("فشل في حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };
  const addNewSlide = () => {
    const newId =
      sliders.length > 0
        ? String(Math.max(...sliders.map((s) => Number(s.id))) + 1)
        : "1";
    setSliders([
      ...sliders,
      {
        id: newId,
        title: "عنوان جديد",
        subtitle: "عنوان فرعي جديد",
        caption: "وصف الشريحة الجديدة",
        hasButton: true,
        buttonText: "اضغط هنا",
        buttonLink: "/",
        image: null,
        file: null,
      },
    ]);
  };

  const removeSlide = (id) => {
    setSliders(sliders.filter((slide) => slide.id !== id));
  };

  const updateSlide = (id, field, value) => {
    setSliders(
      sliders.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide,
      ),
    );
  };

  const handleStaticImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStaticBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setStaticBannerImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlideImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSliders(
          sliders.map((slide) =>
            slide.id === id
              ? { ...slide, image: e.target.result, file }
              : slide,
          ),
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeStaticImage = () => {
    setStaticBannerImage(null);
    setStaticBannerFile(null);
    if (staticFileInputRef.current) {
      staticFileInputRef.current.value = "";
    }
  };

  const removeSlideImage = (id) => {
    setSliders(
      sliders.map((slide) =>
        slide.id === id ? { ...slide, image: null, file: null } : slide,
      ),
    );
    const fileInput = document.getElementById(`slide-image-input-${id}`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

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
                <h1 className="text-2xl font-bold">قسم البانر</h1>
                <p className="text-muted-foreground">
                  تكوين قسم البانر الرئيسي لموقعك
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

          <div className="flex flex-col space-y-8 p-6">
            <button
              onClick={() =>
                handleStatusChange(bannerData?.status === true ? false : true)
              }
              className={`relative flex h-12 w-[160px] items-center rounded-full px-4 transition-colors duration-500 ${
                bannerData?.status === true ? "bg-black" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute text-sm font-medium ${
                  bannerData?.status === true
                    ? "left-6 text-white"
                    : "right-5 text-gray-600"
                } transition-[left,right] duration-1000 ease-in-out`}
              >
                {bannerData?.status === true
                  ? "البانر مفعل"
                  : "البانر غير مفعل"}
              </span>

              <div
                className={`absolute h-10 w-10 rounded-full bg-white shadow-md transition-transform duration-1000 ease-in-out ${
                  bannerData?.status === true
                    ? "translate-x-0"
                    : "translate-x-[-112px]"
                }`}
                style={{ right: "4px" }}
              />
            </button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>نوع البانر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="static-banner"
                        name="banner-type"
                        className="h-4 w-4 text-primary"
                        checked={bannerType === "static"}
                        onChange={() => setBannerType("static")}
                      />
                      <Label htmlFor="static-banner" className="mr-2">
                        بانر ثابت
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="slider-banner"
                        name="banner-type"
                        className="h-4 w-4 text-primary"
                        checked={bannerType === "slider"}
                        onChange={() => setBannerType("slider")}
                      />
                      <Label htmlFor="slider-banner" className="mr-2">
                        بانر متحرك (سلايدر)
                      </Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    البانر الثابت يعرض صورة واحدة مع نص، بينما البانر المتحرك
                    يعرض عدة شرائح متغيرة.
                  </p>
                </div>
              </CardContent>
            </Card>

            {bannerType === "static" ? (
              <Card>
                <CardHeader>
                  <CardTitle>محتوى البانر الثابت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="banner-title">عنوان البانر</Label>
                    <Input
                      id="banner-title"
                      value={bannerData?.static?.title || ""}
                      onChange={(e) =>
                        setBannerData((prev) => ({
                          ...prev!,
                          static: {
                            ...prev!.static,
                            title: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner-subtitle">
                      العنوان الفرعي للبانر
                    </Label>
                    <Input
                      id="banner-subtitle"
                      value={bannerData?.static?.subtitle || ""}
                      onChange={(e) =>
                        setBannerData((prev) => ({
                          ...prev!,
                          static: {
                            ...prev!.static,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner-caption">وصف البانر</Label>
                    <Textarea
                      id="banner-caption"
                      value={bannerData?.static?.caption || ""}
                      onChange={(e) =>
                        setBannerData((prev) => ({
                          ...prev!,
                          static: {
                            ...prev!.static,
                            caption: e.target.value,
                          },
                        }))
                      } // تم إصلاح الأقواس هنا
                    />
                  </div>

                  <div>
                    <Label>صورة البانر</Label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={staticFileInputRef}
                      onChange={handleStaticImageUpload}
                      id="static-banner-image"
                    />
                    {staticBannerImage ? (
                      <div className="mt-2 relative">
                        <div className="relative h-40 w-full rounded-md overflow-hidden">
                          <Image
                            src={staticBannerImage || "/placeholder.svg"}
                            alt="صورة البانر"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 left-2 h-8 w-8"
                          onClick={removeStaticImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="mt-2 flex h-40 cursor-pointer items-center justify-center rounded-md border border-dashed"
                        onClick={() =>
                          document.getElementById("static-banner-image").click()
                        }
                      >
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <ImagePlus className="h-8 w-8" />
                          <span>انقر لرفع صورة</span>
                          <span className="text-xs">
                            الحجم الموصى به: 1920×1080 بكسل
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-cta">عرض زر الدعوة للعمل</Label>
                      <p className="text-sm text-muted-foreground">
                        عرض زر دعوة للعمل في البانر
                      </p>
                    </div>
                    <Switch
                      id="show-cta"
                      checked={bannerData?.static?.showButton || false}
                      onCheckedChange={(checked) => {
                        setBannerData((prev) => ({
                          ...prev!,
                          static: {
                            ...prev!.static,
                            showButton: checked,
                          },
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta-text">نص الزر</Label>
                    <Input
                      id="cta-text"
                      value={bannerData?.static?.buttonText || ""}
                      onChange={(e) =>
                        setBannerData((prev) => ({
                          ...prev!,
                          static: {
                            ...prev!.static,
                            buttonText: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta-link">رابط الزر</Label>
                    <Input
                      id="cta-link"
                      value={bannerData?.static?.buttonUrl || ""}
                      onChange={(e) =>
                        setBannerData((prev) => ({
                          ...prev!,
                          static: {
                            ...prev!.static,
                            buttonUrl: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">شرائح البانر المتحرك</h3>
                  <Button
                    onClick={addNewSlide}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة شريحة جديدة
                  </Button>
                </div>

                <Tabs
                  defaultValue={`slide-${sliders[0]?.id}`}
                  className="w-full"
                >
                  <TabsList className="mb-4 flex flex-wrap">
                    {sliders.map((slide, index) => (
                      <TabsTrigger
                        key={slide.id}
                        value={`slide-${slide.id}`}
                        className="relative"
                      >
                        الشريحة {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {sliders.map((slide, index) => (
                    <TabsContent key={slide.id} value={`slide-${slide.id}`}>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>الشريحة {index + 1}</CardTitle>
                          {sliders.length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeSlide(slide.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4 ml-1" />
                              حذف الشريحة
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor={`slide-title-${slide.id}`}>
                              عنوان الشريحة
                            </Label>
                            <Input
                              id={`slide-title-${slide.id}`}
                              value={slide.title}
                              onChange={(e) =>
                                updateSlide(slide.id, "title", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`slide-subtitle-${slide.id}`}>
                              العنوان الفرعي
                            </Label>
                            <Input
                              id={`slide-subtitle-${slide.id}`}
                              value={slide.subtitle}
                              onChange={(e) =>
                                updateSlide(
                                  slide.id,
                                  "subtitle",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`slide-caption-${slide.id}`}>
                              وصف الشريحة
                            </Label>
                            <Textarea
                              id={`slide-caption-${slide.id}`}
                              value={slide.caption}
                              onChange={(e) =>
                                updateSlide(slide.id, "caption", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>صورة الشريحة</Label>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id={`slide-image-input-${slide.id}`}
                              onChange={(e) =>
                                handleSlideImageUpload(slide.id, e)
                              }
                            />
                            {slide.image ? (
                              <div className="mt-2 relative">
                                <div className="relative h-40 w-full rounded-md overflow-hidden">
                                  <Image
                                    src={slide.image || "/placeholder.svg"}
                                    alt={`صورة الشريحة ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 left-2 h-8 w-8"
                                  onClick={() => removeSlideImage(slide.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="mt-2 flex h-40 cursor-pointer items-center justify-center rounded-md border border-dashed"
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `slide-image-input-${slide.id}`,
                                    )
                                    .click()
                                }
                              >
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                  <ImagePlus className="h-8 w-8" />
                                  <span>انقر لرفع صورة</span>
                                  <span className="text-xs">
                                    الحجم الموصى به: 1920×1080 بكسل
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor={`slide-show-button-${slide.id}`}>
                                عرض زر
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                عرض زر في هذه الشريحة
                              </p>
                            </div>
                            <Switch
                              id={`slide-show-button-${slide.id}`}
                              checked={slide.hasButton}
                              onCheckedChange={(checked) => {
                                updateSlide(slide.id, "hasButton", checked);
                              }}
                            />
                          </div>
                          {slide.hasButton && (
                            <>
                              <div>
                                <Label
                                  htmlFor={`slide-button-text-${slide.id}`}
                                >
                                  نص الزر
                                </Label>
                                <Input
                                  id={`slide-button-text-${slide.id}`}
                                  value={slide.buttonText}
                                  onChange={(e) =>
                                    updateSlide(
                                      slide.id,
                                      "buttonText",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`slide-button-link-${slide.id}`}
                                >
                                  رابط الزر
                                </Label>
                                <Input
                                  id={`slide-button-link-${slide.id}`}
                                  value={slide.buttonLink}
                                  onChange={(e) =>
                                    updateSlide(
                                      slide.id,
                                      "buttonLink",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات السلايدر</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-play">تشغيل تلقائي</Label>
                        <p className="text-sm text-muted-foreground">
                          تغيير الشرائح تلقائيًا
                        </p>
                      </div>
                      <Switch
                        id="auto-play"
                        checked={bannerData?.slider?.autoplay || false}
                        onCheckedChange={(checked) => {
                          setBannerData((prev) => ({
                            ...prev!,
                            slider: {
                              ...prev!.slider,
                              autoplay: checked,
                            },
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slide-interval">
                        الفاصل الزمني (بالثواني)
                      </Label>
                      <Input
                        id="slide-interval"
                        type="number"
                        value={
                          bannerData?.slider?.autoplaySpeed
                            ? bannerData.slider.autoplaySpeed / 1000
                            : 5
                        }
                        onChange={(e) =>
                          setBannerData((prev) => ({
                            ...prev!,
                            slider: {
                              ...prev!.slider,
                              autoplaySpeed: Number(e.target.value) * 1000,
                            },
                          }))
                        }
                        min="1"
                        max="20"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        المدة الزمنية بين كل شريحة والتي تليها (بالثواني)
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-arrows">عرض أسهم التنقل</Label>
                        <p className="text-sm text-muted-foreground">
                          عرض أسهم للتنقل بين الشرائح
                        </p>
                      </div>
                      <Switch
                        id="show-arrows"
                        checked={bannerData?.slider?.showArrows || false}
                        onCheckedChange={(checked) =>
                          setBannerData((prev) => ({
                            ...prev!,
                            slider: {
                              ...prev!.slider,
                              showArrows: checked,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-dots">عرض نقاط التنقل</Label>
                        <p className="text-sm text-muted-foreground">
                          عرض نقاط للتنقل بين الشرائح
                        </p>
                      </div>
                      <Switch
                        id="show-dots"
                        checked={bannerData?.slider?.showDots || false}
                        onCheckedChange={(checked) =>
                          setBannerData((prev) => ({
                            ...prev!,
                            slider: {
                              ...prev!.slider,
                              showDots: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
  );
}
