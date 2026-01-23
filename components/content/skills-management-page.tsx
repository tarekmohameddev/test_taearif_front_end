"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function SkillsManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: "تصميم الويب",
      percentage: 85,
      description: "إنشاء تصاميم مواقع ويب جميلة وعملية",
    },
    {
      id: 2,
      name: "تطوير الويب",
      percentage: 90,
      description: "بناء مواقع ويب متجاوبة وتفاعلية",
    },
    {
      id: 3,
      name: "تحسين محركات البحث",
      percentage: 75,
      description: "تحسين ظهور الموقع في محركات البحث",
    },
  ]);

  const handleAddSkill = () => {
    const newId =
      skills.length > 0 ? Math.max(...skills.map((s) => s.id)) + 1 : 1;
    setSkills([
      ...skills,
      {
        id: newId,
        name: "مهارة جديدة",
        percentage: 50,
        description: "وصف المهارة هنا",
      },
    ]);
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const updateSkill = (id, field, value) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill,
      ),
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success toast
      alert("تم حفظ المهارات بنجاح!");
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
                <h1 className="text-2xl font-bold">المهارات</h1>
                <p className="text-muted-foreground">
                  إدارة المهارات التي تظهر في موقعك
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
              <CardTitle>إعدادات قسم المهارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills-title">عنوان القسم</Label>
                <Input id="skills-title" defaultValue="مهاراتنا" />
              </div>
              <div>
                <Label htmlFor="skills-subtitle">العنوان الفرعي للقسم</Label>
                <Input id="skills-subtitle" defaultValue="مجالات خبرتنا" />
              </div>
              <div>
                <Label htmlFor="skills-description">وصف القسم</Label>
                <Textarea
                  id="skills-description"
                  defaultValue="نحن نتمتع بمجموعة متنوعة من المهارات والخبرات لتقديم أفضل الخدمات لعملائنا."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">المهارات المضافة</h3>
            <Button
              onClick={handleAddSkill}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4 ml-1" />
              إضافة مهارة جديدة
            </Button>
          </div>

          <div className="space-y-4">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Label htmlFor={`skill-name-${skill.id}`}>
                            اسم المهارة
                          </Label>
                          <Input
                            id={`skill-name-${skill.id}`}
                            value={skill.name}
                            onChange={(e) =>
                              updateSkill(skill.id, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>مستوى المهارة</Label>
                              <span className="font-medium text-sm">
                                {skill.percentage}%
                              </span>
                            </div>
                            <Slider
                              value={[skill.percentage]}
                              max={100}
                              step={1}
                              onValueChange={(value) =>
                                updateSkill(skill.id, "percentage", value[0])
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`skill-description-${skill.id}`}>
                          وصف المهارة
                        </Label>
                        <Textarea
                          id={`skill-description-${skill.id}`}
                          value={skill.description}
                          onChange={(e) =>
                            updateSkill(skill.id, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {skills.length > 1 && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemoveSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>نصائح لعرض المهارات</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pr-5 space-y-2">
                <li>ركز على المهارات المرتبطة بخدمات عملك</li>
                <li>كن صادقًا في تقييم مستويات مهاراتك</li>
                <li>أضف وصفًا موجزًا وواضحًا لكل مهارة</li>
                <li>قم بتحديث مهاراتك بانتظام مع تطور خبراتك</li>
              </ul>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
