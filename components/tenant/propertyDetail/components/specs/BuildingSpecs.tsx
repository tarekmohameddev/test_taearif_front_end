import type { Property } from "../../types/types";
import { SpecItem } from "../SpecItem";

interface BuildingSpecsProps {
  property: Property;
  textColor: string;
}

export const BuildingSpecs = ({ property, textColor }: BuildingSpecsProps) => {
  return (
    <>
      {/* المسبح */}
      {property.swimming_pool && property.swimming_pool > 0 ? (
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="المسبح"
          value={property.swimming_pool}
          textColor={textColor}
        />
      ) : null}

      {/* الشرفات */}
      {property.balcony && property.balcony > 0 ? (
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
          label="الشرفات"
          value={property.balcony}
          textColor={textColor}
        />
      ) : null}

      {/* الحديقة */}
      {property.garden && property.garden > 0 ? (
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="الحديقة"
          value={property.garden}
          textColor={textColor}
        />
      ) : null}

      {/* المصعد */}
      {property.elevator && property.elevator > 0 ? (
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          label="المصعد"
          value={property.elevator}
          textColor={textColor}
        />
      ) : null}

      {/* موقف السيارات */}
      {property.private_parking && property.private_parking > 0 ? (
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
          label="موقف سيارات"
          value={property.private_parking}
          textColor={textColor}
        />
      ) : null}

      {/* الملحق */}
      {property.annex && property.annex > 0 ? (
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
          label="الملحق"
          value={property.annex}
          textColor={textColor}
        />
      ) : null}

      {/* عدد الطوابق */}
      {property.floors && property.floors > 0 ? (
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
          label="عدد الطوابق"
          value={property.floors}
          textColor={textColor}
        />
      ) : null}

      {/* رقم الطابق */}
      {property.floor_number !== undefined &&
        property.floor_number !== null ? (
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
            label="رقم الطابق"
            value={property.floor_number}
            textColor={textColor}
          />
        ) : null}

      {/* عمر العقار */}
      {property.building_age !== undefined &&
        property.building_age !== null ? (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="عمر العقار"
            value={
              property.building_age === 0
                ? "جديد"
                : `${property.building_age} سنة`
            }
            textColor={textColor}
          />
        ) : null}

      {/* نوع الواجهة */}
      {property.facade_name &&
        property.facade_name.trim() !== "" ? (
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
            label="نوع الواجهة"
            value={property.facade_name}
            textColor={textColor}
          />
        ) : null}

      {/* المبنى */}
      {property.building &&
        property.building !== null &&
        property.building.trim() !== "" ? (
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
            label="المبنى"
            value={property.building}
            textColor={textColor}
          />
        ) : null}
    </>
  );
};
