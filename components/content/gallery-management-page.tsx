"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GalleryManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([
    { id: 1, title: "صورة 1", category: "عام" },
    { id: 2, title: "صورة 2", category: "عام" },
    { id: 3, title: "صورة 3", category: "عام" },
    { id: 4, title: "صورة 4", category: "عام" },
    { id: 5, title: "صورة 5", category: "عام" },
  ]);
  const [categories, setCategories] = useState([
    "عام",
    "مشاريع",
    "فريق العمل",
    "أحداث",
  ]);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم حفظ معرض الصور بنجاح");
    }, 1000);
  };

  const addNewImage = () => {
    const newId =
      images.length > 0 ? Math.max(...images.map((img) => img.id)) + 1 : 1;
    setImages([
      ...images,
      {
        id: newId,
        title: `صورة ${newId}`,
        category: "عام",
      },
    ]);
  };

  const removeImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const updateImage = (id, field, value) => {
    setImages(
      images.map((image) =>
        image.id === id ? { ...image, [field]: value } : image,
      ),
    );
  };

  const addNewCategory = () => {
    const categoryName = prompt("أدخل اسم التصنيف الجديد");
    if (categoryName && !categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
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
                <h1 className="text-2xl font-bold">معرض الصور</h1>
                <p className="text-muted-foreground">
                  إدارة معرض الصور على موقعك
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
                <CardTitle>عنوان المعرض</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gallery-title">عنوان المعرض</Label>
                  <Input id="gallery-title" defaultValue="معرض أعمالنا" />
                </div>
                <div>
                  <Label htmlFor="gallery-description">وصف المعرض</Label>
                  <Input
                    id="gallery-description"
                    defaultValue="تصفح أحدث مشاريعنا وإنجازاتنا"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">صور المعرض</h3>
              <Button onClick={addNewImage} className="flex items-center gap-1">
                <Plus className="h-4 w-4 ml-1" />
                إضافة صورة
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => removeImage(image.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div>
                        <Label
                          htmlFor={`image-title-${image.id}`}
                          className="text-xs"
                        >
                          عنوان الصورة
                        </Label>
                        <Input
                          id={`image-title-${image.id}`}
                          value={image.title}
                          onChange={(e) =>
                            updateImage(image.id, "title", e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`image-category-${image.id}`}
                          className="text-xs"
                        >
                          التصنيف
                        </Label>
                        <Select
                          value={image.category}
                          onValueChange={(value) =>
                            updateImage(image.id, "category", value)
                          }
                        >
                          <SelectTrigger
                            id={`image-category-${image.id}`}
                            className="h-8 text-sm"
                          >
                            <SelectValue placeholder="اختر التصنيف" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed"
                onClick={addNewImage}
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Plus className="h-8 w-8" />
                  <span className="text-xs">إضافة صورة</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تصنيفات الصور</CardTitle>
                <Button
                  size="sm"
                  onClick={addNewCategory}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة تصنيف
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="rounded-full bg-muted px-3 py-1 text-sm"
                    >
                      {category}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  التصنيفات تساعد زوار موقعك على تصفية الصور حسب اهتماماتهم
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات العرض</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="display-style">نمط العرض</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger id="display-style">
                      <SelectValue placeholder="اختر نمط العرض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">شبكة</SelectItem>
                      <SelectItem value="masonry">متدرج</SelectItem>
                      <SelectItem value="slider">سلايدر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="images-per-row">عدد الصور في الصف</Label>
                  <Select defaultValue="4">
                    <SelectTrigger id="images-per-row">
                      <SelectValue placeholder="اختر العدد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 صور</SelectItem>
                      <SelectItem value="4">4 صور</SelectItem>
                      <SelectItem value="5">5 صور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="enable-lightbox">
                    تفعيل عارض الصور المكبر
                  </Label>
                  <Select defaultValue="true">
                    <SelectTrigger id="enable-lightbox">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">مفعل</SelectItem>
                      <SelectItem value="false">غير مفعل</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    عارض الصور المكبر يتيح للزوار النقر على الصور لعرضها بحجم
                    أكبر
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
}
