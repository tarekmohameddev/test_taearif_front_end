"use client";

import { useEffect } from "react";
import PropertyFilter from "@/components/tenant/propertyFilter/propertyFilter1";
import FilterButtons from "@/components/tenant/filterButtons/filterButtons1";
import PropertyGrid from "@/components/tenant/grid/grid1";
import { usePropertiesStore } from "@/context/propertiesStore";

interface PropertiesPageProps {
  className?: string;
  tenantId?: string;
}

export default function PropertiesPage({ className, tenantId }: PropertiesPageProps) {
  // Store state
  const { transactionType, setTransactionType } = usePropertiesStore();

  // تعيين نوع المعاملة الافتراضي عند تحميل المكون
  useEffect(() => {
    // يمكن تعيين نوع المعاملة الافتراضي هنا إذا لزم الأمر
  }, []);

  return (
    <div className={`w-full ${className || ""}`}>
      {/* نموذج البحث والفلترة */}
      <PropertyFilter />

      {/* أزرار الفلتر */}
      <div className="mx-auto max-w-[1600px] px-4">
        <FilterButtons />
      </div>

      {/* شبكة العقارات */}
      <PropertyGrid tenantId={tenantId} />
    </div>
  );
}
