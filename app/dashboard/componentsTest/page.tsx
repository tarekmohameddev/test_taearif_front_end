"use client";

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { JobForm } from "@/components/job-form/job-form";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                نموذج التقديم للوظيفة
              </h1>
              <p className="text-muted-foreground">
                نموذج تجريبي لتقديم طلبات الوظائف مع رفع ملف السيرة الذاتية
              </p>
            </div>
            <JobForm />
          </div>
        </main>
      </div>
    </div>
  );
}
