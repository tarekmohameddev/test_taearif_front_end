"use client";

import { useState } from "react";
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
  Upload,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

export default function BrandsManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "شركة أكمي",
      logo: "/placeholder.svg?height=100&width=200",
      website: "https://example.com/acme",
      active: true,
    },
    {
      id: 2,
      name: "تك كورب",
      logo: "/placeholder.svg?height=100&width=200",
      website: "https://example.com/techcorp",
      active: true,
    },
    {
      id: 3,
      name: "حلول عالمية",
      logo: "/placeholder.svg?height=100&width=200",
      website: "https://example.com/global",
      active: true,
    },
    {
      id: 4,
      name: "ابتكار المحدودة",
      logo: "/placeholder.svg?height=100&width=200",
      website: "https://example.com/innovate",
      active: false,
    },
  ]);

  const [sectionTitle, setSectionTitle] = useState("شركاؤنا الموثوقون");
  const [sectionDescription, setSectionDescription] = useState(
    "نفتخر بالعمل مع هذه العلامات التجارية الرائعة",
  );

  const [newBrand, setNewBrand] = useState({
    name: "",
    logo: "/placeholder.svg?height=100&width=200",
    website: "",
    active: true,
  });

  const handleAddBrand = () => {
    if (newBrand.name.trim() === "") return;

    setBrands([
      ...brands,
      {
        id: Date.now(),
        name: newBrand.name,
        logo: newBrand.logo,
        website: newBrand.website,
        active: newBrand.active,
      },
    ]);

    setNewBrand({
      name: "",
      logo: "/placeholder.svg?height=100&width=200",
      website: "",
      active: true,
    });
  };

  const handleRemoveBrand = (id) => {
    setBrands(brands.filter((brand) => brand.id !== id));
  };

  const handleToggleActive = (id) => {
    setBrands(
      brands.map((brand) =>
        brand.id === id ? { ...brand, active: !brand.active } : brand,
      ),
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم حفظ العلامات التجارية بنجاح!");
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
                <h1 className="text-2xl font-bold">
                  العلامات التجارية والشركاء
                </h1>
                <p className="text-muted-foreground">
                  إدارة العلامات التجارية والشركاء لموقعك
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
                <Label htmlFor="section-description">وصف القسم (اختياري)</Label>
                <Input
                  id="section-description"
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إدارة العلامات التجارية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                أضف شعارات الشركات التي تعاملت معها أو العلامات التجارية التي
                تمثلها. سيتم عرضها في قسم العلامات التجارية/الشركاء في موقعك.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{brand.name}</h3>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={brand.active}
                          onCheckedChange={() => handleToggleActive(brand.id)}
                          id={`active-${brand.id}`}
                        />
                        <Label
                          htmlFor={`active-${brand.id}`}
                          className="text-sm"
                        >
                          {brand.active ? "نشط" : "مخفي"}
                        </Label>
                      </div>
                    </div>

                    <div className="h-20 bg-gray-50 rounded flex items-center justify-center p-2">
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={150}
                        height={60}
                        className="object-contain max-h-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary flex items-center gap-1 hover:underline"
                        >
                          زيارة الموقع <ExternalLink className="h-3 w-3 mr-1" />
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          لا يوجد موقع
                        </span>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveBrand(brand.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة علامة تجارية جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">اسم العلامة التجارية</Label>
                  <Input
                    id="brand-name"
                    placeholder="مثال: شركة أكمي"
                    value={newBrand.name}
                    onChange={(e) =>
                      setNewBrand({ ...newBrand, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>شعار العلامة التجارية</Label>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="mb-4 h-20 bg-gray-50 rounded flex items-center justify-center">
                      <Image
                        src={newBrand.logo || "/placeholder.svg"}
                        alt="معاينة"
                        width={150}
                        height={60}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 ml-1" /> رفع شعار
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      الحجم الموصى به: 200×100 بكسل. يفضل استخدام PNG شفاف.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-website">
                    عنوان الموقع الإلكتروني (اختياري)
                  </Label>
                  <Input
                    id="brand-website"
                    placeholder="https://example.com"
                    value={newBrand.website}
                    onChange={(e) =>
                      setNewBrand({ ...newBrand, website: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="brand-active"
                    checked={newBrand.active}
                    onCheckedChange={(checked) =>
                      setNewBrand({ ...newBrand, active: checked })
                    }
                  />
                  <Label htmlFor="brand-active" className="mr-2">
                    نشط (سيتم عرضه على الموقع)
                  </Label>
                </div>

                <Button onClick={handleAddBrand} className="w-full">
                  <Plus className="h-4 w-4 ml-1" /> إضافة علامة تجارية
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نصائح لعرض العلامات التجارية</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pr-5 space-y-2 text-sm">
                <li>استخدم صور شعارات عالية الجودة بخلفيات شفافة</li>
                <li>
                  حافظ على حجم متقارب لجميع الشعارات للحصول على تناسق بصري
                </li>
                <li>
                  قم بتضمين العلامات التجارية ذات السمعة الطيبة والمرتبطة بعملك
                  فقط
                </li>
                <li>
                  تأكد من حصولك على إذن لاستخدام جميع شعارات العلامات التجارية
                </li>
                <li>
                  فكر في تنظيم الشعارات حسب الصناعة أو نوع العلاقة إذا كان لديك
                  العديد منها
                </li>
                <li>
                  استخدم خاصية النشط/المخفي لإخفاء العلامات التجارية مؤقتًا دون
                  حذفها
                </li>
              </ul>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
