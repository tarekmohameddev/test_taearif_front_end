"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PixelCard } from "./pixel-card";
import { Pixel } from "./pixel-helpers";

interface PixelListProps {
  pixels: Pixel[];
  loading: boolean;
  onEdit: (pixel: Pixel) => void;
  onDelete: (pixel: Pixel) => void;
  onAddClick: () => void;
  canAdd: boolean;
}

export function PixelList({
  pixels,
  loading,
  onEdit,
  onDelete,
  onAddClick,
  canAdd,
}: PixelListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pixels المربوطة</h3>
        <Button
          onClick={onAddClick}
          className="gap-2"
          disabled={!canAdd}
          title={
            !canAdd ? "تم ربط جميع ال Pixels المتاحة" : undefined
          }
        >
          <Plus className="h-4 w-4" />
          إضافة Pixel جديد
        </Button>
      </div>

      {pixels.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">لا توجد pixels مربوطة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pixels.map((pixel) => (
            <PixelCard
              key={pixel.id}
              pixel={pixel}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
