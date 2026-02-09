"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  MoreVertical,
  Eye,
  Edit,
  Link2,
  ListChecks,
  Trash2,
} from "lucide-react";
import { Owner } from "../types/owners.types";
import { formatDate, getStatusBadge } from "../utils/formatters";

interface OwnerRowProps {
  owner: Owner;
  index: number;
  onViewDetails: (owner: Owner) => void;
  onEdit: (owner: Owner) => void;
  onAssignProperties: (owner: Owner) => void;
  onViewProperties: (owner: Owner) => void;
  onDelete: (owner: Owner) => void;
}

export function OwnerRow({
  owner,
  index,
  onViewDetails,
  onEdit,
  onAssignProperties,
  onViewProperties,
  onDelete,
}: OwnerRowProps) {
  return (
    <tr
      className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:shadow-sm ${
        index % 2 === 0 ? "bg-white" : "bg-gray-25"
      }`}
    >
      {/* المالك */}
      <td className="px-6 py-5">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {owner.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2) || "??"}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-gray-900 truncate">
              {owner.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              رقم الهوية: {owner.id_number || "غير متوفر"}
            </div>
          </div>
        </div>
      </td>

      {/* معلومات الاتصال */}
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-700">
            <Phone className="h-3 w-3 ml-2 text-gray-400" />
            {owner.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500 truncate max-w-[200px]">
            <Mail className="h-3 w-3 ml-2 text-gray-400" />
            {owner.email}
          </div>
        </div>
      </td>

      {/* الموقع */}
      <td className="px-6 py-5">
        <div className="text-sm text-gray-700">
          <div className="flex items-center mb-1">
            <MapPin className="h-3 w-3 ml-1 text-gray-400" />
            {owner.city || "غير محدد"}
          </div>
          {owner.address && (
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {owner.address}
            </div>
          )}
        </div>
      </td>

      {/* العقارات */}
      <td className="px-6 py-5">
        <div className="text-sm">
          <div className="flex items-center">
            <Building2 className="h-4 w-4 ml-2 text-purple-500" />
            <span className="font-semibold text-gray-900">
              {owner.properties?.length || 0}
            </span>
            <span className="text-gray-500 mr-1">عقار</span>
          </div>
        </div>
      </td>

      {/* الحالة */}
      <td className="px-6 py-5">{getStatusBadge(owner.is_active)}</td>

      {/* تاريخ التسجيل */}
      <td className="px-6 py-5">
        <div className="text-sm text-gray-700">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 ml-2 text-gray-400" />
            {formatDate(owner.created_at)}
          </div>
          {owner.last_login_at && (
            <div className="text-xs text-gray-500 mt-1">
              آخر دخول: {formatDate(owner.last_login_at)}
            </div>
          )}
        </div>
      </td>

      {/* الإجراءات */}
      <td className="px-6 py-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              data-dropdown
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-right">
            <DropdownMenuItem
              onClick={() => onViewDetails(owner)}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 ml-2" />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(owner)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAssignProperties(owner)}
              className="cursor-pointer"
            >
              <Link2 className="h-4 w-4 ml-2" />
              ربط عقارات بالمالك
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onViewProperties(owner)}
              className="cursor-pointer"
            >
              <ListChecks className="h-4 w-4 ml-2" />
              عرض العقارات المرتبطة
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(owner)}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
