import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PiHandTapLight } from "react-icons/pi";
import { StatCardProps } from "../types";

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  onClick,
  loading,
}: StatCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group relative"
      onClick={onClick}
    >
      {/* العلامة في الزاوية السفلية اليسرى */}
      <div
        className={`absolute top-3 left-3 h-6 w-6 ${bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
      >
        <PiHandTapLight
          className="h-3 w-3 text-gray-500"
          style={{
            animation: "scaleAnimation 1s ease-in-out 7",
            animationFillMode: "forwards",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes scaleAnimation {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-400">جاري التحميل...</span>
              </div>
            ) : (
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            )}
          </div>
          <div
            className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
