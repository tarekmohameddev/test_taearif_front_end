"use client";

import { Clock, CheckCircle, Users, MessageCircle } from "lucide-react";
import type { AIStats } from "../types";

interface AIResponderStatsCardsProps {
  stats: AIStats;
}

export function AIResponderStatsCards({ stats }: AIResponderStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-500">ردود اليوم</p>
          <p className="text-2xl font-bold text-black mt-0.5">{stats.totalResponses24h}</p>
        </div>
        <MessageCircle className="h-9 w-9 text-gray-200" aria-hidden />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-500">وقت الرد</p>
          <p className="text-2xl font-bold text-black mt-0.5">{stats.avgResponseTime}ث</p>
        </div>
        <Clock className="h-9 w-9 text-gray-200" aria-hidden />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-500">رضا العملاء</p>
          <p className="text-2xl font-bold text-black mt-0.5">{stats.satisfactionRate}%</p>
        </div>
        <CheckCircle className="h-9 w-9 text-gray-200" aria-hidden />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-500">تحويل لموظف</p>
          <p className="text-2xl font-bold text-black mt-0.5">{stats.handoffRate}%</p>
        </div>
        <Users className="h-9 w-9 text-gray-400" aria-hidden />
      </div>
    </div>
  );
}
