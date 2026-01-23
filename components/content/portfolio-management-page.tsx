"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, Save, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function PortfolioManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: "موقع متجر إلكتروني",
      category: "web-development",
      image: "/placeholder.svg?height=300&width=400",
      description: "موقع متجر إلكتروني متكامل مع سلة تسوق وبوابة دفع",
      link: "https://example.com/project1",
    },
    {
      id: 2,
      title: "تصميم تطبيق جوال",
      category: "ui-design",
      image: "/placeholder.svg?height=300&width=400",
      description: "تصميم واجهة مستخدم لتطبيق لياقة بدنية",
      link: "https://example.com/project2",
    },
    {
      id: 3,
      title: "هوية بصرية",
      category: "branding",
      image: "/placeholder.svg?height=300&width=400",
      description: "تصميم هوية بصرية كاملة لمقهى محلي",
      link: "https://example.com/project3",
    },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: "تطوير الويب", slug: "web-development" },
    { id: 2, name: "تصميم واجهات", slug: "ui-design" },
    { id: 3, name: "هوية بصرية", slug: "branding" },
  ]);

  const handleAddItem = () => {
    const newId =
      portfolioItems.length > 0
        ? Math.max(...portfolioItems.map((p) => p.id)) + 1
        : 1;
    setPortfolioItems([
      ...portfolioItems,
      {
        id: newId,
        title: "مشروع جديد",
        category: categories[0].slug,
        image: "/placeholder.svg?height=300&width=400",
        description: "وصف المشروع هنا",
        link: "",
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setPortfolioItems(
      portfolioItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم حفظ معرض الأعمال بنجاح!");
    }, 1000);
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
                <h1 className="text-2xl font-bold">معرض الأعمال</h1>
                <p className="text-muted-foreground">
                  إدارة مشاريعك وأعمالك السابقة
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إعدادات معرض الأعمال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portfolio-title">عنوان القسم</Label>
                <Input id="portfolio-title" defaultValue="معرض أعمالنا" />
              </div>
              <div>
                <Label htmlFor="portfolio-subtitle">العنوان الفرعي للقسم</Label>
                <Input
                  id="portfolio-subtitle"
                  defaultValue="مشاريعنا السابقة"
                />
              </div>
              <div>
                <Label htmlFor="portfolio-description">وصف القسم</Label>
                <Textarea
                  id="portfolio-description"
                  defaultValue="نفخر بتقديم نماذج من أعمالنا السابقة. كل مشروع يعكس جودة خدماتنا واحترافيتنا."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">المشاريع</h3>
            <Button onClick={handleAddItem} className="flex items-center gap-1">
              <Plus className="h-4 w-4 ml-1" />
              إضافة مشروع جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                    {categories.find((c) => c.slug === item.category)?.name ||
                      item.category}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <Input
                    className="mb-2"
                    placeholder="عنوان المشروع"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(item.id, "title", e.target.value)
                    }
                  />
                  <Select
                    value={item.category}
                    onValueChange={(value) =>
                      updateItem(item.id, "category", value)
                    }
                    className="mb-2"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="وصف المشروع"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    className="mb-2"
                  />
                  <Input
                    placeholder="رابط المشروع (اختياري)"
                    value={item.link}
                    onChange={(e) =>
                      updateItem(item.id, "link", e.target.value)
                    }
                  />
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Upload className="h-4 w-4 ml-1" />
                    تغيير الصورة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>إدارة التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full"
                    >
                      <span>{category.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => {
                          if (
                            portfolioItems.some(
                              (item) => item.category === category.slug,
                            )
                          ) {
                            alert(
                              "لا يمكن حذف هذا التصنيف لأنه يحتوي على مشاريع",
                            );
                            return;
                          }
                          setCategories(
                            categories.filter((c) => c.id !== category.id),
                          );
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input placeholder="اسم التصنيف الجديد" id="new-category" />
                  <Button>إضافة تصنيف</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
