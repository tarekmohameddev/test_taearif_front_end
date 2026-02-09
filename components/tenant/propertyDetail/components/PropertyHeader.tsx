"use client";

import { ShareIcon } from "lucide-react";

interface PropertyHeaderProps {
  transactionTypeLabel: string;
  primaryColor: string;
  onShareClick: () => void;
}

export function PropertyHeader({
  transactionTypeLabel,
  primaryColor,
  onShareClick,
}: PropertyHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1
        className="font-bold text-xs xs:text-sm leading-4 rounded-md text-white w-20 h-8 flex items-center justify-center md:text-xl lg:text-2xl md:w-28 md:h-11"
        style={{ backgroundColor: primaryColor }}
      >
        {transactionTypeLabel}
      </h1>
      <div className="sharesocials flex flex-row gap-x-6" dir="ltr">
        <button className="cursor-pointer" onClick={onShareClick}>
          <ShareIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
