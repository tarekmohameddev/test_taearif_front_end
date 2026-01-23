"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/lib/axiosInstance"; // استيراد axiosInstance
import { useState, useEffect } from "react";

export default function CategoriesManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: null,
      is_active: false,
    },
  ]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [showEvenIfEmpty, setShowEvenIfEmpty] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/user/categories");
      if (response.status === 200) {
        setCategories(response.data.categories);
        setShowEvenIfEmpty(response.data.show_even_if_empty); // إضافة هذا السطر
      } else {
        toast.error("حدث خطأ أثناء جلب التصنيفات.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("حدث خطأ أثناء جلب التصنيفات.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleStatusChange = async (newStatus) => {
    try {
      setShowEvenIfEmpty(newStatus);

      // إرسال الطلب لتحديث show_even_if_empty
      const response = await axiosInstance.put("/user/categories", {
        show_even_if_empty: newStatus,
        categories: categories.map((category) => ({
          id: category.id,
          is_active: category.is_active,
        })),
      });

      if (response.status === 200) {
        toast.success("تم تحديث الحالة !");
      } else {
        toast.error("حدث خطأ أثناء تحديث الحالة.");
        setShowEvenIfEmpty(!newStatus);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("حدث خطأ أثناء تحديث الحالة.");
      setShowEvenIfEmpty(!newStatus);
    }
  };
  const handleAddCategory = () => {
    if (newCategory.name.trim() === "") return;

    const slug = newCategory.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.name,
        slug: slug,
        description: newCategory.description,
        is_active: true,
        order: categories.length + 1,
      },
    ]);

    setNewCategory({
      name: "",
      description: "",
    });
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleToggleActive = (id) => {
    if (!showEvenIfEmpty) {
      toast.warning(
        "يجب تفعيل اظهار التصنيفات الفارغة أولاً لتتمكن من تعديل التصنيفات",
      );
      return;
    }

    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, is_active: !category.is_active }
          : category,
      ),
    );
  };

  const handleMoveUp = (id) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index <= 0) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index - 1];
    newCategories[index - 1] = temp;

    newCategories.forEach((category, i) => {
      category.order = i + 1;
    });

    setCategories(newCategories);
  };

  const handleMoveDown = (id) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index >= categories.length - 1) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + 1];
    newCategories[index + 1] = temp;

    newCategories.forEach((category, i) => {
      category.order = i + 1;
    });

    setCategories(newCategories);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const dataToSend = {
        show_even_if_empty: showEvenIfEmpty, // إضافة هذا السطر
        categories: categories.map((category) => ({
          id: category.id,
          is_active: category.is_active,
        })),
      };

      const response = await axiosInstance.put("/user/categories", dataToSend);

      if (response.status === 200) {
        toast.success("تم حفظ التصنيفات بنجاح!");
      } else {
        toast.error("حدث خطأ أثناء حفظ التصنيفات.");
      }
    } catch (error) {
      console.error("Error saving categories:", error);
      toast.error("حدث خطأ أثناء حفظ التصنيفات.");
    } finally {
      setIsLoading(false);
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
                <h1 className="text-2xl font-bold">التصنيفات</h1>
                <p className="text-muted-foreground">
                  إدارة تصنيفات المحتوى في موقعك
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

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4 gap-4 ">
              <Label
                htmlFor="show-empty-categories"
                className=" font-medium cursor-pointer text-lg"
              >
                {showEvenIfEmpty
                  ? "إخفاء التصنيفات الفارغة"
                  : "إظهار التصنيفات الفارغة"}
              </Label>
              <Switch
                checked={showEvenIfEmpty}
                onCheckedChange={handleStatusChange}
                id="show-empty-categories"
                className=""
              />
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إدارة التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                التصنيفات تساعد في تنظيم محتوى موقعك وتسهل على الزوار العثور على
                ما يبحثون عنه.
              </p>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* <div className="flex flex-col"> */}
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveUp(category.id)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveDown(category.id)}
                            disabled={index === categories.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button> */}
                        {/* </div> */}
                        <h3 className="font-medium">{category.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_active}
                          onCheckedChange={() =>
                            handleToggleActive(category.id)
                          }
                          disabled={!showEvenIfEmpty} // إضافة هذا السطر
                          id={`active-${category.id}`}
                        />
                        <Label
                          htmlFor={`active-${category.id}`}
                          className={`text-sm ${!showEvenIfEmpty ? "text-gray-400" : ""}`}
                        >
                          {category.is_active ? "نشط" : "معطل"}
                        </Label>
                      </div>
                    </div>
                    {/* <p className="text-sm">{category.description}</p> */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة تصنيف جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">اسم التصنيف</Label>
                  <Input
                    id="category-name"
                    placeholder="مثال: تطوير الويب"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إنشاء الرابط تلقائيًا من اسم التصنيف.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-description">الوصف (اختياري)</Label>
                  <Textarea
                    id="category-description"
                    placeholder="وصف مختصر لهذا التصنيف"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="h-4 w-4 ml-1" /> إضافة تصنيف
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>نصائح للتصنيفات الفعالة</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pr-5 space-y-2 text-sm">
                <li>استخدم أسماء تصنيفات قصيرة ووصفية</li>
                <li>استخدم تصنيفات منطقية ومفهومة للزوار</li>
                <li>لا تنشئ الكثير من التصنيفات - حافظ على البساطة</li>
                <li>رتب التصنيفات حسب الأهمية أو الشعبية</li>
                <li>
                  استخدم خاصية التفعيل/التعطيل لإخفاء التصنيفات مؤقتًا دون حذفها
                </li>
              </ul>
            </CardContent>
          </Card> */}
        </main>
    </div>
  );
}
