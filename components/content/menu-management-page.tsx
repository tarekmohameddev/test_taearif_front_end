"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Plus,
  Save,
  Trash2,
  ExternalLink,
  LinkIcon,
  Menu,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useStore from "@/context/Store";

interface MenuItem {
  id: number;
  label: string;
  url: string;
  isExternal: boolean;
  isActive: boolean;
  order: number;
  parentId: number | null;
  showOnMobile: boolean;
  showOnDesktop: boolean;
}

interface MenuSettings {
  menuPosition: "top" | "left" | "right";
  menuStyle: "buttons" | "underline" | "minimal";
  mobileMenuType: "hamburger" | "sidebar" | "fullscreen";
  isSticky: boolean;
  isTransparent: boolean;
}

export default function MenuManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setEnabled] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<MenuSettings>({
    menuPosition: "top",
    menuStyle: "buttons",
    mobileMenuType: "hamburger",
    isSticky: true,
    isTransparent: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    label: "",
    url: "",
    isExternal: false,
    isActive: true,
    parentId: null,
    showOnMobile: true,
    showOnDesktop: true,
  });
  const {
    homepage: { setupProgressData, fetchSetupProgressData },
  } = useStore();
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    label?: string;
    url?: string;
  }>({});

  useEffect(() => {}, [menuItems, editingItem]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeItem = menuItems.find((item) => item.id === active.id);
      const overItem = menuItems.find((item) => item.id === over.id);

      if (activeItem.parentId === overItem.parentId) {
        const itemsInSameLevel = menuItems
          .filter((item) => item.parentId === activeItem.parentId)
          .sort((a, b) => a.order - b.order);

        const oldIndex = itemsInSameLevel.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = itemsInSameLevel.findIndex(
          (item) => item.id === over.id,
        );

        const updatedItems = arrayMove(
          itemsInSameLevel,
          oldIndex,
          newIndex,
        ).map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        setMenuItems((prevItems) => {
          const otherItems = prevItems.filter(
            (item) => item.parentId !== activeItem.parentId,
          );
          return [...otherItems, ...updatedItems].sort(
            (a, b) => a.order - b.order,
          );
        });

        toast.success("تم تحريك العنصر بنجاح");
      }
    }
  };

  const topLevelItems = useMemo(
    () =>
      menuItems
        .filter((item) => item.parentId === null)
        .sort((a, b) => a.order - b.order),
    [menuItems],
  );

  const getChildItems = (parentId) => {
    return menuItems
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  };

  const handleAddMenuItem = () => {
    const errors: { label?: string; url?: string } = {};

    if (newMenuItem.label.trim() === "") {
      errors.label = "يرجى ملء عنوان الرابط";
      toast.error("يرجى ملء عنوان الرابط");
    }

    if (newMenuItem.url.trim() === "") {
      errors.url = "يرجى ملء الرابط";
      toast.error("يرجى ملء الرابط");
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newItem = {
      ...newMenuItem,
      id: Date.now(),
      order: topLevelItems.length + 1,
    };

    setMenuItems([...menuItems, newItem]);
    toast.success("تمت إضافة عنصر القائمة بنجاح");

    setNewMenuItem({
      label: "",
      url: "",
      isExternal: false,
      isActive: true,
      parentId: null,
      showOnMobile: true,
      showOnDesktop: true,
    });

    setFormErrors({});
  };

  // حذف عنصر من القائمة
  const handleRemoveMenuItem = (id: number) => {
    const itemsToDelete = [
      id,
      ...menuItems
        .filter((item) => item.parentId === id)
        .map((item) => item.id),
    ];
    setMenuItems(menuItems.filter((item) => !itemsToDelete.includes(item.id)));
    toast.success("تم حذف عنصر القائمة بنجاح");
  };

  useEffect(() => {
    if (isLoaded) return; // توقف إذا تم التحميل مسبقاً
    setIsLoaded(true);

    const fetchData = async () => {
      const loadingToast = toast.loading("جاري تحميل بيانات القائمة...");
      try {
        const response = await axiosInstance.get("/content/menu");
        setMenuItems(response.data.data.menuItems);
        setSettings(response.data.data.settings);
        toast.success("تم التحميل بنجاح", { id: loadingToast });
      } catch (error) {
        toast.error("فشل في التحميل", { id: loadingToast });
      }
    };

    fetchData();
  }, [isLoaded]);

  const handleToggleActive = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
    toast.success("تم تغيير حالة العنصر");
  };

  const handleToggleMobile = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, showOnMobile: !item.showOnMobile } : item,
      ),
    );
    toast.success("تم تغيير إعدادات عرض الجوال");
  };

  const handleToggleDesktop = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, showOnDesktop: !item.showOnDesktop } : item,
      ),
    );
    toast.success("تم تغيير إعدادات عرض سطح المكتب");
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setMenuItems(
      menuItems.map((item) =>
        item.id === editingItem.id ? editingItem : item,
      ),
    );

    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast.success("تم حفظ التغييرات بنجاح");
  };

  const handleSave = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("جاري حفظ التغييرات...");

    try {
      const parentItems = menuItems
        .filter((item) => item.parentId === null)
        .sort((a, b) => a.order - b.order);
      const updatedItems = menuItems.map((item) => {
        if (item.parentId === null) {
          const index = parentItems.findIndex(
            (parent) => parent.id === item.id,
          );
          return { ...item, order: index + 1 };
        }
        return item;
      });

      const parentIds = [
        ...new Set(
          updatedItems
            .filter((item) => item.parentId !== null)
            .map((item) => item.parentId),
        ),
      ];
      parentIds.forEach((parentId) => {
        const children = updatedItems
          .filter((item) => item.parentId === parentId)
          .sort((a, b) => a.order - b.order);
        children.forEach((child, index) => {
          const childIndex = updatedItems.findIndex(
            (item) => item.id === child.id,
          );
          if (childIndex !== -1) {
            updatedItems[childIndex].order = index + 1;
          }
        });
      });

      await axiosInstance.put("/content/menu", {
        menuItems: updatedItems,
        settings: settings,
      });
      const setpOB = {
        step: "menu_builder",
      };
      await axiosInstance.post("/steps/complete", setpOB);
      await fetchSetupProgressData();
      toast.success("تم حفظ التغييرات بنجاح", { id: loadingToast });
    } catch (error) {
      toast.error("فشل في حفظ التغييرات", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const SortableCard = ({ item, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-grab"
      >
        <Card className="mb-3">
          <CardContent className="p-4">
            <div className="flex items-center">{children}</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // عرض عنصر القائمة
  const renderMenuItem = (item) => {
    const children = getChildItems(item.id);

    return (
      <SortableCard key={item.id} item={item}>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <span
                  className={`font-medium ${
                    !item.isActive ? "text-muted-foreground" : ""
                  }`}
                >
                  {item.label}
                </span>
                {item.isExternal && (
                  <ExternalLink className="h-3 w-3 mr-1 text-muted-foreground" />
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                <LinkIcon className="h-3 w-3 ml-1" />
                {item.url}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end mr-4">
                <div className="flex items-center mb-1">
                  <span className="text-xs ml-2">نشط</span>
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => handleToggleActive(item.id)}
                    size="sm"
                    onPointerDown={(e) => e.stopPropagation()} // منع بدء السحب
                  />
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      item.showOnMobile
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    جوال
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      item.showOnDesktop
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    سطح المكتب
                  </span>
                </div>
              </div>

              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditItem(item)}
                  className="h-8 w-8"
                  onPointerDown={(e) => e.stopPropagation()} // منع بدء السحب
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveMenuItem(item.id)}
                  className="h-8 w-8"
                  onPointerDown={(e) => e.stopPropagation()} // منع بدء السحب
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {children.length > 0 && (
            <div className="border-t px-4 py-2 bg-muted/20 mt-2">
              <div className="text-xs font-medium mb-2">العناصر الفرعية:</div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={children.map((child) => child.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="pr-4 border-r-2 border-muted">
                    {children.map((child) => (
                      <SortableCard key={child.id} item={child}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span
                                  className={`font-medium ${
                                    !child.isActive
                                      ? "text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {child.label}
                                </span>
                                {child.isExternal && (
                                  <ExternalLink className="h-3 w-3 mr-1 text-muted-foreground" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                <LinkIcon className="h-3 w-3 ml-1" />
                                {child.url}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-end mr-4">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs ml-2">نشط</span>
                                  <Switch
                                    checked={child.isActive}
                                    onCheckedChange={() =>
                                      handleToggleActive(child.id)
                                    }
                                    size="sm"
                                    onPointerDown={(e) => e.stopPropagation()} // منع بدء السحب
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      child.showOnMobile
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    جوال
                                  </span>
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      child.showOnDesktop
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    سطح المكتب
                                  </span>
                                </div>
                              </div>

                              <div className="flex">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditItem(child)}
                                  className="h-8 w-8"
                                  onPointerDown={(e) => e.stopPropagation()} // منع بدء السحب
                                >
                                  <Menu className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleRemoveMenuItem(child.id)}
                                  className="h-8 w-8"
                                  onPointerDown={(e) => e.stopPropagation()} // منع بدء السحب
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SortableCard>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </SortableCard>
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
                <h1 className="text-2xl font-bold">إدارة قائمة التنقل</h1>
                <p className="text-muted-foreground">
                  تخصيص روابط التنقل في موقعك
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

          <Tabs defaultValue="menu" className="w-full">
            {/* <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="menu">قائمة التنقل</TabsTrigger>
              <TabsTrigger value="settings">إعدادات القائمة</TabsTrigger>
            </TabsList> */}

            <TabsContent value="menu" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="item-label">عنوان الرابط</Label>
                        <Input
                          id="item-label"
                          placeholder="مثال: من نحن"
                          value={newMenuItem.label}
                          onChange={(e) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              label: e.target.value,
                            })
                          }
                          className={formErrors.label ? "border-red-500" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="item-url">الرابط</Label>
                        <Input
                          id="item-url"
                          placeholder="مثال: /about"
                          value={newMenuItem.url}
                          onChange={(e) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              url: e.target.value,
                            })
                          }
                          className={formErrors.url ? "border-red-500" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="item-parent">
                          العنصر الأب (اختياري)
                        </Label>
                        <Select
                          value={
                            newMenuItem.parentId
                              ? newMenuItem.parentId.toString()
                              : "none"
                          }
                          onValueChange={(value) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              parentId:
                                value !== "none"
                                  ? Number.parseInt(value)
                                  : null,
                            })
                          }
                        >
                          <SelectTrigger id="item-parent">
                            <SelectValue placeholder="اختر العنصر الأب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">بدون عنصر أب</SelectItem>
                            {topLevelItems.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-external">رابط خارجي</Label>
                        <Switch
                          id="item-external"
                          checked={newMenuItem.isExternal}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              isExternal: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-active">نشط</Label>
                        <Switch
                          id="item-active"
                          checked={newMenuItem.isActive}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              isActive: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-mobile">إظهار على الجوال</Label>
                        <Switch
                          id="item-mobile"
                          checked={newMenuItem.showOnMobile}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              showOnMobile: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="item-desktop">
                          إظهار على سطح المكتب
                        </Label>
                        <Switch
                          id="item-desktop"
                          checked={newMenuItem.showOnDesktop}
                          onCheckedChange={(checked) =>
                            setNewMenuItem({
                              ...newMenuItem,
                              showOnDesktop: checked,
                            })
                          }
                        />
                      </div>

                      <Button
                        onClick={handleAddMenuItem}
                        className="w-full mt-6"
                      >
                        <Plus className="h-4 w-4 ml-1" /> إضافة عنصر للقائمة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={topLevelItems.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {topLevelItems.map(renderMenuItem)}
                      </div>
                    </SortableContext>
                  </DndContext>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="menu-position">موضع القائمة</Label>
                        <Select
                          value={settings.menuPosition}
                          onValueChange={(value: any) =>
                            setSettings({ ...settings, menuPosition: value })
                          }
                        >
                          <SelectTrigger id="menu-position">
                            <SelectValue placeholder="اختر موضع القائمة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">أعلى الصفحة</SelectItem>
                            <SelectItem value="left">يسار الصفحة</SelectItem>
                            <SelectItem value="right">يمين الصفحة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="menu-style">نمط القائمة</Label>
                        <Select
                          value={settings.menuStyle}
                          onValueChange={(value: any) =>
                            setSettings({ ...settings, menuStyle: value })
                          }
                        >
                          <SelectTrigger id="menu-style">
                            <SelectValue placeholder="اختر نمط القائمة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">قياسي</SelectItem>
                            <SelectItem value="buttons">أزرار</SelectItem>
                            <SelectItem value="underline">خط تحتي</SelectItem>
                            <SelectItem value="minimal">بسيط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobile-menu-type">
                          نوع قائمة الجوال
                        </Label>
                        <Select
                          value={settings.mobileMenuType}
                          onValueChange={(value: any) =>
                            setSettings({ ...settings, mobileMenuType: value })
                          }
                        >
                          <SelectTrigger id="mobile-menu-type">
                            <SelectValue placeholder="اختر نوع قائمة الجوال" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hamburger">
                              قائمة همبرغر
                            </SelectItem>
                            <SelectItem value="sidebar">
                              قائمة منسدلة
                            </SelectItem>
                            <SelectItem value="fullscreen">
                              ملء الشاشة
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="sticky-menu">
                          قائمة ثابتة عند التمرير
                        </Label>
                        <Switch
                          id="sticky-menu"
                          checked={settings.isSticky}
                          onCheckedChange={(checked) =>
                            setSettings({ ...settings, isSticky: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="transparent-menu">قائمة شفافة</Label>
                        <Switch
                          id="transparent-menu"
                          checked={settings.isTransparent}
                          onCheckedChange={(checked) =>
                            setSettings({ ...settings, isTransparent: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pr-5 space-y-2 text-sm">
                    <li>استخدم عناوين واضحة وموجزة للروابط</li>
                    <li>حافظ على عدد العناصر الرئيسية بين 5-7 عناصر</li>
                    <li>رتب العناصر حسب الأهمية من اليمين إلى اليسار</li>
                    <li>استخدم القوائم المنسدلة فقط عند الضرورة</li>
                    <li>
                      تأكد من أن القائمة تعمل بشكل جيد على جميع أحجام الشاشات
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

      {/* نافذة تعديل العنصر */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل عنصر القائمة</DialogTitle>
            <DialogDescription>
              قم بتعديل خصائص عنصر القائمة هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-label">عنوان الرابط</Label>
                <Input
                  id="edit-label"
                  value={editingItem.label}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, label: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-url">الرابط</Label>
                <Input
                  id="edit-url"
                  value={editingItem.url}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parent">العنصر الأب</Label>
                <Select
                  value={
                    editingItem.parentId
                      ? editingItem.parentId.toString()
                      : "none"
                  }
                  onValueChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      parentId:
                        value !== "none" ? Number.parseInt(value) : null,
                    })
                  }
                  disabled={getChildItems(editingItem.id).length > 0}
                >
                  <SelectTrigger id="edit-parent">
                    <SelectValue placeholder="اختر العنصر الأب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون عنصر أب</SelectItem>
                    {topLevelItems
                      .filter((item) => item.id !== editingItem.id)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {getChildItems(editingItem.id).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    لا يمكن تغيير العنصر الأب لأن هذا العنصر يحتوي على عناصر
                    فرعية.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-external">رابط خارجي</Label>
                <Switch
                  id="edit-external"
                  checked={editingItem.isExternal}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, isExternal: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-active">نشط</Label>
                <Switch
                  id="edit-active"
                  checked={editingItem.isActive}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, isActive: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-mobile">إظهار على الجوال</Label>
                <Switch
                  id="edit-mobile"
                  checked={editingItem.showOnMobile}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, showOnMobile: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-desktop">إظهار على سطح المكتب</Label>
                <Switch
                  id="edit-desktop"
                  checked={editingItem.showOnDesktop}
                  onCheckedChange={(checked) =>
                    setEditingItem({ ...editingItem, showOnDesktop: checked })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
