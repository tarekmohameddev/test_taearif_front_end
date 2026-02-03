"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  UserPlus,
  Calendar,
  Bell,
  FileText,
  Home,
} from "lucide-react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";

interface QuickAddFABProps {
  onAddCustomer?: () => void;
  onAddAppointment?: () => void;
  onAddReminder?: () => void;
  onAddNote?: () => void;
  onAddProperty?: () => void;
}

export function QuickAddFAB({
  onAddCustomer,
  onAddAppointment,
  onAddReminder,
  onAddNote,
  onAddProperty,
}: QuickAddFABProps) {
  const [open, setOpen] = useState(false);
  const { setAddDialogOpen } = useUnifiedCustomersStore();

  const handleAddCustomer = () => {
    setOpen(false);
    if (onAddCustomer) {
      onAddCustomer();
    } else {
      setAddDialogOpen(true);
    }
  };

  const handleAction = (action: () => void | undefined) => {
    setOpen(false);
    if (action) {
      action();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className={`h-6 w-6 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="top"
          className="w-64 mb-2"
          dir="rtl"
        >
          <DropdownMenuLabel>إضافة سريعة</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleAddCustomer}
            className="cursor-pointer py-3"
          >
            <UserPlus className="h-5 w-5 ml-3 text-blue-600" />
            <div>
              <div className="font-medium">عميل جديد</div>
              <div className="text-xs text-gray-500">إضافة عميل محتمل</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction(onAddAppointment)}
            className="cursor-pointer py-3"
          >
            <Calendar className="h-5 w-5 ml-3 text-green-600" />
            <div>
              <div className="font-medium">موعد</div>
              <div className="text-xs text-gray-500">جدولة معاينة أو اجتماع</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction(onAddReminder)}
            className="cursor-pointer py-3"
          >
            <Bell className="h-5 w-5 ml-3 text-orange-600" />
            <div>
              <div className="font-medium">تذكير</div>
              <div className="text-xs text-gray-500">إضافة مهمة أو متابعة</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction(onAddNote)}
            className="cursor-pointer py-3"
          >
            <FileText className="h-5 w-5 ml-3 text-purple-600" />
            <div>
              <div className="font-medium">ملاحظة</div>
              <div className="text-xs text-gray-500">تسجيل ملاحظة سريعة</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction(onAddProperty)}
            className="cursor-pointer py-3"
          >
            <Home className="h-5 w-5 ml-3 text-red-600" />
            <div>
              <div className="font-medium">عقار</div>
              <div className="text-xs text-gray-500">إضافة عقار جديد</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tooltip on hover */}
      {!open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          إضافة سريعة
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
