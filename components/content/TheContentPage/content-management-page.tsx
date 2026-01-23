"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  ImageIcon,
  MessageSquare,
  Plus,
  Settings2,
  Briefcase,
  Clock,
  Filter,
  Award,
  Layers,
  ThumbsUp,
  FolderKanban,
  Lightbulb,
  ShoppingBag,
  Menu,
  Trophy,
  Star,
  FileText,
  LayoutTemplateIcon as LayoutFooter,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/context/Store";

export function ContentManagementPage() {
  const { contentManagement, fetchContentSections, setContentManagement } =
    useStore();
  const { userData } = useAuthStore();
  const {
    newSectionDialogOpen,
    statusFilter,
    searchQuery,
    sections,
    apiAvailableIcons,
    error,
    loading,
    newSectionName,
    newSectionDescription,
    newSectionStatus,
    newSectionIcon,
  } = contentManagement;

  const setNewSectionDialogOpen = (value) => {
    setContentManagement({ newSectionDialogOpen: value });
  };

  const setStatusFilter = (value) => {
    setContentManagement({ statusFilter: value });
  };

  const setSearchQuery = (value) => {
    setContentManagement({ searchQuery: value });
  };

  const setNewSectionName = (value) => {
    setContentManagement({ newSectionName: value });
  };

  const setNewSectionDescription = (value) => {
    setContentManagement({ newSectionDescription: value });
  };

  const setNewSectionStatus = (value) => {
    setContentManagement({ newSectionStatus: value });
  };

  const setNewSectionIcon = (value) => {
    setContentManagement({ newSectionIcon: value });
  };

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      return;
    }
    if (sections.length === 0) {
      fetchContentSections();
    }
  }, [sections, fetchContentSections, userData?.token]);

  const availableIcons = {
    FileText: FileText,
    Briefcase: Briefcase,
    ImageIcon: ImageIcon,
    Building2: Building2,
    MessageSquare: MessageSquare,
    Award: Award,
    Layers: Layers,
    ThumbsUp: ThumbsUp,
    FolderKanban: FolderKanban,
    Lightbulb: Lightbulb,
    ShoppingBag: ShoppingBag,
    Menu: Menu,
    Trophy: Trophy,
    Star: Star,
    LayoutFooter: LayoutFooter,
    Settings2: Settings2,
  };

  const handleAddNewSection = () => {
    if (!newSectionName.trim()) {
      toast.error(`يرجى إدخال اسم للقسم`);
      return;
    }

    const newSection = {
      id: newId,
      title: newSectionName,
      description: newSectionDescription,
      icon: newSectionIcon,
      path: `/content/${newId}`,
      status: newSectionStatus,
      count: 0,
      info: {
        email: newSectionDescription,
        website: null,
      },
      badge: newSectionStatus ? { label: "قسم نشط", color: randomColor } : null,
      lastUpdate: new Date().toISOString(),
      lastUpdateFormatted: "آخر تحديث الآن",
    };

    setContentManagement({
      sections: [...sections, newSection],
      newSectionName: "",
      newSectionDescription: "",
      newSectionStatus: true,
      newSectionIcon: "FileText",
      newSectionDialogOpen: false,
    });
    toast.success(`تم إضافة القسم "${newSectionName}" بنجاح`);
  };

  const newId = newSectionName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();

  const colors = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
    "bg-orange-100 text-orange-800",
    "bg-cyan-100 text-cyan-800",
    "bg-amber-100 text-amber-800",
    "bg-violet-100 text-violet-800",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col">
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">إدارة المحتوى</h1>
                <p className="text-muted-foreground">تخصيص محتوى موقعك</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* <div className="relative">
                  <Input
                    placeholder="بحث في الأقسام..."
                    className="w-[200px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div> */}

                {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="تصفية حسب الحالة" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    <SelectItem value="active">الأقسام النشطة</SelectItem>
                    <SelectItem value="inactive">الأقسام غير النشطة</SelectItem>
                  </SelectContent>
                </Select> */}

                <Dialog
                  open={newSectionDialogOpen}
                  onOpenChange={setNewSectionDialogOpen}
                >
                  {/* <DialogTrigger asChild>
                    <Button onClick={() => setNewSectionDialogOpen(true)}>
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة قسم
                    </Button>
                  </DialogTrigger> */}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة قسم جديد</DialogTitle>
                      <DialogDescription>
                        أضف قسمًا مخصصًا جديدًا إلى موقعك
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">اسم القسم</Label>
                        <Input
                          id="name"
                          placeholder="مثال: المدونة، الوظائف، الأسئلة الشائعة"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">وصف القسم</Label>
                        <Textarea
                          id="description"
                          placeholder="وصف مختصر لمحتوى القسم وهدفه"
                          value={newSectionDescription}
                          onChange={(e) =>
                            setNewSectionDescription(e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="icon">أيقونة القسم</Label>
                        <Select
                          value={newSectionIcon}
                          onValueChange={setNewSectionIcon}
                        >
                          <SelectTrigger id="icon">
                            <SelectValue placeholder="اختر أيقونة" />
                          </SelectTrigger>
                          <SelectContent>
                            {apiAvailableIcons.length > 0
                              ? apiAvailableIcons.map((name) => {
                                  const Icon = availableIcons[name];
                                  return (
                                    <SelectItem key={name} value={name}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span>{name}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                })
                              : Object.entries(availableIcons).map(
                                  ([name, Icon]) => (
                                    <SelectItem key={name} value={name}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span>{name}</span>
                                      </div>
                                    </SelectItem>
                                  ),
                                )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="status">حالة القسم</Label>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="status" className="text-sm">
                            نشط
                          </Label>
                          <Switch
                            id="status"
                            checked={newSectionStatus}
                            onCheckedChange={setNewSectionStatus}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setNewSectionDialogOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button onClick={handleAddNewSection}>إضافة القسم</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-md border p-6 animate-pulse"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-5 bg-gray-300 rounded-full" />
                    <div className="ml-4 h-5 w-1/2 bg-gray-300 rounded" />
                  </div>
                  <div className="mb-2">
                    <div className="h-4 w-full bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-300 rounded" />
                    <div className="h-4 w-1/2 bg-gray-300 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">لا توجد أقسام مطابقة</h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على أقسام تطابق معايير التصفية الحالية
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  // يمكن هنا استدعاء دوال لتصفية الحالة من المخزن
                }}
              >
                عرض جميع الأقسام
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => {
                const IconComponent =
                  availableIcons[section.icon] || availableIcons["FileText"];
                return (
                  <Link href={`/dashboard${section.path}`} key={section.id}>
                    <Card
                      className={`h-full cursor-pointer transition-all hover:shadow-md ${
                        !section.status ? "opacity-70 border-dashed" : ""
                      }`}
                    >
                      <CardHeader className="flex flex-row items-start justify-between p-6">
                        <div className="flex flex-col gap-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                            {section.title}
                          </CardTitle>
                          <CardDescription>
                            {section.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        {section.info && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {section.info.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>{section.info.website}</span>
                              </div>
                            )}
                            {section.info.email && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>{section.info.email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
              {/* <Card
                className="flex h-full cursor-pointer flex-col items-center justify-center border-dashed p-6 text-center transition-colors hover:bg-muted/50"
                onClick={() => setNewSectionDialogOpen(true)}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 font-medium">إضافة قسم مخصص</h3>
                <p className="text-sm text-muted-foreground">
                  إنشاء قسم مخصص جديد لموقعك
                </p>
              </Card> */}
            </div>
          )}
        </main>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default ContentManagementPage;
