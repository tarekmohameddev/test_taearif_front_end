"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Grip, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ServicesManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([
    {
      id: 1,
      title: "تصميم المواقع",
      description:
        "نقدم خدمات تصميم مواقع احترافية تناسب احتياجات عملك وتعكس هويتك التجارية بشكل مميز.",
      icon: "Palette",
    },
    {
      id: 2,
      title: "تطوير التطبيقات",
      description:
        "نطور تطبيقات متميزة للهواتف الذكية والويب باستخدام أحدث التقنيات لتحسين تجربة المستخدم.",
      icon: "Code",
    },
    {
      id: 3,
      title: "التسويق الرقمي",
      description:
        "نساعدك على الوصول إلى جمهورك المستهدف من خلال استراتيجيات تسويقية فعالة ومبتكرة.",
      icon: "BarChart",
    },
  ]);

  const iconOptions = [
    "Palette",
    "Code",
    "BarChart",
    "ShoppingCart",
    "Camera",
    "Briefcase",
    "Heart",
    "Star",
    "Zap",
    "Coffee",
    "Truck",
    "Headphones",
    "Globe",
    "Shield",
    "Award",
    "Gift",
    "MessageCircle",
    "Smartphone",
  ];

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم حفظ خدماتك بنجاح");
    }, 1000);
  };

  const addNewService = () => {
    const newId =
      services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    setServices([
      ...services,
      {
        id: newId,
        title: "خدمة جديدة",
        description: "وصف الخدمة الجديدة",
        icon: "Star",
      },
    ]);
  };

  const removeService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const updateService = (id, field, value) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
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
                <h1 className="text-2xl font-bold">خدماتنا</h1>
                <p className="text-muted-foreground">
                  إدارة الخدمات التي تقدمها شركتك
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
                <CardTitle>عنوان ووصف القسم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services-title">عنوان القسم</Label>
                  <Input id="services-title" defaultValue="خدماتنا" />
                </div>
                <div>
                  <Label htmlFor="services-description">وصف القسم</Label>
                  <Textarea
                    id="services-description"
                    defaultValue="نقدم مجموعة واسعة من الخدمات لتلبية احتياجاتك. فريقنا من الخبراء مكرس لتقديم أعلى جودة من الخدمة."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">الخدمات</h3>
              <Button
                onClick={addNewService}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة خدمة
              </Button>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 cursor-move text-muted-foreground">
                        <Grip className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label htmlFor={`service-title-${service.id}`}>
                            عنوان الخدمة
                          </Label>
                          <Input
                            id={`service-title-${service.id}`}
                            value={service.title}
                            onChange={(e) =>
                              updateService(service.id, "title", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`service-description-${service.id}`}>
                            وصف الخدمة
                          </Label>
                          <Textarea
                            id={`service-description-${service.id}`}
                            value={service.description}
                            onChange={(e) =>
                              updateService(
                                service.id,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`service-icon-${service.id}`}>
                            الأيقونة
                          </Label>
                          <Select
                            value={service.icon}
                            onValueChange={(value) =>
                              updateService(service.id, "icon", value)
                            }
                          >
                            <SelectTrigger id={`service-icon-${service.id}`}>
                              <SelectValue placeholder="اختر أيقونة" />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="mt-1 text-xs text-muted-foreground">
                            اختر أيقونة تعبر عن هذه الخدمة
                          </p>
                        </div>
                      </div>
                      {services.length > 1 && (
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeService(service.id)}
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
                  <Label htmlFor="services-per-row">عدد الخدمات في الصف</Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="services-per-row">
                      <SelectValue placeholder="اختر عدد الخدمات في الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 خدمات في الصف</SelectItem>
                      <SelectItem value="3">3 خدمات في الصف</SelectItem>
                      <SelectItem value="4">4 خدمات في الصف</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    عدد الخدمات التي ستظهر في كل صف على الشاشات الكبيرة
                  </p>
                </div>
                <div>
                  <Label htmlFor="services-style">نمط عرض الخدمات</Label>
                  <Select defaultValue="cards">
                    <SelectTrigger id="services-style">
                      <SelectValue placeholder="اختر نمط العرض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">بطاقات</SelectItem>
                      <SelectItem value="list">قائمة</SelectItem>
                      <SelectItem value="grid">شبكة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}
