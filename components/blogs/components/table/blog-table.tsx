/**
 * Blog Table Component
 * 
 * @description جدول المقالات الرئيسي
 * 
 * @dependencies
 * - Uses: components/table/blog-table-header.tsx (رأس الجدول)
 * - Uses: components/table/blog-table-row.tsx (صف واحد)
 * - Uses: components/shared/blog-loading-state.tsx (حالة التحميل)
 * - Uses: components/shared/blog-empty-state.tsx (حالة فارغة)
 * - Used by: components/blogs/blogs-list-page.tsx
 * 
 * @props
 * - blogs: BlogListItem[] (قائمة المقالات)
 * - loading: boolean (حالة التحميل)
 * - pagination: Pagination | null (معلومات الصفحات)
 * - onPageChange: (page: number) => void (دالة تغيير الصفحة)
 * - onEdit: (id: number) => void (دالة التعديل)
 * - onDelete: (id: number) => void (دالة الحذف)
 * - onView: (id: number) => void (دالة العرض)
 * 
 * @related
 * - types/blog.types.ts (BlogListItem, Pagination)
 * - components/blogs/blogs-list-page.tsx (الصفحة الرئيسية)
 */

"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination2";
import { BlogTableHeader } from "./blog-table-header";
import { BlogTableRow } from "./blog-table-row";
import { BlogLoadingState } from "../shared/blog-loading-state";
import { BlogEmptyState } from "../shared/blog-empty-state";
import type { BlogListItem, Pagination as PaginationType } from "../../types/blog.types";

interface BlogTableProps {
  blogs: BlogListItem[];
  loading: boolean;
  pagination: PaginationType | null;
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function BlogTable({
  blogs,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}: BlogTableProps) {
  if (loading) {
    return <BlogLoadingState type="table" />;
  }

  if (blogs.length === 0) {
    return <BlogEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* الجدول */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <BlogTableHeader />
          <TableBody>
            {blogs.map((blog) => (
              <BlogTableRow
                key={blog.id}
                blog={blog}
                onEdit={() => onEdit(blog.id)}
                onDelete={() => onDelete(blog.id)}
                onView={() => onView(blog.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page > 1) {
                    onPageChange(pagination.current_page - 1);
                  }
                }}
                className={
                  pagination.current_page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={pagination.current_page === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page < pagination.last_page) {
                    onPageChange(pagination.current_page + 1);
                  }
                }}
                className={
                  pagination.current_page === pagination.last_page
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
