"use client";

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import JobForm1 from "@/components/tenant/jobForm/jobForm1";
import Header from "@/components/tenant/header/Header";
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
                اختبار المكونات
              </h1>
              <p className="text-muted-foreground">
                صفحة اختبار للمكونات المختلفة
              </p>
            </div>
            
            {/* Header Component Test */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">مكون Header</h2>
              <div className="border rounded-lg overflow-hidden">
                <Header 
                  title="موقعي الإلكتروني"
                  showMenu={true}
                />
              </div>
            </div>

            {/* Job Form Component */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                نموذج التقديم للوظيفة
              </h2>
              <p className="text-muted-foreground mb-4">
                نموذج تجريبي لتقديم طلبات الوظائف مع رفع ملف السيرة الذاتية
              </p>
              <JobForm1 useStore={false} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
