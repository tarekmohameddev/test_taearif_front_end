"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Copy,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  QrCode,
  Share,
  BarChart3,
} from "lucide-react";

export function AffiliateLinksPage() {
  const [links, setLinks] = useState([
    {
      id: 1,
      name: "الصفحة الرئيسية",
      originalUrl: "https://example.com",
      affiliateUrl: "https://example.com?ref=AFF123",
      clicks: 2450,
      conversions: 34,
      earnings: 850.0,
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "صفحة الأسعار",
      originalUrl: "https://example.com/pricing",
      affiliateUrl: "https://example.com/pricing?ref=AFF123",
      clicks: 1890,
      conversions: 28,
      earnings: 700.0,
      status: "active",
      createdAt: "2024-01-05",
    },
  ]);

  const [newLink, setNewLink] = useState({
    name: "",
    originalUrl: "",
    campaign: "",
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateLink = () => {
    if (!newLink.name || !newLink.originalUrl) {
      toast({
        title: "خطأ في البيانات",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const affiliateCode = "AFF123"; // This would be generated or fetched from user data
    const campaignParam = newLink.campaign
      ? `&campaign=${newLink.campaign}`
      : "";
    const affiliateUrl = `${newLink.originalUrl}?ref=${affiliateCode}${campaignParam}`;

    const link = {
      id: links.length + 1,
      name: newLink.name,
      originalUrl: newLink.originalUrl,
      affiliateUrl: affiliateUrl,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLinks([...links, link]);
    setNewLink({ name: "", originalUrl: "", campaign: "" });
    setShowCreateForm(false);

    toast({
      title: "تم إنشاء الرابط بنجاح",
      description: "يمكنك الآن استخدام الرابط للترويج",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرابط إلى الحافظة",
    });
  };

  const deleteLink = (id: number) => {
    setLinks(links.filter((link) => link.id !== id));
    toast({
      title: "تم حذف الرابط",
      description: "تم حذف الرابط بنجاح",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">إدارة الروابط التابعة</h1>
                <p className="text-muted-foreground">
                  أنشئ وأدر روابطك التابعة لتتبع الأداء
                </p>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 ml-1" />
                إنشاء رابط جديد
              </Button>
            </div>

            {/* Create Link Form */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>إنشاء رابط تابع جديد</CardTitle>
                  <CardDescription>
                    أنشئ رابطاً تابعاً لتتبع النقرات والتحويلات
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkName">اسم الرابط *</Label>
                      <Input
                        id="linkName"
                        value={newLink.name}
                        onChange={(e) =>
                          setNewLink({ ...newLink, name: e.target.value })
                        }
                        placeholder="مثال: الصفحة الرئيسية"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign">اسم الحملة (اختياري)</Label>
                      <Input
                        id="campaign"
                        value={newLink.campaign}
                        onChange={(e) =>
                          setNewLink({ ...newLink, campaign: e.target.value })
                        }
                        placeholder="مثال: social-media-jan"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalUrl">الرابط الأصلي *</Label>
                    <Input
                      id="originalUrl"
                      value={newLink.originalUrl}
                      onChange={(e) =>
                        setNewLink({ ...newLink, originalUrl: e.target.value })
                      }
                      placeholder="https://example.com/page"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateLink}>إنشاء الرابط</Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links List */}
            <div className="space-y-4">
              {links.map((link) => (
                <Card key={link.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{link.name}</CardTitle>
                        <CardDescription>
                          تم الإنشاء في {link.createdAt}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            link.status === "active" ? "default" : "secondary"
                          }
                        >
                          {link.status === "active" ? "نشط" : "معطل"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* URL Display */}
                    <div className="space-y-2">
                      <Label>الرابط التابع</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={link.affiliateUrl}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(link.affiliateUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(link.affiliateUrl, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded">
                        <p className="text-2xl font-bold">
                          {link.clicks.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">نقرة</p>
                      </div>
                      <div className="text-center p-3 border rounded">
                        <p className="text-2xl font-bold">{link.conversions}</p>
                        <p className="text-sm text-muted-foreground">تحويل</p>
                      </div>
                      <div className="text-center p-3 border rounded">
                        <p className="text-2xl font-bold">
                          {link.clicks > 0
                            ? ((link.conversions / link.clicks) * 100).toFixed(
                                1,
                              )
                            : 0}
                          %
                        </p>
                        <p className="text-sm text-muted-foreground">
                          معدل التحويل
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded">
                        <p className="text-2xl font-bold text-green-600">
                          {link.earnings.toFixed(2)} ريال
                        </p>
                        <p className="text-sm text-muted-foreground">الأرباح</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 ml-1" />
                        رمز QR
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 ml-1" />
                        مشاركة
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 ml-1" />
                        تقرير مفصل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات سريعة</CardTitle>
                <CardDescription>
                  نظرة عامة على أداء جميع روابطك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{links.length}</p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي الروابط
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {links
                        .reduce((sum, link) => sum + link.clicks, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي النقرات
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {links.reduce((sum, link) => sum + link.conversions, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي التحويلات
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {links
                        .reduce((sum, link) => sum + link.earnings, 0)
                        .toFixed(2)}{" "}
                      ريال
                    </p>
                    <p className="text-sm text-muted-foreground">
                      إجمالي الأرباح
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}
