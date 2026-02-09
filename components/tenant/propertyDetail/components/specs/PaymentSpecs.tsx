import type { Property } from "../../types/types";
import { SpecItem } from "../SpecItem";

interface PaymentSpecsProps {
  property: Property;
  textColor: string;
}

export const PaymentSpecs = ({ property, textColor }: PaymentSpecsProps) => {
  return (
    <>
      {/* طريقة الدفع */}
      {property.payment_method &&
        property.payment_method.trim() !== "" ? (
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="طريقة الدفع"
            value={property.payment_method}
            textColor={textColor}
          />
        ) : null}

      {/* السعر للمتر */}
      {property.pricePerMeter &&
        parseFloat(property.pricePerMeter) > 0 ? (
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            label="السعر للمتر"
            value={`${property.pricePerMeter} ريال`}
            textColor={textColor}
          />
        ) : null}
    </>
  );
};
