"use client";

import { Property } from "../types/types";

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="space-y-4">
      <p className="font-bold text-gray-600 text-xs xs:text-sm leading-4 md:text-2xl md:leading-7">
        {property.district}
      </p>
      <p className="font-bold text-gray-600 text-xl leading-6 md:leading-7">
        {property.title}
      </p>
      <p
        className="text-2xl leading-7 font-bold md:text-3xl lg:leading-9 flex items-center gap-2"
        style={{ color: "#000000" }}
      >
        {property.price}
        <img
          src="/Saudi_Riyal_Symbol.svg"
          alt="ريال سعودي"
          className="w-6 h-6"
          style={{
            filter: "brightness(0) saturate(100%)",
          }}
        />
      </p>
      <p className="text-gray-600 text-sm leading-6 font-normal md:text-base lg:text-xl lg:leading-7 whitespace-pre-line">
        {property.description || "لا يوجد وصف متاح لهذا العقار"}
      </p>
    </div>
  );
}
