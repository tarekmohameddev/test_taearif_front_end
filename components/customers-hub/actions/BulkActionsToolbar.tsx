"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  AlertTriangle,
  ChevronDown,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/unified-customer";

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCompleteAll: () => void;
  onDismissAll: () => void;
  onSnoozeAll: (until: string) => void;
  onAssignAll: (employeeId: string, employeeName: string) => void;
  onChangePriority: (priority: Priority) => void;
  isAllSelected: boolean;
  className?: string;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "urgent", label: "عاجل", color: "bg-red-100 text-red-700" },
  { value: "high", label: "مهم", color: "bg-orange-100 text-orange-700" },
  { value: "medium", label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  { value: "low", label: "منخفض", color: "bg-green-100 text-green-700" },
];

// Mock employees for assignment - in real app, this would come from API
const employees = [
  { id: "emp1", name: "أحمد محمد" },
  { id: "emp2", name: "فاطمة علي" },
  { id: "emp3", name: "محمد خالد" },
  { id: "emp4", name: "سارة أحمد" },
];

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onCompleteAll,
  onDismissAll,
  onSnoozeAll,
  onAssignAll,
  onChangePriority,
  isAllSelected,
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
        "rounded-2xl shadow-2xl px-4 py-3",
        "flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300",
        className
      )}
    >
      {/* Selection Info */}
      <div className="flex items-center gap-3 border-l pl-4 border-gray-200 dark:border-gray-700">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {selectedCount} محدد
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={isAllSelected ? onDeselectAll : onSelectAll}
          className="text-sm"
        >
          {isAllSelected ? "إلغاء تحديد الكل" : `تحديد الكل (${totalCount})`}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDeselectAll}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-2">
        {/* Complete All */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              إكمال الكل
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد إكمال الإجراءات</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من إكمال {selectedCount} إجراء؟ سيتم تحديث حالتها إلى "مكتمل".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={onCompleteAll}
                className="bg-green-600 hover:bg-green-700"
              >
                تأكيد الإكمال
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Snooze All */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="h-4 w-4" />
              تأجيل
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>تأجيل الإجراءات المحددة</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setHours(date.getHours() + 1);
                onSnoozeAll(date.toISOString());
              }}
            >
              ساعة واحدة
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setHours(date.getHours() + 4);
                onSnoozeAll(date.toISOString());
              }}
            >
              4 ساعات
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                onSnoozeAll(date.toISOString());
              }}
            >
              غداً
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                onSnoozeAll(date.toISOString());
              }}
            >
              الأسبوع القادم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assign All */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              تعيين
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>تعيين إلى موظف</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {employees.map((emp) => (
              <DropdownMenuItem
                key={emp.id}
                onClick={() => onAssignAll(emp.id, emp.name)}
              >
                {emp.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Change Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              الأولوية
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>تغيير الأولوية</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {priorityOptions.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                onClick={() => onChangePriority(priority.value)}
              >
                <Badge className={cn("mr-2", priority.color)}>
                  {priority.label}
                </Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dismiss All */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              رفض الكل
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد رفض الإجراءات</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رفض {selectedCount} إجراء؟ هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDismissAll}
                className="bg-red-600 hover:bg-red-700"
              >
                تأكيد الرفض
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
