"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Plus,
  Save,
  Trash2,
  Award,
  Users,
  Building,
  Clock,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function AchievementsManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "عملاء سعداء",
      value: "+500",
      icon: "users",
      description: "عملاء راضون يحبون خدماتنا",
    },
    {
      id: 2,
      title: "مشاريع مكتملة",
      value: "1,200",
      icon: "building",
      description: "مشاريع تم تسليمها بنجاح",
    },
    {
      id: 3,
      title: "جوائز حصلنا عليها",
      value: "25",
      icon: "award",
      description: "تقدير من الصناعة لتميزنا",
    },
    {
      id: 4,
      title: "سنوات الخبرة",
      value: "10",
      icon: "clock",
      description: "عقد من الخبرة في المجال",
    },
  ]);

  const [sectionTitle, setSectionTitle] = useState("إنجازاتنا");
  const [sectionDescription, setSectionDescription] = useState(
    "نفتخر بإنجازاتنا والثقة التي يضعها عملاؤنا فينا",
  );

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    value: "",
    icon: "award",
    description: "",
  });

  const iconOptions = [
    { value: "award", label: "جائزة" },
    { value: "users", label: "مستخدمين/عملاء" },
    { value: "building", label: "عمارة/مشاريع" },
    { value: "clock", label: "ساعة/وقت" },
    { value: "star", label: "نجمة" },
    { value: "thumbs-up", label: "إعجاب" },
    { value: "heart", label: "قلب" },
    { value: "check", label: "صح" },
  ];

  const handleAddAchievement = () => {
    if (
      newAchievement.title.trim() === "" ||
      newAchievement.value.trim() === ""
    )
      return;

    setAchievements([
      ...achievements,
      {
        id: Date.now(),
        title: newAchievement.title,
        value: newAchievement.value,
        icon: newAchievement.icon,
        description: newAchievement.description,
      },
    ]);

    setNewAchievement({
      title: "",
      value: "",
      icon: "award",
      description: "",
    });
  };

  const handleRemoveAchievement = (id) => {
    setAchievements(
      achievements.filter((achievement) => achievement.id !== id),
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.error("تم حفظ الإنجازات بنجاح!");
    }, 1000);
  };

  const renderIcon = (icon) => {
    switch (icon) {
      case "award":
        return <Award className="h-6 w-6" />;
      case "users":
        return <Users className="h-6 w-6" />;
      case "building":
        return <Building className="h-6 w-6" />;
      case "clock":
        return <Clock className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
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
                <h1 className="text-2xl font-bold">الإنجازات</h1>
                <p className="text-muted-foreground">
                  إدارة إنجازات وإحصائيات شركتك
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
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إدارة الإنجازات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                استعرض إنجازات شركتك الرئيسية، والأرقام الإحصائية الهامة. سيتم
                عرضها كعدادات أو صناديق إبراز على موقعك.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        {renderIcon(achievement.icon)}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveAchievement(achievement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <div className="text-2xl font-bold">
                        {achievement.value}
                      </div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة إنجاز جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="achievement-title">العنوان</Label>
                  <Input
                    id="achievement-title"
                    placeholder="مثال: عملاء سعداء"
                    value={newAchievement.title}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievement-value">القيمة/الرقم</Label>
                  <Input
                    id="achievement-value"
                    placeholder="مثال: +500 أو 10M"
                    value={newAchievement.value}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        value: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    يمكنك استخدام أرقام مع رموز مثل + أو M (مثل "+500" أو "10M")
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievement-icon">الرمز</Label>
                  <Select
                    value={newAchievement.icon}
                    onValueChange={(value) =>
                      setNewAchievement({ ...newAchievement, icon: value })
                    }
                  >
                    <SelectTrigger id="achievement-icon">
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

                <div className="space-y-2">
                  <Label htmlFor="achievement-description">
                    وصف قصير (اختياري)
                  </Label>
                  <Textarea
                    id="achievement-description"
                    placeholder="وصف موجز لهذا الإنجاز"
                    value={newAchievement.description}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddAchievement} className="w-full">
                  <Plus className="h-4 w-4 ml-1" /> إضافة إنجاز
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نصائح لقسم إنجازات فعال</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pr-5 space-y-2 text-sm">
                <li>استخدم إحصائيات مثيرة ولكن صادقة تبرز نقاط قوتك</li>
                <li>احتفظ بالعناوين قصيرة وواضحة</li>
                <li>
                  استخدم أرقامًا مستديرة أو أضف "+" للإشارة إلى "أكثر من" (مثل
                  +500)
                </li>
                <li>اختر رموزًا تمثل بصريًا كل إنجاز</li>
                <li>اقتصر على 4-6 إنجازات للحصول على أقصى تأثير</li>
                <li>قم بتحديث الأرقام بانتظام للحفاظ على حداثتها</li>
              </ul>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
