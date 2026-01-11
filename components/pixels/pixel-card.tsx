"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pixel, getPlatformIcon } from "./pixel-helpers";

interface PixelCardProps {
  pixel: Pixel;
  onEdit: (pixel: Pixel) => void;
  onDelete: (pixel: Pixel) => void;
}

export function PixelCard({ pixel, onEdit, onDelete }: PixelCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-semibold text-sm">
            {getPlatformIcon(pixel.platform)}
          </span>
        </div>
        <div>
          <p className="font-medium capitalize">{pixel.platform}</p>
          <p className="text-sm text-muted-foreground">{pixel.pixel_id}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={pixel.is_active ? "default" : "secondary"}>
          {pixel.is_active ? "نشط" : "غير نشط"}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(pixel)}
          className="gap-1"
        >
          <Edit className="h-3 w-3" />
          تعديل
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(pixel)}
          className="gap-1"
        >
          <Trash2 className="h-3 w-3" />
          حذف
        </Button>
      </div>
    </div>
  );
}
