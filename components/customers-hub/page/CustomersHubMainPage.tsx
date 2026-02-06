"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  KanbanSquare,
  BarChart3,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const hubPages = [
  {
    id: "requests",
    title: "مركز الطلبات",
    description: "إدارة ومتابعة جميع طلبات العملاء والإجراءات المطلوبة",
    icon: MessageSquare,
    href: "/ar/dashboard/customers-hub/requests",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "list",
    title: "قائمة العملاء",
    description: "عرض وإدارة جميع العملاء مع إمكانيات البحث والتصفية المتقدمة",
    icon: Users,
    href: "/ar/dashboard/customers-hub/list",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "pipeline",
    title: "Pipeline",
    description: "لوحة Kanban لإدارة مراحل المبيعات ونقل العملاء بين المراحل",
    icon: KanbanSquare,
    href: "/ar/dashboard/customers-hub/pipeline",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "analytics",
    title: "التحليلات",
    description: "رؤى شاملة وإحصائيات مفصلة عن أداء المبيعات والعملاء",
    icon: BarChart3,
    href: "/ar/dashboard/customers-hub/analytics",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "ai-assistant",
    title: "المساعد الذكي",
    description: "استخدم الذكاء الاصطناعي للحصول على توصيات ومساعدة في إدارة العملاء",
    icon: Sparkles,
    href: "/ar/dashboard/customers-hub/ai-assistant",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export default function CustomersHubMainPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/ar/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للوحة التحكم
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Customers Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            مركز إدارة العملاء والمبيعات - اختر القسم الذي تريد الوصول إليه
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.id} href={page.href}>
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-2 hover:border-gray-300 dark:hover:border-gray-600">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-xl ${page.iconBg} flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${page.iconColor}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                      {page.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            اختر القسم المناسب للبدء في إدارة عملائك ومتابعة مبيعاتك
          </p>
        </div>
      </div>
    </div>
  );
}
