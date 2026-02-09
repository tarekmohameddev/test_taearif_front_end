"use client";

import { ReactNode } from "react";

interface PropertyDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  primaryColor: string;
}

export function PropertyDetailItem({
  icon,
  label,
  value,
  primaryColor,
}: PropertyDetailItemProps) {
  return (
    <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
      <div className="flex flex-row gap-x-2">
        <div style={{ color: primaryColor }}>{icon}</div>
        <p
          className="font-normal text-xs xs:text-sm md:text-base leading-4"
          style={{ color: primaryColor }}
        >
          {label}:
        </p>
      </div>
      <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
        {value}
      </p>
    </div>
  );
}
