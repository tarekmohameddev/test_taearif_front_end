"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Eye, Edit, XCircle, Activity } from "lucide-react";
import type { Employee } from "../types";
import { formatDate, getInitials } from "../utils";
import { StatusBadge } from "./StatusBadge";

interface EmployeeTableRowProps {
  employee: Employee;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTableRow({ employee, onDelete }: EmployeeTableRowProps) {
  const router = useRouter();

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.photo ?? ""} />
            <AvatarFallback>
              {getInitials(employee.first_name, employee.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="text-sm text-gray-500">
              {employee.company_name ?? "بدون شركة"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          {employee.email}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          {employee.phone}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {employee.roles.map((role) => (
            <Badge key={role.id} variant="outline">
              {role.name}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={employee.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          {formatDate(employee.created_at)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/access-control/edit-employee/${employee.id}`)
            }
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(employee)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:border-red-800"
          >
            <XCircle className="h-4 w-4" />
            حذف
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/access-control/view-employee/${employee.id}`)
            }
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            عرض التفاصيل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `/dashboard/access-control/employee-activity/${employee.id}`
              )
            }
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            سجل الموظف
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
