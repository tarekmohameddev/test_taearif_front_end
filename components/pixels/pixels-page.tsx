"use client";

import { useState, useEffect } from "react";
import { Link } from "lucide-react";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { PixelList } from "./pixel-list";
import { AddPixelForm } from "./add-pixel-form";
import { EditPixelForm } from "./edit-pixel-form";
import { DeletePixelDialog } from "./delete-pixel-dialog";
import {
  Pixel,
  PixelFormData,
  getAvailablePlatforms,
} from "./pixel-helpers";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

export function PixelsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("apps");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);
  
  // Form loading states
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPixels = async () => {
    if (authLoading || !userData?.token) {
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get("/pixels");
      setPixels(res.data.data);
    } catch (err) {
      console.error("Failed to load pixels:", err);
      toast.error("فشل في تحميل Pixels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !userData?.token) {
      return;
    }
    fetchPixels();
  }, [userData?.token, authLoading]);

  const handleAddPixel = async (data: PixelFormData) => {
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    setIsAdding(true);
    try {
      await axiosInstance.post("/pixels", data);
      toast.success("تم إضافة Pixel بنجاح");
      setIsAddDialogOpen(false);
      await fetchPixels();
    } catch (error) {
      toast.error("فشل في إضافة Pixel");
      console.error("Failed to add pixel:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditPixel = async (id: number, data: PixelFormData) => {
    if (authLoading || !userData?.token) {
      toast.error("يرجى الانتظار حتى يتم تحميل بيانات المصادقة");
      return;
    }

    setIsEditing(true);
    try {
      await axiosInstance.put(`/pixels/${id}`, data);
      toast.success("تم تعديل Pixel بنجاح");
      setIsEditDialogOpen(false);
      setSelectedPixel(null);
      await fetchPixels();
    } catch (error) {
      toast.error("فشل في تعديل Pixel");
      console.error("Failed to edit pixel:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeletePixel = async () => {
    if (!selectedPixel || authLoading || !userData?.token) {
      return;
    }

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/pixels/${selectedPixel.id}`);
      toast.success("تم حذف Pixel بنجاح");
      setIsDeleteDialogOpen(false);
      setSelectedPixel(null);
      await fetchPixels();
    } catch (error) {
      toast.error("فشل في حذف Pixel");
      console.error("Failed to delete pixel:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (pixel: Pixel) => {
    setSelectedPixel(pixel);
    setIsEditDialogOpen(true);
  };

  const handleOpenDelete = (pixel: Pixel) => {
    setSelectedPixel(pixel);
    setIsDeleteDialogOpen(true);
  };

  const availablePlatforms = getAvailablePlatforms(pixels);
  const availablePlatformsForEdit = selectedPixel
    ? getAvailablePlatforms(pixels, selectedPixel.platform)
    : [];

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Link className="h-6 w-6" />
                  إدارة Pixels
                </h1>
                <p className="text-muted-foreground">
                  ربط وإدارة pixels منصات التواصل الاجتماعي مع موقعك لتتبع الزوار والتحويلات
                </p>
              </div>
            </div>

            <PixelList
              pixels={pixels}
              loading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAddClick={() => setIsAddDialogOpen(true)}
              canAdd={availablePlatforms.length > 0}
            />
          </div>
        </main>
      </div>

      <AddPixelForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPixel}
        availablePlatforms={availablePlatforms}
        loading={isAdding}
      />

      <EditPixelForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        pixel={selectedPixel}
        onSubmit={handleEditPixel}
        availablePlatforms={availablePlatformsForEdit}
        loading={isEditing}
      />

      <DeletePixelDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        pixel={selectedPixel}
        onConfirm={handleDeletePixel}
        loading={isDeleting}
      />
    </div>
  );
}
