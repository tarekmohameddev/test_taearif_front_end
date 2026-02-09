import type { Property } from "../../types/types";
import { SpecItem } from "../SpecItem";

interface LocationSpecsProps {
  property: Property;
  textColor: string;
}

export const LocationSpecs = ({ property, textColor }: LocationSpecsProps) => {
  return (
    <>
      {/* عرض الشارع الشمالي */}
      {property.street_width_north &&
        parseFloat(property.street_width_north) > 0 ? (
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="عرض الشارع الشمالي"
            value={`${property.street_width_north} م`}
            textColor={textColor}
          />
        ) : null}

      {/* عرض الشارع الجنوبي */}
      {property.street_width_south &&
        parseFloat(property.street_width_south) > 0 ? (
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="عرض الشارع الجنوبي"
            value={`${property.street_width_south} م`}
            textColor={textColor}
          />
        ) : null}

      {/* عرض الشارع الشرقي */}
      {property.street_width_east &&
        parseFloat(property.street_width_east) > 0 ? (
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="عرض الشارع الشرقي"
            value={`${property.street_width_east} م`}
            textColor={textColor}
          />
        ) : null}

      {/* عرض الشارع الغربي */}
      {property.street_width_west &&
        parseFloat(property.street_width_west) > 0 ? (
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="عرض الشارع الغربي"
            value={`${property.street_width_west} م`}
            textColor={textColor}
          />
        ) : null}
    </>
  );
};
