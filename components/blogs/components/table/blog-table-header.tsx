/**
 * Blog Table Header Component
 * 
 * @description رأس الجدول (الأعمدة)
 * 
 * @dependencies
 * - Uses: components/ui/table (TableHeader, TableRow, TableHead)
 * - Used by: components/table/blog-table.tsx
 * 
 * @related
 * - blog-table.tsx (الجدول الرئيسي)
 */

import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

export function BlogTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[60px]">الصورة</TableHead>
        <TableHead>العنوان</TableHead>
        <TableHead>الحالة</TableHead>
        <TableHead className="hidden md:table-cell">تاريخ النشر</TableHead>
        <TableHead className="hidden lg:table-cell">المشاهدات</TableHead>
        <TableHead className="w-[80px]">الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
  );
}
