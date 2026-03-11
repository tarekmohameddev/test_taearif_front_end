"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, Loader2, TrendingUp } from "lucide-react";

interface AddEmployeeButtonProps {
  hasNoLimit: boolean;
  isAtLimit: boolean;
  isPurchasingAddon: boolean;
  onNavigateToCreate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPurchaseAddon: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AddEmployeeButton({
  hasNoLimit,
  isAtLimit,
  isPurchasingAddon,
  onNavigateToCreate,
  onPurchaseAddon,
}: AddEmployeeButtonProps) {
  if (hasNoLimit) {
    return (
      <Button
        type="button"
        className="bg-black hover:bg-gray-800 text-white"
        onClick={onNavigateToCreate}
      >
        <UserPlus className="h-4 w-4 ml-2" />
        إضافة موظف جديد
      </Button>
    );
  }

  if (isAtLimit) {
    return (
      <Button
        type="button"
        className="bg-orange-600 hover:bg-orange-700 text-white"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent?.stopImmediatePropagation?.();
          onPurchaseAddon(e);
        }}
        disabled={isPurchasingAddon}
      >
        {isPurchasingAddon ? (
          <>
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          <>
            <TrendingUp className="h-4 w-4 ml-2" />
            زيادة الحد المسموح
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      className="bg-black hover:bg-gray-800 text-white"
      onClick={onNavigateToCreate}
    >
      <UserPlus className="h-4 w-4 ml-2" />
      إضافة موظف جديد
    </Button>
  );
}
