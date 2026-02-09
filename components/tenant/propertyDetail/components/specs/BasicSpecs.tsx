import type { Property } from "../../types/types";
import { SpecItem } from "../SpecItem";

interface BasicSpecsProps {
  property: Property;
  textColor: string;
}

export const BasicSpecs = ({ property, textColor }: BasicSpecsProps) => {
  return (
    <>
      {/* غرف النوم */}
      {property.bedrooms > 0 ? (
        <SpecItem
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="غرف النوم"
          value={property.bedrooms}
          textColor={textColor}
        />
      ) : null}

      {/* الحمامات */}
      {property.bathrooms && property.bathrooms > 0 ? (
        <SpecItem
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="الحمامات"
          value={property.bathrooms}
          textColor={textColor}
        />
      ) : null}

      {/* المساحة */}
      {property.area && parseFloat(property.area) > 0 ? (
        <SpecItem
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="المساحة"
          value={`${property.area} م²`}
          textColor={textColor}
        />
      ) : null}

      {/* Size (إذا كان مختلف عن area) */}
      {property.size &&
        property.size !== property.area &&
        parseFloat(property.size) > 0 ? (
          <SpecItem
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="الحجم"
            value={`${property.size} م²`}
            textColor={textColor}
          />
        ) : null}

      {/* الطول */}
      {property.length && parseFloat(property.length) > 0 ? (
        <SpecItem
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="الطول"
          value={`${property.length} م`}
          textColor={textColor}
        />
      ) : null}

      {/* العرض */}
      {property.width && parseFloat(property.width) > 0 ? (
        <SpecItem
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="العرض"
          value={`${property.width} م`}
          textColor={textColor}
        />
      ) : null}

      {/* عدد الغرف */}
      {property.rooms && property.rooms > 0 ? (
        <SpecItem
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="عدد الغرف"
          value={property.rooms}
          textColor={textColor}
        />
      ) : null}
    </>
  );
};
