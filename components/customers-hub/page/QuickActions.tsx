"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, UserPlus, Upload, FileDown } from "lucide-react";

export function QuickActions() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إجراء سريع
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>إضافة عميل جديد</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push("/ar/dashboard/customers-hub/add")}>
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة عميل يدوياً
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Upload className="ml-2 h-4 w-4" />
          استيراد من ملف
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>تصدير</DropdownMenuLabel>
        <DropdownMenuItem>
          <FileDown className="ml-2 h-4 w-4" />
          تصدير إلى Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
