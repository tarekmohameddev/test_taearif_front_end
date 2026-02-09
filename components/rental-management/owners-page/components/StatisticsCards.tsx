"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Building2 } from "lucide-react";
import { Owner } from "../types/owners.types";

interface StatisticsCardsProps {
  totalOwners: number;
  activeOwners: number;
  totalProperties: number;
}

export function StatisticsCards({
  totalOwners,
  activeOwners,
  totalProperties,
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الملاك</p>
              <p className="text-2xl font-bold text-gray-900">{totalOwners}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الملاك النشطون</p>
              <p className="text-2xl font-bold text-green-600">{activeOwners}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العقارات</p>
              <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
