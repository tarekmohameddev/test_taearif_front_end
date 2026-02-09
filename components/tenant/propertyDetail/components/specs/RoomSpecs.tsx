import type { Property } from "../../types/types";
import { SpecItem } from "../SpecItem";

interface RoomSpecsProps {
  property: Property;
  textColor: string;
}

export const RoomSpecs = ({ property, textColor }: RoomSpecsProps) => {
  return (
    <>
      {/* المطابخ */}
      {property.kitchen && property.kitchen > 0 ? (
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="المطابخ"
          value={property.kitchen}
          textColor={textColor}
        />
      ) : null}

      {/* الصالات */}
      {property.living_room && property.living_room > 0 ? (
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
          label="الصالات"
          value={property.living_room}
          textColor={textColor}
        />
      ) : null}

      {/* المجالس */}
      {property.majlis && property.majlis > 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="المجالس"
          value={property.majlis}
          textColor={textColor}
        />
      ) : null}

      {/* غرف الطعام */}
      {property.dining_room && property.dining_room > 0 ? (
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
          label="غرف الطعام"
          value={property.dining_room}
          textColor={textColor}
        />
      ) : null}

      {/* غرف الخادمة */}
      {property.maid_room && property.maid_room > 0 ? (
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="غرف الخادمة"
          value={property.maid_room}
          textColor={textColor}
        />
      ) : null}

      {/* غرف السائق */}
      {property.driver_room && property.driver_room > 0 ? (
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="غرف السائق"
          value={property.driver_room}
          textColor={textColor}
        />
      ) : null}

      {/* غرف التخزين */}
      {property.storage_room && property.storage_room > 0 ? (
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="غرف التخزين"
          value={property.storage_room}
          textColor={textColor}
        />
      ) : null}

      {/* القبو */}
      {property.basement && property.basement > 0 ? (
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
          label="القبو"
          value={property.basement}
          textColor={textColor}
        />
      ) : null}
    </>
  );
};
