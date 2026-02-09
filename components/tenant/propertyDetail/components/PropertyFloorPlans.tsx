"use client";

import { Property } from "../types/types";

interface PropertyFloorPlansProps {
  floorPlans: string[] | undefined;
  primaryColor: string;
  onImageClick: (imageSrc: string, index: number) => void;
}

export function PropertyFloorPlans({
  floorPlans,
  primaryColor,
  onImageClick,
}: PropertyFloorPlansProps) {
  if (!floorPlans || floorPlans.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col gap-y-6">
        <div className="mt-6">
          <h3
            className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
            style={{ backgroundColor: primaryColor }}
          >
            مخططات الأرضية
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {floorPlans.map((planImage, index) => (
              <div
                key={index}
                className="relative group"
                onClick={() => onImageClick(planImage, index)}
              >
                <img
                  src={planImage}
                  alt={`مخطط الأرضية ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
