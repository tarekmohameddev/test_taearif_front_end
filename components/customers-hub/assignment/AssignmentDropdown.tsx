"use client";

import React from "react";
import { useCustomersHubAssignment } from "@/hooks/useCustomersHubAssignment";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserMinus, ChevronDown } from "lucide-react";
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
  const { employees } = useCustomersHubAssignment();
  const { updateCustomer } = useUnifiedCustomersStore();

  const handleAssign = async (employeeId: string, employeeName: string) => {
    try {
      // Convert employeeId to number if it's a string representation of a number
      // Employee IDs from API are strings, but API expects number
      const employeeIdNum = typeof employeeId === 'string' 
        ? (employeeId.startsWith('emp_') 
            ? parseInt(employeeId.replace('emp_', '')) 
            : parseInt(employeeId))
        : employeeId;
      
      if (isNaN(employeeIdNum as number)) {
        toast.error("خطأ في معرف الموظف");
        return;
      }

      // Update customer with employee assignment
      await updateCustomer(customerId, {
        assignedEmployeeId: employeeId,
        assignedEmployee: {
          id: employeeId,
          name: employeeName,
        },
      });
      
      toast.success(`تم التعيين إلى ${employeeName}`);
    } catch (error) {
      console.error("Error assigning employee:", error);
      toast.error("حدث خطأ أثناء التعيين");
    }
  };

  const handleUnassign = async () => {
    try {
      await updateCustomer(customerId, {
        assignedEmployeeId: undefined,
        assignedEmployee: undefined,
      });
      toast.success("تم إلغاء التعيين");
    } catch (error) {
      console.error("Error unassigning employee:", error);
      toast.error("حدث خطأ أثناء إلغاء التعيين");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} className="gap-1 h-8 px-2">
          {currentEmployeeName ? (
            <span className="text-xs truncate max-w-[80px]">{currentEmployeeName}</span>
          ) : (
            <span className="text-xs text-gray-500">لا يوجد</span>
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
