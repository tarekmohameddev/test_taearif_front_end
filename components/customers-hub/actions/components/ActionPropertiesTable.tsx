"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ActionPropertyRow {
  id: number;
  title?: string;
  address?: string;
  slug?: string;
  price?: number;
  featuredImage?: string;
  district?: string;
  city?: string;
  propertyType?: string;
  area?: number;
  size?: string | null;
  listingType?: string;
  listingTypeLabel?: string;
}

interface ActionPropertiesTableProps {
  properties?: ActionPropertyRow[];
  className?: string;
}

export function ActionPropertiesTable({
  properties = [],
  className = "",
}: ActionPropertiesTableProps) {
  const router = useRouter();
  const hasProperties = Array.isArray(properties) && properties.length > 0;
  if (!hasProperties) return null;

  const handleRowClick = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    router.push(`/dashboard/properties/${propertyId}`);
  };

  const displaySize = (prop: ActionPropertyRow) =>
    prop.size ?? (prop.area != null ? `${prop.area} م²` : null);

  return (
    <div
      className={cn(
        "mt-3 p-2.5 rounded-lg w-full max-w-[500px] overflow-x-auto",
        "bg-white/85 dark:bg-gray-800/90 border border-gray-200/90 dark:border-gray-600/90",
        "border-r-2 border-r-stone-400/80 dark:border-r-stone-600/80",
        "shadow-sm",
        className
      )}
    >
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 pb-1 border-b border-gray-200 dark:border-gray-600">
        العقارات
      </p>
      <table className="w-full text-xs border-collapse min-w-[420px]">
        <thead>
          <tr className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">العنوان</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">العنوان التفصيلي</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">نوع العقار</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">المساحة</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">نوع العرض</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">المدينة</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">الحي</th>
            <th className="text-right py-1.5 px-1.5 font-semibold whitespace-nowrap">السعر</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {properties.map((prop, i) => (
            <tr
              key={prop.id ?? `prop-${i}`}
              role="button"
              tabIndex={0}
              className={cn(
                "border-b border-gray-100 dark:border-gray-700/50 cursor-pointer",
                "hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors"
              )}
              onClick={(e) => handleRowClick(e, prop.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(e as unknown as React.MouseEvent, prop.id);
                }
              }}
            >
              <td className="py-1 px-1.5 max-w-[120px] truncate" title={prop.title ?? undefined}>{prop.title ?? "—"}</td>
              <td className="py-1 px-1.5 max-w-[120px] truncate" title={prop.address ?? undefined}>{prop.address ?? "—"}</td>
              <td className="py-1 px-1.5 whitespace-nowrap">{prop.propertyType ?? "—"}</td>
              <td className="py-1 px-1.5 dir-ltr whitespace-nowrap">{displaySize(prop) ?? "—"}</td>
              <td className="py-1 px-1.5 whitespace-nowrap">{prop.listingTypeLabel ?? "—"}</td>
              <td className="py-1 px-1.5 whitespace-nowrap">{prop.city ?? "—"}</td>
              <td className="py-1 px-1.5 whitespace-nowrap">{prop.district ?? "—"}</td>
              <td className="py-1 px-1.5 dir-ltr whitespace-nowrap">
                {prop.price != null
                  ? `${Number(prop.price).toLocaleString()} ر.س`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
