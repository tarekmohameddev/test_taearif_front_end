"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  CalendarIcon,
  ChevronLeft,
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";

// تعريف الواجهات
interface ICategory {
  id: number;
  name: string;
}

interface IFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
}

export default function AddBlogPage(): JSX.Element {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("blog");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft",
    tags: "",
    seoTitle: "",
    seoDescription: "",
  });

  // جلب التصنيفات من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_Backend_URL}/blog-categories`,
        );
        // نفترض أن الاستجابة تكون بالشكل { status: "success", data: { categories: [...] } }
        setCategories(response.data.data.categories);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // في التطبيق الحقيقي يتم رفع الصور للسيرفر
      const newImages = Array.from(files).map(
        (_, index) =>
          `/placeholder.svg?height=200&width=350&text=صورة+${selectedImages.length + index + 1}`,
      );
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const requestBody = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      status: formData.status,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      seo_title: formData.seoTitle,
      seo_description: formData.seoDescription,
      featured_image: selectedImages[0] || "",
      published_at: date ? format(date, "yyyy-MM-dd HH:mm:ss") : null,
      featured: false,
    };

    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/blogs`,
        requestBody,
      );
      toast.success(`تم إضافة التدوينة بنجاح`);
      router.push("/blogs");
    } catch (error: any) {
      console.error("Error submitting blog:", error);
      toast.error(`خطا في الاضافة : "${error}"`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/blogs")}
                  aria-label="العودة"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    إضافة مقال جديد
                  </h1>
                  <p className="text-muted-foreground">
                    أنشئ محتوى جديد لمدونتك
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>حفظ المقال</span>
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6 md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>معلومات المقال</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">عنوان المقال</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="أدخل عنوان المقال"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">ملخص المقال</Label>
                        <Textarea
                          id="excerpt"
                          name="excerpt"
                          placeholder="أدخل ملخصًا قصيرًا للمقال"
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">محتوى المقال</Label>
                        <Textarea
                          id="content"
                          name="content"
                          placeholder="أدخل محتوى المقال الكامل"
                          value={formData.content}
                          onChange={handleInputChange}
                          rows={10}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>تحسين محركات البحث (SEO)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="seoTitle">عنوان SEO</Label>
                        <Input
                          id="seoTitle"
                          name="seoTitle"
                          placeholder="عنوان لمحركات البحث"
                          value={formData.seoTitle}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seoDescription">وصف SEO</Label>
                        <Textarea
                          id="seoDescription"
                          name="seoDescription"
                          placeholder="وصف قصير لمحركات البحث"
                          value={formData.seoDescription}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6 md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>الصورة الرئيسية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-4 grid-cols-2">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`صورة ${index + 1}`}
                                className="h-[150px] w-full rounded-md object-cover border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          {selectedImages.length < 4 && (
                            <div className="flex items-center justify-center h-[150px] border border-dashed rounded-md">
                              <Label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                              >
                                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">
                                  إضافة صورة
                                </span>
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageUpload}
                                  multiple
                                />
                              </Label>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          يمكنك إضافة حتى 4 صور. الصورة الأولى ستكون الصورة
                          الرئيسية للمقال.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>التصنيف والكلمات المفتاحية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">التصنيف</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleSelectChange("category", value)
                          }
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="اختر تصنيفًا" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">الكلمات المفتاحية</Label>
                        <Input
                          id="tags"
                          name="tags"
                          placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
                          value={formData.tags}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-muted-foreground">
                          مثال: تصميم داخلي، ديكور، أثاث
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>النشر</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>حالة المقال</Label>
                        <RadioGroup
                          value={formData.status}
                          onValueChange={(value) =>
                            handleSelectChange("status", value)
                          }
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="published" id="published" />
                            <Label htmlFor="published" className="font-normal">
                              نشر الآن
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="draft" id="draft" />
                            <Label htmlFor="draft" className="font-normal">
                              حفظ كمسودة
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="scheduled" id="scheduled" />
                            <Label htmlFor="scheduled" className="font-normal">
                              جدولة النشر
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.status === "scheduled" && (
                        <div className="space-y-2">
                          <Label>تاريخ النشر</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-right font-normal",
                                  !date && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {date
                                  ? format(date, "PPP", { locale: ar })
                                  : "اختر تاريخًا"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                locale={ar}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
  );
}
