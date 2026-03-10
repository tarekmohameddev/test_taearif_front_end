"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Employee } from "../types";
import { AddEmployeeButton } from "./AddEmployeeButton";
import { EmployeeTableRow } from "./EmployeeTableRow";

interface EmployeesTableProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  hasNoLimit: boolean;
  isAtLimit: boolean;
  isPurchasingAddon: boolean;
  onNavigateToCreate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPurchaseAddon: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDeleteEmployee: (employee: Employee) => void;
}

export function EmployeesTable({
  employees,
  loading,
  error,
  onRetry,
  hasNoLimit,
  isAtLimit,
  isPurchasingAddon,
  onNavigateToCreate,
  onPurchaseAddon,
  onDeleteEmployee,
}: EmployeesTableProps) {
  if (loading) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRetry} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              إجمالي الموظفين: {employees.length}
            </p>
            <div className="flex gap-2">
              <AddEmployeeButton
                hasNoLimit={hasNoLimit}
                isAtLimit={isAtLimit}
                isPurchasingAddon={isPurchasingAddon}
                onNavigateToCreate={onNavigateToCreate}
                onPurchaseAddon={onPurchaseAddon}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الموظف</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الهاتف</TableHead>
                <TableHead className="text-right">الأدوار</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <EmployeeTableRow
                  key={employee.id}
                  employee={employee}
                  onDelete={onDeleteEmployee}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
