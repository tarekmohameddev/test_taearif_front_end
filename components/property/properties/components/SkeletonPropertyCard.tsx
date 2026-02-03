"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function SkeletonPropertyCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-gray-300"></div>
      </div>
      <CardHeader className="p-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="h-8 w-full bg-gray-300 rounded"></div>
        <div className="h-8 w-full bg-gray-300 rounded"></div>
      </CardFooter>
    </Card>
  );
}
