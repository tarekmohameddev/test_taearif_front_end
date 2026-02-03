"use client";

import React from "react";
import useAssignmentStore from "@/context/store/assignment-rules";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface AssignmentDropdownProps {
  customerId: string;
  currentEmployeeId?: string;
  currentEmployeeName?: string;
  size?: "sm" | "default";
}

export function AssignmentDropdown({
  customerId,
  currentEmployeeId,
  currentEmployeeName,
  size = "sm",
}: AssignmentDropdownProps) {
  const { employees, assignCustomer, unassignCustomer } = useAssignmentStore();

  const handleAssign = (employeeId: string, employeeName: string) => {
    assignCustomer(customerId, employeeId);
    toast.success(`تم التعيين إلى ${employeeName}`);
  };

  const handleUnassign = () => {
    unassignCustomer(customerId);
    toast.success("تم إلغاء التعيين");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} className="gap-1 h-8 px-2">
          {currentEmployeeName ? (
            <span className="text-xs truncate max-w-[80px]">{currentEmployeeName}</span>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5" />
              <span className="text-xs">تعيين</span>
            </>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>تعيين إلى</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {employees.filter((e) => e.isActive).map((emp) => (
          <DropdownMenuItem
            key={emp.id}
            onClick={() => handleAssign(emp.id, emp.name)}
            className={currentEmployeeId === emp.id ? "bg-blue-50" : ""}
          >
            <div className="flex justify-between w-full">
              <span>{emp.name}</span>
              <span className="text-xs text-gray-400">
                {emp.customerCount}/{emp.maxCapacity}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        {currentEmployeeId && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleUnassign} className="text-red-600">
              <UserMinus className="h-4 w-4 ml-2" />
              إلغاء التعيين
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
