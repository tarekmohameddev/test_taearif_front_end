"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, Save, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WhyChooseUsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [reasons, setReasons] = useState([
    {
      id: 1,
      title: "فريق متخصص",
      description: "فريقنا يتمتع بأكثر من 10 سنوات من الخبرة في المجال",
      icon: "users",
    },
    {
      id: 2,
      title: "خدمة عالية الجودة",
      description: "نقدم خدمة متميزة مع الاهتمام بأدق التفاصيل",
      icon: "badge-check",
    },
    {
      id: 3,
      title: "دعم على مدار الساعة",
      description: "فريق الدعم متاح طوال اليوم لمساعدتك",
      icon: "headphones",
    },
    {
      id: 4,
      title: "أسعار مناسبة",
      description: "أسعار تنافسية دون المساس بالجودة",
      icon: "dollar-sign",
    },
  ]);

  const [sectionTitle, setSectionTitle] = useState("لماذا تختارنا");
  const [sectionDescription, setSectionDescription] = useState(
    "نحن نفتخر بتقديم خدمة استثنائية وقيمة لعملائنا. إليك أسباب اختيارنا لمشروعك القادم.",
  );

  const [newReason, setNewReason] = useState({
    title: "",
    description: "",
    icon: "star",
  });

  const iconOptions = [
    { value: "users", label: "فريق" },
    { value: "badge-check", label: "جودة" },
    { value: "headphones", label: "دعم" },
    { value: "dollar-sign", label: "سعر" },
    { value: "star", label: "نجمة" },
    { value: "shield", label: "حماية" },
    { value: "clock", label: "وقت" },
    { value: "award", label: "جائزة" },
    { value: "thumbs-up", label: "إعجاب" },
    { value: "heart", label: "قلب" },
  ];

  const handleAddReason = () => {
    if (newReason.title.trim() === "") return;

    setReasons([
      ...reasons,
      {
        id: Date.now(),
        title: newReason.title,
        description: newReason.description,
        icon: newReason.icon,
      },
    ]);

    setNewReason({
      title: "",
      description: "",
      icon: "star",
    });
  };

  const handleRemoveReason = (id) => {
    setReasons(reasons.filter((reason) => reason.id !== id));
  };

  const handleMoveUp = (id) => {
    const index = reasons.findIndex((reason) => reason.id === id);
    if (index <= 0) return;

    const newReasons = [...reasons];
    [newReasons[index - 1], newReasons[index]] = [
      newReasons[index],
      newReasons[index - 1],
    ];
    setReasons(newReasons);
  };

  const handleMoveDown = (id) => {
    const index = reasons.findIndex((reason) => reason.id === id);
    if (index >= reasons.length - 1) return;

    const newReasons = [...reasons];
    [newReasons[index], newReasons[index + 1]] = [
      newReasons[index + 1],
      newReasons[index],
    ];
    setReasons(newReasons);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success toast
      alert("تم حفظ قسم لماذا تختارنا بنجاح!");
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
                <h1 className="text-2xl font-bold">لماذا تختارنا</h1>
                <p className="text-muted-foreground">
                  إدارة قسم لماذا تختارنا في موقعك
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
              <CardTitle>إعدادات القسم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section-title">عنوان القسم</Label>
                <Input
                  id="section-title"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-description">وصف القسم</Label>
                <Textarea
                  id="section-description"
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إدارة الأسباب</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                أضف أسبابًا مقنعة لماذا يجب على العملاء اختيار شركتك. كل سبب يجب
                أن يحتوي على عنوان ووصف ورمز.
              </p>

              <div className="space-y-4">
                {reasons.map((reason, index) => (
                  <div
                    key={reason.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          {reason.icon === "users" && (
                            <span className="text-lg">👥</span>
                          )}
                          {reason.icon === "badge-check" && (
                            <span className="text-lg">✓</span>
                          )}
                          {reason.icon === "headphones" && (
                            <span className="text-lg">🎧</span>
                          )}
                          {reason.icon === "dollar-sign" && (
                            <span className="text-lg">💰</span>
                          )}
                          {reason.icon === "star" && (
                            <span className="text-lg">⭐</span>
                          )}
                          {reason.icon === "shield" && (
                            <span className="text-lg">🛡️</span>
                          )}
                          {reason.icon === "clock" && (
                            <span className="text-lg">⏰</span>
                          )}
                          {reason.icon === "award" && (
                            <span className="text-lg">🏆</span>
                          )}
                          {reason.icon === "thumbs-up" && (
                            <span className="text-lg">👍</span>
                          )}
                          {reason.icon === "heart" && (
                            <span className="text-lg">❤️</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{reason.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveUp(reason.id)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveDown(reason.id)}
                          disabled={index === reasons.length - 1}
                          className="h-8 w-8"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveReason(reason.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة سبب جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason-title">العنوان</Label>
                  <Input
                    id="reason-title"
                    placeholder="مثال: استشارة متخصصة"
                    value={newReason.title}
                    onChange={(e) =>
                      setNewReason({ ...newReason, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason-description">الوصف</Label>
                  <Textarea
                    id="reason-description"
                    placeholder="شرح موجز لهذا السبب"
                    value={newReason.description}
                    onChange={(e) =>
                      setNewReason({
                        ...newReason,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason-icon">الرمز</Label>
                  <Select
                    value={newReason.icon}
                    onValueChange={(value) =>
                      setNewReason({ ...newReason, icon: value })
                    }
                  >
                    <SelectTrigger id="reason-icon">
                      <SelectValue placeholder="اختر رمز" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddReason} className="w-full">
                  <Plus className="h-4 w-4 ml-1" /> إضافة سبب
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نصائح لقسم "لماذا تختارنا" فعال</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pr-5 space-y-2 text-sm">
                <li>ركز على الفوائد، وليس فقط الميزات</li>
                <li>كن محددًا وقدم الأدلة حيثما أمكن</li>
                <li>احتفظ بالأوصاف موجزة وسهلة الفهم</li>
                <li>استخدم رموزًا تمثل بصريًا كل سبب</li>
                <li>اقتصر على 4-6 أسباب للحصول على أقصى تأثير</li>
                <li>رتب أسبابك مع وضع الأسباب الأكثر إقناعًا في المقدمة</li>
              </ul>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
