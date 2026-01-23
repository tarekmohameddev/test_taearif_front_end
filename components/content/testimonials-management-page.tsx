"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ImagePlus, Plus, Save, Star, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TestimonialsManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      position: "مدير شركة تقنية",
      content:
        "تعاملت مع هذه الشركة لأكثر من عامين وكانت تجربة رائعة. الخدمة ممتازة والفريق محترف للغاية.",
      rating: 5,
      hasImage: false,
    },
    {
      id: 2,
      name: "سارة أحمد",
      position: "صاحبة متجر إلكتروني",
      content:
        "ساعدوني في إنشاء متجري الإلكتروني بشكل احترافي وبسرعة قياسية. أنصح بالتعامل معهم.",
      rating: 4,
      hasImage: false,
    },
  ]);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ آراء العملاء بنجاح",
      });
    }, 1000);
  };

  const addNewTestimonial = () => {
    const newId =
      testimonials.length > 0
        ? Math.max(...testimonials.map((t) => t.id)) + 1
        : 1;
    setTestimonials([
      ...testimonials,
      {
        id: newId,
        name: "اسم العميل",
        position: "المسمى الوظيفي",
        content: "رأي العميل حول خدماتك",
        rating: 5,
        hasImage: false,
      },
    ]);
  };

  const removeTestimonial = (id) => {
    setTestimonials(
      testimonials.filter((testimonial) => testimonial.id !== id),
    );
  };

  const updateTestimonial = (id, field, value) => {
    setTestimonials(
      testimonials.map((testimonial) =>
        testimonial.id === id
          ? { ...testimonial, [field]: value }
          : testimonial,
      ),
    );
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
                <h1 className="text-2xl font-bold">آراء العملاء</h1>
                <p className="text-muted-foreground">
                  إدارة شهادات وآراء عملائك
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
                <CardTitle>عنوان القسم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testimonials-title">عنوان القسم</Label>
                  <Input id="testimonials-title" defaultValue="آراء عملائنا" />
                </div>
                <div>
                  <Label htmlFor="testimonials-subtitle">
                    العنوان الفرعي للقسم
                  </Label>
                  <Input
                    id="testimonials-subtitle"
                    defaultValue="ماذا يقول عملاؤنا عنا"
                  />
                </div>
                <div>
                  <Label htmlFor="testimonials-description">وصف القسم</Label>
                  <Textarea
                    id="testimonials-description"
                    defaultValue="نفتخر بآراء عملائنا الكرام ونسعى دائمًا لتقديم أفضل الخدمات لهم."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">آراء العملاء</h3>
              <Button
                onClick={addNewTestimonial}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة رأي جديد
              </Button>
            </div>

            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor={`testimonial-name-${testimonial.id}`}
                            >
                              اسم العميل
                            </Label>
                            <Input
                              id={`testimonial-name-${testimonial.id}`}
                              value={testimonial.name}
                              onChange={(e) =>
                                updateTestimonial(
                                  testimonial.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={`testimonial-position-${testimonial.id}`}
                            >
                              المسمى الوظيفي
                            </Label>
                            <Input
                              id={`testimonial-position-${testimonial.id}`}
                              value={testimonial.position}
                              onChange={(e) =>
                                updateTestimonial(
                                  testimonial.id,
                                  "position",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor={`testimonial-content-${testimonial.id}`}
                          >
                            نص الشهادة
                          </Label>
                          <Textarea
                            id={`testimonial-content-${testimonial.id}`}
                            value={testimonial.content}
                            onChange={(e) =>
                              updateTestimonial(
                                testimonial.id,
                                "content",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor={`testimonial-rating-${testimonial.id}`}
                            >
                              التقييم
                            </Label>
                            <Select
                              value={testimonial.rating.toString()}
                              onValueChange={(value) =>
                                updateTestimonial(
                                  testimonial.id,
                                  "rating",
                                  Number.parseInt(value),
                                )
                              }
                            >
                              <SelectTrigger
                                id={`testimonial-rating-${testimonial.id}`}
                              >
                                <SelectValue placeholder="اختر التقييم" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <SelectItem
                                    key={rating}
                                    value={rating.toString()}
                                  >
                                    <div className="flex items-center">
                                      {Array.from({ length: rating }).map(
                                        (_, i) => (
                                          <Star
                                            key={i}
                                            className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-0.5"
                                          />
                                        ),
                                      )}
                                      {Array.from({ length: 5 - rating }).map(
                                        (_, i) => (
                                          <Star
                                            key={i}
                                            className="h-4 w-4 text-muted-foreground mr-0.5"
                                          />
                                        ),
                                      )}
                                      <span className="mr-2">
                                        {rating} من 5
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <Label>صورة العميل</Label>
                            <div className="mt-2 flex h-20 cursor-pointer items-center justify-center rounded-md border border-dashed">
                              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <ImagePlus className="h-6 w-6" />
                                <span className="text-xs">انقر لرفع صورة</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {testimonials.length > 1 && (
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeTestimonial(testimonial.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات العرض</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="display-style">نمط العرض</Label>
                  <Select defaultValue="slider">
                    <SelectTrigger id="display-style">
                      <SelectValue placeholder="اختر نمط العرض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slider">سلايدر</SelectItem>
                      <SelectItem value="grid">شبكة</SelectItem>
                      <SelectItem value="list">قائمة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="testimonials-per-view">
                    عدد الآراء المعروضة في وقت واحد
                  </Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="testimonials-per-view">
                      <SelectValue placeholder="اختر العدد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    عدد آراء العملاء التي ستظهر في وقت واحد (في حالة السلايدر)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
}
