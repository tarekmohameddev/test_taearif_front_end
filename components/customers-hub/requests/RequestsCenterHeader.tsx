"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, PlusCircle } from "lucide-react";

export function RequestsCenterHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <MessageSquare className="h-6 w-6" />
          </div>
          مركز طلبات العملاء
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          إدارة الطلبات الواردة والإجراءات في مكان واحد
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/customers-hub/requests/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            إنشاء طلب عقاري
          </Button>
        </Link>
        <Link href="/ar/dashboard/customers-hub/list">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            العملاء
          </Button>
        </Link>
      </div>
    </div>
  );
}
