"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { reorderProperty } from "../services/properties.api";

interface ReorderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reorderList: any[];
  reorderType: "featured" | "normal";
  propertiesAllData: any;
  pagination: any;
}

export function ReorderDialog({
  isOpen,
  onClose,
  reorderList,
  reorderType,
  propertiesAllData,
  pagination,
}: ReorderDialogProps) {
  if (!isOpen) return null;

  const handleReorder = async (property: any, newOrder: number) => {
    onClose();
    const toastId = toast.loading("جاري تحديث الترتيب...");
    try {
      await reorderProperty(property.id, newOrder, reorderType);
      toast.success("تم تحديث الترتيب");
    } catch (e) {
      toast.error("حدث خطأ أثناء الترتيب");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const itemCount =
    reorderType === "featured"
      ? propertiesAllData?.total_reorder_featured || reorderList.length
      : pagination?.total || reorderList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-background rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h2 className="font-bold mb-4 text-lg text-center">
          {reorderType === "featured"
            ? "ترتيب الوحدات المميزة"
            : "ترتيب الوحدات"}
        </h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {reorderList.map((property: any, idx: number) => (
            <div
              key={property.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>
                {property.title || property.contents?.[0]?.title}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex justify-evenly">
                    <div className="w-2">
                      {property.reorder_featured ||
                        property.reorder ||
                        idx + 1}
                    </div>
                    <ChevronDown className="-ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[15rem] overflow-y-auto">
                  {[...Array(itemCount)].map((_, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => handleReorder(property, i + 1)}
                    >
                      {i + 1}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
