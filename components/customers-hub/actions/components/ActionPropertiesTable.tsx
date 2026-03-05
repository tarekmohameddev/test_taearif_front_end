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

  return (
    <div
      className={cn(
        "mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 max-w-[250px]",
        className
      )}
    >
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="text-muted-foreground border-b border-gray-200 dark:border-gray-700">
            <th className="text-right py-1 px-1.5 font-medium">العنوان</th>
            <th className="text-right py-1 px-1.5 font-medium">المدينة</th>
            <th className="text-right py-1 px-1.5 font-medium">الحي</th>
            <th className="text-right py-1 px-1.5 font-medium">السعر</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {properties.map((prop, i) => (
            <tr
              key={prop.id ?? `prop-${i}`}
              role="button"
              tabIndex={0}
              className={cn(
                "border-b border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              )}
              onClick={(e) => handleRowClick(e, prop.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(e as unknown as React.MouseEvent, prop.id);
                }
              }}
            >
              <td className="py-1 px-1.5">{prop.title ?? "—"}</td>
              <td className="py-1 px-1.5">{prop.city ?? "—"}</td>
              <td className="py-1 px-1.5">{prop.district ?? "—"}</td>
              <td className="py-1 px-1.5 dir-ltr">
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
