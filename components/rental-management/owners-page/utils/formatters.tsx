import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX } from "lucide-react";

export const formatDate = (dateString: string) => {
  if (!dateString) return "غير متوفر";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
        <UserCheck className="h-3 w-3 ml-1" />
        نشط
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
      <UserX className="h-3 w-3 ml-1" />
      غير نشط
    </Badge>
  );
};
