"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnalyticsDashboard } from "@/components/customers-hub/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/ar/dashboard/customers-hub">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تحليلات العملاء
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              رؤى شاملة عن أداء المبيعات والعملاء
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  );
}
